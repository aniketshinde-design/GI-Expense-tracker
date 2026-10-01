# GroundOps - Ground Intelligence Expense Tracker

Mobile-first real-time field expense tracking and consolidated budget management for a 4-member ground intelligence activity (**Aniket**, **Darsh**, **Geetika**, and **Aditi**) covering the **2 October 2026 – 18 October 2026** operational timeline.

---

## ⚡ Features

- **Consolidated Team Pool:** Real-time team balance starting at ₹1,40,000 (dynamically linked to individual allocations) that burns with every recorded expense.
- **Editable Allocations:** Easily customize individual budgets for each operative (default ₹35,000 each) via the built-in "Edit Allocations" modal. The team consolidated pool updates automatically.
- **Direct Expense Logging:** Friction-free, mobile-first expense logging capturing Amount (₹), Done by (who paid / whose quota is debited), Reason, Payment Mode (Cash / Online), Bill status (Yes / No), and optional receipt voucher upload.
- **Audit & History:** Full chronological ledger with instant search, multi-attribute filtering (by member, payment mode, bill availability, date), receipt photo preview, and edit/delete capabilities with automatic balance recalculation.
- **Field Liquidity & Analytics:** Tracks physical cash vs. online UPI/card expenditure, voucher compliance rates, and daily burn velocity.
- **Air-Gapped Data Safety:** Offline-first persistent storage using browser `localStorage` + instant 1-click **CSV Export**.
- **Clean Slate:** Starts with zero previous logs, ready for fresh mission recording.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` or `pnpm`

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port shown in terminal).

### 4. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output to the `dist/` directory.

---

## 📦 How to Upload to GitHub

Follow these steps to push this project to a new GitHub repository:

### Step 1: Initialize Git
Open your terminal in this project folder and run:
```bash
git init
git add .
git commit -m "feat: groundops expense tracker mobile web app"
```

### Step 2: Create a New GitHub Repository
1. Go to [GitHub](https://github.com/new).
2. Create a new repository named `groundops-expense-tracker` (leave "Initialize with README" unchecked).
3. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/groundops-expense-tracker.git`).

### Step 3: Link Remote and Push
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/groundops-expense-tracker.git
git push -u origin main
```

---

## 🌐 How to Deploy to Vercel

This repository is pre-configured with `vercel.json` for seamless Vite SPA hosting with automatic client-side routing.

### Step 1: Sign in to Vercel
Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.

### Step 2: Import the Project
1. In your Vercel Dashboard, click **"Add New..."** → **"Project"**.
2. Select your newly created GitHub repository (`groundops-expense-tracker`).
3. Click **"Import"**.

### Step 3: Configure Build Settings
Vercel will automatically detect the Vite configuration:
- **Framework Preset:** `Vite`
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

*(No environment variables are strictly required to run the core expense tracker).*

### Step 4: Click Deploy
Click **"Deploy"**. Within ~30 seconds, Vercel will build and assign you a live, globally CDN-cached production URL (e.g. `https://groundops-expense-tracker.vercel.app`).

Every subsequent commit pushed to `main` on GitHub will automatically trigger a new deployment on Vercel.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **Icons & Motion:** Lucide React, Motion
- **Deployment:** Vercel (SPA rewrite rules configured in `vercel.json`)
