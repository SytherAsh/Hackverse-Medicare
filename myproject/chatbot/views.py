
from typing import List, Dict
import os
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from groq import Groq
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from groclake.vectorlake import VectorLake
from groclake.datalake import DataLake
from groclake.modellake import ModelLake
import json
from dotenv import load_dotenv
load_dotenv()

os.environ['GROCLAKE_API_KEY'] = os.getenv("GROCLAKE_API_KEY")
os.environ['GROCLAKE_ACCOUNT_ID'] = os.getenv("GROCLAKE_ACCOUNT_ID")
vector_stores: Dict[str, FAISS] = {}


@csrf_exempt
def upload_pdf(request):
    """Handle PDF upload, save it, and store the PDF name in the session."""
    if request.method == 'POST' and request.FILES.get('pdf_file'):
        try:
            pdf_file = request.FILES['pdf_file']
            pdf_name = pdf_file.name
            
            # Ensure the directory exists
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'pdfs'), exist_ok=True)
            
            # Save the uploaded PDF file
            pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
            with open(pdf_path, 'wb+') as destination:
                for chunk in pdf_file.chunks():
                    destination.write(chunk)
            
            # Store the PDF name in session for reuse
            request.session['pdf_name'] = pdf_name
            
            # Redirect to the main page or another view
            return redirect('http://localhost:5173/booking')
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return render(request, 'chatbot/upload.html')


def get_pdf_content(pdf_name: str) -> list:
    """Extract content from PDF file."""
    try:
        pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        
        # Combine all pages into one text
        full_text = "\n".join(page.page_content for page in pages)
        
        # Split text into manageable chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,  # Adjusted for Groq context window
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_text(full_text)
        return chunks
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")

