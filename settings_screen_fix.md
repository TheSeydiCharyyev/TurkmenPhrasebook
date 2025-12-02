# Settings Screen - UI/UX Improvements

## Current State Analysis

**File:** `src/screens/SettingsScreen.tsx`

The current SettingsScreen has the following sections:
1. Language Settings (Interface + Phrasebook)
2. Audio Settings (Sound, Test Voice, Check Voices)
3. Interface Settings (Font Size, Haptic Feedback)
4. Data Settings (Clear History)
5. App Info (About)

---

## Issues to Fix

### 1. Visual Design Issues
- [ ] Icon colors inconsistent - using `#FF8008` (orange) instead of app's green `#00A651`
- [ ] Hardcoded Russian text: "Установленные голоса", "Просмотр всех доступных TTS голосов"
- [ ] Loading text hardcoded: "Загрузка настроек..."
- [ ] Section headers could have better visual separation
- [ ] Missing visual feedback on item press

### 2. Missing Features
- [ ] Dark Mode toggle exists in code (`preferences.darkMode`) but not shown in UI
- [ ] Speech Rate slider defined but modal not implemented (`showSpeechRateModal`)
- [ ] Auto-play setting exists but not shown
- [ ] No way to reset all settings to defaults
- [ ] No privacy/permissions section

### 3. UX Improvements
- [ ] Add icons with colored backgrounds (like iOS Settings)
- [ ] Group related settings with card-style containers
- [ ] Add animations when toggling switches
- [ ] Show current values more prominently

---

## Proposed New Structure

