function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==UserScript==
// @name        Linkify Plus Plus
// @version     7.4.4
// @namespace   eight04.blogspot.com
// @description Based on Linkify Plus. Turn plain text URLs into links.
// @include     *
// @exclude     https://www.google.*/search*
// @exclude     https://www.google.*/webhp*
// @exclude     https://music.google.com/*
// @exclude     https://mail.google.com/*
// @exclude     https://docs.google.com/*
// @exclude     https://encrypted.google.com/*
// @exclude     http://mxr.mozilla.org/*
// @exclude		http://w3c*.github.io/*
// @require https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// ==/UserScript==

(function () {

	// Limit contentType to "text/plain" or "text/html"
	if (document.contentType != undefined && document.contentType != "text/plain" && document.contentType != "text/html") {
		return;
	}

	// url matcher
	var Linkifier = function () {
		// $inline.shortcut("tlds", "../tlds.json|parse:$&")
		var RE = {
			PROTOCOL: "([a-z][-a-z*]+://)?",
			USER: "(?:([\\w:.+-]+)@)?",
			DOMAIN_UNI: "([a-z0-9-.\\u00A0-\\uFFFF]+\\.[a-z0-9-セール佛山慈善集团在线한국八卦موقعবাংল公司香格里拉网站移动我爱你москвақзнлйтрбгеファッションストア삼성சிங்கபூர商标城дию新闻家電中文信国國భారత్ලංකාクラウドભારતभारत店संगठन餐厅络у港食品飞利浦台湾灣手机الجزئرنیتبپکسدية澳門닷컴شكგე构健康ไทยфみんなελ世界書籍址넷コム息嘉大酒صط广东இலைநதயாհայ加坡ف]{1,22})",
			DOMAIN: "([a-z0-9-.]+\\.[a-z0-9-]{1,22})",
			PORT: "(:\\d+\\b)?",
			PATH_UNI: "([/?#]\\S*)?",
			PATH: "([/?#][\\w-.~!$&*+;=:@%/?#(),'\\[\\]]*)?",
			MUSTACHE: "\\{\\{.+?\\}\\}"
		},
		    TLD_TABLE = { "aarp": true, "abb": true, "abbott": true, "abc": true, "abogado": true, "ac": true, "academy": true, "accenture": true, "accountant": true, "accountants": true, "aco": true, "active": true, "actor": true, "ad": true, "adult": true, "ae": true, "aeg": true, "aero": true, "af": true, "afamilycompany": true, "afl": true, "africa": true, "ag": true, "agency": true, "ai": true, "aig": true, "airbus": true, "airforce": true, "al": true, "alsace": true, "am": true, "amica": true, "amsterdam": true, "ao": true, "apartments": true, "aq": true, "aquarelle": true, "ar": true, "archi": true, "army": true, "art": true, "arte": true, "as": true, "asia": true, "associates": true, "at": true, "attorney": true, "au": true, "auction": true, "audi": true, "audio": true, "auto": true, "autos": true, "aw": true, "aws": true, "ax": true, "axa": true, "az": true, "azure": true, "ba": true, "baby": true, "baidu": true, "band": true, "bank": true, "bar": true, "barcelona": true, "barclaycard": true, "barclays": true, "bargains": true, "bayern": true, "bb": true, "bbva": true, "bd": true, "be": true, "beer": true, "bentley": true, "berlin": true, "best": true, "bet": true, "bf": true, "bg": true, "bh": true, "bi": true, "bible": true, "bid": true, "bike": true, "bing": true, "bingo": true, "bio": true, "biz": true, "bj": true, "black": true, "blackfriday": true, "blanco": true, "blog": true, "bloomberg": true, "blue": true, "bm": true, "bms": true, "bmw": true, "bn": true, "bnpparibas": true, "bo": true, "boats": true, "bosch": true, "boutique": true, "br": true, "bradesco": true, "bridgestone": true, "broadway": true, "broker": true, "brother": true, "brussels": true, "bs": true, "bt": true, "bugatti": true, "build": true, "builders": true, "business": true, "buzz": true, "bw": true, "by": true, "bz": true, "bzh": true, "ca": true, "cab": true, "cafe": true, "cam": true, "camera": true, "camp": true, "cancerresearch": true, "canon": true, "capetown": true, "capital": true, "car": true, "cards": true, "care": true, "career": true, "careers": true, "cars": true, "casa": true, "cash": true, "casino": true, "cat": true, "catering": true, "cba": true, "cc": true, "cd": true, "center": true, "ceo": true, "cern": true, "cf": true, "cfa": true, "cfd": true, "cg": true, "ch": true, "chanel": true, "chase": true, "chat": true, "cheap": true, "christmas": true, "church": true, "ci": true, "cisco": true, "citic": true, "city": true, "ck": true, "cl": true, "claims": true, "cleaning": true, "click": true, "clinic": true, "clothing": true, "cloud": true, "club": true, "clubmed": true, "cm": true, "cn": true, "co": true, "coach": true, "codes": true, "coffee": true, "college": true, "cologne": true, "com": true, "community": true, "company": true, "computer": true, "condos": true, "construction": true, "consulting": true, "contractors": true, "cooking": true, "cool": true, "coop": true, "corsica": true, "country": true, "coupons": true, "courses": true, "cr": true, "credit": true, "creditcard": true, "cricket": true, "crown": true, "crs": true, "cruises": true, "csc": true, "cu": true, "cuisinella": true, "cv": true, "cw": true, "cx": true, "cy": true, "cymru": true, "cz": true, "dabur": true, "dance": true, "date": true, "dating": true, "de": true, "deals": true, "degree": true, "delivery": true, "dell": true, "deloitte": true, "democrat": true, "dental": true, "dentist": true, "desi": true, "design": true, "dhl": true, "diamonds": true, "diet": true, "digital": true, "direct": true, "directory": true, "discount": true, "dj": true, "dk": true, "dm": true, "dnp": true, "do": true, "doctor": true, "dog": true, "domains": true, "download": true, "dubai": true, "duck": true, "durban": true, "dvag": true, "dz": true, "earth": true, "ec": true, "eco": true, "edeka": true, "edu": true, "education": true, "ee": true, "eg": true, "email": true, "emerck": true, "energy": true, "engineer": true, "engineering": true, "enterprises": true, "equipment": true, "er": true, "ericsson": true, "erni": true, "es": true, "estate": true, "et": true, "eu": true, "eurovision": true, "eus": true, "events": true, "everbank": true, "exchange": true, "expert": true, "exposed": true, "express": true, "extraspace": true, "fage": true, "fail": true, "fairwinds": true, "faith": true, "family": true, "fan": true, "fans": true, "farm": true, "fashion": true, "feedback": true, "ferrero": true, "fi": true, "film": true, "finance": true, "financial": true, "firmdale": true, "fish": true, "fishing": true, "fit": true, "fitness": true, "fj": true, "fk": true, "flights": true, "florist": true, "flowers": true, "fm": true, "fo": true, "foo": true, "football": true, "forex": true, "forsale": true, "forum": true, "foundation": true, "fox": true, "fr": true, "fresenius": true, "frl": true, "frogans": true, "fun": true, "fund": true, "furniture": true, "futbol": true, "fyi": true, "ga": true, "gal": true, "gallery": true, "game": true, "games": true, "garden": true, "gd": true, "gdn": true, "ge": true, "gent": true, "genting": true, "gf": true, "gg": true, "gh": true, "gi": true, "gift": true, "gifts": true, "gives": true, "gl": true, "glade": true, "glass": true, "global": true, "globo": true, "gm": true, "gmail": true, "gmbh": true, "gmo": true, "gn": true, "gold": true, "golf": true, "goo": true, "goog": true, "google": true, "gop": true, "gov": true, "gp": true, "gq": true, "gr": true, "graphics": true, "gratis": true, "green": true, "gripe": true, "group": true, "gs": true, "gt": true, "gu": true, "guardian": true, "gucci": true, "guide": true, "guitars": true, "guru": true, "gw": true, "gy": true, "hamburg": true, "haus": true, "healthcare": true, "help": true, "here": true, "hiphop": true, "hitachi": true, "hiv": true, "hk": true, "hm": true, "hn": true, "hockey": true, "holdings": true, "holiday": true, "homes": true, "horse": true, "host": true, "hosting": true, "hoteles": true, "hotmail": true, "house": true, "how": true, "hr": true, "ht": true, "hu": true, "ice": true, "id": true, "ie": true, "ifm": true, "ikano": true, "il": true, "im": true, "immo": true, "immobilien": true, "in": true, "industries": true, "info": true, "ink": true, "institute": true, "insurance": true, "insure": true, "int": true, "international": true, "investments": true, "io": true, "ipiranga": true, "iq": true, "ir": true, "irish": true, "is": true, "iselect": true, "ist": true, "istanbul": true, "it": true, "itv": true, "jaguar": true, "java": true, "jcb": true, "je": true, "jetzt": true, "jewelry": true, "jll": true, "jm": true, "jmp": true, "jo": true, "jobs": true, "joburg": true, "jp": true, "jprs": true, "juegos": true, "kaufen": true, "ke": true, "kerryhotels": true, "kg": true, "kh": true, "ki": true, "kim": true, "kinder": true, "kitchen": true, "kiwi": true, "km": true, "kn": true, "koeln": true, "komatsu": true, "kp": true, "kpn": true, "kr": true, "krd": true, "kred": true, "kw": true, "ky": true, "kyoto": true, "kz": true, "la": true, "ladbrokes": true, "lamborghini": true, "lancaster": true, "land": true, "landrover": true, "lat": true, "latrobe": true, "law": true, "lawyer": true, "lb": true, "lc": true, "lease": true, "leclerc": true, "legal": true, "lego": true, "lexus": true, "lgbt": true, "li": true, "liaison": true, "lidl": true, "life": true, "lighting": true, "limited": true, "limo": true, "linde": true, "link": true, "lipsy": true, "live": true, "lixil": true, "lk": true, "loan": true, "loans": true, "locus": true, "lol": true, "london": true, "lotto": true, "love": true, "lr": true, "ls": true, "lt": true, "ltd": true, "ltda": true, "lu": true, "lundbeck": true, "lupin": true, "luxury": true, "lv": true, "ly": true, "ma": true, "maif": true, "maison": true, "makeup": true, "man": true, "management": true, "mango": true, "market": true, "marketing": true, "markets": true, "marriott": true, "mba": true, "mc": true, "md": true, "me": true, "med": true, "media": true, "melbourne": true, "memorial": true, "men": true, "menu": true, "mg": true, "mh": true, "miami": true, "microsoft": true, "mil": true, "mini": true, "mk": true, "ml": true, "mm": true, "mma": true, "mn": true, "mo": true, "mobi": true, "moda": true, "moe": true, "moi": true, "mom": true, "monash": true, "money": true, "mortgage": true, "moscow": true, "motorcycles": true, "movie": true, "mp": true, "mq": true, "mr": true, "ms": true, "mt": true, "mtn": true, "mtr": true, "mu": true, "museum": true, "mv": true, "mw": true, "mx": true, "my": true, "mz": true, "na": true, "nadex": true, "nagoya": true, "name": true, "natura": true, "navy": true, "nc": true, "ne": true, "nec": true, "net": true, "network": true, "neustar": true, "new": true, "news": true, "next": true, "nextdirect": true, "nf": true, "ng": true, "ngo": true, "ni": true, "nico": true, "nikon": true, "ninja": true, "nissay": true, "nl": true, "no": true, "nokia": true, "norton": true, "np": true, "nr": true, "nra": true, "nrw": true, "ntt": true, "nu": true, "nyc": true, "nz": true, "obi": true, "off": true, "okinawa": true, "om": true, "omega": true, "one": true, "ong": true, "onl": true, "online": true, "ooo": true, "oracle": true, "orange": true, "org": true, "organic": true, "osaka": true, "otsuka": true, "ovh": true, "pa": true, "page": true, "paris": true, "partners": true, "parts": true, "party": true, "pe": true, "pet": true, "pf": true, "pg": true, "ph": true, "pharmacy": true, "philips": true, "photo": true, "photography": true, "photos": true, "physio": true, "pics": true, "pictet": true, "pictures": true, "pink": true, "pizza": true, "pk": true, "pl": true, "place": true, "plumbing": true, "plus": true, "pm": true, "pn": true, "poker": true, "porn": true, "post": true, "pr": true, "praxi": true, "press": true, "pro": true, "productions": true, "promo": true, "properties": true, "property": true, "protection": true, "pru": true, "ps": true, "pt": true, "pub": true, "pw": true, "py": true, "qa": true, "qpon": true, "quebec": true, "racing": true, "radio": true, "raid": true, "re": true, "realtor": true, "realty": true, "recipes": true, "red": true, "redstone": true, "rehab": true, "reise": true, "reisen": true, "reit": true, "ren": true, "rent": true, "rentals": true, "repair": true, "report": true, "republican": true, "rest": true, "restaurant": true, "review": true, "reviews": true, "rexroth": true, "rich": true, "ricoh": true, "rio": true, "rip": true, "ro": true, "rocks": true, "rodeo": true, "rs": true, "ru": true, "ruhr": true, "run": true, "rw": true, "rwe": true, "ryukyu": true, "sa": true, "saarland": true, "sale": true, "salon": true, "samsung": true, "sandvik": true, "sandvikcoromant": true, "sanofi": true, "sap": true, "sarl": true, "saxo": true, "sb": true, "sbs": true, "sc": true, "sca": true, "scb": true, "schmidt": true, "school": true, "schule": true, "schwarz": true, "science": true, "scjohnson": true, "scot": true, "sd": true, "se": true, "seat": true, "security": true, "sener": true, "services": true, "seven": true, "sew": true, "sex": true, "sexy": true, "sfr": true, "sg": true, "sh": true, "shangrila": true, "sharp": true, "shell": true, "shiksha": true, "shoes": true, "shop": true, "shopping": true, "show": true, "shriram": true, "si": true, "singles": true, "site": true, "sk": true, "ski": true, "skin": true, "sky": true, "skype": true, "sl": true, "sm": true, "smart": true, "sn": true, "sncf": true, "so": true, "soccer": true, "social": true, "software": true, "sohu": true, "solar": true, "solutions": true, "sony": true, "soy": true, "space": true, "spreadbetting": true, "sr": true, "srl": true, "st": true, "stada": true, "statoil": true, "stc": true, "storage": true, "store": true, "stream": true, "studio": true, "study": true, "style": true, "su": true, "sucks": true, "supplies": true, "supply": true, "support": true, "surf": true, "surgery": true, "suzuki": true, "sv": true, "swatch": true, "swiss": true, "sx": true, "sy": true, "sydney": true, "symantec": true, "systems": true, "sz": true, "taipei": true, "tatamotors": true, "tatar": true, "tattoo": true, "tax": true, "taxi": true, "tc": true, "td": true, "team": true, "tech": true, "technology": true, "tel": true, "tennis": true, "teva": true, "tf": true, "tg": true, "th": true, "theater": true, "theatre": true, "tickets": true, "tienda": true, "tiffany": true, "tips": true, "tires": true, "tirol": true, "tj": true, "tk": true, "tl": true, "tm": true, "tn": true, "to": true, "today": true, "tokyo": true, "tools": true, "top": true, "toray": true, "toshiba": true, "total": true, "tours": true, "town": true, "toyota": true, "toys": true, "tr": true, "trade": true, "trading": true, "training": true, "travel": true, "travelers": true, "trust": true, "tt": true, "tube": true, "tv": true, "tw": true, "tz": true, "ua": true, "ubs": true, "ug": true, "uk": true, "university": true, "uno": true, "uol": true, "us": true, "uy": true, "uz": true, "va": true, "vacations": true, "vc": true, "ve": true, "vegas": true, "ventures": true, "versicherung": true, "vet": true, "vg": true, "vi": true, "viajes": true, "video": true, "villas": true, "vin": true, "vip": true, "vision": true, "vistaprint": true, "vlaanderen": true, "vn": true, "vodka": true, "volkswagen": true, "volvo": true, "vote": true, "voting": true, "voto": true, "voyage": true, "vu": true, "wales": true, "walter": true, "wang": true, "warman": true, "watch": true, "webcam": true, "weber": true, "website": true, "wed": true, "wedding": true, "weir": true, "wf": true, "whoswho": true, "wien": true, "wiki": true, "williamhill": true, "win": true, "windows": true, "wine": true, "wme": true, "work": true, "works": true, "world": true, "ws": true, "wtf": true, "xbox": true, "xin": true, "xn--1ck2e1b": true, "xn--1qqw23a": true, "xn--30rr7y": true, "xn--3bst00m": true, "xn--3ds443g": true, "xn--3e0b707e": true, "xn--45q11c": true, "xn--4gbrim": true, "xn--54b7fta0cc": true, "xn--55qx5d": true, "xn--5su34j936bgsg": true, "xn--5tzm5g": true, "xn--6frz82g": true, "xn--6qq986b3xl": true, "xn--80adxhks": true, "xn--80ao21a": true, "xn--80asehdb": true, "xn--80aswg": true, "xn--90a3ac": true, "xn--90ae": true, "xn--90ais": true, "xn--bck1b9a5dre4c": true, "xn--c1avg": true, "xn--cck2b3b": true, "xn--cg4bki": true, "xn--clchc0ea0b2g2a9gcd": true, "xn--czr694b": true, "xn--czru2d": true, "xn--d1acj3b": true, "xn--d1alf": true, "xn--e1a4c": true, "xn--efvy88h": true, "xn--fct429k": true, "xn--fiq228c5hs": true, "xn--fiq64b": true, "xn--fiqs8s": true, "xn--fiqz9s": true, "xn--fpcrj9c3d": true, "xn--fzc2c9e2c": true, "xn--gckr3f0f": true, "xn--gecrj9c": true, "xn--h2brj9c": true, "xn--hxt814e": true, "xn--i1b6b1a6a2e": true, "xn--imr513n": true, "xn--io0a7i": true, "xn--j1amh": true, "xn--j6w193g": true, "xn--jvr189m": true, "xn--kcrx77d1x4a": true, "xn--kprw13d": true, "xn--kpry57d": true, "xn--kput3i": true, "xn--l1acc": true, "xn--lgbbat1ad8j": true, "xn--mgb9awbf": true, "xn--mgba3a4f16a": true, "xn--mgbaam7a8h": true, "xn--mgbab2bd": true, "xn--mgbai9azgqp6j": true, "xn--mgbayh7gpa": true, "xn--mgberp4a5d4ar": true, "xn--mgbtx2b": true, "xn--mix891f": true, "xn--mk1bu44c": true, "xn--ngbc5azd": true, "xn--node": true, "xn--nqv7f": true, "xn--nyqy26a": true, "xn--o3cw4h": true, "xn--ogbpf8fl": true, "xn--p1acf": true, "xn--p1ai": true, "xn--pgbs0dh": true, "xn--q9jyb4c": true, "xn--qxam": true, "xn--rhqv96g": true, "xn--rovu88b": true, "xn--ses554g": true, "xn--t60b56a": true, "xn--tckwe": true, "xn--vuq861b": true, "xn--w4r85el8fhu5dnra": true, "xn--wgbh1c": true, "xn--wgbl6a": true, "xn--xhq521b": true, "xn--xkc2al3hye2a": true, "xn--xkc2dl3a5ee0h": true, "xn--y9a3aq": true, "xn--yfro4i67o": true, "xn--ygbi2ammx": true, "xperia": true, "xxx": true, "xyz": true, "yachts": true, "yandex": true, "ye": true, "yoga": true, "yokohama": true, "yt": true, "za": true, "zm": true, "zone": true, "zw": true, "セール": true, "佛山": true, "慈善": true, "集团": true, "在线": true, "한국": true, "八卦": true, "موقع": true, "বাংলা": true, "公司": true, "香格里拉": true, "网站": true, "移动": true, "我爱你": true, "москва": true, "қаз": true, "онлайн": true, "сайт": true, "срб": true, "бг": true, "бел": true, "ファッション": true, "орг": true, "ストア": true, "삼성": true, "சிங்கப்பூர்": true, "商标": true, "商城": true, "дети": true, "мкд": true, "ею": true, "新闻": true, "家電": true, "中文网": true, "中信": true, "中国": true, "中國": true, "భారత్": true, "ලංකා": true, "クラウド": true, "ભારત": true, "भारत": true, "网店": true, "संगठन": true, "餐厅": true, "网络": true, "укр": true, "香港": true, "食品": true, "飞利浦": true, "台湾": true, "台灣": true, "手机": true, "мон": true, "الجزائر": true, "عمان": true, "ایران": true, "امارات": true, "بازار": true, "پاکستان": true, "الاردن": true, "السعودية": true, "عراق": true, "澳門": true, "닷컴": true, "شبكة": true, "გე": true, "机构": true, "健康": true, "ไทย": true, "سورية": true, "рус": true, "рф": true, "تونس": true, "みんな": true, "ελ": true, "世界": true, "書籍": true, "网址": true, "닷넷": true, "コム": true, "信息": true, "嘉里大酒店": true, "مصر": true, "قطر": true, "广东": true, "இலங்கை": true, "இந்தியா": true, "հայ": true, "新加坡": true, "فلسطين": true };

		function regexEscape(text) {
			return text.replace(/[\[\]\\^-]/g, "\\$&");
		}

		// function regexClone(regex) {
		// var flags = "";
		// if (regex.global) flags += "g";
		// if (regex.multiline) flags += "m";
		// if (regex.ignoreCase) flags += "i";
		// return new RegExp(regex.source, flags);
		// }

		function buildRegex(_ref) {
			var _ref$unicode = _ref.unicode,
			    unicode = _ref$unicode === undefined ? false : _ref$unicode,
			    _ref$customRules = _ref.customRules,
			    customRules = _ref$customRules === undefined ? [] : _ref$customRules,
			    _ref$standalone = _ref.standalone,
			    standalone = _ref$standalone === undefined ? false : _ref$standalone,
			    boundaryLeft = _ref.boundaryLeft,
			    boundaryRight = _ref.boundaryRight;

			var pattern = RE.PROTOCOL + RE.USER;

			if (unicode) {
				pattern += RE.DOMAIN_UNI + RE.PORT + RE.PATH_UNI;
			} else {
				pattern += RE.DOMAIN + RE.PORT + RE.PATH;
			}

			if (customRules.length) {
				pattern = "(?:" + pattern + "|(" + customRules.join("|") + "))";
			} else {
				pattern += "()";
			}

			var prefix, suffix, invalidSuffix;
			if (standalone) {
				if (boundaryLeft) {
					prefix = "((?:^|\\s)[" + regexEscape(boundaryLeft) + "]*?)";
				} else {
					prefix = "(^|\\s)";
				}
				if (boundaryRight) {
					suffix = "([" + regexEscape(boundaryRight) + "]*(?:$|\\s))";
				} else {
					suffix = "($|\\s)";
				}
				invalidSuffix = "[^\\s" + regexEscape(boundaryRight) + "]";
			} else {
				prefix = "(^|\\b|_)";
				suffix = "()";
			}

			pattern = prefix + pattern + suffix;

			return {
				url: new RegExp(pattern, "igm"),
				invalidSuffix: invalidSuffix && new RegExp(invalidSuffix),
				mustache: new RegExp(RE.MUSTACHE, "g")
			};
		}

		function pathStrip(m, re, repl) {
			var s = m.path.replace(re, repl);

			if (s == m.path) return;

			m.end -= m.path.length - s.length;
			m.suffix = m.path.slice(s.length) + m.suffix;
			m.path = s;
		}

		function pathStripQuote(m, c) {
			var i = 0,
			    s = m.path,
			    end,
			    pos = 0;

			if (!s.endsWith(c)) return;

			while ((pos = s.indexOf(c, pos)) >= 0) {
				if (i % 2) {
					end = null;
				} else {
					end = pos;
				}
				pos++;
				i++;
			}

			if (!end) return;

			m.end -= s.length - end;
			m.path = s.slice(0, end);
			m.suffix = s.slice(end) + m.suffix;
		}

		function pathStripBrace(m, left, right) {
			var str = m.path,
			    re = new RegExp("[\\" + left + "\\" + right + "]", "g"),
			    match,
			    count = 0,
			    end;

			// Match loop
			while (match = re.exec(str)) {
				if (count % 2 == 0) {
					end = match.index;
					if (match[0] == right) {
						break;
					}
				} else {
					if (match[0] == left) {
						break;
					}
				}
				count++;
			}

			if (!match && count % 2 == 0) {
				return;
			}

			m.end -= m.path.length - end;
			m.path = str.slice(0, end);
			m.suffix = str.slice(end) + m.suffix;
		}

		function isIP(s) {
			var m, i;
			if (!(m = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/))) {
				return false;
			}
			for (i = 1; i < m.length; i++) {
				if (+m[i] > 255 || m[i].length > 1 && m[i][0] == "0") {
					return false;
				}
			}
			return true;
		}

		function isDomain(d) {
			return (/^[^.-]/.test(d) && d.indexOf("..") < 0
			);
		}

		function inTLDS(domain) {
			var match = domain.match(/\.([^.]+)$/);
			if (!match) {
				return false;
			}
			var key = match[1].toLowerCase();
			return TLD_TABLE.hasOwnProperty(key);
		}

		var Linkifier = function () {
			function Linkifier(options) {
				_classCallCheck(this, Linkifier);

				this.config(options);
			}

			Linkifier.prototype.config = function config() {
				var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
				    _ref2$fuzzyIp = _ref2.fuzzyIp,
				    fuzzyIp = _ref2$fuzzyIp === undefined ? true : _ref2$fuzzyIp,
				    _ref2$ignoreMustache = _ref2.ignoreMustache,
				    ignoreMustache = _ref2$ignoreMustache === undefined ? false : _ref2$ignoreMustache,
				    unicode = _ref2.unicode,
				    customRules = _ref2.customRules,
				    standalone = _ref2.standalone,
				    boundaryLeft = _ref2.boundaryLeft,
				    boundaryRight = _ref2.boundaryRight;

				this.fuzzyIp = fuzzyIp;
				this.ignoreMustache = ignoreMustache;
				this.regex = buildRegex({
					unicode, customRules, standalone, boundaryLeft, boundaryRight
				});
			};

			Linkifier.prototype.parse = function* parse(text) {
				var _regex = this.regex,
				    url = _regex.url,
				    invalidSuffix = _regex.invalidSuffix,
				    mustache = _regex.mustache,
				    urlLastIndex,
				    mustacheLastIndex;


				mustache.lastIndex = 0;
				url.lastIndex = 0;

				var mustacheMatch, mustacheRange;
				if (this.ignoreMustache) {
					mustacheMatch = mustache.exec(text);
					if (mustacheMatch) {
						mustacheRange = {
							start: mustacheMatch.index,
							end: mustache.lastIndex
						};
					}
				}

				var urlMatch;
				while (urlMatch = url.exec(text)) {
					var result;
					if (urlMatch[7]) {
						// custom rules
						result = {
							start: urlMatch.index,
							end: url.lastIndex,

							text: urlMatch[0],
							url: urlMatch[0],

							custom: urlMatch[7]
						};
					} else {
						result = {
							start: urlMatch.index + urlMatch[1].length,
							end: url.lastIndex - urlMatch[8].length,

							text: null,
							url: null,

							prefix: urlMatch[1],
							protocol: urlMatch[2],
							user: urlMatch[3] || "",
							domain: urlMatch[4],
							port: urlMatch[5] || "",
							path: urlMatch[6] || "",
							custom: urlMatch[7],
							suffix: urlMatch[8]
						};
					}

					if (mustacheRange && mustacheRange.end <= result.start) {
						mustacheMatch = mustache.exec(text);
						if (mustacheMatch) {
							mustacheRange.start = mustacheMatch.index;
							mustacheRange.end = mustache.lastIndex;
						} else {
							mustacheRange = null;
						}
					}

					// ignore urls inside mustache pair
					if (mustacheRange && result.start < mustacheRange.end && result.end >= mustacheRange.start) {
						continue;
					}

					if (!result.custom) {
						// adjust path and suffix
						if (result.path) {
							// Strip BBCode
							pathStrip(result, /\[\/?(b|i|u|url|img|quote|code|size|color)\].*/i, "");

							// Strip braces
							pathStripBrace(result, "(", ")");
							pathStripBrace(result, "[", "]");
							pathStripBrace(result, "{", "}");

							// Strip quotes
							pathStripQuote(result, "'");
							pathStripQuote(result, '"');

							// Remove trailing ".,?"
							pathStrip(result, /(^|[^-_])[.,?]+$/, "$1");
						}

						// check suffix
						if (invalidSuffix && invalidSuffix.test(result.suffix)) {
							if (/\s$/.test(result.suffix)) {
								url.lastIndex--;
							}
							continue;
						}

						// check domain
						if (isIP(result.domain)) {
							if (!this.fuzzyIp && !result.protocol && !result.user && !result.path) {
								continue;
							}
						} else if (isDomain(result.domain)) {
							if (!inTLDS(result.domain)) {
								continue;
							}
						} else {
							continue;
						}

						// mailto protocol
						if (!result.protocol && result.user) {
							var matchMail = result.user.match(/^mailto:(.+)/);
							if (matchMail) {
								result.protocol = "mailto:";
								result.user = matchMail[1];
							}
						}

						// http alias
						if (result.protocol && result.protocol.match(/^(hxxp|h\*\*p|ttp)/)) {
							result.protocol = "http://";
						}

						// guess protocol
						if (!result.protocol) {
							var domainMatch;
							if (domainMatch = result.domain.match(/^(ftp|irc)/)) {
								result.protocol = domainMatch[0] + "://";
							} else if (result.domain.match(/^(www|web)/)) {
								result.protocol = "http://";
							} else if (result.user && result.user.indexOf(":") < 0 && !result.path) {
								result.protocol = "mailto:";
							} else {
								result.protocol = "http://";
							}
						}

						// Create URL
						result.url = result.protocol + (result.user && result.user + "@") + result.domain + result.port + result.path;
						result.text = text.slice(result.start, result.end);
					}

					// since regex is shared with other parse generators, cache lastIndex position and restore later
					mustacheLastIndex = mustache.lastIndex;
					urlLastIndex = url.lastIndex;

					yield result;

					url.lastIndex = urlLastIndex;
					mustache.lastIndex = mustacheLastIndex;
				}
			};

			return Linkifier;
		}();

		return Linkifier;
	}();

	// Linkify Plus Plus core
	var linkify = function () {

		var INVALID_TAGS = {
			A: true,
			NOSCRIPT: true,
			OPTION: true,
			SCRIPT: true,
			STYLE: true,
			TEXTAREA: true,
			SVG: true,
			CANVAS: true,
			BUTTON: true,
			SELECT: true,
			TEMPLATE: true,
			METER: true,
			PROGRESS: true,
			MATH: true,
			TIME: true
		};

		var Pos = function () {
			function Pos(container, offset) {
				var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

				_classCallCheck(this, Pos);

				this.container = container;
				this.offset = offset;
				this.i = i;
			}

			Pos.prototype.add = function add(change) {
				var cont = this.container,
				    offset = this.offset;

				this.i += change;

				// If the container is #text.parentNode
				if (cont.childNodes.length) {
					cont = cont.childNodes[offset];
					offset = 0;
				}

				// If the container is #text
				while (cont) {
					if (cont.nodeType == 3) {
						if (!cont.LEN) {
							cont.LEN = cont.nodeValue.length;
						}
						if (offset + change <= cont.LEN) {
							this.container = cont;
							this.offset = offset + change;
							return;
						}
						change = offset + change - cont.LEN;
						offset = 0;
					}
					cont = cont.nextSibling;
				}
			};

			Pos.prototype.moveTo = function moveTo(offset) {
				this.add(offset - this.i);
			};

			return Pos;
		}();

		function* generateRanges(node, filter) {
			// Generate linkified ranges.
			var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT + NodeFilter.SHOW_ELEMENT, filter),
			    start,
			    end,
			    current,
			    range;

			end = start = walker.nextNode();
			if (!start) {
				return;
			}
			range = document.createRange();
			range.setStartBefore(start);
			while (current = walker.nextNode()) {
				if (end.nextSibling == current) {
					end = current;
					continue;
				}
				range.setEndAfter(end);
				yield range;

				end = start = current;
				// range = document.createRange();
				range.setStartBefore(start);
			}
			range.setEndAfter(end);
			yield range;
		}

		function createFilter(customValidator) {
			return {
				acceptNode: function (node) {
					if (customValidator && !customValidator(node)) {
						return NodeFilter.FILTER_REJECT;
					}
					if (INVALID_TAGS[node.nodeName]) {
						return NodeFilter.FILTER_REJECT;
					}
					if (node.nodeName == "WBR") {
						return NodeFilter.FILTER_ACCEPT;
					}
					if (node.nodeType == 3) {
						return NodeFilter.FILTER_ACCEPT;
					}
					return NodeFilter.FILTER_SKIP;
				}
			};
		}

		function cloneContents(range) {
			if (range.startContainer == range.endContainer) {
				return document.createTextNode(range.toString());
			}
			return range.cloneContents();
		}

		function linkify(root, _ref3) {
			var linkifier = _ref3.linkifier,
			    validator = _ref3.validator,
			    _ref3$maxRunTime = _ref3.maxRunTime,
			    maxRunTime = _ref3$maxRunTime === undefined ? 100 : _ref3$maxRunTime,
			    _ref3$timeout = _ref3.timeout,
			    timeout = _ref3$timeout === undefined ? 10000 : _ref3$timeout,
			    _ref3$newTab = _ref3.newTab,
			    newTab = _ref3$newTab === undefined ? true : _ref3$newTab,
			    _ref3$embedImage = _ref3.embedImage,
			    embedImage = _ref3$embedImage === undefined ? true : _ref3$embedImage;

			var filter = createFilter(validator),
			    ranges = generateRanges(root, filter),
			    linkifyStart = Date.now();

			function* createChunks() {
				for (var range of ranges) {
					var frag = null,
					    pos = null,
					    text = range.toString(),
					    textRange = null;
					for (var result of linkifier.parse(text)) {
						if (!frag) {
							frag = document.createDocumentFragment();
							pos = new Pos(range.startContainer, range.startOffset);
							textRange = range.cloneRange();
						}
						// clone text
						pos.moveTo(result.start);
						textRange.setEnd(pos.container, pos.offset);
						frag.appendChild(cloneContents(textRange));

						// clone link
						textRange.collapse();
						pos.moveTo(result.end);
						textRange.setEnd(pos.container, pos.offset);

						var link = document.createElement("a");
						link.href = result.url;
						link.title = "Linkify Plus Plus";
						link.className = "linkifyplus";
						if (newTab) {
							link.target = "_blank";
						}
						var child;
						if (embedImage && /^[^?#]+\.(?:jpg|png|gif|jpeg)(?:$|[?#])/i.test(result.url)) {
							child = new Image();
							child.src = result.url;
							child.alt = result.text;
						} else {
							child = cloneContents(textRange);
						}
						link.appendChild(child);

						textRange.collapse();

						frag.appendChild(link);
						yield;
					}
					if (pos) {
						pos.moveTo(text.length);
						textRange.setEnd(pos.container, pos.offset);
						frag.appendChild(cloneContents(textRange));

						range.deleteContents();
						range.insertNode(frag);
					}
					yield;
				}
			}

			return new Promise(resolve => {
				var chunks = createChunks();
				function next() {
					var timeStart = Date.now(),
					    now;
					do {
						if (chunks.next().done) {
							// console.log("linkify on %o: finished in %dms", root, Date.now() - linkifyStart);
							resolve();
							return;
						}
					} while ((now = Date.now()) - timeStart < maxRunTime);

					if (now - linkifyStart > timeout) {
						console.error("linkify on %o: max execution time exceeded: %dms", root, now - linkifyStart);
						resolve();
						return;
					}

					requestAnimationFrame(next);
				}
				requestAnimationFrame(next);
			});
		}

		return {
			INVALID_TAGS, linkify
		};
	}();

	// Valid root node before linkifing
	function validRoot(node, validator) {
		// Cache valid state in node.VALID
		if (node.VALID !== undefined) {
			return node.VALID;
		}

		// Loop through ancestor
		var cache = [],
		    isValid;
		while (node != document.documentElement) {
			cache.push(node);

			// It is invalid if it has invalid ancestor
			if (!validator(node) || linkify.INVALID_TAGS[node.nodeName]) {
				isValid = false;
				break;
			}

			// The node was removed from DOM tree
			if (!node.parentNode) {
				return false;
			}

			node = node.parentNode;

			if (node.VALID !== undefined) {
				isValid = node.VALID;
				break;
			}
		}

		// All ancestors are fine
		if (isValid === undefined) {
			isValid = true;
		}

		// Cache the result
		var i;
		for (i = 0; i < cache.length; i++) {
			cache[i].VALID = isValid;
		}

		return isValid;
	}

	function createValidator(_ref4) {
		var selector = _ref4.selector,
		    skipSelector = _ref4.skipSelector;

		return function (node) {
			if (node.contentEditable == "true" || node.contentEditable == "") {
				return false;
			}
			if (selector && node.matches && node.matches(selector)) {
				return true;
			}
			if (skipSelector && node.matches && node.matches(skipSelector)) {
				return false;
			}
			return true;
		};
	}

	function selectorTest(selector) {
		try {
			document.documentElement.matches(selector);
		} catch (err) {
			alert(`Invalid selector: ${selector}`);
			return false;
		}
		return true;
	}

	function createList(text) {
		text = text.trim();
		if (!text) {
			return null;
		}
		return text.split("\n");
	}

	var options, status;

	status = {
		working: null,
		pending: []
	};

	function linkifyRoot(root) {
		if (!validRoot(root, options.validator)) {
			return;
		}

		if (root.LINKIFY_PENDING) {
			return;
		}

		if (status.working) {
			root.LINKIFY_PENDING = true;
			status.pending.push(root);
			return;
		}
		status.working = root;

		linkify.linkify(root, options).then(() => {
			var p = Promise.resolve();
			if (options.selector) {
				for (var node of root.querySelectorAll(options.selector)) {
					p = p.then(linkify.linkify.bind(null, node, options));
				}
			}
			p.then(() => {
				status.working = null;
				if (status.pending.length) {
					root = status.pending.pop();
					root.LINKIFY_PENDING = false;
					linkifyRoot(root);
				}
			});
		});
	}

	// Program init
	GM_config.setup({
		ip: {
			label: "Match 4 digits IP",
			type: "checkbox",
			default: true
		},
		image: {
			label: "Embed images",
			type: "checkbox",
			default: true
		},
		unicode: {
			label: "Allow non-ascii character",
			type: "checkbox",
			default: false
		},
		newTab: {
			label: "Open link in new tab",
			type: "checkbox",
			default: false
		},
		standalone: {
			label: "URL must be surrounded by whitespace",
			type: "checkbox",
			default: false
		},
		boundaryLeft: {
			label: "Boundary characters between whitespace and URL (left)",
			type: "text",
			default: "{[(\"'"
		},
		boundaryRight: {
			label: "Boundary characters between whitespace and URL (right)",
			type: "text",
			default: "'\")]},.;?!"
		},
		skipSelector: {
			label: "Do not linkify these elements. (CSS selector)",
			type: "textarea",
			default: ".highlight, .editbox, .brush\\:, .bdsug, .spreadsheetinfo"
		},
		selector: {
			label: "Always linkify these elements, override above. (CSS selector)",
			type: "textarea",
			default: ""
		},
		timeout: {
			label: "Max execution time (ms).",
			type: "number",
			default: 10000
		},
		maxRunTime: {
			label: "Max script run time (ms). If the script is freezing your browser, try to decrease this value.",
			type: "number",
			default: 100
		},
		customRules: {
			label: "Custom rules. One pattern per line. (RegExp)",
			type: "textarea",
			default: ""
		}
	}, function () {
		options = GM_config.get();
		if (options.selector && !selectorTest(options.selector)) {
			options.selector = null;
		}
		if (options.skipSelector && !selectorTest(options.skipSelector)) {
			options.skipSelector = null;
		}
		if (options.customRules) {
			options.customRules = createList(options.customRules);
		}
		options.validator = createValidator(options);
		options.fuzzyIp = options.ip;
		options.ignoreMustache = unsafeWindow.angular || unsafeWindow.Vue;
		options.embedImage = options.image;
		options.linkifier = new Linkifier(options);
	});

	GM_addStyle(".linkifyplus img { max-width: 90%; }");

	new MutationObserver(function (mutations) {
		// Filter out mutations generated by LPP
		var lastRecord = mutations[mutations.length - 1],
		    nodes = lastRecord.addedNodes,
		    i;

		if (nodes.length >= 2) {
			for (i = 0; i < 2; i++) {
				if (nodes[i].className == "linkifyplus") {
					return;
				}
			}
		}

		if (mutations.length > 100) {
			// Do not use mutations when too big
			linkifyRoot(document.body);
		} else {
			for (var record of mutations) {
				if (record.addedNodes.length) {
					linkifyRoot(record.target);
				}
			}
		}
	}).observe(document.body, {
		childList: true,
		subtree: true
	});

	linkifyRoot(document.body);
})();
