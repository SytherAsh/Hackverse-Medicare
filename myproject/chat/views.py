import os
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from groq import Groq
from dotenv import load_dotenv
load_dotenv()
groq_api=os.getenv("GROQ_API_KEY")


def chat_view(request):
    return render(request, 'chat/chat.html')

@csrf_exempt
def get_response(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            
            client = Groq(
                api_key=os.getenv('GROQ_API_KEY')
                # api_key="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"
            )

            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": user_message,
                    }
                ],
                model="llama3-8b-8192",
            )

            response = chat_completion.choices[0].message.content
            return JsonResponse({'response': response})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)
