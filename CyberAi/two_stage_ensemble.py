"""
Two-Stage Bagging Ensemble for Hybrid IDS
Combines supervised and unsupervised models with boosting
Optimized for high TPR with FPR < 5%
"""

import numpy as np
import pandas as pd
import joblib
import torch
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
from autoencoder_trainer import AnomalyAutoencoder, AutoencoderTrainer
import warnings
warnings.filterwarnings('ignore')


class TwoStageEnsemble:
    """
    Two-stage bagging ensemble:
    - Bag 1 (Supervised): Random Forest + XGBoost
    - Bag 2 (Unsupervised): Autoencoder + Isolation Forest (boosted by Bag 1)
    - Fusion Layer: Combines both bags for final decision
    """
    
    def __init__(self):
        # Bag 1: Supervised models
        self.random_forest = None
        self.xgboost = None
        
        # Bag 2: Unsupervised models
        self.autoencoder_trainer = None
        self.isolation_forest = None
        self.if_scaler = None
        self.if_threshold = None
        
        # Model weights (tunable)
        self.bag1_rf_weight = 0.6
        self.bag1_xgb_weight = 0.4
        self.bag2_ae_weight = 0.5
        self.bag2_if_weight = 0.5
        
        # Fusion thresholds (optimized for FPR < 5%)
        self.supervised_high_threshold = 0.7  # High confidence attack
        self.supervised_low_threshold = 0.3   # Low confidence
        self.anomaly_medium_threshold = 0.6   # Medium anomaly
        self.anomaly_high_threshold = 0.8     # High anomaly
        
        # Boosting parameters
        self.boost_enabled = True
        self.boost_strength = 1.0  # Multiplier for boost effect
        
    def load_models(self, rf_path, xgb_path, ae_path, if_path):
        """
        Load all trained models
        Args:
            rf_path: Path to Random Forest model
            xgb_path: Path to XGBoost model
            ae_path: Path to Autoencoder model
            if_path: Path to Isolation Forest model
        """
        print("Loading models...")
        
        # Load supervised models
        self.random_forest = joblib.load(rf_path)
        print(f"✓ Random Forest loaded from {rf_path}")
        
        self.xgboost = joblib.load(xgb_path)
        print(f"✓ XGBoost loaded from {xgb_path}")
        
        # Load autoencoder
        self.autoencoder_trainer = AutoencoderTrainer()
        self.autoencoder_trainer.load_model(ae_path)
        print(f"✓ Autoencoder loaded from {ae_path}")
        
        # Load isolation forest
        if_data = joblib.load(if_path)
        self.isolation_forest = if_data['model']
        self.if_scaler = if_data['scaler']
        self.if_threshold = if_data['threshold']
        print(f"✓ Isolation Forest loaded from {if_path}")
        
        print("\nAll models loaded successfully!\n")
    
    def _sigmoid(self, x):
        """Sigmoid activation for score normalization"""
        return 1 / (1 + np.exp(-x))
    
    def bag1_predict(self, X):
        """
        Bag 1: Supervised Ensemble (RF + XGBoost)
        Args:
            X: Input features
        Returns:
            supervised_score: [0, 1] attack probability
            supervised_confidence: [0, 1] confidence in prediction
        """
        # Random Forest prediction
        rf_proba = self.random_forest.predict_proba(X)
        if rf_proba.shape[1] == 2:
            rf_score = rf_proba[:, 1]  # Attack probability
        else:
            rf_score = rf_proba[:, 0]
        
        # XGBoost prediction
        xgb_pred = self.xgboost.predict(X)
        # Normalize XGBoost output to [0, 1]
        xgb_score = self._sigmoid(xgb_pred)
        
        # Weighted ensemble
        supervised_score = (
            self.bag1_rf_weight * rf_score +
            self.bag1_xgb_weight * xgb_score
        )
        
        # Confidence: how far from decision boundary (0.5)
        # High confidence when both models agree strongly
        rf_confidence = np.abs(rf_score - 0.5) * 2
        xgb_confidence = np.abs(xgb_score - 0.5) * 2
        supervised_confidence = (rf_confidence + xgb_confidence) / 2
        
        return supervised_score, supervised_confidence
    
    def bag2_predict(self, X, supervised_score, supervised_confidence):
        """
        Bag 2: Unsupervised Ensemble (Autoencoder + IF) with Boosting
        Args:
            X: Input features
            supervised_score: Output from Bag 1
            supervised_confidence: Confidence from Bag 1
        Returns:
            anomaly_score: [0, 1] anomaly probability
            boost_factor: Applied boosting multiplier
        """
        batch_size = len(X)
        
        # Autoencoder anomaly detection
        ae_predictions, ae_errors = self.autoencoder_trainer.predict(X)
        ae_anomaly_scores = ae_predictions.astype(float)  # 0 or 1
        
        # Isolation Forest anomaly detection
        X_scaled = self.if_scaler.transform(X)
        if_scores = self.isolation_forest.score_samples(X_scaled)
        if_anomaly_scores = (if_scores < self.if_threshold).astype(float)
        
        # Combine unsupervised models
        base_anomaly_score = (
            self.bag2_ae_weight * ae_anomaly_scores +
            self.bag2_if_weight * if_anomaly_scores
        )
        
        # Boosting: Supervised predictions boost unsupervised
        if self.boost_enabled:
            # If Bag 1 says "attack" with high confidence, amplify Bag 2
            # If Bag 1 says "normal" with high confidence, dampen Bag 2
            boost_factor = 1.0 + (
                self.boost_strength * 
                supervised_confidence * 
                (supervised_score - 0.5) * 2  # Range: [-1, 1]
            )
            # Clamp boost factor
            boost_factor = np.clip(boost_factor, 0.5, 2.0)
        else:
            boost_factor = np.ones(batch_size)
        
        # Apply boosting
        anomaly_score = base_anomaly_score * boost_factor
        anomaly_score = np.clip(anomaly_score, 0, 1)
        
        return anomaly_score, boost_factor
    
    def fusion_decision(self, supervised_score, anomaly_score, supervised_confidence):
        """
        Fusion layer: Combine Bag 1 and Bag 2 for final decision
        Optimized for FPR < 5%
        
        Decision logic:
        - High supervised score → Known Attack
        - High anomaly + medium supervised → Potential Zero-Day
        - Very high anomaly → High Confidence Anomaly
        - Otherwise → Normal
        
        Args:
            supervised_score: Bag 1 output
            anomaly_score: Bag 2 output
            supervised_confidence: Bag 1 confidence
        Returns:
            category: "Normal", "Known Attack", or "Potential Zero-Day"
            final_score: Combined confidence score
        """
        categories = []
        final_scores = []
        
        for i in range(len(supervised_score)):
            sup_score = supervised_score[i]
            anom_score = anomaly_score[i]
            conf = supervised_confidence[i]
            
            # Decision matrix
            if sup_score > self.supervised_high_threshold:
                # High supervised confidence → Known attack
                category = "Known Attack"
                score = sup_score
                
            elif (anom_score > self.anomaly_medium_threshold and 
                  sup_score > self.supervised_low_threshold):
                # Moderate supervised + high anomaly → Potential zero-day
                category = "Potential Zero-Day"
                score = (sup_score + anom_score) / 2
                
            elif anom_score > self.anomaly_high_threshold:
                # Very high anomaly alone
                category = "Anomaly (High Confidence)"
                score = anom_score
                
            else:
                # Low scores → Normal traffic
                category = "Normal"
                score = 1 - max(sup_score, anom_score)
            
            categories.append(category)
            final_scores.append(score)
        
        return np.array(categories), np.array(final_scores)
    
    def predict(self, X, return_all_scores=False):
        """
        Full ensemble prediction pipeline
        Args:
            X: Input features
            return_all_scores: If True, return intermediate scores
        Returns:
            predictions: Final categories
            confidence: Final confidence scores
            (optional) all_scores: Dict with intermediate outputs
        """
        # Stage 1: Supervised Bag
        supervised_score, supervised_confidence = self.bag1_predict(X)
        
        # Stage 2: Unsupervised Bag (boosted)
        anomaly_score, boost_factor = self.bag2_predict(
            X, supervised_score, supervised_confidence
        )
        
        # Fusion
        predictions, confidence = self.fusion_decision(
            supervised_score, anomaly_score, supervised_confidence
        )
        
        if return_all_scores:
            all_scores = {
                'supervised_score': supervised_score,
                'supervised_confidence': supervised_confidence,
                'anomaly_score': anomaly_score,
                'boost_factor': boost_factor,
                'final_confidence': confidence
            }
            return predictions, confidence, all_scores
        
        return predictions, confidence
    
    def optimize_fusion_thresholds(self, X_normal, X_attack, target_fpr=0.05):
        """
        Tune fusion thresholds to achieve target FPR
        Args:
            X_normal: Normal traffic samples
            X_attack: Attack samples
            target_fpr: Target false positive rate
        """
        print(f"\n{'='*60}")
        print(f"Optimizing Fusion Thresholds for FPR < {target_fpr*100:.1f}%")
        print(f"{'='*60}\n")
        
        # Get predictions
        pred_normal, conf_normal, scores_normal = self.predict(X_normal, return_all_scores=True)
        pred_attack, conf_attack, scores_attack = self.predict(X_attack, return_all_scores=True)
        
        # Grid search over thresholds
        best_fpr = 1.0
        best_tpr = 0.0
        best_thresholds = None
        
        for sup_high in np.linspace(0.6, 0.9, 7):
            for anom_high in np.linspace(0.7, 0.95, 6):
                for anom_med in np.linspace(0.5, 0.7, 5):
                    # Test thresholds
                    self.supervised_high_threshold = sup_high
                    self.anomaly_high_threshold = anom_high
                    self.anomaly_medium_threshold = anom_med
                    
                    # Recompute predictions
                    pred_n, _ = self.predict(X_normal)
                    pred_a, _ = self.predict(X_attack)
                    
                    # Calculate FPR and TPR
                    fp = np.sum(pred_n != "Normal")
                    fpr = fp / len(pred_n)
                    
                    tp = np.sum(pred_a != "Normal")
                    tpr = tp / len(pred_a)
                    
                    # Check if better
                    if fpr <= target_fpr and tpr > best_tpr:
                        best_fpr = fpr
                        best_tpr = tpr
                        best_thresholds = {
                            'supervised_high': sup_high,
                            'anomaly_high': anom_high,
                            'anomaly_medium': anom_med
                        }
        
        if best_thresholds:
            self.supervised_high_threshold = best_thresholds['supervised_high']
            self.anomaly_high_threshold = best_thresholds['anomaly_high']
            self.anomaly_medium_threshold = best_thresholds['anomaly_medium']
            
            print(f"Optimized Thresholds:")
            print(f"  Supervised High: {self.supervised_high_threshold:.3f}")
            print(f"  Anomaly Medium: {self.anomaly_medium_threshold:.3f}")
            print(f"  Anomaly High: {self.anomaly_high_threshold:.3f}")
            print(f"\nAchieved FPR: {best_fpr*100:.2f}%")
            print(f"Achieved TPR: {best_tpr*100:.2f}%")
        else:
            print("WARNING: Could not meet FPR target with current models")
        
        print(f"{'='*60}\n")
        
        return best_fpr, best_tpr
    
    def save_ensemble(self, filepath='two_stage_ensemble.joblib'):
        """Save ensemble configuration"""
        joblib.dump({
            'bag1_rf_weight': self.bag1_rf_weight,
            'bag1_xgb_weight': self.bag1_xgb_weight,
            'bag2_ae_weight': self.bag2_ae_weight,
            'bag2_if_weight': self.bag2_if_weight,
            'supervised_high_threshold': self.supervised_high_threshold,
            'supervised_low_threshold': self.supervised_low_threshold,
            'anomaly_medium_threshold': self.anomaly_medium_threshold,
            'anomaly_high_threshold': self.anomaly_high_threshold,
            'boost_enabled': self.boost_enabled,
            'boost_strength': self.boost_strength
        }, filepath)
        print(f"Ensemble configuration saved to {filepath}")
    
    def load_ensemble(self, filepath='two_stage_ensemble.joblib'):
        """Load ensemble configuration"""
        config = joblib.load(filepath)
        for key, value in config.items():
            setattr(self, key, value)
        print(f"Ensemble configuration loaded from {filepath}")


if __name__ == "__main__":
    print("Two-Stage Ensemble Module Loaded")
    print("Combine supervised and unsupervised models with boosting")
