import jwt
import base64
from django.core.cache import cache
from django_otp.oath import TOTP
from django_otp.util import random_hex
from django.core.mail import send_mail
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow staff members to access.
    """

    def has_permission(self, request, view):
        # Grant access only if the user is a staff member
        return request.user and request.user.role == "administrator"

class IsAdminOrManager(permissions.BasePermission):
    """
    Custom permission to only allow staff members to access.
    """

    def has_permission(self, request, view):
        # Grant access only if the user is a staff member
        return request.user and (request.user.role == 'administrator' or request.user.role == 'manager')

class SafeJWTAuthentication(BaseAuthentication):
    '''
        custom authentication class for DRF and JWT
        https://github.com/encode/django-rest-framework/blob/master/rest_framework/authentication.py
    '''

    def authenticate(self, request):

            User = get_user_model()
            authorization_header = request.headers.get('Authorization')

            if not authorization_header:
                return None
            try:
                # header = 'Token xxxxxxxxxxxxxxxxxxxxxxxx'
                access_token = authorization_header.split(' ')[1]
                payload = jwt.decode(
                    access_token, settings.SECRET_KEY, algorithms=['HS256'])

            except jwt.ExpiredSignatureError:
                raise exceptions.AuthenticationFailed('Token expired')
            except IndexError:
                raise exceptions.AuthenticationFailed('Token missing')

            user = User.objects.filter(_id=payload['user_id']).first()

            if user is None:
                raise exceptions.AuthenticationFailed('User not found')

            if not user.is_active:
                raise exceptions.AuthenticationFailed('Your account is disabled')

            return (user, None)
    
def send_otp_via_email(user_email):
    key = random_hex(20)
    key_bytes = base64.b32encode(key.encode('utf-8'))

    totp = TOTP(key=key_bytes, step=300, digits=6)
    otp = totp.token()

    cache_key = f"otp_{user_email}"
    cache.set(cache_key, otp, timeout=300)

    send_mail(
        subject='Your Password Reset Code',
        message=f'Your code is {otp}. It expires in 5 minutes.',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user_email],
        fail_silently=True,
    )
    
    return otp  # We return OTP here just for reference; in production, you would not log or display this

def validate_otp(user_email, submitted_otp):
    cache_key = f"otp_{user_email}"
    otp_from_cache = cache.get(cache_key)

    if otp_from_cache == int(submitted_otp):
        cache.delete(cache_key)  # Clear OTP from cache after successful verification
        return True

    return False