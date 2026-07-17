
// This file contains mock data. In a real application, you would fetch this
// data from a database like Firestore.

export type Translatable = {
  en: string;
  hi: string;
  ta: string;
};

export type Product = {
  id: string;
  slug: string;
  name: Translatable;
  artisan: string; // This might be deprecated if we fetch artisan details separately
  artisanId: string;
  price: number;
  imageId: string;
  region: Translatable;
  craft: Translatable;
  gi_tag: Translatable | null;
  description: Translatable;
};

export type Artisan = {
  id: string;
  slug: string;
  name: Translatable;
  craft: Translatable;
  region: Translatable;
  imageId: string;
  story: Translatable;
  products: Product[];
};

export const products: Product[] = [
  {
    id: 'mock-1',
    slug: 'classic-terracotta-vase',
    name: {
      en: 'Classic Terracotta Vase',
      hi: 'क्लासिक टेराकोटा फूलदान',
      ta: 'கிளாசிக் டெரகோட்டா ஜாடி'
    },
    artisan: 'Rajesh Kumar',
    artisanId: 'rajesh-kumar',
    price: 3500.0,
    imageId: 'terracotta-vase',
    region: {
      en: 'Rajasthan',
      hi: 'राजस्थान',
      ta: 'ராஜஸ்தான்'
    },
    craft: {
      en: 'Pottery',
      hi: 'मिट्टी के बर्तन',
      ta: 'மட்பாண்டம்'
    },
    gi_tag: {
      en: 'Molela Clay Work',
      hi: 'मोलेला क्ले वर्क',
      ta: 'மொலேலா களிமண் வேலை'
    },
    description: {
      en:
        "Handcrafted by the skilled artisans of Molela, this terracotta vase embodies centuries of tradition. Its earthy texture and classic form bring a rustic elegance to any space. Perfect for dry flowers or as a standalone decorative piece, it carries the story of Rajasthan's rich soil and vibrant culture.",
      hi:
        "मोलेला के कुशल कारीगरों द्वारा हस्तनिर्मित, यह टेराकोटा फूलदान सदियों की परंपरा का प्रतीक है। इसकी मिट्टी की बनावट और क्लासिक रूप किसी भी स्थान पर एक देहाती लालित्य लाते हैं। सूखे फूलों के लिए या एक स्टैंडअलोन सजावटी टुकड़े के रूप में बिल्कुल सही, यह राजस्थान की समृद्ध मिट्टी और जीवंत संस्कृति की कहानी कहता है।",
      ta:
        "மொலேலாவின் திறமையான கைவினைஞர்களால் கைவினைப்பொருளாக உருவாக்கப்பட்ட இந்த டெரகோட்டா ஜாடி பல நூற்றாண்டுகால பாரம்பரியத்தை உள்ளடக்கியது. அதன் மண் அமைப்பு மற்றும் உன்னதமான வடிவம் எந்த இடத்திற்கும் ஒரு பழமையான நேர்த்தியைக் கொண்டுவருகிறது. உலர்ந்த பூக்களுக்கு அல்லது ஒரு தனித்த அலங்காரப் பொருளாகப் பயன்படுத்த ஏற்றது, यह ராஜஸ்தானின் வளமான மண் மற்றும் துடிப்பான கலாச்சாரத்தின் கதையைச் சொல்கிறது."
    },
  },
  {
    id: 'mock-2',
    slug: 'madhubani-tree-of-life',
    name: {
      en: 'Madhubani "Tree of Life"',
      hi: 'मधुबनी "जीवन का पेड़"',
      ta: 'மதுபானி "வாழ்க்கை மரம்"'
    },
    artisan: 'Sunita Devi',
    artisanId: 'sunita-devi',
    price: 6500.0,
    imageId: 'madhubani-painting',
    region: {
      en: 'Bihar',
      hi: 'बिहार',
      ta: 'பீகார்'
    },
    craft: {
      en: 'Painting',
      hi: 'चित्रकला',
      ta: 'ஓவியம்'
    },
    gi_tag: {
      en: 'Madhubani Painting',
      hi: 'मधुबनी चित्रकला',
      ta: 'மதுபானி ஓவியம்'
    },
    description: {
      en: 'A vibrant depiction of the "Tree of Life" in the traditional Madhubani style. Every line and color is hand-painted using natural dyes on handmade paper, telling a story of nature, life, and prosperity. A masterpiece of Mithila art.',
      hi: 'पारंपरिक मधुबनी शैली में "जीवन के पेड़" का एक जीवंत चित्रण। हर रेखा और रंग को हस्तनिर्मित कागज पर प्राकृतिक रंगों का उपयोग करके हाथ से चित्रित किया गया है, जो प्रकृति, जीवन और समृद्धि की कहानी कहता है। मिथिला कला की एक उत्कृष्ट कृति।',
      ta: 'பாரம்பரிய மதுபானி பாணியில் "வாழ்க்கை மரம்" பற்றிய ஒரு துடிப்பான சித்தரிப்பு. ஒவ்வொரு வரியும் மற்றும் வண்ணமும் கையால் செய்யப்பட்ட காகிதத்தில் இயற்கை சாயங்களைப் பயன்படுத்தி கையால் வரையப்பட்டு, இயற்கை, வாழ்க்கை மற்றும் செழிப்பு பற்றிய கதையைச் சொல்கிறது. மிதிலா கலையின் ஒரு தலைசிறந்த படைப்பு.'
    },
  },
  {
    id: 'mock-3',
    slug: 'kashmiri-pashmina-shawl',
    name: {
      en: 'Kashmiri Pashmina Shawl',
      hi: 'कश्मीरी पश्मीना शॉल',
      ta: 'காஷ்மீரி பஷ்மினா சால்வை'
    },
    artisan: 'Meera Bai',
    artisanId: 'meera-bai',
    price: 20000.0,
    imageId: 'pashmina-shawl',
    region: {
      en: 'Kashmir',
      hi: 'कश्मीर',
      ta: 'காஷ்மீர்'
    },
    craft: {
      en: 'Textiles',
      hi: 'वस्त्र',
      ta: 'ஜவுளி'
    },
    gi_tag: {
      en: 'Kashmir Pashmina',
      hi: 'कश्मीर पश्मीना',
      ta: 'காஷ்மீர் பஷ்மினா'
    },
    description: {
      en: 'Woven from the finest Changthangi goat wool, this authentic Pashmina shawl offers unparalleled softness and warmth. The delicate sozni embroidery is a testament to the masterful craftsmanship of Kashmiri artisans. A timeless piece of luxury.',
      hi: 'सबसे अच्छे चांगथंगी बकरी के ऊन से बुना हुआ, यह प्रामाणिक पश्मीना शॉल अद्वितीय कोमलता और गर्मी प्रदान करता है। नाजुक सोजनी कढ़ाई कश्मीरी कारीगरों की उत्कृष्ट शिल्प कौशल का एक प्रमाण है। विलासिता का एक कालातीत टुकड़ा।',
      ta: 'மிகச்சிறந்த சாங்தாங்கி ஆட்டு கம்பளியிலிருந்து நெய்யப்பட்ட இந்த உண்மையான பஷ்மினா சால்வை இணையற்ற மென்மையையும் அரவணைப்பையும் வழங்குகிறது. மென்மையான சோஸ்னி எம்பிராய்டரி காஷ்மீரி கைவினைஞர்களின் திறமையான கைவினைக்கு ஒரு சான்றாகும். ஆடம்பரத்தின் ஒரு காலமற்ற துண்டு.'
    },
  },
  {
    id: 'mock-4',
    slug: 'hand-carved-wooden-elephant',
    name: {
      en: 'Hand-Carved Wooden Elephant',
      hi: 'हाथ से नक्काशीदार लकड़ी का हाथी',
      ta: 'கையால் செதுக்கப்பட்ட மர யானை'
    },
    artisan: 'Rajesh Kumar',
    artisanId: 'rajesh-kumar',
    price: 4800.0,
    imageId: 'wooden-elephant',
    region: {
      en: 'Rajasthan',
      hi: 'राजस्थान',
      ta: 'ராஜஸ்தான்'
    },
    craft: {
      en: 'Woodcraft',
      hi: 'काष्ठकला',
      ta: 'மரவேலை'
    },
    gi_tag: null,
    description: {
      en: 'A majestic elephant, hand-carved from a single block of sustainable mango wood. The intricate "jali" work showcases the exceptional skill of the artisan, making it a perfect centerpiece for any home.',
      hi: 'एक राजसी हाथी, जिसे टिकाऊ आम की लकड़ी के एक ही ब्लॉक से हाथ से तराशा गया है। जटिल "जाली" का काम कारीगर के असाधारण कौशल को प्रदर्शित करता है, जो इसे किसी भी घर के लिए एक आदर्श केंद्रबिंदु बनाता है।',
      ta: 'ஒரு கம்பீரமான யானை, நிலையான மாம்பழ மரத்தின் ஒற்றை khối இருந்து கையால் செதுக்கப்பட்டது. சிக்கலான "ஜாலி" வேலை கைவினைஞரின் விதிவிலக்கான திறமையை வெளிப்படுத்துகிறது, இது எந்த வீட்டிற்கும் சரியான மையப் பொருளாக அமைகிறது.'
    },
  },
  {
    id: 'mock-5',
    slug: 'jaipur-blue-pottery-plate',
    name: {
      en: 'Jaipur Blue Pottery Plate',
      hi: 'जयपुर ब्लू पॉटरी प्लेट',
      ta: 'ஜெய்ப்பூர் நீல மட்பாண்ட தட்டு'
    },
    artisan: 'Gita Sharma',
    artisanId: 'gita-sharma',
    price: 2800.0,
    imageId: 'blue-pottery-plate',
    region: {
      en: 'Rajasthan',
      hi: 'राजस्थान',
      ta: 'ராஜஸ்தான்'
    },
    craft: {
      en: 'Blue Pottery',
      hi: 'ब्लू पॉटरी',
      ta: 'நீல மட்பாண்டம்'
    },
    gi_tag: {
      en: 'Jaipur Blue Pottery',
      hi: 'जयपुर ब्लू पॉटरी',
      ta: 'ஜெய்ப்பூர் நீல மட்பாண்டம்'
    },
    description: {
      en: 'A stunning decorative plate crafted in the world-renowned Blue Pottery style of Jaipur. Made from a unique quartz frit, it features intricate, hand-painted floral motifs in brilliant cobalt blue and turquoise. A piece of royal history for your home.',
      hi: 'जयपुर की विश्व प्रसिद्ध ब्लू पॉटरी शैली में तैयार की गई एक शानदार सजावटी प्लेट। एक अद्वितीय क्वार्ट्ज फ्रिट से निर्मित, इसमें शानदार कोबाल्ट नीले और फ़िरोज़ा में जटिल, हाथ से चित्रित पुष्प रूपांकन हैं। आपके घर के लिए शाही इतिहास का एक टुकड़ा।',
      ta: 'ஜெய்ப்பூரின் உலகப் புகழ்பெற்ற நீல மட்பாண்ட பாணியில் வடிவமைக்கப்பட்ட ஒரு பிரமிக்க வைக்கும் அலங்கார தட்டு. ஒரு தனித்துவமான குவார்ட்ஸ் ஃப்ரெட்டிலிருந்து தயாரிக்கப்பட்டது, இது புத்திசாலித்தனமான கோபால்ட் நீலம் மற்றும் டர்க்கைஸ் ஆகியவற்றில் சிக்கலான, கையால் வரையப்பட்ட மலர் μοτίφ களைக் கொண்டுள்ளது. உங்கள் வீட்டிற்கு அரச வரலாற்றின் ஒரு துண்டு.'
    },
  },
  {
    id: 'mock-6',
    slug: 'handcrafted-leather-mojari',
    name: {
      en: 'Handcrafted Leather Mojari',
      hi: 'हस्तनिर्मित चमड़े की मोजरी',
      ta: 'கையால் செய்யப்பட்ட தோல் மொஜாரி'
    },
    artisan: 'Ahmed Khan',
    artisanId: 'ahmed-khan',
    price: 3200.0,
    imageId: 'leather-mojari',
    region: {
      en: 'Rajasthan',
      hi: 'राजस्थान',
      ta: 'ராஜஸ்தான்'
    },
    craft: {
      en: 'Leatherwork',
      hi: 'चमड़े का काम',
      ta: 'தோல் வேலை'
    },
    gi_tag: null,
    description: {
      en: 'Experience the regal comfort of Jodhpuri Mojaris, handcrafted by master artisan Ahmed Khan. Made from genuine camel leather and adorned with exquisite thread embroidery, these traditional shoes are a perfect blend of style and heritage.',
      hi: 'मास्टर कारीगर अहमद खान द्वारा दस्तकारी, जोधपुरी मोजारिस के शाही आराम का अनुभव करें। असली ऊंट के चमड़े से बने और उत्तम धागे की कढ़ाई से सजे, ये पारंपरिक जूते शैली और विरासत का एक आदर्श मिश्रण हैं।',
      ta: 'மாஸ்டர் கைவினைஞர் அகமது கானால் கையால் செய்யப்பட்ட ஜோத்புரி மொஜாரிகளின் அரச வசதியை அனுபவியுங்கள். உண்மையான ஒட்டகத் தோலிலிருந்து தயாரிக்கப்பட்டு நேர்த்தியான நூல் எம்பிராய்டரியால் அலங்கரிக்கப்பட்ட இந்த பாரம்பரிய காலணிகள் பாணி மற்றும் பாரம்பரியத்தின் சரியான கலவையாகும்.'
    },
  },
  {
    id: 'pattachitra-painting-1',
    slug: 'pattachitra-painting-1',
    name: {
      en: 'Pattachitra: The Divine Story',
      hi: 'पट्टचित्र: दिव्य कथा',
      ta: 'பட்டசித்ரா: தெய்வீக கதை'
    },
    artisan: 'Shrihan Sahoo',
    artisanId: 'shrihan-sahoo',
    price: 8200.0,
    imageId: 'pattachitra-painting',
    region: {
      en: 'Odisha',
      hi: 'ओडिशा',
      ta: 'ஒடிசா'
    },
    craft: {
      en: 'Pattachitra Painting',
      hi: 'पट्टचित्र चित्रकला',
      ta: 'பட்டசித்ரா ஓவியம்'
    },
    gi_tag: {
      en: 'Odisha Pattachitra',
      hi: 'ओडिशा पट्टचित्र',
      ta: 'ஒடிசா பட்டசித்ரா'
    },
    description: {
      en: 'This intricate Pattachitra canvas, painted by the renowned artist Shrihan Sahoo, depicts a tale from the Mahabharata. Created with natural pigments on a specially prepared cloth canvas, this piece is a beautiful example of a GI-tagged craft from Odisha.',
      hi: 'प्रसिद्ध कलाकार श्रीहन साहू द्वारा चित्रित यह जटिल पट्टचित्र कैनवास, महाभारत की एक कहानी को दर्शाता है। एक विशेष रूप से तैयार किए गए कपड़े के कैनवास पर प्राकृतिक रंगों से बनाया गया यह टुकड़ा, ओडिशा से जीआई-टैग वाले शिल्प का एक सुंदर उदाहरण है।',
      ta: 'பிரபல கலைஞர் ஸ்ரீஹன் சாஹூவால் வரையப்பட்ட இந்த சிக்கலான பட்டசித்ரா கேன்வாஸ், மகாபாரதத்தின் ஒரு கதையை சித்தரிக்கிறது. ஒரு சிறப்பாக தயாரிக்கப்பட்ட துணி கேன்வாஸில் இயற்கை நிறமிகளுடன் உருவாக்கப்பட்ட இந்த துண்டு, ஒடிசாவிலிருந்து ஜிஐ-குறியிடப்பட்ட கைவினையின் ஒரு அழகான உதாரணமாகும்.'
    }
  }
];

