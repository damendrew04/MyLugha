from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Validation(models.Model):
    """
    Model for tracking validations of user contributions
    """
    contribution = models.ForeignKey('contributions.Contribution', on_delete=models.CASCADE, related_name='validations')
    validator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='performed_validations')
    is_valid = models.BooleanField()
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('contribution', 'validator')
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Validation on {self.contribution.id} by {self.validator.username}"
        
    def save(self, *args, **kwargs):
        # Track if this is a new validation
        is_new = self.pk is None
        
        # Call the original save method
        super().save(*args, **kwargs)
        
        # Update contribution validation counters
        if is_new:
            contribution = self.contribution
            contribution.validations_count += 1
            if self.is_valid:
                contribution.positive_validations += 1
                
            # Auto-update status based on validation threshold (customizable)
            if contribution.validations_count >= 3:  # minimum 3 validations
                if contribution.validation_ratio >= 0.7:  # 70% positive threshold
                    contribution.status = 'validated'
                elif contribution.validation_ratio <= 0.3:  # 30% positive threshold
                    contribution.status = 'rejected'
                    
            contribution.save()
            
            # Update validator's validation count
            validator = self.validator
            validator.total_validations += 1
            validator.save()
