

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('actividad', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asignacion_actividades',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField()),
                ('observaciones', models.TextField()),
                ('fk_id_actividad', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='actividad.actividad')),
            ],
        ),
    ]
