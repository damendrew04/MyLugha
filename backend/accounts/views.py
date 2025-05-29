from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from social_django.utils import load_strategy, load_backend
from social_core.exceptions import MissingBackend, AuthTokenError, AuthForbidden

from .serializers import UserSerializer, UserProfileSerializer, SocialAuthSerializer, UserLanguageFluencySerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for retrieving and updating user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self):
        return self.request.user

class SocialLoginView(APIView):
    """
    API endpoint for authenticating with social providers (Google)
    """
    permission_classes = (permissions.AllowAny,)
    serializer_class = SocialAuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        provider = serializer.validated_data['provider']
        access_token = serializer.validated_data['access_token']
        
        try:
            strategy = load_strategy(request)
            backend = load_backend(strategy=strategy, name=provider, redirect_uri=None)
            
        except MissingBackend:
            return Response({'error': 'Invalid provider'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = backend.do_auth(access_token)
            
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                })
                
        except (AuthTokenError, AuthForbidden) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserLanguageFluencyView(generics.ListCreateAPIView):
    """
    API endpoint for managing user language fluencies
    """
    serializer_class = UserLanguageFluencySerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        return self.request.user.language_fluencies.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
