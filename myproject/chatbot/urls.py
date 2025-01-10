from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_pdf, name='upload_pdf'),
    path('chat/<str:pdf_name>/', views.chat_view, name='chat'),
    path('ask_question/', views.ask_question, name='ask_question'),
    path('summarization/<str:pdf_name>/', views.summarization_report, name='summarization_report'),
]