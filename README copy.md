#  AgriScoreX

**AgriScoreX** is a SaaS-based **bank-first credit decisioning platform / API** designed to solve one of the biggest problems in agricultural lending:

> **Banks don’t struggle to lend.  
They struggle to lend safely.**

Traditional credit scores fail farmers because income is seasonal, transactions are informal, and risk is driven by **weather, soil, and crop volatility**.

AgriScoreX replaces binary *approve-or-reject* lending with a **risk-aware decision system** that tells banks:

-  **Whether** a loan should be approved  
-  **How much** can be safely lent  
-  **How** the borrower can improve eligibility  

This helps banks **reduce NPAs** while **expanding responsible credit access**.

---

## ⚠️ Important Note (Render Free Tier)

> The backend is hosted on **Render (Free Tier)**.  
> **Initial requests may take 30–60 seconds** to respond while the service wakes up.  
> Please wait for the service to start before testing the app or API.

---

## 🔗 Live Links

- **Frontend (Vercel)**:  
  👉 https://break2-build.vercel.app/

- **Backend API (Render)**:  
  👉 https://break2build.onrender.com

- **API Docs**:  
  👉 https://break2build.onrender.com/docs

---

## Demo
[Watch Demo Video](https://drive.google.com/file/d/1LhAFl6CzBr3IJDGMPoeM78K7me0DVOp7/view?usp=sharing)


## Setup Instructions

### Frontend (Client)

```bash
cd src/client
npm install
npm run dev
```

### Backend (Server)

```bash
cd src/server
pip install -r requirements.txt
uvicorn main:app --reload
```

**Note:** After local setup, update `VITE_API_URL` in the client `.env` file to `http://localhost:8000` to point the frontend to the local backend.










