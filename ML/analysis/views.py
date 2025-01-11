from django.http import JsonResponse
from decouple import config
from pymongo import MongoClient
import os
import numpy as np
import json
import logging
from statistics import mean
from dotenv import load_dotenv
from django.conf import settings
from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from rest_framework.decorators import api_view
from rest_framework import status
import jwt
from datetime import datetime, timedelta
import google.generativeai as genai
from langchain.schema import AIMessage
from langchain.chains.question_answering import load_qa_chain
from google.cloud import translate_v2 as translate
from transformers import pipeline
import logging
import jwt
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.conf import settings
from django.http import JsonResponse
from bson.objectid import ObjectId
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from bson import json_util
DATABASE_URL = config("DATABASE_URL")


JWT_SECRET = config("JWT_SECRET")
from django.http import JsonResponse
from decouple import config
from transformers import pipeline, AutoModelForMaskedLM, AutoTokenizer

# Retrieve the Hugging Face access token from environment variables
HUGGING_FACE_TOKEN = config("HUGGING_FACE_TOKEN")

# Initialize pipelines with access token using from_pretrained()
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="finiteautomata/bertweet-base-sentiment-analysis",
    tokenizer="finiteautomata/bertweet-base-sentiment-analysis",
    use_auth_token=HUGGING_FACE_TOKEN
)

unmask_model1 = AutoModelForMaskedLM.from_pretrained("nlp4good/psych-search", use_auth_token=HUGGING_FACE_TOKEN)
unmask_tokenizer1 = AutoTokenizer.from_pretrained("nlp4good/psych-search", use_auth_token=HUGGING_FACE_TOKEN)
unmask_pipeline1 = pipeline("fill-mask", model=unmask_model1, tokenizer=unmask_tokenizer1)

unmask_model2 = AutoModelForMaskedLM.from_pretrained("mental/mental-bert-base-uncased", use_auth_token=HUGGING_FACE_TOKEN)
unmask_tokenizer2 = AutoTokenizer.from_pretrained("mental/mental-bert-base-uncased", use_auth_token=HUGGING_FACE_TOKEN)
unmask_pipeline2 = pipeline("fill-mask", model=unmask_model2, tokenizer=unmask_tokenizer2)

classify_pipeline1 = pipeline(
    "text-classification",
    model="rabiaqayyum/autotrain-mental-health-analysis-752423172"
    # use_auth_token=HUGGING_FACE_TOKEN
)

classify_pipeline2 = pipeline(
    "text-classification",
    model="edmundhui/mental_health_trainer"
    # use_auth_token=HUGGING_FACE_TOKEN
)

sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="nlptown/bert-base-multilingual-uncased-sentiment",
        )

def extract_score_from_label(label: str) -> int:
    """Extract numeric score from label like '5 stars' or '4 stars'"""
    try:
        return int(label.split()[0])
    except (IndexError, ValueError):
        return 3  # default to neutral if parsing fails

def process_single_text(text: str) -> int:
    """Process a single text and return its mood score"""
    results = sentiment_analyzer(text)
    if not results:
        return 3  # default to neutral if no results
    return extract_score_from_label(results[0]['label'])

def process_texts(json_array: list[dict]) -> dict:
    """Process an array of JSON objects and return detailed results"""
    if not json_array:
        return {
            'error': 'No input provided'
        }

    try:
        # Extract texts and calculate scores
        scores = []
        text_scores = []

        for item in json_array:
            text = item.get('text')
            if text:
                score = process_single_text(text)
                scores.append(score)
                text_scores.append({
                    'text': text,
                    'score': score
                })

        if not scores:
            return {
                'error': 'No valid texts found in input'
            }

        # Calculate average score and round to nearest integer
        average_score = round(mean(scores))

        return {
            'mood_score': average_score,
        }

    except Exception as e:
        return {
            'error': f'Error processing texts: {str(e)}'
        }

# The rest of your route handlers and view logic remains the same


# def decode_jwt(token):
#     """Decodes the JWT token to get user info."""
#     try:
#         return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
#     except jwt.ExpiredSignatureError:
#         raise Exception("Token has expired")
#     except jwt.InvalidTokenError:
#         raise Exception("Invalid Token")

# def get_user_from_token(request):
#     try:
#         # Extract token from Authorization header
#         token = request.headers.get("Authorization", "").split(" ")[1]
#         if not token:
#             return None, {"error": "Authorization token missing"}, status.HTTP_401_UNAUTHORIZED
        
