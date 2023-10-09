from django.db import models

# Create your models here.
class ClassLocation(models.Model):
    acronym = models.CharField(max_length=4, unique=True)
    building_name = models.CharField(max_length=100, unique=True)
    floor = models.CharField(max_length=2)
    room = models.IntegerField()