from rest_framework import serializers
from .models import Language

class LanguageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Language model
    """
    class Meta:
        model = Language
        fields = [
            'id', 'name', 'code', 'category', 'description',
            'contributors_count', 'words_count', 'sentences_count',
            'audio_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'contributors_count', 'words_count', 'sentences_count',
            'audio_count', 'created_at', 'updated_at'
        ]
        
class LanguageListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing languages
    """
    class Meta:
        model = Language
        fields = ['id', 'name', 'code', 'category', 'contributors_count', 'words_count']