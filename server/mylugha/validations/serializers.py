from rest_framework import serializers
from .models import Validation
from contributions.serializers import ContributionListSerializer

class ValidationSerializer(serializers.ModelSerializer):
    """
    Serializer for validation details
    """
    validator_username = serializers.ReadOnlyField(source='validator.username')
    
    class Meta:
        model = Validation
        fields = ['id', 'contribution', 'validator', 'validator_username', 'is_valid', 'feedback', 'created_at']
        read_only_fields = ['id', 'validator', 'validator_username', 'created_at']
        
class ValidationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating validations
    """
    class Meta:
        model = Validation
        fields = ['contribution', 'is_valid', 'feedback']
        
class ValidationListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing validations
    """
    validator_username = serializers.ReadOnlyField(source='validator.username')
    contribution_data = ContributionListSerializer(source='contribution', read_only=True)
    
    class Meta:
        model = Validation
        fields = ['id', 'contribution', 'contribution_data', 'validator_username', 'is_valid', 'feedback', 'created_at']
        read_only_fields = fields