from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('signup/', index),
    path('login/', index),
    path('reset-password/', index),
    path('map/', index),
    path('discover/', index),
    path('circles/', index),
    path('profile/', index),
    re_path(r'^verify-email/.*$', index)
]
