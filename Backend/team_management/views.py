# team_management/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from user_service.auth import IsAdmin, IsAdminOrManager
from .models import Team
from .serializers import TeamSerializer

class TeamListCreateView(generics.ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(members=user).distinct()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsAdmin]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        team = serializer.save()  # Save the team instance created by the serializer
        
        # Send a notification to all members of the team except the user who created the team
        members = team.members.all()
        for member in members:
            if member != self.request.user:  # Check to avoid sending notification to the creator
                custom_message = f"You have been added to the new team: {team.name}."
                member.send_notification('team_created', custom_message)
    
class AllTeamsListView(generics.ListAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

class TeamRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_permissions(self):
        if self.request.method == 'DELETE':
            permission_classes = [IsAuthenticated, IsAdmin]
        else:
            permission_classes = [IsAuthenticated, IsAdminOrManager]
        return [permission() for permission in permission_classes]

class TeamDataRetrievalView(generics.ListAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]