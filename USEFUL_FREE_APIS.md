# 🎤 VOICE TRANSLATOR APIs - TurkmenPhrasebook

**Date:** November 7, 2025
**Status:** Ready for Voice Translator implementation (Phase 6)

---

## 📋 TABLE OF CONTENTS

1. [Speech-to-Text APIs](#-speech-to-text-apis)
2. [Text-to-Speech APIs](#-text-to-speech-apis)
3. [Implementation Examples](#-implementation-examples)
4. [Priority Recommendations](#-priority-recommendations)

---

## 🎙️ SPEECH-TO-TEXT APIs

### ⭐⭐⭐⭐⭐ Web Speech API (Browser Native)
- **Description:** Browser's built-in speech recognition
- **Auth:** NO (no API key required!)
- **HTTPS:** Required for production
- **CORS:** N/A (browser native)
- **Free Tier:** Unlimited (uses device's native speech recognition)
- **Languages:** 50+ languages including Russian, English, Turkish, Chinese, etc.
- **Support:** Chrome, Edge, Safari (limited)
- **Link:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

**Pros:**
- ✅ FREE and unlimited
- ✅ No API key required
- ✅ Works offline (uses device recognition)
- ✅ Low latency
- ✅ Built-in to browser

**Cons:**
- ⚠️ Requires user permission
- ⚠️ Browser compatibility varies
- ⚠️ No Turkmen language support (можно использовать Turkish как близкий)

**Example:**
```javascript
// React Native with WebView or Expo
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'ru-RU'; // Russian
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log('Recognized:', transcript);
};

recognition.start();
```

**Use Case:** PRIMARY choice for Voice Translator (free, unlimited, good quality)

---

### ⭐⭐⭐⭐⭐ Expo Speech (React Native)
- **Description:** React Native speech recognition
- **Auth:** NO
- **HTTPS:** N/A
- **Free Tier:** Unlimited
- **Package:** `expo-speech`
- **Link:** https://docs.expo.dev/versions/latest/sdk/speech/

**Note:** expo-speech primarily handles Text-to-Speech. For Speech-to-Text in React Native, use:
- **`@react-native-voice/voice`** - Popular library for speech recognition
- **`react-native-voice`** - Alternative

**Example (react-native-voice):**
```javascript
import Voice from '@react-native-voice/voice';

// Start listening
Voice.onSpeechResults = (e) => {
  console.log('Recognized:', e.value[0]);
};

await Voice.start('ru-RU'); // Russian
await Voice.stop();
```

**Installation:**
```bash
npx expo install @react-native-voice/voice
```

**Use Case:** PRIMARY choice for React Native Voice Translator

---

### ⭐⭐⭐⭐ Google Cloud Speech-to-Text
- **Description:** Google's advanced speech recognition
- **Auth:** apiKey (requires Google Cloud account)
- **HTTPS:** Yes
- **Free Tier:** 60 minutes/month FREE, then $0.006/15 seconds
- **Languages:** 125+ languages (including Turkish, Russian, Chinese, etc.)
- **Link:** https://cloud.google.com/speech-to-text

**Pros:**
- ✅ High accuracy
- ✅ 125+ languages
- ✅ Punctuation and formatting
- ✅ Real-time streaming
- ✅ 60 minutes FREE per month

**Cons:**
- ⚠️ Requires API key
- ⚠️ Paid after 60 minutes
- ⚠️ No Turkmen support

**Example:**
```javascript
const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'ru-RU'
    },
    audio: {
      content: base64AudioData
    }
  })
});
```

**Use Case:** BACKUP option if native recognition quality is poor

---

### ⭐⭐⭐⭐ AssemblyAI
- **Description:** Modern speech-to-text API
- **Auth:** apiKey (free registration)
- **HTTPS:** Yes
- **Free Tier:** 3 hours/month FREE, then $0.00025/second
- **Languages:** Multiple languages
- **Link:** https://www.assemblyai.com/

**Pros:**
- ✅ High accuracy
- ✅ 3 hours FREE per month
- ✅ Fast processing
- ✅ Good documentation

**Cons:**
- ⚠️ Requires API key
- ⚠️ Limited free tier

**Example:**
```javascript
const response = await fetch('https://api.assemblyai.com/v2/transcript', {
  method: 'POST',
  headers: {
    'authorization': 'YOUR_API_KEY',
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    audio_url: 'https://example.com/audio.mp3',
    language_code: 'ru'
  })
});
```

**Use Case:** BACKUP option if need higher quality than native

---

### ⭐⭐⭐ Deepgram
- **Description:** Fast and accurate speech recognition
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** $200 credit (≈45 hours)
- **Languages:** 30+ languages
- **Link:** https://deepgram.com/

**Pros:**
- ✅ Very fast (low latency)
- ✅ Good free credit
- ✅ Real-time streaming

**Cons:**
- ⚠️ Requires API key
- ⚠️ Paid after credit expires

---

### ⭐⭐⭐ Azure Speech Services
- **Description:** Microsoft's speech recognition
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** 5 hours/month FREE
- **Languages:** 100+ languages
- **Link:** https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/

**Pros:**
- ✅ High accuracy
- ✅ 5 hours FREE per month
- ✅ Many languages

**Cons:**
- ⚠️ Requires API key
- ⚠️ Complex setup

---

## 🔊 TEXT-TO-SPEECH APIs

### ⭐⭐⭐⭐⭐ Expo Speech (Already in app!)
- **Description:** React Native text-to-speech
- **Auth:** NO
- **Free Tier:** Unlimited (uses device TTS)
- **Languages:** Depends on device (30+ common languages)
- **Package:** `expo-speech`
- **Link:** https://docs.expo.dev/versions/latest/sdk/speech/

**Example:**
```javascript
import * as Speech from 'expo-speech';

await Speech.speak('Hello, how are you?', {
  language: 'en-US',
  rate: 0.75,
  pitch: 1.0
});
```

**Use Case:** ALREADY USING in app - perfect for Voice Translator!

---

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

**Use Case:** Alternative TTS if expo-speech quality is poor

---

### ⭐⭐⭐ Google Cloud Text-to-Speech
- **Description:** Google's neural voices
- **Auth:** apiKey
- **HTTPS:** Yes
- **Free Tier:** 1 million characters/month FREE
- **Languages:** 100+ languages, 400+ voices
- **Link:** https://cloud.google.com/text-to-speech

**Use Case:** BACKUP if need higher quality voices

---

## 💻 IMPLEMENTATION EXAMPLES

### Example 1: Voice Translator with react-native-voice
```typescript
// src/features/voice-translator/screens/VoiceTranslatorScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { translateText } from '../../../services/TranslationService';

export default function VoiceTranslatorScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('ru-RU');
  const [targetLang, setTargetLang] = useState('en-US');

  useEffect(() => {
    // Setup voice recognition callbacks
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = async (e) => {
      const text = e.value[0];
      setRecognizedText(text);

      // Translate the recognized text
      const translation = await translateText(text, sourceLang, targetLang);
      setTranslatedText(translation);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start(sourceLang);
    } catch (error) {
      console.error('Voice recognition error:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Stop error:', error);
    }
  };

  const playTranslation = async () => {
    await Speech.speak(translatedText, {
      language: targetLang,
      rate: 0.75
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Record Button */}
      <TouchableOpacity
        onPress={isListening ? stopListening : startListening}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: isListening ? '#EF4444' : '#3B82F6',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isListening ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <Text style={{ fontSize: 48 }}>🎤</Text>
        )}
      </TouchableOpacity>

      {/* Recognized Text */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Recognized ({sourceLang}):
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10 }}>
          {recognizedText || 'Tap microphone to start...'}
        </Text>
      </View>

      {/* Translated Text */}
      {translatedText && (
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Translation ({targetLang}):
          </Text>
          <Text style={{ fontSize: 16, marginTop: 10 }}>
            {translatedText}
          </Text>

          {/* Play Button */}
          <TouchableOpacity
            onPress={playTranslation}
            style={{
              marginTop: 15,
              padding: 15,
              backgroundColor: '#22C55E',
              borderRadius: 12
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              🔊 Play Translation
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
```

**Installation:**
```bash
npx expo install @react-native-voice/voice
```

---

### Example 2: Voice Translator Service
```typescript
// src/services/VoiceTranslatorService.ts

import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

export class VoiceTranslatorService {
  private static isListening = false;

  // Start recording voice
  static async startRecording(languageCode: string): Promise<void> {
    try {
      if (this.isListening) {
        await this.stopRecording();
      }

      await Voice.start(languageCode);
      this.isListening = true;
    } catch (error) {
      console.error('Start recording error:', error);
      throw error;
    }
  }

  // Stop recording
  static async stopRecording(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Stop recording error:', error);
      throw error;
    }
  }

  // Check if microphone permission is granted
  static async checkPermissions(): Promise<boolean> {
    try {
      const available = await Voice.isAvailable();
      return available;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Play translated text
  static async playText(text: string, languageCode: string): Promise<void> {
    try {
      await Speech.speak(text, {
        language: languageCode,
        rate: 0.75,
        pitch: 1.0
      });
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  }

  // Stop playing
  static async stopPlaying(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Stop TTS error:', error);
    }
  }

  // Cleanup
  static async cleanup(): Promise<void> {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}
```

---

## 🎯 PRIORITY RECOMMENDATIONS

### IMPLEMENT NOW (Recommended Approach)

#### 1. **@react-native-voice/voice** + **expo-speech** ⭐⭐⭐⭐⭐
- ✅ FREE and unlimited
- ✅ No API key required
- ✅ Works offline (uses device recognition)
- ✅ expo-speech already in app for TTS
- ✅ Good quality for most languages
- **Time to implement:** 4-6 hours

**Languages Supported:**
- ✅ Russian (ru-RU)
- ✅ English (en-US)
- ✅ Chinese (zh-CN)
- ✅ Turkish (tr-TR) - closest to Turkmen
- ✅ 40+ other languages

**Architecture:**
```
User speaks → @react-native-voice/voice (Speech-to-Text)
→ TranslationService (already exists)
→ expo-speech (Text-to-Speech, already exists)
```

---

### BACKUP OPTIONS (If native quality is poor)

#### 2. **Google Cloud Speech-to-Text** ⭐⭐⭐⭐
- 60 minutes/month FREE
- High accuracy
- 125+ languages
- Use only if native recognition quality is insufficient
- **Time to implement:** 2-3 hours additional

#### 3. **AssemblyAI** ⭐⭐⭐
- 3 hours/month FREE
- Good quality
- Modern API
- **Time to implement:** 2-3 hours additional

---

## 🚀 IMPLEMENTATION PLAN (PHASE 6)

### Step 1: Install Dependencies (15 min)
```bash
npx expo install @react-native-voice/voice
# expo-speech already installed
```

### Step 2: Create VoiceTranslatorService (1 hour)
- Setup voice recognition callbacks
- Handle permissions
- Integrate with existing TranslationService
- Integrate with expo-speech for TTS

### Step 3: Create UI (2-3 hours)
- Hero + Grid design (like other modules)
- Microphone button (large, pulsing animation)
- Language selectors (source/target)
- Recognized text card
- Translated text card
- Play/Stop buttons
- Loading indicators

### Step 4: Add Multilingual Support (1 hour)
- Add translations to LanguageContext (31 languages)
- UI texts: "Tap to speak", "Listening", "Processing", etc.

### Step 5: Testing (1 hour)
- Test with Russian, English, Chinese, Turkish
- Test error handling (no permission, no internet)
- Test on real device (microphone required)

**Total Time:** 4-6 hours

---

## 📝 INSTALLATION GUIDE

### Install @react-native-voice/voice
```bash
npx expo install @react-native-voice/voice
```

### iOS Permissions (add to app.json)
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSSpeechRecognitionUsageDescription": "This app needs access to speech recognition to translate your voice.",
        "NSMicrophoneUsageDescription": "This app needs access to your microphone to record your voice."
      }
    }
  }
}
```

### Android Permissions (add to app.json)
```json
{
  "expo": {
    "android": {
      "permissions": [
        "RECORD_AUDIO"
      ]
    }
  }
}
```

---

## 🔗 USEFUL LINKS

- **@react-native-voice/voice:** https://github.com/react-native-voice/voice
- **expo-speech:** https://docs.expo.dev/versions/latest/sdk/speech/
- **Google Cloud Speech-to-Text:** https://cloud.google.com/speech-to-text
- **AssemblyAI:** https://www.assemblyai.com/
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

**Last Updated:** November 7, 2025
**Status:** Ready for Voice Translator implementation (Phase 6)
**Recommended:** Use @react-native-voice/voice + expo-speech (FREE, unlimited, no API key)
