export type Language = "en" | "ar" | "ha" | "yo";

export const languages: {
  code: Language;
  label: string;
  nativeLabel: string;
}[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "ha", label: "Hausa", nativeLabel: "Hausa" },
  { code: "yo", label: "Yoruba", nativeLabel: "Yorùbá" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.studio": "Studio",
  "nav.library": "Library",
  "nav.autopost": "Auto-Post",
  "nav.integrations": "Integrations",
  "nav.quran": "Quran Reader",
  "nav.prayerTimes": "Prayer Times",
  "nav.duas": "Duas & Dhikr",
  "nav.favorites": "Favorites",
  "nav.billing": "Billing",
  "nav.settings": "Settings",
  "nav.profile": "Profile",
  "nav.adminVideos": "Admin Videos",
  "nav.free": "Free",
  "nav.home": "Home",

  "landing.badge": "AI Verse Studio + Free Quran Companion",
  "landing.title": "Create stunning Quran videos.",
  "landing.titleHighlight": "Read, listen & pray — always free.",
  "landing.subtitle":
    "4Muslims pairs an AI-powered verse video studio for da'wah creators with a complete Quran companion — reader, audio, prayer times, and duas — free for every user, on every plan.",
  "landing.ctaPrimary": "Get Started Free",
  "landing.ctaSecondary": "Sign In",
  "landing.statSurahs": "114 Surahs",
  "landing.statReciters": "5 Reciters",
  "landing.statFree": "100% Free Quran Tools",

  "landing.studio.title": "AI Verse Video Studio",
  "landing.studio.subtitle": "For creators & da'wah pages",
  "landing.studio.desc":
    "Turn any ayah into a beautiful, shareable vertical video in minutes — pick a surah, a reciter, and a template, and let the studio render it for you.",
  "landing.studio.f1": "Cinematic templates with motion & Arabic typography",
  "landing.studio.f2": "5 world-renowned reciters",
  "landing.studio.f3": "Auto-post to YouTube, TikTok & Facebook (PRO)",

  "landing.free.title": "Free for every user, forever",
  "landing.free.subtitle":
    "No plan, trial, or paywall on the Quran companion tools below — they ship free with every account.",
  "landing.free.quran": "Quran Reader",
  "landing.free.quranDesc":
    "Read and listen to all 114 surahs and 30 juz with Arabic text and English translation.",
  "landing.free.prayer": "Prayer Times",
  "landing.free.prayerDesc":
    "Accurate daily prayer times by location with a live countdown to the next prayer.",
  "landing.free.duas": "Duas & Dhikr",
  "landing.free.duasDesc":
    "Browse daily supplications and after-salah dhikr, searchable by category.",
  "landing.free.favorites": "Favorites & History",
  "landing.free.favoritesDesc":
    "Save favorite ayahs and keep track of what you recently read — saved on your device.",

  "landing.pricing.title": "Simple plans for the video studio",
  "landing.pricing.subtitle":
    "Quran, prayer times, and duas remain free no matter which plan you choose.",
  "landing.pricing.cta": "View Plans",

  "landing.footer.tagline":
    "Built for the Ummah. Spread da'wah, one verse at a time.",

  "settings.title": "Settings",
  "settings.subtitle": "Personalize your appearance and language",
  "settings.appearance": "Appearance",
  "settings.appearanceHint": "Choose how 4Muslims looks on your device",
  "settings.dark": "Dark",
  "settings.darkDesc": "Deep, glare-free theme for low-light reading",
  "settings.light": "Light",
  "settings.lightDesc": "Bright, off-white theme for daytime use",
  "settings.language": "Language",
  "settings.languageHint": "Choose your preferred interface language",
};