#         # Decode the JWT token
#         user_data = decode_jwt(token)
#         user_id = user_data['UserInfo']['id']  # Get user ID from the decoded token
#         if not user_id:
#             return None, {"error": "Invalid token format"}, status.HTTP_403_FORBIDDEN

#         # Convert user_id to ObjectId
#         try:
#             user_id = ObjectId(user_id)  # Convert string ID to ObjectId
#         except Exception as e:
#             return None, {"error": "Invalid user ID format"}, status.HTTP_403_FORBIDDEN

#         # Fetch user directly from MongoDB
#         user = users_list.find_one({"_id": user_id})
#         if not user:
#             return None, {"error": "User not found"}, status.HTTP_404_NOT_FOUND

#         return user, None, None
#     except jwt.ExpiredSignatureError:
#         return None, {"error": "Token has expired"}, status.HTTP_403_FORBIDDEN
#     except jwt.DecodeError:
#         return None, {"error": "Invalid token"}, status.HTTP_403_FORBIDDEN
#     except Exception as e:
#         return None, {"error": str(e)}, status.HTTP_403_FORBIDDEN

# Load environment variables
load_dotenv()


    
# Configure Google Generative AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
@api_view(['POST'])
def chat(request):
    # user, error_response, status_code = get_user_from_token(request)
    # if error_response:
    #     return JsonResponse(error_response, status=status_code)

    question = request.data.get('question')
    print(question)
    LANGUAGE_CODES = {
        'en': 'English',
        'hi': 'Hindi',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'te': 'Telugu'
    }
    

# Retrieve the credentials path from the environment variable
    google_credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    # Initialize translation client
    translate_client = translate.Client()

    # Detect the input language
    try:
        # Detect the input language
        
        
        
        # Check if the detected language is supported
        # if detected_language not in LANGUAGE_CODES:
        #     return JsonResponse({
        #         'error': f'Unsupported language detected. We currently support: {", ".join(LANGUAGE_CODES.values())}. Language detected was {detected_language} for {question}'
        #     }, status=400)

        # Initialize translation client
        detection = translate_client.detect_language(question)
        detected_language = detection['language']

        # Translate question to English if it's not already in English
        if detected_language != 'en':
            translation = translate_client.translate(
                question,
                target_language='en',
                source_language=detected_language
            )
            english_question = translation['translatedText']
        else:
            english_question = question
        model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
            )

    # Get recent chat messages within the last 1 hour
        one_hour_ago = datetime.now() - timedelta(hours=1)
    #recent_messages = ChatMessage.objects.filter(user=user, timestamp__gte=one_hour_ago).order_by('-timestamp')[:10]

    # Prepare the prompt with recent messages
    #recent_chats = "\n".join([f"User: {msg.question}\nBot: {msg.response}" for msg in recent_messages])
        context = f"""Generate an accurate response considering the question.You are a mental health chatbot which will answer only questions related to it.These are our fetures:User Login: Secure access for both users and therapists/providers.
Mood Assessment & Emotion Analysis: Daily logs with analysis and insights into mood trends for personalized support.
Personalized Therapy & Wellness Tips: Therapy plan suggestions based on assessments, with tailored tips for ongoing well-being.
Therapist Directory: Browse and connect with therapists and wellness providers.
Crisis Support & Emergency Contacts: Access articles, crisis guidelines, and emergency contact options for immediate assistance.
Nearby Relaxation Spots & Exercise Resources: Local relaxation spot recommendations, exercise videos, and an educational resource library.
Community Forum: Peer support through text and video options for safe discussions.
Positive Affirmations: Uplifting messages upon login to enhance motivation.
Habit Tracking & Journaling: Tools for tracking wellness goals and daily reflections.
Mental Health Chatbot: AI chatbot offering instant support and guidance."""

        #messages = [{"role": "user", "content": prompt}]

    
        response = model.generate_content([context,english_question])
        response_result=response.text  
        
        if detected_language != 'en':
            translation = translate_client.translate(
                response_result,
                target_language=detected_language,
                source_language='en'
            )
            final_response = translation['translatedText']
        else:
            final_response = response_result
    # Save the chat message to the databaset
    # chat_message = ChatMessage(user=user, question=question, response=response_text)
    # chat_message.save()

        # return JsonResponse({
        #         'answer': final_response,
        #     })
        
        response_data = {
            'response': final_response,

        }

        # Return JSON response
        return JsonResponse(response_data, safe=False)

    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@api_view(['POST'])
