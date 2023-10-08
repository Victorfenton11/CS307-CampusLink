from django.urls import path, re_path
from api import views
from .views import main

from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('', main),
    re_path(r'^user$',views.userApi),
    re_path(r'^user/([0-9]+)$',views.userApi),
    re_path(r'^user/savefile',views.SaveFile)
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

