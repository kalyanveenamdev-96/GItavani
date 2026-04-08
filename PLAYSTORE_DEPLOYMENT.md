# GitaVani — Play Store Deployment Guide

> Complete guide to publishing GitaVani on the Google Play Store using Expo EAS

---

## ✅ Yes, You Can Deploy to Play Store!

The app is built with **React Native + Expo**, which produces a standard Android APK/AAB — fully compatible with the Google Play Store. You already have experience with EAS builds from the Smriti app, so the process will be familiar.

---

## 📋 Prerequisites

| Item | Status | Notes |
|------|--------|-------|
| Google Play Developer Account | Required | One-time **$25 fee** at [play.google.com/console](https://play.google.com/console) |
| Expo Account | ✅ Already have | `kalyan.veenam` |
| EAS CLI | ✅ Already set up | Used for Smriti builds |
| App Icon (512×512) | Need to create | Required for store listing |
| Feature Graphic (1024×500) | Need to create | Required for store listing |
| Screenshots (phone) | Need to capture | Minimum 2, recommended 4-8 |
| Privacy Policy URL | Need to create | Required by Google — can host on GitHub Pages |

---

## 🔧 Build Configuration

### `app.json` Configuration

```json
{
  "expo": {
    "name": "GitaVani",
    "slug": "GitaVani",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "android": {
      "package": "com.kalyan.gitavani",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF6F00"
      }
    },
    "extra": {
      "eas": {
        "projectId": "<will be generated>"
      }
    }
  }
}
```

### `eas.json` Configuration

```json
{
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./play-store-key.json",
        "track": "production"
      }
    }
  }
}
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Build the Production AAB

```bash
# Build Android App Bundle (required for Play Store)
eas build --platform android --profile production
```

This generates a `.aab` file (Android App Bundle) — the format Google Play requires.

### Step 2: Create Play Store Listing

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **"Create app"**
3. Fill in:
   - **App name**: GitaVani — Bhagavad Gita Wisdom
   - **Default language**: English (United States)
   - **App or Game**: App
   - **Free or Paid**: Free

### Step 3: Store Listing Details

| Field | Suggested Content |
|-------|-------------------|
| **Short description** (80 chars) | Get personalized Bhagavad Gita wisdom based on your mood, powered by AI |
| **Full description** (4000 chars) | See below |
| **Category** | Books & Reference |
| **Tags** | spirituality, hinduism, bhagavad gita, meditation, quotes |

#### Full Description (suggested)

```
🙏 GitaVani — Your Personal Bhagavad Gita Companion

Feeling stressed? Confused? Anxious? Or simply seeking wisdom?

GitaVani uses AI to find the perfect Bhagavad Gita verse for your 
current emotional state. Simply tell the app how you're feeling, 
and receive a relevant Sanskrit shloka with its translation and a 
personalized explanation.

✨ Features:
• Type your mood or choose from preset emotions
• Receive authentic Bhagavad Gita verses with Sanskrit text
• Get personalized explanations of how each verse relates to you
• Beautiful, serene interface designed for reflection
• Save your favorite verses for offline reading
• Share wisdom with friends and family

📖 The Bhagavad Gita contains 700 verses of timeless wisdom spoken 
by Lord Krishna to Arjuna. Let AI help you discover the right verse 
at the right time.

🔒 Privacy: No account needed. No data collected. Your mood stays 
on your device.

Built with love for seekers of wisdom. 🙏
```

### Step 4: Upload Assets

| Asset | Spec | Count |
|-------|------|-------|
| App Icon | 512 × 512 PNG (32-bit, no alpha) | 1 |
| Feature Graphic | 1024 × 500 PNG or JPEG | 1 |
| Phone Screenshots | 16:9 or 9:16, min 320px, max 3840px | 2–8 |

### Step 5: Content Rating

1. Go to **Policy → App content → Content rating**
2. Fill the IARC questionnaire — the app will likely get an **"Everyone"** rating
3. No violence, no user-generated content, no purchases

### Step 6: Privacy Policy

Create a simple privacy policy (can host as a GitHub repo page):

```markdown
# GitaVani Privacy Policy

Last updated: April 2026

GitaVani does not collect, store, or share any personal information.

- No account or login required
- No analytics or tracking
- Mood text is sent to Google's Gemini API for quote generation only 
  and is not stored
- Saved quotes are stored only on your device

Contact: your.email@example.com
```

Host it at: `https://yourusername.github.io/gitavani-privacy/`

### Step 7: Upload & Review

1. Go to **Production → Releases → Create new release**
2. Upload the `.aab` file from Step 1
3. Add release notes: *"Initial release of GitaVani"*
4. Submit for review

### Step 8: Review Timeline

| Stage | Duration |
|-------|----------|
| Initial review | 1–7 days (first-time apps take longer) |
| Subsequent updates | Usually 1–3 days |
| OTA updates (EAS Update) | Instant — no review needed |

---

## 🔄 Post-Launch: OTA Updates

For content/logic changes (no native module changes), use EAS Update to push instantly — no Play Store review needed:

```bash
eas update --branch production --message "Updated prompt for better quotes"
```

For native changes (new packages, permissions), rebuild and resubmit:

```bash
eas build --platform android --profile production
eas submit --platform android
```

---

## 💰 Costs Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Google Play Developer Account | $25 | One-time |
| Gemini API (free tier) | $0 | Ongoing |
| EAS Build (free tier) | $0 | Up to 30 builds/month |
| Expo Account | $0 | Free tier |
| **Total to launch** | **$25** | — |

---

## ⚠️ Play Store Compliance Notes

1. **API Key in App Binary**: For a personal/small-scale app, this is acceptable. For wider distribution, consider proxying through a backend server.
2. **AI-Generated Content**: Google Play allows AI-generated content. Disclose it in the store listing if needed.
3. **Religious Content**: Spiritual/religious apps are allowed. Ensure the description does not make medical/therapeutic claims.
4. **Intellectual Property**: Bhagavad Gita is an ancient public domain text — no copyright issues.
