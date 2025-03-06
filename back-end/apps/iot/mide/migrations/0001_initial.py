# Generated by Django 5.1.1 on 2025-03-06 04:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('eras', '0001_initial'),
        ('sensores', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mide',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor_medicion', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha_medicion', models.DateTimeField(auto_now_add=True)),
                ('fk_id_era', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='eras.eras')),
                ('fk_id_sensor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='sensores.sensores')),
            ],
        ),
    ]
