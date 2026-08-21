# 🛡️ Guardian — AI-Powered Missing Person Identification System

Guardian is a **full-stack AI-powered missing-person identification platform** designed to register missing-person reports and assist with potential identification using **facial recognition, biometric embeddings, and vector similarity search**.

> ⚠️ **Disclaimer:** Guardian is an AI-assisted identification system. Facial-recognition results should be treated as **potential matches only** and must be verified through appropriate human and official processes before any action is taken.

---

## ✨ Key Features

* 📝 Missing-person registration with:

  * Personal details
  * Contact information
  * Last-seen information
* 🧠 AI-based face recognition using **InsightFace**
* 🔢 Facial embedding generation
* 🔍 Biometric similarity search using **Qdrant**
* 🖼️ Image preprocessing using **OpenCV**
* 🎥 Image and video-frame based face matching workflow
* ☁️ Cloud-based image storage using **Cloudinary**
* 🗄️ MongoDB for users and missing-person metadata
* 🔐 JWT-based authentication
* 🔑 Argon2 password hashing
* 👤 Protected Guardian operations
* 📊 Guardian dashboard for managing registered reports
* 🗑️ Authorized report deletion

---

# 🏗️ System Architecture

```text
                    ┌───────────────────┐
                    │   React Frontend  │
                    │ Vite + Tailwind   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   FastAPI REST    │
                    │       API         │
                    └───────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌──────────┐  ┌────────────┐  ┌──────────────┐
        │ MongoDB  │  │ Cloudinary │  │ AI Pipeline  │
        │          │  │            │  │              │
        │ Metadata │  │   Images   │  │ OpenCV       │
        │  Users   │  │            │  │ InsightFace  │
        └──────────┘  └────────────┘  └──────┬───────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │ Face         │
                                      │ Embedding    │
                                      └──────┬───────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │   Qdrant     │
                                      │ Vector DB    │
                                      └──────────────┘
```

---

# 🔄 Recognition Workflow

```text
              Missing Person Registration
                         │
                         ▼
                    Upload Image
                         │
                         ▼
                    Cloudinary
                         │
                         ▼
                OpenCV Preprocessing
                         │
                         ▼
                    InsightFace
                         │
                         ▼
                  Face Embedding
                         │
                         ▼
                      Qdrant
                         │
                         │
                         │ Later
                         ▼
              Submitted Image / Frame
                         │
                         ▼
                OpenCV + InsightFace
                         │
                         ▼
              Query Face Embedding
                         │
                         ▼
             Qdrant Similarity Search
                         │
                         ▼
             Potential Matching Profile
```

---

# 🧩 Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Lucide React

## Backend

* Python
* FastAPI
* Uvicorn

## AI / Computer Vision

* OpenCV
* InsightFace
* ONNX Runtime

## Data & Storage

* MongoDB
* Qdrant
* Cloudinary

## Authentication & Security

* JWT
* Argon2 Password Hashing
* Environment Variables

---

# 📁 Project Structure

```text
guardian/
│
├── backend/
│   │
│   ├── ai/
│   │   ├── face/
│   │   ├── image_preprocessing/
│   │   └── vector_db/
│   │
│   ├── app/
│   │   ├── auth/
│   │   ├── schemas/
│   │   ├── database.py
│   │   ├── config.py
│   │   └── cloudinary_config.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

JWT_SECRET_KEY=your_jwt_secret
```

> 🔐 **Never commit real credentials or `.env` files to GitHub.**

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd guardian
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

### Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

### Swagger API Documentation

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

# 🔐 Authentication Flow

```text
        Register
           │
           ▼
   Password Hashing
        (Argon2)
           │
           ▼
        MongoDB
           │
           ▼
         Login
           │
           ▼
     JWT Access Token
           │
           ▼
   Protected API Requests
           │
           ▼
 Guardian-specific Operations
```

Guardian-specific operations use the **authenticated user's identity** to ensure that users can only manage authorized reports.

---

# 🧠 Face Recognition Pipeline

The facial recognition pipeline follows these steps:

```text
Input Image / Video Frame
            │
            ▼
     OpenCV Processing
            │
            ▼
     Face Detection
       InsightFace
            │
            ▼
    Face Embedding
            │
            ▼
     Qdrant Vector DB
            │
            ▼
   Similarity Search
            │
            ▼
 Potential Matching Profile
```

