from django.shortcuts import render
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from .models import Validation
from .serializers import ValidationSerializer, ValidationCreateSerializer, ValidationListSerializer
from contributions.models import Contribution

class ValidationListView(generics.ListAPIView):
    """
    API endpoint for listing validations
    """
    serializer_class = ValidationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['contribution', 'is_valid']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        # Return validations performed by the current user
        queryset = Validation.objects.filter(validator=self.request.user)
        
        # Check if we should only return pending validations
        if self.kwargs.get('pending_only'):
            # Get contributions pending validation that the user hasn't validated yet
            # and is qualified to validate (not their own)
            contributions_to_validate = Contribution.objects.filter(
                status='pending'
            ).exclude(
                user=self.request.user  # Exclude user's own contributions
            ).exclude(
                validations__validator=self.request.user  # Exclude already validated
            )
            return Validation.objects.none()  # Return empty queryset with placeholder for pending validations
        
        # If contribution_id is specified, get all validations for that contribution
        contribution_id = self.request.query_params.get('contribution_id')
        if contribution_id:
            contribution = Contribution.objects.get(id=contribution_id)
            # Only allow seeing all validations if the user is the contribution owner
            # or an admin (we would add role-based check here)
            if contribution.user == self.request.user:
                queryset = Validation.objects.filter(contribution=contribution)
                
        return queryset

class ValidationCreateView(generics.CreateAPIView):
    """
    API endpoint for creating validations
    """
    serializer_class = ValidationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        contribution = serializer.validated_data['contribution']
        
        # Check if user has already validated this contribution
        existing_validation = Validation.objects.filter(
            contribution=contribution,
            validator=self.request.user
        ).first()
        
        if existing_validation:
            # User has already validated this contribution
            raise ValidationError('You have already validated this contribution')
            
        # Check if user is trying to validate their own contribution
        if contribution.user == self.request.user:
            raise ValidationError('You cannot validate your own contribution')
            
        # Save the validation with the current user as validator
        serializer.save(validator=self.request.user)
        
        # The contribution stats are updated in the Validation model's save() method

class ValidationDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single validation
    """
    queryset = Validation.objects.all()
    serializer_class = ValidationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only allow retrieving validations performed by the user
        # or validations on the user's own contributions
        user = self.request.user
        return Validation.objects.filter(
            # Either the user is the validator
            validator=user
        ).union(
            # Or the user is the contribution owner
            Validation.objects.filter(contribution__user=user)
        )
