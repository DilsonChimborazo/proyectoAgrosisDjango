

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Semillero',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_semillero', models.CharField(max_length=100)),
                ('fecha_siembra', models.DateField()),
                ('fecha_estimada', models.DateField()),
                ('cantidad', models.IntegerField()),
            ],
        ),
    ]
