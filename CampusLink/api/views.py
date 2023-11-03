from django.shortcuts import render, redirect
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ClassLocationSerializer, UserSerializer, FriendSerializer
from .models import ClassLocation, User, Class, FriendRequest
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from django.core.mail import BadHeaderError, send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str, force_bytes


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
        return JsonResponse("Failed to Update", safe=False)
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


@csrf_exempt
def incoming_requests(request, user_id):
    try:
        user = User.objects.get(UserID=user_id)
        incoming = FriendRequest.objects.filter(to_user=user)
        requests_data = [
            {
                "from_user": {"UserName": req.from_user.UserName},
                "timestamp": req.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for req in incoming
        ]
        return JsonResponse(requests_data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


class addFriend(APIView):
    lookup_ID_kwarg = "id"

    def get(self, request, format=None):
        # fix this, should be able to search by name not ID
        # print("lookup_ID_kwarg:", self.lookup_ID_kwarg)
        id = request.GET.getlist(self.lookup_ID_kwarg)
        # print("id:", id[0])
        user = User.objects.get(UserID=id[0])
        friend = User.objects.get(UserName=id[1])
        # user.friends.add(friend)
        if FriendRequest.objects.filter(from_user=user, to_user=friend).exists():
            print("Friend request already sent")
            return JsonResponse("Friend request already sent", safe=False)

        # Create a new friend request
        friend_request = FriendRequest(from_user=user, to_user=friend, status="Pending")
        friend_request.save()
        print("Friend Request Sent")
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
        friend.friends.remove(user)
        # user_serializer=UserSerialier(data=user_data)
        return JsonResponse("Friend Removed Successfully", safe=False)


class GetUserbyEmail(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = "email"

    def get(self, request, format=None):
        email = request.GET.get(self.lookup_url_kwarg)
        data = {}
        if email:
            queryResult = User.objects.filter(UserEmail=email)
            if len(queryResult) > 0:
                data = UserSerializer(queryResult[0]).data
                return Response(data, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_200_OK)


@csrf_exempt
def accept_friend_request(request, user_id, user_name):
    try:
        print(user_id)
        print(user_name)
        current_user = User.objects.get(UserID=user_id)
        friend_requesting_user = User.objects.get(UserName=user_name)
        friend_request = FriendRequest.objects.get(
            from_user=friend_requesting_user, to_user=current_user
        )

        if friend_request:
            current_user.friends.add(friend_request.from_user)
            friend_requesting_user.friends.add(friend_request.to_user)
            current_user.save()
            friend_request.delete()

            return JsonResponse({"message": "Friend request accepted."}, status=200)
        else:
            return JsonResponse({"error": "Request not found."}, status=404)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    except FriendRequest.DoesNotExist:
        return JsonResponse({"error": "Friend request not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def decline_friend_request(request, user_id, user_name):
    try:
        print(user_id)
        print(user_name)
        current_user = User.objects.get(UserID=user_id)
        friend_requesting_user = User.objects.get(UserName=user_name)
        friend_request = FriendRequest.objects.get(
            from_user=friend_requesting_user, to_user=current_user
        )

        if friend_request:
            friend_request.delete()

            return JsonResponse({"message": "Friend request declined."}, status=200)
        else:
            return JsonResponse({"error": "Request not found."}, status=404)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    except FriendRequest.DoesNotExist:
        return JsonResponse({"error": "Friend request not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
def get_security_question(request):
    uid = request.data.get("uid")
    token = request.data.get("token")
    data = {}
    if uid:
        uid = urlsafe_base64_decode(uid)
        user = User.objects.get(UserID=uid)
        if user and default_token_generator.check_token(user, token):
            data = UserSerializer(user).data
            return Response(data, status=status.HTTP_200_OK)
    return Response(data, status=status.HTTP_200_OK)


class ResetPassword(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = "email"

    def get(self, request, format=None):
        email = request.GET.get(self.lookup_url_kwarg)
        data = {}
        if email:
            try:
                queryResult = User.objects.get(UserEmail=email)
                token = default_token_generator.make_token(queryResult)
                uid = urlsafe_base64_encode(force_bytes(queryResult.UserID))
                send_mail(
                    "Password Reset",
                    f"Click the link to reset your password:\n http://localhost:8080/password-reset-confirm/{uid}/{token}",
                    "campuslinkhelp@gmail.com",
                    [email],
                    fail_silently=False,
                )
                data = UserSerializer(queryResult).data
                return Response(data, status=status.HTTP_200_OK)
            except:
                pass
        return Response(data, status=status.HTTP_200_OK)
