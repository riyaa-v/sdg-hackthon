from pathlib import Path
import io
import logging

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd

from feature_engineering import extract_full_features
from model_loader import load_model
from rul_predictor import predict_rul_with_confidence
from deployment_engine import recommend_deployment
from sustainability_calculator import calculate_sustainability

app = FastAPI(title="SecondSpark AI Battery Evaluation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to frontend build (when running from backend/: ../frontend/dist)
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

# Load model once at startup
model = load_model()


def _serve_spa_or_home():
    if FRONTEND_DIST.exists():
        index_path = FRONTEND_DIST / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
    return {"message": "SecondSpark Backend Running", "hint": "Run 'npm run build' in frontend/ then restart backend."}


# Mount built frontend static assets if present
if FRONTEND_DIST.exists() and (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")


@app.get("/")
def home():
    return _serve_spa_or_home()


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    print("POST /predict received, filename:", file.filename)
    logging.info("POST /predict received, filename=%s content_type=%s", file.filename, file.content_type)
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        if df.empty:
            return {"error": "Empty CSV file"}

        # ===============================
        # TREND DATA FOR FRONTEND GRAPHS
        # ===============================

        capacity_trend = (
            df.groupby("cycle")["Capacity"]
            .mean()
            .reset_index()
            .to_dict(orient="records")
        )

        last_cycle = df["cycle"].max()
        df_last = df[df["cycle"] == last_cycle]

        voltage_trend = (
            df_last[["Time", "Voltage_measured"]]
            .rename(columns={"Voltage_measured": "value"})
            .to_dict(orient="records")
        )

        temperature_trend = (
            df_last[["Time", "Temperature_measured"]]
            .rename(columns={"Temperature_measured": "value"})
            .to_dict(orient="records")
        )

        # ===============================
        # FEATURE EXTRACTION
        # ===============================

        X = extract_full_features(df)

        # ===============================
        # PREDICTION
        # ===============================

        predictions = predict_rul_with_confidence(model, X)

        # Get the first (and only) prediction
        prediction = predictions[0] if predictions else {"predicted_rul": 0, "confidence_score": 0}
        
        rul = prediction["predicted_rul"]
        confidence = prediction["confidence_score"]

        capacity_val = float(X.iloc[0]["Capacity"])

        # ===============================
        # DEPLOYMENT DECISION
        # ===============================

        decision = recommend_deployment(predicted_rul=rul)

        # ===============================
        # SUSTAINABILITY IMPACT
        # ===============================

        impact = calculate_sustainability(
            capacity_ah=capacity_val,
            grade=decision["grade"]
        )

        # ===============================
        # FINAL RESPONSE
        # ===============================

        return {
    "prediction": prediction,
    "deployment": decision,
    "sustainability": impact,

    "analysis": {
        "degradation_rate": (
            "High" if prediction["predicted_rul"] < 50
            else "Moderate" if prediction["predicted_rul"] < 100
            else "Low"
        ),
        "health_status": (
            "Critical" if prediction["predicted_rul"] < 40
            else "Aging" if prediction["predicted_rul"] < 80
            else "Healthy"
        )
    },

    "thresholds": {
        "eol_capacity": float(df["Capacity"].iloc[0] * 0.7)
    },

    "trends": {
        "capacity_trend": capacity_trend,
        "soh_trend": [
            {
                "cycle": row["cycle"],
                "soh": round(row["Capacity"] / df["Capacity"].iloc[0], 3)
            }
            for row in capacity_trend
        ],
        "voltage_trend": voltage_trend,
        "temperature_trend": temperature_trend
    }
}

    except Exception as e:
        return {"error": str(e)}


# SPA fallback: serve index.html for any other GET so client-side routing works
if FRONTEND_DIST.exists() and (FRONTEND_DIST / "index.html").exists():
    _videos_dir = FRONTEND_DIST / "videos"
    if _videos_dir.exists():
        app.mount("/videos", StaticFiles(directory=_videos_dir), name="videos")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("predict"):
            from fastapi.responses import JSONResponse
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        return FileResponse(FRONTEND_DIST / "index.html")