@csrf_exempt
def process_diet_plan(request):
    """Generate diet plan based on the PDF already uploaded and stored in session."""
    try:
        # Step 1: Check if the PDF name exists in the session
        pdf_name = request.session.get('pdf_name')
        if not pdf_name:
            return JsonResponse({'error': 'No PDF file found in session. Please upload a file first.'}, status=400)
        
        # Step 2: Extract PDF content
        text_chunks = get_pdf_content(pdf_name)
        
        # Step 3: Generate diet plan using Groq API
        load_dotenv()
        groq_api = os.getenv("GROQ_API_KEY")
        if not groq_api:
            return JsonResponse({'error': 'GROQ API key not found'}, status=500)
        
        # Initialize Groq client
        client = Groq(api_key=groq_api)
        
        # Create diet plan prompt
        prompt = f"""Based on the following content, create a detailed diet plan. 
        Include meals, portions, and nutritional information:

        {' '.join(text_chunks)}

        Please provide a structured diet plan with:
        1. Daily meal breakdown
        2. Nutritional information
        3. Portion sizes
        4. Alternative options
        """
        
        # Generate diet plan
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gemma2-9b-it",
            temperature=0.3,
        )
        
        diet_plan = completion.choices[0].message.content
        
        # Step 4: Render the result in the diet_planner.html template
        return render(request, 'chatbot/diet_planner.html', {'diet_plan': diet_plan})
    
    except Exception as e:
        # Log or handle error appropriately
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def process_summary(request):
    """Extract content from uploaded PDF stored in session, generate a summary, and render the result."""
    try:
        # Step 1: Retrieve PDF name from session
        pdf_name = request.session.get('pdf_name')
        if not pdf_name:
            return JsonResponse({'error': 'No PDF found in session. Please upload a PDF first.'}, status=400)
        
        # Step 2: Extract PDF content using get_pdf_content function
        text_chunks = get_pdf_content(pdf_name)
        
        # Step 3: Generate summary using Groq API
        load_dotenv()
        groq_api = os.getenv("GROQ_API_KEY")
        if not groq_api:
            return JsonResponse({'error': 'GROQ API key not found'}, status=500)
        
        # Initialize Groq client
        client = Groq(api_key=groq_api)
        
        # Create a prompt for summary generation
        prompt = f"""
    You are a thoughtful and highly skilled medical expert. Your task is to summarize the given medical report while ensuring that:
    - Only the most important and relevant details are included.
    - Any alarming situations or abnormal values compared to normal levels are clearly highlighted and explained in simple terms.
    - The summary is written in clear, simple language that is easy for non-medical individuals to understand.
    - The tone is polite, respectful, and considerate of the person's feelings.

    Please summarize the report in bullet points, focusing on:
    1. Key health indicators (e.g., blood pressure, sugar levels, cholesterol, etc.).
    2. Any diagnosed conditions or concerns mentioned in the report.
    3. Recommendations or follow-ups suggested in the report.
    4. Clearly highlight any alarming values or situations with a brief explanation (e.g., "Blood sugar level is significantly higher than normal, which may indicate a risk of diabetes.").

    Avoid including unnecessary technical details or lengthy explanations. Make the summary concise, actionable, and empathetic.
    Report Content:
    {text_chunks}
    Kindly provide the summarized details in bullet points below:
Summary:"""
        
        # Generate summary using Groq API
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gemma2-9b-it",
            temperature=0.3,
        )
        
        summary = completion.choices[0].message.content
        
        # Step 4: Render the result in the summary.html template
        return render(request, 'chatbot/summary.html', {'summary': summary})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def ask_question(request):
    if request.method == 'POST':
        try:
            # Parse the request payload
            data = json.loads(request.body)
            search_query = data.get("query")
            document_url = data.get("document_url")

            if not search_query or not document_url:
                return JsonResponse({"error": "Query and document URL are required."}, status=400)

            # Initialize VectorLake and DataLake
            vectorlake = VectorLake()
            datalake = DataLake()

            # Create DataLake
            datalake_create = datalake.create()
            datalake_id = datalake_create["datalake_id"]

            # Push document to DataLake
            payload_push = {
                "datalake_id": datalake_id,
                "document_type": "url",
                "document_data": document_url
            }
            data_push = datalake.push(payload_push)
            document_id = data_push.get("document_id")

            # Fetch document chunks
            payload_fetch = {
                "document_id": document_id,
                "datalake_id": datalake_id,
                "fetch_format": "chunk",
                "chunk_size": "500"
            }
            data_fetch = datalake.fetch(payload_fetch)
            document_chunks = data_fetch.get("document_data", [])

            if not document_chunks:
                return JsonResponse({"error": "Failed to fetch document data."}, status=500)

            # Process chunks and generate vectors
            vectorlake_id = vectorlake.create()["vectorlake_id"]
            for idx, chunk in enumerate(document_chunks):
                vector_doc = vectorlake.generate(chunk)
                vector_chunk = vector_doc.get("vector")

                vectorlake_push_request = {
                    "vector": vector_chunk,
                    "vectorlake_id": vectorlake_id,
                    "document_text": chunk,
                    "vector_type": "text",
                    "metadata": {}
                }
                vectorlake.push(vectorlake_push_request)

            # Generate vector for search query
            vector_search_data = vectorlake.generate(search_query)
            search_vector = vector_search_data.get("vector")

            # Search VectorLake
            search_payload = {
                "vector": search_vector,
                "vectorlake_id": vectorlake_id,
                "vector_type": "text",
            }
            search_response = vectorlake.search(search_payload)
            search_results = search_response.get("results", [])

            if not search_results:
                return JsonResponse({"error": "No relevant search results found."}, status=404)

            # Construct enriched context
            enriched_context = []
            token_count = 0
            for result in search_results:
                doc_content = result.get("vector_document", "")
                doc_tokens = len(doc_content.split())
                if token_count + doc_tokens <= 1000:
                    enriched_context.append(doc_content)
                    token_count += doc_tokens
                else:
                    break

            enriched_context = " ".join(enriched_context)

            # Query ModelLake
            payload = {
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": f"Using the following context from retrieved documents: {enriched_context}, "
                                   f"please provide a detailed explanation."
                    }
                ],
                "token_size": 3000
            }
            chat_response = ModelLake().chat_complete(payload)
            answer = chat_response.get("answer", "No answer received from ModelLake.")

            return JsonResponse({"answer": answer})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST method is allowed."}, status=405)