const ar: Dict = {
  "nav.studio": "الاستوديو",
  "nav.library": "المكتبة",
  "nav.autopost": "النشر التلقائي",
  "nav.integrations": "التكاملات",
  "nav.quran": "قارئ القرآن",
  "nav.prayerTimes": "مواقيت الصلاة",
  "nav.duas": "الأدعية والأذكار",
  "nav.favorites": "المفضلة",
  "nav.billing": "الفواتير",
  "nav.settings": "الإعدادات",
  "nav.free": "مجاني",
  "nav.home": "الرئيسية",

  "landing.badge": "استوديو فيديو بالذكاء الاصطناعي + رفيق قرآني مجاني",
  "landing.title": "أنشئ مقاطع فيديو قرآنية رائعة.",
  "landing.titleHighlight": "اقرأ واستمع وصلِّ — مجانًا دائمًا.",
  "landing.subtitle":
    "يجمع 4Muslims بين استوديو فيديو آيات مدعوم بالذكاء الاصطناعي لصنّاع الدعوة، ورفيق قرآني كامل — قارئ، صوتيات، مواقيت صلاة وأدعية — مجاني لكل مستخدم في كل خطة.",
  "landing.ctaPrimary": "ابدأ مجانًا",
  "landing.ctaSecondary": "تسجيل الدخول",
  "landing.statSurahs": "114 سورة",
  "landing.statReciters": "5 قراء",
  "landing.statFree": "أدوات قرآنية مجانية 100٪",

  "landing.studio.title": "استوديو فيديو الآيات بالذكاء الاصطناعي",
  "landing.studio.subtitle": "لصنّاع المحتوى وصفحات الدعوة",
  "landing.studio.desc":
    "حوّل أي آية إلى فيديو عمودي جميل وقابل للمشاركة في دقائق — اختر سورة وقارئًا وقالبًا، ودع الاستوديو يصنعه لك.",
  "landing.studio.f1": "قوالب سينمائية بحركة وخط عربي أنيق",
  "landing.studio.f2": "5 قراء مشهورون عالميًا",
  "landing.studio.f3": "نشر تلقائي على يوتيوب وتيك توك وفيسبوك (PRO)",

  "landing.free.title": "مجاني لكل مستخدم، إلى الأبد",
  "landing.free.subtitle":
    "لا خطط ولا فترة تجريبية ولا حواجز دفع لأدوات القرآن أدناه — متاحة مجانًا مع كل حساب.",
  "landing.free.quran": "قارئ القرآن",
  "landing.free.quranDesc":
    "اقرأ واستمع إلى جميع السور الـ114 والأجزاء الـ30 بالنص العربي والترجمة الإنجليزية.",
  "landing.free.prayer": "مواقيت الصلاة",
  "landing.free.prayerDesc":
    "مواقيت صلاة دقيقة حسب موقعك مع عد تنازلي مباشر للصلاة القادمة.",
  "landing.free.duas": "الأدعية والأذكار",
  "landing.free.duasDesc":
    "تصفح الأدعية اليومية وأذكار ما بعد الصلاة، قابلة للبحث حسب الفئة.",
  "landing.free.favorites": "المفضلة والسجل",
  "landing.free.favoritesDesc":
    "احفظ آياتك المفضلة وتابع ما قرأته مؤخرًا — محفوظ على جهازك.",

  "landing.pricing.title": "خطط بسيطة لاستوديو الفيديو",
  "landing.pricing.subtitle":
    "يبقى القرآن ومواقيت الصلاة والأدعية مجانية أيًا كانت الخطة التي تختارها.",
  "landing.pricing.cta": "عرض الخطط",

  "landing.footer.tagline":
    "بُني من أجل الأمة. انشر الدعوة، آية واحدة في كل مرة.",

  "settings.title": "الإعدادات",
  "settings.subtitle": "خصص المظهر واللغة",
  "settings.appearance": "المظهر",
  "settings.appearanceHint": "اختر شكل 4Muslims على جهازك",
  "settings.dark": "داكن",
  "settings.darkDesc": "مظهر داكن مريح للقراءة في الإضاءة المنخفضة",
  "settings.light": "فاتح",
  "settings.lightDesc": "مظهر فاتح بلون أبيض مائل للكريمي للاستخدام النهاري",
  "settings.language": "اللغة",
  "settings.languageHint": "اختر لغة الواجهة المفضلة لديك",
};

