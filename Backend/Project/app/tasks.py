from celery import shared_task
from sentence_transformers import SentenceTransformer


@shared_task
def generate_resume_embedding(resume_id):
    from app.models import Resume
    from app.utils.resume_extractor import extract_text_from_docx, extract_text_from_pdf
    import os
    try:
        resume = Resume.objects.get(uuid=resume_id)
        resume.status = "processing"
        resume.save()

        file_path = resume.files.path
        ext = os.path.splitext(file_path)[-1].lower()

        if ext == ".pdf":
            parsed_text = extract_text_from_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            parsed_text = extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        embedding = model.encode(parsed_text).tolist()

        resume.parsed_text = parsed_text
        resume.embeddings = embedding
        resume.status = 'completed'
        resume.save()

        return {'status': 'success', 'resume_id': str(resume_id)}
    
    except Exception as e:
        try:
            resume = Resume.objects.get(uuid=resume_id)
            resume.status = "failed"
            resume.save()
        except:
            pass
        return {'status':'Failed', 'error':str(e)}