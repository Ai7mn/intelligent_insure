# Intelligent Insure: Full-Stack AI-Powered Life Insurance Recommendation Engine

![React](https://img.shields.io/badge/React-Next.js-blue?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-REST-green?style=for-the-badge&logo=django)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Container-Docker-blue?style=for-the-badge&logo=docker)
![AWS](https://img.shields.io/badge/Deployment-Elastic_Beanstalk-orange?style=for-the-badge&logo=amazon-aws)

**Intelligent Insure** is a comprehensive full-stack prototype of a web application that provides users with a personalized, AI-driven life insurance recommendation. This project demonstrates proficiency in modern web development, machine learning integration, and DevOps best practices, from local development to a production cloud deployment.

---

### Key Features

* **🤖 AI-Powered Recommendations:** Utilizes a sophisticated multi-model system (trained on a rich, AI-generated dataset) to predict the optimal policy type, coverage amount, and term length.
* **🔐 Secure JWT Authentication:** A complete and secure authentication system with JWT for login and registration, including automated token refresh for a seamless user experience.
* **✨ Modern Frontend:** A sleek, fully responsive user interface built with **Next.js** and **Shadcn/UI**, featuring a professional design and a **light/dark mode toggle**.
* **🚀 Robust RESTful API:** A powerful backend built with **Django** and Django REST Framework, serving the ML models and handling all business logic.
* **🐳 Fully Containerized:** The entire application stack (Frontend, Backend, Database) is containerized using **Docker** and orchestrated with `docker-compose` for easy local development.
* **☁️ Cloud-Ready:** Designed for production deployment on **AWS Elastic Beanstalk**, demonstrating a clear path from development to a scalable, cloud-native environment.


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
4.  **Generate the Machine Learning Model:**
    The trained model file is not stored in Git. You must generate it locally.
    ```bash
    python create_model.py
    ```
5.  **Set up environment variables:**
    Copy `.env.example` to a new file named `.env` and fill in your local PostgreSQL details and a `SECRET_KEY`.
    ```bash
    cp .env.example .env
    ```
6.  **Run database migrations:**
    ```bash
    python manage.py migrate
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

This is the recommended method as it runs the entire application stack in a production-like environment with a single command.

#### Prerequisites
* Docker
* Docker Compose

#### Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ai7mn/intelligent-insure.git
    cd intelligent-insure
    ```
2.  **Generate the Machine Learning Model:**
    The Docker build process for the backend requires the trained model file. You must generate it on your host machine first.
    ```bash
    cd backend
    python create_model.py
    cd .. 
    ```
3.  **Set up environment variables:**
    In the `backend` directory, copy `.env.example` to a new file named `.env`.
    ```bash
    cp backend/.env.example backend/.env
    ```
    Open `backend/.env` and replace the placeholder `SECRET_KEY` with a new, long, random string. The database credentials in this file will be used to automatically configure the PostgreSQL container.

4.  **Build and Run with Docker Compose:**
    From the root `intelligent-insure` directory, run:
    ```bash
    docker-compose up --build
    ```
    This command will:
    * Build the Docker images for the frontend and backend.
    * Start containers for the frontend, backend, and PostgreSQL database.
    * Automatically apply the Django database migrations.

5.  **Access the Application:**
    * Frontend (Next.js): `http://localhost:3000`
    * Backend API (Django): `http://localhost:8000/api/`

---

### Option 3: AWS Elastic Beanstalk Deployment Guide

This guide details how to deploy the multi-container Docker application to AWS Elastic Beanstalk.

#### Prerequisites
* An active **AWS account**.
* **AWS CLI** installed and configured.
* **Docker** installed locally.

#### Step 1: Build and Push Docker Images to ECR
First, we need to store our container images in the AWS Elastic Container Registry (ECR).

1.  **Create ECR Repositories:**
    ```bash
    aws ecr create-repository --repository-name intelligent-insure-backend
    aws ecr create-repository --repository-name intelligent-insure-frontend
    ```
2.  **Authenticate Docker with ECR:**
    ```bash
    aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com
    ```
    *(Replace `YOUR_REGION` and `YOUR_AWS_ACCOUNT_ID`).*
3.  **Build, Tag, and Push Images:**
    * **Backend:**
        ```bash
        docker build -t intelligent-insure-backend ./backend
        docker tag intelligent-insure-backend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_[REGION.amazonaws.com/intelligent-insure-backend:latest](https://REGION.amazonaws.com/intelligent-insure-backend:latest)
        docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_[REGION.amazonaws.com/intelligent-insure-backend:latest](https://REGION.amazonaws.com/intelligent-insure-backend:latest)
        ```
    * **Frontend:**
        ```bash
        docker build -t intelligent-insure-frontend ./frontend
        docker tag intelligent-insure-frontend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_[REGION.amazonaws.com/intelligent-insure-frontend:latest](https://REGION.amazonaws.com/intelligent-insure-frontend:latest)
        docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_[REGION.amazonaws.com/intelligent-insure-frontend:latest](https://REGION.amazonaws.com/intelligent-insure-frontend:latest)
        ```

#### Step 2: Create a Production Database (RDS)
1.  Navigate to the **RDS Console** in AWS and click **"Create database"**.
2.  Choose **"Standard Create"** and select **"PostgreSQL"**.
3.  Select the **"Free tier"** template.
4.  Configure settings: **DB instance identifier** (`intelligent-insure-db`), a **master username**, and a strong **master password**.
5.  Under **"Public access"**, select **"No"**.
6.  Click **"Create database"**. Once it's available, note down its **Endpoint URL**.

#### Step 3: Create the Elastic Beanstalk Application
1.  Navigate to the **Elastic Beanstalk Console** and click **"Create Application"**.
2.  **Application name:** `IntelligentInsure`
3.  **Platform:** Select **"Docker"**.
4.  **Platform branch:** Select **"ECS running on 64bit Amazon Linux 2023"** (or a similar version with "ECS").
5.  **Application code:** Select **"Upload your code"**.
6.  Click **"Create application"**.

#### Step 4: Configure and Deploy
1.  **Prepare `Dockerrun.aws.json`:**
    * Open the `Dockerrun.aws.json` file at the root of your project.
    * Replace all placeholder values (`YOUR_...`) with your actual ECR image URIs, RDS endpoint, database password, a new Django secret key, and your Elastic Beanstalk environment URL (which you will get after the first deployment).
2.  **Create a Source Bundle:**
    Create a `.zip` file that contains **only** the `Dockerrun.aws.json` file.
    ```bash
    zip -r intelligent-insure-deploy.zip Dockerrun.aws.json
    ```
3.  **Deploy the Application:**
    * In your Elastic Beanstalk environment dashboard, click **"Upload and deploy"**.
    * Choose the `intelligent-insure-deploy.zip` file.
    * Give it a **Version label** (e.g., `v1.0.0`) and click **"Deploy"**.

#### Step 5: Configure Security Groups
The final step is to allow the Elastic Beanstalk environment to communicate with the RDS database.

1.  **Find your Elastic Beanstalk Security Group:**
    * In the Elastic Beanstalk environment dashboard, go to **Configuration > Instances**.
    * Note the name of the **"EC2 security groups"**.
2.  **Update the RDS Security Group:**
    * Go to the **RDS Console**, select your database, and go to the **"Connectivity & security"** tab.
    * Click on the active **VPC security group**.
    * Select the **"Inbound rules"** tab and click **"Edit inbound rules"**.
    * Click **"Add rule"**:
        * **Type:** `PostgreSQL`
        * **Source:** Select **"Custom"** and start typing the name of your Elastic Beanstalk security group. Select it from the list.
    * Click **"Save rules"**.

Your application is now fully deployed. You can access it via the URL provided on your Elastic Beanstalk environment dashboard.
