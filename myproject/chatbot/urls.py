# from django.urls import path
# from . import views

# urlpatterns = [
#     path('chatbot/handle-button-click/', views.handle_button_click, name='handle_button_click'),
#     path('chatbot/upload', views.upload_pdf, name='upload_pdf'),
#     path('summary/', views.summarize_pdf, name='summarize_pdf'),
#     path('summary/<str:pdf_name>/', views.summary_view, name='summary_view'),
#     # path('chat/<str:pdf_name>/', views.chat_view, name='chat'),
#     # path('chatbot/ask-question/', views.ask_question, name='ask_question'),
# ]

from django.urls import path
from . import views


urlpatterns = [
    # path('', views.dashboard, name='dashboard'),
    path('upload/', views.upload_pdf, name='upload_pdf'),
    path('diet/', views.process_diet_plan, name='process_diet_plan'),
    path('summary/', views.process_summary, name='summary'),
    path('ask_question/', views.ask_question, name='ask_question'),
    # path('check_embedding_status/', views.check_embedding_status, name='check_embedding_status'),
    
]