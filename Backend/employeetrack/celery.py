from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'employeetrack.settings')

app = Celery('employeetrack')

# Using a string here means the worker doesn't have to serialize the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

# Define the periodic tasks
app.conf.beat_schedule = {
    'send-time-log-reminder': {
        'task': 'notification_service.tasks.send_time_log_reminder',
        'schedule': crontab(day_of_month='21,29', hour=0, minute=0),  # At midnight on the 25th and 29th of each month
    },
}