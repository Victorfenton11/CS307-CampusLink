from django.db import models

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