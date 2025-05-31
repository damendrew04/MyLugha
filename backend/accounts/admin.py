from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, UserLanguageFluency

class CustomUserAdmin(UserAdmin):
    """
    Admin configuration for the custom User model
    """
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('email', 'first_name', 'last_name', 'bio', 'profile_picture', 'phone_number', 'date_of_birth')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'role', 'groups', 'user_permissions'),
        }),
        (_('Activity'), {'fields': ('verified_email', 'total_contributions', 'total_validations')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'total_contributions')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'role', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')

class UserLanguageFluencyAdmin(admin.ModelAdmin):
    """
    Admin configuration for the UserLanguageFluency model
    """
    list_display = ('user', 'language', 'fluency', 'verified')
    list_filter = ('fluency', 'verified', 'language')
    search_fields = ('user__username', 'language__name')

# Register the models with their admin classes
admin.site.register(User, CustomUserAdmin)
admin.site.register(UserLanguageFluency, UserLanguageFluencyAdmin)
