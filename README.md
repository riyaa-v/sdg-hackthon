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

1. Start Backend  
2. Start Frontend  
3. Upload battery CSV  
4. View prediction results  

---

## ⚠ Notes

- Do NOT push node_modules
- Do NOT push large datasets
- Do NOT push large .pkl model files
- After cloning always run `npm install`
- Use Python 3.9+ and Node 18+
