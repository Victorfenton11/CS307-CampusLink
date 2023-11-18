from django.urls import path, re_path
from .views import ClassLocationView, GetClassLocation, userApi, SaveFile, create_user, delete_user, send_email2, save_class_list, userNameApi, getFriends, addFriend, removeFriend, GetUserbyEmail, incoming_requests, accept_friend_request, decline_friend_request
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('class-location', ClassLocationView.as_view()),
    path('get-class-location', GetClassLocation.as_view()),
    path('get-user-by-email', GetUserbyEmail.as_view()),
    re_path(r'^user$', userApi),
    re_path(r'^user/([0-9]+)$', userApi),
    re_path(r'^user/savefile', SaveFile),
    re_path(r'^users/([a-zA-Z0-9]+)$', userNameApi),
    path('user/create/', create_user, name='create-user'),
    path('user/delete/<int:user_id>/', delete_user, name='delete-user'),
    re_path(r'^email$', send_email2),
    path('save-class-list/', save_class_list, name='save_class_list'),
    re_path(r'^viewfriends/([0-9]+)$', getFriends),
    re_path(r'^incoming-requests/([0-9]+)/$', incoming_requests, name='incoming_requests'),
    re_path(r'^accept-friend-request/([0-9]+)/([\w-]+)$', accept_friend_request),
    re_path(r'^decline-friend-request/(?P<user_id>\d+)/(?P<user_name>[\w-]+)$', decline_friend_request, name='decline_friend_request'),
    re_path('addfriend', addFriend.as_view()),
    re_path('removefriend', removeFriend.as_view())
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
