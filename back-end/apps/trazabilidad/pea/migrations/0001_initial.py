# Generated by Django 5.1.1 on 2025-03-06 04:05

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_pea', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
            ],
        ),
    ]
