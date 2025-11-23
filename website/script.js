/*
 * AutoAdvisor Website Script
 * Handles data fetching, language switching, dark/light mode, navigation and dynamic content rendering.
 */

let currentLang = 'en';
// Embedded data for cars and companies.  The JSON is parsed at runtime to avoid file loading
// issues when running directly from the file system.
const carsData = JSON.parse(`
[
  {
    "id": 1,
    "brand": "Toyota",
    "model": "Corolla",
    "category": "Economy",
    "country": "Japan",
    "image": "images/economy.png",
    "price_range": "$22k - $28k",
    "fuel_economy": "Up to 12.3 km/l combined (~29 mpg)",
    "issues_en": "Common issues include excessive oil consumption, transmission problems, moldy AC smell and some electrical malfunctions【501963943951324†L145-L156】.",
    "issues_ar": "من المشاكل الشائعة استهلاك الزيت المفرط، مشاكل في ناقل الحركة، رائحة تكييف متعفنة وبعض الأعطال الكهربائية【501963943951324†L145-L156】.",
    "description_en": "A reliable compact sedan renowned for affordability and fuel efficiency; later generations received high praise for reliability and economy【501963943951324†L43-L62】.",
    "description_ar": "سيارة سيدان مدمجة موثوقة مشهورة بسعرها المعقول وكفاءتها العالية في استهلاك الوقود؛ حصلت الأجيال الأخيرة على تقييمات عالية من حيث الاعتمادية والاقتصاد【501963943951324†L43-L62】.",
    "purchase_url": "https://www.toyota.com/corolla/",
    "parts_url": "https://www.autozone.com/parts/?vehicleModel=Corolla"
  },
  {
    "id": 2,
    "brand": "Honda",
    "model": "Civic",
    "category": "Economy",
    "country": "Japan",
    "image": "images/economy.png",
    "price_range": "$24k - $32k",
    "fuel_economy": "EPA rating 50/47/49 mpg city/highway/combined for the hybrid; real‑world tests around 25‑31 mpg【286146824187505†L33-L35】【286146824187505†L125-L130】.",
    "issues_en": "2025 models have had fuel system problems (fuel smell or leaks), steering issues (loose or unresponsive steering) and false forward collision warnings【556954479239113†L326-L432】.",
    "issues_ar": "طرأت على موديلات 2025 مشكلات في نظام الوقود (رائحة وقود أو تسرب)، ومشاكل في التوجيه (توجيه غير مستجيب) وإنذارات تصادم أمامية خاطئة【556954479239113†L326-L432】.",
    "description_en": "A compact sedan/hatchback known for its balance of efficiency and sporty handling; the latest generation adds hybrid power and advanced safety features.",
    "description_ar": "سيدان/هاتشباك مدمجة معروفة بمزيج من الكفاءة والقيادة الرياضية؛ تضيف الجيل الأخير نظامًا هجينًا وميزات أمان متقدمة.",
    "purchase_url": "https://automobiles.honda.com/civic",
    "parts_url": "https://www.hondapartsnow.com/oem-honda-civic-parts.html"
  },
  {
    "id": 3,
    "brand": "Ford",
    "model": "F-150",
    "category": "Truck/SUV",
    "country": "United States",
    "image": "images/suv.png",
    "price_range": "$38k - $79k",
    "fuel_economy": "Depending on engine: hybrid PowerBoost ~26 mpg combined, 2.7‑L EcoBoost 25 mpg, 3.5‑L EcoBoost 20 mpg, 5.0‑L V8 18 mpg【48275373324749†L32-L35】【48275373324749†L64-L103】.",
    "issues_en": "Reported issues include steering shaft bolt defects, connecting rod problems causing engine damage, oil leaks from engine cup plug and coolant hose chafing, plus ignition coil and transmission troubles【121599913107651†L482-L544】【121599913107651†L529-L560】.",
    "issues_ar": "تشمل المشاكل المبلغ عنها عيوب في مسمار عمود التوجيه، وعيوب في قضيب التوصيل تسبب تلفًا للمحرك، وتسربات زيت من سدادة المحرك واحتكاك خرطوم المبرد، بالإضافة إلى مشاكل في ملف الإشعال وناقل الحركة【121599913107651†L482-L544】【121599913107651†L529-L560】.",
    "description_en": "America's best‑selling full‑size pickup known for impressive towing and payload capacities; available with multiple gasoline and hybrid powertrains.",
    "description_ar": "بيك أب بالحجم الكامل الأكثر مبيعًا في أمريكا، يُعرف بقدرات سحب وحمولة مثيرة للإعجاب؛ متاح بمحركات بنزين وهجينة متعددة.",
    "purchase_url": "https://www.ford.com/trucks/f150/",
    "parts_url": "https://www.oreillyauto.com/shop/browse/truck/f-150"
  },
  {
    "id": 4,
    "brand": "BMW",
    "model": "3 Series",
    "category": "Luxury/Sport",
    "country": "Germany",
    "image": "images/luxury.png",
    "price_range": "$41k - $60k",
    "fuel_economy": "Around 26‑36 mpg combined depending on engine.",
    "issues_en": "Some owners report minor electrical gremlins and costlier maintenance compared with mainstream brands.",
    "issues_ar": "يعاني بعض الملاك من أعطال كهربائية بسيطة وتكاليف صيانة أعلى مقارنة بالعلامات التجارية الشعبية.",
    "description_en": "A premium sports sedan offering a blend of performance and comfort; available with turbocharged engines and cutting‑edge technology.",
    "description_ar": "سيدان رياضية فاخرة تقدم مزيجًا من الأداء والراحة؛ تتوفر بمحركات توربو وتقنيات حديثة.",
    "purchase_url": "https://www.bmwusa.com/vehicles/3-series/sedan/overview.html",
    "parts_url": "https://parts.bmwusa.com/parts-bmw-3-series.html"
  },
  {
    "id": 5,
    "brand": "Audi",
    "model": "Q7",
    "category": "Luxury/SUV",
    "country": "Germany",
    "image": "images/suv.png",
    "price_range": "$55k - $72k",
    "fuel_economy": "Approximately 20‑23 mpg combined depending on engine.",
    "issues_en": "Known issues include occasional electronic glitches and higher maintenance costs typical of luxury SUVs.",
    "issues_ar": "تشمل المشاكل المعروفة أعطال إلكترونية متقطعة وتكاليف صيانة أعلى المعتادة في سيارات الدفع الرباعي الفاخرة.",
    "description_en": "A three‑row luxury crossover that blends refined interiors with capable performance; offers Quattro all‑wheel drive as standard.",
    "description_ar": "كروس أوفر فاخرة بثلاثة صفوف تمزج بين المقصورة الراقية والأداء المتميز؛ تقدم نظام الدفع الرباعي كواترو كميزة أساسية.",
    "purchase_url": "https://www.audiusa.com/us/web/en/models/q7/q7/2024/overview.html",
    "parts_url": "https://parts.audiusa.com/audi-q7-parts"
  },
  {
    "id": 6,
    "brand": "Chevrolet",
    "model": "Corvette",
    "category": "Super Sport",
    "country": "United States",
    "image": "images/sports_car.png",
    "price_range": "$65k - $100k",
    "fuel_economy": "Around 15‑27 mpg depending on driving conditions.",
    "issues_en": "Earlier generations experienced engine overheating and premature wear; current models have improved reliability but still demand careful maintenance.",
    "issues_ar": "واجهت الأجيال السابقة ارتفاعًا في حرارة المحرك وتآكلًا مبكرًا؛ النماذج الحالية أصبحت أكثر موثوقية لكنها تتطلب صيانة دقيقة.",
    "description_en": "An iconic American sports car delivering supercar performance at a relatively attainable price; mid‑engine layout in the latest generation.",
    "description_ar": "سيارة رياضية أمريكية أيقونية تقدم أداء سيارات السوبر بسعر نسبي معقول؛ يتميز الجيل الأخير بتصميم محرك وسطي.",
    "purchase_url": "https://www.chevrolet.com/performance/corvette",
    "parts_url": "https://www.corvettepartscenter.com/"
  },
  {
    "id": 7,
    "brand": "Ferrari",
    "model": "F8 Tributo",
    "category": "Super Sport",
    "country": "Italy",
    "image": "images/sports_car.png",
    "price_range": "$280k - $300k",
    "fuel_economy": "Approximately 15‑19 mpg.",
    "issues_en": "As a high‑performance exotic, maintenance costs are extremely high and repairs require specialised service centers.",
    "issues_ar": "كونها سيارة فائقة الأداء، فإن تكاليف الصيانة مرتفعة للغاية وتتطلب إصلاحات في مراكز خدمة متخصصة.",
    "description_en": "A mid‑engine V8 supercar boasting incredible acceleration and agility; celebrated for its design and engineering excellence.",
    "description_ar": "سيارة سوبر بمحرك وسطي ثماني الأسطوانات تتميز بتسارع هائل ورشاقة عالية؛ تشتهر بتصميمها وروعة هندستها.",
    "purchase_url": "https://www.ferrari.com/en-EN/auto/f8-tributo",
    "parts_url": "https://www.scuderiacarparts.com/ferrari/f8-tributo-parts.html"
  },
  {
    "id": 8,
    "brand": "Lamborghini",
    "model": "Huracán",
    "category": "Super Sport",
    "country": "Italy",
    "image": "images/sports_car.png",
    "price_range": "$200k - $280k",
    "fuel_economy": "About 14‑20 mpg.",
    "issues_en": "High running costs and limited cargo space; some owners note interior ergonomics take adjustment.",
    "issues_ar": "تكاليف التشغيل عالية ومساحة التخزين محدودة؛ يشير بعض المالكين إلى أن بيئة المقصورة تحتاج إلى تأقلم.",
    "description_en": "A sharp‑edged supercar with a roaring V10 engine and head‑turning looks; combines extreme performance with daily drivability.",
    "description_ar": "سيارة سوبر ذات حواف حادة بمحرك V10 هدّار ومظهر لافت للنظر؛ تجمع بين الأداء الشديد وإمكانية القيادة اليومية.",
    "purchase_url": "https://www.lamborghini.com/en-en/models/huracan",
    "parts_url": "https://www.lamboparts.com/huracan-parts"
  },
  {
    "id": 9,
    "brand": "Tesla",
    "model": "Model S",
    "category": "Electric/Luxury",
    "country": "United States",
    "image": "images/luxury.png",
    "price_range": "$90k - $110k",
    "fuel_economy": "Electric range up to 396 miles per charge; 0 gallons of fuel consumed.",
    "issues_en": "Owners report occasional fit‑and‑finish issues and varying build quality; service network may be limited in some regions.",
    "issues_ar": "بلغ بعض الملاك عن مشكلات في جودة التجميع الخارجية وتفاوت جودة التصنيع؛ قد تكون شبكة الصيانة محدودة في بعض المناطق.",
    "description_en": "A pioneering electric luxury sedan offering blistering acceleration and long‑distance range; features advanced driver‑assistance technology.",
    "description_ar": "سيدان كهربائية فاخرة رائدة توفر تسارعًا مذهلاً ومدى طويلًا؛ تتميز بتقنيات مساعدة سائق متقدمة.",
    "purchase_url": "https://www.tesla.com/models",
    "parts_url": "https://epc.tesla.com/parts/ModelS"
  },
  {
    "id": 10,
    "brand": "Hyundai",
    "model": "Sonata",
    "category": "Economy/Sedan",
    "country": "South Korea",
    "image": "images/economy.png",
    "price_range": "$24k - $34k",
    "fuel_economy": "Around 27‑38 mpg combined depending on engine.",
    "issues_en": "Some owners note engine noise at high revs and the occasional infotainment glitch.",
    "issues_ar": "يشير بعض الملاك إلى ضوضاء في المحرك عند الدوران العالي وبعض مشكلات النظام الترفيهي.",
    "description_en": "A midsize sedan that balances style, value and fuel efficiency; available in hybrid and turbo variants.",
    "description_ar": "سيدان متوسطة الحجم تجمع بين الأناقة والقيمة وكفاءة الوقود؛ تتوفر بنسخ هجينة وتيربو.",
    "purchase_url": "https://www.hyundaiusa.com/us/en/vehicles/sonata",
    "parts_url": "https://parts.hyundaiusa.com/hyundai-sonata-parts"
  },
  {
    "id": 11,
    "brand": "Mercedes-Benz",
    "model": "G-Class",
    "category": "Luxury/SUV",
    "country": "Germany",
    "image": "images/suv.png",
    "price_range": "$131k - $160k",
    "fuel_economy": "About 13‑17 mpg combined.",
    "issues_en": "High purchase and maintenance costs; boxy design leads to wind noise at speed.",
    "issues_ar": "تكاليف شراء وصيانة مرتفعة؛ يتسبب التصميم الصندوقي في ضوضاء الرياح عند السرعة.",
    "description_en": "An iconic luxury off‑roader with serious off‑road capability and a lavish interior; commands a premium price.",
    "description_ar": "سيارة فاخرة ذات قدرة حقيقية على الطرق الوعرة ومقصورة فخمة؛ تتمتع بسعر مرتفع.",
    "purchase_url": "https://www.mbusa.com/en/vehicles/class/g-class/suv",
    "parts_url": "https://parts.mercedes-benz.com/g-class"
  },
  {
    "id": 12,
    "brand": "Jeep",
    "model": "Wrangler",
    "category": "SUV",
    "country": "United States",
    "image": "images/suv.png",
    "price_range": "$31k - $55k",
    "fuel_economy": "18‑24 mpg combined depending on engine.",
    "issues_en": "Known for wind noise and rough ride on pavement; reliability varies with model year.",
    "issues_ar": "معروف بوجود ضوضاء الرياح وركوب قاسٍ على الطرق الممهدة؛ تختلف الموثوقية حسب سنة الموديل.",
    "description_en": "A legendary off‑road SUV with removable doors and roof; prized for its go‑anywhere capability and rugged style.",
    "description_ar": "سيارة دفع رباعي أسطورية بإمكانية إزالة الأبواب والسقف؛ تتميز بقدرة الذهاب إلى أي مكان وأسلوب متين.",
    "purchase_url": "https://www.jeep.com/wrangler.html",
    "parts_url": "https://www.quadratec.com/categories/jeep-wrangler-parts"
  },
  {
    "id": 13,
    "brand": "Lexus",
    "model": "ES",
    "category": "Luxury/Sedan",
    "country": "Japan",
    "image": "images/luxury.png",
    "price_range": "$40k - $50k",
    "fuel_economy": "Around 32‑44 mpg combined for hybrid; 26‑33 mpg for gasoline.",
    "issues_en": "Few serious issues reported; some owners mention minor infotainment quirks.",
    "issues_ar": "قليل من المشاكل الجدية المبلغ عنها؛ يذكر بعض الملاك بعض العيوب البسيطة في نظام المعلومات والترفيه.",
    "description_en": "A refined midsize luxury sedan emphasising comfort and reliability; available with silky V6 or efficient hybrid powertrains.",
    "description_ar": "سيدان فاخرة متوسطة الحجم تركز على الراحة والاعتمادية؛ تتوفر بمحرك V6 سلس أو أنظمة هجينة فعالة.",
    "purchase_url": "https://www.lexus.com/models/ES",
    "parts_url": "https://www.lexuspartsnow.com/parts/lexus-es-series.html"
  }
]
`);

