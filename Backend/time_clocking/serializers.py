from rest_framework import serializers
from .models import TimeEntry
from project_management.models import Project
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['_id', 'name']

class TimeEntrySerializer(serializers.ModelSerializer):
    project = serializers.SerializerMethodField()
    class Meta:
        model = TimeEntry
        fields = ['_id', 'user', 'project', 'start_time', 'end_time', 'date', 'hours_worked', 'notes']

    def get_project(self, obj):
        if self.context['request'].method == 'GET':
            return ProjectSerializer(obj.project).data
        else:
            # Return just the project ID or simplify as needed
            return obj.project_id

    def create(self, validated_data):
        # Here, ensure the 'project' is handled correctly if coming from POST data
        project_id = self.context['request'].data.get('project')
        validated_data['project'] = Project.objects.get(_id=project_id)
        user = self.context['request'].user
        validated_data['user'] = user
        return TimeEntry.objects.create(**validated_data)
