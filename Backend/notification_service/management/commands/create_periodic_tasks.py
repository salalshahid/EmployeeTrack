from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from django.utils.timezone import now

class Command(BaseCommand):
    help = 'Create periodic tasks'

    def handle(self, *args, **options):
        # Create or get the crontab schedule
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute='0',
            hour='0',
            day_of_month='21,29',
            month_of_year='*',
            day_of_week='*'
        )
        
        # Create or update the periodic task
        PeriodicTask.objects.update_or_create(
            crontab=schedule,
            name='Send Time Log Reminder',
            defaults={
                'task': 'notification_service.tasks.send_time_log_reminder',
                'start_time': now(),
                'enabled': True
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully created or updated periodic task'))