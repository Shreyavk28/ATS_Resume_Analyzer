
ROLE_SKILLS = {
    "Backend Developer": [
        "python", "django", "flask", "fastapi",
        "nodejs", "express", "sql", "mysql",
        "postgresql", "mongodb", "rest api",
        "graphql", "redis", "microservices", "git"
    ],

    "Frontend Developer": [
        "html", "css", "javascript", "typescript",
        "react", "angular", "vue", "nextjs",
        "bootstrap", "tailwind", "redux", "git"
    ],

    "Full Stack Developer": [
        "html", "css", "javascript", "react",
        "python", "django", "fastapi", "nodejs",
        "express", "mongodb", "sql", "rest api",
        "git", "github", "problem solving"
    ],

    "Machine Learning Engineer": [
        "python", "machine learning", "deep learning",
        "artificial intelligence", "tensorflow", "keras",
        "pytorch", "scikit-learn", "numpy", "pandas",
        "matplotlib", "seaborn", "spacy", "nlp",
        "data preprocessing", "feature engineering",
        "model evaluation", "classification", "regression",
        "clustering", "random forest", "neural networks",
        "llm", "generative ai", "computer vision",
        "image processing", "opencv", "mobilenetv2",
        "facenet"
    ],

    "Data Scientist": [
        "python", "sql", "numpy", "pandas",
        "matplotlib", "seaborn", "statistics",
        "machine learning", "scikit-learn",
        "data analysis", "data visualization",
        "exploratory data analysis", "regression",
        "classification", "clustering", "jupyter",
        "duckdb"
    ]
}


def normalize(skill):
    """Convert skill aliases to a consistent canonical representation."""
    skill = skill.lower().strip()

    mapping = {
        "node": "nodejs",
        "node.js": "nodejs",
        "node js": "nodejs",
        "express.js": "express",
        "express js": "express",
        "react.js": "react",
        "react js": "react",
        "postgres": "postgresql",
        "oops": "oop",
        "data structure": "data structures",
        "rest apis": "rest api",
        "restful api": "rest api",
        "restful apis": "rest api",
        "scikit learn": "scikit-learn",
        "sklearn": "scikit-learn",
        "torch": "pytorch",
        "ml": "machine learning",
        "machine-learning": "machine learning",
        "deep-learning": "deep learning",
        "natural language processing": "nlp",
        "large language model": "llm",
        "large language models": "llm",
        "llm integration": "llm",
        "spa cy": "spacy",
        "springboot": "spring boot",
        "mongo db": "mongodb",
        "html5": "html",
        "css3": "css",
        "next.js": "nextjs",
        "next js": "nextjs",
        "tailwind css": "tailwind",
        "google cloud": "gcp",
        "amazon web services": "aws",
        "decision tree": "decision trees",
        "support vector machines": "support vector machine",
        "neural network": "neural networks",
        "algorithms": "algorithms",
        "algorithm": "algorithms",
    }

    return mapping.get(skill, skill)


def normalize_skills(skills):
    """Return a normalized set of skill names."""
    return {
        normalize(skill)
        for skill in (skills or [])
        if isinstance(skill, str) and skill.strip()
    }


def predict_role(resume_skills, job_skills=None):
    """
    Predict the role using both the job description and resume.

    Job-description alignment receives 65% of the weight.
    Resume alignment receives 35% of the weight.

    If the JD has no recognizable role-specific skills, prediction
    falls back to resume skills.
    """
    resume_skills = normalize_skills(resume_skills)
    job_skills = normalize_skills(job_skills)

    role_skill_sets = {
        role: normalize_skills(skills)
        for role, skills in ROLE_SKILLS.items()
    }

    # Skills covered by at least one known role.
    all_role_skills = set().union(*role_skill_sets.values())

    # Avoid allowing unrelated JD words to dilute role relevance.
    relevant_job_skills = job_skills & all_role_skills

    role_scores = {}

    for role, role_skills in role_skill_sets.items():
        if not role_skills:
            role_scores[role] = 0
            continue

        resume_alignment = (
            len(resume_skills & role_skills) / len(role_skills)
        )

        if relevant_job_skills:
            job_alignment = (
                len(relevant_job_skills & role_skills)
                / len(relevant_job_skills)
            )

            score = (
                0.65 * job_alignment
                + 0.35 * resume_alignment
            )
        else:
            score = resume_alignment

        role_scores[role] = round(score * 100)

    if not role_scores or max(role_scores.values(), default=0) == 0:
        return "General Candidate", role_scores

    # Prefer the first highest-scoring role in ROLE_SKILLS on ties.
    best_role = max(role_scores, key=role_scores.get)

    return best_role, role_scores


def calculate_ats_score(resume_skills, job_skills):
    resume_skills = normalize_skills(resume_skills)
    job_skills = normalize_skills(job_skills)

    matched = resume_skills & job_skills
    missing = job_skills - resume_skills

    ats_score = (
        round(len(matched) / len(job_skills) * 100)
        if job_skills else 0
    )

    predicted_role, role_scores = predict_role(
        resume_skills,
        job_skills
    )

    suggestions = []

    # Prioritize missing job requirements.
    if missing:
        for skill in sorted(missing):
            suggestions.append(
                f"Priority: Address the {skill} requirement. "
                f"If you have relevant experience, highlight it in your "
                f"resume; otherwise, build a project to practise {skill}."
            )
    else:
        suggestions.append(
            "Your detected skills cover all identified job requirements. "
            "Strengthen your application with relevant project outcomes."
        )

    # Tailor advice to the ATS match.
    if ats_score < 50:
        suggestions.append(
            "Improve role alignment by highlighting relevant technical "
            "skills, projects, coursework, and experience from the job description."
        )
    elif ats_score < 75:
        suggestions.append(
            "Your resume has a moderate skill match. Add evidence of the "
            "most important required skills in your project descriptions."
        )
    else:
        suggestions.append(
            "Your resume has a strong detected skill match. Focus on "
            "demonstrating depth, ownership, and measurable project outcomes."
        )

    # Role-specific advice.
    if predicted_role in ROLE_SKILLS:
        role_skills = normalize_skills(ROLE_SKILLS[predicted_role])
        role_missing = sorted(role_skills - resume_skills)

        if role_missing:
            suggestions.append(
                f"For the {predicted_role} role, consider strengthening "
                f"these areas: {', '.join(role_missing[:4])}."
            )

    suggestions.append(
        "Describe relevant projects with the problem solved, your "
        "technical contribution, technologies used, and the outcome."
    )

    suggestions.append(
        "Use clear section headings and standard formatting so applicant "
        "tracking systems can identify your skills and experience."
    )

    return {
        "ats_score": ats_score,
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
        "resume_skills": sorted(resume_skills),
        "job_skills": sorted(job_skills),
        "predicted_role": predicted_role,
        "role_scores": role_scores,
        "suggestions": suggestions
    }
