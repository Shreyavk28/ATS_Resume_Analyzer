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
        "Javascript", "react",
        "python", "django", "nodejs", "express",
        "mongodb", "sql", "git", "rest api","GitHub", "Problem Solving"
    ],

    "Machine Learning Engineer": [
        "python", "tensorflow", "keras", "sql", "numPy", "Pandas", "LLM"
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

    resume_skills = set(normalize(s) for s in resume_skills)
    job_skills = set(normalize(s) for s in job_skills)

    matched = resume_skills & job_skills
    missing = job_skills - resume_skills

    ats_score = (
        round(len(matched) / len(job_skills) * 100)
        if job_skills else 0
    )

    predicted_role, role_scores = predict_role(resume_skills)

    suggestions = []

    # Prioritize missing job requirements
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

    # Tailor advice to the overall match
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

    # Role-specific advice
    if predicted_role:
        role_skills = {
            normalize(s)
            for s in ROLE_SKILLS.get(predicted_role, [])
        }
        role_missing = sorted(role_skills - resume_skills)

        if role_missing:
            suggestions.append(
                f"For the {predicted_role} role, consider strengthening "
                f"these areas: {', '.join(role_missing[:4])}."
            )

    # General resume quality advice without repeating skill recommendations
    suggestions.append(
        "Describe two relevant projects with the problem solved, your "
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


