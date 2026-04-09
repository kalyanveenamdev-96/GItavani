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
  "explanation": "<2-3 sentences explaining how this verse relates to the user's current mood and what wisdom they can draw from it>"
}

Rules:
- The verse MUST be an actual, real verse from the Bhagavad Gita
- The translation should be accurate and easy to understand
- The explanation should be warm, compassionate, and personally relevant to someone feeling "${mood}"
- Respond ONLY with valid JSON, no markdown or extra text
`;

// API key is hardcoded for test/personal use
let API_KEY = 'AIzaSyCNCfR0KIbMvDcIK2v5nqxdsNZQgYLYYAk';

export const setApiKey = (key) => {
    // Keeping this for potential future use (e.g. if user wants to change it)
    API_KEY = key;
};

export const getApiKey = () => API_KEY;

export const getGitaQuote = async (mood) => {
    if (!API_KEY) {
        return {
            success: false,
            error: 'API key not set. Please add your Gemini API key in Settings.',
        };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
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
            if (response.status === 429) {
                return {
                    success: false,
                    error: 'Too many requests. The Free Tier of Gemini has a limit of 15 requests per minute. Please try again in 30 seconds.'
                };
            }
            if (response.status === 401 || response.status === 403) {
                return { success: false, error: 'Invalid API key. Please check your Gemini API key.' };
            }
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
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return { success: false, error: 'Request timed out. Please check your connection and try again.' };
        }
        if (error.message?.includes('JSON')) {
            return { success: false, error: 'Failed to parse response. Please try again.' };
        }
        return { success: false, error: error.message || 'Something went wrong. Please try again.' };
    }
};
