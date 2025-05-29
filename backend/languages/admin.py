from django.contrib import admin
from .models import Language

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Language model
    """
    list_display = ('name', 'code', 'category', 'contributors_count', 'words_count', 'sentences_count', 'audio_count')
    list_filter = ('category',)
    search_fields = ('name', 'code')
    readonly_fields = ('contributors_count', 'words_count', 'sentences_count', 'audio_count', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'category', 'description')
        }),
        ('Statistics', {
            'fields': ('contributors_count', 'words_count', 'sentences_count', 'audio_count'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
