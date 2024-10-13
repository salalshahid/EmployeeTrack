import uuid
from django.conf import settings
from django.db import models

TYPE_CHOICES = [
    ('role_change', 'Role Change'),
    ('project_assigned', 'Project Assigned'),
    ('project_unassigned', 'Project Unassigned'),
    ('added_to_team', 'Added to Team'),
    ('removed_from_team', 'Removed from Team'),
    ('timesheet_reminder', 'Reminder to Submit Logs'),
    ('project_name_changed', 'Project Name Changed'),
    ('team_name_changed', 'Team Name Changed'),
    ('account_status_changed', 'Account Status Changed')
]

class Notification(models.Model):
    _id = models.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()), editable=False)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notifications', on_delete=models.CASCADE)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.type} - {self.recipient.username}"
    
class TimesheetReminder(models.Model):
    _id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='timesheet_reminders', on_delete=models.CASCADE)
    reminder_time = models.DateTimeField()

    def __str__(self):
        return f"Reminder for {self.user.email} at {self.reminder_time}"