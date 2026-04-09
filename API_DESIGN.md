# GitaGuide — Gemini API Integration Reference

## API Overview

| Item | Value |
|------|-------|
| **Provider** | Google (Generative Language API) |
| **Model** | `gemini-2.0-flash` |
| **Base URL** | `https://generativelanguage.googleapis.com/v1beta` |
| **Auth Method** | API Key as query parameter |
| **Response Format** | JSON (structured output) |

---

## Setup

### 1. Get API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated key

### 2. Configure in App

Create `.env` in the project root:

```env
GEMINI_API_KEY=AIzaSy...your_key_here
```

Configure `babel.config.js` to load env vars:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: true,
        allowUndefined: false,
      }]
    ]
  };
};
```

---

## API Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}
```

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt here..."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.9,
    "maxOutputTokens": 1024,
    "responseMimeType": "application/json"
  }
}
```

### Response Body

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{ ... JSON string ... }"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP"
    }
  ]
}
```

---

## Prompt Template

```text
You are a Bhagavad Gita scholar and spiritual guide.

The user is feeling: "{mood}"

Based on this mood, provide ONE highly relevant shloka (verse) from the 
Bhagavad Gita. Respond in this exact JSON format:

{
  "chapter": <chapter_number>,
  "verse": <verse_number>,
  "sanskrit": "<the original Sanskrit shloka in Devanagari script>",
  "transliteration": "<IAST transliteration of the verse>",
  "translation": "<English translation of the verse>",
  "explanation": "<2-3 sentences explaining how this verse relates to the 
                   user's current mood and what wisdom they can draw from it>"
}

Rules:
- The verse MUST be an actual verse from the Bhagavad Gita
- The translation should be accurate and easy to understand
- The explanation should be warm, compassionate, and personally relevant
- Respond ONLY with valid JSON, no markdown or extra text
```

---

## Service Implementation

```javascript
// src/services/geminiService.js

import { GEMINI_API_KEY } from '@env';

const GEMINI_URL = 
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const buildPrompt = (mood) => `
You are a Bhagavad Gita scholar and spiritual guide.

The user is feeling: "${mood}"

Based on this mood, provide ONE highly relevant shloka (verse) from the Bhagavad Gita.
Respond in this exact JSON format:

{
  "chapter": <chapter_number>,
  "verse": <verse_number>,
  "sanskrit": "<the original Sanskrit shloka in Devanagari script>",
  "transliteration": "<IAST transliteration of the verse>",
  "translation": "<English translation of the verse>",
  "explanation": "<2-3 sentences explaining how this verse relates to the user's current mood>"
}

Rules:
- The verse MUST be an actual, real verse from the Bhagavad Gita
- The translation should be accurate and easy to understand
- The explanation should be warm, compassionate, and personally relevant
- Respond ONLY with valid JSON
`;

export const getGitaQuote = async (mood) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(mood) }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const quote = JSON.parse(text);

    // Validate required fields
    const required = ['chapter', 'verse', 'sanskrit', 'translation', 'explanation'];
    for (const field of required) {
      if (!quote[field]) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    return { success: true, data: quote };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, error: 'Request timed out. Please try again.' };
    }
    return { success: false, error: error.message || 'Something went wrong.' };
  }
};
```

---

## Rate Limits (Free Tier)

| Limit | Value |
|-------|-------|
| Requests per minute | 15 |
| Tokens per minute | 1,000,000 |
| Requests per day | 1,500 |
| Max input tokens | 1,048,576 |
| Max output tokens | 8,192 |

These limits are more than sufficient for a personal-use app. Each quote request uses ~200 input tokens and ~300 output tokens.

---

## Error Codes

| HTTP Code | Meaning | App Behavior |
|-----------|---------|-------------|
| 200 | Success | Parse and display quote |
| 400 | Bad request | Check prompt format, retry |
| 401 | Invalid API key | Show "Invalid API Key" error |
| 403 | Forbidden | API key lacks permissions |
| 429 | Rate limited | Show "Too many requests" + cooldown |
| 500 | Server error | Show "Try again later" |
| Timeout | No response in 15s | Show "Request timed out" |

---

## Testing the API (cURL)

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "You are a Bhagavad Gita scholar. The user is feeling: sad. Provide one relevant Gita shloka. Respond as JSON with fields: chapter, verse, sanskrit, transliteration, translation, explanation."}]}],
    "generationConfig": {"temperature": 0.7, "responseMimeType": "application/json"}
  }'
```
