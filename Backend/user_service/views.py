from django.http import JsonResponse
from .auth import send_otp_via_email, validate_otp
from rest_framework import status, views, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .utils import generate_access_token
from .serializers import SetNewPasswordSerializer, SignUpSerializer, LoginSerializer, ChangePasswordSerializer, UserProfileSerializer
import cloudinary.uploader

User = get_user_model()

class SignUpView(views.APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(data={"message": "success"}, status=status.HTTP_201_CREATED)        
        else:
            print(serializer.errors)  # Debug print to see the errors
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = self.authenticate(email=email, password=password)
            if user:
                if user.is_active:
                    access_token = generate_access_token(user)
                    
                    return Response({
                        'access': access_token,
                        'user': {
                            'user_id': user._id,
                            'email': user.email,
                            'full_name': user.full_name,
                            'role': user.role,
                            'profile_picture': user.profile_picture,
                            'unread_notifications': user.unread_notifications or 0
                        }
                    }, status=status.HTTP_200_OK)
                
                else:
                    return Response({"message": "Your account has been disabled by the admin"}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"message": "Email or password is incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def authenticate(self, email, password):
        try:
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                return user

        except User.DoesNotExist:
            return None

class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"detail": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password changed successfully"}, status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        # Filter users by role 'employee'
        return User.objects.all()

from rest_framework_simplejwt.exceptions import TokenError

class ProfilePictureView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        try:
            # Ensure the user object is available after authentication
            user = request.user
            profile_picture = request.FILES.get('profile_picture')

            if profile_picture:
                # Upload the profile picture to Cloudinary
                upload_result = cloudinary.uploader.upload(profile_picture)
                cloudinary_profile_picture_url = upload_result.get('url')
                # Assign the Cloudinary URL to the profile_picture field of the user model
                user.profile_picture = cloudinary_profile_picture_url
                user.save()
                return Response({'profile_picture': cloudinary_profile_picture_url}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

class RequestPasswordReset(views.APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            send_otp_via_email(email)
            return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)
        return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
    
class AccountActivationView(views.APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if not user:
            send_otp_via_email(email)
            return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)
        return Response({"message": "User with this email already exists."}, status=status.HTTP_404_NOT_FOUND)

class VerifyOTPView(views.APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')
        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        if validate_otp(email, otp):
            return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid OTP or OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

class SetNewPasswordView(views.APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = User.objects.get(email=email)
                user.set_password(password)
                user.save()
                return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

