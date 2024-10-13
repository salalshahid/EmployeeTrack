from django.urls import path
from time_clocking.views import (
    generate_time_entries_pdf, 
    TimeEntryListCreateView, 
    TimeEntryDetailView,
    TimesheetManagementView,
    CalendarIntegrationView
)

urlpatterns = [
    path('', TimeEntryListCreateView.as_view(), name='time-entry-list-create'),
    path('<uuid:pk>/', TimeEntryDetailView.as_view(), name='time-entry-detail'),
    path('pdf/<uuid:user_id>/', generate_time_entries_pdf, name='time-entry-record'),
    path('timesheet/', TimesheetManagementView.as_view(), name='timesheet-management'),
    path('calendar-integration/', CalendarIntegrationView.as_view(), name='calendar-integration'),
]
