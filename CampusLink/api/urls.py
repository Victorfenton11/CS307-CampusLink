from django.urls import path, re_path
from .views import ClassLocationView, GetClassLocation, userApi, SaveFile, create_user, delete_user, save_class_list, userNameApi, getFriends, addFriend, removeFriend, ResetPassword, get_security_question
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('class-location', ClassLocationView.as_view()),
    path('get-class-location', GetClassLocation.as_view()),
    path('reset-password', ResetPassword.as_view()),
    re_path(r'^user$', userApi),
    re_path(r'^user/([0-9]+)$', userApi),
    re_path(r'^user/savefile', SaveFile),
    re_path(r'^users/([a-zA-Z0-9]+)$', userNameApi),
    path('user/create/', create_user, name='create-user'),
    path('user/delete/<str:user_email>/', delete_user, name='delete-user'),
    path('save-class-list/', save_class_list, name='save_class_list'),
    re_path(r'^viewfriends/([0-9]+)$', getFriends),
    re_path('addfriend', addFriend.as_view()),
    re_path('removefriend', removeFriend.as_view()),
    path('get-security-question', get_security_question),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
