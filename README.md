# TwinSense AI

## Intelligent Digital Twin & AI Sensor Fusion for Predictive Industrial Maintenance

> **AI + Sensor Intelligence + Digital Twin + Predictive Maintenance**

TwinSense AI is an AI-powered predictive-maintenance research prototype designed to identify abnormal industrial equipment behaviour using sensor/time-series analysis, machine-learning-based anomaly detection, a classical statistical baseline, and a lightweight software-based digital twin.

The system combines a Python/FastAPI machine-learning backend with an interactive React/TypeScript dashboard to provide equipment monitoring, anomaly detection, health/risk assessment, digital-twin simulation, and model evaluation.

---

## 🚀 Live Prototype

### TwinSense AI — Interactive Demo

**Live Demo:**  
https://twinsenseai-enymsbe7.manus.space/overview

> This is a hosted hackathon/research prototype and should not be considered a production industrial deployment.

---

## 🏆 Hackathon

| Field | Details |
|---|---|
| **Competition** | Ideas for India Innovation Challenge 2026 |
| **Theme** | Artificial Intelligence & Deep Tech |
| **Challenge** | Sovereign Technology for India |
| **Applicant** | Shashank Padmasali |
| **Institution** | TKR College of Engineering and Technology |
| **Industry** | Advanced Manufacturing & Industry |

---

# 📌 Problem Statement

Industrial equipment can exhibit subtle changes in operating behaviour before a major failure occurs.

Traditional maintenance approaches often rely on:

- Fixed maintenance schedules
- Manual inspections
- Individual sensor thresholds
- Reactive maintenance after equipment failure

These approaches may not adequately capture abnormal patterns that emerge across multiple sensor signals.

Unexpected equipment failures can result in:

- Unplanned downtime
- Production disruption
- Higher maintenance costs
- Equipment damage
- Resource wastage
- Operational and safety risks

TwinSense AI explores how AI-based multi-sensor anomaly detection can support a more predictive approach to industrial equipment monitoring.

---

# 💡 Proposed Solution

TwinSense AI combines sensor/time-series processing, machine learning, statistical monitoring, and a lightweight digital twin into a single monitoring workflow.

The high-level pipeline is:

```text
Sensor / Dataset
       │
       ▼
Data Preprocessing
       │
       ▼
Windowing
       │
       ▼
Feature Extraction
       │
       ├──────────────────────┐
       ▼                      ▼
Classical Statistical    Isolation Forest
Baseline                 AI Model
       │                      │
       └──────────┬───────────┘
                  ▼
          Anomaly Detection
                  │
                  ▼
          Health / Risk Score
                  │
                  ▼
            Digital Twin
                  │
                  ▼
      Maintenance Recommendation
                  │
                  ▼
             FastAPI
                  │
                  ▼
        React / TypeScript UI
```

The objective is to compare an AI-based anomaly-detection approach with a conventional statistical baseline and present the results through an interactive industrial monitoring interface.

---

# ✨ Key Features

## 🤖 AI / Machine Learning

- Isolation Forest-based anomaly detection
- Classical statistical baseline
- Sensor/time-series preprocessing
- Feature extraction
- Model training
- Model inference
- Anomaly scoring
- Model evaluation
- Health and risk assessment

---

## 🏭 Digital Twin

TwinSense AI includes a lightweight software/state-based digital twin for representing the monitored machine and its operational state.

The prototype supports:

- Machine-state representation
- Sensor-state visualization
- Health-state representation
- Risk-state transitions
- Controlled fault/degradation scenarios
- Simulation-based monitoring

> The current implementation is a lightweight software/state-based digital twin and is not a high-fidelity physics or finite-element simulation.

---

## 📊 Interactive Dashboard

The web application provides an interactive interface for:

- Overview monitoring
- Live sensor visualization
- Digital Twin
- AI Insights
- Predictive Maintenance
- Simulation Lab
- Model Evaluation
- Data Sources
- System Settings

---

## ⚙️ Backend

The backend provides the machine-learning and inference layer using:

- Python
- FastAPI
- Uvicorn
- Scikit-learn
- NumPy
- Pandas

The backend is responsible for loading trained model artifacts, processing prediction requests, and providing model/evaluation information to the frontend.

---

# 🧠 AI Pipeline

## 1. Data Loading

The system loads machinery sensor/time-series data from the configured dataset or simulation source.

The primary research dataset used by the project is:

**MAFAULDA — Machinery Fault Database**

The raw dataset is not included in this repository when its size or distribution requirements make direct inclusion inappropriate.

---

## 2. Preprocessing

The data-processing pipeline prepares sensor signals for machine-learning analysis.

