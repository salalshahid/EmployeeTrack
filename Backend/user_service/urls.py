from django.urls import path
from .views import AccountActivationView, ChangePasswordView, ProfilePictureView, SetNewPasswordView, SignUpView, LoginView, ProfileView, UserListView, RequestPasswordReset, VerifyOTPView
urlpatterns = [
    path('', UserListView.as_view(), name='users-list'),
    path('signup/', SignUpView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('profile-picture/', ProfilePictureView.as_view(), name='profile-picture'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('account-activation/', AccountActivationView.as_view(), name='account-activation'),
    path('password-reset-request/', RequestPasswordReset.as_view(), name='password-reset-request'),
    path('verify-otp/', VerifyOTPView.as_view(), name='password-reset-request'),
    path('set-new-password/', SetNewPasswordView.as_view(), name='password-reset-request'),
]
