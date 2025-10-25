# 🌟 Turkmen Phrasebook - Splash Screen Design Brief

## 📱 Splash Screen Requirements

### Purpose
The splash screen appears for 1-2 seconds when the app launches. It should:
- Reinforce brand identity
- Show app loading state
- Create professional first impression

---

## 🎯 Design Specifications

### Technical Requirements

**File:** `assets/splash.png`
**Size:** 1284 × 2778 pixels (iPhone 14 Pro Max - largest screen)
**Format:** PNG
**Background Color:** #10B981 (Turkmen green)
**Color Space:** sRGB

### Cross-Platform Sizing
```
iPhone 14 Pro Max:  1284 × 2778 px (target size)
Android XXXHDPI:    1440 × 2560 px (scales down)
iPad Pro 12.9":     2048 × 2732 px (scales up)
```

**Safe Area:** Keep logo and text in center 1000 × 1500 px zone

---

## 🎨 Design Concept

### Layout Structure
```
┌─────────────────────────┐
│                         │
│     (Top padding)       │  ← 400px
│                         │
│      🕊️ [Icon]         │  ← App icon (300×300)
│                         │
│   Turkmen Phrasebook    │  ← App name (48px, bold, white)
│                         │
│  Learn Turkmen with     │  ← Tagline (20px, white, 70% opacity)
│     30 Languages        │
│                         │
│         ⋯ ⋯ ⋯          │  ← Loading dots (optional animation)
│                         │
│     (Bottom padding)    │  ← 600px
│                         │
└─────────────────────────┘
```

---

## 🎨 Color Palette

```
Background:        #10B981  (Turkmen green)
Primary Text:      #FFFFFF  (White)
Secondary Text:    #FFFFFF  (70% opacity = rgba(255,255,255,0.7))
Accent:            #F59E0B  (Gold - optional decorative elements)
```

---

## 🖼️ Design Options

### Option 1: Minimal (Recommended)
```
Solid #10B981 background
Center: White dove icon (same as app icon)
Below: "Turkmen Phrasebook" in white
Simple, clean, fast to create
```

### Option 2: With Pattern
```
Green background with subtle Turkmen carpet pattern (10% opacity)
Center: App icon
Text: App name + tagline
More cultural, distinctive
```

### Option 3: Gradient
```
Linear gradient:
  Top: #0D9668 (darker green)
  Bottom: #10B981 (brand green)
Center: App icon + name
Modern, depth
```

---

## 🛠️ How to Create Splash Screen

### Method 1: Canva (Easiest - 10 minutes)

1. **Create Design**
   - Go to Canva.com
   - Create custom size: **1284 × 2778 px**
   - Background → #10B981

2. **Add Icon**
   - Upload your app icon (icon.png)
   - Place at center-top (Y position: ~800px)
   - Size: 300 × 300 px

3. **Add App Name**
   - Text → "Turkmen Phrasebook"
   - Font: Montserrat Bold or similar
   - Size: 48px
   - Color: White
   - Position: Below icon (~150px gap)

4. **Add Tagline** (Optional)
   - Text → "Learn Turkmen with 30 Languages"
   - Font: Montserrat Regular
   - Size: 20px
   - Color: White (70% opacity)
   - Position: Below app name (~40px gap)

5. **Download**
   - File → Download → PNG
   - Save as `splash.png`

---

### Method 2: Figma (More Control)

**Figma Template:**
```
Frame: 1284 × 2778 px
│
├── Background (Rectangle)
│   Size: 1284 × 2778
│   Fill: #10B981
│
├── Icon Container (Frame)
│   Size: 300 × 300
│   X: 492, Y: 800
│   Content: Your app icon
│
├── App Name (Text)
│   Content: "Turkmen Phrasebook"
│   Font: Inter Bold / SF Pro Bold
│   Size: 48px
│   Color: #FFFFFF
│   X: Center
│   Y: 1150
│
└── Tagline (Text)
    Content: "Learn Turkmen with 30 Languages"
    Font: Inter Regular / SF Pro Regular
    Size: 20px
    Color: #FFFFFF (70%)
    X: Center
    Y: 1220
```

