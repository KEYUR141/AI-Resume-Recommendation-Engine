from django.apps import AppConfig
import os

class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        if os.getenv('RUN_MAIN') =='true':
            try:
                from .RAG.faiss_manager import faiss_manager
                faiss_manager.build_index()
                print("Faiss index built successfully on app startup")
            except Exception as e:
                print(f"Error building FAISS index on app startup: {e}")