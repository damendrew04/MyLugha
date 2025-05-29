from django.contrib import admin
from .models import Contribution, AudioContribution

class AudioContributionInline(admin.StackedInline):
    """
    Inline admin for AudioContribution to be displayed in Contribution admin
    """
    model = AudioContribution
    readonly_fields = ('duration', 'file_size')
    extra = 0

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Contribution model
    """
    list_display = ('id', 'user', 'language', 'type', 'content_type', 'status', 'created_at', 'validations_count')
    list_filter = ('type', 'content_type', 'status', 'language', 'anonymous')
    search_fields = ('original_text', 'translated_text', 'user__username')
    readonly_fields = ('id', 'validations_count', 'positive_validations', 'created_at', 'updated_at')
    inlines = [AudioContributionInline]
    
    fieldsets = (
        (None, {
            'fields': ('id', 'user', 'language', 'type', 'content_type')
        }),
        ('Content', {
            'fields': ('original_text', 'translated_text', 'context', 'anonymous')
        }),
        ('Validation', {
            'fields': ('status', 'validations_count', 'positive_validations')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(AudioContribution)
class AudioContributionAdmin(admin.ModelAdmin):
    """
    Admin configuration for the AudioContribution model
    """
    list_display = ('contribution', 'duration', 'file_size')
    search_fields = ('contribution__original_text', 'contribution__user__username')
    readonly_fields = ('duration', 'file_size')
