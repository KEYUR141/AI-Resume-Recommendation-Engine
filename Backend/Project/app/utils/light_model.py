import os
from app.utils.resume_extractor import extract_text_from_pdf, extract_text_from_docx

def extract_resume_text(file_path):
	"""
	Extracts text from a resume file (PDF or DOCX).
	"""
	ext = os.path.splitext(file_path)[-1].lower()
	if ext == '.pdf':
		return extract_text_from_pdf(file_path)
	elif ext in ['.docx', '.doc']:
		return extract_text_from_docx(file_path)
	else:
		raise ValueError('Unsupported file type: ' + ext)
import re

def parse_skills(text):
	# Simple skill extraction (customize as needed)
	return set(re.findall(r'\b\w+\b', text.lower()))

def match_internships(candidate_skills, candidate_qualifications, internships):
	"""
	candidate_skills: set of skills (strings)
	candidate_qualifications: set of qualifications (strings)
	internships: queryset or list of Internship objects
	Returns: list of dicts with internship and match score
	"""
	results = []
	for internship in internships:
		required_skills = set(re.findall(r'\b\w+\b', internship.skills.lower()))
		required_qualifications = set(re.findall(r'\b\w+\b', internship.qualifications.lower()))
		skill_matches = candidate_skills & required_skills
		qual_matches = candidate_qualifications & required_qualifications
		skill_score = len(skill_matches) / max(1, len(required_skills))
		qual_score = len(qual_matches) / max(1, len(required_qualifications))
		total_score = round((skill_score * 0.7 + qual_score * 0.3) * 100, 2)  # Weighted
		results.append({
			'internship_id': str(internship.uuid),
			'role': internship.role,
			'company': internship.company,
			'location': internship.location,
			'score': total_score,
			'missing_skills': list(required_skills - candidate_skills),
			'missing_qualifications': list(required_qualifications - candidate_qualifications)
		})
	# Sort by score descending
	results.sort(key=lambda x: x['score'], reverse=True)
	return results[:150]  # Top 5150 recommendations
