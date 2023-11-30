from django.urls import path, re_path
from . import views
from .views import ClassLocationView, GetClassLocation
from django.conf.urls.static import static
from django.conf import settings
from .Recommendation import refresh

urlpatterns = [
    path("class-location", ClassLocationView.as_view()),
    path("get-class-location", GetClassLocation.as_view()),
    path("reset-password", ResetPassword.as_view()),
    re_path(r"^user$", userApi),
    re_path(r"^user/([0-9]+)$", userApi),
    re_path(r"^user/savefile", SaveFile),
    re_path(r"^users/([a-zA-Z0-9]+)$", userNameApi),
    path("user/create/", create_user, name="create-user"),
    path("circle/create/", create_circle),
    path("user/delete/<str:user_email>/", delete_user, name="delete-user"),
    path("save-class-list/", save_class_list, name="save_class_list"),
    re_path(r"^viewfriends/([0-9]+)$", getFriends),
    re_path(r"^viewcircles/([0-9]+)$", getCircles),
    re_path(
        r"^incoming-requests/([0-9]+)/$", incoming_requests, name="incoming_requests"
    ),
    re_path(r"^accept-friend-request/([0-9]+)/([\w-]+)$", accept_friend_request),
    re_path(
        r"^decline-friend-request/(?P<user_id>\d+)/(?P<user_name>[\w-]+)$",
        decline_friend_request,
        name="decline_friend_request",
    ),
    re_path("addfriend", addFriend.as_view()),
    re_path("removefriend", removeFriend.as_view()),
    re_path("deletecircle", deleteCircle.as_view()),
    re_path("creategroupchat", createGroupChat.as_view()),
    re_path("updategroupchat", updateGroupChat.as_view()),
    path("get-security-question", get_security_question),
    path("joincircle", joinCircle.as_view()),
    re_path(r"^rec/([0-9]+)/refresh/([0-9]+)$", refresh),

    re_path("removefriend", views.removeFriend.as_view()),
    # THREADS
    path('threads/', views.getThreads, name='threads'),
    path("threads/<int:thread_id>", views.getThread, name="thread"),
    path('threads/<int:thread_id>/posts', views.getPosts, name='posts'),

    path('threads/topic/<int:topic_id>', views.getThreadsTopic, name='getThreadsTopic'),

    path('createThread/', views.createThread, name='createThread'),
    path('createPost/', views.createPost, name='createPost'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
