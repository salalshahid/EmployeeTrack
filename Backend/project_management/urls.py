from django.urls import path
from .views import (
    ProjectListCreateView, 
    AllProjectsView,
    ProjectRetrieveUpdateDestroyView, 
    ProjectAssignmentView,
    ProjectUnassignmentView,
)

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/all', AllProjectsView.as_view(), name='all-projects-list'),
    path('projects/<uuid:pk>/', ProjectRetrieveUpdateDestroyView.as_view(), name='project-detail'),
    path('projects/assign/', ProjectAssignmentView.as_view(), name='project-assign'),
    path('projects/unassign/', ProjectUnassignmentView.as_view(), name='project-unassign'),
]