from django.db import models
from django.utils.translation import gettext_lazy as _

class Language(models.Model):
    """
    Model representing a language in the MyLugha application
    """
    class Category(models.TextChoices):
        BANTU = 'bantu', _('Bantu')
        NILOTIC = 'nilotic', _('Nilotic')
        CUSHITIC = 'cushitic', _('Cushitic')
        OTHER = 'other', _('Other')

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    category = models.CharField(max_length=20, choices=Category.choices)
    description = models.TextField(blank=True)
    contributors_count = models.PositiveIntegerField(default=0)
    words_count = models.PositiveIntegerField(default=0)
    sentences_count = models.PositiveIntegerField(default=0)
    audio_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"

    class Meta:
        ordering = ['name']
