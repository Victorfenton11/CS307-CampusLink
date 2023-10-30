import pandas as pd
import numpy as np
from sklearn.feature_extraction import text
from sklearn.metrics.pairwise import cosine_similarity
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ClassLocationSerializer, UserSerializer, FriendSerializer
from .models import ClassLocation, User, Class
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
import json
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from django.core.files.storage import default_storage
from django.core.mail import BadHeaderError, send_mail
from django.http import HttpResponse, HttpResponseRedirect

@csrf_exempt
def userApi(request,id=0):
    if request.method=='GET' and id !=0:
        user = User.objects.get(UserID=id)
        user_serializer = UserSerializer(user, many=False)
        return JsonResponse(user_serializer.data, safe=False)
    elif request.method=='GET':
        user = User.objects.all()
        user_serializer = UserSerializer(user, many=True)
        return JsonResponse(user_serializer.data, safe=False)
    elif request.method=='POST':
        user_data=JSONParser().parse(request)
        user_serializer=UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Added Successfully",safe=False)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='PUT':
        user_data=JSONParser().parse(request)
        user=User.objects.get(UserID=user_data['UserID'])
        user_serializer=UserSerializer(user,data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    elif request.method=='DELETE':
        user=User.objects.get(UserID=id)
        user.delete()
        return JsonResponse("Deleted Successfully",safe=False)
    
def getAllUsers(request, id):
    if request.method=='GET':
        user = User.objects.all()
        user_serializer = UserSerializer(user, many=True)
        return JsonResponse(user_serializer.data, safe=False)

interest = User.objects.values_list('Interest', flat=True)[0]
data = pd.DataFrame(interest, columns=['interest'])
captions = data['interest'].tolist()
uni_tfidf = text.TfidfVectorizer(input=captions, stop_words="english")
uni_matrix = uni_tfidf.fit_transform(captions)
uni_sim = cosine_similarity(uni_matrix)

def recommend_post(x):
  return ", ".join(pd.DataFrame(interest, columns=['interest']).loc[x.argsort()[-5:-1]])

data["Recommended Post"] = [recommend_post(x) for x in uni_sim]
