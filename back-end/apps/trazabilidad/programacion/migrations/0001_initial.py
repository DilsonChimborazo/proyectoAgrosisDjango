# Generated by Django 5.1.1 on 2024-12-06 03:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('asignacion_actividades', '0001_initial'),
        ('calendario_lunar', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Programacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado', models.CharField(max_length=50)),
                ('fecha_programada', models.DateTimeField()),
                ('duracion', models.DurationField()),
                ('fk_id_asignacionActividades', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='asignacion_actividades.asignacion_actividades')),
                ('fk_id_calendario', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='calendario_lunar.calendario_lunar')),
            ],
        ),
    ]
