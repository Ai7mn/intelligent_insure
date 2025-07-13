# Intelligent Insure: Full-Stack AI-Powered Life Insurance Recommendation Engine

![React](https://img.shields.io/badge/React-Next.js-blue?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-REST-green?style=for-the-badge&logo=django)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Container-Docker-blue?style=for-the-badge&logo=docker)
![AWS](https://img.shields.io/badge/Deployment-AWS_ECS-orange?style=for-the-badge&logo=amazon-aws)

**Intelligent Insure** is a comprehensive full-stack prototype of a web application that educates users about life insurance and provides a personalized, AI-driven recommendation based on their unique financial and personal profile. This project was built to demonstrate proficiency in modern web development, machine learning integration, and DevOps best practices.

---

### Key Features

* **🤖 AI-Powered Recommendations:** Utilizes a sophisticated multi-model system (trained on a rich, AI-generated dataset) to predict the optimal policy type, coverage amount, and term length.
* **🔐 Secure JWT Authentication:** A complete and secure authentication system with JWT for login and registration, including automated token refresh for a seamless user experience.
* **✨ Modern Frontend:** A sleek, fully responsive user interface built with **Next.js** and **Shadcn/UI**, featuring a professional design and a **light/dark mode toggle**.
* **🚀 Robust RESTful API:** A powerful backend built with **Django** and Django REST Framework, serving the ML models and handling all business logic.
* **🐳 Fully Containerized:** The entire application stack (Frontend, Backend, Database) is containerized using **Docker** and orchestrated with `docker-compose` for easy local development.
* **☁️ Cloud-Ready:** Designed for production deployment on **AWS ECS**, demonstrating a clear path from development to a scalable, cloud-native environment.

### Architecture

The application follows a modern, decoupled three-tier architecture, ensuring scalability and separation of concerns.

![Architecture Diagram](https://i.imgur.com/8n8aD1L.png)

---

## 🚀 Getting Started

This project can be run in three ways: locally without containers, locally with Docker, or deployed to AWS.

### Option 1: Local Development without Docker

This method is suitable for developing and testing individual components (frontend or backend) separately.

#### Prerequisites
* Python 3.11+
* Node.js 20.x+
* A running PostgreSQL instance.

#### Backend Setup
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables:**
    Copy `.env.example` to a new file named `.env` and fill in your local PostgreSQL details and a `SECRET_KEY`.
    ```bash
    cp .env.example .env
    ```
5.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```
6.  **Create a superuser (optional):**
    ```bash
    python manage.py createsuperuser
    ```
7.  **Start the Django development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://localhost:8000`.

#### Frontend Setup
1.  **Navigate to the frontend directory in a new terminal:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Copy `.env.example` to a new file named `.env.local`. The default API URL (`http://localhost:8000`) should work correctly with the local backend server.
    ```bash
    cp .env.example .env.local
    ```
4.  **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

---

### Option 2: Local Development with Docker (Recommended)

This is the recommended method for local development as it runs the entire application stack in a production-like environment with a single command.

#### Prerequisites
* Docker
* Docker Compose

#### Setup
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/intelligent-insure.git](https://github.com/your-username/intelligent-insure.git)
    cd intelligent-insure
    ```
2.  **Set up environment variables:**
    In the `backend` directory, copy `.env.example` to a new file named `.env`.
    ```bash
    cp backend/.env.example backend/.env
    ```
    Open `backend/.env` and replace the placeholder `SECRET_KEY` with a new, long, random string. The database credentials in this file will be used to automatically configure the PostgreSQL container.

3.  **Build and Run with Docker Compose:**
    From the root `intelligent-insure` directory, run:
    ```bash
    docker-compose up --build
    ```
    This command will:
    * Build the Docker images for the frontend and backend.
    * Start containers for the frontend, backend, and PostgreSQL database.
    * Automatically apply the Django database migrations.

4.  **Access the Application:**
    * Frontend (Next.js): `http://localhost:3000`
    * Backend API (Django): `http://localhost:8000/api/`

5.  **Create a Superuser (Optional):**
    To access the Django admin panel, open a new terminal and run:
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```
    You can then log in at `http://localhost:8000/admin`.

---

### Option 3: AWS ECS Fargate Deployment Guide

This guide provides step-by-step instructions to deploy the Intelligent Insure application to a production-like environment on AWS.

#### Prerequisites
1.  **AWS Account:** You must have an active AWS account.
2.  **AWS CLI:** The AWS Command Line Interface must be installed and configured.
3.  **Docker:** Docker must be installed and running on your local machine.

#### Step 1: Build and Push Docker Images to ECR
First, we need a private registry to store our container images.

1.  **Create ECR Repositories:**
    ```bash
    aws ecr create-repository --repository-name intelligent-insure-backend --region us-east-1
    aws ecr create-repository --repository-name intelligent-insure-frontend --region us-east-1
    ```
    *(Replace `us-east-1` with your preferred AWS region).*

2.  **Authenticate Docker with ECR:**
    ```bash
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
    ```
    *(Replace `YOUR_AWS_ACCOUNT_ID` and the region).*

3.  **Build, Tag, and Push the Images:**
    From the project's root directory, run the following commands.

    * **Backend:**
        ```bash
        docker build -t intelligent-insure-backend ./backend
        docker tag intelligent-insure-backend:latest YOUR_AWS_ACCOUNT_[ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-backend:latest](https://ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-backend:latest)
        docker push YOUR_AWS_ACCOUNT_[ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-backend:latest](https://ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-backend:latest)
        ```

    * **Frontend:**
        ```bash
        docker build -t intelligent-insure-frontend ./frontend
        docker tag intelligent-insure-frontend:latest YOUR_AWS_ACCOUNT_[ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-frontend:latest](https://ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-frontend:latest)
        docker push YOUR_AWS_ACCOUNT_[ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-frontend:latest](https://ID.dkr.ecr.us-east-1.amazonaws.com/intelligent-insure-frontend:latest)
        ```

#### Step 2: Set Up Production Database and Secrets
1.  **Create RDS Database:** In the AWS console, navigate to **RDS** and create a new **PostgreSQL** database. Choose the **"Free tier"** template for a no-cost option. Set the master username and password. Crucially, under **"Public access"**, select **"No"**. Note the database **endpoint URL**.

2.  **Store Secrets:** Navigate to **AWS Secrets Manager** and store a new secret. Choose **"Other type of secret"** and add key/value pairs for your `SECRET_KEY`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST` (the RDS endpoint), and `POSTGRES_DB`.

#### Step 3: Configure ECS and Load Balancer
1.  **Create ECS Cluster:** In the ECS console, create a new cluster using the **"Networking only"** (AWS Fargate) template. Name it `intelligent-insure-cluster`.

2.  **Create Task Definitions:** Create two task definitions:
    * **`backend-task`**: Point to your backend ECR image URI. Map port `8000`. In the **Environment** section, link the secret you created in Secrets Manager.
    * **`frontend-task`**: Point to your frontend ECR image URI. Map port `3000`. Add an environment variable `NEXT_PUBLIC_API_URL`, but leave its value empty for now.

3.  **Create Application Load Balancer (ALB):** In the EC2 console under "Load Balancers," create a new **Application Load Balancer**. Make it **internet-facing**. Create two **Target Groups**: one named `frontend-tg` for port `3000` and another named `backend-tg` for port `8000`. Edit the listener for HTTP on port 80 to have a **default action** that forwards to `frontend-tg` and a **rule** that forwards to `backend-tg` if the path is `/api/*`.

#### Step 4: Create and Launch Services
1.  **Create Services:** In your ECS cluster, create two services:
    * **`backend-service`**: Use the `backend-task` definition. Under networking, associate it with the `backend-tg` load balancer target group. Create a new security group that allows inbound traffic on port 8000 from the ALB's security group.
    * **`frontend-service`**: Use the `frontend-task` definition. Associate it with the `frontend-tg` target group. Create a new security group that allows inbound traffic on port 3000 from the ALB's security group.

2.  **Configure Database Access:** Edit the security group for your RDS database to allow inbound traffic on the PostgreSQL port (5432) from the `backend-service`'s security group.

3.  **Final Update:**
    * Copy the **DNS name** of your Application Load Balancer.
    * Go back to the `frontend-task` definition in ECS and create a **new revision**.
    * Edit the `NEXT_PUBLIC_API_URL` environment variable and paste the ALB's DNS name.
    * Update the `frontend-service` to use this new task definition revision.

Once the service finishes updating, you can navigate to your ALB's DNS name in your browser to see the live application.
