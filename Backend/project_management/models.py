import uuid
from django.db import models
from user_service.models import User

class Category(models.Model):
    _id = models.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()), editable=False)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    _id = models.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()), editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, unique=True)
    description = models.TextField(default='', blank=True)
    status = models.CharField(max_length=50, default='active')
    categories = models.ManyToManyField(Category, related_name='projects')
    teams = models.ManyToManyField(
        'team_management.Team',  # Referencing by app label and model name
        related_name='assigned_to',  # Unique related_name
        blank=True
    )
    users = models.ManyToManyField(User, related_name='projects', blank=True)

    def __str__(self):
        return self.name