@csrf_exempt
def mask_psych(request):
    # user, error_response, status_code = get_user_from_token(request)
    # if error_response:
    #     return JsonResponse(error_response, status=status_code)
    text = request.data.get('text')
    result = unmask_pipeline1(text)
    return JsonResponse({'result': result}, safe=False)

def extract_score_from_label(label):
    """Extract numeric score from label like '5 stars' or '4 stars'"""
    try:
        return int(label.split()[0])
    except (IndexError, ValueError):
        return 3 
    
@api_view(['POST'])
@csrf_exempt
def mood_score(request):
    try:
        # Get JSON array from request
        json_array = request.data
        
        # Validate input
        if not isinstance(json_array, list):
            return JsonResponse({
                'error': 'Input must be an array of JSON objects'
            }, status=400)

        # Process all texts
        result = process_texts(json_array)
        
        # Return error if processing failed
        if 'error' in result:
            return JsonResponse(result, status=400)
            
        return JsonResponse(result)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'details': 'Error processing request'
        }, status=500)
@api_view(['POST'])
@csrf_exempt
def mask_mental(request):
    # user, error_response, status_code = get_user_from_token(request)
    # if error_response:
    #     return JsonResponse(error_response, status=status_code)
    text = request.data.get('text')
    result = unmask_pipeline2(text)
    return JsonResponse({
            'result':{
                'score': round(sentiment['score'], 3),
            }
    })

@api_view(['POST'])
@csrf_exempt
def classify_psych(request):
    # user, error_response, status_code = get_user_from_token(request)
    # if error_response:
    #     return JsonResponse(error_response, status=status_code)
    text = request.data.get('text')
    result = classify_pipeline1(text)
    return JsonResponse({'result': result}, safe=False)

@api_view(['POST'])
@csrf_exempt
def classify_mental(request):
    # user, error_response, status_code = get_user_from_token(request)
    # if error_response:
    #     return JsonResponse(error_response, status=status_code)
    text = request.data.get('text')
    result = classify_pipeline2(text)
    return JsonResponse({'result': result}, safe=False)

@api_view(['POST'])
@csrf_exempt
def sentiment_analysis(request):
    # user, error_response, status_code = get_user_from_token(request)
    # if error_response:
    #     return JsonResponse(error_response, status=status_code)
    text = request.data.get('text')
    result = sentiment_pipeline(text)
    return JsonResponse({'result': result}, safe=False)

from pymongo import MongoClient
from django.http import JsonResponse

def check_mongo_connection():
    try:
        # Create a MongoClient instance
        mongo_client = MongoClient(DATABASE_URL)
        
        # Test the connection by listing the databases
        db_list = mongo_client.list_database_names()
        
        # If the connection is successful, return the list of databases
        return JsonResponse({
            'status': 'success',
            'message': 'Connected to MongoDB',
            'databases': db_list
        })
        
    except Exception as e:
        # If there's an error, return the error message
        return JsonResponse({
            'status': 'error',
            'message': f"Failed to connect to MongoDB: {str(e)}"
        }, status=500)


def get_user_journal_entries(user_id: str, days: int = 7) -> list[dict]:
    try:
        # Convert string user_id to ObjectId
        user_object_id = ObjectId(user_id)
        seven_days_ago = datetime.now() - timedelta(days=days)
        
        # Construct query
        query = {
            "userId": user_object_id,  # Use ObjectId
            "createdAt": {
                "$gte": seven_days_ago
            }
        }
        
        # Get database and collection
        mongo_client = MongoClient(settings.DATABASE_URL)
        db = mongo_client["test"]  # Replace with your database name
        journal_collection = db["journals"]
        
        # Execute query with proper projection
        journal_entries = journal_collection.find(
            query,
            {
                "title": 1,
                "content": 1,
                "createdAt": 1,
                "mood": 1,
                "tags": 1,
                "weather": 1,
                "activities": 1,
            }
        ).sort("createdAt", -1)
        
        # Convert cursor to list and process dates
        entries_list = []
        for entry in journal_entries:
            entry['_id'] = str(entry['_id'])  # Convert ObjectId to string
            entries_list.append(entry)
        
        mongo_client.close()
        return entries_list
        
    except Exception as e:
        print(f"Error in get_user_journal_entries: {str(e)}")
        return []

