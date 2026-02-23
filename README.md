# Scam Emergency Assessment — Deployment Guide

## What This Is
A lead-generation questionnaire for The Scam Hotline. Visitors answer 8 questions about their scam experience, receive a personalized assessment, and give their email to receive the Scam Emergency Lockdown Protocol.

## Quick Deploy to Vercel (5 minutes)

### Option A: GitHub + Vercel (Recommended)
1. Create a GitHub account if you don't have one: https://github.com
2. Create a new repository (call it `scam-assessment` or whatever you want)
3. Upload all files from this folder to the repository
4. Go to https://vercel.com and sign up with your GitHub account
5. Click "New Project" → Import your `scam-assessment` repo
6. Vercel auto-detects Vite — just click "Deploy"
7. Done. You'll get a URL like `scam-assessment.vercel.app`

### Option B: Vercel CLI (Faster if you're comfortable with terminal)
```bash
npm install -g vercel
cd scam-assessment
npm install
vercel
```
Follow the prompts. Done.

## Custom Domain
After deploying, go to your Vercel dashboard:
1. Select your project
2. Go to Settings → Domains
3. Add `assessment.thescamhotline.org` (or whatever subdomain you want)
4. Add the DNS records Vercel gives you to your domain registrar
5. SSL is automatic

## Connect Email Service
In `src/ScamEmergencyAssessment.jsx`, find the `handleEmailSubmit` function.
Replace the console.log with your email service API call:

```javascript
// ConvertKit example:
const handleEmailSubmit = async (email, answers) => {
  await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: 'YOUR_API_KEY',
      email: email,
      fields: {
        scam_type: answers.situation,
        payment_method: answers.payment,
        timing: answers.timing,
        amount: answers.amount,
        who_affected: answers.who,
        feeling: answers.feeling,
        locked_down: answers.locked_down,
        bank_contacted: answers.bank_contact,
      }
    })
  });
};
```

## File Structure
```
scam-assessment/
├── index.html                          ← Entry point
├── package.json                        ← Dependencies
├── vite.config.js                      ← Build config
├── public/
│   └── logo.png                        ← Your logo (swap this file)
├── src/
│   ├── main.jsx                        ← React bootstrap
│   └── ScamEmergencyAssessment.jsx     ← The full questionnaire
└── README.md                           ← This file
```

## To Update
Edit `src/ScamEmergencyAssessment.jsx` and push to GitHub. Vercel auto-deploys.

## Local Development
```bash
npm install
npm run dev
```
Opens at http://localhost:5173
