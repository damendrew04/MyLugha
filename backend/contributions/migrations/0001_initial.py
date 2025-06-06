# Generated by Django 4.2.21 on 2025-05-12 07:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('languages', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contribution',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(choices=[('text', 'Text'), ('audio', 'Audio')], max_length=10)),
                ('content_type', models.CharField(choices=[('word', 'Word'), ('sentence', 'Sentence'), ('paragraph', 'Paragraph'), ('story', 'Story')], max_length=20)),
                ('original_text', models.TextField()),
                ('translated_text', models.TextField()),
                ('context', models.TextField(blank=True)),
                ('anonymous', models.BooleanField(default=False)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('validated', 'Validated'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('validations_count', models.PositiveIntegerField(default=0)),
                ('positive_validations', models.PositiveIntegerField(default=0)),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contributions', to='languages.language')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contributions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='AudioContribution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('audio_file', models.FileField(upload_to='audio_contributions/%Y/%m/')),
                ('duration', models.FloatField(blank=True, null=True)),
                ('file_size', models.PositiveIntegerField(blank=True, null=True)),
                ('transcription', models.TextField(blank=True)),
                ('contribution', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='audio', to='contributions.contribution')),
            ],
        ),
    ]
