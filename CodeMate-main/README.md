# 🚀 CodeMate - Collaborative Coding Platform

A full-stack collaborative coding platform where users can write, execute, and share code in real-time.

---

## 🌐 Live Architecture

```
Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Atlas (Cloud Database)
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Socket.io

### DevOps & Cloud

* Docker & Docker Compose
* Terraform (Infrastructure as Code)
* AWS EC2 (Deployment)
* MongoDB Atlas (Cloud DB)

---

## 📦 Features

* 🔐 User Authentication (Signup/Login)
* 💻 Real-time collaborative code editor
* ⚡ Code execution support
* 👥 Multi-user rooms
* ☁️ Cloud-based database (MongoDB Atlas)
* 🐳 Dockerized application
* ☁️ AWS deployment ready

---

## 🧠 DevOps Architecture

* Infrastructure provisioned using Terraform:

  * VPC
  * Public & Private Subnets
  * EC2 Instances
* Application containerized using Docker
* Deployed on AWS EC2
* External database hosted on MongoDB Atlas

---

## 🚀 Getting Started (Local Setup)

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/codemate-devops.git
cd codemate-devops
```

---

### 2. Setup Environment Variables

#### Backend (`server/.env`)

```
MONGODB_CONNECTION=<your-mongodb-atlas-url>
JWT_SECRET=your_secret_key
```

#### Frontend (`client/.env`)

```
VITE_BACKEND_URL=http://localhost:5000
```

---

### 3. Run with Docker

```bash
docker compose up --build
```

---

### 4. Open Application

```
http://localhost:5173
```

---

## ☁️ Deployment (AWS)

### Steps:

1. Launch EC2 instance (Ubuntu)
2. Install Docker & Docker Compose
3. Clone repository on EC2
4. Update environment variables:

   * Backend → MongoDB Atlas URL
   * Frontend → EC2 Public IP
5. Run:

```bash
docker compose up --build -d
```

6. Access app:

```
http://<EC2-PUBLIC-IP>:5173
```

---

## 📁 Project Structure

```
CodeMate/
│
├── client/        # Frontend (React)
├── server/        # Backend (Node.js)
├── terraform/     # Infrastructure as Code
├── docker-compose.yml
└── README.md
```

---

## 🔐 Security Notes

* Do not commit `.env` files
* Use `.gitignore` for sensitive data
* Use environment variables for secrets

---

## 💡 Future Improvements

* HTTPS (SSL with Nginx)
* CI/CD pipeline (GitHub Actions)
* Domain integration
* Load balancing
* Kubernetes deployment

---

## 👨‍💻 Author

Tushar Vohra

---

## ⭐ Contribution

Feel free to fork, improve, and contribute!

---

## 📜 License

This project is for educational and learning purposes.
