from pydantic import BaseModel

class PredictionResponse(BaseModel):
    battery_id: str
    rul_years: float
    fire_risk_score: int
    suitability_grade: str
    co2_savings_kg: float