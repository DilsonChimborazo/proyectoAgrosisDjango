
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('especie', '0001_initial'),
        ('semillero', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cultivo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_cultivo', models.CharField(max_length=100)),
                ('fecha_plantacion', models.DateField()),
                ('descripcion', models.CharField(max_length=300)),
                ('fk_id_especie', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='especie.especie')),
                ('fk_id_semillero', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='semillero.semillero')),
            ],
        ),
    ]
