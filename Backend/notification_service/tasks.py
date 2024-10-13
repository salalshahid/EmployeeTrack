from celery import shared_task
from django.contrib.auth import get_user_model

User = get_user_model()

@shared_task
def send_time_log_reminder():
    users = User.objects.all()
    message = "Please don't forget to submit your time logs for this month."
    for user in users:
        user.send_notification('timesheet_reminder', message)