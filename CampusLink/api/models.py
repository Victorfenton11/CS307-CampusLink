from django.db import models
from django.utils.text import slugify
from django.db.models import URLField
from taggit.managers import TaggableManager

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
class Category(models.Model):
    title = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    class Meta:
        verbose_name_plural = 'categories'
    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(Category, self).save(*args, **kwargs)

class Post(models.Model):
    title = models.CharField(max_length=400)
    slug = models.SlugField(max_length=400, unique=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = URLField()
    categories = models.ManyToManyField(Category)
    date = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    # leave on number of views for now

    tags = TaggableManager()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(Post, self).save(*args, **kwargs)

    def __str__(self):
        return self.title