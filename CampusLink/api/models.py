from django.db import models
from django.utils.text import slugify
from django.db.models import URLField
from django.shortcuts import reverse

# Create your models here.
class ClassLocation(models.Model):
    acronym = models.CharField(max_length=6, unique=True)
    building_name = models.CharField(max_length=100, unique=True)

class User(models.Model):
    majorValue = 'Your Major'
    interestValue = 'Your Interest'
    UserID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=500)
    Password = models.CharField(max_length=500)
    UserName = models.CharField(max_length=500)
    UserEmail = models.CharField(max_length=500)
    PhotoFileName = models.CharField(max_length=500, null=True)
    Major = models.CharField(max_length=500, default = majorValue)
    Interest = models.CharField(max_length=1000, default = interestValue)
    friends = models.ManyToManyField("User", blank=True)
    isPrivate = models.BooleanField(default=False)

    def str(self):
        return self.UserName

class Class(models.Model):
    abbreviation = models.CharField(max_length=10)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.abbreviation} - {self.name}'
    
# Posts and related models
class Thread(models.Model):
    TOPIC_CHOICES = (
    ("1", "Entertainment"),
    ("2", "Sports"),
    ("3", "Gaming"),
    ("4", "Music"),
    ("5", "Technology"),
    ("6", "News"),
    ("7", "Anime"),
    ("8", "Drama & Movie"),
)
    subject = models.CharField(max_length=128)
    content = models.TextField()
    creator = models.ForeignKey('User', on_delete=models.CASCADE, related_name='creator_threads')
    topic = models.CharField(max_length=32, choices=TOPIC_CHOICES, default=1)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    replyCount = models.IntegerField(default=0)

    def __str__(self):
        return f'Thread {self.subject}  is created by {self.creator.username}.'


class Post(models.Model):
    content = models.TextField()
    thread = models.ForeignKey('Thread', on_delete=models.CASCADE, related_name='thread_posts')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey('User', on_delete=models.CASCADE, related_name='creator_posts')

    def __str__(self):
        return f'Post of {self.thread.subject} is posted by {self.creator.username}.'

