
from django.urls import path
from .views import (
    upload_resume,
    add_candidate,
    get_candidates,
    update_candidate_status,
    delete_candidate
)

urlpatterns = [

    path('upload/', upload_resume, name='upload_resume'),

    path('candidates/', get_candidates, name='get_candidates'),

    path('candidates/add/', add_candidate, name='add_candidate'),

    path('candidates/<int:candidate_id>/update/', update_candidate_status, name='update_candidate_status'),

    path('candidates/<int:candidate_id>/delete/', delete_candidate, name='delete_candidate'),

]