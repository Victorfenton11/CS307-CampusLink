from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('map/', index),
    path('discover/', index),
    path('circles/', index),
    path('profile/', index)
]
