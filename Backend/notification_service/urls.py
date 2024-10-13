# notifications/urls.py
from django.urls import path
from .views import NotificationViewSet, SendLogSubmissionReminderView

urlpatterns = [
    # Using as_view to handle different methods on the same endpoint
    path('', NotificationViewSet.as_view({
        'get': 'list',  # GET requests to /notifications/ are handled by the 'list' action
        'post': 'create'  # POST requests to /notifications/ are handled by the 'create' action
    }), name='notification-list'),
    path('remind-employee/<uuid:pk>/', SendLogSubmissionReminderView.as_view(), name='reminder-notification-log-submission'),
    path('<uuid:pk>/', NotificationViewSet.as_view({
        'get': 'retrieve',  # GET requests to /notifications/{pk} are handled by the 'retrieve' action
        'put': 'update',  # PUT requests to /notifications/{pk} are handled by the 'update' action
        'patch': 'partial_update',  # PATCH requests are handled by the 'partial_update' action
        'delete': 'destroy'  # DELETE requests to /notifications/{pk} are handled by the 'destroy' action
    }), name='notification-detail'),
]