"""
Fast XAI Explainer for Hybrid IDS
Provides human-readable explanations with optimized SHAP computation
"""

import numpy as np
import pandas as pd
import shap
import joblib
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')


class FastXAIExplainer:
    """
    Fast explainability layer for ensemble predictions
    - Uses TreeExplainer for speed (100x faster than Kernel)
    - Returns top-5 features only
    - Generates human-readable summaries
    """
    
    def __init__(self):
        # Models
        self.random_forest = None
        self.xgboost = None
        
        # SHAP explainers
        self.rf_explainer = None
        self.xgb_explainer = None
        
        # Feature names
        self.feature_names = None
        
        # Background dataset for SHAP (pre-computed)
        self.background_data = None
        
        # Attack type inference patterns
        self.attack_patterns = {
            'DDoS': ['flow_duration', 'packet_length', 'iat', 'psh_flag'],
            'PortScan': ['dst_port', 'flow_duration', 'packet_count'],
            'Brute Force': ['failed_login', 'flow_duration', 'packet_count'],
            'Infiltration': ['payload_size', 'flow_bytes'],
            'Botnet': ['flow_duration', 'packet_length', 'protocol']
        }
    
    def load_models(self, rf_path, xgb_path, feature_names=None):
        """
        Load models and initialize explainers
        Args:
            rf_path: Path to Random Forest model
            xgb_path: Path to XGBoost model
            feature_names: List of feature names
        """
        print("Loading models for XAI...")
        
        self.random_forest = joblib.load(rf_path)
        print(f"✓ Random Forest loaded")
        
        self.xgboost = joblib.load(xgb_path)
        print(f"✓ XGBoost loaded")
        
        if feature_names is not None:
            self.feature_names = feature_names
        else:
            # Try to extract from models
            if hasattr(self.random_forest, 'feature_names_in_'):
                self.feature_names = self.random_forest.feature_names_in_
            else:
                self.feature_names = [f"feature_{i}" for i in range(
                    self.random_forest.n_features_in_)]
        
        print(f"✓ Feature names set ({len(self.feature_names)} features)")
        print("\nReady for explanations!\n")
    
    def initialize_shap(self, background_data, n_background=100):
        """
        Initialize SHAP explainers with background dataset
        Args:
            background_data: Representative normal traffic samples
            n_background: Number of background samples (smaller = faster)
        """
        print("Initializing SHAP explainers...")
        
        # Sample background data for speed
        if len(background_data) > n_background:
            indices = np.random.choice(len(background_data), n_background, replace=False)
            self.background_data = background_data[indices]
        else:
            self.background_data = background_data
        
        # TreeExplainer is much faster for tree-based models
        self.rf_explainer = shap.TreeExplainer(
            self.random_forest,
            data=self.background_data,
            feature_names=self.feature_names
        )
        
        self.xgb_explainer = shap.TreeExplainer(
            self.xgboost,
            data=self.background_data,
            feature_names=self.feature_names
        )
        
        print(f"✓ SHAP explainers initialized with {len(self.background_data)} background samples\n")
    
    def get_rf_feature_importance(self, top_n=10):
        """Get Gini importance from Random Forest"""
        importances = self.random_forest.feature_importances_
        indices = np.argsort(importances)[::-1][:top_n]
        
        top_features = [
            (self.feature_names[i], importances[i])
            for i in indices
        ]
        
        return top_features
    
    def explain_instance(self, instance, ensemble_prediction, 
                        ensemble_scores, top_n=5):
        """
        Generate comprehensive explanation for single prediction
        Args:
            instance: Single sample (1D array)
            ensemble_prediction: Category from ensemble
            ensemble_scores: Dict with supervised/anomaly scores
            top_n: Number of top features to return
        Returns:
            explanation dict
        """
        instance = instance.reshape(1, -1)
        
        # Get SHAP values
        rf_shap = self.rf_explainer.shap_values(instance)
        xgb_shap = self.xgb_explainer.shap_values(instance)
        
        # Handle multi-class RF output
        if isinstance(rf_shap, list):
            rf_shap = rf_shap[1]  # Attack class
        
        # Average SHAP values from both models
        combined_shap = (rf_shap[0] + xgb_shap[0]) / 2
        
        # Get top contributing features
        top_indices = np.argsort(np.abs(combined_shap))[::-1][:top_n]
        
        top_features = []
        for idx in top_indices:
            feature_name = self.feature_names[idx]
            feature_value = instance[0][idx]
            shap_value = combined_shap[idx]
            
            top_features.append({
                'name': feature_name,
                'value': feature_value,
                'shap_importance': shap_value,
                'direction': 'Attack' if shap_value > 0 else 'Normal'
            })
        
        # Model contributions
        model_contributions = {
            'Random Forest': {
                'prediction': 'Attack' if self.random_forest.predict(instance)[0] == 1 else 'Normal',
                'confidence': ensemble_scores.get('supervised_score', [0])[0]
            },
            'XGBoost': {
                'prediction': 'Attack' if self.xgboost.predict(instance)[0] > 0.5 else 'Normal',
                'confidence': ensemble_scores.get('supervised_score', [0])[0]
            },
            'Autoencoder': {
                'anomaly_detected': ensemble_scores.get('anomaly_score', [0])[0] > 0.5,
                'score': ensemble_scores.get('anomaly_score', [0])[0]
            },
            'Isolation Forest': {
                'anomaly_detected': ensemble_scores.get('anomaly_score', [0])[0] > 0.5,
                'score': ensemble_scores.get('anomaly_score', [0])[0]
            }
        }
        
        # Generate human-readable summary
        summary = self._generate_summary(
            ensemble_prediction,
            top_features,
            model_contributions,
            ensemble_scores
        )
        
        explanation = {
            'prediction': ensemble_prediction,
            'confidence': ensemble_scores.get('final_confidence', [0])[0],
            'top_features': top_features,
            'model_contributions': model_contributions,
            'human_summary': summary,
            'shap_values': combined_shap
        }
        
        return explanation
    
    def _infer_attack_type(self, top_features):
        """Infer specific attack type based on feature patterns"""
        feature_names = [f['name'].lower() for f in top_features]
        
        scores = {}
        for attack_type, patterns in self.attack_patterns.items():
            score = sum(1 for pattern in patterns 
                       if any(pattern in fname for fname in feature_names))
            scores[attack_type] = score
        
        if max(scores.values()) > 0:
            return max(scores, key=scores.get)
        return "Unknown Attack"
    
    def _generate_summary(self, prediction, top_features, 
                         model_contributions, ensemble_scores):
        """Generate human-readable explanation"""
        summary_parts = []
        
        # Prediction statement
        if prediction == "Known Attack":
            attack_type = self._infer_attack_type(top_features)
            summary_parts.append(
                f"**Classification**: Known attack pattern detected (likely {attack_type})."
            )
        elif prediction == "Potential Zero-Day":
            summary_parts.append(
                "**Classification**: Potential zero-day attack. "
                "Anomalous behavior without matching known attack signatures."
            )
        elif prediction == "Anomaly (High Confidence)":
            summary_parts.append(
                "**Classification**: High-confidence anomaly detected. "
                "Significant deviation from normal traffic patterns."
            )
        else:
            summary_parts.append(
                "**Classification**: Normal traffic. No threats detected."
            )
        
        # Confidence
        conf = ensemble_scores.get('final_confidence', [0])[0]
        summary_parts.append(f"**Confidence**: {conf:.1%}")
        
        # Top 3 features explanation
        summary_parts.append("\n**Key Contributing Factors**:")
        for i, feat in enumerate(top_features[:3], 1):
            direction = "increases" if feat['shap_importance'] > 0 else "decreases"
            summary_parts.append(
                f"{i}. *{feat['name']}* = {feat['value']:.2f} "
                f"({direction} attack likelihood, impact: {feat['shap_importance']:+.3f})"
            )
        
        # Model agreement
        supervised_score = ensemble_scores.get('supervised_score', [0])[0]
        anomaly_score = ensemble_scores.get('anomaly_score', [0])[0]
        
        summary_parts.append("\n**Model Analysis**:")
        summary_parts.append(
            f"- Supervised models (RF + XGBoost): {supervised_score:.1%} attack probability"
        )
        summary_parts.append(
            f"- Unsupervised models (AE + IF): {anomaly_score:.1%} anomaly score"
        )
        
        if ensemble_scores.get('boost_factor') is not None:
            boost = ensemble_scores['boost_factor'][0]
            summary_parts.append(
                f"- Boosting factor applied: {boost:.2f}x"
            )
        
        return "\n".join(summary_parts)
    
    def plot_waterfall(self, explanation, save_path=None):
        """Create SHAP waterfall plot for top features"""
        shap_values = explanation['shap_values']
        feature_values = [f['value'] for f in explanation['top_features'][:10]]
        
        # Create waterfall plot
        fig, ax = plt.subplots(figsize=(10, 6))
        
        top_features = explanation['top_features'][:10]
        y_pos = np.arange(len(top_features))
        
        colors = ['red' if f['shap_importance'] > 0 else 'blue' 
                 for f in top_features]
        
        ax.barh(y_pos, [f['shap_importance'] for f in top_features], color=colors)
        ax.set_yticks(y_pos)
        ax.set_yticklabels([f"{f['name']} = {f['value']:.2f}" for f in top_features])
        ax.set_xlabel('SHAP Value (Impact on Prediction)')
        ax.set_title(f"Feature Contributions - Prediction: {explanation['prediction']}")
        ax.axvline(x=0, color='black', linestyle='-', linewidth=0.8)
        ax.grid(True, alpha=0.3, axis='x')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=150, bbox_inches='tight')
            print(f"Waterfall plot saved to {save_path}")
        
        plt.show()
    
    def print_explanation(self, explanation):
        """Pretty print explanation"""
        print(f"\n{'='*70}")
        print(f"EXPLANATION FOR PREDICTION")
        print(f"{'='*70}\n")
        print(explanation['human_summary'])
        print(f"\n{'='*70}\n")


if __name__ == "__main__":
    print("Fast XAI Explainer Module Loaded")
    print("Optimized SHAP-based explanations for ensemble predictions")