**Export:**
- Select frame
- Export → PNG @ 1x
- Save as `assets/splash.png`

---

### Method 3: Adobe Photoshop / Illustrator

1. New document: 1284 × 2778 px, 72 PPI
2. Fill with #10B981
3. Place icon.png (300×300 centered at Y: 800)
4. Add text layers (see layout above)
5. Export → Save for Web → PNG-24

---

### Method 4: AI Generation

**DALL-E / Midjourney Prompt:**
```
Create a mobile app splash screen, 1284×2778 pixels.
Solid emerald green background (#10B981).
Center: White dove icon (300px).
Below: "Turkmen Phrasebook" in white bold text (48px).
Below that: "Learn Turkmen with 30 Languages" in white (20px).
Minimalist, modern, clean design. No other elements.
```

---

## 📐 Safe Zone Guide

Keep important elements within this zone to avoid notch/cutout:
```
┌─────────────────────────┐
│  ← NOTCH AREA →         │  ← Top 200px
├─────────────────────────┤
│                         │
│                         │
│    SAFE ZONE            │  ← Content here
│    (1284 × 2300)        │
│                         │
│                         │
├─────────────────────────┤
│  ← GESTURE BAR →        │  ← Bottom 278px
└─────────────────────────┘
```

---

## ✅ Quality Checklist

Before finalizing:
- [ ] Size is exactly 1284 × 2778 pixels
- [ ] Background color is #10B981
- [ ] Icon clearly visible (300×300 or similar)
- [ ] Text readable on green background (white, high contrast)
- [ ] All elements in safe zone (avoid top 200px and bottom 278px)
- [ ] PNG format
- [ ] File size < 500KB (optimize if needed)
- [ ] Tested on actual device

---

## 🚀 Quick Start (5 Minutes)

**Need splash screen NOW:**

1. **Go to Canva**
   - Custom size: 1284 × 2778
   - Background: #10B981

2. **Upload & Center Icon**
   - Upload `icon.png`
   - Resize to 300×300
   - Position at center-top

3. **Add Text**
   - "Turkmen Phrasebook" (48px, white, bold)
   - "Learn Turkmen with 30 Languages" (20px, white)

4. **Download**
   - PNG format
   - Save as `assets/splash.png`

**Done!** Test with:
```bash
npx expo start --clear
```

---

## 🎨 Alternative: Expo Splash Screen Generator

If you have the icon ready:

```bash
# Install generator
npx @expo/configure-splash-screen

# Configure in app.json
{
  "splash": {
    "image": "./assets/icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#10B981"
  }
}
```

This will auto-generate splash screen from your icon!

---

## 📊 File Locations

After creation:
```
assets/
├── splash.png           (1284×2778 - main splash)
└── icon.png            (used in splash center)
```

Update `app.json`:
```json
{
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#10B981"
  }
}
```

---

## 🎓 Typography Recommendations

**Good Font Choices:**
- **Montserrat** (Google Fonts - modern, clean)
- **Inter** (Google Fonts - very readable)
- **SF Pro** (Apple - native iOS feel)
- **Roboto** (Google - native Android feel)
- **Poppins** (Google Fonts - friendly, rounded)

**Weights:**
- App Name: Bold (700) or ExtraBold (800)
- Tagline: Regular (400) or Medium (500)

---

## 💡 Pro Tips

1. **Keep it simple:** Splash shows for 1-2 seconds only
2. **High contrast:** White on green = easy to read
3. **Consistent branding:** Use same icon as app icon
4. **Optimize size:** Compress PNG (use TinyPNG.com if > 500KB)
5. **Test on device:** Emulator colors differ from real screen
6. **Consider animations:** Expo supports animated splash (advanced)

---

## 🔄 App.json Configuration

Final configuration in `app.json`:
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#10B981"
    }
  }
}
```

Or if using icon as splash:
```json
{
  "expo": {
    "splash": {
      "image": "./assets/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#10B981"
    }
  }
}
```

---

## 📱 Preview

After adding splash.png:
```bash
# Clear cache
npx expo start --clear

# Run on device
Press 'a' for Android
Press 'i' for iOS

# Watch splash screen appear on app launch
```

---

**Questions?** seydicharyev@icloud.com
