from django.db import models

# Create your models here.
class ClassLocation(models.Model):
    acronym = models.CharField(max_length=6, unique=True)
    building_name = models.CharField(max_length=100, unique=True)