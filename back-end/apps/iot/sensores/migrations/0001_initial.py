# Generated by Django 5.1.1 on 2025-03-06 03:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sensores',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_sensor', models.CharField(max_length=50)),
                ('tipo_sensor', models.CharField(max_length=50)),
                ('unidad_medida', models.CharField(max_length=50)),
                ('descripcion', models.TextField()),
                ('medida_minima', models.IntegerField()),
                ('medida_maxima', models.IntegerField()),
            ],
        ),
    ]