const companiesData = JSON.parse(`
[
  {"name": "Toyota", "country": "Japan"},
  {"name": "Honda", "country": "Japan"},
  {"name": "Nissan", "country": "Japan"},
  {"name": "Mazda", "country": "Japan"},
  {"name": "Subaru", "country": "Japan"},
  {"name": "Mitsubishi", "country": "Japan"},
  {"name": "Lexus", "country": "Japan"},
  {"name": "Acura", "country": "Japan"},
  {"name": "Infiniti", "country": "Japan"},
  {"name": "Suzuki", "country": "Japan"},
  {"name": "Daihatsu", "country": "Japan"},
  {"name": "Ford", "country": "United States"},
  {"name": "Chevrolet", "country": "United States"},
  {"name": "Dodge", "country": "United States"},
  {"name": "Tesla", "country": "United States"},
  {"name": "GMC", "country": "United States"},
  {"name": "Chrysler", "country": "United States"},
  {"name": "Buick", "country": "United States"},
  {"name": "Cadillac", "country": "United States"},
  {"name": "Jeep", "country": "United States"},
  {"name": "Lincoln", "country": "United States"},
  {"name": "Ram", "country": "United States"},
  {"name": "BMW", "country": "Germany"},
  {"name": "Mercedes‑Benz", "country": "Germany"},
  {"name": "Audi", "country": "Germany"},
  {"name": "Volkswagen", "country": "Germany"},
  {"name": "Porsche", "country": "Germany"},
  {"name": "Opel", "country": "Germany"},
  {"name": "Maybach", "country": "Germany"},
  {"name": "Smart", "country": "Germany"},
  {"name": "Jaguar", "country": "United Kingdom"},
  {"name": "Land Rover", "country": "United Kingdom"},
  {"name": "Mini", "country": "United Kingdom"},
  {"name": "Bentley", "country": "United Kingdom"},
  {"name": "Rolls‑Royce", "country": "United Kingdom"},
  {"name": "Aston Martin", "country": "United Kingdom"},
  {"name": "Lotus", "country": "United Kingdom"},
  {"name": "Ferrari", "country": "Italy"},
  {"name": "Lamborghini", "country": "Italy"},
  {"name": "Maserati", "country": "Italy"},
  {"name": "Alfa Romeo", "country": "Italy"},
  {"name": "Fiat", "country": "Italy"},
  {"name": "Peugeot", "country": "France"},
  {"name": "Citroën", "country": "France"},
  {"name": "Renault", "country": "France"},
  {"name": "Bugatti", "country": "France"},
  {"name": "Hyundai", "country": "South Korea"},
  {"name": "Kia", "country": "South Korea"},
  {"name": "Genesis", "country": "South Korea"},
  {"name": "Daewoo", "country": "South Korea"},
  {"name": "BYD", "country": "China"},
  {"name": "Geely", "country": "China"},
  {"name": "NIO", "country": "China"},
  {"name": "Changan", "country": "China"},
  {"name": "GAC", "country": "China"},
  {"name": "Great Wall", "country": "China"},
  {"name": "Volvo", "country": "Sweden"},
  {"name": "Saab", "country": "Sweden"},
  {"name": "Koenigsegg", "country": "Sweden"},
  {"name": "Tata", "country": "India"},
  {"name": "Mahindra", "country": "India"},
  {"name": "Maruti Suzuki", "country": "India"},
  {"name": "Proton", "country": "Malaysia"},
  {"name": "Lada", "country": "Russia"},
  {"name": "Škoda", "country": "Czech Republic"},
  {"name": "SEAT", "country": "Spain"},
  {"name": "Dacia", "country": "Romania"},
  {"name": "Spyker", "country": "Netherlands"}
]
`);

