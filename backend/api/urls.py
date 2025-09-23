from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.hello, name="hello"),
    path("jason/", views.jason_greeting, name="jason_greeting"),
    path("tim/", views.tim_greeting, name="tim_greeting"),
]
