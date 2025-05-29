from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from contributions.models import Contribution
from languages.models import Language

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with test contributions and validations'

    def handle(self, *args, **kwargs):
        # Create test users if they don't exist
        self.stdout.write("Creating test users...")
        
        # User 1: testuser123 (already exists from our tests)
        test_user_1, created = User.objects.get_or_create(
            username='testuser123',
            defaults={
                'email': 'testuser123@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        if created:
            test_user_1.set_password('testpass123')
            test_user_1.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {test_user_1.username}'))
        
        # User 2: validator1
        validator_1, created = User.objects.get_or_create(
            username='validator1',
            defaults={
                'email': 'validator1@example.com',
                'first_name': 'Validator',
                'last_name': 'One'
            }
        )
        if created:
            validator_1.set_password('validatorpass123')
            validator_1.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {validator_1.username}'))
        
        # User 3: contributor2
        contributor_2, created = User.objects.get_or_create(
            username='contributor2',
            defaults={
                'email': 'contributor2@example.com',
                'first_name': 'Contributor',
                'last_name': 'Two'
            }
        )
        if created:
            contributor_2.set_password('contributorpass123')
            contributor_2.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {contributor_2.username}'))

        # Get some languages
        try:
            swahili = Language.objects.get(code='sw')
            kikuyu = Language.objects.get(code='kik')
            luo = Language.objects.get(code='luo')
        except Language.DoesNotExist:
            self.stdout.write(self.style.ERROR('Languages not found. Please run add_sample_languages command first.'))
            return

        # Create test contributions
        self.stdout.write("Creating test contributions...")
        
        # Sample contributions from different users for different languages
        test_contributions = [
            {
                'user': test_user_1,
                'language': swahili,
                'content_type': 'word',
                'original_text': 'Hello',
                'translated_text': 'Habari',
                'context': 'A common greeting'
            },
            {
                'user': test_user_1,
                'language': swahili,
                'content_type': 'sentence',
                'original_text': 'How are you?',
                'translated_text': 'Habari yako?',
                'context': 'Asking about someone\'s wellbeing'
            },
            {
                'user': contributor_2,
                'language': kikuyu,
                'content_type': 'word',
                'original_text': 'Water',
                'translated_text': 'Mai',
                'context': 'Essential liquid for life'
            },
            {
                'user': contributor_2,
                'language': kikuyu,
                'content_type': 'sentence',
                'original_text': 'I am going home',
                'translated_text': 'Nĩ ngũthiĩ mũciĩ',
                'context': 'Expressing movement towards home'
            },
            {
                'user': test_user_1,
                'language': luo,
                'content_type': 'word',
                'original_text': 'Food',
                'translated_text': 'Chiemo',
                'context': 'What people eat'
            },
            {
                'user': contributor_2,
                'language': luo,
                'content_type': 'sentence',
                'original_text': 'Good morning',
                'translated_text': 'Oyawore',
                'context': 'Morning greeting'
            },
            {
                'user': validator_1,
                'language': swahili,
                'content_type': 'word',
                'original_text': 'Book',
                'translated_text': 'Kitabu',
                'context': 'Object used for reading'
            },
            {
                'user': validator_1,
                'language': kikuyu,
                'content_type': 'sentence',
                'original_text': 'Thank you very much',
                'translated_text': 'Nĩ wega mũno',
                'context': 'Expressing gratitude'
            },
        ]
        
        created_contributions = []
        for contrib_data in test_contributions:
            contribution, created = Contribution.objects.get_or_create(
                user=contrib_data['user'],
                language=contrib_data['language'],
                original_text=contrib_data['original_text'],
                translated_text=contrib_data['translated_text'],
                defaults={
                    'type': 'text',
                    'content_type': contrib_data['content_type'],
                    'context': contrib_data['context'],
                    'anonymous': False
                }
            )
            
            if created:
                created_contributions.append(contribution)
                self.stdout.write(self.style.SUCCESS(
                    f'Created contribution: {contrib_data["original_text"]} -> {contrib_data["translated_text"]} by {contrib_data["user"].username}'
                ))
            else:
                self.stdout.write(f'Contribution already exists: {contrib_data["original_text"]} -> {contrib_data["translated_text"]}')

        self.stdout.write(f"\nCreated {len(created_contributions)} new contributions")
        self.stdout.write(f"Total contributions in database: {Contribution.objects.count()}")
        
        # Display summary by language
        self.stdout.write("\nContributions by language:")
        for language in [swahili, kikuyu, luo]:
            count = Contribution.objects.filter(language=language).count()
            self.stdout.write(f"  {language.name}: {count} contributions")
