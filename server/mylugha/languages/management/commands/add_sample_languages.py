from django.core.management.base import BaseCommand
from languages.models import Language

class Command(BaseCommand):
    help = 'Adds sample languages to the database'

    def handle(self, *args, **kwargs):
        languages = [
            {'code': 'sw', 'name': 'Kiswahili'},
            {'code': 'kik', 'name': 'Gikuyu'},
            {'code': 'luo', 'name': 'Dholuo'},
            {'code': 'kam', 'name': 'Kamba'},
            {'code': 'kal', 'name': 'Kalenjin'},
            {'code': 'luy', 'name': 'Luhya'},
            {'code': 'mer', 'name': 'Kimeru'},
            {'code': 'som', 'name': 'Somali'},
            {'code': 'mas', 'name': 'Maasai'},
            {'code': 'tec', 'name': 'Terik'}
        ]
        
        for lang_data in languages:
            language, created = Language.objects.get_or_create(
                code=lang_data['code'],
                defaults={'name': lang_data['name']}
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added language: {lang_data["name"]}'))
            else:
                self.stdout.write(f'Language already exists: {lang_data["name"]}')