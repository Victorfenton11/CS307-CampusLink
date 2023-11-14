from django.shortcuts import render, get_object_or_404, redirect
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ClassLocationSerializer, UserSerializer, FriendSerializer
from .models import ClassLocation, User, Class, Post, Thread
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.models import Class
from django.views.static import serve

from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from django.core.mail import BadHeaderError, send_mail

from rest_framework.decorators import api_view
from .serializers import ThreadSerializer, PostSerializer
import json
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ObjectDoesNotExist


class ClassLocationView(generics.ListAPIView):
    queryset = ClassLocation.objects.all()
    serializer_class = ClassLocationSerializer


class GetClassLocation(APIView):
    serializer_class = ClassLocationSerializer
    lookup_url_kwarg = "location"

    def get(self, request, format=None):
        location = request.GET.get(self.lookup_url_kwarg)
        data = {}
        campus = False
        if location:
            words = location.split()
            if len(words) > 3:
                return Response(data, status=status.HTTP_200_OK)
            for i in range(len(words)):
                queryResult = ClassLocation.objects.filter(acronym=words[i])
                word = words[i].upper()
                if len(queryResult) > 0:
                    campus = True
                    data = ClassLocationSerializer(queryResult[0]).data
                    building = data["building_name"]
                    if "(" in building and ")" in building:
                        data["building_name"] = (
                            building[: building.index("(") - 1]
                            + building[building.index(")") + 1 :]
                        )
                elif (
                    i + 1 != len(words) and len(word) == 1 and words[i + 1].isnumeric()
                ):
                    word = word.upper()
                    if word == "B":
                        data["floor"] = "Basement"
                    elif word == "G":
                        data["floor"] = "Ground Floor"
                    else:
                        data["floor"] = word[0]
                elif word[0] == "B" or word[0] == "G" or word[0].isdigit():
                    try:
                        # if the floor was already set by another word
                        data["floor"]
                        continue
                    except:
                        if word[0] == "B":
                            data["floor"] = "Basement"
                        elif word[0] == "G":
                            data["floor"] = "Ground Floor"
                        else:
                            data["floor"] = word[0]
                    data["room"] = word
            if not campus:
                return Response({}, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
def getAccount(request, id):
    user = User.objects.get(UserID=id)
    user_serializer = UserSerializer(user, many=False)
    return JsonResponse(user_serializer.data, safe=False)


@csrf_exempt
def userApi(request, id=0):
    if request.method == "GET" and id != 0:
        user = User.objects.get(UserID=id)
        user_serializer = UserSerializer(user, many=False)
        return JsonResponse(user_serializer.data, safe=False)
    elif request.method == "GET":
        user = User.objects.all()
        user_serializer = UserSerializer(user, many=True)
        return JsonResponse(user_serializer.data, safe=False)
    elif request.method == "POST":
        user_data = JSONParser().parse(request)
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Added Successfully", safe=False)
        return JsonResponse("Failed to Add", safe=False)
    elif request.method == "PUT":
        user_data = JSONParser().parse(request)
        user = User.objects.get(UserID=user_data["UserID"])
        user_serializer = UserSerializer(user, data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Updated Successfully", safe=False)
        return JsonResponse("Failed to Update")
    elif request.method == "DELETE":
        user = User.objects.get(UserID=id)
        user.delete()
        return JsonResponse("Deleted Successfully", safe=False)


def userNameApi(request, username):
    if request.method == "GET" and username != "9999":
        user = User.objects.get(UserName=username)
        user_serializer = UserSerializer(user, many=False)
        return JsonResponse(user_serializer.data, safe=False)


@csrf_exempt
def SaveFile(request):
    file = request.FILES["file"]
    file_name = default_storage.save(file.name, file)
    return JsonResponse(file_name, safe=False)


@api_view(["POST"])
def create_user(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_user(request, user_email):
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# handles POST request to save class list
@csrf_exempt
def save_class_list(request):
    if request.method == "POST":
        class_list = request.POST.getlist("classList[]")
        Class.objects.all().delete()  # Delete all existing classes
        for class_data in class_list:
            class_obj = Class(**class_data)
            class_obj.save()
        return JsonResponse({"success": True})
    else:
        return JsonResponse({"success": False, "error": "Invalid request method"})


def getFriends(request, id):
    if request.method == "GET" and id != 0:
        user = User.objects.get(UserID=id)
        friend_serializer = FriendSerializer(user, many=False)
        return JsonResponse(friend_serializer.data, safe=False)


class addFriend(APIView):
    lookup_ID_kwarg = "id"

    def get(self, request, format=None):
        # fix this, should be able to search by name not ID
        id = request.GET.getlist(self.lookup_ID_kwarg)
        user = User.objects.get(UserID=id[0])
        friend = User.objects.get(UserName=id[1])
        user.friends.add(friend)
        # user_serializer=UserSerialier(data=user_data)
        return JsonResponse("Friend Added Successfully", safe=False)


class removeFriend(APIView):
    lookup_ID_kwarg = "id"

    def get(self, request, format=None):
        # fix this, should be able to search by name not ID
        id = request.GET.getlist(self.lookup_ID_kwarg)
        # friendID = str(request.GET.get(self.lookup_friend_kwarg))[0]
        user = User.objects.get(UserID=id[0])
        friend = User.objects.get(UserName=id[1])
        user.friends.remove(friend)
        # user_serializer=UserSerialier(data=user_data)
        return JsonResponse("Friend Removed Successfully", safe=False)


class ResetPassword(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = "email"

    def get(self, request, format=None):
        email = request.GET.get(self.lookup_url_kwarg)
        data = {}
        if email:
            queryResult = User.objects.filter(UserEmail=email)
            if len(queryResult) > 0:
                data = UserSerializer(queryResult[0]).data
                try:
                    send_mail(
                        "Password Reset",
                        "Click the link to reset your password.",
                        "campuslinkhelp@gmail.com",
                        [email],
                        fail_silently=False,
                    )
                except Exception:
                    return JsonResponse("Error sending email")
                return Response(data, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_200_OK)


# handles POST request to save class list
@csrf_exempt
def save_class_list(request):
    if request.method == "POST":
        class_list = request.POST.getlist("classList[]")
        Class.objects.all().delete()  # Delete all existing classes
        for class_data in class_list:
            class_obj = Class(**class_data)
            class_obj.save()
        return JsonResponse({"success": True})
    else:
        return JsonResponse({"success": False, "error": "Invalid request method"})


# handles GET request to get class list
# TODO: implement this


# for the POST pages
@api_view(["GET"])
def getThreads(request):
    # set pagination
    paginator = PageNumberPagination()
    paginator.page_size = 15
    threads = Thread.objects.all().order_by("-updated")
    result_page = paginator.paginate_queryset(threads, request)
    serializer = ThreadSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def getThread(request, thread_id):
    print("get Threads")
    try:
        thread = Thread.objects.get(pk=thread_id)
    except thread.DoesNotExist:
        content = {"The Thread does not exist."}
        return Response(content)

    thread = Thread.objects.get(pk=thread_id)
    serializer = ThreadSerializer(thread, many=False)

    return Response(serializer.data)


@api_view(["GET"])
def getPosts(request, thread_id):
    # set pagination
    paginator = PageNumberPagination()
    paginator.page_size = 10

    # get the thread
    thread = Thread.objects.get(pk=thread_id)

    # get all post belong to the given thread
    posts = thread.thread_posts.order_by("created").all()
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["POST"])
def createThread(request):
    print("Ni Hao")
    print(request)
    data = json.loads(request.body)
    print(data)
    # handle unauthenticated user or invalid user
    try:
        userID = data["creator"]["UserID"]
    except TypeError:
        return Response(
            {"res": "Unauthenticated user"}, status=status.HTTP_401_UNAUTHORIZED
        )

    subject = data["subject"]
    content = data["content"]
    topic = data["topic"][0]["value"]

    new_thread = Thread(
        subject=subject,
        content=content,
        creator=User.objects.get(pk=userID),
        topic=topic,
    )
    new_thread.save()

    serializer = ThreadSerializer(new_thread, many=False)
    print(serializer.data)
    return Response(serializer.data)


@api_view(["POST"])
def createPost(request):
    print("Hello from create post")
    # get the data
    data = json.loads(request.body)

    # handle unauthenticated user or invalid user
    try:
        userID = data["creator"]["UserID"]
    except TypeError:
        return Response(
            {"res": "Unauthenticated user"}, status=status.HTTP_401_UNAUTHORIZED
        )
    print(data)
    content = data["content"]
    threadID = data["thread"]

    # update reply count of the assoicated thread
    thread = Thread.objects.get(pk=threadID)
    thread.replyCount += 1
    thread.save()

    # create new post object
    new_post = Post(content=content, creator=User.objects.get(pk=userID), thread=thread)
    new_post.save()

    serializer = PostSerializer(new_post, many=False)
    return Response(serializer.data)
