# Generated by Django 5.1.1 on 2024-12-06 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rol',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rol', models.CharField(choices=[('aprendiz', 'Aprendiz'), ('pasante', 'Pasante'), ('instructor', 'Instructor'), ('administrador', 'Administrador')], max_length=20)),
                ('actualizacion', models.CharField(max_length=50)),
                ('fecha_creacion', models.DateField()),
            ],
        ),
    ]
