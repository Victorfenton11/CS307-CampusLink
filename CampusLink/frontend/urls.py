from django.urls import path, re_path
from .views import index

urlpatterns = [
    path("", index),
    path("signup/", index),
    path("login/", index),
    path("reset-password/", index),
    path("password-reset-confirm/<str:uid>/<str:token>/", index),
    re_path(r"^verify-email/.*$", index),
    path("map/", index),
    path("discover/", index),
    path("circles/", index),
    path("profile/", index),
    path("calendar/", index),
]
