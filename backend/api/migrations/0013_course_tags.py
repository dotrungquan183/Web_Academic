# Generated by Django 5.1.7 on 2025-04-26 10:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_course_thumbnail'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='tags',
            field=models.CharField(blank=True, max_length=255, verbose_name='Thẻ (tags)'),
        ),
    ]
