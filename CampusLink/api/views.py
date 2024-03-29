from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    ClassLocationSerializer,
    UserSerializer,
    FriendSerializer,
    CircleSerializer,
    ClassSerializer,
)
from .models import ClassLocation, User, Class, FriendRequest, Circle, Post, Thread
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
import requests
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
            user = serializer.save(email_verified=False)
            send_verification_email(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def send_verification_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.UserID))
    verification_link = f"http://localhost:8080/verify-email/{uid}/{token}"
    send_mail(
        "Verify Your Email",
        f"Please verify your email by clicking on this link: {verification_link}",
        "campuslinkhelp@gmail.com",
        [user.UserEmail],
        fail_silently=False,
    )


@api_view(["GET"])
def verify_email(request, uidb64, token):
    print("verify_email view called")  # Indicate that the view has been called
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        print(f"Decoded UID: {uid}")  # Print the decoded UID

        user = User.objects.get(pk=uid)
        print(f"User retrieved: {user}")  # Print information about the user

        if default_token_generator.check_token(user, token):
            user.email_verified = True
            user.save()
            return Response(
                {"message": "Email verified successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Invalid verification link"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
        return Response(
            {"message": "Invalid verification link"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def create_circle(request):
    members = request.data.get("users").split(",")
    ownerID = request.data.get("ownerID")
    owner = User.objects.get(UserID=ownerID)

    userObjs = [owner]
    for user in members:
        obj = User.objects.get(UserName=user)
        userObjs.append(obj)

    circle = {
        "Name": request.data.get("Name"),
        "Description": request.data.get("Description"),
        "owner": None,
        "users": None,
        "public": True if request.data.get("public") == "true" else False,
    }
    serializer = CircleSerializer(data=circle)
    if serializer.is_valid():
        created_circle = serializer.save()
        created_circle.owner = owner
        created_circle.users.set(userObjs)
        created_circle.save()
        for user in userObjs:
            user.Circles.add(created_circle)
            user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["DELETE"])
def delete_user(request, user_id):
    try:
        user = User.objects.get(email=user_id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# handles POST request to save class list
@csrf_exempt
def save_class_list(request):
    if request.method == "POST":
        class_list = JSONParser().parse(request)["classList"]
        # class_list = request.POST.getlist('classList[]')
        # print(len(class_list))
        # Class.objects.all().delete()   # Delete all existing classes
        for i in range(len(class_list)):
            abbr = class_list[i]["Title"]
            num = class_list[i]["Number"]
            class_data = Class(abbreviation=abbr, name=num)
            class_data.save()
        return JsonResponse({"success": True})
    else:
        return JsonResponse({"success": False, "error": "Invalid request method"})


@csrf_exempt
def getClasses(request):
    if request.method == "GET":
        class_data = Class.objects.all()
        class_serializer = ClassSerializer(class_data, many=True)
        return JsonResponse(class_serializer.data, safe=False)


def getFriends(request, id):
    if request.method == "GET" and id != 0:
        user = User.objects.get(UserID=id)
        friend_serializer = FriendSerializer(user, many=False)
        return JsonResponse(friend_serializer.data, safe=False)


def getCircles(request, id):
    if request.method == "GET" and id != 0:
        user = User.objects.get(UserID=id)
        circle_serializer = CircleSerializer(user.Circles.all(), many=True)
        return JsonResponse(circle_serializer.data, safe=False)


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


class joinCircle(APIView):
    lookup_ID_kwarg = "id"

    def get(self, request, format=None):
        id = request.GET.getlist(self.lookup_ID_kwarg)

        try:
            user = User.objects.get(UserID=id[0])
            circle = Circle.objects.get(id=id[1])

            # Check if the user is already part of the circle
            if user in circle.users.all():
                return JsonResponse(
                    "User is already a member of this circle", status=400, safe=False
                )

            # Add the user to the circle and save
            circle.users.add(user)
            circle.save()

            # Update user's circles and save
            user.Circles.add(circle)
            user.save()

            return JsonResponse("User joined the circle successfully", safe=False)

        except User.DoesNotExist:
            return JsonResponse("User does not exist", status=404, safe=False)
        except Circle.DoesNotExist:
            return JsonResponse("Circle does not exist", status=404, safe=False)
        except:
            return JsonResponse("Could not join circle", status=404, safe=False)


class deleteCircle(APIView):
    lookup_ID_kwarg = "id"

    def get(self, request, format=None):
        try:
            id = request.GET.getlist(self.lookup_ID_kwarg)
            user = User.objects.get(UserID=id[0])
            circle = Circle.objects.get(id=id[1])
            # Todo add owner/admin field to circles and check only owner can delete
            for member in circle.users.all():
                member.Circles.remove(circle)
            circle.delete()
            return JsonResponse("Circle Deleted Successfully", safe=False)
        except Exception as e:
            return Response(
                {"message": "Circle could not be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class getGroupMeAuth(APIView):
    lookup_ID_kwarg = "id"

    def get(self, request, format=None):
        try:
            id = request.GET.get(self.lookup_ID_kwarg)
            user = User.objects.get(UserID=id)

            if user.GroupMeAuth == "":
                context = {
                    "UserID": id,
                }
                return render(request, "redirectGroupMe.html", context)

            return Response(
                user.GroupMeAuth,
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {"message": "Group chat for Circle could not be created."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AuthenticateGroupMe(APIView):
    def get(self, request, format=None):
        try:
            code = request.GET.get("code")  # Extract 'code' parameter from URL
            UserID = request.GET.get("state")  # Extract 'state' parameter as user ID

            token_endpoint = "https://oauth.groupme.com/oauth/token"
            client_id = "vWKMOdPNN11WyX5tW0rJ8jkJBokJidezS8myiHCIChiUmYK6"
            redirect_uri = "http://localhost:8080/api/authenticate-groupme"  # Should match your redirect URI

            payload = {
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
                "code": code,
            }

            res = requests.post(token_endpoint, data=payload)
            access_token = res.json().get("access_token")

            headers = {
                "X-Access-Token": access_token,
                "Content-Type": "application/json",
            }

            response = requests.get(
                "https://api.groupme.com/v3/users/me", headers=headers
            )

            # Update user model with the obtained authentication token
            user = User.objects.get(UserID=int(UserID))
            user.GroupMeAuth = access_token
            user.GroupMeId = response.json()["response"]["id"]
            user.save()

            return redirect("http://localhost:8080/login")
        except Exception as e:
            return Response(
                {"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )


class SetGroupChatCreated(APIView):
    lookup_ID_kwarg = "id"

    def get(self, request, format=None):
        try:
            id = request.GET.get(self.lookup_ID_kwarg)
            circle = Circle.objects.get(id=id)

            circle.groupChatCreated = True
            circle.save()

            return Response(
                {"message": "Successfully set Group Chat Created"},
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {"message": "Group chat for Circle could not be created."},
                status=status.HTTP_400_BAD_REQUEST,
            )


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
    try:
        thread = Thread.objects.get(pk=thread_id)
    except thread.DoesNotExist:
        content = {"The Thread does not exist."}
        return Response(content)

    # print(thread)

    thread = Thread.objects.get(pk=thread_id)
    serializer = ThreadSerializer(thread, many=False)

    # print(serializer.data)

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
    # print("HELLO")
    data = json.loads(request.body)
    # print(data)
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
    anonymous = data["anonymous"]

    # print(anonymous)

    new_thread = Thread(
        subject=subject,
        content=content,
        creator=User.objects.get(pk=userID),
        topic=topic,
        anonymous=True if anonymous == True else False,
    )
    new_thread.save()
    # print("The new anonymous")
    # print(new_thread.anonymous)

    serializer = ThreadSerializer(new_thread, many=False)
    return Response(serializer.data)


# PROBLEM RESOLVED
@api_view(["POST"])
def createPost(request):
    data = json.loads(request.body)
    # print(data)
    # handle unauthenticated user or invalid user
    try:
        userID = data["creator"]["UserID"]
    except TypeError:
        return Response(
            {"res": "Unauthenticated user"}, status=status.HTTP_401_UNAUTHORIZED
        )

    content = data["content"]
    threadID = data["thread"]
    anonymous = data["anonymous"]

    # update reply count of the assoicated thread
    thread = Thread.objects.get(pk=threadID)
    thread.replyCount += 1
    thread.save()
    # print(thread.replyCount)

    # create new post object
    new_post = Post(
        content=content,
        creator=User.objects.get(pk=userID),
        thread=thread,
        anonymous=True if anonymous == True else False,
    )
    print(new_post)
    new_post.save()
    # print("Save post successfully")

    serializer = PostSerializer(new_post, many=False)
    # print(serializer.data)
    return Response(serializer.data)


# delete all the following comments
@api_view(["DELETE"])
def deleteAllPosts(request):
    Post.objects.all().delete()
    return Response({"message": "All posts deleted."})


# delete one comment on a thread
@api_view(["DELETE"])
def deletePost(request):
    try:
        post_id = request.META.get("HTTP_POST_ID")
        post = Post.objects.get(id=post_id)
        post.delete()
        return Response({"message": "Post deleted."})
    except Post.DoesNotExist:
        return Response({"error": "Post not found."}, status=404)


# GET THREADS BY TOPIC
@api_view(["GET"])
def getThreadsTopic(request, topic_id):
    # print("Hello")
    paginator = PageNumberPagination()
    paginator.page_size = 10

    # get threads by topic
    threads = Thread.objects.filter(topic=topic_id).all().order_by("-updated")

    result_page = paginator.paginate_queryset(threads, request)
    serializer = ThreadSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)
