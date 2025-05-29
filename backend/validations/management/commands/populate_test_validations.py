from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from contributions.models import Contribution
from validations.models import Validation
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test validations for existing contributions'

    def handle(self, *args, **kwargs):
        # Get all users
        users = list(User.objects.all())
        if len(users) < 2:
            self.stdout.write(self.style.ERROR('Need at least 2 users to create validations. Run populate_test_data first.'))
            return

        # Get all contributions
        contributions = list(Contribution.objects.all())
        if not contributions:
            self.stdout.write(self.style.ERROR('No contributions found. Run populate_test_data first.'))
            return

        self.stdout.write(f"Found {len(contributions)} contributions and {len(users)} users")
        
        validations_created = 0
        
        # Create validations for each contribution (avoiding self-validation)
        for contribution in contributions:
            # Get users who can validate this contribution (not the author)
            eligible_validators = [user for user in users if user != contribution.user]
            
            # Randomly select 1-3 validators for each contribution
            num_validators = random.randint(1, min(3, len(eligible_validators)))
            selected_validators = random.sample(eligible_validators, num_validators)
            
            for validator in selected_validators:
                # Check if validation already exists
                existing_validation = Validation.objects.filter(
                    contribution=contribution,
                    validator=validator
                ).first()
                
                if not existing_validation:
                    # Create validation with random result (80% positive to make it realistic)
                    is_valid = random.random() < 0.8  # 80% chance of positive validation
                    
                    feedback_options = [
                        "Looks correct!",
                        "Good translation.",
                        "This is accurate.",
                        "Well done.",
                        "Perfect match.",
                        "Could be improved but acceptable.",
                        "Not quite right.",
                        "Needs improvement.",
                        ""  # No feedback
                    ]
                    
                    feedback = random.choice(feedback_options) if random.random() < 0.7 else ""
                    
                    validation = Validation.objects.create(
                        contribution=contribution,
                        validator=validator,
                        is_valid=is_valid,
                        feedback=feedback
                    )
                    
                    validations_created += 1
                    status_text = "✓ Valid" if is_valid else "✗ Invalid"
                    self.stdout.write(
                        f'Created validation: {contribution.original_text} -> {contribution.translated_text} '
                        f'by {validator.username} ({status_text})'
                    )

        self.stdout.write(f"\nCreated {validations_created} new validations")
        self.stdout.write(f"Total validations in database: {Validation.objects.count()}")
        
        # Display summary of contributions with validation status
        self.stdout.write("\nContribution validation summary:")
        for contribution in contributions:
            validations = contribution.validations.all()
            positive_count = validations.filter(is_valid=True).count()
            total_count = validations.count()
            
            if total_count > 0:
                ratio = positive_count / total_count
                status = contribution.status
                self.stdout.write(
                    f"  {contribution.original_text[:30]}... - {positive_count}/{total_count} positive ({ratio:.1%}) - Status: {status}"
                )
            else:
                self.stdout.write(f"  {contribution.original_text[:30]}... - No validations yet")
