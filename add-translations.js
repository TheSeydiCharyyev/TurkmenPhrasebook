const fs = require('fs');
let content = fs.readFileSync('src/screens/AboutScreen.tsx', 'utf8');

const translations = {
  tk: { mission: 'Wezipe', features: 'Mümkinçilikler', contact: 'Habarlaşmak', specialThanks: 'Aýratyn minnetdarlyk', soon: 'Ýakynda', aboutSeries: 'Toplum barada', forEveryone: 'Hemmeler üçin', whatsNext: 'Indiki' },
  zh: { mission: '使命', features: '功能', contact: '联系方式', specialThanks: '特别感谢', soon: '即将推出', aboutSeries: '关于系列', forEveryone: '适合所有人', whatsNext: '下一步' },
  ru: { mission: 'Миссия', features: 'Функции', contact: 'Контакт', specialThanks: 'Особая благодарность', soon: 'Скоро', aboutSeries: 'О серии', forEveryone: 'Для всех', whatsNext: 'Что дальше' },
  en: { mission: 'Mission', features: 'Features', contact: 'Contact', specialThanks: 'Special Thanks', soon: 'Soon', aboutSeries: 'About Series', forEveryone: 'For Everyone', whatsNext: "What's Next" },
  ja: { mission: 'ミッション', features: '機能', contact: 'お問い合わせ', specialThanks: '特別な感謝', soon: '近日公開', aboutSeries: 'シリーズについて', forEveryone: 'みんなのために', whatsNext: '次は何' },
  ko: { mission: '미션', features: '기능', contact: '연락처', specialThanks: '특별한 감사', soon: '곧 출시', aboutSeries: '시리즈 소개', forEveryone: '모두를 위해', whatsNext: '다음은' },
  th: { mission: 'ภารกิจ', features: 'ฟีเจอร์', contact: 'ติดต่อ', specialThanks: 'ขอบคุณเป็นพิเศษ', soon: 'เร็วๆ นี้', aboutSeries: 'เกี่ยวกับซีรีส์', forEveryone: 'สำหรับทุกคน', whatsNext: 'ขั้นต่อไป' },
  vi: { mission: 'Sứ mệnh', features: 'Tính năng', contact: 'Liên hệ', specialThanks: 'Lời cảm ơn đặc biệt', soon: 'Sắp ra mắt', aboutSeries: 'Về bộ ứng dụng', forEveryone: 'Dành cho tất cả', whatsNext: 'Tiếp theo' },
  id: { mission: 'Misi', features: 'Fitur', contact: 'Kontak', specialThanks: 'Terima Kasih Khusus', soon: 'Segera', aboutSeries: 'Tentang Seri', forEveryone: 'Untuk Semua', whatsNext: 'Selanjutnya' },
  ms: { mission: 'Misi', features: 'Ciri-ciri', contact: 'Hubungi', specialThanks: 'Terima Kasih Khas', soon: 'Akan Datang', aboutSeries: 'Tentang Siri', forEveryone: 'Untuk Semua', whatsNext: 'Seterusnya' },
  hi: { mission: 'मिशन', features: 'सुविधाएं', contact: 'संपर्क', specialThanks: 'विशेष धन्यवाद', soon: 'जल्द आ रहा है', aboutSeries: 'सीरीज़ के बारे में', forEveryone: 'सभी के लिए', whatsNext: 'आगे क्या' },
  ar: { mission: 'المهمة', features: 'الميزات', contact: 'اتصل بنا', specialThanks: 'شكر خاص', soon: 'قريبًا', aboutSeries: 'عن السلسلة', forEveryone: 'للجميع', whatsNext: 'ما التالي' },
  fa: { mission: 'مأموریت', features: 'ویژگی‌ها', contact: 'تماس', specialThanks: 'تشکر ویژه', soon: 'به زودی', aboutSeries: 'درباره مجموعه', forEveryone: 'برای همه', whatsNext: 'بعدی چیست' },
  ur: { mission: 'مشن', features: 'خصوصیات', contact: 'رابطہ', specialThanks: 'خصوصی شکریہ', soon: 'جلد آرہا ہے', aboutSeries: 'سیریز کے بارے میں', forEveryone: 'سب کے لیے', whatsNext: 'آگے کیا' },
  ps: { mission: 'ماموریت', features: 'ځانګړتیاوې', contact: 'اړیکه', specialThanks: 'ځانګړی مننه', soon: 'ډیر ژر', aboutSeries: 'د لړۍ په اړه', forEveryone: 'د ټولو لپاره', whatsNext: 'بل څه' },
  tr: { mission: 'Misyon', features: 'Özellikler', contact: 'İletişim', specialThanks: 'Özel Teşekkürler', soon: 'Yakında', aboutSeries: 'Seri Hakkında', forEveryone: 'Herkes İçin', whatsNext: 'Sırada Ne Var' },
  az: { mission: 'Missiya', features: 'Xüsusiyyətlər', contact: 'Əlaqə', specialThanks: 'Xüsusi Təşəkkür', soon: 'Tezliklə', aboutSeries: 'Seriya haqqında', forEveryone: 'Hamı üçün', whatsNext: 'Növbəti nədir' },
  uz: { mission: 'Missiya', features: 'Xususiyatlar', contact: 'Aloqa', specialThanks: 'Maxsus minnatdorchilik', soon: 'Tez kunda', aboutSeries: 'Seriya haqida', forEveryone: 'Hamma uchun', whatsNext: 'Keyingisi nima' },
  kk: { mission: 'Миссия', features: 'Мүмкіндіктер', contact: 'Байланыс', specialThanks: 'Ерекше алғыс', soon: 'Жақында', aboutSeries: 'Серия туралы', forEveryone: 'Барлығына арналған', whatsNext: 'Келесі не' },
  ky: { mission: 'Миссия', features: 'Мүмкүнчүлүктөр', contact: 'Байланыш', specialThanks: 'Өзгөчө ыраазычылык', soon: 'Жакында', aboutSeries: 'Сериал жөнүндө', forEveryone: 'Баары үчүн', whatsNext: 'Кийинки эмне' },
  tg: { mission: 'Миссия', features: 'Хусусиятҳо', contact: 'Тамос', specialThanks: 'Ташаккури махсус', soon: 'Ба зудӣ', aboutSeries: 'Дар бораи силсила', forEveryone: 'Барои ҳама', whatsNext: 'Баъдӣ чӣ' },
  hy: { mission: 'Առdelays', features: 'Հdelay', contact: 'Կdelay', specialThanks: 'Delays', soon: 'Шdelay', aboutSeries: 'Delays', forEveryone: 'Delays', whatsNext: 'Delays' },
  ka: { mission: 'მისია', features: 'ფუნქციები', contact: 'კონტაქტი', specialThanks: 'განსაკუთრებული მადლობა', soon: 'მალე', aboutSeries: 'სერიის შესახებ', forEveryone: 'ყველასთვის', whatsNext: 'რა არის შემდეგ' },
  de: { mission: 'Mission', features: 'Funktionen', contact: 'Kontakt', specialThanks: 'Besonderer Dank', soon: 'Bald', aboutSeries: 'Über die Serie', forEveryone: 'Für alle', whatsNext: 'Was kommt als Nächstes' },
  fr: { mission: 'Mission', features: 'Fonctionnalités', contact: 'Contact', specialThanks: 'Remerciements spéciaux', soon: 'Bientôt', aboutSeries: 'À propos de la série', forEveryone: 'Pour tous', whatsNext: 'Et ensuite' },
  es: { mission: 'Misión', features: 'Características', contact: 'Contacto', specialThanks: 'Agradecimientos especiales', soon: 'Próximamente', aboutSeries: 'Sobre la serie', forEveryone: 'Para todos', whatsNext: 'Qué sigue' },
  it: { mission: 'Missione', features: 'Funzionalità', contact: 'Contatto', specialThanks: 'Ringraziamenti speciali', soon: 'Presto', aboutSeries: 'Informazioni sulla serie', forEveryone: 'Per tutti', whatsNext: 'Cosa viene dopo' },
  pt: { mission: 'Missão', features: 'Recursos', contact: 'Contato', specialThanks: 'Agradecimentos especiais', soon: 'Em breve', aboutSeries: 'Sobre a série', forEveryone: 'Para todos', whatsNext: 'O que vem a seguir' },
  pl: { mission: 'Misja', features: 'Funkcje', contact: 'Kontakt', specialThanks: 'Specjalne podziękowania', soon: 'Wkrótce', aboutSeries: 'O serii', forEveryone: 'Dla wszystkich', whatsNext: 'Co dalej' },
  nl: { mission: 'Missie', features: 'Functies', contact: 'Contact', specialThanks: 'Speciale dank', soon: 'Binnenkort', aboutSeries: 'Over de serie', forEveryone: 'Voor iedereen', whatsNext: 'Wat komt er nog' },
  uk: { mission: 'Місія', features: 'Функції', contact: 'Контакт', specialThanks: 'Особлива подяка', soon: 'Незабаром', aboutSeries: 'Про серію', forEveryone: 'Для всіх', whatsNext: 'Що далі' },
};

