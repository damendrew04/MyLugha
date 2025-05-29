from django.core.management.base import BaseCommand
from languages.models import Language

class Command(BaseCommand):
    help = 'Adds comprehensive list of Kenyan languages to the database'

    def handle(self, *args, **kwargs):
        # Comprehensive list of Kenyan languages with their ISO codes and categories
        languages = [
            # Existing languages from the sample list
            {'code': 'sw', 'name': 'Kiswahili', 'category': 'bantu', 'description': 'National language of Kenya and lingua franca in East Africa.'},
            {'code': 'kik', 'name': 'Gikuyu', 'category': 'bantu', 'description': 'Language of the Kikuyu people, the largest ethnic group in Kenya.'},
            {'code': 'luo', 'name': 'Dholuo', 'category': 'nilotic', 'description': 'Language of the Luo people, primarily spoken in Western Kenya.'},
            {'code': 'kam', 'name': 'Kamba', 'category': 'bantu', 'description': 'Language of the Kamba people, mainly spoken in Eastern Kenya.'},
            {'code': 'kal', 'name': 'Kalenjin', 'category': 'nilotic', 'description': 'Language cluster spoken by the Kalenjin people in the Rift Valley region.'},
            {'code': 'luy', 'name': 'Luhya', 'category': 'bantu', 'description': 'Language cluster spoken by the Luhya people in Western Kenya.'},
            {'code': 'mer', 'name': 'Kimeru', 'category': 'bantu', 'description': 'Language of the Meru people, spoken around Mount Kenya region.'},
            {'code': 'som', 'name': 'Somali', 'category': 'cushitic', 'description': 'Language spoken by Somali people in North Eastern Kenya.'},
            {'code': 'mas', 'name': 'Maasai', 'category': 'nilotic', 'description': 'Language of the Maasai people in Southern Kenya and Northern Tanzania.'},
            {'code': 'tec', 'name': 'Terik', 'category': 'nilotic', 'description': 'Language spoken by the Terik people in Western Kenya.'},
            
            # Additional Kenyan languages
            {'code': 'guz', 'name': 'Ekegusii', 'category': 'bantu', 'description': 'Language of the Kisii people in southwestern Kenya.'},
            {'code': 'dav', 'name': 'Taita', 'category': 'bantu', 'description': 'Language spoken in the Taita Hills of southeastern Kenya.'},
            {'code': 'ebu', 'name': 'Kiembu', 'category': 'bantu', 'description': 'Language of the Embu people in east-central Kenya.'},
            {'code': 'saq', 'name': 'Samburu', 'category': 'nilotic', 'description': 'Language of the Samburu people in north-central Kenya.'},
            {'code': 'pko', 'name': 'Pokot', 'category': 'nilotic', 'description': 'Language spoken by the Pokot people in northwestern Kenya.'},
            {'code': 'tuv', 'name': 'Turkana', 'category': 'nilotic', 'description': 'Language of the Turkana people in northwestern Kenya.'},
            {'code': 'kln', 'name': 'Nandi', 'category': 'nilotic', 'description': 'Language of the Nandi people, a subgroup of Kalenjin in the Rift Valley.'},
            {'code': 'teo', 'name': 'Ateso', 'category': 'nilotic', 'description': 'Language of the Iteso people in western Kenya.'},
            {'code': 'ksb', 'name': 'Shambala', 'category': 'bantu', 'description': 'Language spoken near the border with Tanzania.'},
            {'code': 'luy-lsm', 'name': 'Lusamia', 'category': 'bantu', 'description': 'Dialect of Luhya spoken in western Kenya.'},
            {'code': 'orm', 'name': 'Oromo', 'category': 'cushitic', 'description': 'Language spoken in parts of northern Kenya, primarily by the Oromo people.'},
            {'code': 'rab', 'name': 'Rendille', 'category': 'cushitic', 'description': 'Language spoken by the Rendille people in northern Kenya.'},
            {'code': 'bsq', 'name': 'Bassa', 'category': 'bantu', 'description': 'Language spoken in small communities in western Kenya.'},
            {'code': 'arr', 'name': 'Kuria', 'category': 'bantu', 'description': 'Language spoken in southwestern Kenya along the Tanzania border.'},
            {'code': 'dsh', 'name': 'Daasanach', 'category': 'cushitic', 'description': 'Language spoken near Lake Turkana in northern Kenya.'},
            {'code': 'gab', 'name': 'Gabra', 'category': 'cushitic', 'description': 'Language spoken by the Gabra people in northern Kenya.'},
            {'code': 'tbt', 'name': 'Tembo', 'category': 'bantu', 'description': 'Language spoken in small communities in western Kenya.'},
            {'code': 'pye', 'name': 'Kreyol', 'category': 'other', 'description': 'Creole language spoken in some urban areas and coastal regions.'},
            {'code': 'niq', 'name': 'Nandi-Markweta', 'category': 'nilotic', 'description': 'Language spoken in the Rift Valley region.'},
            {'code': 'luo-suba', 'name': 'Suba', 'category': 'bantu', 'description': 'Language spoken around Lake Victoria, influenced by Dholuo.'},
        ]
        
        count_created = 0
        count_updated = 0
        count_exists = 0
        
        for lang_data in languages:
            language, created = Language.objects.update_or_create(
                code=lang_data['code'],
                defaults={
                    'name': lang_data['name'],
                    'category': lang_data['category'],
                    'description': lang_data.get('description', '')
                }
            )
            
            if created:
                count_created += 1
                self.stdout.write(self.style.SUCCESS(f'Added language: {lang_data["name"]} ({lang_data["code"]})'))
            else:
                # Check if any fields were updated
                updated = False
                for field in ['name', 'category', 'description']:
                    if field in lang_data and getattr(language, field) != lang_data[field]:
                        updated = True
                        setattr(language, field, lang_data[field])
                
                if updated:
                    language.save()
                    count_updated += 1
                    self.stdout.write(self.style.WARNING(f'Updated language: {lang_data["name"]} ({lang_data["code"]})'))
                else:
                    count_exists += 1
                    self.stdout.write(f'Language already exists (no changes): {lang_data["name"]} ({lang_data["code"]})')
        
        self.stdout.write(self.style.SUCCESS(f'\nSummary:'))
        self.stdout.write(self.style.SUCCESS(f'Languages added: {count_created}'))
        self.stdout.write(self.style.SUCCESS(f'Languages updated: {count_updated}'))
        self.stdout.write(self.style.SUCCESS(f'Languages unchanged: {count_exists}'))
        self.stdout.write(self.style.SUCCESS(f'Total languages processed: {len(languages)}'))
