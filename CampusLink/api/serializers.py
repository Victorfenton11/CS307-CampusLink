from rest_framework import serializers
from .models import ClassLocation, User

class ClassLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassLocation
        fields = ('acronym', 'building_name')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('UserID','Name', 'Password', 'UserName', 'UserEmail', 'Interest', 'Major', 'PhotoFileName')