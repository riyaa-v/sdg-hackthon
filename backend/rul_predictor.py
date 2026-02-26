import numpy as np

def predict_rul_with_confidence(model, X):

    tree_preds = np.array([tree.predict(X) for tree in model.estimators_])

    mean_preds = np.mean(tree_preds, axis=0)
    std_preds  = np.std(tree_preds, axis=0)

    results = []

    for mean_val, std_val in zip(mean_preds, std_preds):

        # Normalize std relative to prediction magnitude
        relative_uncertainty = std_val / (mean_val + 1e-6)

        # Convert to confidence %
        confidence = max(0, 100 * (1 - relative_uncertainty))

        confidence = min(confidence, 100)

        results.append({
            "predicted_rul": round(float(mean_val), 2),
            "confidence_score": round(float(confidence), 2)
        })

    return results