const ha: Dict = {
  "nav.studio": "Studio",
  "nav.library": "Laburare",
  "nav.autopost": "Buga-Kai-Tsaye",
  "nav.integrations": "Haɗin Kai",
  "nav.quran": "Mai Karanta Alkur'ani",
  "nav.prayerTimes": "Lokutan Sallah",
  "nav.duas": "Addu'o'i da Zikiri",
  "nav.favorites": "Abubuwan So",
  "nav.billing": "Biyan Kuɗi",
  "nav.settings": "Saituna",
  "nav.free": "Kyauta",
  "nav.home": "Gida",

  "landing.badge": "Studio na Bidiyo da AI + Abokin Alkur'ani Kyauta",
  "landing.title": "Ƙirƙiri kyawawan bidiyon Alkur'ani.",
  "landing.titleHighlight": "Karanta, saurara & yi sallah — kyauta koyaushe.",
  "landing.subtitle":
    "4Muslims yana haɗa studio na bidiyon aya mai amfani da AI ga masu yin da'awa tare da cikakken abokin Alkur'ani — mai karantawa, sauti, lokutan sallah, da addu'o'i — kyauta ga kowane mai amfani, a kowane shiri.",
  "landing.ctaPrimary": "Fara Kyauta",
  "landing.ctaSecondary": "Shiga",
  "landing.statSurahs": "Sura 114",
  "landing.statReciters": "Masu Karatu 5",
  "landing.statFree": "Kayan Aikin Alkur'ani Kyauta 100%",

  "landing.studio.title": "Studio na Bidiyon Aya da AI",
  "landing.studio.subtitle": "Don masu ƙirƙira & shafukan da'awa",
  "landing.studio.desc":
    "Mayar da kowace aya zuwa kyakkyawan bidiyo mai tsaye a cikin mintuna kaɗan — zaɓi sura, mai karatu, da salo, sannan studio zai yi maka aikin.",
  "landing.studio.f1": "Salo masu motsi da rubutun larabci mai kyau",
  "landing.studio.f2": "Sanannun masu karatu 5 na duniya",
  "landing.studio.f3": "Buga kai tsaye zuwa YouTube, TikTok da Facebook (PRO)",

  "landing.free.title": "Kyauta ga kowane mai amfani, har abada",
  "landing.free.subtitle":
    "Babu shiri, gwaji, ko shinge na biya akan kayan aikin Alkur'ani a ƙasa — kyauta ne ga kowane account.",
  "landing.free.quran": "Mai Karanta Alkur'ani",
  "landing.free.quranDesc":
    "Karanta da sauraron dukkan sura 114 da juzu'i 30 tare da rubutun larabci da fassarar Turanci.",
  "landing.free.prayer": "Lokutan Sallah",
  "landing.free.prayerDesc":
    "Ingantattun lokutan sallah bisa wurin da kake tare da ƙidayar lokaci zuwa sallar gaba.",
  "landing.free.duas": "Addu'o'i da Zikiri",
  "landing.free.duasDesc":
    "Bincika addu'o'in yau da kullum da zikirin bayan sallah, ana iya bincike bisa rukuni.",
  "landing.free.favorites": "Abubuwan So & Tarihi",
  "landing.free.favoritesDesc":
    "Ajiye ayoyin da kake so ka kuma bi diddigin abin da ka karanta kwanan nan — a ajiye a na'urarka.",

  "landing.pricing.title": "Sauƙaƙan shirye-shirye don studio na bidiyo",
  "landing.pricing.subtitle":
    "Alkur'ani, lokutan sallah, da addu'o'i suna kasancewa kyauta ko da wane shiri ka zaɓa.",
  "landing.pricing.cta": "Duba Shirye-shirye",

  "landing.footer.tagline":
    "An gina don Ummah. Yaɗa da'awa, aya ɗaya a lokaci guda.",

  "settings.title": "Saituna",
  "settings.subtitle": "Keɓance kamanni da harshe",
  "settings.appearance": "Kamanni",
  "settings.appearanceHint": "Zaɓi yadda 4Muslims yake kama a na'urarka",
  "settings.dark": "Duhu",
  "settings.darkDesc": "Salo mai duhu don karatu cikin sauƙi da dare",
  "settings.light": "Haske",
  "settings.lightDesc": "Salo mai haske don amfani da rana",
  "settings.language": "Harshe",
  "settings.languageHint": "Zaɓi harshen da kake so",
};

