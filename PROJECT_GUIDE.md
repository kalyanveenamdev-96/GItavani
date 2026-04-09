# GitaGuide — Bhagavad Gita Quote App

> A mood-based Bhagavad Gita wisdom app powered by Google Gemini AI

---

## 📋 Overview

**GitaGuide** is a React Native (Expo) mobile app that delivers personalized Bhagavad Gita quotes based on the user's current emotional state. Users can type their mood freely or pick from preset mood options. The app sends this mood context to the **Google Gemini API**, which returns a relevant Gita shloka (Sanskrit verse), its English translation, and a brief explanation of how it relates to the user's mood.

---

## 🎯 Problem Statement

People often seek spiritual guidance during different emotional phases of life — stress, confusion, sadness, or even joy. The Bhagavad Gita contains timeless wisdom for every human emotion, but finding the right verse at the right time is hard. **GitaGuide** bridges this gap by using AI to match your mood to the most relevant Gita teaching.

---

## ✨ Core Features

### MVP (Phase 1)
| Feature | Description |
|---------|-------------|
| **Mood Text Input** | Free-text field where users type how they feel |
| **Preset Mood Selector** | Tappable mood chips/buttons (Happy, Sad, Anxious, Angry, Confused, Motivated, Lonely, Grateful) |
| **AI-Powered Quote Generation** | Gemini API generates a relevant Gita shloka with translation and context |
| **Beautiful Quote Display** | Card-based UI showing the Sanskrit verse, English translation, and mood-specific explanation |
| **Loading State** | Elegant animation while the API processes the request |

### Phase 2 (Future Enhancements)
| Feature | Description |
|---------|-------------|
| **Favorites / Bookmarks** | Save quotes locally for offline access |
| **Daily Quote Notification** | Push notification with a daily Gita verse |
| **Quote Sharing** | Share quotes as beautiful images to WhatsApp, Instagram, etc. |
| **Quote History** | Browse previously fetched quotes |
| **Multi-language Support** | Hindi, Telugu, and other Indian language translations |
| **Offline Mode** | Cache a set of popular quotes for offline use |

---

## 🛠️ Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React Native + Expo SDK 54 | Cross-platform, same stack as Smriti app |
| **Language** | JavaScript | Familiar, fast development |
| **AI Backend** | Google Gemini API (`gemini-2.0-flash`) | Free tier available, excellent at contextual text generation |
| **State Management** | React `useState` / `useContext` | Simple app, no need for Redux |
| **Local Storage** | AsyncStorage | For saving favorites and history |
| **Navigation** | React Navigation | Industry standard for RN apps |
| **Styling** | StyleSheet + expo-linear-gradient | Native styling with gradient backgrounds |
| **Build & Deploy** | EAS Build + EAS Update | OTA updates, APK generation |

---

## 🏗️ App Architecture

```
┌─────────────────────────────────────────────┐
│                   App.js                     │
│              (Navigation Setup)              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐     ┌──────────────────┐   │
│  │ HomeScreen   │────▶│  QuoteScreen     │   │
│  │             │     │                  │   │
│  │ - Mood Input│     │ - Sanskrit Verse │   │
│  │ - Mood Chips│     │ - Translation    │   │
│  │ - Get Quote │     │ - Explanation    │   │
│  │   Button    │     │ - Save / Share   │   │
│  └─────────────┘     └──────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │          Gemini API Service          │   │
│  │  - Sends mood → Receives Gita verse  │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │        AsyncStorage (Local)          │   │
│  │  - Favorites, History, Settings      │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 📱 Screen Breakdown

### 1. Home Screen
- **Header**: App name "GitaGuide" with a subtle Om/lotus icon
- **Mood Input Section**:
  - Text field with placeholder: *"How are you feeling today?"*
  - Below it: horizontally scrollable mood chips
- **Get Quote Button**: Primary CTA — triggers API call
- **Background**: Warm saffron/orange gradient with subtle patterns

### 2. Quote Display Screen (or Modal)
- **Sanskrit Verse**: Displayed in Devanagari script, elegant font styling
- **Chapter & Verse Reference**: e.g., "Bhagavad Gita 2.47"
- **English Translation**: Clean, readable text
- **Mood Connection**: AI-generated explanation of how this verse relates to the user's mood
- **Action Buttons**: ❤️ Save | 📤 Share | 🔄 Get Another

### 3. Favorites Screen (Phase 2)
- List of saved quotes with the mood that triggered them
- Tap to view full quote card

---

## 🔑 Gemini API Integration

### API Details

| Item | Value |
|------|-------|
| **API** | Google Gemini (Generative Language API) |
| **Model** | `gemini-2.0-flash` (fast, free tier friendly) |
| **Endpoint** | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` |
| **Auth** | API Key (passed as query param `?key=YOUR_API_KEY`) |
| **Pricing** | Free tier: 15 RPM, 1M tokens/min, 1500 requests/day |

### Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy the key
4. Add it to your `.env` file as `GEMINI_API_KEY=your_key_here`

### Prompt Engineering

The quality of the quotes depends heavily on prompt design. Here's the core prompt:

```
You are a Bhagavad Gita scholar and spiritual guide.

The user is feeling: "{user_mood}"

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

### API Request Format

```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      }
    })
  }
);
```

### API Response Handling

```javascript
const data = await response.json();
const text = data.candidates[0].content.parts[0].text;
const quote = JSON.parse(text);
// quote = { chapter, verse, sanskrit, transliteration, translation, explanation }
```

---

## 📁 Project Structure

```
GITA/
├── App.js                          # Entry point, navigation setup
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── babel.config.js                 # Babel config with dotenv
├── .env                            # GEMINI_API_KEY (gitignored)
├── .env.example                    # Template for env vars
├── .gitignore
├── assets/
│   ├── icon.png                    # App icon
│   ├── splash-icon.png             # Splash screen
│   └── fonts/                      # Custom fonts (optional)
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js           # Main mood input screen
│   │   ├── QuoteScreen.js          # Quote display screen
│   │   └── FavoritesScreen.js      # Saved quotes (Phase 2)
│   ├── components/
│   │   ├── MoodChip.js             # Individual mood button
│   │   ├── MoodSelector.js         # Horizontal scroll of mood chips
│   │   ├── QuoteCard.js            # Beautiful quote display card
│   │   └── LoadingAnimation.js     # Loading state component
│   ├── services/
│   │   └── geminiService.js        # Gemini API integration
│   ├── utils/
│   │   └── constants.js            # Mood list, colors, app config
│   └── styles/
│       └── theme.js                # Color palette, typography, spacing
├── docs/
│   ├── PROJECT_GUIDE.md            # This file
│   ├── ARCHITECTURE.md             # Detailed architecture doc
│   └── API_DESIGN.md               # API integration reference
└── README.md                       # Quick start guide
```

---

## 🎨 Design Language

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Saffron** | `#FF6F00` | Primary, headers, CTA buttons |
| **Deep Maroon** | `#4A0E0E` | Text on light backgrounds |
| **Gold** | `#FFD700` | Accents, Sanskrit text |
| **Cream** | `#FFF8E1` | Card backgrounds |
| **Dark BG** | `#1A0A00` | Dark sections, quote backgrounds |
| **Warm White** | `#FFFDF7` | Screen backgrounds |

### Typography
- **App Title**: Bold, serif-style (Noto Serif or system serif)
- **Sanskrit Verses**: Noto Sans Devanagari or system default
- **Body Text**: System font (clean, readable)
- **Mood Chips**: Medium weight, rounded

### Visual Elements
- Warm saffron-to-maroon gradients
- Subtle lotus/mandala patterns as background decorations
- Soft shadows and rounded corners on cards
- Gentle fade-in animations for quote reveals

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "expo": "^54.0.0",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "@react-navigation/native": "^7.x",
    "@react-navigation/native-stack": "^7.x",
    "@react-native-async-storage/async-storage": "^2.x",
    "expo-linear-gradient": "^15.x",
    "expo-status-bar": "^3.x",
    "react-native-safe-area-context": "^5.x",
    "react-native-screens": "^4.x",
    "react-native-dotenv": "^3.x"
  }
}
```

---

## ⏱️ Estimated Timeline

| Phase | Tasks | Effort |
|-------|-------|--------|
| **Setup** | Project init, folder structure, dependencies | 30 min |
| **Theme & Constants** | Colors, typography, mood list | 20 min |
| **HomeScreen** | Mood input, mood chips, layout | 1 hour |
| **Gemini Service** | API integration, prompt, response parsing | 45 min |
| **QuoteScreen** | Quote card UI, animations | 1 hour |
| **Navigation** | Screen routing, passing data | 20 min |
| **Polish** | Loading states, error handling, gradients | 45 min |
| **Testing** | End-to-end flow, edge cases | 30 min |
| **Build** | EAS build, APK generation | 30 min |
| **Total** | | **~5–6 hours** |

---

## 🚀 Getting Started

```bash
# 1. Navigate to the project
cd /Users/kalyanchakravarthi/Desktop/GITA

# 2. Initialize Expo project
npx -y create-expo-app@latest ./

# 3. Install dependencies
npx expo install expo-linear-gradient @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage

npm install react-native-dotenv

# 4. Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 5. Start development
npx expo start
```

---

## ⚠️ Important Notes

1. **API Key Security**: Never commit `.env` to git. Always use `.env.example` as a template.
2. **Gemini Free Tier Limits**: 15 requests/minute, 1500 requests/day — sufficient for personal use.
3. **AI Output Validation**: Always validate the JSON response from Gemini. Occasionally the model may return malformed output — add retry logic.
4. **Offline Consideration**: The app requires internet for quote generation. Show a friendly offline message if network is unavailable.
