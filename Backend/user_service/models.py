from django.conf import settings
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.core.mail import send_mail
from djongo import models
import uuid

from notification_service.models import TYPE_CHOICES, Notification
from .managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    _id = models.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()), editable=False)
    email = models.EmailField(unique=True)  # Ensure email is unique
    username = models.CharField(max_length=40, unique=True)
    full_name = models.CharField(max_length=40, default="")
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    unread_notifications = models.IntegerField(default=0)

    ADMINISTRATOR = 'administrator'
    MANAGER = 'manager'
    EMPLOYEE = 'employee'

    ROLE_CHOICES = [
        (ADMINISTRATOR, 'Administrator'),   
        (MANAGER, 'Manager'),
        (EMPLOYEE, 'Employee'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=EMPLOYEE)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    profile_picture = models.URLField(max_length=200, blank=True, null=True)
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    groups = models.ManyToManyField(
        Group,
        related_name='user_service_users',  # Unique related name for groups
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        verbose_name=('groups')
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='user_service_users',  # Unique related name for user permissions
        blank=True,
        help_text=('Specific permissions for this user.'),
        verbose_name=('user permissions')
    )

    objects = CustomUserManager()
    
    def __str__(self):
        return self.username
    
    def reset_unread_count(self):
        """ Resets the unread notifications counter to zero. """
        self.unread_notifications = 0
        self.save()

    def increment_unread_count(self):
        """ Increments the unread notifications counter by one, initializing if necessary. """
        if self.unread_notifications is None:
            self.unread_notifications = 0
        self.unread_notifications += 1
        self.save()

    def send_notification(self, event_type, custom_message=None):
        event_dict = dict(TYPE_CHOICES)
        event_name = event_dict.get(event_type, 'Notification')
        message = custom_message if custom_message else f"Dear {self.full_name},\n\nYou have a new notification: {event_name}."
        
        send_mail(
            subject=event_name,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.email],
            fail_silently=False,
        )
        
        Notification.objects.create(
            recipient=self,
            type=event_type,
            message=message
        )

        self.increment_unread_count()