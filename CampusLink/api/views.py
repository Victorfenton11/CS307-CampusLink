from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ClassLocationSerializer, UserSerializer, FriendSerializer, ClassSerializer
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

@api_view(['GET'])
def getAccount(request,id):
    user = User.objects.get(UserID=id)
    user_serializer = UserSerializer(user, many=False)
    return JsonResponse(user_serializer.data, safe=False)

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

def userNameApi(request,username):
    if request.method=='GET' and username !='9999':
        user = User.objects.get(UserName=username)
        user_serializer = UserSerializer(user, many=False)
        return JsonResponse(user_serializer.data, safe=False)

@csrf_exempt
def SaveFile(request):
    file=request.FILES['file']
    file_name=default_storage.save(file.name,file)
    return JsonResponse(file_name,safe=False)

@api_view(['POST'])
def create_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def delete_user(request, user_email):
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# handles POST request to save class list
@csrf_exempt
def save_class_list(request):
    if request.method == 'POST':
        class_list=JSONParser().parse(request)["classList"]
        #class_list = request.POST.getlist('classList[]')
        #print(len(class_list))
        #Class.objects.all().delete()   # Delete all existing classes
        for i in range(len(class_list)):
            abbr = class_list[i]["Title"]
            num = class_list[i]["Number"]
            class_data = Class(abbreviation=abbr, name = num)
            class_data.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})

@csrf_exempt
def getClasses(request):
    if request.method=='GET':
        class_data = Class.objects.all()
        class_serializer = ClassSerializer(class_data, many=True)
        return JsonResponse(class_serializer.data, safe=False)

def getFriends(request, id): 
    if request.method=='GET' and id !=0:
        user = User.objects.get(UserID=id)
        friend_serializer = FriendSerializer(user, many=False)
        return JsonResponse(friend_serializer.data, safe=False)

class addFriend(APIView):
    lookup_ID_kwarg = 'id'

    def get(self, request, format=None):
        # fix this, should be able to search by name not ID
        id = request.GET.getlist(self.lookup_ID_kwarg)
        user = User.objects.get(UserID=id[0])
        friend = User.objects.get(UserName=id[1])
        user.friends.add(friend)
        # user_serializer=UserSerialier(data=user_data)
        return JsonResponse("Friend Added Successfully", safe=False)

class removeFriend(APIView):
    lookup_ID_kwarg = 'id'

    def get(self, request, format=None):
        # fix this, should be able to search by name not ID
        id = request.GET.getlist(self.lookup_ID_kwarg)
        #friendID = str(request.GET.get(self.lookup_friend_kwarg))[0]
        user = User.objects.get(UserID=id[0])
        friend = User.objects.get(UserName=id[1])
        user.friends.remove(friend)
        # user_serializer=UserSerialier(data=user_data)
        return JsonResponse("Friend Removed Successfully", safe=False)
    
class GetUserbyEmail(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'email'

    def get(self, request, format=None):
        email = request.GET.get(self.lookup_url_kwarg)
        data = {}
        if email:
            queryResult = User.objects.filter(UserEmail=email)
            if len(queryResult) > 0:
                data = UserSerializer(queryResult[0]).data
                return Response(data, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_200_OK)