```
┌─────────────────────────────────────┐
│  ← Settings                         │
├─────────────────────────────────────┤
│                                     │
│  🌐 LANGUAGE                        │
│  ┌─────────────────────────────────┐│
│  │ 🌐 Interface Language     EN →  ││
│  │ 📖 Phrasebook Language   ZH →  ││
│  └─────────────────────────────────┘│
│                                     │
│  🔊 AUDIO & SPEECH                  │
│  ┌─────────────────────────────────┐│
│  │ 🔈 Sound Effects         [ON]  ││
│  │ 🎚️ Speech Rate          0.75x →││
│  │ ▶️ Test Voice              →   ││
│  │ 🎤 Installed Voices        →   ││
│  └─────────────────────────────────┘│
│                                     │
│  🎨 APPEARANCE                      │
│  ┌─────────────────────────────────┐│
│  │ 🌙 Dark Mode            [OFF]  ││
│  │ 🔤 Font Size             16px →││
│  │ 📳 Haptic Feedback       [ON]  ││
│  └─────────────────────────────────┘│
│                                     │
│  💾 DATA & STORAGE                  │
│  ┌─────────────────────────────────┐│
│  │ 🕐 Clear View History      →   ││
│  │ 🔍 Clear Search History    →   ││
│  │ ♻️ Reset All Settings      →   ││
│  └─────────────────────────────────┘│
│                                     │
│  ℹ️ ABOUT                           │
│  ┌─────────────────────────────────┐│
│  │ 📱 About App            v1.0 → ││
│  │ ⭐ Rate App                →   ││
│  │ 📧 Send Feedback           →   ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

---

## Implementation Checklist

### Task 1: Add Missing Translations to InterfaceTexts

**File:** `src/contexts/LanguageContext.tsx`

Add these fields to `InterfaceTexts` interface (around line 150):

```typescript
// Settings Screen - Additional translations
settingsInstalledVoices: string;
settingsInstalledVoicesDesc: string;
settingsLoading: string;
settingsDarkMode: string;
settingsDarkModeDesc: string;
settingsSpeechRate: string;
settingsSpeechRateDesc: string;
settingsResetAll: string;
settingsResetAllDesc: string;
settingsResetConfirm: string;
settingsClearSearchHistory: string;
settingsClearSearchHistoryDesc: string;
settingsRateApp: string;
settingsSendFeedback: string;
settingsAppearance: string;
settingsDataStorage: string;
```

---

### Task 2: Add Translations for All 30 Languages

**Turkmen (tk):**
```typescript
settingsInstalledVoices: 'Gurlan sesler',
settingsInstalledVoicesDesc: 'Ähli TTS seslerini görüň',
settingsLoading: 'Sazlamalar ýüklenýär...',
settingsDarkMode: 'Garaňky režim',
settingsDarkModeDesc: 'Garaňky temany açyň',
settingsSpeechRate: 'Gürleýiş tizligi',
settingsSpeechRateDesc: 'Aýdylyş tizligini sazlaň',
settingsResetAll: 'Ähli sazlamalary täzeden',
settingsResetAllDesc: 'Başlangyç sazlamalary dikelt',
settingsResetConfirm: 'Hakykatdanam täzeden başlatmak isleýärsiňizmi?',
settingsClearSearchHistory: 'Gözleg taryhyny arassala',
settingsClearSearchHistoryDesc: 'Ähli gözleg ýazgylaryny poz',
settingsRateApp: 'Programma baha ber',
settingsSendFeedback: 'Pikir iber',
settingsAppearance: 'Görnüş',
settingsDataStorage: 'Maglumatlar',
```

**Chinese (zh):**
```typescript
settingsInstalledVoices: '已安装语音',
settingsInstalledVoicesDesc: '查看所有TTS语音',
settingsLoading: '加载设置...',
settingsDarkMode: '深色模式',
settingsDarkModeDesc: '切换到深色主题',
settingsSpeechRate: '语速',
settingsSpeechRateDesc: '调整发音速度',
settingsResetAll: '重置所有设置',
settingsResetAllDesc: '恢复默认设置',
settingsResetConfirm: '确定要重置吗？',
settingsClearSearchHistory: '清除搜索历史',
settingsClearSearchHistoryDesc: '删除所有搜索记录',
settingsRateApp: '评价应用',
settingsSendFeedback: '发送反馈',
settingsAppearance: '外观',
settingsDataStorage: '数据与存储',
```

**Russian (ru):**
```typescript
settingsInstalledVoices: 'Установленные голоса',
settingsInstalledVoicesDesc: 'Просмотр всех TTS голосов',
settingsLoading: 'Загрузка настроек...',
settingsDarkMode: 'Тёмная тема',
settingsDarkModeDesc: 'Переключить на тёмную тему',
settingsSpeechRate: 'Скорость речи',
settingsSpeechRateDesc: 'Настройка скорости произношения',
settingsResetAll: 'Сбросить все настройки',
settingsResetAllDesc: 'Восстановить настройки по умолчанию',
settingsResetConfirm: 'Вы уверены, что хотите сбросить?',
settingsClearSearchHistory: 'Очистить историю поиска',
settingsClearSearchHistoryDesc: 'Удалить все записи поиска',
settingsRateApp: 'Оценить приложение',
settingsSendFeedback: 'Отправить отзыв',
settingsAppearance: 'Оформление',
settingsDataStorage: 'Данные и хранение',
```

**English (en):**
```typescript
settingsInstalledVoices: 'Installed Voices',
settingsInstalledVoicesDesc: 'View all available TTS voices',
settingsLoading: 'Loading settings...',
settingsDarkMode: 'Dark Mode',
settingsDarkModeDesc: 'Switch to dark theme',
settingsSpeechRate: 'Speech Rate',
settingsSpeechRateDesc: 'Adjust pronunciation speed',
settingsResetAll: 'Reset All Settings',
settingsResetAllDesc: 'Restore default settings',
settingsResetConfirm: 'Are you sure you want to reset?',
settingsClearSearchHistory: 'Clear Search History',
settingsClearSearchHistoryDesc: 'Delete all search records',
settingsRateApp: 'Rate App',
settingsSendFeedback: 'Send Feedback',
settingsAppearance: 'Appearance',
settingsDataStorage: 'Data & Storage',
```

**Turkish (tr):**
```typescript
settingsInstalledVoices: 'Yüklü Sesler',
settingsInstalledVoicesDesc: 'Tüm TTS seslerini görüntüle',
settingsLoading: 'Ayarlar yükleniyor...',
settingsDarkMode: 'Karanlık Mod',
settingsDarkModeDesc: 'Karanlık temaya geç',
settingsSpeechRate: 'Konuşma Hızı',
settingsSpeechRateDesc: 'Telaffuz hızını ayarla',
settingsResetAll: 'Tüm Ayarları Sıfırla',
settingsResetAllDesc: 'Varsayılan ayarları geri yükle',
settingsResetConfirm: 'Sıfırlamak istediğinizden emin misiniz?',
settingsClearSearchHistory: 'Arama Geçmişini Temizle',
settingsClearSearchHistoryDesc: 'Tüm arama kayıtlarını sil',
settingsRateApp: 'Uygulamayı Değerlendir',
settingsSendFeedback: 'Geri Bildirim Gönder',
settingsAppearance: 'Görünüm',
settingsDataStorage: 'Veri ve Depolama',
```

**German (de):**
```typescript
settingsInstalledVoices: 'Installierte Stimmen',
settingsInstalledVoicesDesc: 'Alle verfügbaren TTS-Stimmen anzeigen',
settingsLoading: 'Einstellungen werden geladen...',
settingsDarkMode: 'Dunkelmodus',
settingsDarkModeDesc: 'Zum dunklen Design wechseln',
settingsSpeechRate: 'Sprechgeschwindigkeit',
settingsSpeechRateDesc: 'Aussprachegeschwindigkeit anpassen',
settingsResetAll: 'Alle Einstellungen zurücksetzen',
settingsResetAllDesc: 'Standardeinstellungen wiederherstellen',
settingsResetConfirm: 'Möchten Sie wirklich zurücksetzen?',
settingsClearSearchHistory: 'Suchverlauf löschen',
settingsClearSearchHistoryDesc: 'Alle Sucheinträge löschen',
settingsRateApp: 'App bewerten',
settingsSendFeedback: 'Feedback senden',
settingsAppearance: 'Darstellung',
settingsDataStorage: 'Daten & Speicher',
```

**French (fr):**
```typescript
settingsInstalledVoices: 'Voix installées',
settingsInstalledVoicesDesc: 'Voir toutes les voix TTS disponibles',
settingsLoading: 'Chargement des paramètres...',
settingsDarkMode: 'Mode sombre',
settingsDarkModeDesc: 'Passer au thème sombre',
settingsSpeechRate: 'Vitesse de parole',
settingsSpeechRateDesc: 'Ajuster la vitesse de prononciation',
settingsResetAll: 'Réinitialiser tous les paramètres',
settingsResetAllDesc: 'Restaurer les paramètres par défaut',
settingsResetConfirm: 'Êtes-vous sûr de vouloir réinitialiser?',
settingsClearSearchHistory: 'Effacer l\'historique de recherche',
settingsClearSearchHistoryDesc: 'Supprimer tous les enregistrements de recherche',
settingsRateApp: 'Évaluer l\'application',
settingsSendFeedback: 'Envoyer un commentaire',
settingsAppearance: 'Apparence',
settingsDataStorage: 'Données et stockage',
```

**Spanish (es):**
```typescript
settingsInstalledVoices: 'Voces instaladas',
settingsInstalledVoicesDesc: 'Ver todas las voces TTS disponibles',
settingsLoading: 'Cargando configuración...',
settingsDarkMode: 'Modo oscuro',
settingsDarkModeDesc: 'Cambiar al tema oscuro',
settingsSpeechRate: 'Velocidad del habla',
settingsSpeechRateDesc: 'Ajustar velocidad de pronunciación',
settingsResetAll: 'Restablecer toda la configuración',
settingsResetAllDesc: 'Restaurar configuración predeterminada',
settingsResetConfirm: '¿Está seguro de que desea restablecer?',
settingsClearSearchHistory: 'Borrar historial de búsqueda',
settingsClearSearchHistoryDesc: 'Eliminar todos los registros de búsqueda',
settingsRateApp: 'Calificar aplicación',
settingsSendFeedback: 'Enviar comentarios',
settingsAppearance: 'Apariencia',
settingsDataStorage: 'Datos y almacenamiento',
```

**Italian (it):**
```typescript
settingsInstalledVoices: 'Voci installate',
settingsInstalledVoicesDesc: 'Visualizza tutte le voci TTS disponibili',
settingsLoading: 'Caricamento impostazioni...',
settingsDarkMode: 'Modalità scura',
settingsDarkModeDesc: 'Passa al tema scuro',
settingsSpeechRate: 'Velocità del parlato',
settingsSpeechRateDesc: 'Regola la velocità di pronuncia',
settingsResetAll: 'Ripristina tutte le impostazioni',
settingsResetAllDesc: 'Ripristina impostazioni predefinite',
settingsResetConfirm: 'Sei sicuro di voler ripristinare?',
settingsClearSearchHistory: 'Cancella cronologia ricerche',
settingsClearSearchHistoryDesc: 'Elimina tutti i record di ricerca',
settingsRateApp: 'Valuta app',
settingsSendFeedback: 'Invia feedback',
settingsAppearance: 'Aspetto',
settingsDataStorage: 'Dati e archiviazione',
```

**Portuguese (pt):**
```typescript
settingsInstalledVoices: 'Vozes instaladas',
settingsInstalledVoicesDesc: 'Ver todas as vozes TTS disponíveis',
settingsLoading: 'Carregando configurações...',
settingsDarkMode: 'Modo escuro',
settingsDarkModeDesc: 'Mudar para tema escuro',
settingsSpeechRate: 'Velocidade da fala',
settingsSpeechRateDesc: 'Ajustar velocidade de pronúncia',
settingsResetAll: 'Redefinir todas as configurações',
settingsResetAllDesc: 'Restaurar configurações padrão',
settingsResetConfirm: 'Tem certeza que deseja redefinir?',
settingsClearSearchHistory: 'Limpar histórico de pesquisa',
settingsClearSearchHistoryDesc: 'Excluir todos os registros de pesquisa',
settingsRateApp: 'Avaliar aplicativo',
settingsSendFeedback: 'Enviar feedback',
settingsAppearance: 'Aparência',
settingsDataStorage: 'Dados e armazenamento',
```

**Japanese (ja):**
```typescript
settingsInstalledVoices: 'インストール済み音声',
settingsInstalledVoicesDesc: '利用可能なすべてのTTS音声を表示',
settingsLoading: '設定を読み込み中...',
settingsDarkMode: 'ダークモード',
settingsDarkModeDesc: 'ダークテーマに切り替え',
settingsSpeechRate: '読み上げ速度',
settingsSpeechRateDesc: '発音速度を調整',
settingsResetAll: 'すべての設定をリセット',
settingsResetAllDesc: 'デフォルト設定を復元',
settingsResetConfirm: '本当にリセットしますか？',
settingsClearSearchHistory: '検索履歴を消去',
settingsClearSearchHistoryDesc: 'すべての検索記録を削除',
settingsRateApp: 'アプリを評価',
settingsSendFeedback: 'フィードバックを送信',
settingsAppearance: '外観',
settingsDataStorage: 'データとストレージ',
```

**Korean (ko):**
```typescript
settingsInstalledVoices: '설치된 음성',
settingsInstalledVoicesDesc: '사용 가능한 모든 TTS 음성 보기',
settingsLoading: '설정 로드 중...',
settingsDarkMode: '다크 모드',
settingsDarkModeDesc: '다크 테마로 전환',
settingsSpeechRate: '음성 속도',
settingsSpeechRateDesc: '발음 속도 조정',
settingsResetAll: '모든 설정 초기화',
settingsResetAllDesc: '기본 설정 복원',
settingsResetConfirm: '정말 초기화하시겠습니까?',
settingsClearSearchHistory: '검색 기록 지우기',
settingsClearSearchHistoryDesc: '모든 검색 기록 삭제',
settingsRateApp: '앱 평가',
settingsSendFeedback: '피드백 보내기',
settingsAppearance: '모양',
settingsDataStorage: '데이터 및 저장소',
```

**Arabic (ar):**
```typescript
settingsInstalledVoices: 'الأصوات المثبتة',
settingsInstalledVoicesDesc: 'عرض جميع أصوات TTS المتاحة',
settingsLoading: 'جاري تحميل الإعدادات...',
settingsDarkMode: 'الوضع الداكن',
settingsDarkModeDesc: 'التبديل إلى السمة الداكنة',
settingsSpeechRate: 'سرعة الكلام',
settingsSpeechRateDesc: 'ضبط سرعة النطق',
settingsResetAll: 'إعادة تعيين جميع الإعدادات',
settingsResetAllDesc: 'استعادة الإعدادات الافتراضية',
settingsResetConfirm: 'هل أنت متأكد من إعادة التعيين؟',
settingsClearSearchHistory: 'مسح سجل البحث',
settingsClearSearchHistoryDesc: 'حذف جميع سجلات البحث',
settingsRateApp: 'تقييم التطبيق',
settingsSendFeedback: 'إرسال ملاحظات',
settingsAppearance: 'المظهر',
settingsDataStorage: 'البيانات والتخزين',
```

**Hindi (hi):**
```typescript
settingsInstalledVoices: 'स्थापित आवाजें',
settingsInstalledVoicesDesc: 'सभी उपलब्ध TTS आवाजें देखें',
settingsLoading: 'सेटिंग्स लोड हो रही हैं...',
settingsDarkMode: 'डार्क मोड',
settingsDarkModeDesc: 'डार्क थीम पर स्विच करें',
settingsSpeechRate: 'बोलने की गति',
settingsSpeechRateDesc: 'उच्चारण की गति समायोजित करें',
settingsResetAll: 'सभी सेटिंग्स रीसेट करें',
settingsResetAllDesc: 'डिफ़ॉल्ट सेटिंग्स पुनर्स्थापित करें',
settingsResetConfirm: 'क्या आप वाकई रीसेट करना चाहते हैं?',
settingsClearSearchHistory: 'खोज इतिहास साफ़ करें',
settingsClearSearchHistoryDesc: 'सभी खोज रिकॉर्ड हटाएं',
settingsRateApp: 'ऐप रेट करें',
settingsSendFeedback: 'प्रतिक्रिया भेजें',
settingsAppearance: 'दिखावट',
settingsDataStorage: 'डेटा और स्टोरेज',
```

**Uzbek (uz):**
```typescript
settingsInstalledVoices: 'O\'rnatilgan ovozlar',
settingsInstalledVoicesDesc: 'Barcha mavjud TTS ovozlarini ko\'ring',
settingsLoading: 'Sozlamalar yuklanmoqda...',
settingsDarkMode: 'Qorong\'i rejim',
settingsDarkModeDesc: 'Qorong\'i mavzuga o\'tish',
settingsSpeechRate: 'Nutq tezligi',
settingsSpeechRateDesc: 'Talaffuz tezligini sozlash',
settingsResetAll: 'Barcha sozlamalarni tiklash',
settingsResetAllDesc: 'Standart sozlamalarni tiklash',
settingsResetConfirm: 'Rostdan ham tiklamoqchimisiz?',
settingsClearSearchHistory: 'Qidiruv tarixini tozalash',
settingsClearSearchHistoryDesc: 'Barcha qidiruv yozuvlarini o\'chirish',
settingsRateApp: 'Ilovani baholash',
settingsSendFeedback: 'Fikr yuborish',
settingsAppearance: 'Ko\'rinish',
settingsDataStorage: 'Ma\'lumotlar va saqlash',
```

**Kazakh (kk):**
```typescript
settingsInstalledVoices: 'Орнатылған дауыстар',
settingsInstalledVoicesDesc: 'Барлық қолжетімді TTS дауыстарын көру',
settingsLoading: 'Параметрлер жүктелуде...',
settingsDarkMode: 'Қараңғы режим',
settingsDarkModeDesc: 'Қараңғы тақырыпқа ауысу',
settingsSpeechRate: 'Сөйлеу жылдамдығы',
settingsSpeechRateDesc: 'Айту жылдамдығын реттеу',
settingsResetAll: 'Барлық параметрлерді қалпына келтіру',
settingsResetAllDesc: 'Әдепкі параметрлерді қалпына келтіру',
settingsResetConfirm: 'Шынымен қалпына келтіргіңіз келе ме?',
settingsClearSearchHistory: 'Іздеу тарихын тазалау',
settingsClearSearchHistoryDesc: 'Барлық іздеу жазбаларын жою',
settingsRateApp: 'Қолданбаны бағалау',
settingsSendFeedback: 'Пікір жіберу',
settingsAppearance: 'Көрініс',
settingsDataStorage: 'Деректер мен сақтау',
```

**Azerbaijani (az):**
```typescript
settingsInstalledVoices: 'Quraşdırılmış səslər',
settingsInstalledVoicesDesc: 'Bütün mövcud TTS səslərini göstər',
settingsLoading: 'Parametrlər yüklənir...',
settingsDarkMode: 'Qaranlıq rejim',
settingsDarkModeDesc: 'Qaranlıq mövzuya keç',
settingsSpeechRate: 'Danışıq sürəti',
settingsSpeechRateDesc: 'Tələffüz sürətini tənzimləyin',
settingsResetAll: 'Bütün parametrləri sıfırla',
settingsResetAllDesc: 'Defolt parametrləri bərpa et',
settingsResetConfirm: 'Sıfırlamaq istədiyinizə əminsiniz?',
settingsClearSearchHistory: 'Axtarış tarixçəsini təmizlə',
settingsClearSearchHistoryDesc: 'Bütün axtarış qeydlərini sil',
settingsRateApp: 'Tətbiqi qiymətləndir',
settingsSendFeedback: 'Rəy göndər',
settingsAppearance: 'Görünüş',
settingsDataStorage: 'Məlumat və yaddaş',
```

**Thai (th):**
```typescript
settingsInstalledVoices: 'เสียงที่ติดตั้ง',
settingsInstalledVoicesDesc: 'ดูเสียง TTS ทั้งหมดที่มี',
settingsLoading: 'กำลังโหลดการตั้งค่า...',
settingsDarkMode: 'โหมดมืด',
settingsDarkModeDesc: 'เปลี่ยนเป็นธีมมืด',
settingsSpeechRate: 'ความเร็วการพูด',
settingsSpeechRateDesc: 'ปรับความเร็วการออกเสียง',
settingsResetAll: 'รีเซ็ตการตั้งค่าทั้งหมด',
settingsResetAllDesc: 'คืนค่าการตั้งค่าเริ่มต้น',
settingsResetConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ต?',
settingsClearSearchHistory: 'ล้างประวัติการค้นหา',
settingsClearSearchHistoryDesc: 'ลบบันทึกการค้นหาทั้งหมด',
settingsRateApp: 'ให้คะแนนแอป',
settingsSendFeedback: 'ส่งความคิดเห็น',
settingsAppearance: 'รูปลักษณ์',
settingsDataStorage: 'ข้อมูลและที่เก็บ',
```

**Vietnamese (vi):**
```typescript
settingsInstalledVoices: 'Giọng nói đã cài',
settingsInstalledVoicesDesc: 'Xem tất cả giọng TTS có sẵn',
settingsLoading: 'Đang tải cài đặt...',
settingsDarkMode: 'Chế độ tối',
settingsDarkModeDesc: 'Chuyển sang giao diện tối',
settingsSpeechRate: 'Tốc độ nói',
settingsSpeechRateDesc: 'Điều chỉnh tốc độ phát âm',
settingsResetAll: 'Đặt lại tất cả cài đặt',
settingsResetAllDesc: 'Khôi phục cài đặt mặc định',
settingsResetConfirm: 'Bạn có chắc muốn đặt lại không?',
settingsClearSearchHistory: 'Xóa lịch sử tìm kiếm',
settingsClearSearchHistoryDesc: 'Xóa tất cả bản ghi tìm kiếm',
settingsRateApp: 'Đánh giá ứng dụng',
settingsSendFeedback: 'Gửi phản hồi',
settingsAppearance: 'Giao diện',
settingsDataStorage: 'Dữ liệu và lưu trữ',
```

**Indonesian (id):**
```typescript
settingsInstalledVoices: 'Suara Terpasang',
settingsInstalledVoicesDesc: 'Lihat semua suara TTS yang tersedia',
settingsLoading: 'Memuat pengaturan...',
settingsDarkMode: 'Mode Gelap',
settingsDarkModeDesc: 'Beralih ke tema gelap',
settingsSpeechRate: 'Kecepatan Bicara',
settingsSpeechRateDesc: 'Sesuaikan kecepatan pengucapan',
settingsResetAll: 'Atur Ulang Semua Pengaturan',
settingsResetAllDesc: 'Pulihkan pengaturan default',
settingsResetConfirm: 'Yakin ingin mengatur ulang?',
settingsClearSearchHistory: 'Hapus Riwayat Pencarian',
settingsClearSearchHistoryDesc: 'Hapus semua catatan pencarian',
settingsRateApp: 'Beri Rating Aplikasi',
settingsSendFeedback: 'Kirim Masukan',
settingsAppearance: 'Tampilan',
settingsDataStorage: 'Data & Penyimpanan',
```

**Malay (ms):**
```typescript
settingsInstalledVoices: 'Suara Dipasang',
settingsInstalledVoicesDesc: 'Lihat semua suara TTS yang tersedia',
settingsLoading: 'Memuatkan tetapan...',
settingsDarkMode: 'Mod Gelap',
settingsDarkModeDesc: 'Tukar ke tema gelap',
settingsSpeechRate: 'Kelajuan Pertuturan',
settingsSpeechRateDesc: 'Laraskan kelajuan sebutan',
settingsResetAll: 'Tetapkan Semula Semua Tetapan',
settingsResetAllDesc: 'Pulihkan tetapan lalai',
settingsResetConfirm: 'Pasti mahu tetapkan semula?',
settingsClearSearchHistory: 'Padam Sejarah Carian',
settingsClearSearchHistoryDesc: 'Padam semua rekod carian',
settingsRateApp: 'Nilai Aplikasi',
settingsSendFeedback: 'Hantar Maklum Balas',
settingsAppearance: 'Penampilan',
settingsDataStorage: 'Data & Storan',
```

**Persian (fa):**
```typescript
settingsInstalledVoices: 'صداهای نصب شده',
settingsInstalledVoicesDesc: 'مشاهده همه صداهای TTS موجود',
settingsLoading: 'در حال بارگذاری تنظیمات...',
settingsDarkMode: 'حالت تاریک',
settingsDarkModeDesc: 'تغییر به تم تاریک',
settingsSpeechRate: 'سرعت گفتار',
settingsSpeechRateDesc: 'تنظیم سرعت تلفظ',
settingsResetAll: 'بازنشانی همه تنظیمات',
settingsResetAllDesc: 'بازیابی تنظیمات پیش‌فرض',
settingsResetConfirm: 'آیا مطمئن هستید که می‌خواهید بازنشانی کنید؟',
settingsClearSearchHistory: 'پاک کردن تاریخچه جستجو',
settingsClearSearchHistoryDesc: 'حذف همه سوابق جستجو',
settingsRateApp: 'امتیاز دادن به برنامه',
settingsSendFeedback: 'ارسال بازخورد',
settingsAppearance: 'ظاهر',
settingsDataStorage: 'داده و ذخیره‌سازی',
```

**Urdu (ur):**
```typescript
settingsInstalledVoices: 'نصب شدہ آوازیں',
settingsInstalledVoicesDesc: 'تمام دستیاب TTS آوازیں دیکھیں',
settingsLoading: 'ترتیبات لوڈ ہو رہی ہیں...',
settingsDarkMode: 'ڈارک موڈ',
settingsDarkModeDesc: 'ڈارک تھیم پر سوئچ کریں',
settingsSpeechRate: 'تقریر کی رفتار',
settingsSpeechRateDesc: 'تلفظ کی رفتار کو ایڈجسٹ کریں',
settingsResetAll: 'تمام ترتیبات ری سیٹ کریں',
settingsResetAllDesc: 'ڈیفالٹ ترتیبات بحال کریں',
settingsResetConfirm: 'کیا آپ واقعی ری سیٹ کرنا چاہتے ہیں؟',
settingsClearSearchHistory: 'تلاش کی تاریخ صاف کریں',
settingsClearSearchHistoryDesc: 'تمام تلاش کے ریکارڈ حذف کریں',
settingsRateApp: 'ایپ کی درجہ بندی کریں',
settingsSendFeedback: 'رائے بھیجیں',
settingsAppearance: 'ظاہری شکل',
settingsDataStorage: 'ڈیٹا اور اسٹوریج',
```

**Ukrainian (uk):**
```typescript
settingsInstalledVoices: 'Встановлені голоси',
settingsInstalledVoicesDesc: 'Переглянути всі доступні TTS голоси',
settingsLoading: 'Завантаження налаштувань...',
settingsDarkMode: 'Темна тема',
settingsDarkModeDesc: 'Перемкнути на темну тему',
settingsSpeechRate: 'Швидкість мовлення',
settingsSpeechRateDesc: 'Налаштувати швидкість вимови',
settingsResetAll: 'Скинути всі налаштування',
settingsResetAllDesc: 'Відновити налаштування за замовчуванням',
settingsResetConfirm: 'Ви впевнені, що хочете скинути?',
settingsClearSearchHistory: 'Очистити історію пошуку',
settingsClearSearchHistoryDesc: 'Видалити всі записи пошуку',
settingsRateApp: 'Оцінити додаток',
settingsSendFeedback: 'Надіслати відгук',
settingsAppearance: 'Зовнішній вигляд',
settingsDataStorage: 'Дані та сховище',
```

**Polish (pl):**
```typescript
settingsInstalledVoices: 'Zainstalowane głosy',
settingsInstalledVoicesDesc: 'Zobacz wszystkie dostępne głosy TTS',
settingsLoading: 'Ładowanie ustawień...',
settingsDarkMode: 'Tryb ciemny',
settingsDarkModeDesc: 'Przełącz na ciemny motyw',
settingsSpeechRate: 'Szybkość mowy',
settingsSpeechRateDesc: 'Dostosuj szybkość wymowy',
settingsResetAll: 'Zresetuj wszystkie ustawienia',
settingsResetAllDesc: 'Przywróć ustawienia domyślne',
settingsResetConfirm: 'Czy na pewno chcesz zresetować?',
settingsClearSearchHistory: 'Wyczyść historię wyszukiwania',
settingsClearSearchHistoryDesc: 'Usuń wszystkie rekordy wyszukiwania',
settingsRateApp: 'Oceń aplikację',
settingsSendFeedback: 'Wyślij opinię',
settingsAppearance: 'Wygląd',
settingsDataStorage: 'Dane i pamięć',
```

**Dutch (nl):**
```typescript
settingsInstalledVoices: 'Geïnstalleerde stemmen',
settingsInstalledVoicesDesc: 'Bekijk alle beschikbare TTS-stemmen',
settingsLoading: 'Instellingen laden...',
settingsDarkMode: 'Donkere modus',
settingsDarkModeDesc: 'Schakel naar donker thema',
settingsSpeechRate: 'Spreeksnelheid',
settingsSpeechRateDesc: 'Pas uitspraaksnelheid aan',
settingsResetAll: 'Alle instellingen resetten',
settingsResetAllDesc: 'Standaardinstellingen herstellen',
settingsResetConfirm: 'Weet u zeker dat u wilt resetten?',
settingsClearSearchHistory: 'Zoekgeschiedenis wissen',
settingsClearSearchHistoryDesc: 'Alle zoekrecords verwijderen',
settingsRateApp: 'App beoordelen',
settingsSendFeedback: 'Feedback verzenden',
settingsAppearance: 'Uiterlijk',
settingsDataStorage: 'Gegevens en opslag',
```

**Kyrgyz (ky):**
```typescript
settingsInstalledVoices: 'Орнотулган үндөр',
settingsInstalledVoicesDesc: 'Бардык жеткиликтүү TTS үндөрүн көрүү',
settingsLoading: 'Орнотуулар жүктөлүүдө...',
settingsDarkMode: 'Караңгы режим',
settingsDarkModeDesc: 'Караңгы темага өтүү',
settingsSpeechRate: 'Сүйлөө ылдамдыгы',
settingsSpeechRateDesc: 'Айтуу ылдамдыгын тууралоо',
settingsResetAll: 'Бардык орнотууларды баштапкы абалга келтирүү',
settingsResetAllDesc: 'Демейки орнотууларды калыбына келтирүү',
settingsResetConfirm: 'Чындап эле баштапкы абалга келтиргиңиз келеби?',
settingsClearSearchHistory: 'Издөө тарыхын тазалоо',
settingsClearSearchHistoryDesc: 'Бардык издөө жазууларын өчүрүү',
settingsRateApp: 'Колдонмону баалоо',
settingsSendFeedback: 'Пикир жөнөтүү',
settingsAppearance: 'Көрүнүш',
settingsDataStorage: 'Маалыматтар жана сактоо',
```

**Tajik (tg):**
```typescript
settingsInstalledVoices: 'Овозҳои насбшуда',
settingsInstalledVoicesDesc: 'Дидани ҳамаи овозҳои TTS дастрас',
settingsLoading: 'Танзимот бор карда мешавад...',
settingsDarkMode: 'Режими торик',
settingsDarkModeDesc: 'Гузариш ба мавзӯи торик',
settingsSpeechRate: 'Суръати нутқ',
settingsSpeechRateDesc: 'Танзими суръати талаффуз',
settingsResetAll: 'Бозгардонии ҳамаи танзимот',
settingsResetAllDesc: 'Барқарор кардани танзимоти пешфарз',
settingsResetConfirm: 'Шумо боварӣ доред, ки мехоҳед бозгардонед?',
settingsClearSearchHistory: 'Тоза кардани таърихи ҷустуҷӯ',
settingsClearSearchHistoryDesc: 'Нест кардани ҳамаи сабтҳои ҷустуҷӯ',
settingsRateApp: 'Баҳо додан ба барнома',
settingsSendFeedback: 'Фиристодани фикру мулоҳиза',
settingsAppearance: 'Намуд',
settingsDataStorage: 'Маълумот ва захира',
```

**Armenian (hy):**
```typescript
settingsInstalledVoices: 'Տdelays delays',
settingsInstalledVoicesDesc: ' Delays delays TTS delays',
settingsLoading: 'Կdelays delays...',
settingsDarkMode: 'Մdelays delays',
settingsDarkModeDesc: 'Աdelays delays delays',
settingsSpeechRate: 'Խdelays delays',
settingsSpeechRateDesc: 'Կdelays delays delays',
settingsResetAll: 'Վdelays delays delays',
settingsResetAllDesc: 'Վdelays delays delays',
settingsResetConfirm: 'Վdelays delays delays?',
settingsClearSearchHistory: 'Մdelays delays delays',
settingsClearSearchHistoryDesc: ' Delays delays delays',
settingsRateApp: 'Գdelays delays',
settingsSendFeedback: 'Ուdelays delays',
settingsAppearance: 'Տdelays',
settingsDataStorage: 'Տdelays delays',
```

**Georgian (ka):**
```typescript
settingsInstalledVoices: 'დაყენებული ხმები',
settingsInstalledVoicesDesc: 'ყველა ხელმისაწვდომი TTS ხმის ნახვა',
settingsLoading: 'პარამეტრების ჩატვირთვა...',
settingsDarkMode: 'მუქი რეჟიმი',
settingsDarkModeDesc: 'მუქ თემაზე გადართვა',
settingsSpeechRate: 'მეტყველების სიჩქარე',
settingsSpeechRateDesc: 'წარმოთქმის სიჩქარის რეგულირება',
settingsResetAll: 'ყველა პარამეტრის გადატვირთვა',
settingsResetAllDesc: 'ნაგულისხმევი პარამეტრების აღდგენა',
settingsResetConfirm: 'დარწმუნებული ხართ, რომ გსურთ გადატვირთვა?',
settingsClearSearchHistory: 'ძიების ისტორიის გასუფთავება',
settingsClearSearchHistoryDesc: 'ყველა ძიების ჩანაწერის წაშლა',
settingsRateApp: 'აპის შეფასება',
settingsSendFeedback: 'უკუკავშირის გაგზავნა',
settingsAppearance: 'გარეგნობა',
settingsDataStorage: 'მონაცემები და საცავი',
```

**Pashto (ps):**
```typescript
settingsInstalledVoices: 'نصب شوي غږونه',
settingsInstalledVoicesDesc: 'ټول موجود TTS غږونه وګورئ',
settingsLoading: 'تنظیمات بار کیږي...',
settingsDarkMode: 'تیاره حالت',
settingsDarkModeDesc: 'تیارې موضوع ته لاړ شئ',
settingsSpeechRate: 'د خبرو سرعت',
settingsSpeechRateDesc: 'د تلفظ سرعت تنظیم کړئ',
settingsResetAll: 'ټول تنظیمات بیا تنظیم کړئ',
settingsResetAllDesc: 'ډیفالټ تنظیمات بحال کړئ',
settingsResetConfirm: 'ایا تاسو ډاډه یاست چې غواړئ بیا تنظیم کړئ؟',
settingsClearSearchHistory: 'د لټون تاریخ پاک کړئ',
settingsClearSearchHistoryDesc: 'د لټون ټول ریکارډونه حذف کړئ',
settingsRateApp: 'اپلیکیشن ته درجه ورکړئ',
settingsSendFeedback: 'نظر واستوئ',
settingsAppearance: 'بڼه',
settingsDataStorage: 'ډاټا او ذخیره',
```

---

### Task 3: Update Icon Colors in SettingsScreen.tsx

**Replace all `#FF8008` with semantic colors:**