Depending on the configured dataset and pipeline, processing includes:

- Signal preparation
- Data cleaning
- Normalization/scaling
- Windowing
- Feature preparation

The exact processing configuration is implemented in the backend data-processing modules.

---

## 3. Feature Extraction

Sensor windows are converted into numerical feature representations for anomaly detection.

Relevant signal characteristics include time-domain and, where implemented, frequency-domain information.

### Time-Domain Features

- Mean
- Standard deviation
- Variance
- RMS
- Peak
- Peak-to-peak
- Kurtosis
- Skewness
- Crest factor

### Frequency-Domain Features

Where applicable:

- FFT characteristics
- Dominant frequency
- Spectral energy
- Frequency-related signal characteristics

> Only features implemented by the current pipeline should be considered part of the evaluated model.

---

# 🌲 Isolation Forest

TwinSense AI uses **Isolation Forest** as its primary anomaly-detection model.

Isolation Forest is suitable for this prototype because it:

- Works well for anomaly-detection workflows
- Is computationally lightweight
- Supports CPU-based inference
- Can operate without requiring extensive labelled fault data
- Is practical for rapid industrial-AI prototyping

The model processes the extracted feature representation and generates anomaly-related outputs used by the application.

The anomaly result is then used as part of the equipment health/risk assessment workflow.

---

# 📏 Classical Baseline

TwinSense AI also includes a classical statistical baseline.

The baseline provides a reference point against which the AI anomaly-detection approach can be evaluated.

The comparison is intended to answer:

> Can multi-feature AI-based anomaly detection provide useful additional intelligence compared with conventional statistical monitoring?

The baseline and AI model are evaluated using the same evaluation framework where applicable.

---

# 📊 Model Evaluation

TwinSense AI includes an evaluation pipeline for comparing the AI model with the classical baseline.

Relevant evaluation metrics include:

- Precision
- Recall
- F1 Score
- False Positive Rate
- Detection Rate
- Inference Latency

## Evaluation Status

> Quantitative model-performance values should be populated from the latest reproducible evaluation run.

The repository should be treated as the source of truth for the latest measured evaluation results.

No performance value should be interpreted as a measured result unless it was generated by the actual evaluation pipeline.

---

# 🗃️ Dataset

## MAFAULDA — Machinery Fault Database

The primary research dataset used for the project is the **Machinery Fault Database (MAFAULDA)**.

The dataset provides machinery-related sensor signals suitable for research into:

- Machinery condition monitoring
- Signal analysis
- Fault detection
- Anomaly detection
- Predictive maintenance

The project uses the dataset as a research/benchmark foundation rather than claiming that the prototype is currently connected to live industrial machinery.

### Dataset Setup

Raw dataset files should be placed in the project's configured data directory according to the backend data-loader instructions.

Large raw datasets should not be committed to GitHub.

---

# 🏗️ System Architecture

```text
┌───────────────────────────────┐
│     Industrial Machine        │
│      / Simulation Source      │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Sensor / Time Data      │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│     Data Preprocessing        │
│ Cleaning / Scaling / Windowing│
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│      Feature Extraction       │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌────────────────┐
│ Statistical   │  │ Isolation      │
│ Baseline      │  │ Forest         │
└───────┬───────┘  └───────┬────────┘
        │                   │
        └─────────┬─────────┘
                  ▼
       ┌─────────────────────┐
       │ Anomaly Detection   │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ Health / Risk       │
       │ Assessment          │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ Lightweight Digital │
       │ Twin                │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ Maintenance         │
       │ Recommendation      │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ FastAPI Backend      │
       └──────────┬───────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ React / TypeScript   │
       │ Dashboard            │
       └─────────────────────┘
```

---

# 🔄 Real ML Mode vs Demo Simulation

TwinSense AI supports the distinction between actual model-backed processing and demonstration/simulation workflows.

## Real ML Model Mode

```text
Frontend
   │
   ▼
FastAPI
   │
   ▼
ML Processing
   │
   ▼
Trained Model
   │
   ▼
Prediction
   │
   ▼
Dashboard
```

When the backend is connected, the application can consume model-backed results through the API.

---

## Demo Simulation Mode

The prototype also supports simulation workflows for demonstrating machine behaviour and fault/degradation scenarios.

Simulation values are intended for demonstration and UI interaction.

> Demo simulation values must not be interpreted as measured machine-learning performance.

---

# 🧬 Digital Twin Workflow

The digital twin represents the monitored machine through a lightweight software state model.

A typical state progression is:

```text
NORMAL
   │
   ▼
EARLY DEVIATION
   │
   ▼
DEGRADATION
   │
   ▼
HIGH RISK
```

