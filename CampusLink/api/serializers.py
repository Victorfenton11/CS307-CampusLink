from rest_framework import serializers
from .models import ClassLocation

class ClassLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassLocation
        fields = ('acronym', 'building_name')