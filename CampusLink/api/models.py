from django.db import models
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
    email_verified = models.BooleanField(default=False)

    password = models.CharField(max_length=128, default="")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    GroupMeAuth = models.CharField(max_length=500, default="")

    objects = CustomUserManager()

    USERNAME_FIELD = "UserEmail"
    REQUIRED_FIELDS = []

    def get_email_field_name(self):
        return "UserEmail"

    def str(self):
        return self.UserName


class Calendar(models.Model):
    Events = models.ManyToManyField("Event", blank=True)

    def __str__(self):
        return self.Events


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
    calendarCreated = models.BooleanField(default=False)
    calendar = models.ForeignKey(
        Calendar,
        related_name="calendar",
        default=None,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.Name


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(null=True)
    start = models.DateField()
    end = models.DateField()
    color = models.CharField(max_length=100, default="#3174ad")
    isPrivate = models.BooleanField(default=False)


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
    abbreviation = models.CharField(max_length=500)
    name = models.CharField(max_length=500)

    def __str__(self):
        return f"{self.abbreviation} - {self.name}"
