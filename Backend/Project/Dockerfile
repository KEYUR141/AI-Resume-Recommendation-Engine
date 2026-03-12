# ---- Base Image ----
# Using Python 3.13 slim variant — lightweight Linux with Python pre-installed
# "slim" is ~150MB vs ~900MB for the full image. Has just enough to run Python.
FROM python:3.13-slim

# ---- Environment Variables ----
# Prevents Python from writing .pyc bytecode files (unnecessary in containers)
ENV PYTHONDONTWRITEBYTECODE=1
# Forces Python stdout/stderr to be unbuffered, so logs appear instantly in "docker logs"
ENV PYTHONUNBUFFERED=1

# ---- Working Directory ----
# Creates /app inside the container and sets it as the current directory
# All commands below will run from /app (like doing: mkdir /app && cd /app)
WORKDIR /app

# ---- System Dependencies ----
# These are Linux packages needed to compile certain Python packages:
#   libpq-dev → required by psycopg2 (PostgreSQL adapter) to connect to PostgreSQL
#   gcc       → C compiler needed to build Python packages that have C extensions
# "rm -rf /var/lib/apt/lists/*" cleans up apt cache to keep the image small
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# ---- Python Dependencies ----
# Copy requirements.txt FIRST, separately from the rest of the code
# Why? Docker caches each step (layer). If requirements.txt hasn't changed,
# Docker will skip "pip install" on subsequent builds — saving several minutes
COPY requirements.txt .

# Install all Python packages listed in requirements.txt
# --no-cache-dir → don't store pip's download cache (saves ~50-100MB in the image)
RUN pip install --no-cache-dir -r requirements.txt

# ---- Application Code ----
# Copy everything from Backend/Project/ (where this Dockerfile lives)
# into /app/ inside the container — this includes manage.py, app/, Project/, etc.
COPY . .

# ---- Port Declaration ----
# Documents that this container will listen on port 8000
# This does NOT actually publish the port — that's done in docker-compose.yml
EXPOSE 8000

# ---- Startup Command ----
# Runs when the container starts (not during build)
# gunicorn = production-grade WSGI server (replaces "python manage.py runserver")
# Project.wsgi:application = points to the WSGI app defined in Project/wsgi.py
# 0.0.0.0 = listen on ALL network interfaces (required in Docker; "localhost" won't work)
# --workers 3 = spawn 3 parallel worker processes to handle requests
CMD ["gunicorn", "Project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]