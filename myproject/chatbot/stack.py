
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

# Global storage for vector stores
vector_stores: Dict[str, FAISS] = {}

def get_embedding_path(pdf_name: str) -> str:
    """Get the path where embeddings should be stored for a given PDF"""
    return os.path.join(settings.MEDIA_ROOT, 'embeddings', pdf_name.replace('.pdf', ''))

def process_single_pdf(pdf_path: str) -> List:
    """Load and process a single PDF file"""
    try:
        print(f"Loading PDF from: {pdf_path}")
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        print(f"Successfully loaded PDF with {len(documents)} pages")
        return documents
    except Exception as e:
        print(f"Error loading PDF: {str(e)}")
        raise

def create_embeddings(documents: List, pdf_name: str) -> FAISS:
    """Create and save embeddings for the PDF content"""
    try:
        print(f"Creating embeddings for PDF: {pdf_name}")
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_documents(documents)
        print(f"Split documents into {len(chunks)} chunks")
        
        # Create embeddings
        embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
        vector_store = FAISS.from_documents(chunks, embeddings)
        
        # Save embeddings
        embedding_path = get_embedding_path(pdf_name)
        os.makedirs(embedding_path, exist_ok=True)
        vector_store.save_local(embedding_path)
        print(f"Embeddings saved to: {embedding_path}")
        
        return vector_store
    except Exception as e:
        print(f"Error creating embeddings: {str(e)}")
        raise
def load_existing_embeddings(pdf_name: str) -> FAISS:
    """Try to load existing embeddings for a PDF"""
    try:
        print(f"Attempting to load existing embeddings for: {pdf_name}")
        embedding_path = get_embedding_path(pdf_name)
        if not os.path.exists(embedding_path):
            print("No existing embeddings found")
            return None
            
        embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
        vector_store = FAISS.load_local(embedding_path, embeddings,allow_dangerous_deserialization=True)
        print("Successfully loaded existing embeddings")
        return vector_store
    except Exception as e:
        print(f"Error loading embeddings: {str(e)}")
        return None
    
def process_pdf(pdf_file, pdf_name: str) -> FAISS:
    """Process PDF and create or load embeddings"""
    try:
        print(f"Processing PDF: {pdf_name}")
        
        # First try to load existing embeddings
        vector_store = load_existing_embeddings(pdf_name)
        if vector_store:
            vector_stores[pdf_name] = vector_store
            return vector_store
            
        # If no existing embeddings, create new ones
        print("Creating new embeddings...")
        pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
        documents = process_single_pdf(pdf_path)
        vector_store = create_embeddings(documents, pdf_name)
        vector_stores[pdf_name] = vector_store
        return vector_store
        
    except Exception as e:
        print(f"Error in process_pdf: {str(e)}")
        raise

def get_qa_chain(pdf_name: str, groq_api_key: str):
    """Create QA chain for a processed PDF"""
    try:
        print(f"Setting up QA chain for: {pdf_name}")
        
        # Get vector store from memory or load from disk
        vector_store = vector_stores.get(pdf_name)
        if not vector_store:
            vector_store = load_existing_embeddings(pdf_name)
            if not vector_store:
                raise ValueError("PDF not processed or embeddings not found")
            vector_stores[pdf_name] = vector_store
            
        # Create LLM
        llm = ChatGroq(
            temperature=0.1,
            groq_api_key=groq_api_key,
            model_name="mixtral-8x7b-32768"
        )
        
        # Create prompt template
        prompt_template = PromptTemplate(
            input_variables=["context", "question"],
            template="""You are a knowledgeable and empathetic medical assistant. Use the following context to answer the question thoughtfully and thoroughly. 
            Focus on:
            - Providing diet suggestions or alternatives where applicable.
            - Suggesting alternative medical equipment or tools if relevant.
            - Offering clear and actionable guidance based on the provided context.
            If the answer cannot be determined from the context, say "I cannot find this information in the document, but you may consult a healthcare professional for further assistance."

            Context: {context}
            
            Question: {question}
            
            Answer: """
        )
        
        # Create QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={"prompt": prompt_template}
        )
        
        print("QA chain created successfully")
        return qa_chain
        
    except Exception as e:
        print(f"Error creating QA chain: {str(e)}")
        raise

def upload_pdf(request):
    """Handle PDF upload"""
    if request.method == 'POST' and request.FILES.get('pdf_file'):
        try:
            pdf_file = request.FILES['pdf_file']
            pdf_name = pdf_file.name
            print(f"Received PDF upload: {pdf_name}")
            
            # Create directories if they don't exist
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'pdfs'), exist_ok=True)
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'embeddings'), exist_ok=True)
            
            # Save PDF file
            pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_name)
            with open(pdf_path, 'wb+') as destination:
                for chunk in pdf_file.chunks():
                    destination.write(chunk)
            print(f"PDF saved to: {pdf_path}")
            
            # Process PDF
            process_pdf(pdf_file, pdf_name)
            print("PDF processing completed")
            
            return redirect('chat', pdf_name=pdf_name)
            
        except Exception as e:
            print(f"Error in upload_pdf: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return render(request, 'chatbot/upload.html')

def chat_view(request, pdf_name: str):
    """Render chat interface"""
    return render(request, 'chatbot/chatbot.html', {'pdf_name': pdf_name})

@csrf_exempt
def ask_question(request):
    """Handle questions about the PDF"""
    if request.method == 'POST':
        try:
            # Load environment variables
            load_dotenv()
            groq_api = os.getenv("GROQ_API_KEY")
            
            if not groq_api:
                return JsonResponse({'error': 'GROQ API key not found'}, status=500)
            
            # Parse request
            data = json.loads(request.body)
            question = data.get('question')
            pdf_name = data.get('pdf_name')
            
            print(f"Received question for {pdf_name}: {question}")
            
            # Get answer
            qa_chain = get_qa_chain(pdf_name, groq_api)
            answer = qa_chain.run(question)
            
            print(f"Generated answer: {answer}")
            return JsonResponse({'answer': answer})
            
        except Exception as e:
            print(f"Error in ask_question: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)