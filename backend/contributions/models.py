from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from uuid import uuid4

class Contribution(models.Model):
    """
    Base model for all user contributions (text and audio)
    """
    class Type(models.TextChoices):
        TEXT = 'text', _('Text')
        AUDIO = 'audio', _('Audio')
    
    class ContentType(models.TextChoices):
        WORD = 'word', _('Word')
        SENTENCE = 'sentence', _('Sentence')
        PARAGRAPH = 'paragraph', _('Paragraph')
        STORY = 'story', _('Story')
    
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        VALIDATED = 'validated', _('Validated')
        REJECTED = 'rejected', _('Rejected')

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='contributions')
    language = models.ForeignKey('languages.Language', on_delete=models.CASCADE, related_name='contributions')
    type = models.CharField(max_length=10, choices=Type.choices)
    content_type = models.CharField(max_length=20, choices=ContentType.choices)
    original_text = models.TextField()
    translated_text = models.TextField()
    context = models.TextField(blank=True)
    anonymous = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    validations_count = models.PositiveIntegerField(default=0)
    positive_validations = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.get_content_type_display()} by {self.user.username if not self.anonymous else 'Anonymous'}"
        
    @property
    def validation_ratio(self):
        """Calculate the ratio of positive validations"""
        if self.validations_count == 0:
            return 0
        return self.positive_validations / self.validations_count
        
    class Meta:
        ordering = ['-created_at']

class AudioContribution(models.Model):
    """
    Additional information for audio contributions
    """
    contribution = models.OneToOneField(Contribution, on_delete=models.CASCADE, related_name='audio')
    audio_file = models.FileField(upload_to='audio_contributions/%Y/%m/')
    duration = models.FloatField(null=True, blank=True)  # Duration in seconds
    file_size = models.PositiveIntegerField(null=True, blank=True)  # Size in KB
    transcription = models.TextField(blank=True)  # For any auto-generated transcription
    
    def __str__(self):
        return f"Audio for {self.contribution.id}"
