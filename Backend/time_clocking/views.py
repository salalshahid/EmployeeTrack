from rest_framework import generics, views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from .models import TimeEntry, User
from .serializers import TimeEntrySerializer
import datetime

# PDF Generation View for Timesheet Management
def generate_time_entries_pdf(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    
    interval = request.GET.get('interval', 'month')
    today = datetime.date.today()
    start_date, end_date = today.replace(day=1), today

    if interval == 'day':
        start_date = end_date = today
    elif interval == 'month':
        end_date = (today.replace(day=28) + datetime.timedelta(days=4)).replace(day=1) - datetime.timedelta(days=1)
    elif interval == 'year':
        start_date = today.replace(month=1, day=1)
        end_date = today.replace(month=12, day=31)

    all_time_entries = TimeEntry.objects.filter(
        date__range=[start_date, end_date]
    )

    # Manually filter based on user email
    user_time_entries = [entry for entry in all_time_entries if entry.user.email == user.email]

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="time_entries_{interval}.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    # Heading
    heading = Paragraph("Employee Log Report", styles['Title'])
    elements.append(heading)
    elements.append(Spacer(1, 12))  # Adding some space after the heading

    # User's Email
    user_email = Paragraph(f"Employee: {user.email}", styles['Normal'])
    elements.append(user_email)
    elements.append(Spacer(1, 12))  # Adding some space after the user email

    if not user_time_entries:
        no_logs_message = Paragraph("No logs found for this employee.", styles['Normal'])
        elements.append(no_logs_message)
    else:
        # Table
        data = [['Project', 'Date', 'Hours Worked', 'Notes', 'Start Time', 'End Time']]
        for entry in user_time_entries:
            data.append([entry.project.name, entry.date, entry.hours_worked, entry.notes, entry.start_time, entry.end_time])

        table = Table(data, colWidths=[100, 80, 80, 100, 50, 50], repeatRows=1)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.gray),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.whitesmoke),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
        ]))

        elements.append(table)

    doc.build(elements)

    return response

# Time Entry Management Views
class TimeEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Fetches time entries only for the logged-in user
        return TimeEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TimeEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]

# Timesheet Management Views
class TimesheetManagementView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')
        return generate_time_entries_pdf(request, user_id)

# Calendar Integration Views (placeholder example for start/stop tracking and manual entries)
class CalendarIntegrationView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Implement calendar integration logic here
        return Response({"message": "Calendar integration is not implemented yet"}, status=status.HTTP_501_NOT_IMPLEMENTED)