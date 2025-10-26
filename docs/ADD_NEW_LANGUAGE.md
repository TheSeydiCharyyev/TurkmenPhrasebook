# How to Add a New Language to TurkmenPhrasebook

This guide provides step-by-step instructions for adding a new language to the app. Follow these steps exactly as they were done for English.

---

## Quick Checklist

- [ ] 1. Add language configuration
- [ ] 2. Add translations for all 305 phrases with transcription
- [ ] 3. Add English names to all categories (21) and subcategories (50)
- [ ] 4. Update type definitions
- [ ] 5. Update audio system
- [ ] 6. Update UI components
- [ ] 7. Update screens
- [ ] 8. Test the integration

---

## Step 1: Add Language Configuration

**File:** `src/config/languages.config.ts`

Add new language to the `languages` array:

```typescript
{
  code: 'fr',              // ISO 639-1 code (2 letters)
  name: 'Français',        // Native name
  nameEn: 'French',        // English name
  nameTk: 'Fransuz dili',  // Turkmen name
  flag: '🇫🇷',            // Emoji flag
  isAvailable: true,       // Set to true when ready
  hasTranscription: true,  // ALWAYS true - transcription needed for ALL languages
  ttsCode: 'fr-FR',        // TTS language code for Text-to-Speech
  direction: 'ltr'         // or 'rtl' for Arabic, Hebrew, etc.
}
```

---

## Step 2: Create Translation File

**File:** `src/data/languages/translations/{language}.ts`

Create a new file (e.g., `french.ts`) with all 305 phrases:

```typescript
// AUTO-GENERATED: French translations
// Generated: YYYY-MM-DDTHH:mm:ss.sssZ
// Total translations: 305
import { LanguageTranslation } from '../../../types';

export const frenchTranslations: LanguageTranslation[] = [
  {
    phraseId: "phrase_001",
    text: "Bonjour",
    transcription: "bon-zhoor"  // ⚠️ REQUIRED for ALL languages!
  },
  {
    phraseId: "phrase_002",
    text: "Merci",
    transcription: "mer-see"
  },
  // ... continue for all 305 phrases
];
```

**Export in:** `src/data/languages/index.ts`

```typescript
import { frenchTranslations } from './translations/french';

// Add to getTranslationsForLanguage function:
case 'fr':
  return frenchTranslations;
```

---

## Step 3: Add Language Names to Categories

**File:** `src/data/categories.ts`

### 3.1 Update ALL Subcategories (50 total)

Add `nameFr` field to each subcategory:

```typescript
{
  id: 'hotel_requests',
  parentId: 'hotel',
  nameRu: 'Просьбы',
  nameTk: 'Haýyşlar',
  nameZh: '请求',
  nameEn: 'Requests',
  nameFr: 'Demandes',  // ✅ ADD THIS
  icon: 'help-circle-outline',
  color: '#8B5CF6',
}
```

### 3.2 Update ALL Main Categories (21 total)

Add `nameFr` to each category:

```typescript
{
  id: 'greetings',
  nameRu: 'Приветствие',
  nameTk: 'Salamlaşmak',
  nameZh: '问候语',
  nameEn: 'Greetings',
  nameFr: 'Salutations',  // ✅ ADD THIS
  icon: 'person-outline',
  color: '#3B82F6',
}
```

---

## Step 4: Update Type Definitions

**File:** `src/types/index.ts`

Update `Category` and `SubCategory` interfaces:

```typescript
export interface Category {
  id: string;
  icon: string;
  color: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  nameEn: string;
  nameFr: string;  // ✅ ADD THIS
  hasSubcategories?: boolean;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  parentId: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  nameEn: string;
  nameFr: string;  // ✅ ADD THIS
  icon: string;
  color: string;
}
```

---

## Step 5: Update Audio System

### 5.1 Update AudioPlayer Component

**File:** `src/components/AudioPlayer.tsx`

```typescript
interface AudioPlayerProps {
  text: string;
  language: 'chinese' | 'turkmen' | 'russian' | 'english' | 'french';  // ✅ ADD
  audioPath?: string;
  label: string;
  style: 'primary' | 'secondary';
  size?: 'small' | 'large';
  disabled?: boolean;
}
```

