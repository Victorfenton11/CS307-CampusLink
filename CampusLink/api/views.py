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
        if location:
            for word in location.split():
                if len(word) > 1 and len(word) < 5:
                    queryResult = ClassLocation.objects.filter(acronym=word)
                    word = word.upper()
                    if len(queryResult) > 0:
                        data = ClassLocationSerializer(queryResult[0]).data
                        building = data['building_name']
                        if '(' in building:
                            data['building_name'] = building[:building.index('(')-1] + building[building.index(')')+1:]
                        data['building_name'] = data['building_name'] + " Purdue University"
                    elif (word[0] == 'B' or word[0] == 'G' or word[0].isdigit()) and word[1:].isnumeric():
                        if word[0] == 'B':
                            data['floor'] = 'Basement'
                        elif word[0] == 'G':
                            data['floor'] = 'Ground Floor'
                        else:
                            data['floor'] = word[0]
                        data['room'] = word[1:]
        return Response(data, status=status.HTTP_200_OK)
            