// Fix Armenian properly
translations.hy = {
  mission: 'Առdelays',
  features: 'Delays',
  contact: 'Delays',
  specialThanks: 'Delays',
  soon: 'Delays',
  aboutSeries: 'Delays',
  forEveryone: 'Delays',
  whatsNext: 'Delays'
};

// Use English for Armenian for now
translations.hy = {
  mission: 'Mission',
  features: 'Features',
  contact: 'Contact',
  specialThanks: 'Special Thanks',
  soon: 'Soon',
  aboutSeries: 'About Series',
  forEveryone: 'For Everyone',
  whatsNext: "What's Next"
};

for (const [lang, t] of Object.entries(translations)) {
  const pattern = new RegExp(`(${lang}: \\{[\\s\\S]*?seriesContent: '[^']*'),\\n(\\s+)\\}`, 'm');
  const match = content.match(pattern);
  if (match) {
    const indent = match[2];
    const whatsNextVal = t.whatsNext.includes("'") ? `"${t.whatsNext}"` : `'${t.whatsNext}'`;
    const newFields = `\n${indent}  mission: '${t.mission}',\n${indent}  features: '${t.features}',\n${indent}  contact: '${t.contact}',\n${indent}  specialThanks: '${t.specialThanks}',\n${indent}  soon: '${t.soon}',\n${indent}  aboutSeries: '${t.aboutSeries}',\n${indent}  forEveryone: '${t.forEveryone}',\n${indent}  whatsNext: ${whatsNextVal},`;
    content = content.replace(pattern, `$1,${newFields}\n$2}`);
    console.log('Added: ' + lang);
  } else {
    console.log('Not found: ' + lang);
  }
}

fs.writeFileSync('src/screens/AboutScreen.tsx', content);
console.log('Done!');
