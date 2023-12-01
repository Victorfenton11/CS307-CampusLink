from rest_framework import serializers
from .models import ClassLocation, User, Upload, Event, Class

class ClassLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassLocation
        fields = ('acronym', 'building_name')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('UserID','Name', 'Password', 'UserName', 'UserEmail', 'Interest', 'Major', 'PhotoFileName', 'isPrivate')

class FriendSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields=('UserID', 'Name', 'friends')

class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model=Upload
        fields=('UserID','url')

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields=('title','description', 'start', 'end')

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model=Class
        fields=('abbreviation','name')
