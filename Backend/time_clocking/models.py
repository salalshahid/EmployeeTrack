import uuid
from djongo import models
from django.utils import timezone
from datetime import datetime
from project_management.models import Project
from user_service.models import User

def get_current_date():
    return timezone.now().date()

class TimeEntry(models.Model):
    _id = models.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()), editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='time_entries', null=True, blank=True, help_text="The individual user assigned to this project.")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='assigned_project')
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    date = models.DateField(default=get_current_date)
    start_time = models.TimeField(default=timezone.now)
    end_time = models.TimeField(default=timezone.now)
    notes = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.project.name} - {self.hours_worked} hours"
    
    def save(self, *args, **kwargs):
        # Ensure both start_time and end_time are set
        if self.start_time and self.end_time:
            # Convert start_time and end_time to datetime objects to perform subtraction
            start_datetime = datetime.combine(datetime.today(), self.start_time)
            end_datetime = datetime.combine(datetime.today(), self.end_time)
            # Calculate the duration and convert it to hours
            duration = end_datetime - start_datetime
            duration_in_hours = duration.total_seconds() / 3600
            self.hours_worked = round(duration_in_hours, 2)  # Rounds to 2 decimal places

        super(TimeEntry, self).save(*args, **kwargs)
