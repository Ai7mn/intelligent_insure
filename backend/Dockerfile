# Stage 1: Build stage - where we install dependencies efficiently
FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
# ADDED netcat-openbsd here to ensure all tools are available
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential netcat-openbsd

# Copy the requirements file first to leverage Docker's layer caching
COPY requirements.txt .

# Create a wheelhouse for faster installations
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt


# Stage 2: Final stage - where we build the final, lean production image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# The entrypoint script needs netcat, so we install it in the final image.
RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd --fix-missing

# Copy the pre-built wheels from the builder stage
COPY --from=builder /app/wheels /wheels

# Install the dependencies from the wheels
RUN pip install --no-cache /wheels/*

# Copy the rest of the application code into the container
COPY . .

# Collect static files for Django admin and other static assets
RUN python manage.py collectstatic --noinput

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

# Expose the port the app will run on
EXPOSE 8000

# The command to run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
