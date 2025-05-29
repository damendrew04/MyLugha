from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractUser):
    """
    Extended User model for MyLugha application
    """
    class Roles(models.TextChoices):
        USER = 'user', _('User')
        VALIDATOR = 'validator', _('Validator')
        ADMIN = 'admin', _('Admin')

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.USER)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    phone_number = PhoneNumberField(blank=True, null=True)
    verified_email = models.BooleanField(default=False)
    total_contributions = models.PositiveIntegerField(default=0)
    total_validations = models.PositiveIntegerField(default=0)
    date_of_birth = models.DateField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.username

class UserLanguageFluency(models.Model):
    """
    Tracks a user's fluency level in various languages
    """
    class FluencyLevel(models.TextChoices):
        NATIVE = 'native', _('Native')
        FLUENT = 'fluent', _('Fluent')
        INTERMEDIATE = 'intermediate', _('Intermediate')
        BEGINNER = 'beginner', _('Beginner')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='language_fluencies')
    language = models.ForeignKey('languages.Language', on_delete=models.CASCADE)
    fluency = models.CharField(max_length=20, choices=FluencyLevel.choices)
    verified = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'language')
        verbose_name_plural = 'User language fluencies'
        
    def __str__(self):
        return f"{self.user.username} - {self.language.name} ({self.get_fluency_display()})"
