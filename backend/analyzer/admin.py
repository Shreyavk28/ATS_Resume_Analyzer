# from django.contrib import admin
# from .models import Resume

# admin.site.register(Resume)



from django.contrib import admin
from .models import Resume, Candidate


# Register Resume model
@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "file",
        "uploaded_at"
    )

    ordering = ("-uploaded_at",)


# Register Candidate model
@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "ats_score",
        "predicted_role",
        "status",
        "created_at"
    )

    list_filter = (
        "status",
        "predicted_role",
        "created_at"
    )

    search_fields = (
        "name",
        "predicted_role"
    )

    ordering = ("-created_at",)