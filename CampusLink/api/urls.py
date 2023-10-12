from django.urls import path, re_path
from api import views
from .views import main

from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('', main),
    re_path(r'^user$',views.userApi),
    re_path(r'^user/([0-9]+)$',views.userApi),
    re_path(r'^user/savefile',views.SaveFile),
    re_path('add_friend/<int:userId>/<int:friend_id>/',views.addFriend),
    re_path('remove_friend/<int:userId>/<int:friendId>/',views.removeFriend)
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)