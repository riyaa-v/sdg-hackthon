# SCRAP 2 SPARK AI

Battery Remaining Useful Life (RUL) Prediction + Risk & Sustainability Scoring

---

## 🛠 Tech Stack

Frontend:
- React (TypeScript)
- Vite
- Axios
- Recharts

Backend:
- FastAPI
- Uvicorn

ML:
- Python
- Scikit-learn
- Pandas
- NumPy
- Joblib

---

## 📁 Project Structure

backend/   → FastAPI API server  
frontend/  → React TypeScript dashboard  
ml/        → ML training pipeline  

---

# 🚀 How To Clone

```bash
git clone https://github.com/pulkittaneja09/sdg-hackthon.git
cd sdg-hackthon
```

---

# ▶️ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:
http://localhost:5173

---

# ▶️ Run Backend

```bash
cd backend
python -m venv venv
```

Activate environment:

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
uvicorn main:app --reload
```

Backend runs at:
http://localhost:8000

---

# ▶️ Train ML Model

```bash
cd ml
pip install -r requirements.txt
python src/train_model.py
```

Model will be saved in:
ml/models/

---

# 🔄 Full System Run

## Option A – Combined (single server, recommended)

One app at **http://localhost:8000** (API + frontend):

1. **First time:** install frontend deps and build:
   ```bash
   npm run build
   ```
2. **Backend:** create venv, install deps, then start:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate    # Windows
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
   Or from repo root (with backend venv active): `npm run start`
3. Open **http://localhost:8000** — UI and `/predict` API are on the same origin.

To rebuild the frontend after changes: run `npm run build` from the repo root, then restart the backend.

## Option B – Separate frontend and backend

1. Start Backend (see **Run Backend** above) → http://localhost:8000  
2. Start Frontend (see **Run Frontend** above) → http://localhost:5173  
3. Use the app at http://localhost:5173; it will call the API at http://localhost:8000 (ensure backend is running).
4. Upload battery CSV and view prediction results.  

---

## ⚠ Notes

- Do NOT push node_modules
- Do NOT push large datasets
- Do NOT push large .pkl model files
- After cloning always run `npm install`
- Use Python 3.9+ and Node 18+
