# 📚 How to Add a New Language to TurkmenPhrasebook

This guide explains how to quickly add a new language to the application's interface.

## Overview

The app supports two types of language settings:
1. **Interface Language** - The language of all UI elements (buttons, menus, titles, etc.)
2. **Phrasebook Language Pair** - The languages shown in the phrasebook content (e.g., Chinese-Turkmen, Russian-Turkmen)

This guide covers adding a new **Interface Language**.

---

## Step-by-Step Guide

### 1. Update Language Types

**File:** `src/contexts/LanguageContext.tsx`

Add your new language code to the `AppLanguageMode` type:

```typescript
// Example: Adding French (fr)
export type AppLanguageMode = 'tk' | 'zh' | 'ru' | 'en' | 'fr';
```

### 2. Add Language Configuration

**File:** `src/config/languages.config.ts`

Add your language to the `LANGUAGES` array with `isAvailable: true`:

```typescript
{
  code: 'fr',                    // ISO 639-1 language code
  name: 'Français',              // Native name
  nameEn: 'French',              // English name
  nameTk: 'Fransuz dili',        // Turkmen name
  flag: '🇫🇷',                   // Flag emoji
  isAvailable: true,             // Set to true to enable
  hasTranscription: false,       // Does this language need transcription?
  ttsCode: 'fr-FR',             // Text-to-speech language code
  direction: 'ltr'               // 'ltr' (left-to-right) or 'rtl' (right-to-left)
},
```

### 3. Add Interface Translations

**File:** `src/contexts/LanguageContext.tsx`

Add translations for all UI text in the `INTERFACE_TEXTS` object:

```typescript
const INTERFACE_TEXTS: Record<AppLanguageMode, InterfaceTexts> = {
  // ... existing languages
  fr: {
    // Main Hub Module Titles
    phrasebookTitle: 'Livre de phrases',
    phrasebookSubtitle: 'Catégories essentielles',
    visualTranslatorTitle: 'Traducteur visuel',
    visualTranslatorSubtitle: 'Traduire avec appareil photo',
    textTranslatorTitle: 'Traducteur de texte',
    textTranslatorSubtitle: 'Traduction instantanée',
    dictionaryTitle: 'Dictionnaire',
    dictionarySubtitle: 'Bientôt disponible',
    aiAssistantsTitle: 'Assistants IA',
    aiAssistantsSubtitle: 'Aide linguistique intelligente',
    myFavoritesTitle: 'Mes favoris',
    myFavoritesSubtitle: 'Phrases enregistrées',

    // Main Interface
    appTitle: 'Livre de phrases turkmène',
    appSubtitle: 'Apprenez le turkmène facilement',
    selectCategory: 'Choisissez une catégorie',

    // Navigation
    home: 'Accueil',
    favorites: 'Favoris',
    search: 'Rechercher',
    settings: 'Paramètres',

    // Common Actions
    back: 'Retour',
    done: 'Terminé',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    share: 'Partager',
    edit: 'Modifier',

    // ... add all other required translations
    // (See existing translations for complete list)
  }
};
```

**Important:** Make sure to add translations for ALL fields in the `InterfaceTexts` interface. Missing translations will cause TypeScript errors.

### 4. Update Language-Specific Functions

You'll need to update several helper functions that handle language-specific text:

#### A. Voice Search Component

**File:** `src/components/VoiceSearch.tsx`

Add translations for voice search UI:

```typescript
const texts = {
  // ... existing languages
  fr: {
    tapToSpeak: 'Appuyez pour parler',
    listening: 'Écoute...',
    processing: 'Traitement...',
    speak: 'Parler',
    stop: 'Arrêter',
    permission: 'Permission du microphone refusée',
    error: 'Erreur de reconnaissance vocale',
    noSpeech: 'Aucune parole détectée',
    tryAgain: 'Réessayer',
  }
};
```

Add language code for speech recognition:

```typescript
const codes = {
  // ... existing languages
  fr: 'fr-FR',
};
```

#### B. Advanced Search Screen

**File:** `src/screens/AdvancedSearchScreen.tsx`

Update the `getText` callback:

```typescript
const texts: Record<'tk' | 'zh' | 'ru' | 'en' | 'fr', Record<TextKey, string>> = {
  // ... existing languages
  fr: {
    searchPlaceholder: 'Rechercher...',
    searchResults: 'Résultats de recherche',
    noResults: 'Aucun résultat trouvé',
    suggestions: 'Suggestions',
    filters: 'Filtres',
    clearFilters: 'Effacer',
    voiceSearch: 'Recherche vocale',
  }
};
```

#### C. TTS Checker (Text-to-Speech)

**File:** `src/utils/TTSChecker.ts`

Update the `getRecommendations` method parameter type and add a case for your language:

```typescript
static async getRecommendations(languageMode: 'tk' | 'zh' | 'ru' | 'en' | 'fr'): Promise<{
  title: string;
  message: string;
  showWarning: boolean;
  instructions?: string[];
}> {
  // ... existing code

  } else if (languageMode === 'fr') {
    // French interface - check French voices
    if (!result.hasFrenchVoice) {  // You may need to add French voice check
      return {
        title: '⚠️ Pas de voix française',
        message: 'Internet requis pour les phrases',
        showWarning: true,
        instructions: Platform.OS === 'android' ? [
          '1. Ouvrez les paramètres',
          '2. "Système" → "Langue et saisie"',
          '3. "Synthèse vocale" → "Sélectionner la langue"',
          '4. Téléchargez le français',
        ] : [
          '1. Ouvrez les paramètres',
          '2. "Accessibilité"',
          '3. "Contenu vocal"',
          '4. Ajoutez le français',
        ]
      };
    }

    return {
      title: '✅ Toutes les voix disponibles',
      message: 'La synthèse vocale est prête',
      showWarning: false,
    };
  }
}
```

