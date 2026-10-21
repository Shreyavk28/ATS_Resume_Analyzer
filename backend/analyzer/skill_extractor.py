import re
import spacy
from spacy.matcher import PhraseMatcher

nlp = spacy.load("en_core_web_sm")
SKILL_MAP = {

    # ======================
    # Programming Languages
    # ======================

    "python": "python",
    "java": "java",
    "c": "c",
    "c++": "c++",
    "c#": "c#",
    "javascript": "javascript",
    "typescript": "typescript",
    "go": "go",
    "golang": "go",
    "rust": "rust",
    "kotlin": "kotlin",
    "swift": "swift",
    "php": "php",
    "r": "r",

    # ======================
    # Frontend
    # ======================

    "html": "html",
    "html5": "html",

    "css": "css",
    "css3": "css",

    "javascript": "javascript",

    "react": "react",
    "react js": "react",
    "react.js": "react",

    "angular": "angular",
    "angular js": "angular",

    "vue": "vue",
    "vue js": "vue",

    "next js": "nextjs",
    "next.js": "nextjs",

    "bootstrap": "bootstrap",
    "tailwind": "tailwind",
    "tailwind css": "tailwind",

    # ======================
    # Backend Node ecosystem
    # ======================

    "node": "nodejs",
    "node js": "nodejs",
    "node.js": "nodejs",
    "nodejs": "nodejs",

    "express": "express",
    "express js": "express",
    "express.js": "express",

    # ======================
    # Python backend
    # ======================

    "django": "django",
    "flask": "flask",
    "fastapi": "fastapi",

    # ======================
    # Java backend ENTERPRISE
    # ======================

    "spring": "spring",
    "spring boot": "spring boot",
    "springboot": "spring boot",

    "hibernate": "hibernate",

    "microservices": "microservices",

    "maven": "maven",
    "gradle": "gradle",

    "jsp": "jsp",
    "servlet": "servlet",

    # ======================
    # Database
    # ======================

    "sql": "sql",

    "mysql": "mysql",

    "postgres": "postgresql",
    "postgresql": "postgresql",

    "sqlite": "sqlite",

    "mongodb": "mongodb",

    "oracle": "oracle",

    "redis": "redis",

    # ======================
    # APIs
    # ======================

    "rest api": "rest api",
    "rest apis": "rest api",
    "restful api": "rest api",
    "restful apis": "rest api",

    "graphql": "graphql",

    # ======================
    # Version Control
    # ======================

    "git": "git",
    "github": "github",
    "gitlab": "gitlab",

    # ======================
    # DevOps
    # ======================

    "docker": "docker",
    "kubernetes": "kubernetes",
    "aws": "aws",
    "azure":"azure",
    "gcp":"gcp",

    "jenkins": "jenkins",

    "ci cd": "ci/cd",
    "ci/cd": "ci/cd",

    # ======================
    # Cloud
    # ======================

    "aws": "aws",
    "amazon web services": "aws",

    "azure": "azure",

    "google cloud": "gcp",
    "gcp": "gcp",

    # ======================
    # Data Science / AI / ML
    # ======================

    "machine learning": "machine learning",
    "deep learning": "deep learning",

    "tensorflow": "tensorflow",
    "keras": "keras",
    "pytorch": "pytorch",

    "numpy": "numpy",
    "pandas": "pandas",

    "scikit learn": "scikit-learn",
    "scikit-learn": "scikit-learn",

    # ======================
    # Tools
    # ======================

    "postman": "postman",

    "vscode": "vscode",
    "visual studio code": "vscode",

    "intellij": "intellij",

    # ======================
    # Core Computer Science
    # ======================

    "data structure": "data structures",
    "data structures": "data structures",

    "algorithm": "algorithms",
    "algorithms": "algorithms",

    "oop": "oop",
    "oops": "oop",
    "object oriented programming": "oop",

}

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

patterns = [
    nlp.make_doc(skill)
    for skill in SKILL_MAP.keys()
]
matcher.add("SKILLS", patterns)

def normalize_text(text):

    text = text.lower()

    text = re.sub(
        r'[^a-zA-Z0-9\s\+\#]',
        ' ',
        text
    )

    text = re.sub(
        r'\s+',
        ' ',
        text
    )

    return text

def extract_skills(text):

    text = normalize_text(text)

    doc = nlp(text)

    matches = matcher(doc)

    skills = set()

    for match_id, start, end in matches:

        found = doc[start:end].text.lower().strip()

        canonical = SKILL_MAP.get(found)

        if canonical:
            skills.add(canonical)

    return sorted(list(skills))