from .models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
import cloudinary.uploader

class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, validators=[validate_password])
    full_name = serializers.CharField(required=True, write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default=User.EMPLOYEE)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('_id','email', 'password', 'full_name', 'role', 'profile_picture')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        role = validated_data.get('role', User.EMPLOYEE)
        full_name = validated_data['full_name']
        profile_picture = validated_data.get('profile_picture')

        # Upload profile picture to Cloudinary if provided
        profile_picture_url = None
        if profile_picture:
            upload_result = cloudinary.uploader.upload(profile_picture)
            profile_picture_url = upload_result.get('url')

        user = User.objects.create_user(username=email, email=email, password=password, full_name=full_name, role=role, profile_picture=profile_picture_url)

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

class SetNewPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('_id', 'email', 'full_name', 'role', 'is_active')

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate_old_password(self, value):
        # You can add custom validation for old password here if needed
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance