from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static


# Home route to verify backend is running
def home(request):
    return HttpResponse("ATS Resume Analyzer Backend is running successfully")


urlpatterns = [

    # Root URL
    path('', home),

    # Admin panel
    path('admin/', admin.site.urls),

    # Analyzer API routes
    path('api/', include('analyzer.urls')),

]


# Serve media files (for resume uploads)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# Serve static files in DEBUG mode only
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)