@csrf_exempt
def equipment(request):
    """Extract content from uploaded PDF stored in session, generate a summary, and render the result."""
    try:
        # Step 1: Retrieve PDF name from session
        pdf_name = request.session.get('pdf_name')
        if not pdf_name:
            return JsonResponse({'error': 'No PDF found in session. Please upload a PDF first.'}, status=400)
        
        # Step 2: Extract PDF content using get_pdf_content function
        text_chunks = get_pdf_content(pdf_name)
        
        # Step 3: Generate summary using Groq API
        load_dotenv()
        groq_api = os.getenv("GROQ_API_KEY")
        if not groq_api:
            return JsonResponse({'error': 'GROQ API key not found'}, status=500)
        
        # Initialize Groq client
        client = Groq(api_key=groq_api)
        
        # Create a prompt for summary generation
        prompt = f"""You are a healthcare assistant chatbot designed to analyze a user's medical report and recommend suitable medical instruments and products from a predefined list. Use the following guidelines to generate your responses:

    1. Understand the Input
    Carefully analyze the user's medical report, including health conditions, test results, and medical history (e.g., diabetes, hypertension, respiratory issues, pregnancy, or injuries).
    Identify key health indicators or conditions mentioned in the report.
    2. Map Conditions to Products
    Use the following rules to recommend appropriate products:
    Diabetes: Glucometers, glucose meters and strips, diabetes care products (insulin, insulin pumps), and fiber supplements.
    Hypertension: Blood pressure monitors, low-sodium meal replacements, and stress-relief products like aromatherapy diffusers.
    Respiratory Issues: Nebulizers, inhalers, pulse oximeters, and air purifiers.
    Joint or Muscle Pain: TENS units, pain relief creams and gels, heating pads, knee and ankle braces, or back support belts.
    Injury or Recovery: Crutches, walkers, canes, wound care and dressings, ice packs, and hot packs.
    Pregnancy and Infant Care: Pregnancy test kits, maternity and nursing pads, baby monitors, infant thermometers, diapers, and baby care creams.
    Mental Health and Stress: Meditation tools, sound machines, stress-relief products, and CBT apps.
    General Health: Thermometers, first aid kits, antiseptics, bandages, and weight management supplements.
    Chronic Diseases: Compression stockings for circulation issues, stethoscopes, and home test kits (cholesterol, thyroid).
    3. Provide Explanations
    For each product, explain why it is recommended. Example:
    "A glucometer is recommended to monitor your blood sugar levels regularly, especially since your report indicates a risk of diabetes."
    "A blood pressure monitor will help you keep track of your hypertension and take preventive measures."
    4. Recommend General Tools
    Suggest essential items for everyone, such as a first aid kit, thermometer, antiseptics, and stress-relief products, unless contraindicated.
    5. Disclaimers
    Clearly mention that recommendations are based on the provided information and are not a substitute for professional medical advice. Encourage users to consult a healthcare provider.
    6. Response Example
    Based on your medical report, I recommend the following:
    Blood Pressure Monitor: To regularly monitor your hypertension levels and ensure early detection of anomalies.
    Glucometer: For keeping track of your blood sugar levels, which is essential for diabetes management.
    Pulse Oximeter: To monitor oxygen saturation, especially if you have respiratory concerns.
    Heating Pad: For relief from joint or muscle pain, as suggested by your condition.
    These recommendations are for guidance only. Please consult your doctor before making any decisions.
    7. Product List
    The bot can recommend from the following items:
    Foot care products (foot creams, insoles, foot massagers)
    Hand sanitizers and wipes
    Protein powders, fiber supplements, and meal replacements
    Herbal supplements (turmeric, ashwagandha, ginseng)
    Blood pressure monitors, glucometers, thermometers, pulse oximeters
    Nebulizers, inhalers, and stethoscopes
    Pain relief creams, ice packs, and TENS units
    First aid kits, bandages, antiseptics, wound care products
    Mobility aids (crutches, walkers, canes, wheelchairs)
    Pregnancy kits, baby care products, diapers, and infant thermometers
    Meditation tools, stress-relief products, and CBT apps
    Home test kits for cholesterol, thyroid, STDs, and more.
    Respond clearly, concisely, and empathetically.
    {text_chunks}
    Kindly provide the recommended medical equipment and products based on the user's medical report:"""
        
        # Generate summary using Groq API
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gemma2-9b-it",
            temperature=0.3,
        )
        
        summary = completion.choices[0].message.content
        print(summary)
        # Step 4: Render the result in the summary.html template
        return render(request, 'chatbot/equipment.html', {'summary': summary})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)