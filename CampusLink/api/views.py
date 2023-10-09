from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .serializers import ClassLocationSerializer
from .models import ClassLocation

class ClassLocationView(generics.ListAPIView):
    queryset = ClassLocation.objects.all()
    serializer_class = ClassLocationSerializer