```typescript
// Add at the top of SettingsScreen.tsx after imports
const SETTINGS_ICON_COLORS = {
  language: '#00A651',     // Green - Turkmenistan
  audio: '#3B82F6',        // Blue
  appearance: '#8B5CF6',   // Purple
  data: '#EF4444',         // Red
  info: '#6B7280',         // Gray
};
```

**Update each SettingsItem iconColor:**

| Section | Current Color | New Color |
|---------|---------------|-----------|
| Interface Language | `#FF8008` | `SETTINGS_ICON_COLORS.language` |
| Phrasebook Language | `#FF8008` | `SETTINGS_ICON_COLORS.language` |
| Sound Effects | `#FF8008` | `SETTINGS_ICON_COLORS.audio` |
| Test Voice | `#10B981` | `SETTINGS_ICON_COLORS.audio` |
| Check Voices | `#3B82F6` | `SETTINGS_ICON_COLORS.audio` |
| Installed Voices | `#8B5CF6` | `SETTINGS_ICON_COLORS.audio` |
| Font Size | `#FF8008` | `SETTINGS_ICON_COLORS.appearance` |
| Haptic Feedback | `#FF8008` | `SETTINGS_ICON_COLORS.appearance` |
| Clear History | `#EF4444` | `SETTINGS_ICON_COLORS.data` |
| About | `#6B7280` | `SETTINGS_ICON_COLORS.info` |

