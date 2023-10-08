from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from api.models import User
import json
from api.serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes

from django.core.files.storage import default_storage


# Create your views here.
def main(request):
    return HttpResponse("<h1>CampusLink</h1>")

@api_view(['GET'])
def getAccount(request,id):
    user = User.objects.get(UserId=id)
    user_serializer = UserSerializer(user, many=False)
    return JsonResponse(user_serializer.data, safe=False)

@csrf_exempt
def userApi(request,id=0):
    if request.method=='GET' and id !=0:
        user = User.objects.get(UserId=id)
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
        user=User.objects.get(UserId=user_data['UserId'])
        user_serializer=UserSerializer(user,data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    elif request.method=='DELETE':
        user=User.objects.get(UserId=id)
        user.delete()
        return JsonResponse("Deleted Successfully",safe=False)

@csrf_exempt
def SaveFile(request):
    file=request.FILES['file']
    file_name=default_storage.save(file.name,file)
    return JsonResponse(file_name,safe=False)
