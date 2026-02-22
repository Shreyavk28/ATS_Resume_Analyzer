# ats_calculator.py

ROLE_SKILLS = {

    "Backend Developer": [
        "python", "django", "nodejs", "express",
        "sql", "mysql", "postgresql", "mongodb",
        "rest api", "git"
    ],

    "Frontend Developer": [
        "html", "css", "javascript", "react", "git"
    ],

    "Full Stack Developer": [
        "html", "css", "javascript", "react",
        "python", "django", "nodejs", "express",
        "mongodb", "sql", "git", "rest api"
    ],

    "Machine Learning Engineer": [
        "python", "tensorflow", "keras", "sql"
    ]
}


def normalize(skill):

    skill = skill.lower().strip()

    mapping = {

        "node": "nodejs",
        "node.js": "nodejs",
        "nodejs": "nodejs",

        "express.js": "express",
        "express": "express",

        "react.js": "react",
        "react": "react",

        "postgres": "postgresql",

        "oops": "oop",

        "data structure": "data structures",

        "rest apis": "rest api",
        "restful api": "rest api",
        "restful apis": "rest api",
    }

    return mapping.get(skill, skill)


def predict_role(resume_skills):

    best_role = None
    best_score = 0
    role_scores = {}

    resume_skills = set(normalize(skill) for skill in resume_skills)

    for role, skills in ROLE_SKILLS.items():

        skills = set(normalize(skill) for skill in skills)

        match_count = len(resume_skills.intersection(skills))

        score = int((match_count / len(skills)) * 100)

        role_scores[role] = score

        if score > best_score:
            best_score = score
            best_role = role

    return best_role, role_scores


def calculate_ats_score(resume_skills, job_skills):

    resume_skills = set(normalize(skill) for skill in resume_skills)
    job_skills = set(normalize(skill) for skill in job_skills)

    matched = resume_skills.intersection(job_skills)
    missing = job_skills - resume_skills

    ats_score = int((len(matched) / len(job_skills)) * 100) if job_skills else 0

    predicted_role, role_scores = predict_role(resume_skills)

    suggestions = []

    if ats_score < 70:
        suggestions.append("Add more relevant skills from job description")

    if "rest api" not in resume_skills:
        suggestions.append("Learn REST API development")

    if "sql" not in resume_skills:
        suggestions.append("Add SQL or database experience")

    if "django" not in resume_skills and "nodejs" not in resume_skills:
        suggestions.append("Add backend framework like Django or Node.js")

    return {

        "ats_score": ats_score,

        "matched_skills": sorted(list(matched)),

        "missing_skills": sorted(list(missing)),

        "resume_skills": sorted(list(resume_skills)),

        "job_skills": sorted(list(job_skills)),

        "predicted_role": predicted_role,

        "role_scores": role_scores,

        "suggestions": suggestions
    }
