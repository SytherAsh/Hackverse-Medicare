# import os
# from typing import List, Dict
# from pathlib import Path
# from django.shortcuts import render, redirect
# from django.http import JsonResponse
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from langchain_community.document_loaders import PyPDFLoader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS
# from langchain_groq import ChatGroq
# from langchain.chains import RetrievalQA
# from langchain.prompts import PromptTemplate
# import json
# from dotenv import load_dotenv

# # Global storage for vector stores
# vector_stores: Dict[str, FAISS] = {}

# @csrf_exempt
# def handle_button_click(request):
#     if request.method == 'POST':
#         return JsonResponse({'message': 'Button clicked!'})
#     return JsonResponse({'error': 'Invalid request method'}, status=400)

# def get_embedding_path(pdf_name: str) -> str:
#     """Get the path where embeddings should be stored for a given PDF."""
#     return os.path.join(settings.MEDIA_ROOT, 'embeddings', pdf_name.replace('.pdf', ''))

# def process_single_pdf(pdf_path: str) -> List:
#     """Load and process a single PDF file."""
#     try:
#         loader = PyPDFLoader(pdf_path)
#         documents = loader.load()
#         return documents
#     except Exception as e:
#         print(f"Error loading PDF: {str(e)}")
#         raise

# def create_embeddings(documents: List, pdf_name: str) -> FAISS:
#     """Create and save embeddings for the PDF content."""
#     try:
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=200,
#             length_function=len,
#         )
#         chunks = text_splitter.split_documents(documents)
#         embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
#         vector_store = FAISS.from_documents(chunks, embeddings)
#         embedding_path = get_embedding_path(pdf_name)
#         os.makedirs(embedding_path, exist_ok=True)
#         vector_store.save_local(embedding_path)
#         return vector_store
#     except Exception as e:
#         print(f"Error creating embeddings: {str(e)}")
#         raise

# def load_existing_embeddings(pdf_name: str) -> FAISS:
#     """Try to load existing embeddings for a PDF."""
#     try:
#         embedding_path = get_embedding_path(pdf_name)
#         if not os.path.exists(embedding_path):
#             return None
#         embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
#         vector_store = FAISS.load_local(embedding_path, embeddings, allow_dangerous_deserialization=True)
#         return vector_store
#     except Exception as e:
#         print(f"Error loading embeddings: {str(e)}")
#         return None

# def process_pdf(pdf_file, pdf_name: str) -> FAISS:
#     """Process PDF and create or load embeddings."""
#     try:
#         vector_store = load_existing_embeddings(pdf_name)
#         if vector_store:
#             vector_stores[pdf_name] = vector_store
#             return vector_store
#         pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
#         documents = process_single_pdf(pdf_path)
#         vector_store = create_embeddings(documents, pdf_name)
#         vector_stores[pdf_name] = vector_store
#         return vector_store
#     except Exception as e:
#         print(f"Error in process_pdf: {str(e)}")
#         raise

# def get_qa_chain(pdf_name: str, groq_api_key: str):
#     """Create QA chain for a processed PDF."""
#     try:
#         vector_store = vector_stores.get(pdf_name)
#         if not vector_store:
#             vector_store = load_existing_embeddings(pdf_name)
#             if not vector_store:
#                 raise ValueError("PDF not processed or embeddings not found")
#             vector_stores[pdf_name] = vector_store
#         llm = ChatGroq(
#             temperature=0.1,
#             groq_api_key=groq_api_key,
#             model_name="mixtral-8x7b-32768"
#         )
#         prompt_template = PromptTemplate(
#             input_variables=["context", "question"],
#             template="""..."""  # Your template here
#         )
#         qa_chain = RetrievalQA.from_chain_type(
#             llm=llm,
#             chain_type="stuff",
#             retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
#             chain_type_kwargs={"prompt": prompt_template}
#         )
#         return qa_chain
#     except Exception as e:
#         print(f"Error creating QA chain: {str(e)}")
#         raise

# @csrf_exempt
# def upload_pdf(request):
#     """Handle PDF upload."""
#     if request.method == 'POST' and request.FILES.get('pdf_file'):
#         try:
#             pdf_file = request.FILES['pdf_file']
#             pdf_name = pdf_file.name
#             os.makedirs(os.path.join(settings.MEDIA_ROOT, 'pdfs'), exist_ok=True)
#             os.makedirs(os.path.join(settings.MEDIA_ROOT, 'embeddings'), exist_ok=True)
#             pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
#             with open(pdf_path, 'wb+') as destination:
#                 for chunk in pdf_file.chunks():
#                     destination.write(chunk)
#             process_pdf(pdf_file, pdf_name)
#             return redirect('chat', pdf_name=pdf_name)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     return render(request, 'chatbot/upload.html')

# def chat_view(request, pdf_name: str):
#     """Render chat interface."""
#     return render(request, 'chatbot/chatbot.html', {'pdf_name': pdf_name})

