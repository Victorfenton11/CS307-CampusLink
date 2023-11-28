from rest_framework import serializers
from .models import ClassLocation, User, Circle


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
        fields = ("UserID", "Name", "friends")


class CircleSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=False, read_only=True)
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Circle
        fields = (
            "id",
            "Name",
            "Description",
            "owner",
            "users",
            "groupChatCreated",
            "public",
        )