def summarize_user_journals(user_entries: list[dict]) -> dict:
    if not user_entries:
        return {
            'status': 'error',
            'message': 'No journal entries found for this period'
        }

    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
    )
    
    formatted_entries = []
    for entry in user_entries:
        # Include more fields in the summary
        date_str = entry['createdAt'].strftime('%Y-%m-%d')
        time_str = entry['createdAt'].strftime('%H:%M:%S')
        
        formatted_text = f"""
Date: {date_str} Time: {time_str}
Title: {entry.get('title', 'No Title')}
Mood: {entry.get('mood', 'Not specified')}
Weather: {entry.get('weather', {}).get('condition', 'Not specified')}
Activities: {', '.join(entry.get('activities', []))}
Tags: {', '.join(entry.get('tags', []))}
Entry: {entry['content']}
"""
        formatted_entries.append(formatted_text)
    
    all_entries = "\n---\n".join(formatted_entries)
    
    prompt = f"""
    Below are journal entries from the past {len(user_entries)} days. Please provide:
    1. A brief summary of the main themes and emotions
    2. Key patterns in mood and activities
    3. Notable changes in behavior or routine
    4. Weather patterns and their potential impact on mood
    5. Common tags and activities
    
    Journal Entries:
    {all_entries}
    """
    
    try:
        response = model.generate_content(prompt)
        return {
            'summary': response.text,
        }

    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def summarize_weekly_reports(user_entries: list[dict]) -> dict:
    if not user_entries:
        return {
            'status': 'error',
            'message': 'No journal entries found for this period'
        }

    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
    )
    
    formatted_entries = []
    for entry in user_entries:
        # Include more fields in the summary
        date_str = entry['createdAt'].strftime('%Y-%m-%d')
        time_str = entry['createdAt'].strftime('%H:%M:%S')
        
        formatted_text = f"""
Date: {date_str} Time: {time_str}
Title: {entry.get('title', 'No Title')}
Mood: {entry.get('mood', 'Not specified')}
Weather: {entry.get('weather', {}).get('condition', 'Not specified')}
Activities: {', '.join(entry.get('activities', []))}
Tags: {', '.join(entry.get('tags', []))}
Entry: {entry['content']}
"""
        formatted_entries.append(formatted_text)
    
    all_entries = "\n---\n".join(formatted_entries)
    
    prompt = f"""
    Below are the {len(user_entries)} journal entries from the past week, capturing the users reflections on daily life, activities, and emotions. 
    Your task is to create a summary that conveys how life has been going recently, highlighting well-being and general sentiment in a positive and encouraging manner.
    The summary should be personalized, reflecting changes in mood, patterns of activity, and important themes while providing insight into any shifts in mindset or routine.

To generate a weekly mental health report:

Identify the main themes and emotions expressed in the entries, focusing on overall well-being and personal growth.
Analyze patterns in mood and daily activities. Look for recurring positive or negative sentiments, noting if certain activities or events appear to influence mood consistently.
Detect any notable changes in habits, thoughts, or routines that may suggest shifts in personal priorities, energy levels, or mindset.
If weather information is available, interpret its possible impact on mood and energy levels, observing any connections between weather patterns and emotional shifts.
Mention frequent tags, phrases, or activities to provide a well-rounded view of common interests or priorities during this time

IMPORTANT:
1. Overall summary should be more than 7 lines long
2. It should be structured, no large paragraphs
3. Include a section " advice or tips to improve your well being" and mention 3-4 points to improve the persons mental wellness
4. Address the person directly and keep the tone of the conversation polite and encouraging.

Journal Entries:
    {all_entries}
    """
    
    try:
        response = model.generate_content(prompt)
        return {
            'summary': response.text,
        }

    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

# Django view to handle the request
def user_journal_analysis_view(request, userId):
    try:
        # Get number of days from query parameters, default to 7
        days = int(request.GET.get('days', 7))
        
        # Get journal entries
        user_entries = get_user_journal_entries(userId, days)
        
        if not user_entries:
            return JsonResponse({
                'status': 'error',
                'message': f'No journal entries found for user {userId} in the last {days} days'
            })
        
        # Get summary from Gemini
        summary_result = summarize_user_journals(user_entries)
        
        # Add entry count to response
        #summary_result['total_entries'] = len(user_entries)
        
        return JsonResponse(summary_result)
        
    except ValueError as e:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid days parameter'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
def weekly_report_summary(request, userId):
    try:
        # Get number of days from query parameters, default to 7
        days = int(request.GET.get('days', 7))
        
        # Get journal entries
        user_entries = get_user_journal_entries(userId, days)
        
        if not user_entries:
            return JsonResponse({
                'status': 'error',
                'message': f'No journal entries found for user {userId} in the last {days} days'
            })
        
        # Get summary from Gemini
        summary_result = summarize_weekly_reports(user_entries)
        
        
        return JsonResponse(summary_result)
        
    except ValueError as e:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid days parameter'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
