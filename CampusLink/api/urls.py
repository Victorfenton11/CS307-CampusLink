from django.urls import path
from .views import create_user, delete_user
# from .views import UserCreateView

# urlpatterns = [
#     path('user/create/', UserCreateView.as_view(), name='create-user')
# ]



urlpatterns = [
    # ... other paths
    path('user/create/', create_user, name='create-user'),
    path('user/delete/<str:user_email>/', delete_user, name='delete-user'),
]

