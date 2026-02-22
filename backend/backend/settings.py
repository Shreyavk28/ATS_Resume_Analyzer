"""
Django settings for backend project.

Production-ready settings for ATS Resume Analyzer deployment.
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

SECRET_KEY = 'django-insecure-8bj+z1bkb7swa4)ebu_2#v8t2yaw3!d&209o9%yrpby53%7rr9'

# Change to False in production
DEBUG = True

# Allow Render + Netlify + Localhost
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    '.onrender.com',
    '.netlify.app',
]


# ================================
# INSTALLED APPS
# ================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'rest_framework',
    'corsheaders',

    # Local app
    'analyzer',
]


# ================================
# MIDDLEWARE
# ================================

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',

    # Required for static files in production
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ================================
# URL CONFIG
# ================================

ROOT_URLCONF = 'backend.urls'


# ================================
# TEMPLATES
# ================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],

        'APP_DIRS': True,

        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ================================
# WSGI
# ================================

WSGI_APPLICATION = 'backend.wsgi.application'


# ================================
# DATABASE (SQLite for now)
# ================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',

        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ================================
# PASSWORD VALIDATION
# ================================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ================================
# INTERNATIONALIZATION
# ================================

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# ================================
# STATIC FILES (IMPORTANT FOR RENDER)
# ================================

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# ================================
# MEDIA FILES (RESUME UPLOADS)
# ================================

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# ================================
# DEFAULT PRIMARY KEY
# ================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ================================
# CORS SETTINGS (FOR REACT FRONTEND)
# ================================

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    'content-type',
]


# ================================
# RENDER SPECIFIC SETTINGS
# ================================

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')