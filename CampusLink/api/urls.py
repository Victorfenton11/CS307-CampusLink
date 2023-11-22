from django.urls import path, re_path
from . import views
from .views import ClassLocationView, GetClassLocation
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("class-location", ClassLocationView.as_view()),
    path("get-class-location", GetClassLocation.as_view()),
    path("reset-password", views.ResetPassword.as_view()),
    re_path(r"^user$", views.userApi),
    re_path(r"^user/([0-9]+)$", views.userApi),
    re_path(r"^user/savefile", views.SaveFile),
    re_path(r"^users/([a-zA-Z0-9]+)$", views.userNameApi),
    path("user/create/", views.create_user, name="create-user"),
    path("user/delete/<str:user_email>/", views.delete_user, name="delete-user"),
    path("save-class-list/", views.save_class_list, name="save_class_list"),
    re_path(r"^viewfriends/([0-9]+)$", views.getFriends),
    re_path("addfriend", views.addFriend.as_view()),
    re_path("removefriend", views.removeFriend.as_view()),
    # THREADS
    path('threads/', views.getThreads, name='threads'),
    path("threads/<int:thread_id>", views.getThread, name="thread"),
    path('threads/<int:thread_id>/posts', views.getPosts, name='posts'),
    # path('threads/topic/<int:topic_id>', views.getThreadsTopic, name='getThreadsTopic'),

    path('createThread/', views.createThread, name='createThread'),
    path('createPost/', views.createPost, name='createPost'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
