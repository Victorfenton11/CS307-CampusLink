# Generated by Django 3.2.5 on 2023-11-03 19:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('abbreviation', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ClassLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('acronym', models.CharField(max_length=6, unique=True)),
                ('building_name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('UserID', models.AutoField(primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=500)),
                ('Password', models.CharField(max_length=500)),
                ('UserName', models.CharField(max_length=500)),
                ('UserEmail', models.CharField(max_length=500)),
                ('PhotoFileName', models.CharField(max_length=500, null=True)),
                ('Major', models.CharField(default='Your Major', max_length=500)),
                ('Interest', models.CharField(default='Your Interest', max_length=1000)),
                ('isPrivate', models.BooleanField(default=False)),
                ('friends', models.ManyToManyField(blank=True, to='api.User')),
            ],
        ),
        migrations.CreateModel(
            name='Thread',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(max_length=128)),
                ('content', models.TextField()),
                ('topic', models.CharField(choices=[('1', 'Entertainment'), ('2', 'Sports'), ('3', 'Gaming'), ('4', 'Music'), ('5', 'Technology'), ('6', 'News'), ('7', 'Anime'), ('8', 'Drama & Movie')], default=1, max_length=32)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('replyCount', models.IntegerField(default=0)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator_threads', to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator_posts', to='api.user')),
                ('thread', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thread_posts', to='api.thread')),
            ],
        ),
    ]