const translations = {
  en: {
    siteTitle: 'AutoAdvisor',
    siteTagline: 'Your companion for all cars',
    navHome: 'Home',
    navCars: 'Cars',
    navCompanies: 'Companies',
    navBudget: 'Budget',
    navContact: 'Contact',
    homeTitle: 'Welcome to AutoAdvisor',
    homeIntro: 'Discover detailed information, tips and expert advice about cars from every category. Compare models, explore manufacturers and find the perfect vehicle for your needs.',
    homeFeature1: 'Browse cars by type: sport, super sport, economy, SUV, luxury and more.',
    homeFeature2: 'Compare fuel economy, prices, common issues and links to trusted sellers and parts.',
    homeFeature3: 'Switch between English and Arabic, and toggle day/night mode for a personalised experience.',
    searchPlaceholder: 'Search by model or brand…',
    carsTitle: 'All Cars',
    companiesTitle: 'Car Manufacturers',
    company: 'Company',
    country: 'Country',
    budgetTitle: 'Budget Recommendations',
    economyBudget: 'Economy (≤ $30k)',
    midBudget: 'Mid‑range ($30k–$50k)',
    luxuryBudget: 'Luxury ($50k–$80k)',
    superBudget: 'Super & Exotic (≥ $80k)',
    budgetIntro: 'Here are some suggestions based on your budget. Prices vary by trim and market.',
    contactTitle: 'Contact Us',
    contactIntro: 'If you have questions or need guidance, reach out via email or phone.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    viewDetails: 'View details',
    price: 'Price',
    category: 'Category',
    fuel: 'Fuel economy',
    issues: 'Common issues',
    description: 'Description',
    purchase: 'Buy',
    parts: 'Parts',
    close: 'Close'
  },
  ar: {
    siteTitle: 'مستشار السيارات',
    siteTagline: 'رفيقك لجميع السيارات',
    navHome: 'الرئيسية',
    navCars: 'السيارات',
    navCompanies: 'الشركات',
    navBudget: 'الميزانية',
    navContact: 'اتصل بنا',
    homeTitle: 'مرحبًا بك في مستشار السيارات',
    homeIntro: 'اكتشف معلومات تفصيلية ونصائح وخبرات حول السيارات من جميع الفئات. قارن بين الطرازات واستكشف الشركات المصنعة واعثر على السيارة المثالية لاحتياجاتك.',
    homeFeature1: 'تصفح السيارات حسب النوع: رياضي، سوبر رياضي، اقتصادي، SUV، فاخرة وغيرها.',
    homeFeature2: 'قارن بين استهلاك الوقود والأسعار والمشاكل الشائعة وروابط البائعين وقطع الغيار الموثوقة.',
    homeFeature3: 'بدّل بين العربية والإنجليزية واختر الوضع النهاري أو الليلي لتجربة شخصية.',
    searchPlaceholder: 'ابحث عن طريق الموديل أو الشركة…',
    carsTitle: 'جميع السيارات',
    companiesTitle: 'الشركات المصنعة للسيارات',
    company: 'الشركة',
    country: 'الدولة',
    budgetTitle: 'اقتراحات الميزانية',
    economyBudget: 'اقتصادية (≤ 30 ألف دولار)',
    midBudget: 'متوسطة (30 ألف – 50 ألف دولار)',
    luxuryBudget: 'فاخرة (50 ألف – 80 ألف دولار)',
    superBudget: 'سوبر وفائقة (≥ 80 ألف دولار)',
    budgetIntro: 'إليك بعض الاقتراحات بناءً على ميزانيتك. تختلف الأسعار حسب الطراز والسوق.',
    contactTitle: 'اتصل بنا',
    contactIntro: 'إذا كانت لديك أسئلة أو بحاجة إلى إرشادات، تواصل معنا عبر البريد الإلكتروني أو الهاتف.',
    emailLabel: 'البريد الإلكتروني',
    phoneLabel: 'الهاتف',
    viewDetails: 'عرض التفاصيل',
    price: 'السعر',
    category: 'الفئة',
    fuel: 'استهلاك الوقود',
    issues: 'المشكلات الشائعة',
    description: 'الوصف',
    purchase: 'شراء',
    parts: 'قطع الغيار',
    close: 'إغلاق'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Set up navigation and initial UI.  Data is already embedded in carsData and companiesData.
  setupNav();
  translateUI();
  loadSection('home');
  // Toggle dark mode
  document.getElementById('modeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  // Language toggle
  document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    translateUI();
    const activeLink = document.querySelector('nav a.active');
    const section = activeLink ? activeLink.dataset.section : 'home';
    loadSection(section);
  });
});

