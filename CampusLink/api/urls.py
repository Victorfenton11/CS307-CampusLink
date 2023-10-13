from django.urls import path
from .views import ClassLocationView, GetClassLocation

urlpatterns = [
    path('class-location', ClassLocationView.as_view()),
    path('get-class-location', GetClassLocation.as_view())
]