The digital twin provides a visual and interactive representation of machine state while the AI pipeline provides anomaly/risk information.

---

# 🔌 Backend API

TwinSense AI uses a FastAPI backend for model-serving and application integration.

The exact API endpoints are defined by the backend implementation.

Typical backend responsibilities include:

- Backend health/status
- Machine state
- Sensor data
- Model prediction
- Anomaly detection
- Simulation
- Model evaluation
- Model information

Refer to the backend source code for the current endpoint definitions.

---

# 🖥️ Frontend

The frontend is an interactive React/TypeScript web application.

The interface is designed around an industrial monitoring workflow.

### Main Application Areas

```text
Overview
   │
   ├── Live Monitoring
   │
   ├── Digital Twin
   │
   ├── AI Insights
   │
   ├── Predictive Maintenance
   │
   ├── Simulation Lab
   │
   ├── Model Evaluation
   │
   ├── Data Sources
   │
   └── Settings
```

The dashboard allows users to observe machine state, sensor information, AI outputs, simulation scenarios, and evaluation information.

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling/UI | Tailwind CSS / project UI components |
| Backend | Python |
| API Framework | FastAPI |
| Server | Uvicorn |
| Machine Learning | Scikit-learn |
| AI Model | Isolation Forest |
| Data Processing | NumPy, Pandas |
| Visualization | Recharts / project chart components |
| Deployment | Hosted prototype environment |

> Only technologies actually present in the repository should be considered part of the production implementation.

---

# 📁 Project Structure

The repository is organized around the frontend, backend, machine-learning pipeline, data and model artifacts.

A representative structure is:

```text
TwinSense-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── data/
│   ├── models/
│   ├── evaluation/
│   ├── api/
│   ├── services/
│   ├── artifacts/
│   ├── requirements.txt
│   └── main.py
│
├── data/
│   ├── raw/
│   └── processed/
│
├── README.md
└── ...
```

> The exact structure may vary depending on the current repository organization.

---

# 🚀 Installation

## Prerequisites

Install:

- Git
- Python 3.x
- Node.js
- npm

Use the versions required by the project's configuration files where applicable.

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd TwinSense-AI
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Dataset Setup

Download the required dataset from its official source.

Place the dataset according to the directory structure expected by the project's data loader.

For example:

```text
data/
└── raw/
    └── <dataset-files>
```

Do not commit large raw datasets into the repository.

---

## 4. Start FastAPI

From the backend directory:

```bash
uvicorn main:app --reload
```

If the project's actual FastAPI module differs, use the command specified by the backend implementation.

The API will normally be available at:

```text
http://localhost:8000
```

---

## 5. Frontend Setup

Open another terminal and navigate to the frontend/project root.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite in the terminal.

---

# 🔧 Environment Configuration

If the frontend requires a backend URL, configure the appropriate environment variable.

Example:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Do not commit:

- API keys
- Passwords
- Tokens
- Private credentials
- `.env` files containing secrets

Use `.env.example` for non-secret configuration where appropriate.

---

# 🧪 Model Training

The ML workflow follows:

```text
Dataset
   ↓
Data Loading
   ↓
Preprocessing
   ↓
Windowing
   ↓
Feature Extraction
   ↓
Training
   ↓
Validation
   ↓
Model Artifact
```

The trained model can then be loaded by the backend for inference.

The exact training command should be taken from the current backend training scripts.

---

# 📈 Evaluation Workflow

The evaluation workflow compares:

```text
Classical Statistical Baseline
             VS
       Isolation Forest
```

The evaluation process should use held-out data where possible and report only metrics generated by the actual evaluation pipeline.

Recommended metrics include:

- Precision
- Recall
- F1 Score
- False Positive Rate
- Detection Rate
- Inference Latency

The final reported values should always correspond to the latest reproducible model-evaluation run.

---

# 🎥 Demonstration Workflow

The recommended prototype demonstration is:

```text
1. Open TwinSense AI Overview
          ↓
2. Show machine health/state
          ↓
3. Open Digital Twin
          ↓
4. Start monitoring/simulation
          ↓
5. Trigger a supported fault/degradation scenario
          ↓
6. Observe sensor behaviour
          ↓
7. Observe anomaly/risk response
          ↓
8. Open AI Insights
          ↓
9. Open Model Evaluation
          ↓
10. Review measured evaluation results
          ↓
11. Show maintenance recommendation
```

The demonstration is intended to show the complete workflow from machine observation to AI-assisted maintenance decision support.

---

# 🇮🇳 Sovereign Technology for India

