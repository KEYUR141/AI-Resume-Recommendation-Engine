def extract_text_from_pdf(pdf_path):
	from pdfminer.high_level import extract_text
	return extract_text(pdf_path)

def extract_text_from_docx(docx_path):
	from docx import Document
	doc = Document(docx_path)
	return '\n'.join([para.text for para in doc.paragraphs])

if __name__ == "__main__":
	# Test PDF extraction
	pdf_file = r"D:\Django_Python_Practice\SIH_Hackathon\Backend\Project\app\utils\sample_data\Anjali_Sharma_Resume.pdf"
	try:
		pdf_text = extract_text_from_pdf(pdf_file)
		print("PDF Resume Text:\n", pdf_text)
	except Exception as e:
		print("PDF extraction error:", e)

	# Test DOCX extraction
	docx_file = r"D:\Django_Python_Practice\SIH_Hackathon\Backend\Project\app\utils\sample_data\Anjali Sharma.docx"
	try:
		docx_text = extract_text_from_docx(docx_file)
		print("DOCX Resume Text:\n", docx_text)
	except Exception as e:
		print("DOCX extraction error:", e)
