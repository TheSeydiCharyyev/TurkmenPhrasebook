# 🌐 USEFUL FREE APIs FOR TURKMENPHRASEBOOK

**Source:** https://github.com/public-apis/public-apis
**Date:** November 6, 2025
**Status:** Analyzed and curated for TurkmenPhrasebook app

---

## 📋 TABLE OF CONTENTS

1. [Dictionaries](#-dictionaries)
2. [Currency Conversion](#-currency-conversion)
3. [Geolocation & Maps](#-geolocation--maps)
4. [Food & Dining](#-food--dining)
5. [Weather](#-weather)
6. [Transportation](#-transportation)
7. [Speech & TTS](#-speech--tts)
8. [Implementation Examples](#-implementation-examples)
9. [Priority Recommendations](#-priority-recommendations)

---

## 📚 DICTIONARIES

### ⭐⭐⭐⭐⭐ Free Dictionary API
- **Description:** Definitions, phonetics, pronunciations, parts of speech, examples, synonyms
- **Auth:** NO (no registration required!)
- **HTTPS:** Yes
- **CORS:** Unknown
- **Free Tier:** Unlimited
- **Link:** https://dictionaryapi.dev/
- **Languages:** ⚠️ **English ONLY** (no Turkmen support)

**Example:**
```javascript
const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
const data = await response.json();
console.log(data[0].meanings); // Definitions, examples, synonyms
```

**Use Case:** Dictionary module for English words

---

### ⭐⭐⭐⭐ Wiktionary API
- **Description:** Collaborative dictionary data
- **Auth:** NO
- **HTTPS:** Yes
- **CORS:** Yes
- **Free Tier:** Unlimited
- **Link:** https://en.wiktionary.org/w/api.php
- **Languages:** Multiple languages including Turkmen

**Example:**
```javascript
const response = await fetch(
  'https://en.wiktionary.org/w/api.php?action=query&titles=salam&prop=extracts&format=json'
);
```

**Use Case:** Multi-language dictionary with Turkmen support

---

### ⭐⭐⭐⭐ Merriam-Webster
- **Description:** Dictionary and thesaurus data
- **Auth:** apiKey (free registration)
- **HTTPS:** Yes
- **CORS:** Unknown
- **Free Tier:** 1,000 requests/day
- **Link:** https://dictionaryapi.com/

**Use Case:** High-quality English definitions

---

### ⭐⭐⭐⭐ Words API
- **Description:** Definitions and synonyms for 150,000+ words
- **Auth:** apiKey (free registration)
- **HTTPS:** Yes
- **CORS:** Yes
- **Free Tier:** 2,500 requests/day
- **Link:** https://www.wordsapi.com/

**Use Case:** Extended vocabulary database

---

### ⭐⭐⭐ Lingua Robot
- **Description:** Word definitions, pronunciations, synonyms, antonyms
- **Auth:** apiKey
- **HTTPS:** Yes
- **CORS:** Yes
- **Link:** https://www.linguarobot.io

---

### ⭐⭐⭐ OwlBot
- **Description:** Definitions with example sentences and photos
- **Auth:** apiKey
- **HTTPS:** Yes
- **CORS:** Yes
- **Link:** https://owlbot.info/

---

## 💱 CURRENCY CONVERSION

### ⭐⭐⭐⭐⭐ Frankfurter
- **Description:** Exchange rates, currency conversion and time series
- **Auth:** NO (no API key required!)
- **HTTPS:** Yes
- **CORS:** Yes
- **Free Tier:** Unlimited, no rate limits
- **Link:** https://www.frankfurter.app/docs

**Example:**
```javascript
// Get current exchange rates
const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=CNY,TMT');
const rates = await response.json();
console.log(rates.rates); // { CNY: 7.2, TMT: 3.5 }

// Convert amount
const convert = await fetch('https://api.frankfurter.app/latest?amount=100&from=USD&to=TMT');
const result = await convert.json();
console.log(result.rates.TMT); // Converted amount
```

**Use Case:** Money/Banking category in phrasebook, real-time currency conversion

---

### ⭐⭐⭐⭐⭐ Currency-API
- **Description:** Free Currency Exchange Rates with 150+ Currencies & No Rate Limits
- **Auth:** NO
- **HTTPS:** Yes
- **CORS:** Yes
- **Free Tier:** Unlimited
- **Link:** https://github.com/fawazahmed0/currency-api

**Example:**
```javascript
const response = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/tmt.json');
```

**Use Case:** Alternative to Frankfurter, backup option

---

### ⭐⭐⭐ Exchangerate-API
- **Description:** Free currency conversion
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** 1,500 requests/month
- **Link:** https://www.exchangerate-api.com

---

### ⭐⭐⭐ Fixer
- **Description:** Current and historical foreign exchange rates
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** 100 requests/month
- **Link:** https://fixer.io

---

## 🗺️ GEOLOCATION & MAPS

### ⭐⭐⭐⭐⭐ REST Countries
- **Description:** Information about countries (flags, currencies, languages, capitals)
- **Auth:** NO
- **HTTPS:** Yes
- **CORS:** Yes
- **Free Tier:** Unlimited
- **Link:** https://restcountries.com

**Example:**
```javascript
// Get country information
const response = await fetch('https://restcountries.com/v3.1/alpha/tm'); // Turkmenistan
const country = await response.json();
console.log({
  name: country[0].name.common,
  flag: country[0].flag, // 🇹🇲
  currencies: country[0].currencies, // TMT
  languages: country[0].languages, // tk, ru
  capital: country[0].capital // Ashgabat
});

// Get all countries
const allCountries = await fetch('https://restcountries.com/v3.1/all');
```

**Use Case:** Language selection screen, country information, flags

---

### ⭐⭐⭐⭐ Nominatim (OpenStreetMap)
- **Description:** Worldwide forward/reverse geocoding
- **Auth:** NO
- **HTTPS:** Yes
- **CORS:** Yes
- **Free Tier:** Fair usage policy
- **Link:** https://nominatim.org/

**Example:**
```javascript
// Reverse geocode (coordinates to address)
const response = await fetch(
  'https://nominatim.openstreetmap.org/reverse?lat=37.9601&lon=58.3261&format=json'
);
const place = await response.json();
console.log(place.display_name); // "Ashgabat, Turkmenistan"
```

**Use Case:** Context-aware phrase suggestions based on location

---

### ⭐⭐⭐ Google Maps
- **Description:** Digital maps based on Google Maps data
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** $200/month credit
- **Link:** https://developers.google.com/maps/

---

### ⭐⭐⭐ Mapbox
- **Description:** Create/customize beautiful digital maps
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** 50,000 requests/month
- **Link:** https://docs.mapbox.com/

---

## 🍔 FOOD & DINING

### ⭐⭐⭐⭐ TheMealDB
- **Description:** Meal recipes database
- **Auth:** apiKey (free)
- **HTTPS:** Yes
- **Free Tier:** Yes
- **Link:** https://www.themealdb.com/api.php

**Example:**
```javascript
// Search meals by name
const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.s=kebab');
const meals = await response.json();

// Get meal by ID
const meal = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772');
```

**Use Case:** Food category phrases, dish names, recipes

---

### ⭐⭐⭐ Open Food Facts
- **Description:** Food products database
- **Auth:** NO
- **HTTPS:** Yes
- **Free Tier:** Unlimited
- **Link:** https://world.openfoodfacts.org/data

**Use Case:** Food/shopping categories, product information

---

### ⭐⭐⭐ Spoonacular
- **Description:** Recipes, food products, meal planning
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** 150 requests/day
- **Link:** https://spoonacular.com/food-api

---

### ⭐⭐⭐ Open Brewery DB
- **Description:** Breweries, cideries and craft beer bottle shops
- **Auth:** NO
- **HTTPS:** Yes
- **Free Tier:** Unlimited
- **Link:** https://www.openbrewerydb.org

---

## 🌤️ WEATHER

### ⭐⭐⭐ Weatherstack
- **Description:** Real-time weather information in JSON format
- **Auth:** apiKey (free registration)
- **HTTPS:** Yes (paid plans only)
- **Free Tier:** 1,000 requests/month
- **Link:** https://weatherstack.com/

**Example:**
```javascript
const response = await fetch(
  'http://api.weatherstack.com/current?access_key=YOUR_KEY&query=Ashgabat'
);
const weather = await response.json();
console.log({
  temp: weather.current.temperature,
  description: weather.current.weather_descriptions[0]
});
```

**Use Case:** Weather category, context-aware suggestions

---

## ✈️ TRANSPORTATION

### ⭐⭐⭐ Aviationstack
- **Description:** Real-time flight status and global aviation data
- **Auth:** apiKey
- **HTTPS:** Yes (paid plans only)
- **Free Tier:** 500 requests/month
- **Link:** https://aviationstack.com/

**Example:**
```javascript
const response = await fetch(
  'http://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&flight_iata=TK1'
);
```

**Use Case:** Transportation category, flight information

---

## 🔊 SPEECH & TTS

### ⭐⭐⭐ IBM Text to Speech
- **Description:** Convert text to speech
- **Auth:** apiKey
- **HTTPS:** Yes
- **CORS:** Yes
- **Free Tier:** 500 minutes/month
- **Link:** https://cloud.ibm.com/docs/text-to-speech/

**Example:**
```javascript
const response = await fetch('https://api.us-south.text-to-speech.watson.cloud.ibm.com/v1/synthesize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('apikey:YOUR_API_KEY')
  },
  body: JSON.stringify({
    text: 'Hello',
    voice: 'en-US_AllisonV3Voice'
  })
});
```

**Use Case:** Alternative TTS for phrases (instead of expo-speech)

---

## 💻 IMPLEMENTATION EXAMPLES

### Example 1: Combined Dictionary Service
```typescript
// src/services/DictionaryService.ts

export class DictionaryService {
  // Free Dictionary API (English only)
  static async searchEnglish(word: string) {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();
      return {
        word: data[0].word,
        phonetic: data[0].phonetic,
        meanings: data[0].meanings,
        audio: data[0].phonetics[0]?.audio,
        source: 'Free Dictionary'
      };
    } catch (error) {
      console.error('Free Dictionary error:', error);
      return null;
    }
  }

  // Wiktionary API (Multiple languages)
  static async searchWiktionary(word: string) {
    try {
      const response = await fetch(
        `https://en.wiktionary.org/w/api.php?action=query&titles=${word}&prop=extracts&format=json&origin=*`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Wiktionary error:', error);
      return null;
    }
  }

  // Combined search
  static async search(word: string, language: string = 'en') {
    if (language === 'en') {
      return await this.searchEnglish(word);
    } else {
      return await this.searchWiktionary(word);
    }
  }
}
```

---

### Example 2: Currency Converter
```typescript
// src/services/CurrencyService.ts

export class CurrencyService {
  // Frankfurter API (No API key needed!)
  static async convert(amount: number, from: string, to: string) {
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
      );
      const data = await response.json();
      return {
        amount: amount,
        from: from,
        to: to,
        rate: data.rates[to],
        converted: data.rates[to],
        date: data.date
      };
    } catch (error) {
      console.error('Currency converter error:', error);
      return null;
    }
  }

  // Get all rates for a currency
  static async getRates(baseCurrency: string = 'USD') {
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?from=${baseCurrency}`
      );
      const data = await response.json();
      return {
        base: data.base,
        date: data.date,
        rates: data.rates
      };
    } catch (error) {
      console.error('Get rates error:', error);
      return null;
    }
  }
}

// Usage in Money Category
const CurrencyScreen = () => {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    CurrencyService.convert(100, 'USD', 'TMT').then(result => {
      setRate(result);
    });
  }, []);

  return (
    <View>
      <Text>100 USD = {rate?.converted} TMT</Text>
      <Text>Rate: {rate?.rate}</Text>
    </View>
  );
};
```

---

### Example 3: Country Information
```typescript
// src/services/CountryService.ts

export class CountryService {
  // REST Countries API
  static async getCountryInfo(code: string) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${code}`
      );
      const data = await response.json();
      const country = data[0];

      return {
        name: country.name.common,
        nativeName: country.name.native,
        flag: country.flag,
        currencies: Object.keys(country.currencies || {}),
        languages: Object.values(country.languages || {}),
        capital: country.capital?.[0],
        region: country.region,
        population: country.population
      };
    } catch (error) {
      console.error('Country info error:', error);
      return null;
    }
  }

  // Get all countries
  static async getAllCountries() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      return data.map(country => ({
        code: country.cca2,
        name: country.name.common,
        flag: country.flag
      }));
    } catch (error) {
      console.error('Get all countries error:', error);
      return [];
    }
  }
}
```

---

## 🎯 PRIORITY RECOMMENDATIONS

### IMPLEMENT NOW (High Priority)

#### 1. **Frankfurter API** - Currency Conversion ⭐⭐⭐⭐⭐
- ✅ NO API key required
- ✅ Unlimited free requests
- ✅ Perfect for Money category
- **Time to implement:** 1-2 hours

#### 2. **REST Countries API** - Country Information ⭐⭐⭐⭐⭐
- ✅ NO API key required
- ✅ Unlimited free requests
- ✅ Useful for language selection
- **Time to implement:** 1 hour

#### 3. **Free Dictionary API** - English Dictionary ⭐⭐⭐⭐
- ✅ NO API key required
- ✅ High-quality data
- ⚠️ English only
- **Time to implement:** 2-3 hours

---

### CONSIDER LATER (Medium Priority)

#### 4. **TheMealDB** - Food Database ⭐⭐⭐
- Requires free API key
- Useful for Food category
- **Time to implement:** 2 hours

#### 5. **Weatherstack** - Weather Data ⭐⭐⭐
- Requires free API key
- 1,000 requests/month free
- Useful for Weather category
- **Time to implement:** 2 hours

#### 6. **Nominatim** - Geocoding ⭐⭐⭐
- NO API key required
- Context-aware suggestions
- **Time to implement:** 3-4 hours

---

### OPTIONAL (Low Priority)

#### 7. **IBM Text to Speech** - Alternative TTS ⭐⭐
- Requires API key
- 500 minutes/month free
- Use only if expo-speech insufficient
- **Time to implement:** 4-5 hours

#### 8. **Words API** - Extended Dictionary ⭐⭐⭐
- Requires API key
- 2,500 requests/day free
- Use for advanced dictionary features
- **Time to implement:** 2-3 hours

---

## 🚫 NOT RECOMMENDED / ISSUES

### ❌ Free Dictionary API for Turkmen
- **Issue:** Only supports English language
- **Alternative:** Use Webonary or create custom dictionary

### ❌ Oxford Dictionary API
- **Issue:** Sandbox tier only allows first letter of alphabet
- **Issue:** Paid plans required for full access
- **Alternative:** Free Dictionary API for English, Webonary for Turkmen

---

## 📊 COST ANALYSIS

### FREE (No API Key Required)
- **Frankfurter** - Currency conversion
- **Currency-API** - Alternative currency
- **REST Countries** - Country information
- **Free Dictionary** - English dictionary
- **Wiktionary** - Multi-language dictionary
- **Nominatim** - Geocoding
- **Open Food Facts** - Food database
- **Open Brewery DB** - Breweries

**Total Monthly Cost:** $0

---

### FREE (API Key Required - Free Tier)
- **TheMealDB** - Meal recipes (free tier)
- **Weatherstack** - Weather (1,000 req/month)
- **Words API** - Dictionary (2,500 req/day)
- **IBM TTS** - Text to Speech (500 min/month)
- **Merriam-Webster** - Dictionary (1,000 req/day)

**Total Monthly Cost:** $0 (within free limits)

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 7: Dictionary Module
- [ ] Integrate Free Dictionary API for English words
- [ ] Add Wiktionary API for multi-language support
- [ ] Create fallback system (local → API)
- [ ] Add caching for frequently searched words
- [ ] Test with 100+ words

### Money Category Enhancement
- [ ] Integrate Frankfurter API
- [ ] Add real-time currency conversion
- [ ] Cache exchange rates (update daily)
- [ ] Show conversion examples in phrases
- [ ] Add "Last updated" timestamp

### Additional Features
- [ ] Add REST Countries for language selection
- [ ] Show country flags and information
- [ ] Add weather context (Weatherstack)
- [ ] Add food database (TheMealDB)
- [ ] Implement geocoding for context

---

## 🔗 USEFUL LINKS

- **Public APIs Repository:** https://github.com/public-apis/public-apis
- **API Testing Tool:** https://reqbin.com/
- **Postman:** https://www.postman.com/
- **RapidAPI:** https://rapidapi.com/

---

## 📞 SUPPORT

For questions about specific APIs:
- Check API documentation
- Read API terms of service
- Respect rate limits
- Cache responses when possible

---

**Last Updated:** November 6, 2025
**Maintained by:** TurkmenPhrasebook Team
**Status:** Ready for implementation
