from django.urls import path
from .views import LanguageListView, LanguageDetailView, LanguageStatsView

urlpatterns = [
    path('', LanguageListView.as_view(), name='language_list'),
    path('<str:code>/', LanguageDetailView.as_view(), name='language_detail'),
    path('<str:code>/stats/', LanguageStatsView.as_view(), name='language_stats'),
]