### Pipeline Components

| Component    | Responsibility                          |
| ------------ | --------------------------------------- |
| OpenCV       | Image preprocessing                     |
| InsightFace  | Face detection and embedding generation |
| ONNX Runtime | Model inference                         |
| Qdrant       | Vector similarity search                |
| Cloudinary   | Image storage                           |
| MongoDB      | Metadata and user information           |

---

# 🗄️ Data Responsibilities

| Component       | Responsibility                                 |
| --------------- | ---------------------------------------------- |
| **MongoDB**     | Users and missing-person report metadata       |
| **Cloudinary**  | Uploaded image storage                         |
| **Qdrant**      | Facial embeddings and vector similarity search |
| **OpenCV**      | Image preprocessing                            |
| **InsightFace** | Face detection and face embeddings             |
| **FastAPI**     | REST API and application logic                 |
| **React**       | Frontend and dashboard                         |

---

# 🔌 API Overview

## Authentication

### Register

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

### Get Current User

```http
GET /auth/me
```

---

## Missing Person

### Register Missing Person

```http
POST /missing-persons
```

### Delete Missing Person

```http
DELETE /missing-persons/{person_id}
```

---

## Identification

### Find Potential Person

```http
POST /find-person
```

---

## Health Check

```http
GET /health
```

---

# 📚 API Documentation

Once the backend is running, explore the complete API through FastAPI Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 🔒 Security

Guardian implements several security mechanisms:

* Passwords are hashed before storage using **Argon2**.
* JWT tokens protect authenticated API endpoints.
* Guardian-specific operations verify the authenticated user's identity.
* API credentials are stored in environment variables.
* Database credentials are not hardcoded.
* `.env` files should never be committed to the repository.

---

# 🎯 Project Goals

The main goals of Guardian are:

* Centralize missing-person reporting.
* Assist potential identification using facial embeddings.
* Enable fast biometric similarity search.
* Separate application data, image storage, and vector-search responsibilities.
* Provide a secure interface for managing missing-person reports.
* Build an extensible AI-powered identification pipeline.

---

# 🚧 Build Challenges & Technical Obstacles

During development, several technical challenges can arise in a system combining **AI, computer vision, databases, vector search, and authentication**.

### Face Recognition Integration

Integrating face detection and embedding generation required connecting the computer-vision pipeline with the backend API.

**Solution:**
The AI pipeline was separated into dedicated modules for face processing, preprocessing, and vector database operations.

### Vector Similarity Search

Traditional databases are not designed for efficient high-dimensional facial embedding searches.

**Solution:**
Qdrant was used as a dedicated vector database for storing embeddings and performing similarity searches.

### Image Processing

Images may have different resolutions, formats, lighting conditions, and quality.

**Solution:**
OpenCV is used as a preprocessing layer before sending images to the face-recognition pipeline.

### Secure Authentication

Protected operations require verifying that the current user owns or is authorized to manage a report.

**Solution:**
JWT-based authentication and Argon2 password hashing were implemented.

### Separation of Storage Responsibilities

Application metadata, images, and embeddings have different storage requirements.

**Solution:**

```text
MongoDB    → Application & user metadata
Cloudinary → Images
Qdrant     → Face embeddings
```

---

# 🔮 Future Scope

Potential improvements include:

* 🎥 More robust video-frame processing
* 🖼️ Improved image-quality validation
* 🎯 Better similarity/confidence evaluation
* 🔔 Notifications for high-confidence potential matches
* 📱 Mobile-friendly experience
* 📊 Advanced investigation dashboard
* 🌐 Deployment using managed cloud infrastructure
* ⚡ Optimized vector-search performance
* 🧠 Improved face-quality and duplicate detection
* 🔐 Additional security and audit mechanisms

---

# ⚠️ Disclaimer

Guardian is an **AI-assisted identification project**.

Facial-recognition results are **not definitive proof of identity**. Any potential match generated by the system should be treated as a lead and verified through appropriate **human review and official procedures** before any action is taken.

---

# 👨‍💻 Author

**Sumit Mathpal**

**B.Tech CSE | AI/ML Enthusiast**

---

⭐ If you find this project interesting, consider giving the repository a star!
