
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Resume, Candidate
from .resume_parser import extract_text_from_pdf
from .skill_extractor import extract_skills
from .ats_calculator import calculate_ats_score

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):

    try:

        file = request.FILES.get('file')
        job_description = request.data.get('job_description')

        if not file:
            return Response({
                "error": "Resume file is required"
            }, status=400)

        if not job_description:
            return Response({
                "error": "Job description is required"
            }, status=400)

        resume = Resume.objects.create(file=file)

        file_path = resume.file.path
        resume_text = extract_text_from_pdf(file_path)
        resume_skills = extract_skills(resume_text)
        job_skills = extract_skills(job_description)
        ats_result = calculate_ats_score(resume_skills, job_skills)
        resume.extracted_text = resume_text
        resume.skills = ats_result["resume_skills"]
        resume.save()
        return Response({

            "ats_score": ats_result["ats_score"],
            "matched_skills": ats_result["matched_skills"],
            "missing_skills": ats_result["missing_skills"],
            "resume_skills": ats_result["resume_skills"],
            "job_skills": ats_result["job_skills"],
            "predicted_role": ats_result["predicted_role"],
            "role_scores": ats_result["role_scores"],
            "suggestions": ats_result["suggestions"]

        })

    except Exception as e:

        print("ERROR:", str(e))

        return Response({
            "error": str(e)
        }, status=500)

@api_view(["POST"])
def add_candidate(request):

    try:

        data = request.data

        candidate = Candidate.objects.create(

            name=data.get("name"),

            ats_score=data.get("score"),

            predicted_role=data.get("role"),

            matched_skills=data.get("matched_skills", []),

            missing_skills=data.get("missing_skills", []),

            status=data.get("status", "Consider")

        )

        return Response({

            "message": "Candidate added successfully",

            "candidate_id": candidate.id

        })

    except Exception as e:

        return Response({

            "error": str(e)

        }, status=500)

@api_view(["GET"])
def get_candidates(request):

    try:

        candidates = Candidate.objects.all().order_by("-created_at")

        data = []

        for c in candidates:

            data.append({

                "id": c.id,

                "name": c.name,

                "score": c.ats_score,

                "role": c.predicted_role,

                "matched_skills": c.matched_skills,

                "missing_skills": c.missing_skills,

                "status": c.status,

                "created_at": c.created_at

            })

        return Response(data)

    except Exception as e:

        return Response({

            "error": str(e)

        }, status=500)

@api_view(["PUT"])
def update_candidate_status(request, candidate_id):

    try:

        candidate = Candidate.objects.get(id=candidate_id)

        new_status = request.data.get("status")

        candidate.status = new_status

        candidate.save()

        return Response({

            "message": "Status updated"

        })

    except Candidate.DoesNotExist:

        return Response({

            "error": "Candidate not found"

        }, status=404)

@api_view(["DELETE"])
def delete_candidate(request, candidate_id):

    try:

        candidate = Candidate.objects.get(id=candidate_id)

        candidate.delete()

        return Response({

            "message": "Candidate deleted"

        })

    except Candidate.DoesNotExist:

        return Response({

            "error": "Candidate not found"

        }, status=404)