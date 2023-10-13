from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ClassLocationSerializer
from .models import ClassLocation

class ClassLocationView(generics.ListAPIView):
    queryset = ClassLocation.objects.all()
    serializer_class = ClassLocationSerializer

class GetClassLocation(APIView):
    serializer_class = ClassLocationSerializer
    lookup_url_kwarg = 'location'

    def get(self, request, format=None):
        location = request.GET.get(self.lookup_url_kwarg)
        data = {}
        campus = False
        if location:
            words = location.split()
            for i in range(len(words)):
                queryResult = ClassLocation.objects.filter(acronym=words[i])
                word = words[i].upper()
                if len(queryResult) > 0:
                    campus = True
                    data = ClassLocationSerializer(queryResult[0]).data
                    building = data['building_name']
                    if '(' in building and ')' in building:
                        data['building_name'] = building[:building.index('(')-1] + building[building.index(')')+1:]
                    data['building_name'] = data['building_name'] + " Purdue University"
                elif campus and i + 1 != len(words) and len(word) == 1 and words[i+1].isnumeric():
                    word = word.upper()
                    if word == 'B':
                        data['floor'] = 'Basement'
                    elif word == 'G':
                        data['floor'] = 'Ground Floor'
                    else:
                        data['floor'] = word[0]
                    data['room'] = words[i+1]
                    break
                elif campus and (word[0] == 'B' or word[0] == 'G' or word[0].isdigit()):
                    if word[0] == 'B':
                        data['floor'] = 'Basement'
                    elif word[0] == 'G':
                        data['floor'] = 'Ground Floor'
                    else:
                        data['floor'] = word[0]
                    data['room'] = word
                    break
        return Response(data, status=status.HTTP_200_OK)
            