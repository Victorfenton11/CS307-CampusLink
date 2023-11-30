from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Thread, Post, User
from api.models import ClassLocation, User, Circle, Class

class ClassLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassLocation
        fields = ("acronym", "building_name")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class FriendSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields=('UserID', 'Name', 'friends')