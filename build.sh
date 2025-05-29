#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Navigate to Django project
cd server/mylugha

# Collect static files
python manage.py collectstatic --noinput

# Run migrations (optional, comment out if using external database)
# python manage.py migrate --noinput
