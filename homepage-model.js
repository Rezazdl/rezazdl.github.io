// Shared, HTML-free editing schema for the home page.
export const HOME_FIELDS=[
  {group:'contact',key:'formEndpoint',label:'آدرس فرم Formspree (ایمیل مقصد در Formspree تنظیم می‌شود)',default:'',selector:'',kind:'link',attr:''},
  {group:'form',key:'emailSending',label:'پیام در حال ارسال',default:'Sending your message…',selector:'',kind:'text',attr:''},
  {group:'form',key:'emailSent',label:'پیام ارسال موفق',default:'Thanks! Your message has been submitted. I’ll get back to you soon.',selector:'',kind:'text',attr:''},
  {group:'form',key:'emailError',label:'پیام خطای ارسال',default:'Your message could not be sent. Please try again or use another contact option.',selector:'',kind:'text',attr:''},
  {group:'form',key:'emailLimit',label:'پیام محدودیت ارسال',default:'The contact form is temporarily unavailable. Please try again later or use another contact option.',selector:'',kind:'text',attr:''},
  {
    "group": "identity",
    "key": "pageTitle",
    "label": "عنوان تب مرورگر",
    "default": "Rezazdl — Reza Zendehdel",
    "selector": "title",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "identity",
    "key": "description",
    "label": "توضیح سایت برای موتور جست‌وجو",
    "default": "Independent animation, motion design and interactive worlds. A freelance creative with 10+ years of experience.",
    "selector": "meta[name=\"description\"]",
    "kind": "text",
    "attr": "content"
  },
  {
    "group": "identity",
    "key": "brandMark",
    "label": "نشان متنی",
    "default": "RZ.",
    "selector": ".brand-mark",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "identity",
    "key": "brandName",
    "label": "نام برند",
    "default": "Rezazdl",
    "selector": ".brand-name",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "identity",
    "key": "navTagline",
    "label": "معرفی کوتاه در منو",
    "default": "Independent animator & designer.",
    "selector": ".nav-center",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "identity",
    "key": "navWork",
    "label": "عنوان لینک نمونه‌کارها",
    "default": "Work",
    "selector": ".nav-links [href=\"#work\"]",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "identity",
    "key": "navAbout",
    "label": "عنوان لینک دربارهٔ من",
    "default": "About",
    "selector": ".nav-links [href=\"#about\"]",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "identity",
    "key": "navContact",
    "label": "عنوان لینک تماس",
    "default": "Let’s talk",
    "selector": ".nav-contact",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "heroEyebrow",
    "label": "تخصص‌های بالای صفحه",
    "default": "Motion / 3D / Interactive",
    "selector": ".hero-intro .eyebrow",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "heroIntro",
    "label": "معرفی زیر تخصص‌ها",
    "default": "Animation, film and interactive design.",
    "selector": ".hero-intro p",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "heroCTA",
    "label": "متن دکمهٔ شروع پروژه",
    "default": "Start a project",
    "selector": ".hero-intro .text-link",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "heroTop",
    "label": "عنوان بزرگ — خط اول",
    "default": "Serious",
    "selector": ".hero-title .topline",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "heroBottom",
    "label": "عنوان بزرگ — خط دوم",
    "default": "about play",
    "selector": ".hero-title .bottomline",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "heroPunctuation",
    "label": "نشانهٔ انتهای عنوان",
    "default": ".",
    "selector": ".hero-title .punctuation",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "sticker",
    "label": "متن برچسب",
    "default": "Made\nto move",
    "selector": ".hero-sticker",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "stickerSmall",
    "label": "زیرنویس برچسب",
    "default": "IN MOTION",
    "selector": ".hero-sticker small",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "hero",
    "key": "scrollText",
    "label": "راهنمای اسکرول",
    "default": "Scroll. Let it unfold.",
    "selector": ".hero-scroll span:last-child",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "work",
    "key": "workHeading",
    "label": "عنوان نمونه‌کارها",
    "default": "Pick your\nkind of play.",
    "selector": "#work-heading",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "experienceLabel",
    "label": "عنوان آمار",
    "default": "Experience",
    "selector": ".numbers > p",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statValue1",
    "label": "عدد 1",
    "default": "10",
    "selector": ".stat:nth-of-type(1) strong",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statSuffix1",
    "label": "پسوند عدد 1",
    "default": "+",
    "selector": ".stat:nth-of-type(1) strong span",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statLabel1",
    "label": "توضیح عدد 1",
    "default": "Years of experience",
    "selector": ".stat:nth-of-type(1) p",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statValue2",
    "label": "عدد 2",
    "default": "300",
    "selector": ".stat:nth-of-type(2) strong",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statSuffix2",
    "label": "پسوند عدد 2",
    "default": "+",
    "selector": ".stat:nth-of-type(2) strong span",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statLabel2",
    "label": "توضیح عدد 2",
    "default": "Projects delivered",
    "selector": ".stat:nth-of-type(2) p",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statValue3",
    "label": "عدد 3",
    "default": "20",
    "selector": ".stat:nth-of-type(3) strong",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statSuffix3",
    "label": "پسوند عدد 3",
    "default": "+",
    "selector": ".stat:nth-of-type(3) strong span",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "experience",
    "key": "statLabel3",
    "label": "توضیح عدد 3",
    "default": "Countries served",
    "selector": ".stat:nth-of-type(3) p",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "services",
    "key": "servicesEyebrow",
    "label": "برچسب خدمات",
    "default": "Services",
    "selector": ".services .eyebrow",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "services",
    "key": "servicesTitle",
    "label": "عنوان خدمات",
    "default": "What I do.",
    "selector": "#services-title",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "services",
    "key": "process",
    "label": "مراحل کار",
    "default": "Brief → Explore → Make → Deliver",
    "selector": ".process",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "services",
    "key": "serviceTitle1",
    "label": "خدمت 1 — عنوان",
    "default": "Video & motion design",
    "selector": ".service-list li:nth-child(1) h3",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "services",
    "key": "serviceBody1",
    "label": "خدمت 1 — توضیح",
    "default": "Ads, launch videos and social content.",
    "selector": ".service-list li:nth-child(1) p",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "services",
    "key": "serviceTitle2",
    "label": "خدمت 2 — عنوان",
    "default": "3D & animation",
    "selector": ".service-list li:nth-child(2) h3",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "services",
    "key": "serviceBody2",
    "label": "خدمت 2 — توضیح",
    "default": "Product renders, character animation and cinematic sequences.",
    "selector": ".service-list li:nth-child(2) p",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "services",
    "key": "serviceTitle3",
    "label": "خدمت 3 — عنوان",
    "default": "Games & interactive",
    "selector": ".service-list li:nth-child(3) h3",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "services",
    "key": "serviceBody3",
    "label": "خدمت 3 — توضیح",
    "default": "Game art, playable prototypes and interactive experiences.",
    "selector": ".service-list li:nth-child(3) p",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "ribbon",
    "key": "ribbonText",
    "label": "متن نوار متحرک",
    "default": "ANIMATION / 3D / INTERACTIVE",
    "selector": ".ribbon-content span",
    "kind": "ribbon",
    "attr": ""
  },
  {
    "group": "about",
    "key": "aboutPhoto",
    "label": "عکس دربارهٔ من",
    "default": "assets/character.webp",
    "selector": ".about-photo img",
    "kind": "image",
    "attr": ""
  },
  {
    "group": "about",
    "key": "aboutAlt",
    "label": "توضیح عکس",
    "default": "Orange character artwork",
    "selector": ".about-photo img",
    "kind": "text",
    "attr": "alt"
  },
  {
    "group": "about",
    "key": "aboutLabel",
    "label": "متن روی قاب عکس",
    "default": "Hi, I’m Reza.",
    "selector": ".about-label strong",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "about",
    "key": "aboutEyebrow",
    "label": "برچسب معرفی",
    "default": "About",
    "selector": ".about .eyebrow",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "about",
    "key": "aboutTitle",
    "label": "نام یا عنوان معرفی",
    "default": "Reza\nZendehdel.",
    "selector": "#about-title",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "about",
    "key": "aboutBody1",
    "label": "متن معرفی — پاراگراف اول",
    "default": "I’m Reza Zendehdel, an independent animator and designer, working across moving images, 3D and interactive worlds.",
    "selector": ".about .reveal > p:nth-of-type(1)",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "about",
    "key": "aboutBody2",
    "label": "متن معرفی — پاراگراف دوم",
    "default": "I work directly with clients, from the first visual direction through to animation and final delivery.",
    "selector": ".about .reveal > p:nth-of-type(2)",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "about",
    "key": "aboutCTA",
    "label": "متن دعوت به همکاری",
    "default": "Make something with me",
    "selector": ".about .text-link",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "contactEyebrow",
    "label": "برچسب تماس",
    "default": "Contact",
    "selector": ".contact-top .eyebrow",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "contactTitle",
    "label": "عنوان تماس",
    "default": "Let’s make\nsomething ",
    "selector": "#contact-heading",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "contactHighlight",
    "label": "قسمت تأکیدشدهٔ عنوان",
    "default": "move.",
    "selector": "#contact-heading .underlined",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "email",
    "label": "ایمیل دریافت پیام",
    "default": "",
    "selector": "",
    "kind": "email",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "telegram",
    "label": "لینک تلگرام",
    "default": "https://t.me/rzazdl",
    "selector": "",
    "kind": "link",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "whatsapp",
    "label": "لینک واتساپ",
    "default": "./wa/",
    "selector": "",
    "kind": "link",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "instagram",
    "label": "لینک اینستاگرام",
    "default": "",
    "selector": "",
    "kind": "link",
    "attr": ""
  },
  {
    "group": "contact",
    "key": "linkedin",
    "label": "لینک لینکدین",
    "default": "",
    "selector": "",
    "kind": "link",
    "attr": ""
  },
  {
    "group": "footer",
    "key": "copyright",
    "label": "متن کپی‌رایت",
    "default": "© 2026 Reza Zendehdel",
    "selector": ".footer > span",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "footer",
    "key": "backTop",
    "label": "متن بازگشت به بالا",
    "default": "Back to the top ↑",
    "selector": ".footer > a",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "footer",
    "key": "motionOn",
    "label": "دکمهٔ حرکت فعال",
    "default": "Motion on",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "footer",
    "key": "motionOff",
    "label": "دکمهٔ حرکت غیرفعال",
    "default": "Motion off",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formEyebrow",
    "label": "تیتر کوچک فرم",
    "default": "LET’S TALK ABOUT YOUR PROJECT",
    "selector": "#contact-dialog .dialog-head > span",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formTitle",
    "label": "عنوان فرم",
    "default": "Put your idea\ninto words.",
    "selector": "#contact-title",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formLabel_name",
    "label": "عنوان فیلد نام",
    "default": "Your name",
    "selector": "#email-form label:has([name=\"name\"])",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formPlaceholder_name",
    "label": "راهنمای فیلد نام",
    "default": "How should I call you?",
    "selector": "#email-form [name=\"name\"]",
    "kind": "text",
    "attr": "placeholder"
  },
  {
    "group": "form",
    "key": "formLabel_email",
    "label": "عنوان فیلد ایمیل",
    "default": "Your email",
    "selector": "#email-form label:has([name=\"email\"])",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formPlaceholder_email",
    "label": "راهنمای فیلد ایمیل",
    "default": "you@company.com",
    "selector": "#email-form [name=\"email\"]",
    "kind": "text",
    "attr": "placeholder"
  },
  {
    "group": "form",
    "key": "formLabel_subject",
    "label": "عنوان فیلد موضوع",
    "default": "Subject",
    "selector": "#email-form label:has([name=\"subject\"])",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formPlaceholder_subject",
    "label": "راهنمای فیلد موضوع",
    "default": "What are we making?",
    "selector": "#email-form [name=\"subject\"]",
    "kind": "text",
    "attr": "placeholder"
  },
  {
    "group": "form",
    "key": "formLabel_message",
    "label": "عنوان فیلد پیام",
    "default": "Your message",
    "selector": "#email-form label:has([name=\"message\"])",
    "kind": "label",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formPlaceholder_message",
    "label": "راهنمای فیلد پیام",
    "default": "A little about the idea, the timing, and what you have in mind.",
    "selector": "#email-form [name=\"message\"]",
    "kind": "text",
    "attr": "placeholder"
  },
  {
    "group": "form",
    "key": "formButton",
    "label": "متن دکمهٔ فرم",
    "default": "Prepare email ↗",
    "selector": ".email-submit",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "form",
    "key": "formExplanation",
    "label": "توضیح پایین فرم",
    "default": "When connected, this opens your email app with your message ready to send.",
    "selector": ".email-explanation",
    "kind": "lines",
    "attr": ""
  },
  {
    "group": "form",
    "key": "emailReady",
    "label": "پیام آماده‌بودن فرم",
    "default": "Your message will open in your email app. Nothing is sent automatically.",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "form",
    "key": "emailMissing",
    "label": "پیام نبود ایمیل",
    "default": "Please use the contact links on this page to get in touch.",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "form",
    "key": "emailOpened",
    "label": "پیام بازشدن برنامهٔ ایمیل",
    "default": "Your draft is ready in your email app. Review it there before sending.",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "gallery",
    "key": "galleryKicker",
    "label": "برچسب گالری",
    "default": "SELECTED WORK",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "gallery",
    "key": "projectsLabel",
    "label": "عنوان تعداد پروژه‌ها",
    "default": "PROJECTS",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "gallery",
    "key": "emptyGallery",
    "label": "پیام گالری خالی",
    "default": "No projects in this collection yet.",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "gallery",
    "key": "galleryError",
    "label": "پیام خطای دریافت پروژه‌ها",
    "default": "Projects could not be loaded. Please refresh and try again.",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "gallery",
    "key": "galleryBack",
    "label": "بازگشت به گالری",
    "default": "← Back to gallery",
    "selector": "#back-to-gallery",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "gallery",
    "key": "projectBack",
    "label": "بازگشت انتهای پروژه",
    "default": "Back to the gallery ↑",
    "selector": "",
    "kind": "text",
    "attr": ""
  },
  {
    "group": "gallery",
    "key": "watchVideo",
    "label": "متن پخش ویدیو",
    "default": "▶ Watch video",
    "selector": "",
    "kind": "text",
    "attr": ""
  }
];
export const HOME_GROUPS=[{"id": "identity", "label": "هویت و منوی سایت"}, {"id": "hero", "label": "شروع صفحه / هیرو"}, {"id": "work", "label": "نمونه‌کارها و دسته‌بندی‌ها"}, {"id": "experience", "label": "آمار و سابقه"}, {"id": "services", "label": "خدمات"}, {"id": "ribbon", "label": "نوار متحرک"}, {"id": "about", "label": "دربارهٔ من و عکس شخصی"}, {"id": "contact", "label": "تماس و شبکه‌های اجتماعی"}, {"id": "footer", "label": "پایین صفحه"}, {"id": "form", "label": "فرم تماس"}, {"id": "gallery", "label": "متن‌های گالری"}];
export const HOME_SECTIONS=[{"id": "hero", "selector": ".hero-track"}, {"id": "work", "selector": "#work"}, {"id": "experience", "selector": "section[aria-label=\"Experience\"]"}, {"id": "services", "selector": ".services"}, {"id": "ribbon", "selector": ".ribbon"}, {"id": "about", "selector": "#about"}, {"id": "contact", "selector": "#contact"}];
export const homeDefaults=()=>Object.fromEntries(HOME_FIELDS.map(f=>[f.key,f.default]));
export function normalizeHome(raw={},asset=v=>v){
 const home=homeDefaults();
 for(const f of HOME_FIELDS){
  const value=typeof raw?.[f.key]==='string'?raw[f.key]:f.default;
  home[f.key]=f.kind==='image'?asset(value):value.slice(0,12000);
  if(f.kind==='email'&&home[f.key]&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(home[f.key]))home[f.key]='';
  if(f.kind==='link'&&home[f.key]){try{const url=new URL(home[f.key],'https://example.invalid/');if(url.protocol!=='https:'||url.username||url.password)home[f.key]=''}catch{home[f.key]=''}}
 }
 if(home.formEndpoint&&!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(home.formEndpoint))home.formEndpoint='';
 home.visibility=Object.fromEntries(HOME_SECTIONS.map(s=>[s.id,raw?.visibility?.[s.id]!==false]));
 const valid=HOME_SECTIONS.map(s=>s.id);
 home.order=[...new Set([...(Array.isArray(raw?.order)?raw.order:[]).filter(id=>valid.includes(id)&&id!=='hero'),...valid.filter(id=>id!=='hero')])];
 home.extraSections=(Array.isArray(raw?.extraSections)?raw.extraSections:[]).slice(0,30).map((s,i)=>({id:'extra-'+i,title:String(s.title??'').slice(0,300),body:String(s.body??'').slice(0,20000),image:asset(s.image||''),alt:String(s.alt??'').slice(0,300),visible:s.visible!==false}));
 return home;
}

