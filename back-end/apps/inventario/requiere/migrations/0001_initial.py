# Generated by Django 5.1.1 on 2025-03-18 04:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('asignacion_actividades', '__first__'),
        ('herramientas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Requiere',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fk_Id_herramientas', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='herramientas.herramientas')),
                ('fk_id_asignaciona_actividades', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='asignacion_actividades.asignacion_actividades')),
            ],
        ),
    ]
