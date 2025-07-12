import os
import joblib
import pandas as pd
import numpy as np


class RecommendationService:
    _models = None

    @classmethod
    def _load_models(cls):
        """Loads the dictionary of models from the .pkl file."""
        if cls._models is None:
            model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'insurance_models.pkl')
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}. Please run create_model.py first.")
            cls._models = joblib.load(model_path)
        return cls._models

    @staticmethod
    def _generate_explanation(policy_type, coverage, term, user_input):
        """Dynamically generates a believable explanation."""
        explanation = ""
        coverage_str = f"${int(coverage):,}"

        if policy_type == "Term Life":
            explanation = (
                f"A {term}-year term policy with {coverage_str} in coverage is recommended. "
                f"This provides a substantial financial safety net for your {user_input['dependents']} dependent(s) during your key earning years, "
                f"covering major expenses like a mortgage or college education."
            )
        elif policy_type == "Whole Life":
            explanation = (
                f"A Whole Life policy with a {coverage_str} death benefit is recommended. "
                f"This aligns with a lower risk tolerance, providing a guaranteed permanent benefit and building a stable cash value asset for your estate. "
                f"It's an excellent tool for legacy planning."
            )
        elif policy_type in ["Universal Life", "Variable Universal Life"]:
            explanation = (
                f"A {policy_type} policy with {coverage_str} in coverage is an excellent choice for your profile. "
                f"It offers the flexibility to adjust premiums and benefits, combined with a cash value component that can grow over time, "
                f"aligning with a higher risk tolerance and long-term wealth strategies."
            )
        elif policy_type == "Final Expense":
            explanation = (
                f"A Final Expense policy with {coverage_str} in coverage is a practical and affordable choice. "
                f"It is designed specifically to cover end-of-life costs, such as funeral expenses and minor debts, "
                f"ensuring these do not become a burden on your family."
            )
        else:
            explanation = "This policy is recommended based on a comprehensive analysis of your financial profile and life stage."

        return explanation

    @staticmethod
    def predict(data: dict) -> dict:
        """
        Generates a full insurance recommendation by running predictions and dynamically creating an explanation.
        """
        models = RecommendationService._load_models()
        input_df = pd.DataFrame([data])

        # Get predictions from the three core models
        pred_policy_type = models['policy_type'].predict(input_df)[0]
        pred_coverage_amount = models['coverage_amount'].predict(input_df)[0]
        pred_term_length = models['term_length'].predict(input_df)[0]

        # Post-processing and cleanup
        pred_coverage_amount = int(np.round(pred_coverage_amount / 25000) * 25000)

        if pred_policy_type != "Term Life":
            final_term_length = None
        else:
            valid_terms = [10, 15, 20, 25, 30]
            final_term_length = min(valid_terms,
                                    key=lambda x: abs(x - pred_term_length)) if pred_term_length != 0 else 20

        # Dynamically generate the explanation
        explanation_text = RecommendationService._generate_explanation(
            pred_policy_type, pred_coverage_amount, final_term_length, data
        )

        return {
            "recommended_policy": pred_policy_type,
            "recommended_coverage": pred_coverage_amount,
            "recommended_term": final_term_length,
            "explanation": explanation_text,
        }
