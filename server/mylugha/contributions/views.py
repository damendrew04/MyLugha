from django.shortcuts import render
from rest_framework import generics, permissions, filters
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Contribution, AudioContribution
from .serializers import (
    ContributionListSerializer,
    ContributionDetailSerializer,
    TextContributionCreateSerializer,
    AudioContributionCreateSerializer
)
from languages.models import Language

class ContributionListView(generics.ListAPIView):
    """
    API endpoint for listing contributions
    """
    serializer_class = ContributionListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['language__code', 'type', 'content_type', 'status']
    search_fields = ['original_text', 'translated_text']
    ordering_fields = ['created_at', 'validations_count']
    
    def get_queryset(self):
        # By default, return contributions visible to the current user
        queryset = Contribution.objects.all()
        
        # Filter by language if specified
        language_code = self.request.query_params.get('language_code')
        if language_code:
            queryset = queryset.filter(language__code=language_code)
            
        # Filter by user's contributions if requested
        my_contributions = self.request.query_params.get('my_contributions')
        if my_contributions and my_contributions.lower() == 'true':
            queryset = queryset.filter(user=self.request.user)
            
        # Filter contributions to validate if requested
        to_validate = self.request.query_params.get('to_validate')
        if to_validate and to_validate.lower() == 'true':
            # Get contributions pending validation that the user hasn't validated yet
            queryset = queryset.filter(status='pending').exclude(
                validations__validator=self.request.user
            )
        
        return queryset

class ContributionDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single contribution
    """
    queryset = Contribution.objects.all()
    serializer_class = ContributionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class TextContributionCreateView(generics.CreateAPIView):
    """
    API endpoint for creating text contributions
    """
    serializer_class = TextContributionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Set the user on the contribution
        contribution = serializer.save(user=self.request.user)
        
        # Update the language stats
        language = contribution.language
        language.words_count += 1 if contribution.content_type == 'word' else 0
        language.sentences_count += 1 if contribution.content_type == 'sentence' else 0
        language.contributors_count += 1
        language.save()
        
        # Update user's contribution count
        user = self.request.user
        user.total_contributions += 1
        user.save()

class AudioContributionCreateView(generics.CreateAPIView):
    """
    API endpoint for creating audio contributions
    """
    serializer_class = AudioContributionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        # Set the user on the contribution
        contribution = serializer.save(user=self.request.user)
        
        # Update the language stats
        language = contribution.language
        language.audio_count += 1
        language.contributors_count += 1
        language.save()
        
        # Update user's contribution count
        user = self.request.user
        user.total_contributions += 1
        user.save()
        
        # In a production environment, we would process the audio file here
        # This would involve tasks like:
        # 1. Converting the audio to a standard format (MP3/WAV)
        # 2. Normalizing audio levels
        # 3. Generating transcriptions if needed
        # 4. Storing in S3 or other cloud storage
        # 
        # Example using a background task:
        # from .tasks import process_audio_file
        # process_audio_file.delay(str(contribution.audio.id))
