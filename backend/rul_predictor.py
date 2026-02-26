import numpy as np


def predict_rul_with_confidence(model, X):
    """
    Predict RUL and compute confidence
    using variance across Random Forest trees.
    """

    tree_predictions = np.array([
        tree.predict(X) for tree in model.estimators_
    ])

    mean_preds = np.mean(tree_predictions, axis=0)
    std_preds = np.std(tree_predictions, axis=0)

    results = []

    for mean_val, std_val in zip(mean_preds, std_preds):
        confidence = max(0, 100 - (std_val * 10))

        results.append({
            "predicted_rul": round(float(mean_val), 2),
            "confidence_score": round(float(confidence), 2)
        })

    return results