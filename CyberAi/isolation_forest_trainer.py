"""
Isolation Forest Training Module for Hybrid IDS
Optimized for low false positive rate (FPR < 5%)
"""

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.metrics import (
    precision_score, recall_score, f1_score, 
    roc_auc_score, roc_curve, confusion_matrix
)
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
import warnings
warnings.filterwarnings('ignore')


class IsolationForestTrainer:
    """
    Isolation Forest trainer with FPR optimization
    Trains on normal traffic only, tunes threshold for low FP rate
    """
    
    def __init__(self):
        self.model = None
        self.scaler = RobustScaler()
        self.threshold = None
        self.best_params = None
        
    def prepare_data(self, X_normal, validation_split=0.3):
        """
        Prepare normal traffic data
        Args:
            X_normal: Normal traffic samples only
            validation_split: Fraction for validation
        Returns:
            X_train, X_val (scaled)
        """
        # Scale data
        X_scaled = self.scaler.fit_transform(X_normal)
        
        # Split for validation
        X_train, X_val = train_test_split(
            X_scaled, test_size=validation_split, random_state=42
        )
        
        print(f"Training samples: {len(X_train)}")
        print(f"Validation samples: {len(X_val)}")
        
        return X_train, X_val
    
    def train_with_grid_search(self, X_train, contamination_range=[0.01, 0.03, 0.05]):
        """
        Train Isolation Forest with hyperparameter tuning
        Args:
            X_train: Scaled normal training data
            contamination_range: Expected proportion of outliers
        """
        print(f"\n{'='*60}")
        print(f"Training Isolation Forest with Grid Search")
        print(f"{'='*60}\n")
        
        param_grid = {
            'n_estimators': [200, 300],
            'max_samples': [512, 1024, 'auto'],
            'contamination': contamination_range,
            'max_features': [0.8, 1.0],
            'bootstrap': [True, False]
        }
        
        best_score = -float('inf')
        best_model = None
        best_params = None
        
        # Manual grid search (sklearn GridSearchCV doesn't support IF well)
        total_combinations = (
            len(param_grid['n_estimators']) *
            len(param_grid['max_samples']) *
            len(param_grid['contamination']) *
            len(param_grid['max_features']) *
            len(param_grid['bootstrap'])
        )
        
        print(f"Testing {total_combinations} parameter combinations...")
        print(f"{'n_est':<8}{'max_samp':<12}{'contam':<10}{'max_feat':<12}{'bootstrap':<12}{'Score':<10}")
        print(f"{'-'*70}")
        
        pbar = tqdm(total=total_combinations, desc="Grid Search")
        
        for n_est in param_grid['n_estimators']:
            for max_samp in param_grid['max_samples']:
                for contam in param_grid['contamination']:
                    for max_feat in param_grid['max_features']:
                        for bootstrap in param_grid['bootstrap']:
                            model = IsolationForest(
                                n_estimators=n_est,
                                max_samples=max_samp,
                                contamination=contam,
                                max_features=max_feat,
                                bootstrap=bootstrap,
                                random_state=42,
                                n_jobs=-1
                            )
                            
                            model.fit(X_train)
                            score = model.score_samples(X_train).mean()
                            
                            if score > best_score:
                                best_score = score
                                best_model = model
                                best_params = {
                                    'n_estimators': n_est,
                                    'max_samples': max_samp,
                                    'contamination': contam,
                                    'max_features': max_feat,
                                    'bootstrap': bootstrap
                                }
                                print(f"{n_est:<8}{str(max_samp):<12}{contam:<10.2f}"
                                      f"{max_feat:<12.2f}{str(bootstrap):<12}{score:<10.4f} *")
                            
                            pbar.update(1)
        
        pbar.close()
        
        self.model = best_model
        self.best_params = best_params
        
        print(f"\n{'='*60}")
        print(f"Best Parameters:")
        for param, value in best_params.items():
            print(f"  {param}: {value}")
        print(f"Best Score: {best_score:.4f}")
        print(f"{'='*60}\n")
        
        return best_params
    
    def optimize_threshold_for_fpr(self, X_normal, X_attack, target_fpr=0.05):
        """
        Find optimal anomaly score threshold for target FPR
        Args:
            X_normal: Normal samples for FPR calculation
            X_attack: Attack samples for TPR calculation
            target_fpr: Target false positive rate
        Returns:
            threshold, achieved_fpr, achieved_tpr
        """
        print(f"\n{'='*60}")
        print(f"Optimizing Threshold for FPR < {target_fpr*100:.1f}%")
        print(f"{'='*60}")
        
        # Scale data
        X_normal_scaled = self.scaler.transform(X_normal)
        X_attack_scaled = self.scaler.transform(X_attack)
        
        # Get anomaly scores
        normal_scores = self.model.score_samples(X_normal_scaled)
        attack_scores = self.model.score_samples(X_attack_scaled)
        
        # Try different thresholdsPercentiles
        best_threshold = None
        best_fpr = 1.0
        best_tpr = 0.0
        
        print(f"\nTesting thresholds...")
        print(f"{'Percentile':<12}{'Threshold':<15}{'FPR':<10}{'TPR':<10}")
        print(f"{'-'*50}")
        
        for percentile in range(1, 15):  # Lower scores = more anomalous
            threshold = np.percentile(normal_scores, percentile)
            
            # FPR: % of normal flagged as anomaly (score < threshold)
            fp = np.sum(normal_scores < threshold)
            fpr = fp / len(normal_scores)
            
            # TPR: % of attacks correctly detected
            tp = np.sum(attack_scores < threshold)
            tpr = tp / len(attack_scores)
            
            print(f"{percentile:<12}{threshold:<15.6f}{fpr*100:<10.2f}{tpr*100:<10.2f}")
            
            # Choose threshold meeting FPR constraint with best TPR
            if fpr <= target_fpr and tpr > best_tpr:
                best_threshold = threshold
                best_fpr = fpr
                best_tpr = tpr
        
        if best_threshold is None:
            # Fallback
            threshold = np.percentile(normal_scores, 5)
            fp = np.sum(normal_scores < threshold)
            best_fpr = fp / len(normal_scores)
            tp = np.sum(attack_scores < threshold)
            best_tpr = tp / len(attack_scores)
            best_threshold = threshold
            print(f"\nWARNING: Could not meet FPR target. Using 5th percentile.")
        
        self.threshold = best_threshold
        
        print(f"\n{'='*60}")
        print(f"Optimal Threshold: {self.threshold:.6f}")
        print(f"Achieved FPR: {best_fpr*100:.2f}%")
        print(f"Achieved TPR: {best_tpr*100:.2f}%")
        print(f"{'='*60}\n")
        
        return self.threshold, best_fpr, best_tpr
    
    def predict(self, X):
        """
        Predict anomalies
        Args:
            X: Input samples
        Returns:
            predictions (0=normal, 1=anomaly), anomaly_scores
        """
        X_scaled = self.scaler.transform(X)
        scores = self.model.score_samples(X_scaled)
        predictions = (scores < self.threshold).astype(int)
        return predictions, scores
    
    def evaluate(self, X_normal, X_attack):
        """
        Comprehensive evaluation on test set
        Args:
            X_normal: Normal test samples
            X_attack: Attack test samples
        """
        # Combine and create labels
        X_test = np.vstack([X_normal, X_attack])
        y_true = np.hstack([np.zeros(len(X_normal)), np.ones(len(X_attack))])
        
        # Predict
        y_pred, scores = self.predict(X_test)
        
        # Metrics
        precision = precision_score(y_true, y_pred)
        recall = recall_score(y_true, y_pred)
        f1 = f1_score(y_true, y_pred)
        
        # FPR/TPR
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        fpr = fp / (fp + tn)
        tpr = tp / (tp + fn)
        
        print(f"\n{'='*60}")
        print(f"Isolation Forest Evaluation Results")
        print(f"{'='*60}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall (TPR): {recall:.4f}")
        print(f"F1-Score: {f1:.4f}")
        print(f"False Positive Rate: {fpr*100:.2f}%")
        print(f"\nConfusion Matrix:")
        print(f"  TN={tn:6d}  FP={fp:6d}")
        print(f"  FN={fn:6d}  TP={tp:6d}")
        print(f"{'='*60}\n")
        
        return {
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'fpr': fpr,
            'tpr': tpr,
            'confusion_matrix': (tn, fp, fn, tp)
        }
    
    def save_model(self, filepath='isolation_forest_model.joblib'):
        """Save trained model"""
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'threshold': self.threshold,
            'best_params': self.best_params
        }, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='isolation_forest_model.joblib'):
        """Load trained model"""
        data = joblib.load(filepath)
        self.model = data['model']
        self.scaler = data['scaler']
        self.threshold = data['threshold']
        self.best_params = data['best_params']
        print(f"Model loaded from {filepath}")
    
    def plot_score_distribution(self, X_normal, X_attack):
        """Visualize anomaly score distributions"""
        X_normal_scaled = self.scaler.transform(X_normal)
        X_attack_scaled = self.scaler.transform(X_attack)
        
        normal_scores = self.model.score_samples(X_normal_scaled)
        attack_scores = self.model.score_samples(X_attack_scaled)
        
        plt.figure(figsize=(12, 5))
        
        plt.subplot(1, 2, 1)
        plt.hist(normal_scores, bins=50, alpha=0.7, label='Normal', color='green')
        plt.hist(attack_scores, bins=50, alpha=0.7, label='Attack', color='red')
        plt.axvline(self.threshold, color='black', linestyle='--', linewidth=2, label='Threshold')
        plt.xlabel('Anomaly Score')
        plt.ylabel('Frequency')
        plt.title('Anomaly Score Distribution')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        plt.subplot(1, 2, 2)
        plt.boxplot([normal_scores, attack_scores], labels=['Normal', 'Attack'])
        plt.axhline(self.threshold, color='red', linestyle='--', linewidth=2, label='Threshold')
        plt.ylabel('Anomaly Score')
        plt.title('Score Distribution (Boxplot)')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('isolation_forest_scores.png', dpi=150)
        print("Score distribution plot saved to isolation_forest_scores.png")
        plt.show()


if __name__ == "__main__":
    print("Isolation Forest Trainer Module Loaded")
    print("Use this module in conjunction with your main training notebook")
