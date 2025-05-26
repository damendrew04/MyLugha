"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Welcome to MyLugha API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'languages': '/api/languages/',
            'contributions': '/api/contributions/',
            'validations': '/api/validations/',
            'token': '/api/token/',
            'token_refresh': '/api/token/refresh/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/languages/', include('languages.urls')),
    path('api/contributions/', include('contributions.urls')),
    path('api/validations/', include('validations.urls')),
    
    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Social authentication
    path('api/social-auth/', include('social_django.urls', namespace='social')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
