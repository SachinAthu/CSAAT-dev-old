# Generated by Django 3.1.7 on 2021-04-29 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_audios'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cameras',
            name='megapixels',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
