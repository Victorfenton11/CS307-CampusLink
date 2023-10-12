from django.db import models

# Create your models here.
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