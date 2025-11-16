# 🔧 Translation Verification Scripts

**Budget:** $0 (100% FREE)
**API:** MyMemory Translation API (1000 requests/day)

---

## 📋 Quick Start

### 1. Install Dependencies (if needed)
```bash
cd TurkmenPhrasebook
npm install
```

**Note:** The script uses only built-in Node.js modules (`fs`, `path`) and native `fetch` API (Node 18+). No external dependencies required! ✅

---

### 2. Prepare Your Phrases

The script expects phrases in JSON format. You have two options:

#### Option A: Create `src/data/phrases.json` (Recommended)
```json
[
  {
    "id": 1,
    "categoryId": "greetings",
    "english": "Hello",
    "tk": "Salam",
    "zh": "你好",
    "ru": "Привет",
    "ja": "こんにちは",
    "tr": "Merhaba"
  },
  {
    "id": 2,
    "categoryId": "greetings",
    "english": "Good morning",
    "tk": "Ertiriňiz haýyrly bolsun",
    "zh": "早上好",
    "ru": "Доброе утро",
    "ja": "おはようございます",
    "tr": "Günaydın"
  }
]
```

#### Option B: Update Script to Parse `phrases.ts`
The script can be modified to directly parse your TypeScript phrases file.

---

### 3. Run Verification

```bash
# Verify a single language
node scripts/verifyTranslations.js [language_code]

# Examples:
node scripts/verifyTranslations.js tr   # Turkish
node scripts/verifyTranslations.js ja   # Japanese
node scripts/verifyTranslations.js de   # German
```

---

### 4. Review Results

After running, check the generated report:
```bash
# Report location
reviews/[language_code]_verification.json

# Example
reviews/tr_verification.json
reviews/ja_verification.json
```

**Report Format:**
```json
{
  "language": "Turkish",
  "languageCode": "tr",
  "timestamp": "2025-11-16T10:30:00.000Z",
  "summary": {
    "total": 305,
    "verified": 245,
    "needsReview": 45,
    "errors": 15,
    "verificationRate": "80.3%"
  },
  "results": [
    {
      "phraseId": 1,
      "category": "greetings",
      "english": "Hello",
      "current": "Merhaba",
      "myMemory": "Merhaba",
      "match": true,
      "status": "verified",
      "confidence": 1.0
    },
    {
      "phraseId": 2,
      "category": "emergency",
      "english": "I need a doctor",
      "current": "Doktora ihtiyacım var",
      "myMemory": "Bir doktora ihtiyacım var",
      "match": false,
      "status": "needs_review",
      "confidence": 0.85
    }
  ]
}
```

---

## 📊 Understanding Results

### Status Types:

**✅ verified:**
- Current translation matches MyMemory translation
- No action needed (but still review critical phrases manually!)

**⚠️ needs_review:**
- Current and MyMemory translations differ
- **Action:** Review manually, decide which is better
- Focus on Emergency & Medical categories first

**❌ error:**
- API request failed
- **Action:** Retry or verify manually

---

## 🎯 Recommended Workflow

### Phase 1: Automated Verification (Week 1)
```bash
# Verify GROUP 1 languages (Critical)
node scripts/verifyTranslations.js tr  # Turkish
node scripts/verifyTranslations.js ja  # Japanese
node scripts/verifyTranslations.js ko  # Korean
node scripts/verifyTranslations.js de  # German
node scripts/verifyTranslations.js fr  # French
node scripts/verifyTranslations.js es  # Spanish
node scripts/verifyTranslations.js it  # Italian
node scripts/verifyTranslations.js ar  # Arabic
```

**Tip:** Verify 1-2 languages per day to respect API limits (1000 requests/day).

---

### Phase 2: Manual Review (Weeks 2-3)

For each language:
1. Open `reviews/[lang]_verification.json`
2. Filter phrases with `"status": "needs_review"`
3. Review with Claude/ChatGPT:
   - Focus on Emergency category first
   - Then Medical category
   - Then other flagged phrases
4. Update `src/data/phrases.ts` if needed
5. Mark language as verified in `VERIFICATION_PROGRESS.md`

---

### Phase 3: Verify Remaining Languages (Week 4+)

```bash
# GROUP 2 languages
node scripts/verifyTranslations.js th  # Thai
node scripts/verifyTranslations.js vi  # Vietnamese
# ... etc

# GROUP 3 languages
node scripts/verifyTranslations.js uz  # Uzbek
node scripts/verifyTranslations.js kk  # Kazakh
# ... etc
```

---

## ⚠️ API Rate Limits

**MyMemory API (Free):**
- **Limit:** 1000 requests per day
- **Our needs:** 305 phrases per language
- **Max languages per day:** ~3 languages

**Tips:**
- Verify 1-2 languages per day
- Script has 500ms delay between requests
- If you hit the limit, wait 24 hours or use manual verification

---

## 🔧 Script Features

✅ **100% Free** - No API keys needed
✅ **No external dependencies** - Uses built-in Node.js modules
✅ **Rate limiting** - 500ms delay between requests
✅ **Detailed reports** - JSON format for easy review
✅ **Progress tracking** - See verification rate for each language
✅ **Error handling** - Retries and graceful failures

---

## 📝 Available Languages

Run without arguments to see all available languages:
```bash
node scripts/verifyTranslations.js
```

**Output:**
```
Available languages:
   ja    - Japanese             (HIGH)
   ko    - Korean               (HIGH)
   tr    - Turkish              (HIGH)
   de    - German               (HIGH)
   fr    - French               (HIGH)
   es    - Spanish              (HIGH)
   it    - Italian              (HIGH)
   ar    - Arabic               (HIGH)
   th    - Thai                 (MEDIUM)
   vi    - Vietnamese           (MEDIUM)
   ... etc
```

---

## 🐛 Troubleshooting

### Error: "No phrases loaded!"
**Solution:** Create `src/data/phrases.json` or update script to parse `phrases.ts`

### Error: "Language not found!"
**Solution:** Check language code is in the supported list (run script without args)

### Error: "API request failed"
**Solutions:**
- Check internet connection
- Wait if you hit rate limit (1000/day)
- Retry in a few minutes

### Low verification rate (<70%)
**Normal!** This means:
- Translations might have different phrasing (both could be correct)
- Need manual review to pick the best one
- Focus on critical categories first

---

## 💡 Tips for Manual Review

When reviewing flagged phrases:

### ✅ Good Translation Qualities:
- Grammatically correct
- Culturally appropriate
- Contextually accurate
- Proper formality level (polite for travel phrases)
- Natural phrasing

### ❌ Red Flags:
- Literal word-for-word translation (sounds unnatural)
- Wrong formality level (too casual or too formal)
- Missing cultural context
- Grammar errors
- Offensive or inappropriate

### Example Review:
```
English: "Where is the bathroom?"
Context: Polite request in public place

Current: "トイレはどこですか？" (Toire wa doko desu ka?)
MyMemory: "お手洗いはどこですか？" (Otearai wa doko desu ka?)

Analysis:
- Both are grammatically correct
- Both are polite
- "トイレ" = toilet (common, direct)
- "お手洗い" = restroom (polite, euphemism)

Decision: Keep current "トイレ"
Reason: More commonly used, travelers understand it better
```

---

## 📞 Need Help?

1. **Read:** `TRANSLATION_VERIFICATION_PLAN.md` - Full verification plan
2. **Track:** `VERIFICATION_PROGRESS.md` - See progress and next steps
3. **Ask:** Claude Code (me!) - I can help review translations! 👋

---

**Happy Verifying! 🚀**
