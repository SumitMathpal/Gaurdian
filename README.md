# Guardian.AI — Biometric Missing Persons Pipeline

This repository hosts **Project Guardian**, a modern administrative pipeline and community-facing portal designed to assist in matching and locating missing persons using facial recognition tech. 

---

## Technical Stack & Architecture

### Backend (`/backend`)
- **Framework:** FastAPI (Python 3.10+)
- **Vector Database:** Qdrant (for storing and matching high-dimensional facial embeddings)
- **Primary Database:** MongoDB (child and parent metadata tracking)
- **Object Storage:** Cloudinary (secure cloud image publishing)
- **AI Models:** ResNet/Inception-based facial feature extractor model pipeline

### Frontend (`/frontend`)
- **Core Framework:** React JS (Vite-backed single page client application)
- **Styling Paradigm:** Tailwind CSS v4 (native lightning-fast styles, custom layout attributes)
- **Icons Kit:** Lucide React
- **Design System:** Professional high-contrast corporate aesthetic using **Black, White, and Crimson Red** color vectors. 

---

## Getting Started

### 1. Initialize & Boot the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Windows PowerShell:**
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
   - **Linux/macOS:**
     ```bash
     source .venv/bin/activate
     ```
3. Install base dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure database environments in your `.env` file (MongoDB URI, Qdrant URL, Cloudinary Keys, JWT Secrets).
5. Spin up the FastAPI operational server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Initialize & Boot the Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install NodeJS package nodes:
   ```bash
   npm install
   ```
3. Boot the local development server:
   ```bash
   npm run dev
   ```
   *The client server starts on `http://localhost:5173`. Any calls requesting `/api/*` route paths are securely proxied directly to the FastAPI server at `http://localhost:8000` via Vite configuration.*

---

## Interface Operational Manual

- **Overview Page:** Describes platform intelligence models, active cluster metrics, and security tags.
- **Citizen Scan Terminal:** Allows regular citizens to upload images of subjects or capture lives snapshots using device video streams. Compares the face embedding with Qdrant index items (Similarity > 60%) to output parent contact profiles.
- **Reporting Console:** Enables authorized guardians to upload high-definition frontal portraits alongside descriptive attributes to publish to the facial database search clusters.
- **Biometric Logs:** Feeds terminal logging reports, database sync pings, code operations, and server statuses to the dashboard.
