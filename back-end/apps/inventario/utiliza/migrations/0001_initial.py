# Generated by Django 5.1.1 on 2025-03-06 20:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('insumo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Utiliza',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fk_id_asignacion_actividades', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='asignacion_actividades.asignacion_actividades')),
                ('fk_id_insumo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='insumo.insumo')),
            ],
        ),
    ]
