from groq import Groq
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
from app.models import Internship
import os
from groq import Groq
from app.RAG.faiss_manager import faiss_manager

API_KEY_GROQ = os.getenv('API_KEY_GROQ')
#load embedded data
faiss_index = faiss.read_index(r'D:\Django_Python_Practice\SIH_Hackathon\Backend\Project\app\RAG\faiss_index.bin')

with open(r'D:\Django_Python_Practice\SIH_Hackathon\Backend\Project\app\RAG\metadata.json', 'r') as f:
    metadata = json.load(f)



# def recommend_internships_engine(resume_text, top_k=5):
#     try:
#     #Load Resume embeddings
#         model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
#         resume_embedding = model.encode([resume_text]).astype('float32')

#         #Search in Faiss Index
#         distances, indices = faiss_index.search(resume_embedding, top_k)

#         #Fetch Metadata
#         unique_recommended_uuids = list(dict.fromkeys([metadata[idx] for idx in indices[0]]))
#         matched_internships = Internship.objects.filter(uuid__in=unique_recommended_uuids)
        
#         unique_matched_internships = []
#         seen_uuids = set()
#         for internship in matched_internships:
#             if str(internship.uuid) not in seen_uuids:
#                 unique_matched_internships.append({
#                     'uuid': str(internship.uuid),
#                     'position': internship.position,
#                     'role': internship.role,
#                     'industry': internship.industry,
#                     'company': internship.company,
#                     'location': internship.location,
#                     'skills': internship.skills,
#                     'qualifications': internship.qualifications,
#                     'stipend': internship.stipend,
#                     'duration': internship.duration,
#                     'description': internship.description
#                 })
#                 seen_uuids.add(str(internship.uuid))

        
#         return unique_matched_internships
#     except Exception as e:
#         return f"Error in recommendation engine: {str(e)}"

def recommend_internships_engine(resume_text, top_k=5):
    try:
        #load resume embeddings
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        resume_embedding = model.encode(resume_text).tolist()

        matched_uuids = faiss_manager.search(resume_embedding, top_k)

        #fetch from db
        matched_internships = Internship.objects.filter(uuid__in=matched_uuids)

        results = []
        for internship in matched_internships:
            results.append({
                'uuid': str(internship.uuid),
                'position': internship.position,
                'role': internship.role,
                'company': internship.company,
                'location': internship.location,
                'skills': internship.skills,
                'qualifications': internship.qualifications,
                'stipend': internship.stipend,
                'duration': internship.duration,
                'description': internship.description
            })
        return results
    except Exception as e:
         return f"Error in recommendation engine: {str(e)}"


def recommend_internships_by_llm(unique_matched_internships):
    try:

        prompt = f"""
        You are a AI Assistant for recommending internships to students based on their resumes, named as "Greg". You have access to a list of internship opportunities, each with details such as position, role, industry, company, location, skills required, qualifications, stipend, duration, and description.
        The RAG system with FAISS index has provided you with a list of internship opportunities that are relevant to the student's resume. Your task is to analyze these opportunities and provide a recommendation on which internships would be the best fit for the student based on their resume content and the details of the internships.
        Here are the details of the recommended internships:
        {unique_matched_internships}
        Based on the above information, please provide a recommendation on which internships would be the best fit for the student, and explain why you think those internships are suitable based on the student's resume and the internship details.
        
        **You need to provide a clear recommendation, and your explanation should be concise and focused on the key factors that make the recommended internships a good match for the student.**
        **You will give me the recommendation in a JSON format with the following structure:**
        **You will give them a suggestion based on the skills matched and what do they will need in today's industry, acting as a mentor and guiding them**
        """
        
        print(f"[DEBUG] API_KEY_GROQ is set: {'Yes' if API_KEY_GROQ else 'No'}")
        print(f"[DEBUG] Number of internships in input: {len(unique_matched_internships) if unique_matched_internships else 0}")
        client = Groq(api_key = API_KEY_GROQ)
        result = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.7,
        response_format = {"type": "json_object"},
        model="llama-3.3-70b-versatile",
        )   

        print("[DEBUG] Raw LLM result object:")
        print("LLM Recommendation Result:", result.choices[0].message.content)
        
    except Exception as e:
        return f"Error in recommendation engine: {str(e)}"
