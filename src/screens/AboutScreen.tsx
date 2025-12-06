// src/screens/AboutScreen.tsx - О приложении

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

type ModalType = 'authors' | 'series' | null;

export default function AboutScreen() {
  const navigation = useNavigation();
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();
  const { bottom: safeAreaBottom } = useSafeArea();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Тексты для разных языков
  const aboutTexts = {
    tk: {
      title: 'Programma barada',
      authors: 'Awtorlar barada',
      authorsDesc: 'Kim döretdi',
      series: 'Şapak programmalar toplumy',
      seriesDesc: 'Beýleki programmalar',
      version: 'Wersiýa',
      authorsContent: 'Şapak - Ykjam Terjime programmasy Türkmenistanyň Mary welaýatynyň Mary şäherinden Şapak Code Team topary tarapyndan döredildi.\n\nBiziň maksadymyz — türkmenlere we ýurdumyzyň myhmanlaryna dürli dillerde aňsat aragatnaşyk saklamaga kömek etmek.\n\nProgramma 31 dili goldaýar we söz kitabyny, terjimeçini we AI-kömekçilerini öz içine alýar.\n\nÝalňyşlyklar we teklipler üçin:\nshapak.app@gmail.com\n\nAýratyn minnetdarlyk Daňatarowa Gülhatyja, türkmen sesini ulanandygy üçin.',
      seriesContent: 'Şapak programmalary — ilki bilen Türkmenistanyň halkyna daşary ýurt dillerini öwrenmäge kömek edýän programmalar toplumydyr.\n\nBu programma türkmenistanlylar üçin niýetlenen hem bolsa, dünýäniň beýleki halklary hem aňsatlyk bilen ulanyp biler.\n\nŞapak - Ykjam Terjime bu toplumdaky ilkinji programmadyr. Ol söz kitaby, tekst we ses terjimeçisi hökmünde işleýär, öňdebaryjy AI funksiýalary bilen.\n\nToplumdaky beýleki programmalar işjeň işlenilýär — täzeliklerden habarly boluň!',
    },
    zh: {
      title: '关于应用',
      authors: '关于作者',
      authorsDesc: '谁创建了这个应用',
      series: 'Şapak 应用系列',
      seriesDesc: '其他应用',
      version: '版本',
      authorsContent: 'Şapak - Ykjam Terjime 由来自土库曼斯坦马雷州马雷市的 Şapak Code Team 团队开发。\n\n我们的目标是帮助土库曼人和国家的客人轻松地用不同语言进行交流。\n\n该应用支持31种语言，包括短语手册、翻译器和AI助手。\n\n错误和建议请联系：\nshapak.app@gmail.com\n\n特别感谢 Daňatarowa Gülhatyja 提供土库曼语配音。',
      seriesContent: 'Şapak 应用系列是一系列帮助土库曼斯坦人民学习外语的应用程序。\n\n虽然这款应用是为土库曼斯坦人设计的，但世界上其他国家的人也可以轻松使用。\n\nŞapak - Ykjam Terjime 是该系列的第一款应用，它具有短语手册、文本和语音翻译功能，以及先进的AI功能。\n\n该系列的其他应用正在积极开发中，敬请关注！',
    },
    ru: {
      title: 'О приложении',
      authors: 'Об авторах',
      authorsDesc: 'Кто создал приложение',
      series: 'Серия приложений Şapak',
      seriesDesc: 'Другие приложения',
      version: 'Версия',
      authorsContent: 'Şapak - Ykjam Terjime создано командой Şapak Code Team из города Мары, Марыйский велаят, Туркменистан.\n\nНаша цель — помочь туркменам и гостям страны легко общаться на разных языках.\n\nПриложение поддерживает 31 язык и включает разговорник, переводчик и AI-ассистентов.\n\nДля ошибок и предложений:\nshapak.app@gmail.com\n\nОсобая благодарность Daňatarowa Gülhatyja за использование её голоса в туркменском аудио.',
      seriesContent: 'Серия приложений Şapak — это серия приложений, которая в первую очередь помогает народу Туркменистана изучать иностранные языки.\n\nХотя это приложение предназначено для туркменистанцев, оно также легко может использоваться и другими народами планеты.\n\nŞapak - Ykjam Terjime — это первое приложение из серии. Оно выполняет функцию разговорника, текстового и голосового переводчика с передовыми ИИ-функциями.\n\nДругие приложения серии находятся в активной разработке — оставайтесь в курсе событий!',
    },
    en: {
      title: 'About',
      authors: 'About Authors',
      authorsDesc: 'Who created this app',
      series: 'Şapak App Series',
      seriesDesc: 'Other apps',
      version: 'Version',
      authorsContent: 'Şapak - Ykjam Terjime was created by Şapak Code Team from Mary city, Mary velayat, Turkmenistan.\n\nOur goal is to help Turkmens and guests of the country easily communicate in different languages.\n\nThe app supports 31 languages and includes a phrasebook, translator, and AI assistants.\n\nFor errors and suggestions:\nshapak.app@gmail.com\n\nSpecial thanks to Daňatarowa Gülhatyja for providing the Turkmen voice audio.',
      seriesContent: 'The Şapak app series is a collection of applications designed primarily to help the people of Turkmenistan learn foreign languages.\n\nAlthough this app is designed for Turkmen citizens, it can also be easily used by people from other countries around the world.\n\nŞapak - Ykjam Terjime is the first app in the series. It functions as a phrasebook, text and voice translator with advanced AI features.\n\nOther apps in the series are in active development — stay tuned!',
    },
    ja: {
      title: 'アプリについて',
      authors: '開発者について',
      authorsDesc: 'このアプリを作った人',
      series: 'Şapakアプリシリーズ',
      seriesDesc: '他のアプリ',
      version: 'バージョン',
      authorsContent: 'Şapak - Ykjam Terjimeは、トルクメニスタン、マリ州マリ市のŞapak Code Teamによって開発されました。\n\n私たちの目標は、トルクメン人と国の訪問者が様々な言語で簡単にコミュニケーションできるようにすることです。\n\nこのアプリは31言語をサポートし、フレーズブック、翻訳機、AIアシスタントを含んでいます。\n\nエラーや提案については：\nshapak.app@gmail.com\n\nトルクメン語の音声を提供してくださったDaňatarowa Gülhatyjaに特別な感謝を。',
      seriesContent: 'Şapakアプリシリーズは、主にトルクメニスタンの人々が外国語を学ぶのを助けるために設計されたアプリケーションのコレクションです。\n\nこのアプリはトルクメン市民向けに設計されていますが、世界中の他の国の人々も簡単に使用できます。\n\nŞapak - Ykjam Terjimeはシリーズの最初のアプリです。フレーズブック、テキストおよび音声翻訳機として機能し、高度なAI機能を備えています。\n\nシリーズの他のアプリは現在開発中です — お楽しみに！',
    },
    ko: {
      title: '앱 정보',
      authors: '개발자 소개',
      authorsDesc: '이 앱을 만든 사람',
      series: 'Şapak 앱 시리즈',
      seriesDesc: '다른 앱들',
      version: '버전',
      authorsContent: 'Şapak - Ykjam Terjime은 투르크메니스탄 마리 주 마리 시의 Şapak Code Team이 개발했습니다.\n\n우리의 목표는 투르크멘인과 방문객들이 다양한 언어로 쉽게 소통할 수 있도록 돕는 것입니다.\n\n이 앱은 31개 언어를 지원하며 회화집, 번역기, AI 어시스턴트를 포함합니다.\n\n오류 및 제안사항:\nshapak.app@gmail.com\n\n투르크멘어 음성을 제공해 주신 Daňatarowa Gülhatyja님께 특별히 감사드립니다.',
      seriesContent: 'Şapak 앱 시리즈는 주로 투르크메니스탄 사람들이 외국어를 배울 수 있도록 설계된 애플리케이션 모음입니다.\n\n이 앱은 투르크멘 시민을 위해 설계되었지만 전 세계 다른 나라 사람들도 쉽게 사용할 수 있습니다.\n\nŞapak - Ykjam Terjime은 시리즈의 첫 번째 앱입니다. 회화집, 텍스트 및 음성 번역기로 작동하며 고급 AI 기능을 갖추고 있습니다.\n\n시리즈의 다른 앱들은 현재 개발 중입니다 — 계속 지켜봐 주세요!',
    },
    th: {
      title: 'เกี่ยวกับแอป',
      authors: 'เกี่ยวกับผู้พัฒนา',
      authorsDesc: 'ใครสร้างแอปนี้',
      series: 'ซีรีส์แอป Şapak',
      seriesDesc: 'แอปอื่นๆ',
      version: 'เวอร์ชัน',
      authorsContent: 'Şapak - Ykjam Terjime พัฒนาโดยทีม Şapak Code Team จากเมืองแมรี จังหวัดแมรี ประเทศเติร์กเมนิสถาน\n\nเป้าหมายของเราคือช่วยให้ชาวเติร์กเมนและผู้มาเยือนสื่อสารในภาษาต่างๆ ได้อย่างง่ายดาย\n\nแอปนี้รองรับ 31 ภาษา และรวมถึงหนังสือวลี นักแปล และผู้ช่วย AI\n\nสำหรับข้อผิดพลาดและข้อเสนอแนะ:\nshapak.app@gmail.com\n\nขอขอบคุณเป็นพิเศษแก่ Daňatarowa Gülhatyja สำหรับการให้เสียงภาษาเติร์กเมน',
      seriesContent: 'ซีรีส์แอป Şapak คือชุดแอปพลิเคชันที่ออกแบบมาเพื่อช่วยให้ประชาชนเติร์กเมนิสถานเรียนรู้ภาษาต่างประเทศเป็นหลัก\n\nแม้ว่าแอปนี้ออกแบบมาสำหรับพลเมืองเติร์กเมน แต่ผู้คนจากประเทศอื่นๆ ทั่วโลกก็สามารถใช้งานได้อย่างง่ายดาย\n\nŞapak - Ykjam Terjime เป็นแอปแรกในซีรีส์ ทำหน้าที่เป็นหนังสือวลี นักแปลข้อความและเสียงพร้อมฟีเจอร์ AI ขั้นสูง\n\nแอปอื่นๆ ในซีรีส์อยู่ในระหว่างการพัฒนา — คอยติดตาม!',
    },
    vi: {
      title: 'Về ứng dụng',
      authors: 'Về tác giả',
      authorsDesc: 'Ai đã tạo ứng dụng này',
      series: 'Bộ ứng dụng Şapak',
      seriesDesc: 'Các ứng dụng khác',
      version: 'Phiên bản',
      authorsContent: 'Şapak - Ykjam Terjime được phát triển bởi Şapak Code Team từ thành phố Mary, tỉnh Mary, Turkmenistan.\n\nMục tiêu của chúng tôi là giúp người Turkmen và du khách giao tiếp dễ dàng bằng nhiều ngôn ngữ khác nhau.\n\nỨng dụng hỗ trợ 31 ngôn ngữ và bao gồm sổ tay hội thoại, trình dịch và trợ lý AI.\n\nĐể báo lỗi và góp ý:\nshapak.app@gmail.com\n\nĐặc biệt cảm ơn Daňatarowa Gülhatyja đã cung cấp giọng nói tiếng Turkmen.',
      seriesContent: 'Bộ ứng dụng Şapak là tập hợp các ứng dụng được thiết kế chủ yếu để giúp người dân Turkmenistan học ngoại ngữ.\n\nMặc dù ứng dụng này được thiết kế cho công dân Turkmen, nhưng người dân từ các quốc gia khác trên thế giới cũng có thể dễ dàng sử dụng.\n\nŞapak - Ykjam Terjime là ứng dụng đầu tiên trong bộ. Nó hoạt động như sổ tay hội thoại, trình dịch văn bản và giọng nói với các tính năng AI tiên tiến.\n\nCác ứng dụng khác trong bộ đang được phát triển — hãy theo dõi!',
    },
    id: {
      title: 'Tentang Aplikasi',
      authors: 'Tentang Pengembang',
      authorsDesc: 'Siapa yang membuat aplikasi ini',
      series: 'Seri Aplikasi Şapak',
      seriesDesc: 'Aplikasi lainnya',
      version: 'Versi',
      authorsContent: 'Şapak - Ykjam Terjime dikembangkan oleh Şapak Code Team dari kota Mary, provinsi Mary, Turkmenistan.\n\nTujuan kami adalah membantu orang Turkmen dan pengunjung berkomunikasi dengan mudah dalam berbagai bahasa.\n\nAplikasi ini mendukung 31 bahasa dan mencakup buku frasa, penerjemah, dan asisten AI.\n\nUntuk kesalahan dan saran:\nshapak.app@gmail.com\n\nTerima kasih khusus kepada Daňatarowa Gülhatyja atas penyediaan suara bahasa Turkmen.',
      seriesContent: 'Seri Aplikasi Şapak adalah kumpulan aplikasi yang dirancang terutama untuk membantu rakyat Turkmenistan belajar bahasa asing.\n\nMeskipun aplikasi ini dirancang untuk warga Turkmen, orang-orang dari negara lain di seluruh dunia juga dapat dengan mudah menggunakannya.\n\nŞapak - Ykjam Terjime adalah aplikasi pertama dalam seri ini. Berfungsi sebagai buku frasa, penerjemah teks dan suara dengan fitur AI canggih.\n\nAplikasi lain dalam seri ini sedang dalam pengembangan aktif — nantikan!',
    },
    ms: {
      title: 'Tentang Aplikasi',
      authors: 'Tentang Pembangun',
      authorsDesc: 'Siapa yang membuat aplikasi ini',
      series: 'Siri Aplikasi Şapak',
      seriesDesc: 'Aplikasi lain',
      version: 'Versi',
      authorsContent: 'Şapak - Ykjam Terjime dibangunkan oleh Şapak Code Team dari bandar Mary, wilayah Mary, Turkmenistan.\n\nMatlamat kami adalah membantu orang Turkmen dan pelawat berkomunikasi dengan mudah dalam pelbagai bahasa.\n\nAplikasi ini menyokong 31 bahasa dan termasuk buku frasa, penterjemah, dan pembantu AI.\n\nUntuk kesilapan dan cadangan:\nshapak.app@gmail.com\n\nTerima kasih khas kepada Daňatarowa Gülhatyja kerana menyediakan suara bahasa Turkmen.',
      seriesContent: 'Siri Aplikasi Şapak adalah koleksi aplikasi yang direka terutamanya untuk membantu rakyat Turkmenistan mempelajari bahasa asing.\n\nWalaupun aplikasi ini direka untuk warganegara Turkmen, orang dari negara lain di seluruh dunia juga boleh menggunakannya dengan mudah.\n\nŞapak - Ykjam Terjime adalah aplikasi pertama dalam siri ini. Ia berfungsi sebagai buku frasa, penterjemah teks dan suara dengan ciri AI canggih.\n\nAplikasi lain dalam siri ini sedang dalam pembangunan aktif — nantikan!',
    },
    hi: {
      title: 'ऐप के बारे में',
      authors: 'डेवलपर्स के बारे में',
      authorsDesc: 'इस ऐप को किसने बनाया',
      series: 'Şapak ऐप सीरीज़',
      seriesDesc: 'अन्य ऐप्स',
      version: 'संस्करण',
      authorsContent: 'Şapak - Ykjam Terjime को तुर्कमेनिस्तान के मैरी शहर, मैरी प्रांत की Şapak Code Team द्वारा विकसित किया गया था।\n\nहमारा लक्ष्य तुर्कमेन लोगों और आगंतुकों को विभिन्न भाषाओं में आसानी से संवाद करने में मदद करना है।\n\nयह ऐप 31 भाषाओं का समर्थन करता है और इसमें वाक्यांश पुस्तक, अनुवादक और AI सहायक शामिल हैं।\n\nत्रुटियों और सुझावों के लिए:\nshapak.app@gmail.com\n\nतुर्कमेन आवाज़ प्रदान करने के लिए Daňatarowa Gülhatyja को विशेष धन्यवाद।',
      seriesContent: 'Şapak ऐप सीरीज़ मुख्य रूप से तुर्कमेनिस्तान के लोगों को विदेशी भाषाएं सीखने में मदद करने के लिए डिज़ाइन किए गए एप्लिकेशन का संग्रह है।\n\nहालांकि यह ऐप तुर्कमेन नागरिकों के लिए डिज़ाइन किया गया है, दुनिया भर के अन्य देशों के लोग भी इसे आसानी से उपयोग कर सकते हैं।\n\nŞapak - Ykjam Terjime सीरीज़ का पहला ऐप है। यह उन्नत AI सुविधाओं के साथ वाक्यांश पुस्तक, टेक्स्ट और वॉयस ट्रांसलेटर के रूप में कार्य करता है।\n\nसीरीज़ के अन्य ऐप्स सक्रिय विकास में हैं — बने रहें!',
    },
    ar: {
      title: 'حول التطبيق',
      authors: 'حول المطورين',
      authorsDesc: 'من أنشأ هذا التطبيق',
      series: 'سلسلة تطبيقات Şapak',
      seriesDesc: 'تطبيقات أخرى',
      version: 'الإصدار',
      authorsContent: 'تم تطوير Şapak - Ykjam Terjime بواسطة فريق Şapak Code Team من مدينة ماري، ولاية ماري، تركمانستان.\n\nهدفنا هو مساعدة التركمان والزوار على التواصل بسهولة بلغات مختلفة.\n\nيدعم التطبيق 31 لغة ويتضمن كتاب العبارات والمترجم ومساعدي الذكاء الاصطناعي.\n\nللأخطاء والاقتراحات:\nshapak.app@gmail.com\n\nشكر خاص لـ Daňatarowa Gülhatyja لتوفير الصوت التركماني.',
      seriesContent: 'سلسلة تطبيقات Şapak هي مجموعة من التطبيقات المصممة بشكل أساسي لمساعدة شعب تركمانستان على تعلم اللغات الأجنبية.\n\nعلى الرغم من أن هذا التطبيق مصمم للمواطنين التركمان، إلا أنه يمكن للأشخاص من البلدان الأخرى حول العالم استخدامه بسهولة أيضًا.\n\nŞapak - Ykjam Terjime هو التطبيق الأول في السلسلة. يعمل ككتاب عبارات ومترجم نصي وصوتي مع ميزات الذكاء الاصطناعي المتقدمة.\n\nالتطبيقات الأخرى في السلسلة قيد التطوير النشط - ترقبوا!',
    },
    fa: {
      title: 'درباره برنامه',
      authors: 'درباره توسعه‌دهندگان',
      authorsDesc: 'چه کسی این برنامه را ساخت',
      series: 'مجموعه برنامه‌های Şapak',
      seriesDesc: 'برنامه‌های دیگر',
      version: 'نسخه',
      authorsContent: 'Şapak - Ykjam Terjime توسط تیم Şapak Code Team از شهر ماری، استان ماری، ترکمنستان توسعه داده شده است.\n\nهدف ما کمک به ترکمن‌ها و بازدیدکنندگان برای برقراری ارتباط آسان به زبان‌های مختلف است.\n\nاین برنامه از 31 زبان پشتیبانی می‌کند و شامل کتاب عبارات، مترجم و دستیاران هوش مصنوعی است.\n\nبرای خطاها و پیشنهادات:\nshapak.app@gmail.com\n\nتشکر ویژه از Daňatarowa Gülhatyja برای ارائه صدای ترکمنی.',
      seriesContent: 'مجموعه برنامه‌های Şapak مجموعه‌ای از برنامه‌ها است که عمدتاً برای کمک به مردم ترکمنستان در یادگیری زبان‌های خارجی طراحی شده است.\n\nاگرچه این برنامه برای شهروندان ترکمن طراحی شده است، اما مردم کشورهای دیگر در سراسر جهان نیز می‌توانند به راحتی از آن استفاده کنند.\n\nŞapak - Ykjam Terjime اولین برنامه در این مجموعه است. این برنامه به عنوان کتاب عبارات، مترجم متن و صدا با ویژگی‌های پیشرفته هوش مصنوعی عمل می‌کند.\n\nبرنامه‌های دیگر در این مجموعه در حال توسعه فعال هستند - منتظر باشید!',
    },
    ur: {
      title: 'ایپ کے بارے میں',
      authors: 'ڈویلپرز کے بارے میں',
      authorsDesc: 'اس ایپ کو کس نے بنایا',
      series: 'Şapak ایپ سیریز',
      seriesDesc: 'دیگر ایپس',
      version: 'ورژن',
      authorsContent: 'Şapak - Ykjam Terjime کو ترکمانستان کے شہر ماری، صوبہ ماری کی Şapak Code Team نے تیار کیا۔\n\nہمارا مقصد ترکمان لوگوں اور مہمانوں کو مختلف زبانوں میں آسانی سے بات چیت کرنے میں مدد کرنا ہے۔\n\nیہ ایپ 31 زبانوں کی حمایت کرتی ہے اور اس میں فقرات کی کتاب، مترجم اور AI معاونین شامل ہیں۔\n\nغلطیوں اور تجاویز کے لیے:\nshapak.app@gmail.com\n\nترکمان آواز فراہم کرنے کے لیے Daňatarowa Gülhatyja کا خصوصی شکریہ۔',
      seriesContent: 'Şapak ایپ سیریز ایپلیکیشنز کا ایک مجموعہ ہے جو بنیادی طور پر ترکمانستان کے لوگوں کو غیر ملکی زبانیں سیکھنے میں مدد کے لیے ڈیزائن کیا گیا ہے۔\n\nاگرچہ یہ ایپ ترکمان شہریوں کے لیے ڈیزائن کی گئی ہے، دنیا بھر کے دیگر ممالک کے لوگ بھی اسے آسانی سے استعمال کر سکتے ہیں۔\n\nŞapak - Ykjam Terjime سیریز کی پہلی ایپ ہے۔ یہ جدید AI خصوصیات کے ساتھ فقرات کی کتاب، ٹیکسٹ اور وائس ٹرانسلیٹر کے طور پر کام کرتی ہے۔\n\nسیریز کی دیگر ایپس فعال ترقی میں ہیں - دیکھتے رہیں!',
    },
    ps: {
      title: 'د اپلیکیشن په اړه',
      authors: 'د جوړونکو په اړه',
      authorsDesc: 'چا دا اپلیکیشن جوړ کړ',
      series: 'د Şapak اپلیکیشن لړۍ',
      seriesDesc: 'نور اپلیکیشنونه',
      version: 'نسخه',
      authorsContent: 'Şapak - Ykjam Terjime د ترکمنستان د ماري ښار، ماري ولایت څخه د Şapak Code Team لخوا جوړ شوی.\n\nزموږ هدف دا دی چې ترکمنانو او میلمنو سره مرسته وکړو چې په مختلفو ژبو کې په اسانۍ سره اړیکه ونیسي.\n\nدا اپلیکیشن 31 ژبې ملاتړ کوي او د جملو کتاب، ژباړونکی او AI مرستندویان لري.\n\nد غلطیو او وړاندیزونو لپاره:\nshapak.app@gmail.com\n\nد ترکمني غږ چمتو کولو لپاره Daňatarowa Gülhatyja ته ځانګړی مننه.',
      seriesContent: 'د Şapak اپلیکیشن لړۍ د اپلیکیشنونو یوه ټولګه ده چې په عمده توګه د ترکمنستان خلکو سره مرسته کوي چې بهرنۍ ژبې زده کړي.\n\nکه څه هم دا اپلیکیشن د ترکمان اتباعو لپاره ډیزاین شوی، د نړۍ له نورو هیوادونو خلک هم کولی شي په اسانۍ سره یې وکاروي.\n\nŞapak - Ykjam Terjime په لړۍ کې لومړی اپلیکیشن دی. دا د پرمختللو AI ځانګړتیاوو سره د جملو کتاب، متن او غږ ژباړونکي په توګه کار کوي.\n\nپه لړۍ کې نور اپلیکیشنونه په فعاله پرمختګ کې دي - تماشه کوئ!',
    },
    tr: {
      title: 'Uygulama Hakkında',
      authors: 'Geliştiriciler Hakkında',
      authorsDesc: 'Bu uygulamayı kim yaptı',
      series: 'Şapak Uygulama Serisi',
      seriesDesc: 'Diğer uygulamalar',
      version: 'Sürüm',
      authorsContent: 'Şapak - Ykjam Terjime, Türkmenistan\'ın Mary vilayeti Mary şehrinden Şapak Code Team tarafından geliştirilmiştir.\n\nAmacımız, Türkmenlerin ve ziyaretçilerin farklı dillerde kolayca iletişim kurmasına yardımcı olmaktır.\n\nUygulama 31 dili destekler ve konuşma kılavuzu, çevirmen ve yapay zeka asistanları içerir.\n\nHatalar ve öneriler için:\nshapak.app@gmail.com\n\nTürkmen sesi sağladığı için Daňatarowa Gülhatyja\'ya özel teşekkürler.',
      seriesContent: 'Şapak Uygulama Serisi, öncelikle Türkmenistan halkının yabancı dil öğrenmesine yardımcı olmak için tasarlanmış bir uygulama koleksiyonudur.\n\nBu uygulama Türkmen vatandaşları için tasarlanmış olsa da, dünyanın diğer ülkelerinden insanlar da kolayca kullanabilir.\n\nŞapak - Ykjam Terjime serideki ilk uygulamadır. Gelişmiş yapay zeka özellikleriyle konuşma kılavuzu, metin ve ses çevirmeni olarak çalışır.\n\nSerideki diğer uygulamalar aktif geliştirme aşamasındadır — takipte kalın!',
    },
    az: {
      title: 'Tətbiq haqqında',
      authors: 'Tərtibatçılar haqqında',
      authorsDesc: 'Bu tətbiqi kim yaratdı',
      series: 'Şapak Tətbiq Seriyası',
      seriesDesc: 'Digər tətbiqlər',
      version: 'Versiya',
      authorsContent: 'Şapak - Ykjam Terjime Türkmənistanın Mary vilayəti Mary şəhərindən Şapak Code Team tərəfindən hazırlanmışdır.\n\nMəqsədimiz türkmənlərə və qonaqlara müxtəlif dillərdə asanlıqla ünsiyyət qurmağa kömək etməkdir.\n\nTətbiq 31 dili dəstəkləyir və ifadə kitabı, tərcüməçi və süni intellekt köməkçilərini əhatə edir.\n\nXətalar və təkliflər üçün:\nshapak.app@gmail.com\n\nTürkmən səsini təqdim etdiyi üçün Daňatarowa Gülhatyja-ya xüsusi təşəkkür.',
      seriesContent: 'Şapak Tətbiq Seriyası ilk növbədə Türkmənistan xalqının xarici dillər öyrənməsinə kömək etmək üçün hazırlanmış tətbiqlər toplusudur.\n\nBu tətbiq türkmən vətəndaşları üçün hazırlanmış olsa da, dünyanın digər ölkələrindən insanlar da asanlıqla istifadə edə bilər.\n\nŞapak - Ykjam Terjime seriyadakı ilk tətbiqdir. Qabaqcıl süni intellekt xüsusiyyətləri ilə ifadə kitabı, mətn və səs tərcüməçisi kimi işləyir.\n\nSeriyadakı digər tətbiqlər aktiv inkişaf mərhələsindədir — izləyin!',
    },
    uz: {
      title: 'Ilova haqida',
      authors: 'Ishlab chiquvchilar haqida',
      authorsDesc: 'Bu ilovani kim yaratdi',
      series: 'Şapak Ilova Seriyasi',
      seriesDesc: 'Boshqa ilovalar',
      version: 'Versiya',
      authorsContent: 'Şapak - Ykjam Terjime Turkmanistonning Mari viloyati Mari shahridan Şapak Code Team tomonidan ishlab chiqilgan.\n\nBizning maqsadimiz - turkman xalqi va mehmonlarga turli tillarda oson muloqot qilishga yordam berish.\n\nIlova 31 tilni qo\'llab-quvvatlaydi va iboralar kitobi, tarjimon va AI yordamchilarini o\'z ichiga oladi.\n\nXatolar va takliflar uchun:\nshapak.app@gmail.com\n\nTurkman ovozini taqdim etgani uchun Daňatarowa Gülhatyja-ga alohida rahmat.',
      seriesContent: 'Şapak Ilova Seriyasi - bu birinchi navbatda Turkmaniston xalqiga chet tillarini o\'rganishda yordam berish uchun mo\'ljallangan ilovalar to\'plami.\n\nBu ilova turkman fuqarolari uchun mo\'ljallangan bo\'lsa-da, dunyo bo\'ylab boshqa mamlakatlar odamlari ham osongina foydalanishi mumkin.\n\nŞapak - Ykjam Terjime seriyadagi birinchi ilova. U ilg\'or AI xususiyatlari bilan iboralar kitobi, matn va ovoz tarjimoni sifatida ishlaydi.\n\nSeriyadagi boshqa ilovalar faol ishlab chiqilmoqda — kuzatib boring!',
    },
    kk: {
      title: 'Қолданба туралы',
      authors: 'Әзірлеушілер туралы',
      authorsDesc: 'Бұл қолданбаны кім жасады',
      series: 'Şapak қолданба сериясы',
      seriesDesc: 'Басқа қолданбалар',
      version: 'Нұсқа',
      authorsContent: 'Şapak - Ykjam Terjime Түрікменстанның Мары облысы Мары қаласынан Şapak Code Team командасы әзірледі.\n\nБіздің мақсатымыз - түрікмендер мен қонақтарға әртүрлі тілдерде оңай сөйлесуге көмектесу.\n\nҚолданба 31 тілді қолдайды және сөйлемдер кітабын, аудармашыны және AI көмекшілерін қамтиды.\n\nҚателер мен ұсыныстар үшін:\nshapak.app@gmail.com\n\nТүрікмен дауысын бергені үшін Daňatarowa Gülhatyja-ға ерекше рахмет.',
      seriesContent: 'Şapak қолданба сериясы - бұл ең алдымен Түрікменстан халқына шет тілдерін үйренуге көмектесу үшін жасалған қолданбалар жиынтығы.\n\nБұл қолданба түрікмен азаматтары үшін жасалғанымен, әлемнің басқа елдерінің адамдары да оңай пайдалана алады.\n\nŞapak - Ykjam Terjime сериядағы бірінші қолданба. Ол озық AI мүмкіндіктерімен сөйлемдер кітабы, мәтін және дауыс аудармашысы ретінде жұмыс істейді.\n\nСериядағы басқа қолданбалар белсенді әзірлеу кезеңінде — қадағалап отырыңыз!',
    },
    ky: {
      title: 'Колдонмо жөнүндө',
      authors: 'Иштеп чыгуучулар жөнүндө',
      authorsDesc: 'Бул колдонмону ким жасады',
      series: 'Şapak колдонмо сериясы',
      seriesDesc: 'Башка колдонмолор',
      version: 'Версия',
      authorsContent: 'Şapak - Ykjam Terjime Түркмөнстандын Мары облусу Мары шаарынан Şapak Code Team тарабынан иштелип чыккан.\n\nБиздин максатыбыз - түркмөндөргө жана конокторго ар кандай тилдерде оңой баарлашууга жардам берүү.\n\nКолдонмо 31 тилди колдойт жана сүйлөмдөр китебин, котормочуну жана AI жардамчыларын камтыйт.\n\nКаталар жана сунуштар үчүн:\nshapak.app@gmail.com\n\nТүркмөн үнүн бергени үчүн Daňatarowa Gülhatyja-га өзгөчө ыраазычылык.',
      seriesContent: 'Şapak колдонмо сериясы - бул биринчи кезекте Түркмөнстан элине чет тилдерин үйрөнүүгө жардам берүү үчүн иштелип чыккан колдонмолор жыйнагы.\n\nБул колдонмо түркмөн жарандары үчүн иштелип чыккан болсо да, дүйнөнүн башка өлкөлөрүнүн адамдары да оңой колдоно алышат.\n\nŞapak - Ykjam Terjime сериядагы биринчи колдонмо. Ал өнүккөн AI мүмкүнчүлүктөрү менен сүйлөмдөр китеби, текст жана үн котормочусу катары иштейт.\n\nСериядагы башка колдонмолор активдүү иштелип чыгууда — байкап туруңуз!',
    },
    tg: {
      title: 'Дар бораи барнома',
      authors: 'Дар бораи таҳиягарон',
      authorsDesc: 'Ин барномаро кӣ сохт',
      series: 'Силсилаи барномаҳои Şapak',
      seriesDesc: 'Барномаҳои дигар',
      version: 'Версия',
      authorsContent: 'Şapak - Ykjam Terjime аз ҷониби дастаи Şapak Code Team аз шаҳри Мари, вилояти Мари, Туркманистон таҳия шудааст.\n\nҲадафи мо - кӯмак ба туркманҳо ва меҳмонон барои муоширати осон бо забонҳои гуногун.\n\nБарнома 31 забонро дастгирӣ мекунад ва китоби ибораҳо, тарҷумон ва дастёрони AI-ро дар бар мегирад.\n\nБарои хатоҳо ва пешниҳодҳо:\nshapak.app@gmail.com\n\nТашаккури махсус ба Daňatarowa Gülhatyja барои пешниҳоди овози туркманӣ.',
      seriesContent: 'Силсилаи барномаҳои Şapak маҷмӯаи барномаҳоест, ки пеш аз ҳама барои кӯмак ба мардуми Туркманистон дар омӯзиши забонҳои хориҷӣ таҳия шудааст.\n\nГарчанде ки ин барнома барои шаҳрвандони туркман таҳия шудааст, мардуми кишварҳои дигари ҷаҳон низ метавонанд онро ба осонӣ истифода баранд.\n\nŞapak - Ykjam Terjime аввалин барнома дар силсила аст. Он ҳамчун китоби ибораҳо, тарҷумони матн ва овоз бо хусусиятҳои пешрафтаи AI кор мекунад.\n\nБарномаҳои дигар дар силсила дар марҳилаи таҳияи фаъол қарор доранд — пайгирӣ кунед!',
    },
    hy: {
      title: 'Հdelays մասdelays',
      authors: 'Ծdelays մասdelays',
      authorsDesc: ' Delays delays delays այdelays',
      series: 'Şapak delays delays',
      seriesDesc: 'Այdelays delays',
      version: 'Տdelays',
      authorsContent: 'Şapak - Ykjam Terjime- delays delays է Şapak Code Team delays delays Մdelays, Մделaydelays, Թdelays.\n\ndelays delays - delays Թdelays delays delays delays delays delays delays delays delays delays.\n\ndelays delays 31 delays delays delays delays, delays delays AI delays.\n\ndelays delays delays:\nshapak.app@gmail.com\n\ndelays delays Daňatarowa Gülhatyja-delays delays delays delays delays.',
      seriesContent: 'Şapak delays delays — delays delays delays, delays delays Թdelays delays delays delays delays delays delays.\n\ndelay delays delays delays delays, delays delays delays delays delays delays delays.\n\nŞapak - Ykjam Terjime delays delays delays delays. delays delays delays, delays delays delays delays AI delays.\n\ndelays delays delays delays delays — delays delays!',
    },
    ka: {
      title: 'აპლიკაციის შესახებ',
      authors: 'დეველოპერების შესახებ',
      authorsDesc: 'ვინ შექმნა ეს აპლიკაცია',
      series: 'Şapak აპლიკაციების სერია',
      seriesDesc: 'სხვა აპლიკაციები',
      version: 'ვერსია',
      authorsContent: 'Şapak - Ykjam Terjime შეიქმნა Şapak Code Team-ის მიერ მარის ქალაქიდან, მარის რეგიონი, თურქმენეთი.\n\nჩვენი მიზანია დავეხმაროთ თურქმენებს და სტუმრებს სხვადასხვა ენაზე მარტივად კომუნიკაციაში.\n\nაპლიკაცია მხარს უჭერს 31 ენას და მოიცავს ფრაზების წიგნს, მთარგმნელს და AI ასისტენტებს.\n\nშეცდომებისა და წინადადებებისთვის:\nshapak.app@gmail.com\n\nგანსაკუთრებული მადლობა Daňatarowa Gülhatyja-ს თურქმენული ხმის უზრუნველყოფისთვის.',
      seriesContent: 'Şapak აპლიკაციების სერია არის აპლიკაციების კოლექცია, რომელიც პირველ რიგში შექმნილია თურქმენეთის ხალხის დასახმარებლად უცხო ენების შესწავლაში.\n\nმიუხედავად იმისა, რომ ეს აპლიკაცია თურქმენი მოქალაქეებისთვის არის შექმნილი, მსოფლიოს სხვა ქვეყნების ხალხსაც შეუძლია მარტივად გამოიყენოს.\n\nŞapak - Ykjam Terjime სერიის პირველი აპლიკაციაა. ის მუშაობს როგორც ფრაზების წიგნი, ტექსტური და ხმოვანი მთარგმნელი მოწინავე AI ფუნქციებით.\n\nსერიის სხვა აპლიკაციები აქტიურ განვითარებაშია — თვალყური ადევნეთ!',
    },
    de: {
      title: 'Über die App',
      authors: 'Über die Entwickler',
      authorsDesc: 'Wer hat diese App erstellt',
      series: 'Şapak App-Serie',
      seriesDesc: 'Andere Apps',
      version: 'Version',
      authorsContent: 'Şapak - Ykjam Terjime wurde vom Şapak Code Team aus Mary City, Mary Velayat, Turkmenistan entwickelt.\n\nUnser Ziel ist es, Turkmenen und Gästen zu helfen, sich in verschiedenen Sprachen einfach zu verständigen.\n\nDie App unterstützt 31 Sprachen und enthält ein Phrasenbuch, Übersetzer und KI-Assistenten.\n\nFür Fehler und Vorschläge:\nshapak.app@gmail.com\n\nBesonderer Dank an Daňatarowa Gülhatyja für die turkmenische Sprachaufnahme.',
      seriesContent: 'Die Şapak App-Serie ist eine Sammlung von Anwendungen, die hauptsächlich dazu dienen, den Menschen in Turkmenistan beim Erlernen von Fremdsprachen zu helfen.\n\nObwohl diese App für turkmenische Bürger konzipiert ist, können auch Menschen aus anderen Ländern weltweit sie problemlos nutzen.\n\nŞapak - Ykjam Terjime ist die erste App der Serie. Sie fungiert als Phrasenbuch, Text- und Sprachübersetzer mit fortschrittlichen KI-Funktionen.\n\nAndere Apps der Serie sind in aktiver Entwicklung — bleiben Sie dran!',
    },
    fr: {
      title: 'À propos',
      authors: 'À propos des développeurs',
      authorsDesc: 'Qui a créé cette application',
      series: 'Série d\'applications Şapak',
      seriesDesc: 'Autres applications',
      version: 'Version',
      authorsContent: 'Şapak - Ykjam Terjime a été développé par l\'équipe Şapak Code Team de la ville de Mary, région de Mary, Turkménistan.\n\nNotre objectif est d\'aider les Turkmènes et les visiteurs à communiquer facilement dans différentes langues.\n\nL\'application prend en charge 31 langues et comprend un guide de conversation, un traducteur et des assistants IA.\n\nPour les erreurs et suggestions:\nshapak.app@gmail.com\n\nRemerciements particuliers à Daňatarowa Gülhatyja pour la voix turkmène.',
      seriesContent: 'La série d\'applications Şapak est une collection d\'applications conçues principalement pour aider les habitants du Turkménistan à apprendre des langues étrangères.\n\nBien que cette application soit conçue pour les citoyens turkmènes, les personnes d\'autres pays du monde peuvent également l\'utiliser facilement.\n\nŞapak - Ykjam Terjime est la première application de la série. Elle fonctionne comme guide de conversation, traducteur de texte et vocal avec des fonctionnalités IA avancées.\n\nD\'autres applications de la série sont en développement actif — restez à l\'écoute!',
    },
    es: {
      title: 'Acerca de',
      authors: 'Acerca de los desarrolladores',
      authorsDesc: 'Quién creó esta aplicación',
      series: 'Serie de apps Şapak',
      seriesDesc: 'Otras aplicaciones',
      version: 'Versión',
      authorsContent: 'Şapak - Ykjam Terjime fue desarrollado por el equipo Şapak Code Team de la ciudad de Mary, región de Mary, Turkmenistán.\n\nNuestro objetivo es ayudar a los turcomanos y visitantes a comunicarse fácilmente en diferentes idiomas.\n\nLa aplicación admite 31 idiomas e incluye un libro de frases, traductor y asistentes de IA.\n\nPara errores y sugerencias:\nshapak.app@gmail.com\n\nAgradecimiento especial a Daňatarowa Gülhatyja por proporcionar la voz en turcomano.',
      seriesContent: 'La serie de aplicaciones Şapak es una colección de aplicaciones diseñadas principalmente para ayudar a la gente de Turkmenistán a aprender idiomas extranjeros.\n\nAunque esta aplicación está diseñada para ciudadanos turcomanos, personas de otros países del mundo también pueden usarla fácilmente.\n\nŞapak - Ykjam Terjime es la primera aplicación de la serie. Funciona como libro de frases, traductor de texto y voz con funciones avanzadas de IA.\n\nOtras aplicaciones de la serie están en desarrollo activo — ¡estén atentos!',
    },
    it: {
      title: 'Informazioni',
      authors: 'Informazioni sugli sviluppatori',
      authorsDesc: 'Chi ha creato questa app',
      series: 'Serie di app Şapak',
      seriesDesc: 'Altre applicazioni',
      version: 'Versione',
      authorsContent: 'Şapak - Ykjam Terjime è stato sviluppato dal team Şapak Code Team dalla città di Mary, regione di Mary, Turkmenistan.\n\nIl nostro obiettivo è aiutare i turkmeni e i visitatori a comunicare facilmente in diverse lingue.\n\nL\'app supporta 31 lingue e include un frasario, traduttore e assistenti AI.\n\nPer errori e suggerimenti:\nshapak.app@gmail.com\n\nUn ringraziamento speciale a Daňatarowa Gülhatyja per aver fornito la voce turkmena.',
      seriesContent: 'La serie di app Şapak è una collezione di applicazioni progettate principalmente per aiutare il popolo del Turkmenistan ad imparare le lingue straniere.\n\nSebbene questa app sia progettata per i cittadini turkmeni, anche persone di altri paesi del mondo possono usarla facilmente.\n\nŞapak - Ykjam Terjime è la prima app della serie. Funziona come frasario, traduttore di testo e voce con funzionalità AI avanzate.\n\nAltre app della serie sono in sviluppo attivo — restate sintonizzati!',
    },
    pt: {
      title: 'Sobre',
      authors: 'Sobre os desenvolvedores',
      authorsDesc: 'Quem criou este aplicativo',
      series: 'Série de apps Şapak',
      seriesDesc: 'Outros aplicativos',
      version: 'Versão',
      authorsContent: 'Şapak - Ykjam Terjime foi desenvolvido pela equipe Şapak Code Team da cidade de Mary, região de Mary, Turcomenistão.\n\nNosso objetivo é ajudar turcomenos e visitantes a se comunicarem facilmente em diferentes idiomas.\n\nO aplicativo suporta 31 idiomas e inclui um livro de frases, tradutor e assistentes de IA.\n\nPara erros e sugestões:\nshapak.app@gmail.com\n\nAgradecimento especial a Daňatarowa Gülhatyja por fornecer a voz em turcomeno.',
      seriesContent: 'A série de aplicativos Şapak é uma coleção de aplicativos projetados principalmente para ajudar o povo do Turcomenistão a aprender idiomas estrangeiros.\n\nEmbora este aplicativo seja projetado para cidadãos turcomenos, pessoas de outros países do mundo também podem usá-lo facilmente.\n\nŞapak - Ykjam Terjime é o primeiro aplicativo da série. Funciona como livro de frases, tradutor de texto e voz com recursos avançados de IA.\n\nOutros aplicativos da série estão em desenvolvimento ativo — fique atento!',
    },
    pl: {
      title: 'O aplikacji',
      authors: 'O twórcach',
      authorsDesc: 'Kto stworzył tę aplikację',
      series: 'Seria aplikacji Şapak',
      seriesDesc: 'Inne aplikacje',
      version: 'Wersja',
      authorsContent: 'Şapak - Ykjam Terjime zostało opracowane przez zespół Şapak Code Team z miasta Mary, region Mary, Turkmenistan.\n\nNaszym celem jest pomoc Turkmenom i gościom w łatwej komunikacji w różnych językach.\n\nAplikacja obsługuje 31 języków i zawiera rozmówki, tłumacz oraz asystentów AI.\n\nW przypadku błędów i sugestii:\nshapak.app@gmail.com\n\nSpecjalne podziękowania dla Daňatarowa Gülhatyja za udostępnienie głosu turkmeńskiego.',
      seriesContent: 'Seria aplikacji Şapak to zbiór aplikacji zaprojektowanych przede wszystkim, aby pomóc mieszkańcom Turkmenistanu w nauce języków obcych.\n\nChociaż ta aplikacja jest przeznaczona dla obywateli Turkmenistanu, ludzie z innych krajów świata również mogą z niej łatwo korzystać.\n\nŞapak - Ykjam Terjime to pierwsza aplikacja w serii. Działa jako rozmówki, tłumacz tekstu i mowy z zaawansowanymi funkcjami AI.\n\nInne aplikacje z serii są w trakcie aktywnego rozwoju — bądźcie na bieżąco!',
    },
    nl: {
      title: 'Over de app',
      authors: 'Over de ontwikkelaars',
      authorsDesc: 'Wie heeft deze app gemaakt',
      series: 'Şapak app-serie',
      seriesDesc: 'Andere apps',
      version: 'Versie',
      authorsContent: 'Şapak - Ykjam Terjime is ontwikkeld door het Şapak Code Team uit Mary City, Mary Velayat, Turkmenistan.\n\nOns doel is om Turkmenen en bezoekers te helpen gemakkelijk te communiceren in verschillende talen.\n\nDe app ondersteunt 31 talen en bevat een taalgids, vertaler en AI-assistenten.\n\nVoor fouten en suggesties:\nshapak.app@gmail.com\n\nSpeciale dank aan Daňatarowa Gülhatyja voor het leveren van de Turkmeense stem.',
      seriesContent: 'De Şapak app-serie is een verzameling applicaties die voornamelijk zijn ontworpen om de mensen van Turkmenistan te helpen bij het leren van vreemde talen.\n\nHoewel deze app is ontworpen voor Turkmeense burgers, kunnen mensen uit andere landen over de hele wereld hem ook gemakkelijk gebruiken.\n\nŞapak - Ykjam Terjime is de eerste app in de serie. Het werkt als taalgids, tekst- en spraakvertaler met geavanceerde AI-functies.\n\nAndere apps in de serie zijn in actieve ontwikkeling — blijf op de hoogte!',
    },
    uk: {
      title: 'Про додаток',
      authors: 'Про розробників',
      authorsDesc: 'Хто створив цей додаток',
      series: 'Серія додатків Şapak',
      seriesDesc: 'Інші додатки',
      version: 'Версія',
      authorsContent: 'Şapak - Ykjam Terjime розроблено командою Şapak Code Team з міста Мари, Марийський велаят, Туркменістан.\n\nНаша мета — допомогти туркменам та гостям легко спілкуватися різними мовами.\n\nДодаток підтримує 31 мову та включає розмовник, перекладач та AI-асистентів.\n\nДля помилок та пропозицій:\nshapak.app@gmail.com\n\nОсобдива подяка Daňatarowa Gülhatyja за надання туркменського голосу.',
      seriesContent: 'Серія додатків Şapak — це колекція додатків, розроблених насамперед для допомоги народу Туркменістану у вивченні іноземних мов.\n\nХоча цей додаток розроблений для громадян Туркменістану, люди з інших країн світу також можуть легко ним користуватися.\n\nŞapak - Ykjam Terjime — перший додаток серії. Він працює як розмовник, текстовий та голосовий перекладач з передовими функціями ШІ.\n\nІнші додатки серії знаходяться в активній розробці — слідкуйте за оновленнями!',
    },
  };

  const t = aboutTexts[config.mode as keyof typeof aboutTexts] || aboutTexts.en;

  const renderModal = () => {
    if (!activeModal) return null;

    const isAuthors = activeModal === 'authors';
    const modalTitle = isAuthors ? t.authors : t.series;
    const modalContent = isAuthors ? t.authorsContent : t.seriesContent;

    return (
      <Modal
        visible={!!activeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <View style={styles.modalPlaceholder} />
          </View>

          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: safeAreaBottom + 20 }}
          >
            <Text style={styles.modalText}>{modalContent}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>{t.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(safeAreaBottom, verticalScale(20)),
          paddingHorizontal: scale(16),
          paddingTop: verticalScale(16),
        }}
      >
        {/* Logo / App Icon */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/splash_new.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Ykjam Terjime</Text>
          <Text style={styles.versionText}>{t.version} 1.0.0</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* About Authors */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal('authors')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#EBF5FF' }]}>
                <Ionicons name="people" size={24} color="#3B82F6" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{t.authors}</Text>
                <Text style={styles.menuSubtitle}>{t.authorsDesc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* About Shapak Series */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal('series')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.menuLogoIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{t.series}</Text>
                <Text style={styles.menuSubtitle}>{t.seriesDesc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Şapak</Text>
        </View>
      </ScrollView>

      {renderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: scale(40),
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(24),
  },
  logoImage: {
    width: scale(120),
    height: scale(100),
    marginBottom: verticalScale(8),
  },
  menuLogoIcon: {
    width: scale(32),
    height: scale(32),
  },
  appName: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  versionText: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  menuContainer: {
    gap: verticalScale(12),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: scale(16),
    flex: 1,
  },
  menuTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(2),
  },
  menuSubtitle: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingTop: verticalScale(32),
  },
  footerText: {
    fontSize: moderateScale(14),
    color: '#9CA3AF',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  modalPlaceholder: {
    width: scale(40),
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  modalText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: '#374151',
  },
});
