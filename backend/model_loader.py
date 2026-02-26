class DummyModel:
    def predict(self, X):
        # Simple logic for demo:
        # More degradation slope → lower RUL
        slope = X[0][6]
        base_rul = 5
        adjusted_rul = base_rul + slope * 10
        return [max(0.5, adjusted_rul)]

def load_model():
    return DummyModel()