### 5.2 Update useAudio Hook

**File:** `src/hooks/useAudio.ts`

Update type and TTS mapping:

```typescript
const playAudio = useCallback(async (
  text: string,
  language: 'chinese' | 'turkmen' | 'russian' | 'english' | 'french',  // ✅ ADD
  audioPath?: string
) => {
  // ...

  // TTS mapping
  let languageCode = 'en-US';
  if (language === 'chinese') {
    languageCode = 'zh-CN';
  } else if (language === 'russian') {
    languageCode = 'ru-RU';
  } else if (language === 'french') {
    languageCode = 'fr-FR';  // ✅ ADD THIS
  }
  // ...
});
```

### 5.3 Update AudioService

**File:** `src/services/AudioService.ts`

Same changes as in useAudio.ts:
- Add 'french' to type definition
- Add TTS language code mapping

**File:** `src/services/index.ts`

Update IAudioService interface:

```typescript
export interface IAudioService {
  play(text: string, language: 'chinese' | 'turkmen' | 'russian' | 'english' | 'french', audioPath?: string): Promise<void>;
  // ...
}
```

---

## Step 6: Update UI Components

### 6.1 CategoryCard Component

**File:** `src/components/CategoryCard.tsx`

```typescript
interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  languageMode: 'ru' | 'tk' | 'zh' | 'en' | 'fr';  // ✅ ADD 'fr'
}

const getCategoryNames = () => {
  // ... existing code ...

  } else if (languageMode === 'fr') {
    // ✅ ADD: French → Turkmen → Russian
    return {
      primary: category.nameFr,
      secondary: category.nameTk,
      tertiary: category.nameRu
    };
  }
  // ...
};
```

### 6.2 SubCategoryCard Component

**File:** `src/components/SubCategoryCard.tsx`

Add import and language logic:

```typescript
import { useConfig } from '../contexts/ConfigContext';

const getSubcategoryNames = () => {
  // ... existing code ...

  } else if (selectedLanguage === 'fr') {
    // ✅ ADD: French → Turkmen → Russian
    return {
      primary: subcategory.nameFr,
      secondary: subcategory.nameTk,
      tertiary: subcategory.nameRu
    };
  }
  // ...
};
```

---

## Step 7: Update Screens

### 7.1 HomeScreen

**File:** `src/screens/HomeScreen.tsx`

Update all type definitions and search placeholder:

```typescript
// Update types
const MinimalHeader = React.memo<{
  languageMode: 'ru' | 'tk' | 'zh' | 'en' | 'fr';  // ✅ ADD
  // ...
}>(({ ... }) => {
  // ...

  // Update search placeholder
  <Text style={styles.searchPlaceholder}>
    {languageMode === 'zh' ? '搜索短语...' :
     languageMode === 'tk' ? 'Sözlemleri gözle...' :
     languageMode === 'en' ? 'Search phrases...' :
     languageMode === 'fr' ? 'Rechercher...' :  // ✅ ADD
     'Поиск фраз...'}
  </Text>

  // Update title section
  <View style={styles.titleContainer}>
    <Text style={styles.titleTurkmen}>Kategoriýany saýlaň</Text>
    {languageMode === 'en' ? (
      <Text style={styles.titleChinese}>Select a category</Text>
    ) : languageMode === 'fr' ? (
      <Text style={styles.titleChinese}>Sélectionner une catégorie</Text>  // ✅ ADD
    ) : (
      <Text style={styles.titleChinese}>选择类别</Text>
    )}
    <Text style={styles.titleRussian}>Выберите категорию</Text>
  </View>
});

// Update CategoryPairItem
const CategoryPairItem = React.memo<{
  item: [Category, Category | undefined];
  onPress: (category: Category) => void;
  languageMode: 'ru' | 'tk' | 'zh' | 'en' | 'fr';  // ✅ ADD
}>(({ ... }) => { ... });

// Update CategoryGrid
interface CategoryGridProps {
  languageMode: 'ru' | 'tk' | 'zh' | 'en' | 'fr';  // ✅ ADD
}

// Update languageMode mapping
const languageMode: 'ru' | 'tk' | 'zh' | 'en' | 'fr' =
  selectedLanguage === 'zh' ? 'zh' :
  selectedLanguage === 'ru' ? 'ru' :
  selectedLanguage === 'en' ? 'en' :
  selectedLanguage === 'fr' ? 'fr' :  // ✅ ADD
  'tk';
```