async function fetchJson(path) {
  const response = await fetch(path);
  return await response.json();
}

function setupNav() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      loadSection(section);
    });
  });
}

function translateUI() {
  const t = translations[currentLang];
  // Header
  document.getElementById('siteTitle').textContent = t.siteTitle;
  document.getElementById('siteTagline').textContent = t.siteTagline;
  // Nav labels
  const navMap = {
    home: t.navHome,
    cars: t.navCars,
    companies: t.navCompanies,
    budget: t.navBudget,
    contact: t.navContact
  };
  document.querySelectorAll('nav a').forEach(link => {
    const section = link.dataset.section;
    link.textContent = navMap[section];
  });
  // Language button label
  const langBtn = document.getElementById('langToggle');
  langBtn.textContent = currentLang === 'en' ? 'العربية' : 'English';
  // RTL support
  document.body.classList.toggle('rtl', currentLang === 'ar');
  // Footer
  document.getElementById('footerText').textContent = `© 2025 ${t.siteTitle}. All rights reserved.`;
}

function loadSection(section) {
  // Highlight nav
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section);
  });
  const content = document.getElementById('content');
  // Clear existing content
  content.innerHTML = '';
  switch (section) {
    case 'home':
      loadHome(content);
      break;
    case 'cars':
      loadCars(content);
      break;
    case 'companies':
      loadCompanies(content);
      break;
    case 'budget':
      loadBudget(content);
      break;
    case 'contact':
      loadContact(content);
      break;
    default:
      loadHome(content);
  }
}

