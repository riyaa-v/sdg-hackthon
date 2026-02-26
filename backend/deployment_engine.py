def recommend_deployment(predicted_rul):
    if predicted_rul >= 90:
        return {
            "grade": "A",
            "recommended_use": "Solar Grid / Renewable Energy Storage",
            "recommendation": "Solar Grid / Renewable Energy Storage",
            "risk_level": "Low",
        }
    elif predicted_rul >= 40:
        return {
            "grade": "B",
            "recommended_use": "Backup Storage / UPS Systems",
            "recommendation": "Backup Storage / UPS Systems",
            "risk_level": "Medium",
        }
    else:
        return {
            "grade": "C",
            "recommended_use": "Recycle — Insufficient Life Remaining",
            "recommendation": "Recycle — Insufficient Life Remaining",
            "risk_level": "High",
        }