from groq import Groq
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
from app.models import Internship
import os
from groq import Groq

API_KEY_GROQ = os.getenv('API_KEY_GROQ')
#load embedded data
faiss_index = faiss.read_index(r'D:\Django_Python_Practice\SIH_Hackathon\Backend\Project\app\RAG\faiss_index.bin')

with open(r'D:\Django_Python_Practice\SIH_Hackathon\Backend\Project\app\RAG\metadata.json', 'r') as f:
    metadata = json.load(f)



def recommend_internships_engine(resume_text, top_k=5):
    try:
    #Load Resume embeddings
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        resume_embedding = model.encode([resume_text]).astype('float32')

        #Search in Faiss Index
        distances, indices = faiss_index.search(resume_embedding, top_k)

        #Fetch Metadata
        unique_recommended_uuids = list(dict.fromkeys([metadata[idx] for idx in indices[0]]))
        matched_internships = Internship.objects.filter(uuid__in=unique_recommended_uuids)
        
        unique_matched_internships = []
        seen_uuids = set()
        for internship in matched_internships:
            if str(internship.uuid) not in seen_uuids:
                unique_matched_internships.append({
                    'uuid': str(internship.uuid),
                    'position': internship.position,
                    'role': internship.role,
                    'industry': internship.industry,
                    'company': internship.company,
                    'location': internship.location,
                    'skills': internship.skills,
                    'qualifications': internship.qualifications,
                    'stipend': internship.stipend,
                    'duration': internship.duration,
                    'description': internship.description
                })
                seen_uuids.add(str(internship.uuid))

        
        return unique_matched_internships
    except Exception as e:
        return f"Error in recommendation engine: {str(e)}"



def recommend_internships_by_llm(unique_matched_internships):
    try:

        prompt = f"""
        """
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

        # print("LLM Recommendation Result:", result.choices[0].message.content)
        print(result)
    except Exception as e:
        return f"Error in recommendation engine: {str(e)}"