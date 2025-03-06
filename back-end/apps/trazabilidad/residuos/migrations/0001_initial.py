# Generated by Django 5.1.1 on 2025-03-06 04:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cultivo', '0001_initial'),
        ('tipo_residuos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Residuos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_residuo', models.CharField(max_length=100)),
                ('fecha', models.DateField()),
                ('descripcion', models.CharField(max_length=300)),
                ('fk_id_cultivo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cultivo.cultivo')),
                ('fk_id_tipo_residuo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='tipo_residuos.tipo_residuos')),
            ],
        ),
    ]