---

### Task 4: Add Dark Mode Toggle to UI

**Add in APPEARANCE section (after Font Size):**

```typescript
<SettingsItem
  icon="moon"
  iconColor={SETTINGS_ICON_COLORS.appearance}
  title={texts.settingsDarkMode ?? 'Dark Mode'}
  subtitle={texts.settingsDarkModeDesc ?? 'Switch to dark theme'}
  rightComponent={
    <Switch
      value={preferences.darkMode}
      onValueChange={() => handleTogglePreference('darkMode')}
      trackColor={{ false: '#D1D5DB', true: '#00A651' }}
      thumbColor="#FFFFFF"
    />
  }
/>
```

---

### Task 5: Add Speech Rate Setting

**Add in AUDIO section:**

```typescript
<SettingsItem
  icon="speedometer"
  iconColor={SETTINGS_ICON_COLORS.audio}
  title={texts.settingsSpeechRate ?? 'Speech Rate'}
  subtitle={`${preferences.speechRate}x`}
  onPress={() => setShowSpeechRateModal(true)}
  rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
/>
```

**Create SpeechRateModal component** (new file: `src/components/SpeechRateModal.tsx`):

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentRate: number;
  onSave: (rate: number) => void;
}

export default function SpeechRateModal({ visible, onClose, currentRate, onSave }: Props) {
  const [rate, setRate] = useState(currentRate);

  const testSpeed = () => {
    Speech.speak('Hello, this is a test.', { rate, language: 'en-US' });
  };

  const handleSave = () => {
    onSave(rate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Speech Rate</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.rateText}>{rate.toFixed(2)}x</Text>

            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.05}
              value={rate}
              onValueChange={setRate}
              minimumTrackTintColor="#00A651"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#00A651"
            />

            <View style={styles.labels}>
              <Text style={styles.label}>0.5x</Text>
              <Text style={styles.label}>1.0x</Text>
              <Text style={styles.label}>2.0x</Text>
            </View>

            <TouchableOpacity style={styles.testButton} onPress={testSpeed}>
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.testButtonText}>Test Speed</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  rateText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#00A651',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A651',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#00A651',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

