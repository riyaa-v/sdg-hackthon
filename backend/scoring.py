def calculate_scores(rul, features):
    max_temp = features[1]
    capacity_mean = features[5]

    # Fire Risk
    fire_risk = 80 if max_temp > 55 else 10

    # Suitability Score
    score = (rul * 15) + (capacity_mean * 0.3) - (fire_risk * 0.5)

    if score > 100:
        grade = "Grade A"
    elif score > 60:
        grade = "Grade B"
    else:
        grade = "Reject"

    co2 = rul * 5

    return {
        "rul_years": round(rul, 2),
        "fire_risk_score": fire_risk,
        "suitability_grade": grade,
        "co2_savings_kg": round(co2, 2)
    }