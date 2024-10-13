import datetime
import jwt
from django.conf import settings

def generate_access_token(user):
    payload = {
        'user_id': user._id,
        'iat': datetime.datetime.utcnow(),
    }
    access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return access_token