# Hybrid Intrusion Detection System (H-IDS)
## Two-Stage Bagging Ensemble with Explainable AI

A state-of-the-art intrusion detection system combining supervised and unsupervised machine learning with comprehensive explainability, optimized for **high true positive rate (TPR) while maintaining false positive rate (FPR) < 5%**.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      INPUT: Network Traffic                  │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────▼──────────┐
         │  BAG 1 (Supervised)  │
         │  ┌────────────────┐  │
         │  │ Random Forest  │  │     Supervised Score
         │  │   + XGBoost    │  ├────► + Confidence
         │  └────────────────┘  │
         └───────────┬──────────┘
                     │ (Boosting Signal)
                     ▼
         ┌──────────────────────┐
         │ BAG 2 (Unsupervised) │
         │  ┌────────────────┐  │
         │  │  Autoencoder   │  │     Anomaly Score
         │  │      +         │  ├────► (Boosted)
         │  │Isolation Forest│  │
         │  └────────────────┘  │
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │   Fusion Layer       │
         │  (FPR < 5% Tuned)    │
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │    XAI Explainer     │
         │  (SHAP + Summaries)  │
         └───────────┬──────────┘
                     ▼
         ┌───────────────────────┐
         │ Final Prediction:     │
         │ • Normal              │
         │ • Known Attack        │
         │ • Potential Zero-Day  │
         └───────────────────────┘
```

### Key Innovation: **Two-Stage Boosting**
- Bag 1 (Supervised) provides confidence scores
- Bag 2 (Unsupervised) weights are amplified/dampened by Bag 1 confidence
- Result: Better zero-day detection without increasing false positives

---

## 📦 Components

### 1. **Autoencoder** (`autoencoder_trainer.py`)
- **Type**: Unsupervised anomaly detection
- **Architecture**: 120 → 64 → 48 → 32 (latent) → 48 → 64 → 120
- **Detection**: Reconstruction error > threshold = Anomaly
- **Training**: Normal traffic only

### 2. **Isolation Forest** (`isolation_forest_trainer.py`)
- **Type**: Unsupervised anomaly detection
- **Method**: Isolation-based outlier detection
- **Optimization**: Grid search over contamination, n_estimators, max_samples
- **Threshold**: Tuned for FPR < 5%

### 3. **Two-Stage Ensemble** (`two_stage_ensemble.py`)
- **Bag 1**: Random Forest (60%) + XGBoost (40%)
- **Bag 2**: Autoencoder (50%) + Isolation Forest (50%)
- **Boosting**: `boost_factor = 1 + (confidence × supervised_score)`
- **Fusion**: Decision matrix optimized for FPR < 5%

### 4. **Fast XAI Explainer** (`fast_xai_explainer.py`)
- **Method**: SHAP TreeExplainer (100x faster than Kernel)
- **Output**: Top-5 features with impact scores
- **Summaries**: Human-readable attack explanations
- **Attack Type Inference**: DDoS, PortScan, Brute Force, etc.

---

## 🚀 Quick Start

### Installation
```bash
# Clone or navigate to project directory
cd CyberAi

# Install dependencies
pip install -r requirements.txt
```

### Training the Models
```bash
# Open Jupyter notebook
jupyter notebook hybrid_ids_training.ipynb

# Follow the notebook sections:
# 1. Load CICIDS 2017 dataset
# 2. Train Autoencoder
# 3. Train Isolation Forest
# 4. Optimize ensemble thresholds
# 5. Evaluate and visualize results
# 6. Test XAI explanations
```

### Using Pre trained Models (After Training)
```python
from two_stage_ensemble import TwoStageEnsemble
from fast_xai_explainer import FastXAIExplainer

# Load ensemble
ensemble = TwoStageEnsemble()
ensemble.load_models(
    rf_path='random_forest_model.joblib',
    xgb_path='xgboost_model_intrusion_detection.joblib',
    ae_path='autoencoder_model.pth',
    if_path='isolation_forest_model.joblib'
)
ensemble.load_ensemble('two_stage_ensemble.joblib')

# Predict on new traffic
predictions, confidence, scores = ensemble.predict(
    new_traffic_data,
    return_all_scores=True
)

# Get explanation
explainer = FastXAIExplainer()
explainer.load_models('random_forest_model.joblib', 'xgboost_model_intrusion_detection.joblib', feature_names)
explainer.initialize_shap(background_data)

explanation = explainer.explain_instance(
    new_traffic_data[0],
    predictions[0],
    {k: v[0:1] for k, v in scores.items()}
)

explainer.print_explanation(explanation)
```

---

## 📊 Performance Metrics

### Target Metrics
- ✅ **False Positive Rate (FPR)**: < 5% (CRITICAL)
- ✅ **True Positive Rate (TPR)**: Maximized
- ✅ **F1-Score**: Balanced precision and recall
- ✅ **ROC-AUC**: > 0.95

### Expected Results
Based on CICIDS 2017 dataset:
- **Accuracy**: ~99%
- **Precision**: ~95%
- **Recall (TPR)**: ~92-96%
- **FPR**: < 5% ✓

---

## 🔍 Explainability (XAI) Features

### Per-Prediction Explanation
```
Prediction: Potential Zero-Day
Confidence: 0.78