function loadHome(container) {
  const t = translations[currentLang];
  const homeDiv = document.createElement('div');
  homeDiv.className = 'home-section';
  homeDiv.innerHTML = `
    <h2>${t.homeTitle}</h2>
    <p>${t.homeIntro}</p>
    <ul>
      <li>${t.homeFeature1}</li>
      <li>${t.homeFeature2}</li>
      <li>${t.homeFeature3}</li>
    </ul>
    <div class="card-grid">
      <div class="card">
        <img src="images/sports_car.png" alt="Sport" />
        <div class="card-content">
          <h3>${currentLang === 'en' ? 'Sport' : 'رياضية'}</h3>
          <p>${currentLang === 'en' ? 'High performance cars for enthusiasts.' : 'سيارات عالية الأداء لعشاق السرعة.'}</p>
        </div>
      </div>
      <div class="card">
        <img src="images/suv.png" alt="SUV" />
        <div class="card-content">
          <h3>${currentLang === 'en' ? 'SUV' : 'سيارات الدفع الرباعي'}</h3>
          <p>${currentLang === 'en' ? 'Versatile vehicles for families and adventurers.' : 'مركبات متعددة الاستخدامات للعائلات والمغامرين.'}</p>
        </div>
      </div>
      <div class="card">
        <img src="images/economy.png" alt="Economy" />
        <div class="card-content">
          <h3>${currentLang === 'en' ? 'Economy' : 'اقتصادية'}</h3>
          <p>${currentLang === 'en' ? 'Affordable and fuel efficient choices.' : 'خيارات ميسورة التكلفة وموفرة للوقود.'}</p>
        </div>
      </div>
      <div class="card">
        <img src="images/luxury.png" alt="Luxury" />
        <div class="card-content">
          <h3>${currentLang === 'en' ? 'Luxury' : 'فاخرة'}</h3>
          <p>${currentLang === 'en' ? 'Premium comfort and advanced technology.' : 'راحة ممتازة وتقنيات متقدمة.'}</p>
        </div>
      </div>
    </div>
  `;
  container.appendChild(homeDiv);
}

