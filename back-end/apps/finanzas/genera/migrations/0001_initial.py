

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cultivo', '0001_initial'),
        ('produccion', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Genera',
            fields=[
                ('id_genera', models.AutoField(primary_key=True, serialize=False)),
                ('fk_id_cultivo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cultivo.cultivo')),
                ('fk_id_produccion', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='produccion.produccion')),
            ],
        ),
    ]
