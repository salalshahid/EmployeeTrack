# team_management/urls.py
from django.urls import path
from .views import (
    TeamListCreateView, 
    AllTeamsListView,
    TeamRetrieveUpdateDestroyView, 
    TeamDataRetrievalView
)

urlpatterns = [
    path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/all/', AllTeamsListView.as_view(), name='all-teams-list'),
    path('teams/<uuid:pk>/', TeamRetrieveUpdateDestroyView.as_view(), name='team-detail'),
    path('teams/data/', TeamDataRetrievalView.as_view(), name='team-data')
]
