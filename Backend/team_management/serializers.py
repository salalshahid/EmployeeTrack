# team_management/serializers.py
from rest_framework import serializers
from .models import Team
from user_service.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['_id', 'username', 'full_name']

class TeamSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    
    class Meta:
        model = Team
        fields = ['_id', 'name', 'members', 'projects']

    def to_representation(self, instance):
        data = super(TeamSerializer, self).to_representation(instance)
        data['members'] = UserSerializer(instance.members.all(), many=True).data
        return data
    
    def update(self, instance, validated_data):
        # Store current members before updating
        current_members = set(instance.members.all())
        old_name = instance.name  # Store the old name for comparison

        # Update team fields
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Update member relationships
        if 'members' in validated_data:
            new_members = set(validated_data.get('members'))
            instance.members.set(new_members)

            # Determine added and removed members
            added_members = new_members - current_members
            removed_members = current_members - new_members

            for member in added_members:
                custom_message = f"You have been added to the team: {instance.name}."
                member.send_notification('added_to_team', custom_message)

            for member in removed_members:
                custom_message = f"You have been removed from the team: {instance.name}."
                member.send_notification('removed_from_team', custom_message)

        # Notify current members, managers, and administrators if the team name has changed
        if instance.name != old_name:
            custom_message = f"The name of the team '{old_name}' has been changed to '{instance.name}'."
            
            notified_users = set()

            # Notify current members
            for member in current_members:
                if member not in notified_users:
                    member.send_notification('team_name_changed', custom_message)
                    notified_users.add(member)

            # Notify all managers and administrators
            managers_and_admins = User.objects.filter(role__in=['manager', 'administrator'])
            for user in managers_and_admins:
                if user not in notified_users:
                    user.send_notification('team_name_changed', custom_message)
                    notified_users.add(user)

        return instance