function loadCars(container) {
  const t = translations[currentLang];
  const title = document.createElement('h2');
  title.textContent = t.carsTitle;
  container.appendChild(title);
  // Search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'search-bar';
  searchBar.innerHTML = `<input type="text" id="searchInput" placeholder="${t.searchPlaceholder}" aria-label="${t.searchPlaceholder}"><button id="clearSearch" title="Clear">×</button>`;
  container.appendChild(searchBar);
  // Cards container
  const cardsDiv = document.createElement('div');
  cardsDiv.id = 'cards';
  cardsDiv.className = 'card-grid';
  container.appendChild(cardsDiv);
  // Modal for details
  const modal = createModal();
  container.appendChild(modal);
  displayCars(carsData);
  // Event listeners
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    filterCars(searchInput.value.trim().toLowerCase());
  });
  document.getElementById('clearSearch').addEventListener('click', () => {
    searchInput.value = '';
    filterCars('');
  });
}

function createModal() {
  let modal = document.getElementById('detailsModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'detailsModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modalTitle"></h2>
        <button id="modalClose" aria-label="close">×</button>
      </div>
      <div class="modal-body" id="modalBody"></div>
    </div>
  `;
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'modalClose') {
      hideModal();
    }
  });
  return modal;
}

function showModal(car) {
  const t = translations[currentLang];
  const modal = document.getElementById('detailsModal');
  modal.classList.add('active');
  document.getElementById('modalTitle').textContent = `${car.brand} ${car.model}`;
  const body = document.getElementById('modalBody');
  // Build details
  // Remove citation markers enclosed in 【】 from strings for cleaner display
  const removeCitations = (str) => str.replace(/【[^】]+】/g, '');
  const description = currentLang === 'en' ? car.description_en : car.description_ar;
  const issues = currentLang === 'en' ? car.issues_en : car.issues_ar;
  const fuel = car.fuel_economy;
  body.innerHTML = `
    <img src="${car.image}" alt="${car.brand} ${car.model}">
    <p><strong>${t.price}:</strong> ${car.price_range}</p>
    <p><strong>${t.category}:</strong> ${car.category}</p>
    <p><strong>${t.fuel}:</strong> ${removeCitations(fuel)}</p>
    <p><strong>${t.description}:</strong> ${removeCitations(description)}</p>
    <p><strong>${t.issues}:</strong> ${removeCitations(issues)}</p>
    <div class="modal-footer">
      <a href="${car.purchase_url}" target="_blank">${t.purchase}</a>
      <a href="${car.parts_url}" target="_blank">${t.parts}</a>
    </div>
  `;
}

function hideModal() {
  const modal = document.getElementById('detailsModal');
  modal.classList.remove('active');
}

function displayCars(list) {
  const cardsDiv = document.getElementById('cards');
  cardsDiv.innerHTML = '';
  const t = translations[currentLang];
  list.forEach(car => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${car.image}" alt="${car.brand} ${car.model}">
      <div class="card-content">
        <h3>${car.brand} ${car.model}</h3>
        <p>${t.category}: ${car.category}</p>
        <p>${t.price}: ${car.price_range}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      showModal(car);
    });
    cardsDiv.appendChild(card);
  });
}

function filterCars(query) {
  if (!query) {
    displayCars(carsData);
    return;
  }
  const filtered = carsData.filter(car => {
    return car.brand.toLowerCase().includes(query) || car.model.toLowerCase().includes(query) || car.category.toLowerCase().includes(query);
  });
  displayCars(filtered);
}

function loadCompanies(container) {
  const t = translations[currentLang];
  const title = document.createElement('h2');
  title.textContent = t.companiesTitle;
  container.appendChild(title);
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr><th>${t.company}</th><th>${t.country}</th></tr>`;
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  companiesData.forEach(co => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = co.name;
    const tdCountry = document.createElement('td');
    tdCountry.textContent = co.country;
    tr.appendChild(tdName);
    tr.appendChild(tdCountry);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

function loadBudget(container) {
  const t = translations[currentLang];
  const title = document.createElement('h2');
  title.textContent = t.budgetTitle;
  container.appendChild(title);
  const intro = document.createElement('p');
  intro.textContent = t.budgetIntro;
  container.appendChild(intro);
  // Define helper to convert price strings to numeric average
  const parsePrice = (priceRange) => {
    // priceRange like "$22k - $28k" or "$280k - $300k"; remove $ and k, convert to thousands
    const parts = priceRange.replace(/\$/g, '').split('-').map(p => p.trim());
    let nums = parts.map(p => {
      const val = parseFloat(p.replace('k', ''));
      return isNaN(val) ? 0 : val;
    });
    return (nums[0] + nums[nums.length - 1]) / 2;
  };
  // Categories
  const budgets = [
    { key: 'economyBudget', max: 30, list: [] },
    { key: 'midBudget', min: 30, max: 50, list: [] },
    { key: 'luxuryBudget', min: 50, max: 80, list: [] },
    { key: 'superBudget', min: 80, list: [] }
  ];
  carsData.forEach(car => {
    const avgPrice = parsePrice(car.price_range);
    budgets.forEach(b => {
      if ((b.min === undefined || avgPrice >= b.min) && (b.max === undefined || avgPrice <= b.max)) {
        b.list.push(car);
      }
    });
  });
  budgets.forEach(budget => {
    const section = document.createElement('div');
    section.className = 'budget-section';
    const heading = document.createElement('h3');
    heading.textContent = t[budget.key];
    section.appendChild(heading);
    const list = document.createElement('ul');
    budget.list.forEach(car => {
      const li = document.createElement('li');
      li.textContent = `${car.brand} ${car.model} (${car.price_range})`;
      list.appendChild(li);
    });
    section.appendChild(list);
    container.appendChild(section);
  });
}

function loadContact(container) {
  const t = translations[currentLang];
  const title = document.createElement('h2');
  title.textContent = t.contactTitle;
  container.appendChild(title);
  const intro = document.createElement('p');
  intro.textContent = t.contactIntro;
  container.appendChild(intro);
  const emailP = document.createElement('p');
  emailP.innerHTML = `<strong>${t.emailLabel}:</strong> <a href="mailto:info@autoadvisor.com">info@autoadvisor.com</a>`;
  container.appendChild(emailP);
  const phoneP = document.createElement('p');
  phoneP.innerHTML = `<strong>${t.phoneLabel}:</strong> <a href="tel:+15551234567">+1‑555‑123‑4567</a>`;
  container.appendChild(phoneP);
  const suggestion = document.createElement('p');
  suggestion.textContent = currentLang === 'en'
    ? 'For personalised recommendations based on your budget and preferences, feel free to reach out. Our AI helper can guide you to the right car or parts.'
    : 'للحصول على توصيات مخصصة بناءً على ميزانيتك وتفضيلاتك، لا تتردد في التواصل معنا. يمكن لمساعدنا الذكي أن يوجهك إلى السيارة أو القطع المناسبة.';
  container.appendChild(suggestion);
}