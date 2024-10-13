import uuid
from django.db import models

class Team(models.Model):
    _id = models.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()), editable=False)
    name = models.CharField(max_length=255, unique=True, help_text="Name of the team.")
    members = models.ManyToManyField('user_service.User', related_name="teams", help_text="Members of the team.")
    projects = models.ManyToManyField('project_management.Project', related_name="assigned_projects", blank=True, help_text="Projects assigned to the team.")

    def __str__(self):
        return self.name

    def get_member_count(self):
        return self.members.count()

    def get_project_count(self):
        return self.projects.count()
