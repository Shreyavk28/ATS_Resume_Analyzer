# from django.db import models

# class Resume(models.Model):

#     file = models.FileField(upload_to='resumes/')

#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     extracted_text = models.TextField(blank=True)

#     skills = models.TextField(blank=True)

#     def __str__(self):
#         return self.file.name




from django.db import models


# Resume model (for uploaded resume file)
class Resume(models.Model):

    file = models.FileField(upload_to="resumes/")

    extracted_text = models.TextField(blank=True)

    skills = models.JSONField(default=list, blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name


# Candidate model (for recruiter dashboard)
class Candidate(models.Model):

    name = models.CharField(max_length=255)

    ats_score = models.IntegerField()

    predicted_role = models.CharField(max_length=255)

    matched_skills = models.JSONField(default=list)

    missing_skills = models.JSONField(default=list)

    status = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.ats_score}%)"