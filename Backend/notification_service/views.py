# notifications/views.py
from datetime import timezone
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, views, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from user_service.auth import IsAdmin, IsAdminOrManager
from .models import Notification, TimesheetReminder
from .serializers import NotificationSerializer, TimesheetReminderSerializer

User = get_user_model()

class NotificationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This should return a list of all the notifications
        for the currently authenticated user.
        """
        user = self.request.user
        user.reset_unread_count()  # Reset the unread notifications counter when fetched
        user.save()  # Make sure to save the user object after updating
        return Notification.objects.filter(recipient=user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        """
        Overriding the list method to reset unread notifications count when listing notifications.
        """
        response = super(NotificationViewSet, self).list(request, *args, **kwargs)
        request.user.reset_unread_count()  # Reset unread notifications on list retrieval
        request.user.save()
        return response

    def destroy(self, request, *args, **kwargs):
        """
        Ensure users can only delete their own notifications.
        """
        notification = get_object_or_404(Notification, _id=kwargs['pk'], recipient=request.user)
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class TimesheetReminderListCreateView(generics.ListCreateAPIView):
    queryset = TimesheetReminder.objects.all()
    serializer_class = TimesheetReminderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ApprovalNotificationView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        message = request.data.get('message', 'You have pending timesheet approvals.')
        
        try:
            user = User.objects.get(_id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        notification = Notification.objects.create(
            recipient=user,
            type='approval',
            message=message
        )
        return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)

class SendLogSubmissionReminderView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request, pk, *args, **kwargs):
        user = get_object_or_404(User, pk=pk)
        user.save()
        user.send_notification('timesheet_reminder', 'Please upload your logs.')
        return Response({"message": "Timesheet reminders sent."}, status=status.HTTP_200_OK)