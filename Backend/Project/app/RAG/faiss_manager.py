import faiss
import numpy as np


class FAISSManager:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.index = None
            cls._instance.ids = []
        return cls._instance
    
    def build_index(self):
        try:
            from app.models import Internship

            internships = Internship.objects.filter(embeddings__isnull = False)

            if not internships.exists():
                return 
            
            embeddings = np.array([i.embeddings for i in internships], dtype='float32')
            self.ids = [str(i.uuid) for i in internships]

            dim = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dim)
            self.index.add(embeddings)
        except Exception as e:
            print(f"Error building FAISS index: {e}")
            self.index = None
            self.ids = []

    def search(self, query_embedding, top_k = 5):
        try:
            if self.index is None:
                self.build_index()

            query = np.array([query_embedding], dtype='float32')
            distances, indices = self.index.search(query, top_k)

            return [self.ids[i] for i in indices[0] if i < len(self.ids)]
        except Exception as e:
            print(f"Error during search: {e}")
            return []

faiss_manager = FAISSManager()