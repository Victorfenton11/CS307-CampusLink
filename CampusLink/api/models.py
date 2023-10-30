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
    UserName = models.CharField(max_length=500,unique=True)
    UserEmail = models.CharField(max_length=500,unique=True)
    PhotoFileName = models.CharField(max_length=500, null=True)
    Major = models.CharField(max_length=500, default = majorValue)
    Interest = models.CharField(max_length=1000, default = interestValue)
    securityQuestion = models.CharField(max_length=500, blank=True, null=True)
    securityAnswer = models.CharField(max_length=500, blank=True, null=True)
    friends = models.ManyToManyField("User", blank=True)
    isPrivate = models.BooleanField(default=False)

    def str(self):
        return self.UserName

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=[('PENDING', 'Pending'), ('ACCEPTED', 'Accepted')])
    
class Class(models.Model):
    abbreviation = models.CharField(max_length=10)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.abbreviation} - {self.name}'