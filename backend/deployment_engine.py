def recommend_deployment(predicted_rul):
    if predicted_rul >= 90:
        return {
            "grade": "A",
            "recommended_use": "Solar Grid / Renewable Energy Storage"
        }
    elif predicted_rul >= 40:
        return {
            "grade": "B",
            "recommended_use": "Backup Storage / UPS Systems"
        }
    else:
        return {
            "grade": "C",
            "recommended_use": "Recycle — Insufficient Life Remaining"
        }