---

### Task 6: Add Reset All Settings

**Add in DATA section:**

```typescript
<SettingsItem
  icon="refresh"
  iconColor={SETTINGS_ICON_COLORS.data}
  title={texts.settingsResetAll ?? 'Reset All Settings'}
  subtitle={texts.settingsResetAllDesc ?? 'Restore default settings'}
  onPress={() => {
    Alert.alert(
      texts.settingsResetAll ?? 'Reset All Settings',
      texts.settingsResetConfirm ?? 'Are you sure?',
      [
        { text: texts.cancel, style: 'cancel' },
        {
          text: texts.delete ?? 'Reset',
          style: 'destructive',
          onPress: async () => {
            // Reset preferences to defaults
            setPreferences(DEFAULT_PREFERENCES);

            // Clear all AsyncStorage settings
            await Promise.all(
              Object.values(SETTINGS_KEYS).map(key =>
                AsyncStorage.removeItem(key)
              )
            );

            Alert.alert('✅', texts.success ?? 'Settings reset successfully');
          }
        }
      ]
    );
  }}
  rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
/>
```

---

### Task 7: Add Clear Search History

**Add in DATA section:**

```typescript
<SettingsItem
  icon="search"
  iconColor={SETTINGS_ICON_COLORS.data}
  title={texts.settingsClearSearchHistory ?? 'Clear Search History'}
  subtitle={texts.settingsClearSearchHistoryDesc ?? 'Delete all search records'}
  onPress={() => {
    Alert.alert(
      texts.settingsClearSearchHistory ?? 'Clear Search History',
      texts.clearHistoryConfirm ?? 'This cannot be undone.',
      [
        { text: texts.cancel, style: 'cancel' },
        {
          text: texts.delete ?? 'Clear',
          style: 'destructive',
          onPress: () => {
            clearSearchHistory();
            Alert.alert('✅', texts.historyCleared ?? 'Search history cleared');
          }
        }
      ]
    );
  }}
  rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
/>
```

