from django.core.management.base import BaseCommand
from languages.models import Language

class Command(BaseCommand):
    help = 'Lists all languages in the database'

    def handle(self, *args, **kwargs):
        languages = Language.objects.all().order_by('category', 'name')
        
        self.stdout.write(self.style.SUCCESS(f'Total languages in database: {languages.count()}'))
        self.stdout.write("\n")
        
        current_category = None
        
        for language in languages:
            if language.category != current_category:
                current_category = language.category
                self.stdout.write(self.style.SUCCESS(f'\n{language.get_category_display()} Languages:'))
                self.stdout.write("=" * 30)
            
            self.stdout.write(f'{language.name} ({language.code}): {language.description[:50]}{"..." if len(language.description) > 50 else ""}')
