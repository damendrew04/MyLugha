from django.contrib import admin
from .models import Validation

@admin.register(Validation)
class ValidationAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Validation model
    """
    list_display = ('id', 'contribution', 'validator', 'is_valid', 'created_at')
    list_filter = ('is_valid', 'created_at')
    search_fields = ('contribution__original_text', 'validator__username', 'feedback')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('contribution', 'validator', 'is_valid')
        }),
        ('Feedback', {
            'fields': ('feedback',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
