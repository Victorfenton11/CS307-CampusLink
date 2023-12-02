from rest_framework import serializers
from .models import ClassLocation, User, Circle, Event, Calendar, Class


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


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"


class CalendarSerializer(serializers.ModelSerializer):
    Events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = "__all__"


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ("abbreviation", "name")


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