export const artisans: Artisan[] = [
  {
    id: 'meera-bai',
    slug: 'meera-bai',
    name: {
      en: 'Meera Bai',
      hi: 'मीरा बाई',
      ta: 'மீரா பாய்'
    },
    craft: {
      en: 'Textiles & Embroidery',
      hi: 'वस्त्र और कढ़ाई',
      ta: 'ஜவுளி மற்றும் எம்பிராய்டரி'
    },
    region: {
      en: 'Gujarat',
      hi: 'गुजरात',
      ta: 'குஜராத்'
    },
    imageId: 'artisan-meera',
    story: {
      en: 'From a small village in Kutch, Meera Bai inherited the art of embroidery from her mother and grandmother. For over 30 years, she has been weaving stories into fabric, creating vibrant pieces that reflect the desert landscape and the rich culture of her community. Her work helps support her family and preserve the traditional craft for future generations.',
      hi: 'कच्छ के एक छोटे से गाँव से, मीरा बाई को अपनी माँ और दादी से कढ़ाई की कला विरासत में मिली। 30 से अधिक वर्षों से, वह कपड़े में कहानियाँ बुन रही हैं, जो रेगिस्तानी परिदृश्य और अपने समुदाय की समृद्ध संस्कृति को दर्शाती जीवंत कृतियों का निर्माण कर रही हैं। उनका काम उनके परिवार का समर्थन करने और आने वाली पीढ़ियों के लिए पारंपरिक शिल्प को संरक्षित करने में मदद करता है।',
      ta: 'கட்ச்சில் உள்ள ஒரு சிறிய கிராமத்திலிருந்து, மீரா பாய் தனது தாய் மற்றும் பாட்டியிடமிருந்து எம்பிராய்டரி கலையை மரபுரிமையாகப் பெற்றார். 30 ஆண்டுகளுக்கும் மேலாக, அவர் துணியில் கதைகளை நெசவு செய்து, பாலைவன நிலப்பரப்பையும், தனது சமூகத்தின் வளமான கலாச்சாரத்தையும் பிரதிபலிக்கும் துடிப்பான துண்டுகளை உருவாக்குகிறார். அவரது பணி அவரது குடும்பத்தை ஆதரிக்கவும், எதிர்கால சந்ததியினருக்காக பாரம்பரிய கைவினைப்பொருளைப் பாதுகாக்கவும் உதவுகிறது.'
    },
    products: products.filter((p) => p.artisanId === 'meera-bai'),
  },
  {
    id: 'rajesh-kumar',
    slug: 'rajesh-kumar',
    name: {
      en: 'Rajesh Kumar',
      hi: 'राजेश कुमार',
      ta: 'ராஜேஷ் குமார்'
    },
    craft: {
      en: 'Pottery & Woodcraft',
      hi: 'मिट्टी के बर्तन और काष्ठकला',
      ta: 'மட்பாண்டம் மற்றும் மரவேலை'
    },
    region: {
      en: 'Rajasthan',
      hi: 'राजस्थान',
      ta: 'ராஜஸ்தான்'
    },
    imageId: 'artisan-raj',
    story: {
      en: 'Rajesh Kumar is a third-generation artisan from Jaipur, known as the Pink City. He masterfully works with both clay and wood, creating pieces that are a blend of traditional motifs and contemporary aesthetics. His workshop is a place of magic, where raw materials are transformed into objects of beauty.',
      hi: 'राजेश कुमार जयपुर, जिसे गुलाबी शहर के नाम से जाना जाता है, के तीसरी पीढ़ी के कारीगर हैं। वह मिट्टी और लकड़ी दोनों के साथ कुशलता से काम करते हैं, जो पारंपरिक रूपांकनों और समकालीन सौंदर्यशास्त्र का मिश्रण हैं। उनकी कार्यशाला जादू की जगह है, जहाँ कच्चे माल को सुंदरता की वस्तुओं में बदल दिया जाता है।',
      ta: 'ராஜேஷ் குமார், இளஞ்சிவப்பு நகரம் என்று அழைக்கப்படும் ஜெய்ப்பூரைச் சேர்ந்த மூன்றாம் தலைமுறை கைவினைஞர். அவர் களிமண் மற்றும் மரம் இரண்டிலும் திறமையாக வேலை செய்கிறார், பாரம்பரிய μοτίφகள் மற்றும் சமகால அழகியலின் கலவையான துண்டுகளை உருவாக்குகிறார். அவரது பட்டறை மந்திரத்தின் ஒரு இடம், அங்கு மூலப்பொருட்கள் அழகு பொருள்களாக மாற்றப்படுகின்றன.'
    },
    products: products.filter(p => p.artisanId === 'rajesh-kumar')
  },
  {
    id: 'sunita-devi',
    slug: 'sunita-devi',
    name: {
      en: 'Sunita Devi',
      hi: 'सुनीता देवी',
      ta: 'சுனிதா தேவி'
    },
    craft: {
      en: 'Madhubani Painting',
      hi: 'मधुबनी चित्रकला',
      ta: 'மதுபானி ஓவியம்'
    },
    region: {
      en: 'Bihar',
      hi: 'बिहार',
      ta: 'பீகார்'
    },
    imageId: 'artisan-sunita',
    story: {
      en: "Sunita Devi's paintings are a vibrant celebration of life and nature, rendered in the ancient Madhubani style. Using brushes made from bamboo and natural pigments, she creates intricate patterns on handmade paper and canvas. Each painting is a prayer and a story, passed down through generations of women in her family.",
      hi: "सुनीता देवी की पेंटिंग जीवन और प्रकृति का एक जीवंत उत्सव है, जिसे प्राचीन मधुबनी शैली में प्रस्तुत किया गया है। बांस और प्राकृतिक रंगों से बने ब्रश का उपयोग करके, वह हस्तनिर्मित कागज और कैनवास पर जटिल पैटर्न बनाती हैं। प्रत्येक पेंटिंग एक प्रार्थना और एक कहानी है, जो उनके परिवार की महिलाओं की पीढ़ियों से चली आ रही है।",
      ta: "சுனிதா தேவியின் ஓவியங்கள் வாழ்க்கை மற்றும் இயற்கையின் ஒரு துடிப்பான கொண்டாட்டமாகும், இது பண்டைய மதுபானி பாணியில் வழங்கப்படுகிறது. மூங்கில் மற்றும் இயற்கை நிறமிகளிலிருந்து தயாரிக்கப்பட்ட தூரிகைகளைப் பயன்படுத்தி, அவர் கையால் செய்யப்பட்ட காகிதம் மற்றும் கேன்வாஸில் சிக்கலான வடிவங்களை உருவாக்குகிறார். ஒவ்வொரு ஓவியமும் ஒரு பிரார்த்தனை மற்றும் ஒரு கதை, அவரது குடும்பத்தில் உள்ள பெண்களின் தலைமுறைகளாக அனுப்பப்படுகிறது."
    },
    products: products.filter(p => p.artisanId === 'sunita-devi')
  },
  {
    id: 'gita-sharma',
    slug: 'gita-sharma',
    name: {
      en: 'Gita Sharma',
      hi: 'गीता शर्मा',
      ta: 'கீதா சர்மா'
    },
    craft: {
      en: 'Jaipur Blue Pottery',
      hi: 'जयपुर ब्लू पॉटरी',
      ta: 'ஜெய்ப்பூர் நீல மட்பாண்டம்'
    },
    region: {
      en: 'Jaipur, Rajasthan',
      hi: 'जयपुर, राजस्थान',
      ta: 'ஜெய்ப்பூர், ராஜஸ்தான்'
    },
    imageId: 'artisan-gita',
    story: {
      en: "Gita Sharma is one of the few women artisans preserving the Persian art of Blue Pottery in Jaipur. Unlike traditional ceramics, it uses no clay. Her motifs are inspired by Mughal-era designs, creating timeless pieces that have found homes in collections around the world. Each piece is a testament to her dedication.",
      hi: "गीता शर्मा जयपुर में ब्लू पॉटरी की फारसी कला को संरक्षित करने वाली कुछ महिला कारीगरों में से एक हैं। पारंपरिक सिरेमिक के विपरीत, इसमें कोई मिट्टी का उपयोग नहीं होता है। उनके रूपांकन मुगल-युग के डिजाइनों से प्रेरित हैं, जो दुनिया भर के संग्रहों में घर पा चुके कालातीत टुकड़ों का निर्माण करते हैं। प्रत्येक टुकड़ा उनके समर्पण का एक प्रमाण है।",
      ta: "ஜெய்ப்பூரில் உள்ள ப்ளூ பாட்டரியின் பாரசீகக் கலையைப் பாதுகாக்கும் சில பெண் கைவினைஞர்களில் கீதா சர்மாவும் ஒருவர். பாரம்பரிய பீங்கான்களைப் போலல்லாமல், இது களிமண்ணைப் பயன்படுத்துவதில்லை. அவரது μοτίφகள் முகலாயர் கால வடிவமைப்புகளால் ஈர்க்கப்பட்டு, உலகெங்கிலும் உள்ள சேகரிப்புகளில் வீடுகளைக் கண்டறிந்த காலமற்ற துண்டுகளை உருவாக்குகின்றன. ஒவ்வொரு துண்டும் அவரது அர்ப்பணிப்புக்கு ஒரு சான்றாகும்."
    },
    products: products.filter(p => p.artisanId === 'gita-sharma')
  },
  {
    id: 'ahmed-khan',
    slug: 'ahmed-khan',
    name: {
      en: 'Ahmed Khan',
      hi: 'अहमद खान',
      ta: 'அகமது கான்'
    },
    craft: {
      en: 'Leatherwork',
      hi: 'चमड़े का काम',
      ta: 'தோல் வேலை'
    },
    region: {
      en: 'Jodhpur, Rajasthan',
      hi: 'जोधपुर, राजस्थान',
      ta: 'ஜோத்பூர், ராஜஸ்தான்'
    },
    imageId: 'artisan-ahmed',
    story: {
      en: 'For Ahmed Khan, making leather Mojaris is a family legacy. He learned the craft from his father in the bustling markets of Jodhpur. He uses traditional techniques to tan and treat the leather, ensuring each pair is not only beautiful but also incredibly durable and comfortable, fit for royalty.',
      hi: 'अहमद खान के लिए, चमड़े की मोजरी बनाना एक पारिवारिक विरासत है। उन्होंने जोधपुर के हलचल भरे बाजारों में अपने पिता से यह शिल्प सीखा। वह चमड़े को टैन करने और इलाज के लिए पारंपरिक तकनीकों का उपयोग करते हैं, यह सुनिश्चित करते हुए कि प्रत्येक जोड़ी न केवल सुंदर है, बल्कि अविश्वसनीय रूप से टिकाऊ और आरामदायक भी है, जो रॉयल्टी के लिए उपयुक्त है।',
      ta: 'அகமது கானுக்கு, தோல் மொஜாரிகளை உருவாக்குவது ஒரு குடும்ப மரபு. ஜோத்பூரின் பரபரப்பான சந்தைகளில் தனது தந்தையிடமிருந்து இந்த கைவினைப்பொருளைக் கற்றுக்கொண்டார். அவர் தோலை பதனிடுவதற்கும் சிகிச்சையளிப்பதற்கும் பாரம்பரிய நுட்பங்களைப் பயன்படுத்துகிறார், ஒவ்வொரு ஜோடியும் அழகாக மட்டுமல்ல, நம்பமுடியாத அளவிற்கு நீடித்த மற்றும் வசதியானதாகவும், ராயல்டிக்கு ஏற்றதாகவும் இருப்பதை உறுதிசெய்கிறார்.'
    },
    products: products.filter(p => p.artisanId === 'ahmed-khan')
  },
  {
    id: 'shrihan-sahoo',
    slug: 'shrihan-sahoo',
    name: {
      en: 'Shrihan Sahoo',
      hi: 'श्रीहन साहू',
      ta: 'ஸ்ரீஹான் சாஹூ'
    },
    craft: {
      en: 'Pattachitra Painting',
      hi: 'पट्टचित्र चित्रकला',
      ta: 'பட்டசித்ரா ஓவியம்'
    },
    region: {
      en: 'Odisha',
      hi: 'ओडिशा',
      ta: 'ஒடிசா'
    },
    imageId: 'artisan-shrihan',
    story: {
        en: 'A master of the Pattachitra art form, Shrihan Sahoo hails from a long line of artists in Raghurajpur, the heritage crafts village of Odisha. His work is known for its incredible detail, use of natural pigments, and powerful storytelling, bringing ancient epics to life on palm leaves and tussar silk.',
        hi: 'पट्टचित्र कला के एक उस्ताद, श्रीहन साहू रघुराजपुर, ओडिशा के विरासत शिल्प गांव के कलाकारों की एक लंबी कतार से आते हैं। उनका काम अपने अविश्वसनीय विस्तार, प्राकृतिक रंगों के उपयोग और शक्तिशाली कहानी कहने के लिए जाना जाता है, जो ताड़ के पत्तों और टसर रेशम पर प्राचीन महाकाव्यों को जीवंत करता है।',
        ta: 'பட்டசித்ரா கலை வடிவத்தின் ஒரு மாஸ்டர், ஸ்ரீஹான் சாஹூ ஒடிசாவின் பாரம்பரிய கைவினைக் கிராமமான ரகுராஜ்பூரில் உள்ள கலைஞர்களின் நீண்ட வரிசையிலிருந்து வருகிறார். அவரது படைப்பு அதன் நம்பமுடியாத விவரம், இயற்கை நிறமிகளின் பயன்பாடு மற்றும் சக்திவாய்ந்த கதைசொல்லலுக்காக அறியப்படுகிறது, இது பனை ஓலைகள் மற்றும் டசர் பட்டு மீது பண்டைய இதிகாசங்களை உயிர்ப்பிக்கிறது.'
    },
    products: products.filter(p => p.artisanId === 'shrihan-sahoo')
  }
];

    
