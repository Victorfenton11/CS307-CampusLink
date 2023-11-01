from django.contrib import admin
from .models import Category, Post, User

admin.site.register(Category)
admin.site.register(User)
admin.site.register(Post)
