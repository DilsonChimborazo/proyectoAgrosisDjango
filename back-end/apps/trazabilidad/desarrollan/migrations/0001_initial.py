

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cultivo', '0001_initial'),
        ('pea', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Desarrollan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fk_id_cultivo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cultivo.cultivo')),
                ('fk_id_pea', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='pea.pea')),
            ],
        ),
    ]