Top Contributing Features:
1. Backward Packet Length Std Dev (45.2, impact: +0.12)
2. Flow Duration (-0.3, impact: +0.08)
3. PSH Flag Count (8, impact: +0.05)

Model Contributions:
- Supervised Bag (RF + XGBoost): 0.45 (Uncertain)
- Unsupervised Bag (AE + IF): 0.92 (Strong Anomaly)

Explanation: Unknown attack pattern detected. Key anomalies include 
unusually high variance in backward packet lengths and abnormally short 
flow duration, which don't match known attack signatures but deviate 
significantly from normal traffic patterns.
```

### Visualizations
- SHAP Waterfall Plots
- Feature Importance Rankings
- ROC Curves
- Confusion Matrices
- Anomaly Score Distributions

---

## 📁 File Structure

```
CyberAi/
├── autoencoder_trainer.py          # Autoencoder training module
├── isolation_forest_trainer.py     # Isolation Forest training module
├── two_stage_ensemble.py           # Two-stage bagging ensemble
├── fast_xai_explainer.py           # XAI explanation engine
├── hybrid_ids_training.ipynb       # Comprehensive training notebook
├── requirements.txt                # Python dependencies
├── README.md                       # This file
│
├── Models/ (generated after training)
│   ├── autoencoder_model.pth
│   ├── isolation_forest_model.joblib
│   ├── random_forest_model.joblib
│   ├── xgboost_model_intrusion_detection.joblib
│   └── two_stage_ensemble.joblib
│
└── Visualizations/ (generated during training)
    ├── autoencoder_training_history.png
    ├── isolation_forest_scores.png
    ├── ensemble_confusion_matrix.png
    ├── ensemble_roc_curve.png
    ├── rf_feature_importance.png
    └── explanation_*.png
```

---

## 🛠️ Advanced Configuration

### Tuning Ensemble Weights
Edit `two_stage_ensemble.py`:
```python
# Bag 1 weights
self.bag1_rf_weight = 0.6   # Random Forest weight
self.bag1_xgb_weight = 0.4  # XGBoost weight

# Bag 2 weights
self.bag2_ae_weight = 0.5   # Autoencoder weight
self.bag2_if_weight = 0.5   # Isolation Forest weight

# Boosting strength
self.boost_strength = 1.0   # Multiplier for boosting effect
```

### Adjusting FPR Target
```python
# During training
ensemble.optimize_fusion_thresholds(
    X_normal_val,
    X_attack_val,
    target_fpr=0.03  # Even stricter: 3% FPR
)
```

### Modifying Autoencoder Architecture
Edit `autoencoder_trainer.py`:
```python
ae_trainer = AutoencoderTrainer(
    input_dim=120,
    latent_dim=16,  # Smaller latent space for more compression
)
```

---

## 🧪 Testing

### Unit Tests (Future)
```bash
pytest tests/
```

### Manual Validation
1. Run `hybrid_ids_training.ipynb` fully
2. Check FPR in final evaluation (must be < 5%)
3. Review XAI explanations for reasonableness
4. Test on holdout dataset not seen during training

---

## 📈 Future Enhancements

1. **Real-Time Deployment**
   - Flask/FastAPI REST API
   - Stream processing with Apache Kafka
   - Docker containerization

2. **Dashboard**
   - Live threat monitoring
   - XAI visualizations
   - Alert management

3. **Additional Models**
   - LSTM for sequential patterns
   - Graph Neural Networks for network topology
   - Transfer learning from other security datasets

4. **Performance Optimization**
   - Model quantization
   - ONNX runtime
   - GPU acceleration for Autoencoder

---

## 📝 Citation

If you use this system in your research, please cite:

```bibtex
@misc{hybrid_ids_2025,
  title={Two-Stage Bagging Ensemble for Intrusion Detection with Explainable AI},
  author={Your Name},
  year={2025},
  note={Optimized for FPR < 5% on CICIDS 2017 dataset}
}
```

---

## 🤝 Contributing

Contributions welcome! Areas of interest:
- Additional XAI methods (LIME, Integrated Gradients)
- New anomaly detection algorithms
- Performance optimizations
- Documentation improvements

---

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check the training notebook for detailed examples
- Review XAI outputs for model behavior insights

---

## ⚖️ License

[Specify your license here, e.g., MIT, Apache 2.0]

---

## 🙏 Acknowledgments

- **CICIDS 2017 Dataset**: Canadian Institute for Cybersecurity
- **SHAP Library**: Scott Lundberg et al.
- **PyTorch Community**: Deep learning framework
- **Scikit-learn**: Machine learning tools

---

**Built with ❤️ for cybersecurity**
