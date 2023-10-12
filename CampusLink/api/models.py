from django.db import models

# Create your models here.
class User(models.Model):
    UserId = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=500)
    password = models.CharField(max_length=500)
    UserName = models.CharField(max_length=500)
    userEmail = models.CharField(max_length=500)
    PhotoFileName = models.CharField(max_length=500)
    friends = models.ManyToManyField("User", blank=True)

    def __str__(self):
        return self.UserName

# Class Friend_Request(models.Model)