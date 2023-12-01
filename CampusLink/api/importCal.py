from ics import Calendar, Event
import requests
import arrow
import pandas as pd
import numpy as np
from .models import Event, Upload
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UploadSerializer, EventSerializer
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

@csrf_exempt
def UploadURL(request, id):
    print("We reach this stage")
    if request.method=='POST':
        url_data=JSONParser().parse(request)
        url_val = url_data['url']
        if url_val.endswith('ics'):
            upload_serializer=UploadSerializer(data=url_data)
            if upload_serializer.is_valid():
                upload_serializer.save()
                url = upload_serializer.data['url']
                parseURL(url)
                return JsonResponse("Added Successfully",safe=False)
        return JsonResponse("Failed to Add",safe=False)

def parseURL(url):
    cal = Calendar(requests.get(url).text)
    for i in range(len(list(cal.timeline))):
    #for i in range(3):
      e = list(cal.timeline)[i]
      event_data = Event(title=e.name, start=e.begin.datetime.date(), end = e.end.datetime.date())
      print(e.begin)
      event_data.save()
    #return JsonResponse("Done", safe=False)
#parseURL('https://calendar.google.com/calendar/ical/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/public/basic.ics')
def getEvents(request):
      event = Event.objects.all()
      event_serializer = EventSerializer(event, many=True)
      #print(event_serializer.data)
      return JsonResponse(event_serializer.data, safe=False)