#### D. Other UI Components

Update type annotations in these files:

- `src/components/TTSWarningModal.tsx` - Line 24
- `src/components/FontSizeModal.tsx` - Line 13
- `src/screens/SearchScreen.tsx` - Lines 71, 168
- `src/data/categories.ts` - Lines 833, 845

Change type from `'tk' | 'zh' | 'ru' | 'en'` to include your new language.

### 5. Update Language Context Logic

**File:** `src/contexts/LanguageContext.tsx`

Update the `createConfig` function to handle your new language mode:

```typescript
const createConfig = (mode: AppLanguageMode): AppLanguageConfig => {
  let primaryLanguage: 'tk' | 'zh' = 'tk';
  let learningLanguage: 'tk' | 'zh' = 'zh';

  if (mode === 'tk') {
    primaryLanguage = 'tk';
    learningLanguage = 'zh';
  } else if (mode === 'zh') {
    primaryLanguage = 'zh';
    learningLanguage = 'tk';
  }
  // For 'ru', 'en', 'fr', etc., use defaults (tk-zh)

  return {
    mode,
    primaryLanguage,
    learningLanguage,
    helperLanguage: 'ru',
    version: LANGUAGE_VERSION
  };
};
```

Also update the `validateConfig` function:

```typescript
const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh', 'ru', 'en', 'fr'].includes(config.mode) &&  // Add your language here
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    ['ru', 'zh', 'en'].includes(config.helperLanguage || 'ru') &&
    typeof config.version === 'string'
  );
};
```

### 6. Run TypeScript Check

After making all changes, verify there are no type errors:

```bash
npx tsc --noEmit
```

Fix any TypeScript errors related to missing translations or type mismatches.

### 7. Test Your New Language

1. Start the app in development mode
2. Go to Settings
3. Select your new language from Language Selection
4. Verify all UI text appears correctly
5. Test navigation, buttons, and all features

---

## Quick Checklist

Use this checklist to ensure you haven't missed any steps:

- [ ] Added language code to `AppLanguageMode` type
- [ ] Added language to `languages.config.ts` with `isAvailable: true`
- [ ] Added complete translations to `INTERFACE_TEXTS` in `LanguageContext.tsx`
- [ ] Updated `VoiceSearch.tsx` with language texts and speech code
- [ ] Updated `AdvancedSearchScreen.tsx` with search-related texts
- [ ] Updated `TTSChecker.ts` with TTS recommendations
- [ ] Updated type annotations in:
  - [ ] `TTSWarningModal.tsx`
  - [ ] `FontSizeModal.tsx`
  - [ ] `SearchScreen.tsx`
  - [ ] `categories.ts`
- [ ] Updated `createConfig` function in `LanguageContext.tsx`
- [ ] Updated `validateConfig` function in `LanguageContext.tsx`
- [ ] Ran `npx tsc --noEmit` - no errors
- [ ] Tested the new language in the app

---

## Common Issues

### TypeScript Error: "Property does not exist"

**Problem:** Missing translation key in `INTERFACE_TEXTS`

**Solution:** Check the `InterfaceTexts` interface and add all required fields

### Language Not Appearing in Selection Screen

**Problem:** `isAvailable` is set to `false` or language not in `getAvailableLanguages()`

**Solution:** Set `isAvailable: true` in `languages.config.ts`

### Voice Search Not Working

**Problem:** Missing language code in `VoiceSearch.tsx`

**Solution:** Add your language code to the `codes` object (e.g., `fr: 'fr-FR'`)

---

## Example: Adding German (de)

Here's a complete example of adding German as an interface language:

```typescript
// 1. src/contexts/LanguageContext.tsx
export type AppLanguageMode = 'tk' | 'zh' | 'ru' | 'en' | 'de';

// 2. src/config/languages.config.ts
{
  code: 'de',
  name: 'Deutsch',
  nameEn: 'German',
  nameTk: 'Nemes dili',
  flag: '🇩🇪',
  isAvailable: true,
  hasTranscription: false,
  ttsCode: 'de-DE',
  direction: 'ltr'
},

// 3. src/contexts/LanguageContext.tsx - INTERFACE_TEXTS
de: {
  phrasebookTitle: 'Sprachführer',
  phrasebookSubtitle: 'Wichtige Kategorien',
  // ... (add all other translations)
}

// 4. src/components/VoiceSearch.tsx
de: {
  tapToSpeak: 'Tippen Sie zum Sprechen',
  listening: 'Zuhören...',
  // ... (add all voice search texts)
}

// 5. Update all type annotations to include 'de'
```

---

## Need Help?

If you encounter issues:

1. Check TypeScript errors with `npx tsc --noEmit`
2. Compare your additions with existing language implementations (e.g., English)
3. Ensure all required interface properties are translated
4. Test in the app to verify UI appears correctly

---

## Notes

- **Phrasebook Content:** This guide covers UI language only. To add content for the phrasebook itself (e.g., French-Turkmen phrasebook), you'll need to create translation files in `src/data/languages/` directory.
- **RTL Languages:** For right-to-left languages (Arabic, Persian, etc.), set `direction: 'rtl'` and ensure UI components support RTL layout.
- **Transcription:** If your language needs transcription (like Chinese pinyin), set `hasTranscription: true` and ensure phrase data includes transcription fields.

---

**Last Updated:** January 2025
**Version:** 1.0
