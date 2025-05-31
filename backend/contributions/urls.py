from django.urls import path
from .views import (
    ContributionListView,
    ContributionDetailView,
    TextContributionCreateView,
    AudioContributionCreateView
)

urlpatterns = [
    path('', ContributionListView.as_view(), name='contribution_list'),
    path('<uuid:pk>/', ContributionDetailView.as_view(), name='contribution_detail'),
    path('text/', TextContributionCreateView.as_view(), name='text_contribution_create'),
    path('audio/', AudioContributionCreateView.as_view(), name='audio_contribution_create'),
]