# @csrf_exempt
# def ask_question(request):
#     """Handle questions about the PDF."""
#     if request.method == 'POST':
#         try:
#             load_dotenv()
#             groq_api = os.getenv("GROQ_API_KEY")
#             if not groq_api:
#                 return JsonResponse({'error': 'GROQ API key not found'}, status=500)
#             data = json.loads(request.body)
#             question = data.get('question')
#             pdf_name = data.get('pdf_name')
#             qa_chain = get_qa_chain(pdf_name, groq_api)
#             answer = qa_chain.run(question)
#             return JsonResponse({'answer': answer})
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     return JsonResponse({'error': 'Invalid request method'},status=400)

import os
from typing import List, Dict
from pathlib import Path
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import json
from dotenv import load_dotenv
import os
from pathlib import Path
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from groq import Groq
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
from dotenv import load_dotenv
# Global storage for vector stores
vector_stores: Dict[str, FAISS] = {}


import os
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from groq import Groq
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
from dotenv import load_dotenv
def get_embedding_path(pdf_name: str) -> str:
    """Get the path where embeddings should be stored for a given PDF."""
    return os.path.join(settings.MEDIA_ROOT, 'embeddings', pdf_name.replace('.pdf', ''))

def process_single_pdf(pdf_path: str) -> List:
    """Load and process a single PDF file."""
    try:
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        return documents
    except Exception as e:
        print(f"Error loading PDF: {str(e)}")
        raise

def create_embeddings(documents: List, pdf_name: str) -> FAISS:
    """Create and save embeddings for the PDF content."""
    try:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_documents(documents)
        embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
        vector_store = FAISS.from_documents(chunks, embeddings)
        embedding_path = get_embedding_path(pdf_name)
        os.makedirs(embedding_path, exist_ok=True)
        vector_store.save_local(embedding_path)
        return vector_store
    except Exception as e:
        print(f"Error creating embeddings: {str(e)}")
        raise

def load_existing_embeddings(pdf_name: str) -> FAISS:
    """Try to load existing embeddings for a PDF."""
    try:
        embedding_path = get_embedding_path(pdf_name)
        if not os.path.exists(embedding_path):
            return None
        embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
        vector_store = FAISS.load_local(embedding_path, embeddings, allow_dangerous_deserialization=True)
        return vector_store
    except Exception as e:
        print(f"Error loading embeddings: {str(e)}")
        return None

def process_pdf(pdf_file, pdf_name: str) -> FAISS:
    """Process PDF and create or load embeddings."""
    try:
        vector_store = load_existing_embeddings(pdf_name)
        if vector_store:
            vector_stores[pdf_name] = vector_store
            return vector_store
        pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
        documents = process_single_pdf(pdf_path)
        vector_store = create_embeddings(documents, pdf_name)
        vector_stores[pdf_name] = vector_store
        return vector_store
    except Exception as e:
        print(f"Error in process_pdf: {str(e)}")
        raise

def get_qa_chain(pdf_name: str, groq_api_key: str):
    """Create QA chain for a processed PDF."""
    try:
        vector_store = vector_stores.get(pdf_name)
        if not vector_store:
            vector_store = load_existing_embeddings(pdf_name)
            if not vector_store:
                raise ValueError("PDF not processed or embeddings not found")
            vector_stores[pdf_name] = vector_store
        llm = ChatGroq(
            temperature=0.1,
            groq_api_key=groq_api_key,
            model_name="mixtral-8x7b-32768"
        )
        prompt_template = PromptTemplate(
            input_variables=["context", "question"],
            template="""..."""  # Your template here
        )
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={"prompt": prompt_template}
        )
        return qa_chain
    except Exception as e:
        print(f"Error creating QA chain: {str(e)}")
        raise

@csrf_exempt
def upload_pdf(request):
    """Handle PDF upload."""
    if request.method == 'POST' and request.FILES.get('pdf_file'):
        try:
            pdf_file = request.FILES['pdf_file']
            pdf_name = pdf_file.name
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'pdfs'), exist_ok=True)
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'embeddings'), exist_ok=True)
            pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
            with open(pdf_path, 'wb+') as destination:
                for chunk in pdf_file.chunks():
                    destination.write(chunk)
            process_pdf(pdf_file, pdf_name)
            return redirect('chat', pdf_name=pdf_name)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return render(request, 'chatbot/upload.html')

def chat_view(request, pdf_name: str):
    """Render chat interface."""
    return render(request, 'chatbot/chatbot.html', {'pdf_name': pdf_name})

@csrf_exempt
def ask_question(request):
    """Handle questions about the PDF."""
    if request.method == 'POST':
        try:
            load_dotenv()
            groq_api = os.getenv("GROQ_API_KEY")
            if not groq_api:
                return JsonResponse({'error': 'GROQ API key not found'}, status=500)
            data = json.loads(request.body)
            question = data.get('question')
            pdf_name = data.get('pdf_name')
            qa_chain = get_qa_chain(pdf_name, groq_api)
            answer = qa_chain.run(question)
            return JsonResponse({'answer': answer})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)