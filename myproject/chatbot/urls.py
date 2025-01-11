from django.urls import path
from . import views

urlpatterns = [
    path('chatbot/handle-button-click/', views.handle_button_click, name='handle_button_click'),
    path('chatbot/upload-pdf/', views.upload_pdf, name='upload_pdf'),
    # path('chat/<str:pdf_name>/', views.chat_view, name='chat'),
    path('chatbot/ask-question/', views.ask_question, name='ask_question'),
    # path('summarization/<str:pdf_name>/', views.summarization_report, name='summarization_report'),
]