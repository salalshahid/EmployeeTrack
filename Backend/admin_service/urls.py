# admin_service/urls.py
from django.urls import path
from .views import  ToggleAccountStatusView, ChangeUserRoleView

urlpatterns = [
    path('toggle-account-status/<uuid:user_id>/', ToggleAccountStatusView.as_view(), name='toggle-account-status'),
    path('change-role/<uuid:user_id>/', ChangeUserRoleView.as_view(), name='change-user-role'),
]