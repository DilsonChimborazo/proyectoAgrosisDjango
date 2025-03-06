

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
                ('rol', models.CharField(max_length=20, unique=True)),
                ('actualizacion', models.CharField(max_length=50)),
                ('fecha_creacion', models.DateField()),
            ],
        ),
    ]
