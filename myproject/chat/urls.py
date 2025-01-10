from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_view, name='chat'),
    path('get-response/', views.get_response, name='get_response'),
]