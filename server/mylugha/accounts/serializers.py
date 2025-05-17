from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserLanguageFluency

User = get_user_model()

class UserLanguageFluencySerializer(serializers.ModelSerializer):
    """
    Serializer for user language fluency
    """
    language_name = serializers.ReadOnlyField(source='language.name')
    
    class Meta:
        model = UserLanguageFluency
        fields = ['id', 'language', 'language_name', 'fluency', 'verified']
        read_only_fields = ['id', 'verified']
        
    def create(self, validated_data):
        # Set user from the context
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
        
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        read_only_fields = ['id']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile
    """
    language_fluencies = UserLanguageFluencySerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'bio', 'profile_picture', 'phone_number', 'date_of_birth',
            'role', 'total_contributions', 'total_validations', 'language_fluencies'
        ]
        read_only_fields = ['id', 'email', 'role', 'total_contributions', 'total_validations']

class SocialAuthSerializer(serializers.Serializer):
    """
    Serializer for social authentication
    """
    provider = serializers.CharField(required=True)
    access_token = serializers.CharField(required=True)