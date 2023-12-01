from django.db import models
from django.utils.text import slugify
from django.db.models import URLField
from django.shortcuts import reverse
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
import random


# Create your models here.
class ClassLocation(models.Model):
    acronym = models.CharField(max_length=6, unique=True)
    building_name = models.CharField(max_length=100, unique=True)


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(UserEmail=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    majorValue = "Your Major"
    interestValue = "Your Interest"
    UserID = models.AutoField(primary_key=True, unique=True)
    Name = models.CharField(max_length=500)
    UserName = models.CharField(max_length=500, unique=True)
    UserEmail = models.EmailField(max_length=500, unique=True)
    PhotoFileName = models.CharField(max_length=500, null=True)
    PhoneNumber = models.CharField(max_length=15, blank=True, null=True)
    Major = models.CharField(max_length=500, default=majorValue)
    Interest = models.CharField(max_length=1000, default=interestValue)
    friends = models.ManyToManyField("User", blank=True)
    securityQuestion = models.CharField(max_length=500, blank=True, null=True)
    securityAnswer = models.CharField(max_length=500, blank=True, null=True)
    isPrivate = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    Circles = models.ManyToManyField("Circle", blank=True)

    UserAnonymous = models.BooleanField(default=False)
    UserNameAnonymous = models.BooleanField(default=False)
    UserEmailAnonymous = models.BooleanField(default=False)
    UserPhoneNumberAnonymous = models.BooleanField(default=False)
    UserMajorAnonymous = models.BooleanField(default=False)

    password = models.CharField(max_length=128, default="")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "UserEmail"
    REQUIRED_FIELDS = []

    def str(self):
        return self.UserName


class Circle(models.Model):
    Name = models.CharField(max_length=100)
    Description = models.CharField(max_length=1000, default="")
    owner = models.ForeignKey(
        User,
        related_name="owner",
        on_delete=models.CASCADE,
        default=None,
        null=True,
        blank=True,
    )
    users = models.ManyToManyField("User", blank=True)
    groupChatCreated = models.BooleanField(default=False)
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.Name


class CircleJoinRequest(models.Model):
    from_circle = models.ForeignKey(
        Circle, related_name="circle_join", on_delete=models.CASCADE
    )
    to_user = models.ForeignKey(
        User, related_name="received_invitations", on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10, choices=[("PENDING", "Pending"), ("ACCEPTED", "Accepted")]
    )


class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        User, related_name="sent_requests", on_delete=models.CASCADE
    )
    to_user = models.ForeignKey(
        User, related_name="received_requests", on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10, choices=[("PENDING", "Pending"), ("ACCEPTED", "Accepted")]
    )


class Class(models.Model):
    abbreviation = models.CharField(max_length=10)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.abbreviation} - {self.name}"


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
    creator = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="creator_threads"
    )
    topic = models.CharField(max_length=32, choices=TOPIC_CHOICES, default=1)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    replyCount = models.IntegerField(default=0)
    anonymous = models.BooleanField(default=False)

    def __str__(self):
        return f"Thread {self.subject}  is created by {self.creator.UserName}."


class Post(models.Model):
    content = models.TextField()
    thread = models.ForeignKey(
        "Thread", on_delete=models.CASCADE, related_name="thread_posts"
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="creator_posts"
    )
    anonymous = models.BooleanField(default=False)

    def __str__(self):
        return f"Post of {self.thread.subject} is posted by {self.creator.UserName}."  # this is now modified
