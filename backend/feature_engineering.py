import numpy as np

def extract_features(df):
    df.columns = df.columns.str.lower()

    avg_temp = df["temperature"].mean() if "temperature" in df.columns else 25
    max_temp = df["temperature"].max() if "temperature" in df.columns else 30

    voltage_mean = df["voltage"].mean() if "voltage" in df.columns else 3.7
    voltage_variance = df["voltage"].var() if "voltage" in df.columns else 0.01

    cycle_count = df["cycle"].max() if "cycle" in df.columns else len(df)

    capacity_mean = df["capacity"].mean() if "capacity" in df.columns else 100

    # Degradation slope (capacity drop trend)
    if "capacity" in df.columns and len(df) > 1:
        slope = (df["capacity"].iloc[-1] - df["capacity"].iloc[0]) / len(df)
    else:
        slope = 0

    return [
        avg_temp,
        max_temp,
        voltage_mean,
        voltage_variance,
        cycle_count,
        capacity_mean,
        slope
    ]