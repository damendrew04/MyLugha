from rest_framework import serializers
from .models import Contribution, AudioContribution
from languages.serializers import LanguageListSerializer

class AudioContributionSerializer(serializers.ModelSerializer):
    """
    Serializer for audio contribution details
    """
    class Meta:
        model = AudioContribution
        fields = ['audio_file', 'duration', 'file_size', 'transcription']
        read_only_fields = ['duration', 'file_size']

class ContributionListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing contributions
    """
    language_name = serializers.ReadOnlyField(source='language.name')
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Contribution
        fields = [
            'id', 'type', 'content_type', 'language_name', 'username',
            'original_text', 'translated_text', 'status', 'created_at',
            'validations_count', 'positive_validations'
        ]
        read_only_fields = fields

class ContributionDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for contribution details
    """
    language = LanguageListSerializer(read_only=True)
    username = serializers.ReadOnlyField(source='user.username')
    audio = AudioContributionSerializer(read_only=True)
    
    class Meta:
        model = Contribution
        fields = [
            'id', 'user', 'username', 'language', 'type', 'content_type', 
            'original_text', 'translated_text', 'context', 'anonymous',
            'status', 'created_at', 'updated_at', 'validations_count', 
            'positive_validations', 'audio'
        ]
        read_only_fields = [
            'id', 'user', 'username', 'status', 'created_at', 'updated_at',
            'validations_count', 'positive_validations'
        ]

class TextContributionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating text contributions
    """
    class Meta:
        model = Contribution
        fields = [
            'language', 'content_type', 'original_text', 
            'translated_text', 'context', 'anonymous'
        ]
    
    def create(self, validated_data):
        # Set the type to 'text'
        validated_data['type'] = 'text'
        return super().create(validated_data)

class AudioContributionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating audio contributions
    """
    audio_file = serializers.FileField(write_only=True)
    
    class Meta:
        model = Contribution
        fields = [
            'language', 'content_type', 'original_text', 
            'translated_text', 'context', 'anonymous', 'audio_file'
        ]
    
    def create(self, validated_data):
        # Extract the audio file
        audio_file = validated_data.pop('audio_file')
        
        # Set the type to 'audio'
        validated_data['type'] = 'audio'
        
        # Create the contribution
        contribution = Contribution.objects.create(**validated_data)
        
        # Create the audio contribution
        AudioContribution.objects.create(
            contribution=contribution,
            audio_file=audio_file
        )
        
        return contribution