#!/bin/sh

# This script is the entry point for the backend Docker container.
# It waits for the database to be available, then applies migrations,
# and finally starts the Gunicorn server.

# The 'set -e' command ensures that the script will exit immediately if a command fails.
set -e

# Wait for the PostgreSQL database to be ready.
# We use the 'nc' (netcat) command to check if the port is open.
echo "Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the Gunicorn server
echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:8000 backend.wsgi:application
