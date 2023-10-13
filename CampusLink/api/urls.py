from django.urls import path, re_path
from .views import ClassLocationView, GetClassLocation, userApi, SaveFile, create_user, delete_user, send_email2, save_class_list, userNameApi
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('class-location', ClassLocationView.as_view()),
    path('get-class-location', GetClassLocation.as_view()),
    re_path(r'^user$', userApi),
    re_path(r'^user/([0-9]+)$', userApi),
    re_path(r'^user/savefile', SaveFile),
    re_path(r'^users/([a-zA-Z0-9]+)$', userNameApi),
    path('user/create/', create_user, name='create-user'),
    path('user/delete/<str:user_email>/', delete_user, name='delete-user'),
    re_path(r'^email$', send_email2),
    path('save-class-list/', save_class_list, name='save_class_list')
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