### 7.2 CategoryScreen

**File:** `src/screens/CategoryScreen.tsx`

Add import and update category name display:

```typescript
import { useConfig } from '../contexts/ConfigContext';

// Inside component:
const { selectedLanguage } = useConfig();

// Update category name display
{selectedLanguage === 'en' ? (
  <>
    <Text style={styles.chineseCategoryTitle}>{category.nameEn}</Text>
    <Text style={styles.mainCategoryTitle}>{category.nameTk}</Text>
    <Text style={styles.phrasesCountTitle}>
      {category.nameRu} • {filteredPhrases.length} phrases
    </Text>
  </>
) : selectedLanguage === 'fr' ? (
  // ✅ ADD THIS
  <>
    <Text style={styles.chineseCategoryTitle}>{category.nameFr}</Text>
    <Text style={styles.mainCategoryTitle}>{category.nameTk}</Text>
    <Text style={styles.phrasesCountTitle}>
      {category.nameRu} • {filteredPhrases.length} phrases
    </Text>
  </>
) : selectedLanguage === 'zh' ? (
  // ... existing code
)}

// Update subcategory name mapping
const selectedSubcategoryName = selectedSubcategory
  ? (selectedLanguage === 'en' ? selectedSubcategory.nameEn :
     selectedLanguage === 'fr' ? selectedSubcategory.nameFr :  // ✅ ADD
     selectedLanguage === 'zh' ? selectedSubcategory.nameZh :
     selectedLanguage === 'ru' ? selectedSubcategory.nameRu :
     selectedSubcategory.nameTk)
  : null;

// Update language code mapping in PhraseItem
const getAudioLanguage = (langCode: string): 'chinese' | 'russian' | 'english' | 'french' => {
  if (langCode === 'zh') return 'chinese';
  if (langCode === 'ru') return 'russian';
  if (langCode === 'en') return 'english';
  if (langCode === 'fr') return 'french';  // ✅ ADD
  return 'english';
};
```

### 7.3 PhraseDetailScreen

**File:** `src/screens/PhraseDetailScreen.tsx`

This screen uses the multilingual system, so most changes are automatic. Only need to update:

```typescript
// Get French translation
const frenchTrans = getTranslationsForLanguage('fr').find(t => t.phraseId === phrase.id);

// Update main text logic
const getMainTextAndLanguage = () => {
  if (selectedLanguage === 'zh') {
    return { mainText: chineseTrans?.text || '', transcription: chineseTrans?.transcription, audioLanguage: 'chinese' as const };
  } else if (selectedLanguage === 'ru') {
    return { mainText: russianTrans?.text || '', transcription: russianTrans?.transcription, audioLanguage: 'russian' as const };
  } else if (selectedLanguage === 'en') {
    return { mainText: englishTrans?.text || '', transcription: englishTrans?.transcription, audioLanguage: 'english' as const };
  } else if (selectedLanguage === 'fr') {
    // ✅ ADD THIS
    return { mainText: frenchTrans?.text || '', transcription: frenchTrans?.transcription, audioLanguage: 'french' as const };
  }
  return { mainText: phrase.translation.text, transcription: phrase.translation.transcription, audioLanguage: 'english' as const };
};

// Add French to translation display section
{selectedLanguage === 'fr' && (
  // ✅ ADD: French → Turkmen → Russian order
  <>
    <View style={styles.translationRow}>
      <Text style={styles.languageLabel}>🇫🇷 Français:</Text>
      <Text style={[styles.translationText, styles.translationTextMain]}>
        {frenchTrans?.text || 'No translation'}
      </Text>
    </View>
    <View style={styles.translationRow}>
      <Text style={styles.languageLabel}>🇹🇲 Türkmençe:</Text>
      <Text style={styles.translationText}>{phrase.turkmen}</Text>
    </View>
    <View style={styles.translationRow}>
      <Text style={styles.languageLabel}>🇷🇺 Русский:</Text>
      <Text style={styles.translationText}>{russianTrans?.text || 'No translation'}</Text>
    </View>
  </>
)}
```

