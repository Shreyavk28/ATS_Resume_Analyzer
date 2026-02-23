"""
Django settings for backend project.
Production-ready settings for ATS Resume Analyzer deployment on Render.
"""

from corsheaders.defaults import default_headers
from pathlib import Path
import os

# ================================
# BASE DIRECTORY
# ================================

BASE_DIR = Path(__file__).resolve().parent.parent


# ================================
# SECURITY SETTINGS
# ================================

SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-fallback-key"
)

DEBUG = False

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    ".onrender.com",
    ".netlify.app",
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


# ================================
# INSTALLED APPS
# ================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third party
    "rest_framework",
    "corsheaders",

    # Local
    "analyzer",
]


# ================================
# MIDDLEWARE
# ================================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ================================
# URL CONFIG
# ================================

ROOT_URLCONF = "backend.urls"


# ================================
# TEMPLATES
# ================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ================================
# WSGI
# ================================

WSGI_APPLICATION = "backend.wsgi.application"


# ================================
# DATABASE
# ================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",

        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ================================
# PASSWORD VALIDATION
# ================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# ================================
# INTERNATIONALIZATION
# ================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# ================================
# STATIC FILES (RENDER REQUIRED)
# ================================

STATIC_URL = "/static/"

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# ================================
# MEDIA FILES (UPLOAD)
# ================================

MEDIA_URL = "/media/"

MEDIA_ROOT = os.path.join(BASE_DIR, "media")


# ================================
# DEFAULT PRIMARY KEY
# ================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ================================
# CORS SETTINGS (IMPORTANT)
# ================================

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    "https://inspiring-boba-1c8de0.netlify.app",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "content-type",
]


# ================================
# CSRF TRUSTED ORIGINS
# ================================

CSRF_TRUSTED_ORIGINS = [
    "https://*.onrender.com",
    "https://*.netlify.app",
]


# ================================
# FILE UPLOAD SETTINGS
# ================================

DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB

FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB


# ================================
# RENDER SPECIFIC
# ================================

SECURE_SSL_REDIRECT = False

SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True