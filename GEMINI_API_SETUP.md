# 🔑 Gemini API Key Setup Instructions

To enable AI Security Analysis in CryptoGuard AI, you need a valid Gemini API key.

## Step 1: Get Gemini API Key

1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with `AIza...`)

## Step 2: Add API Key to Environment

1. Open the `.env` file in your project root
2. Find the line with `GOOGLE_AI_API_KEY=`
3. Replace the value with your new API key:
   ```
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```

## Step 3: Restart Development Server

1. Stop your development server (Ctrl+C)
2. Restart with: `npm run dev`
3. The AI Security Analysis should now work!

## ⚠️ Current Issue

The current API key in your `.env` file appears to be invalid or expired:
```
GOOGLE_AI_API_KEY=AIzaSyAEqsUE-xJhyiQtU3-ot_6EUC4bkmb8nh0
```

## 🛡️ Security Notes

- Never commit your API key to version control
- Add `.env` to your `.gitignore` file
- Keep your API key secure and don't share it publicly

## 🧪 Test Your Setup

Once you've added a valid API key:
1. Go to `/dashboard`
2. Click the "Analyze" button in the AI Security Analysis section
3. You should see detailed security recommendations!
