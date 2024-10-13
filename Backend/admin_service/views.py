# admin_service/views.py
from django.shortcuts import get_object_or_404
from rest_framework import status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from user_service.auth import IsAdmin
from user_service.models import User

class ToggleAccountStatusView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id, *args, **kwargs):
        # Get the 'status' field from the request data
        status_from_request = request.data.get('status')

        # Validate if the status field is provided and it's a boolean
        if status_from_request is None or not isinstance(status_from_request, bool):
            return Response({"error": "Status must be provided as a boolean value."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the user by user_id or return 404 if not found
        user = get_object_or_404(User, pk=user_id)

        # Update the user's is_active field
        user.is_active = status_from_request
        user.save()

        # Send notification to the user
        if user.is_active:
            user.send_notification('account_status_changed', 'Your account has been enabled again.')
        else:
            user.send_notification('account_status_changed', 'Your account has been disabled by the admin.')

        # Send success response
        return Response({"message": "Account status changed successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class ChangeUserRoleView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id, *args, **kwargs):
        new_role = request.data.get('role')
        if new_role not in [choice[0] for choice in User.ROLE_CHOICES]:
            return Response({"error": "Invalid role specified."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, pk=user_id)
        user.role = new_role
        user.save()

        custom_message = f"You role has been changed to: {new_role.capitalize()}."
        user.send_notification('role_change', custom_message)

        return Response({"message": "User role updated successfully"}, status=status.HTTP_200_OK)
