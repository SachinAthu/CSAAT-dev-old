# Generated by Django 3.1.7 on 2021-03-13 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20210313_1318'),
    ]

    operations = [
        migrations.AddField(
            model_name='videos',
            name='camera_angle_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='videos',
            name='camera_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
