# Generated by Django 5.1.1 on 2024-12-06 03:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('desarrollan', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Control_fitosanitario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_control', models.DateField()),
                ('descripcion', models.CharField(max_length=300)),
                ('fk_id_desarrollan', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='desarrollan.desarrollan')),
            ],
        ),
    ]
