from django.urls import path
from .views import main
from api.views import save_class_list

urlpatterns = [
    path('', main),
    path('save-class-list/', save_class_list, name='save_class_list'),
]
