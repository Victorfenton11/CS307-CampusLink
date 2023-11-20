from ics import Calendar, Event
import requests
import arrow
import pandas as pd
import numpy as np
from .models import Event
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse


# Parse the URL
url = "https://calendar.google.com/calendar/ical/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/public/basic.ics"
cal = Calendar(requests.get(url).text)

# Print all the events
print(cal.events)
events = cal.events
sorted_events = sorted(events, reverse = True)
print(type(sorted_events))
for event in sorted_events:
    print(type(event))
#sorted_events
e = list(cal.timeline)[0]
print(e.name)
print(e.begin)

calendar = Calendar()

def addEvent(request):
    event_data = Event.objects.create(title=e.name, start_time=e.begin, end_time = e.end)
    return JsonResponse("Done")


#Add Event to ics
tz = 'Europe/Paris'
first_day = arrow.get("2022-02-14").replace(tzinfo=tz)
last_day = arrow.get("2022-02-18").replace(tzinfo=tz)
 
for day in arrow.Arrow.range('day', first_day, last_day):
    event = Event()
    event.name = "Working on the task"
    event.begin = day.replace(hour=8).to('utc').datetime
    event.end = day.replace(hour=10).to('utc').datetime
    event.transparent = False
    calendar.events.add(event)
 
    event = Event()
    event.name = "Continue on the task?"
    event.begin = day.replace(hour=10).to('utc').datetime
    event.end = day.replace(hour=11).to('utc').datetime
    event.transparent = True
    calendar.events.add(event)


#print(calendar)
'''
events = []
in_event = False
lines = calendar.split('\n')
for line in lines:
  if line == 'BEGIN:VEVENT':
    event = {}
    in_event = True
    continue
  if line == 'END:VEVENT':
    events.append(event)
    in_event = False
    continue
  if in_event:
    key,val = line.split(':')
    event[key]= val
for event in events:
  print(event)
  '''