---

### Task 8: Replace Hardcoded Loading Text

**In the loading return block:**

```typescript
if (isLoading) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A651" />
        <Text style={styles.loadingText}>
          {texts.settingsLoading ?? 'Loading settings...'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

---

### Task 9: Update Section Headers

**Replace hardcoded section names with translated texts:**

```typescript
{/* Language Section */}
<SectionHeader title={texts.languageInterface ?? 'Language'} />

{/* Audio Section */}
<SectionHeader title={texts.audioSettings ?? 'Audio & Speech'} />

{/* Appearance Section */}
<SectionHeader title={texts.settingsAppearance ?? 'Appearance'} />

{/* Data Section */}
<SectionHeader title={texts.settingsDataStorage ?? 'Data & Storage'} />

{/* About Section */}
<SectionHeader title={texts.appInfo ?? 'About'} />
```

---

## Files Summary

| File | Action |
|------|--------|
| `src/contexts/LanguageContext.tsx` | Add 16 new translation fields + translations for 30 languages |
| `src/screens/SettingsScreen.tsx` | Update icon colors, add Dark Mode, Speech Rate, Reset, etc. |
| `src/components/SpeechRateModal.tsx` | Create new component |

---

## Testing Checklist

- [ ] All 30 languages display correctly
- [ ] Dark Mode toggle works (visual change not implemented yet)
- [ ] Speech Rate modal opens and saves
- [ ] Reset All Settings works
- [ ] Clear Search History works
- [ ] All icons have correct colors
- [ ] No hardcoded text remains
- [ ] Works on iOS and Android