---

## Step 8: Testing Checklist

After completing all steps above, test the following:

### Visual Testing
- [ ] Home screen shows French category names (French → Turkmen → Russian)
- [ ] Home screen title shows "Sélectionner une catégorie" when French is selected
- [ ] Category screen shows French category name
- [ ] Subcategory cards show French names
- [ ] Phrase cards show French translation
- [ ] PhraseDetail screen shows French → Turkmen → Russian order

### Audio Testing
- [ ] French TTS works correctly (not robotic)
- [ ] Turkmen MP3 files play correctly
- [ ] Audio buttons have correct labels

### Data Testing
- [ ] All 305 phrases have French translations
- [ ] All 305 phrases have transcriptions (REQUIRED)
- [ ] All 21 categories have `nameFr`
- [ ] All 50 subcategories have `nameFr`

---

## Common Mistakes to Avoid

1. ❌ **Forgetting transcription** - ALL languages need transcription for ALL 305 phrases
2. ❌ **Inconsistent language order** - Always use: NewLanguage → Turkmen → Russian
3. ❌ **Missing category names** - Must add to ALL 21 categories + 50 subcategories
4. ❌ **Wrong TTS code** - Check correct locale code (e.g., 'fr-FR', 'es-ES', 'de-DE')
5. ❌ **Not updating all type definitions** - Every component that uses language types needs update

---

## Files Summary (Quick Reference)

### Configuration & Data (4 files)
1. `src/config/languages.config.ts` - Add language config
2. `src/data/languages/translations/{language}.ts` - Create translation file
3. `src/data/languages/index.ts` - Export translations
4. `src/data/categories.ts` - Add name{Lang} to categories/subcategories

### Types (1 file)
5. `src/types/index.ts` - Update Category & SubCategory interfaces

### Audio System (4 files)
6. `src/components/AudioPlayer.tsx` - Add language type
7. `src/hooks/useAudio.ts` - Add TTS mapping
8. `src/services/AudioService.ts` - Add TTS mapping
9. `src/services/index.ts` - Update IAudioService interface

### UI Components (2 files)
10. `src/components/CategoryCard.tsx` - Add language mode & name logic
11. `src/components/SubCategoryCard.tsx` - Add language logic

### Screens (3 files)
12. `src/screens/HomeScreen.tsx` - Add language mode, title, search placeholder
13. `src/screens/CategoryScreen.tsx` - Add category name display & audio mapping
14. `src/screens/PhraseDetailScreen.tsx` - Add translation fetch & display logic

**Total: 14 files to modify + 1 new translation file**

---

## Example: Adding German Language

Quick example for reference:

```typescript
// 1. languages.config.ts
{ code: 'de', name: 'Deutsch', nameEn: 'German', nameTk: 'Nemes dili', flag: '🇩🇪', isAvailable: true, hasTranscription: true, ttsCode: 'de-DE', direction: 'ltr' }

// 2. Create german.ts with 305 translations
export const germanTranslations: LanguageTranslation[] = [
  { phraseId: "phrase_001", text: "Hallo", transcription: "ha-lo" },
  // ... all 305 phrases
];

// 3. Add nameDe to all categories
{ id: 'greetings', nameRu: '...', nameTk: '...', nameZh: '...', nameEn: '...', nameDe: 'Grüße', ... }

// 4. Update types: add nameDe: string to Category & SubCategory

// 5. Audio: add 'german' type and 'de-DE' TTS code

// 6-14. Update all components following the pattern above
```

---

## Notes

- This process was successfully completed for English language
- Follow the exact same pattern for any new language
- Translation quality should be verified by a native speaker
- Transcription is MANDATORY for all languages to ensure consistency
- Always test audio before marking language as available

---

**Created:** 2025-10-26
**Last Updated:** 2025-10-26
**Based on:** English language integration
