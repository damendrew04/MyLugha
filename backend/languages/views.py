from django.shortcuts import render
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Language
from .serializers import LanguageSerializer, LanguageListSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Sum

class LanguageListView(generics.ListAPIView):
    """
    API endpoint for listing all languages
    """
    queryset = Language.objects.all()
    serializer_class = LanguageListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'contributors_count', 'words_count']

class LanguageDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single language
    """
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'code'

class LanguageStatsView(APIView):
    """
    API endpoint for retrieving statistics about a language
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, code):
        try:
            language = Language.objects.get(code=code)
            
            # Collect statistics about contributions for this language
            stats = {
                'total_words': language.words_count,
                'total_sentences': language.sentences_count,
                'total_audio': language.audio_count,
                'total_contributors': language.contributors_count,
            }
            
            # Include contribution types distribution if contributions app is being used
            from django.apps import apps
            if apps.is_installed('contributions'):
                Contribution = apps.get_model('contributions', 'Contribution')
                contribution_types = Contribution.objects.filter(language=language)\
                    .values('type', 'content_type')\
                    .annotate(count=Count('id'))\
                    .order_by('-count')
                
                stats['contribution_types'] = contribution_types
            
            return Response(stats)
            
        except Language.DoesNotExist:
            return Response({'error': 'Language not found'}, status=404)
