# 🌱 AgriBridgeZero

## AI-Powered Soil Intelligence & Precision Agriculture Platform

> **Scan the Soil. Understand the Soil. Grow with Confidence.**

AgriBridgeZero is an AI-powered precision agriculture platform that combines a modular soil-intelligence device, IoT, geospatial mapping, Machine Learning, Deep Learning, Computer Vision, Generative AI, and Agentic AI to help farmers understand the condition of their land before and after planting.

The physical AgriBridgeZero device collects soil and environmental data from a farmer's land. The software platform receives, processes, visualizes, and stores this data, while AI analyzes the soil according to the farmer's selected crop.

The primary goal is not to predict crop yield. Instead, AgriBridgeZero focuses on understanding the current condition of the soil, identifying nutrient deficiencies or excesses, monitoring changes after planting, flagging potential harmful-substance risks where supported, and providing understandable crop-specific guidance.

---

## 🚜 The Problem

Farmers can face several soil-related challenges:

- Unknown soil nutrient deficiencies
- Excess nutrients or salinity
- Unsuitable soil conditions for a particular crop
- Incorrect fertilizer application
- Changing soil conditions after planting
- Difficulty understanding technical soil reports
- Potential soil contamination
- Lack of continuous soil monitoring
- Difficulty accessing crop-specific soil guidance
- Language barriers when using technical agricultural information

A farmer may know that a crop is not growing properly but may not know whether the reason is related to nitrogen, phosphorus, potassium, pH, moisture, salinity, contamination, or another soil condition.

AgriBridgeZero aims to turn these unknowns into understandable, data-driven soil intelligence.

---

# 💡 Our Solution

AgriBridgeZero creates a complete pipeline:

```text
Farmer
   ↓
Select Land
   ↓
Interactive Map
   ↓
AgriBridgeZero Soil Intelligence Device
   ↓
Soil & Environmental Data
   ↓
IoT Data Layer
   ↓
ML / DL Soil Analysis
   ↓
Soil Intelligence
   ↓
Select Crop
   ↓
Compare Soil With Crop Requirements
   ↓
AI Analysis
   ↓
Recommendations & Alerts
   ↓
Local Language AI Assistant
   ↓
Agricultural Input Suppliers
```

---

## 🚀 How to Run the Project

The project is split into a **Python FastAPI backend** and a **React (Vite) frontend**.

### ⚡ Quick Start (Both Servers)

#### Terminal 1 — Backend (FastAPI + Python)
> **Note:** The backend is a Python service, so use `uvicorn` (not `npm`).

From the project root:
```powershell
cd backend
.\.venv\Scripts\uvicorn app.main:app --reload --port 8000
```
*Or from the root using npm:*
```powershell
npm run dev:backend
```

- **Backend API & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- The backend automatically uses SQLite (`backend/agribridgezero.db`) if local PostgreSQL/PostGIS is not running.

---

#### Terminal 2 — Frontend (React + Vite + TypeScript)
From the project root:
```powershell
npm run dev
```
*Or from the `frontend/` folder:*
```powershell
cd frontend
npm run dev
```

- **Web App (Desktop):** [http://localhost:5173/](http://localhost:5173/)
- **Mobile Access:** Open `http://<your-local-ip>:5173/` on your phone connected to the same Wi-Fi.
- Vite automatically proxies `/api/v1` calls to the FastAPI backend running on port 8000.
