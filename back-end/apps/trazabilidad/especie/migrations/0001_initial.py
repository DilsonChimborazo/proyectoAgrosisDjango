# Generated by Django 5.1.1 on 2024-12-06 03:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tipo_cultivo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Especie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_comun', models.CharField(max_length=100)),
                ('nombre_cientifico', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('fk_id_tipo_cultivo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='tipo_cultivo.tipo_cultivo')),
            ],
        ),
    ]
