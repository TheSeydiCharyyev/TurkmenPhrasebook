# 🎨 Turkmen Phrasebook - Icon Design Brief

## 📱 App Icon Requirements

### Concept
**Theme:** Turkmenistan Flag + White Dove (Peace Symbol)

**Symbolism:**
- **Green Background (#10B981):** Turkmen flag green, prosperity, life
- **White Dove:** Peace, neutrality, communication across languages
- **30 Stars/Languages:** Subtle representation of 30 supported languages

---

## 🎯 Design Specifications

### Technical Requirements

#### 1. Icon.png (Main App Icon)
- **Size:** 1024 × 1024 pixels
- **Format:** PNG with transparency
- **Color Space:** sRGB
- **Location:** `assets/icon.png`

#### 2. Adaptive Icon (Android)
- **Size:** 1024 × 1024 pixels
- **Format:** PNG with transparency
- **Safe Zone:** Keep important elements in center 66% (684 × 684 px)
- **Location:** `assets/adaptive-icon.png`

#### 3. Splash Screen
- **Size:** 1284 × 2778 pixels (iPhone 14 Pro Max)
- **Format:** PNG
- **Background:** #10B981 (green)
- **Location:** `assets/splash.png`

---

## 🎨 Color Palette

```
Primary Green:   #10B981  (Turkmen flag green)
White:           #FFFFFF  (Dove, text)
Dark Text:       #111827  (App name)
Accent Gold:     #F59E0B  (Optional - carpet pattern accent)
```

---

## 🖼️ Design Concept Ideas

### Option 1: Minimalist Dove
```
┌─────────────────┐
│                 │
│    🕊️ (White)   │  ← Simple white dove silhouette
│                 │     centered on green background
│   Turkmen Flag  │  ← Subtle flag pattern or crescent
│     Pattern     │     in bottom third
│                 │
└─────────────────┘
```

### Option 2: Globe with Dove
```
┌─────────────────┐
│       🌍        │  ← Stylized globe showing Turkmenistan
│      /   \      │     with 30 small stars around it
│     🕊️   TM    │  ← Dove flying across
│    * * * * *   │  ← 30 stars (languages)
│                 │
└─────────────────┘
```

### Option 3: Speech Bubble
```
┌─────────────────┐
│   ┌─────────┐   │
│   │  Salam! │   │  ← Speech bubble with Turkmen greeting
│   │   你好!  │   │  ← Multiple languages shown
│   │ Привет! │   │
│   └──────🕊️─┘   │  ← Dove at corner
│                 │
└─────────────────┘
```

---

## 🛠️ How to Create the Icon

### Method 1: AI Generation (Recommended for Quick Start)

#### Using DALL-E, Midjourney, or Stable Diffusion:

**Prompt:**
```
Create a mobile app icon for "Turkmen Phrasebook", 1024x1024 pixels.
Design features:
- Solid green background (#10B981 - Turkmen flag green)
- White dove silhouette in the center (symbol of peace and communication)
- Minimalist, modern, flat design style
- Optional: subtle Turkmen carpet pattern or crescent moon
- Clean, professional look suitable for iOS and Android
- No text on the icon
```

**Alternative Prompt (More Detailed):**
```
App icon design, 1024x1024, flat vector style. Central white dove in flight
on emerald green (#10B981) background. Dove simplified to 3-4 shapes.
Circular composition. Subtle gold accent (#F59E0B) around border.
Modern, minimalist, professional. Inspired by Turkmenistan's flag colors.
```

#### AI Tools:
1. **DALL-E 3** (via ChatGPT Plus)
   - Prompt: Use above
   - Export as PNG 1024×1024

2. **Midjourney**
   ```
   /imagine app icon, white dove, green #10B981 background,
   minimalist, 1024x1024, flat design, turkmenistan --ar 1:1 --v 6
   ```

3. **Adobe Firefly**
   - Use text-to-image
   - Style: "Flat icon design"

4. **Canva AI**
   - Text to Image feature
   - Export at 1024×1024

---

### Method 2: Professional Design Tool

#### Using Figma (Free):
1. Create 1024×1024 artboard
2. Add green rectangle (#10B981)
3. Import dove SVG from:
   - The Noun Project (search "dove")
   - Flaticon (search "peace dove")
4. Make dove white (#FFFFFF)
5. Center and scale to 60% of canvas
6. Export as PNG @ 1x

#### Using Canva (Free):
1. Create custom size: 1024 × 1024 px
2. Background: Solid color #10B981
3. Elements → Search "dove"
4. Choose simple dove silhouette
5. Color: White
6. Download as PNG

#### Using Adobe Illustrator:
1. New document: 1024 × 1024 px
2. Rectangle tool: Fill with #10B981
3. Pen tool or shape builder: Create dove
4. Export as PNG @ 300 PPI

---

### Method 3: Hire Designer (For Final Polish)

#### Platforms:
- **Fiverr:** Search "app icon design" ($10-50)
- **99designs:** Contest or 1-to-1 project
- **Upwork:** Post job for icon designer

#### Design Brief to Send:
```
App Name: Turkmen Phrasebook
Purpose: Language learning app (Turkmen ↔ 30 languages)

Icon Concept:
- Green background (#10B981) - Turkmen flag color
- White dove symbol (peace, communication)
- Minimalist, modern design
- Must work at small sizes (60px)

Deliverables:
1. icon.png (1024×1024 PNG)
2. adaptive-icon.png (1024×1024 PNG, safe zone aware)
3. Source file (AI, SVG, or Figma)

Budget: $20-50
Timeline: 2-3 days
```

---

## 📐 Icon Safe Zones

### iOS
- Full 1024×1024 visible but with rounded corners
- Keep critical elements **80px** from edges

### Android Adaptive Icon
- **Foreground layer:** 1024×1024
- **Safe zone:** 684×684 (center 66%)
- **Masked area:** System applies circular/rounded square mask

**Diagram:**
```
┌────────────────────────────────┐
│ ← 170px → MASKED AREA          │
│    ┌──────────────────┐        │
│    │                  │        │
│    │   SAFE ZONE      │        │ ← 684×684
│    │   (Your dove)    │        │
│    │                  │        │
│    └──────────────────┘        │
│                                │
└────────────────────────────────┘
         1024×1024
```

---

## ✅ Quality Checklist

Before finalizing:
- [ ] Icon is exactly 1024×1024 pixels
- [ ] No text on icon (text should be in app name)
- [ ] Dove clearly visible at 60px size
- [ ] Green is #10B981
- [ ] PNG format with transparency where needed
- [ ] Works on both light and dark backgrounds
- [ ] Tested on actual device (use Expo Go to preview)
- [ ] Adaptive icon elements inside safe zone

---

## 🚀 Quick Start (5 Minutes)

**If you need an icon RIGHT NOW:**

1. Go to **Canva.com** (free account)
2. Create design → Custom size → 1024 × 1024
3. Background → Color → Enter #10B981
4. Elements → Search "dove silhouette"
5. Choose simple white dove icon
6. Center and scale to 60%
7. Download as PNG
8. Save as `assets/icon.png`
9. Copy to `assets/adaptive-icon.png`

---

## 📝 Once Icon is Ready

Place files in:
```
ChinesePhrasebook2/
└── assets/
    ├── icon.png              (1024×1024 - your new icon)
    ├── adaptive-icon.png     (1024×1024 - same or variant)
    ├── splash.png            (1284×2778 - splash screen)
    └── favicon.png           (48×48 - web)
```

Then run:
```bash
# Clear Expo cache
npx expo start --clear

# Build preview to test
eas build --platform android --profile preview
```

---

## 🎓 Resources

**Free Dove Icons:**
- The Noun Project: https://thenounproject.com/search/?q=dove
- Flaticon: https://www.flaticon.com/search?word=dove
- Iconify: https://icon-sets.iconify.design/

**Color Tools:**
- Coolors.co (palette generator)
- Color.adobe.com (color wheel)

**Icon Validators:**
- App Icon Generator: https://appicon.co/
- Icon Kitchen: https://icon.kitchen/

---

## 💡 Pro Tips

1. **Keep it simple:** Icon will be 60px on phone - details get lost
2. **Test at small size:** View at 60×60 to ensure clarity
3. **Avoid gradients:** Flat colors work better at small sizes
4. **Consider dark mode:** White dove works on green, also on black
5. **Unique but recognizable:** Balance creativity with app purpose

---

**Need help?** Contact: seydicharyev@icloud.com
