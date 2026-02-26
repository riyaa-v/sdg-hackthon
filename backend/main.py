from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
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

model= load_model()


@app.get("/")
def home():
    return {"message": "SecondSpark Backend Running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)

        if df.empty:
            return {"error": "Empty CSV file"}

        X = extract_full_features(df)

        predictions = predict_rul_with_confidence(model, X)

        results = []

        for pred in predictions:
            rul = pred["predicted_rul"]
            confidence = pred["confidence_score"]

            capacity_val = float(X.iloc[0]["Capacity"])
            soh_val = float(X.iloc[0]["capacity_ratio"])

            decision = recommend_deployment(
                predicted_rul=rul
            )

            impact = calculate_sustainability(
                capacity_ah=capacity_val,
                grade=decision["grade"]
            )

            results.append({
                "prediction": {
                    "predicted_rul": rul,
                    "confidence_score": confidence
                },
                "deployment": decision,
                "sustainability": impact
            })

        return {
            "total_batteries": len(results),
            "results": results
        }

    except Exception as e:
        return {"error": str(e)}