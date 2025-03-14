# Generated by Django 5.1.1 on 2025-03-13 23:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('control_fitosanitario', '__first__'),
        ('insumo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ControlUsaInsumo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fk_id_control_fitosanitario', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='control_fitosanitario.control_fitosanitario')),
                ('fk_id_insumo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='insumo.insumo')),
            ],
        ),
    ]
