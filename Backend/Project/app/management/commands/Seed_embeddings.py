from django.core.management.base import BaseCommand
from app.models import Internship
import numpy as np

class Command(BaseCommand):
    help = 'Seed the database with internship data and create embeddings'
    def handle(self, *args, **kwargs):
        internships = Internship.objects.all()


        docs = []

        for internship in internships:
            doc = f"{internship.position} {internship.role} {internship.industry} {internship.company} {internship.location} {internship.skills} {internship.qualifications} {internship.stipend} {internship.duration} {internship.description}"
            docs.append(doc)
        if not docs:
            self.stdout.write(self.style.WARNING("No internship data found. Exiting without creating embeddings."))
            return


        #Load Embeddings
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

        embeddings = model.encode(docs)
        print(f"Embeddings shape: {getattr(embeddings, 'shape', 'No shape attribute')}")
        if len(embeddings.shape) != 2:
            self.stdout.write(self.style.ERROR(f"Embeddings shape is not 2D: {embeddings.shape}. Exiting."))
            return
        embeddings = model.encode(docs)

        # Create Fiass Index
        import faiss
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(np.array(embeddings).astype('float32'))


        faiss.write_index(index, r'D:\Django_Python_Practice\Project_AI_Resume\AI-Resume-Recommendation-Engine\Backend\Project\app\RAG\faiss_index.bin')

        #Save MetaData(JSON)

        import json
        uuids = [str(internship.uuid)for internship in internships]
        with open(r'D:\Django_Python_Practice\Project_AI_Resume\AI-Resume-Recommendation-Engine\Backend\Project\app\RAG\metadata.json', 'w') as f:
            json.dump(uuids, f)