TwinSense AI aligns with the **Artificial Intelligence & Deep Tech** theme of the Sovereign Technology for India challenge.

The project explores how indigenous AI software capabilities can support:

- Advanced manufacturing
- Industrial monitoring
- Predictive maintenance
- MSME technology adoption
- Affordable industrial intelligence
- Data-driven manufacturing
- Domestic AI capability

The architecture is designed to provide a potential pathway from:

```text
Public Data + Simulation
          ↓
Low-Cost Sensors
          ↓
Industrial Edge AI
          ↓
Multi-Machine Monitoring
          ↓
Multi-Factory Deployment
```

The long-term objective is to explore an adaptable industrial-AI layer that can operate without requiring complete dependence on closed proprietary analytics platforms.

---

# 📌 Current Prototype Status

TwinSense AI currently represents a **research/hackathon prototype**.

The project demonstrates the integration of:

- Machine/sensor data processing
- Classical anomaly monitoring
- Isolation Forest anomaly detection
- Model evaluation
- FastAPI model serving
- React dashboard integration
- Digital twin state representation
- Fault/degradation simulation
- Interactive monitoring
- Maintenance decision support

Quantitative model performance should be considered valid only when generated by the reproducible evaluation pipeline.

---

# ⚠️ Limitations

The current prototype has several boundaries:

- The system is a research/hackathon prototype rather than a certified industrial deployment.
- Benchmark/public data is used for model development and evaluation.
- The digital twin is a lightweight software/state-based representation.
- Real-world industrial deployment would require additional validation.
- Live industrial sensor integration is a future deployment step unless explicitly configured.
- Safety-critical maintenance decisions should not be made solely from prototype predictions.

---

# 🔮 Future Scope

Future development can include:

### 1. Low-Cost IoT Sensors

Connect affordable vibration, temperature, current and other sensors directly to the platform.

### 2. Edge AI

Deploy the inference pipeline closer to industrial equipment to reduce latency and network dependency.

### 3. Additional Datasets

Validate the approach across additional machinery types and operating conditions.

### 4. Expanded Fault Detection

Support additional machinery fault categories and more comprehensive diagnostic models.

### 5. Physics-Informed Digital Twin

Extend the current state-based digital twin toward a higher-fidelity physics-informed model.

### 6. Remaining Useful Life

Introduce validated Remaining Useful Life modelling where appropriate datasets support it.

### 7. Multi-Machine Monitoring

Extend the architecture from individual equipment monitoring to plant-level monitoring.

### 8. Industrial Pilot Validation

Validate the system with real industrial sensor streams and domain-expert feedback.

---

# 🔬 Research Foundation

TwinSense AI is based on established research directions in:

- Predictive maintenance
- Machinery condition monitoring
- Anomaly detection
- Sensor fusion
- Digital twins
- Industrial AI
- Machine-learning-based fault detection

The primary dataset and research references should be verified against their original/public sources before being used for formal research claims.

---

# 📚 References

The project documentation should maintain a verified list of:

- MAFAULDA dataset source
- CWRU Bearing Dataset where used
- Relevant digital-twin research
- Predictive-maintenance research
- Isolation Forest research
- Industrial anomaly-detection research

Only verified sources should be added here.

---

# 👨‍💻 Author

## Shashank Padmasali

**B.Tech — Computer Science / Data Science**

**TKR College of Engineering and Technology**

Project developed as part of the **Ideas for India Innovation Challenge 2026**.

---

# 🔗 Project Links

### Live Prototype

https://twinsenseai-enymsbe7.manus.space/overview

### GitHub Repository

_Add repository URL after publishing._

### Demonstration Video

_Add final demonstration video link._

### Concept-to-Prototype Plan

_Add supporting document link if required._

---

# 📄 Hackathon Submission

| Field | Details |
|---|---|
| **Project** | TwinSense AI |
| **Theme** | Artificial Intelligence & Deep Tech |
| **Challenge** | Sovereign Technology for India |
| **Competition** | Ideas for India Innovation Challenge 2026 |

---

# ⚖️ Disclaimer

TwinSense AI is a research and hackathon prototype intended to demonstrate the integration of machine-learning-based anomaly detection, digital-twin concepts and industrial monitoring.

The system is not a certified industrial safety, diagnostic or maintenance system.

Predictions and recommendations should not be treated as a substitute for qualified engineering inspection, industrial safety procedures or domain-expert decision-making.

---

# ⭐ Project Vision

> **From reactive maintenance to predictive intelligence.**

TwinSense AI explores a practical pathway toward combining **AI, sensor intelligence and digital twins** to support smarter and more accessible industrial maintenance.