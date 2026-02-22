# from django.urls import path
# from .views import upload_resume

# urlpatterns = [

#     path('upload/', upload_resume, name='upload_resume'),

# ]









from django.urls import path

from .views import (
    upload_resume,
    add_candidate,
    get_candidates,
    update_candidate_status,
    delete_candidate
)

urlpatterns = [

    # =====================================
    # Resume ATS Analysis
    # =====================================

    path('upload/', upload_resume, name='upload_resume'),


    # =====================================
    # Candidate Database APIs (Enterprise ATS)
    # =====================================

    # Get all candidates
    path('candidates/', get_candidates, name='get_candidates'),

    # Add new candidate
    path('candidates/add/', add_candidate, name='add_candidate'),

    # Update candidate status
    path('candidates/<int:candidate_id>/update/', update_candidate_status, name='update_candidate_status'),

    # Delete candidate
    path('candidates/<int:candidate_id>/delete/', delete_candidate, name='delete_candidate'),

]