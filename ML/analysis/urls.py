from django.urls import path
# from .views import upload_pdfs, ask_question, chat
from . import views
from  .views import chat

urlpatterns = [
    path('chat/', chat, name='chat'),
    path('mask_psych/', views.mask_psych, name='mask_psych'),
    path('mask_mental/', views.mask_mental, name='mask_mental'),
    path('classify_psych/', views.classify_psych, name='classify_psych'),
    path('classify_mental/', views.classify_mental, name='classify_mental'),
    path('sentiment_analysis/', views.sentiment_analysis, name='sentiment_analysis'),
    path('mood_score/', views.mood_score, name='mood score'),
    path('journals/analysis/<str:userId>/', views.user_journal_analysis_view, name='journal-analysis'),
    path('journals/report/<str:userId>/', views.weekly_report_summary, name='weekly-report'),
]