#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python mahakal_telecom/manage.py collectstatic --no-input

# Run database migrations
python mahakal_telecom/manage.py migrate
