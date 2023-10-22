from django.db import models

# Create your models here.
from django.db import models

class User(models.Model):
    majorValue = 'Your Major'
    interestValue = 'Your Interest'
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    photoFileName = models.ImageField(upload_to='profile_pics/')
    Major = models.CharField(max_length=500, default = majorValue)
    Interest = models.CharField(max_length=1000, default = interestValue)
    securityQuestion = models.CharField(max_length=500, blank=True, null=True)
    securityAnswer = models.CharField(max_length=500, blank=True, null=True)
    