from django.core.management.base import BaseCommand
from app.models import Internship
import numpy as np

class Command(BaseCommand):
    help = 'Seed the database with internship data and create embeddings'
    def handle(self, *args, **kwargs):
        
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

        internships = Internship.objects.filter(embeddings__isnull=True)
        
        docs = []
        for internship in internships:
            doc =f"{internship.position} {internship.role} {internship.company} {internship.location} {internship.skills} {internship.qualifications} {internship.stipend} {internship.duration} {internship.description}"
            embeddings = model.encode(doc).tolist()

            internship.embeddings = embeddings
            internship.save()
            docs.append(doc)

            self.stdout.write(self.style.SUCCESS(f"Processed internship: {internship.uuid} - {internship.position} at {internship.company}"))

        self.rebuild_faiss_index()



    def rebuild_faiss_index(self):
        import faiss
        import json

        internships = Internship.objects.filter(embeddings__isnull=False)
        embeddings = np.array([i.embeddings for i in internships], dtype='float32')
        uuids = [str(internship.uuid) for internship in internships]

        index = faiss.IndexFlatL2(embeddings.shape[1])
        index.add(embeddings)
        
        faiss.write_index(index, r'D:\Django_Python_Practice\Project_AI_Resume\AI-Resume-Recommendation-Engine\Backend\Project\app\RAG\faiss_index.bin')
        with open(r'D:\Django_Python_Practice\Project_AI_Resume\AI-Resume-Recommendation-Engine\Backend\Project\app\RAG\metadata.json', 'w') as f:
            json.dump(uuids, f)
        
        
        
        
        
        
        
        
        
        # Create Fiass Index
        # import faiss
        # dimension = embeddings.shape[1]
        # index = faiss.IndexFlatL2(dimension)
        # index.add(np.array(embeddings).astype('float32'))


        # faiss.write_index(index, r'D:\Django_Python_Practice\Project_AI_Resume\AI-Resume-Recommendation-Engine\Backend\Project\app\RAG\faiss_index.bin')

        # #Save MetaData(JSON)

        # import json
        # uuids = [str(internship.uuid)for internship in internships]
        # with open(r'D:\Django_Python_Practice\Project_AI_Resume\AI-Resume-Recommendation-Engine\Backend\Project\app\RAG\metadata.json', 'w') as f:
        #     json.dump(uuids, f)
