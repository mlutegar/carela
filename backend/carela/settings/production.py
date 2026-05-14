import urllib.parse

from .base import *  # noqa: F401, F403

DEBUG = False

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")  # noqa: F405

_db_url = os.environ.get("DATABASE_URL", "").strip()  # noqa: F405
if not _db_url:
    raise RuntimeError("DATABASE_URL nao esta definida nas variaveis de ambiente.")

_u = urllib.parse.urlparse(_db_url)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": _u.path.lstrip("/"),
        "USER": urllib.parse.unquote(_u.username or ""),
        "PASSWORD": urllib.parse.unquote(_u.password or ""),
        "HOST": _u.hostname,
        "PORT": str(_u.port or 5432),
        "OPTIONS": {"sslmode": "require"},
        "CONN_MAX_AGE": 0,
    }
}

CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")  # noqa: F405

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
