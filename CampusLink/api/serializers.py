from rest_framework import serializers
from api.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('UserId','Name', 'password', 'UserName', 'userEmail', 'PhotoFileName')

class FriendSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields=('UserId', 'Name', 'friends')