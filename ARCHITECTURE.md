# GitaVani — Architecture Document

## System Architecture

```mermaid
graph TB
    subgraph "Mobile App (React Native / Expo)"
        A[App.js - Navigation] --> B[HomeScreen]
        A --> C[QuoteScreen]
        A --> D[FavoritesScreen]
        
        B --> E[MoodSelector Component]
        B --> F[MoodChip Component]
        C --> G[QuoteCard Component]
        C --> H[LoadingAnimation Component]
        
        B -- "mood text" --> I[geminiService.js]
        I -- "API response" --> C
        
        D --> J[AsyncStorage]
        C -- "save quote" --> J
    end
    
    subgraph "Google Cloud"
        I -- "HTTP POST" --> K[Gemini API]
        K -- "JSON Response" --> I
    end
```

---

## Data Flow

### Quote Generation Flow

```mermaid
sequenceDiagram
    actor User
    participant Home as HomeScreen
    participant Service as geminiService
    participant Gemini as Gemini API
    participant Quote as QuoteScreen

    User->>Home: Types mood / Selects mood chip
    Home->>Home: Validate input (non-empty)
    Home->>Service: getGitaQuote(mood)
    Service->>Gemini: POST /generateContent
    Note over Service,Gemini: Prompt includes mood context<br/>and JSON output format
    Gemini-->>Service: JSON response with shloka
    Service->>Service: Parse & validate JSON
    Service-->>Home: Return quote object
    Home->>Quote: Navigate with quote data
    Quote->>User: Display formatted quote
```

### Save Quote Flow

```mermaid
sequenceDiagram
    actor User
    participant Quote as QuoteScreen
    participant Storage as AsyncStorage

    User->>Quote: Tap ❤️ Save button
    Quote->>Storage: Read existing favorites
    Storage-->>Quote: Current favorites array
    Quote->>Quote: Append new quote with timestamp
    Quote->>Storage: Write updated favorites
    Quote->>User: Show "Saved!" confirmation
```

---

## Component Hierarchy

```
App.js
├── NavigationContainer
│   └── Stack.Navigator
│       ├── HomeScreen
│       │   ├── LinearGradient (background)
│       │   ├── Header (title + icon)
│       │   ├── TextInput (mood text)
│       │   ├── MoodSelector
│       │   │   └── MoodChip × N (scrollable)
│       │   ├── GetQuoteButton
│       │   └── LoadingAnimation (conditional)
│       │
│       ├── QuoteScreen
│       │   ├── LinearGradient (background)
│       │   ├── QuoteCard
│       │   │   ├── Sanskrit Verse
│       │   │   ├── Reference (Chapter:Verse)
│       │   │   ├── Transliteration
│       │   │   ├── Translation
│       │   │   └── Explanation
│       │   └── ActionButtons (Save / Share / Another)
│       │
│       └── FavoritesScreen (Phase 2)
│           └── FlatList
│               └── QuoteCard × N
```

---

## State Management

| State | Location | Description |
|-------|----------|-------------|
| `moodText` | HomeScreen (local) | User-typed mood string |
| `selectedMood` | HomeScreen (local) | Currently selected mood chip |
| `isLoading` | HomeScreen (local) | API call loading state |
| `quote` | QuoteScreen (route params) | Current quote data from API |
| `favorites` | AsyncStorage | Persisted saved quotes |

No global state management (Redux/Context) needed for MVP — all state is either local to screens or passed via navigation params.

---

## Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| **Network offline** | Check `NetInfo` before API call → show "No internet" toast |
| **API rate limit (429)** | Show "Too many requests, try in a minute" message |
| **API key invalid (401/403)** | Show setup instructions, link to env config |
| **Malformed JSON from Gemini** | Retry once with stricter prompt; if still fails, show fallback quote |
| **Empty mood input** | Disable button + show validation hint |
| **API timeout** | 15-second timeout → "Taking too long, please try again" |

---

## Security

- **API Key**: Stored in `.env`, loaded via `react-native-dotenv`, gitignored
- **No user data collected**: No auth, no analytics, no tracking
- **All data local**: Favorites stored only on device via AsyncStorage

> [!WARNING]
> The API key is bundled into the app binary in React Native. For production distribution beyond personal use, consider setting up a lightweight backend proxy to hide the key.
