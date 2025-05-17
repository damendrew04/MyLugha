from django.urls import path
from .views import ValidationListView, ValidationCreateView, ValidationDetailView

urlpatterns = [
    path('', ValidationListView.as_view(), name='validation_list'),
    path('create/', ValidationCreateView.as_view(), name='validation_create'),
    path('<int:pk>/', ValidationDetailView.as_view(), name='validation_detail'),
    
    # Additional endpoint for pending validations
    path('pending/', ValidationListView.as_view(), {'pending_only': True}, name='pending_validations'),
]