 ## 🛡️ CypherEyes: A Hybrid Intrusion Detection System with Zero-Day Detection & Explainable AI

🚀 Overview

CypherEyes is a next-generation Hybrid Intrusion Detection System (H-IDS) designed to detect known attacks, unknown zero-day threats, insider anomalies, and provide full transparency using Explainable AI (XAI).
The system integrates signature-based detection, supervised machine learning, unsupervised anomaly models, and XAI explainability into a single real-time platform.

🧠 Why CypherEyes?

-Modern networks face rapidly evolving threats:

-Zero-day exploits
-Insider-driven anomalies
-Multi-stage intrusion attempts
-Dynamic attack patterns
-Traditional IDS systems fail against unknown threats and generate excessive false positives.

CypherEyes solves these challenges using a dual-layer hybrid pipeline that is robust, low-noise, and fully explainable.

## ⚠️ Problem Statement

-Existing IDS solutions struggle with:
-Detecting zero-day attacks
-High false positives
-Lack of reasoning behind alerts
-Limited adaptability to evolving threats
--There is a strong need for an accurate, low-noise, and transparent IDS.

## Architecture Workflow

               ┌────────────────────────┐
               │      Data Ingestion    │
               └────────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │ Signature Database    │
                 └───────┬──────────────┘
                         │No Match
                         ↓
      ┌────────────────────────────────────────────┐
      │         Ensemble ML Evaluation             │
      │────────────────────────────────────────────│
      │ Random Forest      → Anomaly Score         │
      │ XGBoost            → Pattern Detection     │
      │ Autoencoder        → Reconstruction Error  │
      │ Isolation Forest   → Outlier Score         │
      └────────────────────────────────────────────┘
                         ↓
               ┌────────────────────────┐
               │    Fusion Layer         │
               └────────────┬───────────┘
                            ↓
               ┌────────────────────────┐
               │        XAI Layer       │
               └────────────┬───────────┘
                            ↓
               ┌────────────────────────┐
               │ Final Threat Decision   │
               └────────────────────────┘
🌟 Key Novelties

✔ Dual-layer hybrid pipeline (signature + supervised + unsupervised)

✔ Zero-day detection using AI-based anomaly models

✔ Significantly reduced false positives

✔ Full XAI transparency with SHAP

✔ Real-time processing architecture

✔ Scalable for enterprise networks

🖥️ Deliverables

CypherEyes includes:

🔹 Real-time Web Dashboard

Displays:

Alerts

Anomaly trends

Zero-day insights

SHAP explanations

User behavior analytics

🔹 Backend REST API

Handles:

Signature matching

ML inference

Live flow streaming

🔹 ML Pipeline

Data preprocessing

Ensemble inference

XAI reasoning
