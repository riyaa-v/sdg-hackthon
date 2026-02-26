"""
Assumptions:
- EV battery pack nominal voltage ~350V
- Manufacturing emissions ~90 kg CO2 per kWh
- Lithium usage ~0.8 kg per kWh
- 1 tree absorbs ~22 kg CO2/year
"""


def calculate_energy_kwh(capacity_ah: float, pack_voltage: float = 350) -> float:
    """
    Convert battery pack capacity (Ah) to usable energy (kWh).
    Default assumes 350V EV battery pack.
    """
    energy_kwh = (capacity_ah * pack_voltage) / 1000
    return round(energy_kwh, 2)


def calculate_co2_saved(energy_kwh: float) -> float:
    """
    Estimate CO2 emissions avoided by reusing battery.
    Approx assumption: 90 kg CO2 per kWh battery production.
    """
    CO2_PER_KWH = 90  # kg CO2 per kWh
    co2_saved = energy_kwh * CO2_PER_KWH
    return round(co2_saved, 2)


def calculate_lithium_saved(energy_kwh: float) -> float:
    """
    Estimate lithium mining avoided.
    Approx assumption: 0.8 kg lithium per kWh battery.
    """
    LITHIUM_PER_KWH = 0.8  # kg lithium per kWh
    lithium_saved = energy_kwh * LITHIUM_PER_KWH
    return round(lithium_saved, 2)


def calculate_tree_equivalent(co2_saved_kg: float) -> int:
    """
    Convert CO2 savings into tree equivalent.
    Approx: 1 tree absorbs ~22 kg CO2 per year.
    """
    CO2_PER_TREE = 22
    trees = co2_saved_kg / CO2_PER_TREE
    return int(trees)


def calculate_sustainability(capacity_ah: float, grade: str, pack_voltage: float = 350) -> dict:

    if grade == "C":
        return {
            "usable_energy_kwh": 0,
            "co2_saved_kg": 0,
            "lithium_saved_kg": 0,
            "tree_equivalent": 0
        }

    energy_kwh = calculate_energy_kwh(capacity_ah, pack_voltage)
    co2_saved = calculate_co2_saved(energy_kwh)
    lithium_saved = calculate_lithium_saved(energy_kwh)
    tree_equivalent = calculate_tree_equivalent(co2_saved)

    return {
        "usable_energy_kwh": energy_kwh,
        "co2_saved_kg": co2_saved,
        "lithium_saved_kg": lithium_saved,
        "tree_equivalent": tree_equivalent
    }