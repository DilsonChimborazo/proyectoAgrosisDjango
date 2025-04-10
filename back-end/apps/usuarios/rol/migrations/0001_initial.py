# Generated by Django 5.1.1 on 2025-04-09 15:04

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rol',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rol', models.CharField(max_length=20, unique=True)),
                ('fecha_creacion', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
