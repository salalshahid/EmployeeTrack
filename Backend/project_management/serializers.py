from rest_framework import serializers
from user_service.models import User
from .models import Project, Category
from team_management.models import Team

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['_id', 'name']

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['_id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['_id', 'username', 'full_name']

class ProjectSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )
    teams = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Team.objects.all(),
        required=False
    )
    users = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False
    )

    class Meta:
        model = Project
        fields = ['_id', 'name', 'code', 'description', 'status', 'categories', 'teams', 'users']

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])
        teams_data = validated_data.pop('teams', [])
        users_data = validated_data.pop('users', [])

        project = Project.objects.create(**validated_data)

        for category_name in categories_data:
            category, created = Category.objects.get_or_create(name=category_name)
            project.categories.add(category)

        project.teams.set(teams_data)
        project.users.set(users_data)

        # Notify users assigned to the new project
        for user in project.users.all():
            custom_message = f"You have been assigned to the new project: {project.name}."
            user.send_notification('project_assigned', custom_message)

        # Notify individual team members assigned to the new project
        for team in project.teams.all():
            for member in team.members.all():
                custom_message = f"Your team has been assigned to the new project: {project.name}."
                member.send_notification('project_assigned', custom_message)

        # Notify admins and managers about the new project creation
        admins_and_managers = User.objects.filter(role__in=['administrator', 'manager']).distinct()
        for admin_or_manager in admins_and_managers:
            custom_message = f"A new project '{project.name}' has been created."
            admin_or_manager.send_notification('project_created', custom_message)

        return project

    def to_representation(self, instance):
        data = super(ProjectSerializer, self).to_representation(instance)
        data['categories'] = CategorySerializer(instance.categories.all(), many=True).data
        data['teams'] = TeamSerializer(instance.teams.all(), many=True).data
        data['users'] = UserSerializer(instance.users.all(), many=True).data
        return data
    
    def update(self, instance, validated_data):
        categories_data = validated_data.pop('categories', None)
        
        # Track previous teams and users
        previous_users = set(instance.users.all())
        previous_teams = set(instance.teams.all())
        old_name = instance.name  # Store the old name for comparison

        # Update project fields
        instance.name = validated_data.get('name', instance.name)
        instance.code = validated_data.get('code', instance.code)
        instance.description = validated_data.get('description', instance.description)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        
        # Update category relationships if 'categories' is part of the submitted data
        if categories_data is not None:
            # Clear existing categories and add new ones
            instance.categories.clear()
            for category_name in categories_data:
                category, created = Category.objects.get_or_create(name=category_name)
                instance.categories.add(category)

        # Update team relationships
        if 'teams' in validated_data:
            teams_data = validated_data.pop('teams')
            instance.teams.set(teams_data)

        # Update user relationships
        if 'users' in validated_data:
            users_data = validated_data.pop('users')
            instance.users.set(users_data)
        
        # Track current users and teams after update
        current_users = set(instance.users.all())
        current_teams = set(instance.teams.all())

        # Find newly assigned and unassigned users
        new_users = current_users - previous_users
        unassigned_users = previous_users - current_users

        # Find newly assigned and unassigned teams
        new_teams = current_teams - previous_teams
        unassigned_teams = previous_teams - current_teams

        # Send notifications to newly assigned users
        for user in new_users:
            custom_message = f"You have been assigned to the project: {instance.name}."
            user.send_notification('project_assigned', custom_message)

        # Send notifications to unassigned users
        for user in unassigned_users:
            custom_message = f"You have been unassigned from the project: {instance.name}."
            user.send_notification('project_unassigned', custom_message)

        # Notify old team members about project unassignment
        for team in unassigned_teams:
            for member in team.members.all():
                custom_message = f"Your team has been unassigned from the project: {instance.name}."
                member.send_notification('project_unassigned', custom_message)

        # Notify new team members about project assignment
        for team in new_teams:
            for member in team.members.all():
                custom_message = f"Your team has been assigned to the project: {instance.name}."
                member.send_notification('project_assigned', custom_message)

        # Notify users and team members if the project name has changed
        if instance.name != old_name:
            custom_message = f"The name of the project '{old_name}' has been changed to '{instance.name}'."
            notified_users = set()

            # Notify current users
            for user in current_users:
                if user not in notified_users:
                    user.send_notification('project_name_changed', custom_message)
                    notified_users.add(user)

            # Notify all current team members
            for team in current_teams:
                for member in team.members.all():
                    if member not in notified_users:
                        member.send_notification('project_name_changed', custom_message)
                        notified_users.add(member)
            
            # Notify managers and administrators
            managers_and_admins = User.objects.filter(role__in=['manager', 'administrator'])
            for user in managers_and_admins:
                if user not in notified_users:
                    user.send_notification('project_name_changed', custom_message)
                    notified_users.add(user)
        
        return instance
