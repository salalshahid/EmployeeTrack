from django.db.models import Q
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_service.auth import IsAdmin, IsAdminOrManager
from project_management.serializers import ProjectSerializer
from project_management.models import Project
from team_management.models import Team
from user_service.models import User

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Fetch the user from the request
        user = self.request.user
        # Query projects where the user is directly linked or is part of a team linked to the project
        return Project.objects.filter(
            Q(users=user) | Q(teams__members=user)
        ).distinct()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsAdmin]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(ProjectListCreateView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Debug print to see the errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllProjectsView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    queryset = Project.objects.all()

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class ProjectAssignmentView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        user_ids = request.data.get('user_ids', [])
        team_ids = request.data.get('team_ids', [])

        project = Project.objects.get(_id=project_id)

        # Assign users to project
        for user_id in user_ids:
            user = User.objects.get(_id=user_id)
            # Check if the user is already assigned to the project
            if not project.users.filter(_id=user_id).exists():
                project.users.add(user)
                custom_message = f"You have been assigned the project: {project.name}."
                user.send_notification('project_assigned', custom_message)
                

        # Assign teams to project
        for team_id in team_ids:
            team = Team.objects.get(_id=team_id)
            # Check if the team is already assigned to the project
            if not project.teams.filter(_id=team_id).exists():
                project.teams.add(team)

        return Response({'detail': 'Project assignments updated successfully'}, status=status.HTTP_200_OK)
    
class ProjectUnassignmentView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        user_ids = request.data.get('user_ids', [])
        team_ids = request.data.get('team_ids', [])

        try:
            project = Project.objects.get(_id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

        # Unassign users from the project
        if user_ids:
            for user_id in user_ids:
                try:
                    user = User.objects.get(_id=user_id)
                    project.users.remove(user)
                    custom_message = f"The project: {project.name} which you were working has now been unassigned."
                    user.send_notification('project_unassigned', custom_message)
                except User.DoesNotExist:
                    return Response({'error': f'User with id {user_id} not found'}, status=status.HTTP_404_NOT_FOUND)

        # Unassign teams from the project
        if team_ids:
            for team_id in team_ids:
                try:
                    team = Team.objects.get(_id=team_id)
                    project.teams.remove(team)
                except Team.DoesNotExist:
                    return Response({'error': f'Team with id {team_id} not found'}, status=status.HTTP_404_NOT_FOUND)

        project.save()
        return Response({'detail': 'Project unassignments completed successfully'}, status=status.HTTP_200_OK)

class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            self.permission_classes = [IsAuthenticated, IsAdmin]
        else:
            self.permission_classes = [IsAuthenticated, IsAdminOrManager]
        return super().get_permissions()