from django.urls import path
from .views import ClassLocationView

urlpatterns = [
    path('class_location/', ClassLocationView.as_view())
]