const yo: Dict = {
  "nav.studio": "Sitúdíò",
  "nav.library": "Ilé-ìkówèésí",
  "nav.autopost": "Fífiránṣẹ́-Aládàáṣe",
  "nav.integrations": "Ìsopọ̀",
  "nav.quran": "Kíkà Al-Kùránì",
  "nav.prayerTimes": "Àkókò Ìrun",
  "nav.duas": "Àdúrà àti Ìrántí",
  "nav.favorites": "Àwọn Ààyò",
  "nav.billing": "Ìsanwó",
  "nav.settings": "Ètò",
  "nav.free": "Ọ̀fẹ́",
  "nav.home": "Ilé",

  "landing.badge": "Sitúdíò Fídíò AI + Alábàákẹ́gbẹ́ Al-Kùránì Ọ̀fẹ́",
  "landing.title": "Ṣẹ̀dá àwọn fídíò Al-Kùránì tó dára.",
  "landing.titleHighlight": "Kà, tẹ́tí sí, kí o sì gbàdúrà — ọ̀fẹ́ nígbà gbogbo.",
  "landing.subtitle":
    "4Muslims so sitúdíò fídíò áyà tí AI ń ṣiṣẹ́ fún àwọn tó ń ṣe iṣẹ́ dá'wah pọ̀ mọ́ alábàákẹ́gbẹ́ Al-Kùránì pípé — ìwé kíkà, ohùn, àkókò ìrun, àti àdúrà — ọ̀fẹ́ fún gbogbo aṣàmúlò, ní gbogbo ètò.",
  "landing.ctaPrimary": "Bẹ̀rẹ̀ Ọ̀fẹ́",
  "landing.ctaSecondary": "Wọlé",
  "landing.statSurahs": "Sūrah 114",
  "landing.statReciters": "Akọ̀wé 5",
  "landing.statFree": "Ohun Èlò Al-Kùránì Ọ̀fẹ́ 100%",

  "landing.studio.title": "Sitúdíò Fídíò Áyà pẹ̀lú AI",
  "landing.studio.subtitle": "Fún àwọn tó ń dá àkóónú & ojú-ìwé dá'wah",
  "landing.studio.desc":
    "Sọ èyíkéyìí áyà di fídíò tó dára tí a lè fi ránṣẹ́ láàrin ìṣẹ́jú méjì — yan sūrah, akọ̀wé, àti àwòṣe, kí sitúdíò náà sì ṣe é fún ọ.",
  "landing.studio.f1": "Àwọn àwòṣe eré pẹ̀lú kíkọ̀wé Lárúbáwá tó dára",
  "landing.studio.f2": "Akọ̀wé olókìkí 5 kárí ayé",
  "landing.studio.f3":
    "Fífiránṣẹ́ aládàáṣe sí YouTube, TikTok àti Facebook (PRO)",

  "landing.free.title": "Ọ̀fẹ́ fún gbogbo aṣàmúlò, títí láé",
  "landing.free.subtitle":
    "Kò sí ètò, àdánwò, tàbí ìdíwọ́ owó lórí àwọn ohun èlò Al-Kùránì nísàlẹ̀ — wọ́n wá ọ̀fẹ́ pẹ̀lú gbogbo àkáǹtì.",
  "landing.free.quran": "Kíkà Al-Kùránì",
  "landing.free.quranDesc":
    "Ka àti tẹ́tí sí gbogbo sūrah 114 àti juz 30 pẹ̀lú ọ̀rọ̀ Lárúbáwá àti ìtumọ̀ Gẹ̀ẹ́sì.",
  "landing.free.prayer": "Àkókò Ìrun",
  "landing.free.prayerDesc":
    "Àkókò ìrun pípéye gẹ́gẹ́ bí ibi tí o wà pẹ̀lú káǹtà àkókò sí ìrun tó ń bọ̀.",
  "landing.free.duas": "Àdúrà àti Ìrántí",
  "landing.free.duasDesc":
    "Wo àwọn àdúrà ojoojúmọ́ àti ìrántí lẹ́yìn ìrun, tí a lè wádìí gẹ́gẹ́ bí ẹ̀ka.",
  "landing.free.favorites": "Ààyò àti Ìtàn",
  "landing.free.favoritesDesc":
    "Fi àwọn áyà tí o nífẹ̀ẹ́ sí pamọ́ kí o sì tọpa ohun tí o ṣẹ̀ṣẹ̀ kà — a máa fi pamọ́ sí ẹ̀rọ rẹ.",

  "landing.pricing.title": "Àwọn ètò tó rọrùn fún sitúdíò fídíò",
  "landing.pricing.subtitle":
    "Al-Kùránì, àkókò ìrun, àti àdúrà máa ń jẹ́ ọ̀fẹ́ láìka ètò tí o yàn sí.",
  "landing.pricing.cta": "Wo Àwọn Ètò",

  "landing.footer.tagline":
    "A kọ́ ọ fún Ùmmah. Tan dá'wah káàkiri, áyà kan ní àkókò kan.",

  "settings.title": "Ètò",
  "settings.subtitle": "Ṣàtúnṣe ìrísí àti èdè rẹ",
  "settings.appearance": "Ìrísí",
  "settings.appearanceHint": "Yan bí 4Muslims ṣe máa rí lórí ẹ̀rọ rẹ",
  "settings.dark": "Dúdú",
  "settings.darkDesc": "Àwòrán dúdú tó dára fún kíkà nígbà tí ìmọ́lẹ̀ kò pọ̀",
  "settings.light": "Funfun",
  "settings.lightDesc": "Àwòrán funfun-ọ̀fọ̀ fún lílò lọ́sàn-án",
  "settings.language": "Èdè",
  "settings.languageHint": "Yan èdè tí o fẹ́ràn fún ìnàjú",
};

const dictionaries: Record<Language, Dict> = { en, ar, ha, yo };

export function translate(language: Language, key: string): string {
  return dictionaries[language][key] ?? dictionaries.en[key] ?? key;
}
