import logging

from celery import shared_task
from sentence_transformers import SentenceTransformer

logger = logging.getLogger('app.tasks')


@shared_task
def generate_resume_embedding(resume_id):
    from app.models import Resume
    from app.utils.resume_extractor import extract_text_from_docx, extract_text_from_pdf
    import os
    try:
        logger.info("Starting embedding generation for resume_id=%s", resume_id)
        resume = Resume.objects.get(uuid=resume_id)
        resume.status = "processing"
        resume.save()

        file_path = resume.files.path
        ext = os.path.splitext(file_path)[-1].lower()
        logger.debug("Processing file=%s (ext=%s)", file_path, ext)

        if ext == ".pdf":
            parsed_text = extract_text_from_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            parsed_text = extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        
        logger.info("Text extracted (%d chars), generating embedding...", len(parsed_text))
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        embedding = model.encode(parsed_text).tolist()

        resume.parsed_text = parsed_text
        resume.embeddings = embedding
        resume.status = 'completed'
        resume.save()

        logger.info("Embedding completed for resume_id=%s", resume_id)
        return {'status': 'success', 'resume_id': str(resume_id)}
    
    except Exception as e:
        logger.error("Embedding failed for resume_id=%s: %s", resume_id, e, exc_info=True)
        try:
            resume = Resume.objects.get(uuid=resume_id)
            resume.status = "failed"
            resume.save()
        except Exception:
            logger.error("Could not update resume status to 'failed' for resume_id=%s", resume_id)
        return {'status':'Failed', 'error':str(e)}