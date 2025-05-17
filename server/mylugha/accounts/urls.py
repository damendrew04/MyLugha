from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    UserProfileView,
    SocialLoginView,
    UserLanguageFluencyView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('login/social/', SocialLoginView.as_view(), name='social_login'),
    path('profile/languages/', UserLanguageFluencyView.as_view(), name='language_fluencies'),
]