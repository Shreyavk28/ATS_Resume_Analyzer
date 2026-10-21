
import re
import spacy
from spacy.matcher import PhraseMatcher


nlp = spacy.load("en_core_web_sm")


# Alias -> canonical skill name
SKILL_MAP = {
    # Programming languages
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

    # Frontend
    "html": "html",
    "html5": "html",
    "css": "css",
    "css3": "css",
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
    "redux": "redux",

    # Backend
    "node": "nodejs",
    "node js": "nodejs",
    "node.js": "nodejs",
    "nodejs": "nodejs",
    "express": "express",
    "express js": "express",
    "express.js": "express",
    "django": "django",
    "flask": "flask",
    "fastapi": "fastapi",
    "spring": "spring",
    "spring boot": "spring boot",
    "springboot": "spring boot",
    "hibernate": "hibernate",
    "microservices": "microservices",
    "maven": "maven",
    "gradle": "gradle",
    "jsp": "jsp",
    "servlet": "servlet",

    # Databases
    "sql": "sql",
    "mysql": "mysql",
    "postgres": "postgresql",
    "postgresql": "postgresql",
    "sqlite": "sqlite",
    "mongodb": "mongodb",
    "mongo db": "mongodb",
    "oracle": "oracle",
    "redis": "redis",
    "duckdb": "duckdb",

    # APIs
    "rest api": "rest api",
    "rest apis": "rest api",
    "restful api": "rest api",
    "restful apis": "rest api",
    "graphql": "graphql",

    # Version control and development tools
    "git": "git",
    "github": "github",
    "gitlab": "gitlab",
    "postman": "postman",
    "vscode": "vscode",
    "visual studio code": "vscode",
    "intellij": "intellij",
    "jupyter": "jupyter",
    "jupyter notebook": "jupyter",
    "sqlglot": "sqlglot",

    # DevOps and cloud
    "docker": "docker",
    "kubernetes": "kubernetes",
    "aws": "aws",
    "amazon web services": "aws",
    "azure": "azure",
    "gcp": "gcp",
    "google cloud": "gcp",
    "jenkins": "jenkins",
    "ci cd": "ci/cd",
    "ci/cd": "ci/cd",

    # AI and machine learning
    "machine learning": "machine learning",
    "ml": "machine learning",
    "deep learning": "deep learning",
    "artificial intelligence": "artificial intelligence",
    "ai": "artificial intelligence",
    "tensorflow": "tensorflow",
    "keras": "keras",
    "pytorch": "pytorch",
    "torch": "pytorch",
    "numpy": "numpy",
    "pandas": "pandas",
    "matplotlib": "matplotlib",
    "seaborn": "seaborn",
    "plotly": "plotly",
    "scikit learn": "scikit-learn",
    "scikit-learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "spacy": "spacy",
    "spa cy": "spacy",
    "data preprocessing": "data preprocessing",
    "feature engineering": "feature engineering",
    "model evaluation": "model evaluation",
    "data analysis": "data analysis",
    "data visualization": "data visualization",
    "exploratory data analysis": "exploratory data analysis",
    "statistics": "statistics",
    "probability": "probability",
    "regression": "regression",
    "linear regression": "linear regression",
    "logistic regression": "logistic regression",
    "classification": "classification",
    "clustering": "clustering",
    "decision tree": "decision trees",
    "decision trees": "decision trees",
    "random forest": "random forest",
    "support vector machine": "support vector machine",
    "support vector machines": "support vector machine",
    "neural network": "neural networks",
    "neural networks": "neural networks",
    "natural language processing": "nlp",
    "nlp": "nlp",
    "computer vision": "computer vision",
    "image processing": "image processing",
    "large language model": "llm",
    "large language models": "llm",
    "llm": "llm",
    "llm integration": "llm",
    "generative ai": "generative ai",
    "transformer": "transformers",
    "transformers": "transformers",
    "hugging face": "hugging face",
    "opencv": "opencv",
    "face recognition": "face recognition",
    "mobilenetv2": "mobilenetv2",
    "facenet": "facenet",
    "gemini api": "gemini api",

    # Core computer science and soft skills
    "data structure": "data structures",
    "data structures": "data structures",
    "algorithm": "algorithms",
    "algorithms": "algorithms",
    "oop": "oop",
    "oops": "oop",
    "object oriented programming": "oop",
    "problem solving": "problem solving",
    "analytical thinking": "analytical thinking",
    "communication": "communication",
    "teamwork": "teamwork",
}


def normalize_text(text):
    """Normalize text while preserving technical punctuation."""
    text = text.lower()

    # Standardize Unicode dash characters.
    text = re.sub(r"[\u2010-\u2015\u2212]", "-", text)

    # Preserve symbols used in common technical terms.
    text = re.sub(r"[^a-z0-9\s+#./-]", " ", text)

    return re.sub(r"\s+", " ", text).strip()


# Normalize aliases before building the matcher.
NORMALIZED_SKILL_MAP = {
    normalize_text(alias): canonical
    for alias, canonical in SKILL_MAP.items()
}

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

patterns = [
    nlp.make_doc(alias)
    for alias in NORMALIZED_SKILL_MAP
]

matcher.add("SKILLS", patterns)


def extract_skills(text):
    """
    Extract unique canonical skills from a resume or job description.
    """
    if not isinstance(text, str) or not text.strip():
        return []

    normalized_text_value = normalize_text(text)
    doc = nlp(normalized_text_value)

    matches = matcher(doc)

    # Prefer longer phrases when multiple matches overlap.
    matches = sorted(
        matches,
        key=lambda match: (
            match[1],
            -(match[2] - match[1])
        )
    )

    selected_matches = []
    occupied_tokens = set()

    for _, start, end in matches:
        positions = set(range(start, end))

        if positions.intersection(occupied_tokens):
            continue

        selected_matches.append((start, end))
        occupied_tokens.update(positions)

    skills = set()

    for start, end in selected_matches:
        phrase = doc[start:end].text.lower().strip()
        canonical = NORMALIZED_SKILL_MAP.get(phrase)

        if canonical:
            skills.add(canonical)

    return sorted(skills)
