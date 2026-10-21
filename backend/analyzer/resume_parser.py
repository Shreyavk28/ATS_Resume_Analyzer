import fitz 
import re

def extract_text_from_pdf(pdf_path):

    doc = fitz.open(pdf_path)

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    text = re.sub(r'(\w)\n(\w)', r'\1 \2', text)
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)

    return text.lower()
