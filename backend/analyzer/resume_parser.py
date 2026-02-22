import fitz  # PyMuPDF
import re


def extract_text_from_pdf(pdf_path):

    doc = fitz.open(pdf_path)

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()

    # FIX 1: join broken words like "REST\nAPI"
    text = re.sub(r'(\w)\n(\w)', r'\1 \2', text)

    # FIX 2: remove extra newlines
    text = re.sub(r'\n+', ' ', text)

    # FIX 3: normalize spaces
    text = re.sub(r'\s+', ' ', text)

    return text.lower()
