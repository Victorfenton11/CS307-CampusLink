from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('signup/', index),
    path('login/', index),
    path('reset-password/', index),
    path('password-reset-confirm/<str:uid>/<str:token>/', index),
    path('map/', index),
    path('discover/', index),
    path('circles/', index),
    path('profile/', index)
]
