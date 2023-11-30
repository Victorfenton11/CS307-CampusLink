from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Thread, Post, User
from api.models import ClassLocation, User, Class

class ClassLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassLocation
        fields = ('acronym', 'building_name')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields= '__all__'

class FriendSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields=('UserID', 'Name', 'friends')




# create serializer for Posts and Details
class ThreadSerializer(ModelSerializer):
    creator_id = serializers.SerializerMethodField('creator_id')

    def creator_id(self):
        creator_id = serializers.IntegerField()
        return creator_id 

    creator = serializers.CharField()

    created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")

    class Meta:
        model = Thread
        fields = ("id",
                    "creator",
                    "created",
                    "subject",
                    "content",
                    "topic",
                    "updated",
                    "replyCount",
                    "creator_id",
                    "anonymous")


class PostSerializer(ModelSerializer):
    creator_id = serializers.SerializerMethodField('creator_id')

    def creator_id(self):
        creator_id = serializers.IntegerField()
        return creator_id 

    creator = serializers.CharField()
    created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    updated = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = Post
        fields = (("id",
                    "creator",
                    "created",
                    "content",
                    "updated",
                    "thread",
                    "creator_id",
                    "anonymous"))
