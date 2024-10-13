# notifications/serializers.py
from rest_framework import serializers
from .models import Notification, TimesheetReminder

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['_id', 'type', 'message', 'created_at', 'read']

class TimesheetReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimesheetReminder
        fields = ['_id', 'user', 'reminder_time']