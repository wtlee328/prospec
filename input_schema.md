# Leads Finder Input Schema

This document outlines the input parameters for the Leads Finder Actor. These
settings allow you to filter leads by person, company, location, and revenue
data.

## ⚙️ General Settings

| Field         | Type    | Default     | Description                                                                                    |
| :------------ | :------ | :---------- | :--------------------------------------------------------------------------------------------- |
| `fetch_count` | integer | 50000       | The maximum number of leads to scrape. Leave empty to scrape all leads matching your criteria. |
| `file_name`   | string  | "Prospects" | A custom name or label for the dataset file to easily recognize it in your run history.        |

## 👤 Contact Filters

| Field                   | Type  | Description                                                                                    |
| :---------------------- | :---- | :--------------------------------------------------------------------------------------------- |
| `contact_job_title`     | array | List of job titles to include (e.g., "realtor", "software developer", "teacher").              |
| `contact_not_job_title` | array | List of job titles to exclude.                                                                 |
| `seniority_level`       | array | Filter by seniority (e.g., Owner, Partner, CXO, VP, Director, Manager, Senior, Entry, Unpaid). |
| `functional_level`      | array | Filter by job function/department (e.g., Engineering, Sales, Marketing, HR, Finance).          |
| `email_status`          | array | Filter by the validity of email addresses (e.g., "Verified", "Guessed").                       |

## 🌍 Location Filters

| Field                  | Type         | Description                                                                                         |
| :--------------------- | :----------- | :-------------------------------------------------------------------------------------------------- |
| `contact_location`     | enum (array) | Select one or more regions, countries, or states to include. Restricted to the values listed below. |
| `contact_city`         | array        | Specify one or more cities to include.                                                              |
| `contact_not_location` | array        | Select one or more regions, countries, or states to exclude.                                        |
| `contact_not_city`     | array        | Specify one or more cities to exclude.                                                              |

### Allowed Values for `contact_location`

"united states", "germany", "india", "united kingdom", "russia", "france",
"china", "canada", "netherlands", "mexico", "belgium", "japan", "brazil",
"australia", "poland", "thailand", "sweden", "portugal", "spain", "czech
republic", "taiwan", "south africa", "colombia", "italy", "vietnam", "nigeria",
"singapore", "hong kong", "ireland", "israel", "switzerland", "turkey",
"romania", "south korea", "indonesia", "united arab emirates", "saudi arabia",
"austria", "philippines", "peru", "malaysia", "argentina", "ukraine", "ghana",
"denmark", "norway", "finland", "puerto rico", "qatar", "macau", "new zealand",
"hungary", "luxembourg", "kuwait", "egypt", "slovakia", "greece", "kenya",
"bulgaria", "costa rica", "chile", "venezuela", "afghanistan", "bangladesh",
"malta", "guatemala", "pakistan", "lithuania", "panama", "morocco", "republic of
indonesia", "uruguay", "serbia", "bolivia", "angola", "dominican republic",
"ecuador", "oman", "jamaica", "zambia", "lebanon", "tanzania", "jordan",
"algeria", "gibraltar", "paraguay", "cambodia", "uganda", "mozambique",
"ethiopia", "belarus", "republic of the union of myanmar", "croatia", "jersey",
"iraq", "isle of man", "el salvador", "estonia", "latvia", "côte d'ivoire",
"tunisia", "sierra leone", "senegal", "sri lanka", "cyprus", "kazakhstan",
"guernsey", "bermuda", "mali", "honduras", "bahrain", "slovenia", "papua new
guinea", "iceland", "mauritius", "iran", "niger", "rwanda", "moldova",
"democratic republic of the congo", "liechtenstein", "fiji", "kyrgyzstan",
"azerbaijan", "madagascar", "trinidad and tobago", "lesotho", "nicaragua",
"cameroon", "barbados", "armenia", "haiti", "maldives", "guam", "laos", "nepal",
"brunei", "reunion", "macedonia (fyrom)", "swaziland", "liberia", "uzbekistan",
"sudan", "anguilla", "cuba", "cayman islands", "seychelles", "saint kitts and
nevis", "suriname", "bosnia and herzegovina", "malawi", "the bahamas",
"botswana", "syria", "burundi", "guadeloupe", "namibia", "burkina faso",
"somalia", "greenland", "equatorial guinea", "chad", "monaco", "republic of the
congo", "u.s. virgin islands", "mayotte", "french polynesia", "french guiana",
"andorra", "new caledonia", "central african republic", "myanmar (burma)",
"belize", "aland islands", "solomon islands", "kosovo", "gabon", "benin",
"bonaire, sint eustatius and saba", "martinique", "tonga", "south sudan", "cook
islands", "georgia", "mauritania", "turkmenistan", "libya", "falkland islands
(islas malvinas)", "bhutan", "tajikistan", "northern mariana islands", "western
sahara", "guyana", "dominica", "vanuatu", "kiribati", "togo", "nauru", "samoa",
"mongolia", "myanmar", "yemen", "albania", "montenegro", "california, us",
"texas, us", "england, united kingdom", "new york, us", "florida, us",
"illinois, us", "moscow, russia", "bavaria, germany", "pennsylvania, us",
"virginia, us", "ohio, us", "massachusetts, us", "baden-württemberg, germany",
"north rhine-westphalia, germany", "georgia, us", "michigan, us", "north
carolina, us", "maryland, us", "berlin, germany", "new jersey, us", "bangkok,
thailand", "île-de-france, france", "maharashtra, india", "washington, us",
"ontario, canada", "beijing, china", "colorado, us", "minnesota, us",
"karnataka, india", "hamburg, germany", "indiana, us", "shanghai, china",
"lisbon, portugal", "flanders, belgium", "arizona, us", "ciudad de méxico,
mexico", "wisconsin, us", "tennessee, us", "missouri, us", "saint petersburg,
russia", "hesse, germany", "tamil nadu, india", "oregon, us", "lower saxony,
germany", "south carolina, us", "connecticut, us", "delhi, india", "north
holland, netherlands", "kentucky, us", "new south wales, australia", "district
of columbia, us", "telangana, india", "iowa, us", "guangdong, china", "nevada,
us", "alabama, us", "louisiana, us", "state of são paulo, brazil", "british
columbia, canada", "utah, us", "kansas, us", "saxony, germany", "lagos,
nigeria", "nebraska, us", "oklahoma, us", "overijssel, netherlands", "alberta,
canada", "bogota, colombia", "brussels, belgium", "south holland, netherlands",
"dublin, ireland", "haryana, india", "north brabant, netherlands", "uttar
pradesh, india", "victoria, australia", "stockholm county, sweden", "moscow
oblast, russia", "pays de la loire, france", "scotland, united kingdom", "new
hampshire, us", "rhineland-palatinate, germany", "arkansas, us", "utrecht,
netherlands", "new mexico, us", "gujarat, india", "dubai, united arab emirates",
"quebec, canada", "bremen, germany", "lima, peru", "chongqing, china", "masovian
voivodeship, poland", "gelderland, netherlands", "chandigarh, india", "hanoi,
vietnam", "provence-alpes-côte d'azur, france", "mississippi, us", "västra
götaland county, sweden", "schleswig-holstein, germany", "west virginia, us",
"jiangsu, china", "rhone-alpes, france", "zhejiang, china", "maine, us",
"queensland, australia", "idaho, us", "brandenburg, germany", "jalisco, mexico",
"nord-pas-de-calais, france", "auvergne-rhône-alpes, france",
"aquitaine-limousin-poitou-charentes, france", "rhode island, us",
"saxony-anhalt, germany", "north dakota, us", "porto district, portugal",
"delaware, us", "catalonia, spain", "montana, us", "hawaii, us", "gauteng, south
africa", "lower silesian voivodeship, poland", "lesser poland voivodeship,
poland", "western cape, south africa", "doha, qatar", "madhya pradesh, india",
"jakarta, indonesia", "krasnodar krai, russia", "thuringia, germany", "kerala,
india", "bucharest, romania", "aquitaine, france", "brittany, france", "estado
de méxico, mexico", "vienna, austria", "riyadh province, saudi arabia",
"tianjin, china", "prague, czech republic", "ho chi minh, vietnam", "metro
manila, philippines", "limburg, netherlands", "san juan, puerto rico", "alaska,
us", "samara oblast, russia", "lombardy, italy", "silesian voivodeship, poland",
"hlavní město praha, czech republic", "kanagawa prefecture, japan", "samut
prakan, thailand", "rajasthan, india", "wales, united kingdom", "wyoming, us",
"puebla, mexico", "osaka prefecture, japan", "zurich, switzerland", "sverdlovsk
oblast, russia", "western australia, australia", "vlaanderen, belgium", "south
dakota, us", "hubei, china", "tatarstan, russia", "state of rio de janeiro,
brazil", "tokyo, japan", "guanajuato, mexico", "sichuan, china", "mexico city,
mexico", "greater accra, ghana", "baja california, mexico",
"mecklenburg-vorpommern, germany", "shandong, china", "midi-pyrénées, france",
"normandy, france", "south moravian region, czech republic", "nizhny novgorod
oblast, russia", "budapest, hungary", "łódź voivodeship, poland", "manitoba,
canada", "auckland, new zealand", "alsace, france", "walloon region, belgium",
"federal territory of kuala lumpur, malaysia", "novosibirsk oblast, russia",
"rostov oblast, russia", "liaoning, china", "nord-pas-de-calais-picardie,
france", "vermont, us", "greater poland voivodeship, poland", "fujian, china",
"alsace-champagne-ardenne-lorraine, france", "republic of bashkortostan,
russia", "state of rio grande do sul, brazil", "centre-val de loire, france",
"chelyabinsk oblast, russia", "rhône-alpes, france", "saitama prefecture,
japan", "punjab, india", "abu dhabi, united arab emirates", "zuid-holland,
netherlands", "catalunya, spain", "santa catarina, brazil", "nuevo leon,
mexico", "aichi prefecture, japan", "jilin, china", "pomeranian voivodeship,
poland", "federal capital territory, nigeria", "voronezh oblast, russia",
"veracruz, mexico", "skane county, sweden", "state of paraná, brazil",
"portalegre, portugal", "andalusia, spain", "federal district, mexico",
"saskatchewan, canada", "querétaro, mexico", "emilia-romagna, italy", "west
bengal, india", "groningen, netherlands", "capital region of denmark, denmark",
"chiba prefecture, japan", "bourgogne-franche-comté, france", "west java,
indonesia", "cork, ireland", "skåne county, sweden", "östergötland county,
sweden", "perm krai, russia", "paraná, brazil", "minas gerais, brazil",
"antioquia, colombia", "community of madrid, spain", "autonomous city of buenos
aires, argentina", "languedoc-roussillon-midi-pyrénées, france", "nova scotia,
canada", "braga, portugal", "irkutsk oblast, russia", "languedoc-roussillon,
france", "andhra pradesh, india", "oslo, norway", "volgograd oblast, russia",
"lublin voivodeship, poland", "moskovskaya oblast'", "saarland, germany",
"hokkaido prefecture, japan", "lorraine, france", "krasnoyarsk krai, russia",
"state of minas gerais, brazil", "selangor, malaysia", "setubal, portugal",
"moravian-silesian region, czech republic", "state of mexico, mexico", "tula
oblast, russia", "flevoland, netherlands", "hebei, china", "centre, france",
"san luis potosi, mexico", "south australia, australia", "kyiv city, ukraine",
"valencian community, spain", "central bohemian region, czech republic",
"luxembourg, luxembourg", "galicia, spain", "burgundy, france", "chihuahua,
mexico", "hyogo prefecture, japan", "lubusz voivodeship, poland", "vladimir
oblast, russia", "saratov oblast, russia", "poitou-charentes, france", "nairobi,
kenya", "al asimah, kuwait", "uppsala county, sweden", "geneva, switzerland",
"uusimaa, finland", "rio grande do sul, brazil", "pardubice region, czech
republic", "kuyavian-pomeranian voivodeship, poland", "shaanxi, china", "québec,
canada", "yaroslavl oblast, russia", "olomouc region, czech republic", "basque
country, spain", "fukuoka prefecture, japan", "new brunswick, canada", "udmurt
republic, russia", "kemerovo oblast, russia", "khanty-mansi autonomous okrug,
russia", "anhui, china", "tver oblast, russia", "shanghai shi, china",
"leningrad oblast, russia", "northern ireland, united kingdom", "australian
capital territory, australia", "jonkoping county, sweden", "krasnodarskiy kray,
russia", "aguascalientes, mexico", "bihar, india", "lazio, italy", "west
pomeranian voivodeship, poland", "veneto, italy", "ulyanovsk oblast, russia",
"lombardia, italy", "plzeň region, czech republic", "udmurtskaja respublika,
russia", "altai krai, russia", "omsk oblast, russia", "ibaraki prefecture,
japan", "vaud, switzerland", "ilfov county, romania", "ryazan oblast, russia",
"orenburg oblast, russia", "odisha, india", "lower austria, austria",
"champagne-ardenne, france", "upper austria, austria", "kaluga oblast, russia",
"kwazulu-natal, south africa", "friesland, netherlands", "södermanland county,
sweden", "warmian-masurian voivodeship, poland", "jiangxi, china", "uttarakhand,
india", "piemonte, italy", "tyumen oblast, russia", "eastern cape, south
africa", "belgorod oblast, russia", "shizuoka prefecture, japan", "ústí nad
labem region, czech republic", "castile and león, spain", "makkah province,
saudi arabia", "newfoundland and labrador, canada", "khabarovsk krai, russia",
"franche-comté, france", "hunan, china", "primorsky krai, russia", "penza
oblast, russia", "wallonie, belgium", "chuvashia republic, russia",
"noord-holland, netherlands", "state of bahia, brazil", "nagano prefecture,
japan", "south bohemian region, czech republic", "jharkhand, india", "kirov
oblast, russia", "vologda oblast, russia", "yucatán, mexico", "hradec králové
region, czech republic", "drenthe, netherlands", "dalarna county, sweden",
"sonora, mexico", "miyagi prefecture, japan", "arkhangelsk oblast, russia",
"västmanland county, sweden", "örebro county, sweden", "auvergne, france",
"styria, austria", "lisboa, portugal", "västerbotten county, sweden", "hiroshima
prefecture, japan", "henan, china", "heilongjiang, china", "kronoberg county,
sweden", "mie prefecture, japan", "comunidad de madrid, spain", "liberec region,
czech republic", "stavropol krai, russia", "จังหวัด กรุงเทพมหานคร, thailand",
"tomsk oblast, russia", "ivanovo oblast, russia", "bryansk oblast, russia",
"halland county, sweden", "andalucía, spain", "lipetsk oblast, russia", "federal
district, brazil", "galway, ireland", "upper normandy, france", "smolensk
oblast, russia", "vlaams gewest, belgium", "vysocina region, czech republic",
"kyoto prefecture, japan", "cluj county, romania", "norrbotten county, sweden",
"murmansk oblast, russia", "bayern, germany", "varmland county, sweden",
"distrito federal, mexico", "eastern province, saudi arabia", "wellington, new
zealand", "hidalgo, mexico", "calabarzon, philippines", "tochigi prefecture,
japan", "salzburg, austria", "nuevo león, mexico", "da nang, vietnam", "himachal
pradesh, india", "zlin region, czech republic", "västernorrland county, sweden",
"central denmark region, denmark", "nonthaburi, thailand", "oyo, nigeria",
"bratislava region, slovakia", "cairo governorate, egypt", "podkarpackie
voivodeship, poland", "oaxaca, mexico", "arequipa, peru", "state of ceará,
brazil", "kalmar county, sweden", "san jose, costa rica", "guizhou, china",
"kursk oblast, russia", "basel-stadt, switzerland", "prince edward island,
canada", "attica, greece", "normandie, france", "gavleborg county, sweden",
"noord-brabant, netherlands", "chhattisgarh, india", "faro district, portugal",
"cundinamarca, colombia", "oryol oblast, russia", "karlovy vary region, czech
republic", "chiapas, mexico", "penang, malaysia", "kostroma oblast, russia",
"shanxi, china", "fukushima prefecture, japan", "valle del cauca, colombia",
"tambov oblast, russia", "state of santa catarina, brazil", "hainan, china",
"yamalo-nenets autonomous okrug, russia", "puducherry, india", "limousin,
france", "sinaloa, mexico", "coimbra district, portugal", "kaliningrad oblast,
russia", "alagoas, brazil", "astrakhan oblast, russia", "yamaguchi prefecture,
japan", "trentino-alto adige/south tyrol, italy", "novgorod oblast, russia",
"bình dương, vietnam", "sofia city province, bulgaria", "atlantico, colombia",
"gifu prefecture, japan", "niigata prefecture, japan", "castile-la mancha,
spain", "opole voivodeship, poland", "gansu, china", "kabul, afghanistan",
"rivers, nigeria", "pskov oblast, russia", "gunma prefecture, japan", "lower
normandy, france", "johor, malaysia", "state of pernambuco, brazil", "ankara
province, turkey", "limerick, ireland", "mari el republic, russia", "canton of
bern, switzerland", "lapland, finland", "guatemala, guatemala", "phuket,
thailand", "kumamoto prefecture, japan", "akershus, norway", "okayama
prefecture, japan", "tyrol, austria", "rheinland-pfalz, germany", "blekinge
county, sweden", "durango, mexico", "jamtland county, sweden", "guaynabo, puerto
rico", "chachoengsao, thailand", "santiago metropolitan region, chile",
"piedmont, italy", "yunnan, china", "toscana, italy", "tasmania, australia",
"region syddanmark, denmark", "coahuila de zaragoza, mexico", "republic of
karelia, russia", "castilla y león, spain", "colima, mexico", "free state, south
africa", "bursa, turkey", "niedersachsen, germany", "nunavut, canada",
"gyeonggi-do, south korea", "aragón, spain", "komi republic, russia", "santander
department, colombia", "canton of solothurn, switzerland", "euskadi, spain",
"kurgan oblast, russia", "aragon, spain", "northern territory, australia",
"nagasaki prefecture, japan", "espírito santo, brazil", "mordovia, russia",
"thüringen, germany", "respublika bashkortostan, russia", "kaluzhskaya oblast'",
"bern, switzerland", "rajshahi division, bangladesh", "sachsen-anhalt, germany",
"hordaland, norway", "buryatia, russia", "nordrhein-westfalen, germany", "mato
grosso, brazil", "nara prefecture, japan", "guangxi, china", "zabaykalsky krai,
russia", "san luis potosí, mexico", "tamaulipas, mexico", "east java,
indonesia", "timiș county, romania", "east kalimantan, indonesia", "cantabria,
spain", "tuscany, italy", "yucatan, mexico", "amur oblast, russia", "khon kaen,
thailand", "sibiu, romania", "state of goiás, brazil", "canary islands, spain",
"sachsen, germany", "goiás, brazil", "rostovskaya oblast'", "piura, peru",
"dnipropetrovsk oblast, ukraine", "brașov county, romania", "vila real,
portugal", "amazonas, brazil", "st. gallen, switzerland", "sakha republic,
russia", "maranhão, brazil", "navarre, spain", "taiwan province, taiwan",
"leningradskaya oblast'", "región de murcia, spain", "picardy, france", "kano,
nigeria", "ishikawa prefecture, japan", "ehime prefecture, japan", "podlaskie
voivodeship, poland", "genève, switzerland", "comunidad valenciana, spain",
"north sumatra, indonesia", "tel aviv district, israel", "carinthia, austria",
"yamagata prefecture, japan", "odessa oblast, ukraine", "campeche, mexico",
"center district, israel", "sakhalin oblast, russia", "waterford, ireland",
"mato grosso do sul, brazil", "michoacán, mexico", "campania, italy", "viseu
district, portugal", "extremadura, spain", "iwate prefecture, japan", "canarias,
spain", "kandahar, afghanistan", "alexandria governorate, egypt", "panama,
panama", "kharkiv oblast, ukraine", "shiga prefecture, japan", "balearic
islands, spain", "kaduna, nigeria", "miyazaki prefecture, japan", "canton of
fribourg, switzerland", "risaralda, colombia", "republic of khakassia, russia",
"tlaxcala, mexico", "principado de asturias, spain", "riau islands, indonesia",
"lviv oblast, ukraine", "lucerne, switzerland", "borsod-abaúj-zemplén, hungary",
"ciudad autónoma de buenos aires, argentina", "iași county, romania",
"pernambuco, brazil", "kagawa prefecture, japan", "tyumenskaya oblast'", "canton
of zug, switzerland", "pará, brazil", "punjab, pakistan", "castilla-la mancha,
spain", "corsica, france", "sharjah, united arab emirates", "castelo branco
district, portugal", "rogaland, norway", "quintana roo, mexico", "santarém
district, portugal", "toyama prefecture, japan", "kagoshima prefecture, japan",
"ticino, switzerland", "aargau, switzerland", "departamento de lima, peru",
"kardzhali province, bulgaria", "constanța county, romania", "saga prefecture,
japan", "paraíba, brazil", "troms, norway", "lusaka, zambia", "cordoba,
argentina", "parvan, afghanistan", "enugu, nigeria", "region zealand, denmark",
"asturias, spain", "sverdlovskaya oblast'", "wakayama prefecture, japan", "rio
grande do norte, brazil", "bolívar, venezuela", "friuli-venezia giulia, italy",
"krung thep maha nakhon, thailand", "vorarlberg, austria", "umbria, italy",
"ningxia, china", "burgenland, austria", "montevideo department, uruguay", "oita
prefecture, japan", "banten, republic of indonesia", "chon buri, thailand",
"kildare, ireland", "coahuila, mexico", "fukui prefecture, japan", "magadan
oblast, russia", "south sulawesi, indonesia", "aomori prefecture, japan", "inner
mongolia, china", "marche, italy", "ogun state, nigeria", "central visayas,
philippines", "kütahya, turkey", "tolima, colombia", "jigawa, nigeria", "vilnius
county, lithuania", "sør-trøndelag, norway", "prahova, romania", "santa fe
province, argentina", "ceará, brazil", "beja, portugal", "north district,
israel", "aveiro district, portugal", "grand casablanca, morocco", "altayskiy
kray, russia", "meta, colombia", "la libertad, peru", "canton of neuchâtel,
switzerland", "nayarit, mexico", "state of espírito santo, brazil", "liguria,
italy", "nakhon nayok, thailand", "addis ababa, ethiopia", "kyivs'ka oblast,
ukraine", "viana do castelo, portugal", "chechenskaya republits, russia",
"bahia, brazil", "carolina, puerto rico", "tiền giang, vietnam", "acre, brazil",
"sicilia, italy", "kabardino-balkaria, russia", "hedmark, norway", "cusco,
peru", "songkhla, thailand", "canterbury, new zealand", "okinawa prefecture,
japan", "brussel, belgium", "phnom penh, cambodia", "évora district, portugal",
"zaporiz'ka oblast, ukraine", "katsina, nigeria", "north denmark region,
denmark", "central java, indonesia", "nizhegorodskaya oblast'", "stockholms län,
sweden", "sa kaeo, thailand", "ponce, puerto rico", "prachuap khiri khan,
thailand", "gotland county, sweden", "piauí, brazil", "nordland, norway",
"kamchatka krai, russia", "qinghai, china", "irkutskaya oblast'", "dagestan
republic, russia", "rangpur division, bangladesh", "județul bihor, romania", "la
rioja, spain", "caguas, puerto rico", "yamanashi prefecture, japan", "buenos
aires province, argentina", "central luzon, philippines", "mykolaivs'ka oblast,
ukraine", "hồ chí minh, vietnam", "narino, colombia", "galați, romania",
"zakarpats'ka oblast, ukraine", "kemerovskaya oblast'", "akita prefecture,
japan", "khanty-mansiyskiy avtonomnyy okrug, russia", "cajamarca, peru", "cauca
department, colombia", "bihor county, romania", "kilkenny, ireland", "malacca,
malaysia", "gaziantep, turkey", "davao region, philippines", "stavropolskiy
kray, russia", "județul timiș, romania", "tokushima prefecture, japan", "tottori
prefecture, japan", "limpopo, south africa", "samarskaya oblast'", "adana,
turkey", "hessen, germany", "swietokrzyskie, poland", "bingöl, turkey", "caldas,
colombia", "østfold, norway", "aichi-ken, japan", "bà rịa - vũng tàu, vietnam",
"orenburgskaya oblast'", "san salvador, el salvador", "boyaca, colombia",
"tverskaya oblast'", "shimane prefecture, japan", "canton of schaffhausen,
switzerland", "bayamón, puerto rico", "ondo, nigeria", "haiphong, vietnam",
"illes balears, spain", "hunedoara county, romania", "western, ghana",
"trentino-alto adige, italy", "kanchanaburi, thailand", "northwest territories,
canada", "donegal, ireland", "guerrero, mexico", "județul cluj, romania", "ba
ria - vung tau, vietnam", "saratovskaya oblast'", "dorado, puerto rico",
"northern, ghana", "konya, turkey", "huila, colombia", "khersons'ka oblast,
ukraine", "volgogradskaya oblast'", "junin, peru", "north ossetia–alania,
russia", "santo domingo, dominican republic", "special region of yogyakarta,
indonesia", "bali, indonesia", "entre rios, argentina", "adygea, russia",
"puglia, italy", "special capital region of jakarta, indonesia", "guarda
district, portugal", "chuvashia, russia", "yukon territory, canada", "tulskaya
oblast'", "pichincha, ecuador", "appenzell outer rhodes, switzerland",
"carabobo, venezuela", "møre og romsdal, norway", "buskerud, norway", "kocaeli,
turkey", "bengkulu, indonesia", "kalmykia, russia", "altai republic, russia",
"poltavs'ka oblast, ukraine", "argeș county, romania", "leiria district,
portugal", "ialomița county, romania", "calabria, italy", "tunceli, turkey",
"bacău county, romania", "north west, south africa", "dolj county, romania",
"smolenskaya oblast'", "județul mureș, romania", "vestfold, norway", "la paz
department, bolivia", "north santander, colombia", "luanda, angola", "teleorman
county, romania", "beijing shi, china", "louth, ireland", "rivnens'ka oblast,
ukraine", "jambi, indonesia", "sergipe, brazil", "setúbal, portugal", "al
madinah province, saudi arabia", "amapá, brazil", "vest-agder, norway", "riau,
indonesia", "udon thani, thailand", "cordoba, colombia", "județul suceava,
romania", "voronezhskaya oblast'", "islamabad capital territory, pakistan",
"fejér, hungary", "huíla, angola", "donetsk oblast, ukraine", "moquegua, peru",
"long an, vietnam", "state of rondônia, brazil", "sligo, ireland", "cần thơ,
vietnam", "sums'ka oblast, ukraine", "assam, india", "județul prahova, romania",
"tocantins, brazil", "waikato, new zealand", "lipetskaya oblast'", "quindio,
colombia", "valais, switzerland", "oppland, norway", "phitsanulok, thailand",
"basel-landschaft, switzerland", "pahang, malaysia", "surat thani, thailand",
"vrancea county, romania", "vinnyts'ka oblast, ukraine", "south district,
israel", "navarra, spain", "wicklow, ireland", "alba county, romania", "algiers,
algeria", "belgorodskaya oblast'", "melilla, spain", "zhytomyrs'ka oblast,
ukraine", "dâmbovița county, romania", "ceuta, spain", "west kalimantan,
indonesia", "wexford, ireland", "harghita county, romania",
"szabolcs-szatmár-bereg, hungary", "meath, ireland", "otago, new zealand",
"neamț county, romania", "arkhangelskaya oblast'", "bolívar, colombia",
"manawatu-wanganui, new zealand", "chisinau, moldova", "santa cruz, bolivia",
"magdalena, colombia", "niamey, niger", "kochi prefecture, japan",
"krasnoyarskiy kray, russia", "caracas metropolitan district, venezuela", "daman
and diu, india", "mendoza province, argentina", "bamako, mali", "south sumatra,
indonesia", "tucumán, argentina", "județul maramureș, romania", "banten,
indonesia", "bitlis, turkey", "dakar, senegal", "tambovskaya oblast'", "abruzzo,
italy", "bretagne, france", "olt county, romania", "nitra region, slovakia",
"hai duong, vietnam", "huanuco, peru", "ivano-frankivs'ka oblast, ukraine",
"chiang rai, thailand", "westmeath, ireland", "komárom-esztergom, hungary",
"județul iași, romania", "cherkas'ka oblast, ukraine", "région wallonne,
belgium", "west sumatra, indonesia", "omskaya oblast'", "dong nai, vietnam",
"northern ostrobothnia, finland", "kedah, malaysia", "muscat governorate, oman",
"jewish autonomous oblast, russia", "karachay-cherkessia, russia", "balıkesir,
turkey", "satu mare county, romania", "haifa district, israel", "ashanti,
ghana", "apulia, italy", "corrientes province, argentina", "caraș-severin
county, romania", "zulia, venezuela", "arad county, romania", "central region,
uganda", "gwangju, south korea", "kirovskaya oblast'", "grisons, switzerland",
"respublika adygeya, russia", "khyber pakhtunkhwa, pakistan", "buzău county,
romania", "suceava county, romania", "thurgau, switzerland", "roscommon,
ireland", "kujawsko-pomorskie, poland", "arusha, tanzania", "madre de dios,
peru", "la pampa province, argentina", "chechnya, russia", "heves county,
hungary", "tehran, iran", "beirut, lebanon", "tacna, peru", "sakarya, turkey",
"permskiy kray, russia", "northern cape, south africa", "sofia-city, bulgaria",
"banská bystrica region, slovakia", "amman, jordan", "special capital region of
jakarta, republic of indonesia", "neuquen, argentina", "negeri sembilan,
malaysia", "rabat-sale-zemmour-zaer, morocco", "województwo dolnośląskie,
poland", "maputo city, mozambique", "telemark, norway", "samsun, turkey", "edo,
nigeria", "tabasco, mexico", "city of zagreb, croatia", "lambayeque, peru", "bay
of plenty, new zealand", "aust-agder, norway", "lagunes, côte d'ivoire",
"cartago, costa rica", "pest county, hungary", "gombe, nigeria", "sindh,
pakistan", "brăila county, romania", "kaliningradskaya oblast'", "papua,
indonesia", "kayseri province, turkey", "călărași county, romania", "orlovskaya
oblast'", "bingöl province, turkey", "sokoto, nigeria", "diyarbakır, turkey",
"volyns'ka oblast, ukraine", "ingushetia, russia", "nenetskiy, russia", "trnava
region, slovakia", "ivanovskaya oblast'", "hajdú-bihar, hungary", "tuva,
russia", "país vasco, spain", "western area, sierra leone", "ulyanovskaya
oblast'", "lampung, indonesia", "minsk region, belarus", "vologodskaya oblast'",
"aguadilla, puerto rico", "niederösterreich, austria", "xizang (tibet), china",
"ternopil's'ka oblast, ukraine", "bryanskaya oblast'", "maseru, lesotho", "giza
governorate, egypt", "hong kong island, hong kong", "mureș county, romania",
"gorontalo, indonesia", "tomskaya oblast'", "carlow, ireland", "eskişehir
province, turkey", "gyeongsangbuk-do, south korea", "tōkyō-to, japan",
"chelyabinskaya oblast'", "vaslui county, romania", "ryazanskaya oblast'",
"suphan buri, thailand", "kostromskaya oblast'", "lima region, peru", "sardegna,
italy", "central kalimantan, indonesia", "covasna county, romania", "casanare,
colombia", "kurskaya oblast'", "yaroslavskaya oblast'", "kigali, rwanda", "dhaka
division, bangladesh", "vladimirskaya oblast'", "zacatecas, mexico", "xinjiang,
china", "aceh, indonesia", "steiermark, austria", "cordillera administrative
region, philippines", "gyeongsangnam-do, south korea", "chukotka autonomous
okrug, russia", "burgandy, france", "luzern, switzerland", "cesar, colombia",
"lâm đồng, vietnam", "hamilton, bermuda", "bauchi, nigeria", "san josé, costa
rica", "baghdād, iraq", "east java, republic of indonesia", "chernihivs'ka
oblast, ukraine", "basilicata, italy", "novosibirskaya oblast'", "varna,
bulgaria", "chubut province, argentina", "chungcheongbuk-do, south korea",
"gyõr-moson-sopron, hungary", "national district, dominican republic", "tirol,
austria", "nord-pas-de-calais picardie, france", "thai nguyen, vietnam",
"județul arad, romania", "basrah, iraq", "northern mindanao, philippines",
"tulcea county, romania", "roraima, brazil", "edirne, turkey", "borno, nigeria",
"putrajaya, malaysia", "mizoram, india", "boyacá, colombia", "salta province,
argentina", "kerry, ireland", "sucre, colombia", "mehedinți county, romania",
"constantine, algeria", "județul vâlcea, romania", "mazowieckie, poland",
"vojvodina, serbia", "bình phước, vietnam", "cabo rojo, puerto rico", "canton of
schwyz, switzerland", "setif, algeria", "perak, malaysia", "respublika
tatarstan, russia", "respublika kalmykiya, russia", "ayacucho, peru", "clare,
ireland", "san luis province, argentina", "osun, nigeria", "astrakhanskaya
oblast'", "județul sibiu, romania", "oberösterreich, austria", "madeira,
portugal", "bạc liêu, vietnam", "gisborne, new zealand", "luhans'ka oblast,
ukraine", "south east sulawesi, indonesia", "chernivets'ka oblast, ukraine",
"botoșani county, romania", "toamasina, madagascar", "maluku, indonesia",
"southland, new zealand", "western visayas, philippines", "mayagüez, puerto
rico", "kaunas county, lithuania", "plovdiv province, bulgaria", "rondônia,
brazil", "sabah, malaysia", "port of spain, trinidad and tobago", "laikipia,
kenya", "klaipėda county, lithuania", "mardin, turkey", "penzenskaya oblast'",
"kamchatskiy kray, russia", "giurgiu county, romania", "toa baja, puerto rico",
"nampula, mozambique", "kalasin, thailand", "jeollabuk-do, south korea",
"ahmadi, kuwait", "west nusa tenggara, indonesia", "distrito federal, brazil",
"trenčín region, slovakia", "harju county, estonia", "guayas, ecuador",
"sarawak, malaysia", "mayo, ireland", "الريان, qatar", "huancavelica, peru",
"kinshasa, democratic republic of the congo", "north sulawesi, indonesia",
"kirovohrads'ka oblast, ukraine", "veszprém, hungary", "haute-normandie,
france", "maramureș county, romania", "tây ninh province, vietnam", "nagaland,
india", "sogn og fjordane, norway", "žilina region, slovakia", "ajman, united
arab emirates", "şanlıurfa, turkey", "västra götalands län, sweden", "miranda,
venezuela", "humacao, puerto rico", "nghe an, vietnam", "riga, latvia", "molise,
italy", "ancash, peru", "bragança, portugal", "chungcheongnam-do, south korea",
"malatya, turkey", "košice region, slovakia", "murmanskaya oblast'", "bayburt,
turkey", "heredia province, costa rica", "sălaj, romania", "graubünden,
switzerland", "finnmark, norway", "gangwon-do, south korea", "volta, ghana",
"bragança district, portugal", "sankt gallen, switzerland", "managua,
nicaragua", "respublika mordoviya, russia", "ninh bình province, vietnam",
"kowloon, hong kong", "dzhalal-abadskaya, kyrgyzstan", "yangon region, republic
of the union of myanmar", "sakon nakhon, thailand", "județul alba, romania",
"jujuy, argentina", "kareliya republits, russia", "quebradillas, puerto rico",
"nakhon sawan, thailand", "north maluku, indonesia", "jazan, saudi arabia",
"monaghan, ireland", "languedoc-roussillon midi-pyrénées, france", "saint james,
barbados", "gia lai province, vietnam", "phra nakhon si ayutthaya, thailand",
"nord-trondelag, norway", "novgorodskaya oblast'", "sofia province, bulgaria",
"bolivar, colombia", "santander, colombia", "imo, nigeria", "saint james parish,
jamaica", "małopolskie, poland", "primorskiy kray, russia", "san juan province,
argentina", "northeast, iceland", "trujillo alto, puerto rico", "capital
district, venezuela", "bueng kan, thailand", "burgas, bulgaria", "nakuru,
kenya", "canton of jura, switzerland", "khmel'nyts'ka oblast, ukraine",
"hatillo, puerto rico", "antofagasta region, chile", "canton of obwalden,
switzerland", "western province, sri lanka", "upper east, ghana", "luquillo,
puerto rico", "podlaskie, poland", "capital governorate, bahrain", "canóvanas,
puerto rico", "konya province, turkey", "central governorate, bahrain", "loíza,
puerto rico", "río negro, argentina", "taranaki, new zealand", "caquetá,
colombia", "triesen, liechtenstein", "central, ghana", "silistra, bulgaria",
"siirt, turkey", "azores, portugal", "dagestan republits, russia", "northland,
new zealand", "ouargla, algeria", "central sulawesi, indonesia", "almaty region,
kazakhstan", "binh thuan, vietnam", "guangdong sheng, china", "județul dolj,
romania", "hatay, turkey", "khabarovskiy kray, russia", "jeju-do, south korea",
"anzoategui, venezuela", "şanlıurfa province, turkey", "sor-trondelag, norway",
"sandys, bermuda", "kien giang, vietnam", "tolna county, hungary", "west java,
republic of indonesia", "chai nat, thailand", "tianjin shi, china", "județul
constanța, romania", "leitrim, ireland", "marlborough, new zealand", "al khor,
qatar", "arauca, colombia", "erzincan, turkey", "kurganskaya oblast'", "eastern
region, uganda", "chaco province, argentina", "ljubljana, slovenia", "canton of
glarus, switzerland", "cochabamba department, bolivia", "çankırı, turkey",
"alger, algeria", "vas county, hungary", "bourgogne franche-comté, france",
"apurimac, peru", "nam dinh, vietnam", "sicily, italy", "aseer province, saudi
arabia", "kiambu, kenya", "kogi, nigeria", "viana do castelo district,
portugal", "crete, greece", "pirkanmaa, finland", "nangarhar, afghanistan",
"värmlands län, sweden", "santarém, portugal", "region of murcia, spain",
"makedonia thraki, greece", "jász-nagykun-szolnok, hungary", "fes-boulemane,
morocco", "csongrád, hungary", "tipperary, ireland", "zabaykalskiy kray,
russia", "van, turkey", "kırklareli, turkey", "santiago, dominican republic",
"cataluña, spain", "east nusa tenggara, indonesia", "northern borders province,
saudi arabia", "siem reap, cambodia", "fajardo, puerto rico", "bío bío region,
chile", "hormigueros, puerto rico", "delta, nigeria", "west papua, indonesia",
"jayuya, puerto rico", "táchira, venezuela", "san martin, peru", "kymenlaakso,
finland", "wielkopolskie, poland", "offaly, ireland", "upper west, ghana",
"fujairah, united arab emirates", "koungou, mayotte", "tete, mozambique", "valle
d'aosta, italy", "wien, austria", "saint-paul, reunion", "herat, afghanistan",
"bács-kiskun, hungary", "ilocos region, philippines", "gabrovo, bulgaria", "thai
binh, vietnam", "mérida, venezuela", "denizli, turkey", "cagayan valley,
philippines", "panevėžys county, lithuania", "jerusalem district, israel",
"saint mary parish, jamaica", "stara zagora, bulgaria", "buryatiya republits,
russia", "catamarca province, argentina", "port said governorate, egypt", "al
qalyubia governorate, egypt", "tuyên quang province, vietnam", "thua thien hue,
vietnam", "bourgogne, france", "peloponnisos dytiki ellada ke ionio, greece",
"tangier-tetouan, morocco", "respublika mariy el, russia", "choco, colombia",
"binh dinh province, vietnam", "valparaiso region, chile", "northern region,
uganda", "putumayo, colombia", "saint thomas lowland parish, saint kitts and
nevis", "granma, cuba", "komi republits, russia", "land salzburg, austria",
"yamalo-nenetskiy, russia", "cross river, nigeria", "santa cruz province,
argentina", "tierra del fuego province, argentina", "formosa province,
argentina", "san andrés y providencia, colombia", "tien giang, vietnam",
"thessalia sterea ellada, greece", "baja california sur, mexico", "hato mayor,
dominican republic", "eastern, ghana", "ras al khaimah, united arab emirates",
"kärnten, austria", "ceiba, puerto rico", "ostfold, norway", "județul hunedoara,
romania", "orellana, ecuador", "yabucoa, puerto rico", "anambra, nigeria",
"šiauliai county, lithuania", "la rioja province, argentina", "brong ahafo,
ghana", "al batinah north governorate, oman", "añasco, puerto rico", "cuzco,
peru", "atlántico, colombia", "hhohho, swaziland", "marrakesh-tensift-el haouz,
morocco", "plaines wilhems, mauritius", "national capital district, papua new
guinea", "bioko norte, equatorial guinea", "prešov region, slovakia", "yerevan,
armenia", "naguabo, puerto rico", "central finland, finland", "westmoreland
parish, jamaica", "rīgas pilsēta, latvia", "hà giang, vietnam", "mwanza,
tanzania", "județul galați, romania", "mombasa, kenya", "santiago del estero
province, argentina", "shinyanga, tanzania", "appenzell innerrhoden,
switzerland", "gurabo, puerto rico", "khartoum, sudan", "cidra, puerto rico",
"panamá, panama", "amurskaya oblast'", "toa alta, puerto rico", "hawke's bay,
new zealand", "balıkesir province, turkey", "vientiane prefecture, laos",
"guayama, puerto rico", "distrito de beja, portugal", "juana díaz, puerto rico",
"vic, australia", "ipiros ditiki makedonia, greece", "phetchabun, thailand",
"adamawa, nigeria", "kigoma, tanzania", "francisco morazan, honduras", "bicol,
philippines", "beni department, bolivia", "bujumbura mairie, burundi", "cavan,
ireland", "ชัยภูมิ, thailand", "hòa bình, vietnam", "freiburg, switzerland",
"cayey, puerto rico", "kırşehir, turkey", "fukushima-ken, japan", "monagas,
venezuela", "blagoevgrad province, bulgaria", "ucayali, peru", "lara,
venezuela", "canelones, uruguay", "west coast, new zealand", "zala county,
hungary", "wilayah persekutuan putrajaya, malaysia", "manyara, tanzania",
"lubuskie, poland", "amman governorate, jordan", "tombouctou, mali", "region
xii, philippines", "nakhon pathom, thailand", "utena county, lithuania", "lang
son province, vietnam", "açores, portugal", "kouilou, republic of the congo",
"basse-terre, guadeloupe", "kyustendil, bulgaria", "bistrița-năsăud county,
romania", "ariana, tunisia", "phetchaburi, thailand", "portalegre district,
portugal", "județul argeș, romania", "gorod sankt-peterburg, russia", "kwara,
nigeria", "damascus governorate, syria", "amazonas department, colombia", "san
cristobal, dominican republic", "colonia, uruguay", "battambang, cambodia",
"kelantan, malaysia", "telšiai county, lithuania", "dobrich province, bulgaria",
"mugla, turkey", "limon, costa rica", "gharb-chrarda-beni hssen, morocco", "tizi
ouzou, algeria", "osmaniye, turkey", "st helier, jersey", "respublika severnaya
osetiya-alaniya, russia", "jawa barat, indonesia", "tashkent province,
uzbekistan", "wilayah persekutuan labuan, malaysia", "st. croix, u.s. virgin
islands", "canton of uri, switzerland", "i̇stanbul province, turkey", "san marcos
department, guatemala", "la guajira, colombia", "sakha (yakutiya) republits,
russia", "tokat, turkey", "novo mesto, slovenia", "pskovskaya oblast'",
"misiones province, argentina", "tigray, ethiopia", "egeo, greece", "somogy
county, hungary", "warmińsko-mazurskie, poland", "najran, saudi arabia",
"limassol, cyprus", "lovec, bulgaria", "puno, peru", "erbil, iraq", "al wakrah,
qatar", "pr, us", "vraca, bulgaria", "azuay, ecuador", "yangon region, myanmar
(burma)", "ratchaburi, thailand", "jeollanam-do, south korea", "tumbes, peru",
"saint catherine parish, jamaica", "śląskie, poland", "çorum, turkey",
"bruxelles, belgium", "al bahah province, saudi arabia", "schaan,
liechtenstein", "kampong cham, cambodia", "ruse, bulgaria", "şırnak, turkey",
"phang-nga, thailand", "adjuntas, puerto rico", "damietta governorate, egypt",
"la vega, dominican republic", "chimborazo, ecuador", "cabo delgado,
mozambique", "nakhon si thammarat, thailand", "municipiul bucurești, romania",
"istria county, croatia", "mostaganem, algeria", "la romana, dominican
republic", "central division, fiji", "souss-massa-draa, morocco", "red sea
governorate, egypt", "wilayah persekutuan kuala lumpur, malaysia", "valverde,
dominican republic", "razgrad, bulgaria", "muramvya, burundi", "kisumu, kenya",
"split-dalmatia county, croatia", "saint laurent du maroni, french guiana",
"manisa, turkey", "plateau, nigeria", "balochistan, pakistan", "utuado, puerto
rico", "huambo, angola", "san germán, puerto rico", "yauco, puerto rico",
"federation of bosnia and herzegovina, bosnia and herzegovina", "ica, peru",
"chang wat nakhon pathom, thailand", "tasman, new zealand", "laois, ireland",
"sakhalinskaya oblast'", "județul sălaj, romania", "pernik, bulgaria", "wallis,
switzerland", "nord-trøndelag, norway", "puerto plata, dominican republic",
"gouvernorat de tunis, tunisia", "new territories, hong kong", "tbilisi,
georgia", "khakasiya republits, russia", "akwa ibom, nigeria", "capital region,
iceland", "departamento autónomo de oruro, bolivia", "beja district, portugal",
"trabzon, turkey", "los ríos region, chile", "east kazakhstan region,
kazakhstan", "satakunta, finland", "tarija department, bolivia", "freeport, the
bahamas", "western division, fiji", "atyrau region, kazakhstan", "burdur,
turkey", "nelson, new zealand", "southern ostrobothnia, finland", "chongqing
shi, china", "south sinai governorate, egypt", "pleven province, bulgaria",
"enga province, papua new guinea", "biskra, algeria", "haskovo province,
bulgaria", "sulawesi selatan, indonesia", "chuy province, kyrgyzstan", "glarus,
switzerland", "vega alta, puerto rico", "khulna division, bangladesh", "umm al
quwain, united arab emirates", "trujillo, venezuela", "agadez, niger",
"parròquia d'andorra la vella, andorra", "distrito capital, venezuela", "județul
dâmbovița, romania", "kurdistan region, iraq", "skopje, macedonia (fyrom)",
"puntarenas, costa rica", "zambezia province, mozambique", "goa, india", "pasco,
peru", "kastamonu, turkey", "pando department, bolivia", "hawally governorate,
kuwait", "estuaire, gabon", "ash sharqia governorate, egypt", "copperbelt,
zambia", "montserrado, liberia", "vilniaus apskritis, lithuania", "montana
province, bulgaria", "san pedro de macoris, dominican republic", "maritime,
togo", "upolu, samoa", "zamboanga peninsula, philippines", "xinjiang
weiwuerzizhiqu, china", "cymru, united kingdom", "dadra and nagar haveli,
india", "tartu county, estonia", "sardinia, italy", "maldonado, uruguay",
"varaždinska županija, croatia", "maría trinidad sánchez, dominican republic",
"gümüşhane, turkey", "pomorskie, poland", "guárico, venezuela", "chocó,
colombia", "rabat-salé-zemmour-zaër, morocco", "comunitat valenciana, spain",
"qena governorate, egypt", "sacatepequez, guatemala", "new providence, the
bahamas", "magallanes y la antártica chilena region, chile", "brussels
hoofdstedelijk gewest, belgium", "kunar, afghanistan", "oromia, ethiopia",
"singida, tanzania", "caraga, philippines", "habaka, jordan", "kyustendil
province, bulgaria", "bonaire, bonaire, sint eustatius and saba", "semnan,
iran", "aksaray, turkey", "jawa tengah, indonesia", "los lagos region, chile",
"bio-bio, chile", "terengganu, malaysia", "västernorrlands län, sweden",
"saitama-ken, japan", "saipan, northern mariana islands", "alta verapaz,
guatemala", "yaracuy, venezuela", "aragua, venezuela", "évora, portugal",
"limón, costa rica", "henan sheng, china", "portuguesa, venezuela", "mato grosso
do sul, paraguay", "erzurum, turkey", "zhejiang sheng, china", "central region,
nepal", "amazonas, colombia", "chang wat chachoengsao, thailand", "north
karelia, finland", "gorod moskva, russia", "kef, tunisia", "marrakech-tensift-al
haouz, morocco", "vâlcea county, romania", "östergötlands län, sweden", "aydın
province, turkey", "oriental, morocco", "nidwalden, switzerland", "south-east,
botswana", "faryab, afghanistan", "doukkala-abda, morocco", "le marin,
martinique", "san josé, uruguay", "fort-de-france, martinique", "saint george
basseterre parish, saint kitts and nevis", "gorj county, romania", "turkana
county, kenya", "sliven province, bulgaria", "neuquén, argentina", "uşak,
turkey", "takhar, afghanistan", "beni, bolivia", "ash sharqiyah north
governorate, oman", "guanacaste, costa rica", "kashkadarya province,
uzbekistan", "hatay province, turkey", "roja municipality, latvia", "distrito
metropolitano de caracas, venezuela", "fr, italy", "guainia, colombia",
"baranya, hungary", "preah sihanouk, cambodia", "gambella, ethiopia", "santa fe,
argentina", "menofia governorate, egypt", "mjini magharibi, tanzania", "balkh,
afghanistan", "jambol, bulgaria", "primorje-gorski kotar county, croatia",
"menia governorate, egypt", "ingushetiya republits, russia", "brunei-muara,
brunei", "distrito de évora, portugal", "barinas, venezuela", "județul neamț,
romania", "cayenne, french guiana", "grande-terre, guadeloupe", "central java,
republic of indonesia", "békés county, hungary", "imbabura, ecuador", "jilin
sheng, china", "smoljan, bulgaria", "lacs, côte d'ivoire", "calabarzon,
colombia", "muğla province, turkey", "isparta, turkey", "grodno region,
belarus", "coquimbo region, chile", "liaoning sheng, china", "județul ialomița,
romania", "southern nations, nationalities, and people's region, ethiopia",
"mopti, mali", "lubelskie, poland", "alajuela, costa rica", "yalova province,
turkey", "veliko tarnovo province, bulgaria", "andijan province, uzbekistan",
"wales, ", "khánh hòa, vietnam", "suez governorate, egypt", "puerto rico, us",
"virgin islands, us", "guam, us", "palau, us"

### Allowed Values for `company_industry`

"information technology & services", "construction", "marketing & advertising",
"real estate", "health, wellness & fitness", "management consulting", "computer
software", "internet", "retail", "financial services", "consumer services",
"hospital & health care", "automotive", "restaurants", "education management",
"food & beverages", "design", "hospitality", "accounting", "events services",
"nonprofit organization management", "entertainment", "electrical/electronic
manufacturing", "leisure, travel & tourism", "professional training & coaching",
"transportation/trucking/railroad", "law practice", "apparel & fashion",
"architecture & planning", "mechanical or industrial engineering", "insurance",
"telecommunications", "human resources", "staffing & recruiting", "sports",
"legal services", "oil & energy", "media production", "machinery", "wholesale",
"consumer goods", "music", "photography", "medical practice", "cosmetics",
"environmental services", "graphic design", "business supplies & equipment",
"renewables & environment", "facilities services", "publishing", "food
production", "arts & crafts", "building materials", "civil engineering",
"religious institutions", "public relations & communications", "higher
education", "printing", "furniture", "mining & metals", "logistics & supply
chain", "research", "pharmaceuticals", "individual & family services", "medical
devices", "civic & social organization", "e-learning", "security &
investigations", "chemicals", "government administration", "online media",
"investment management", "farming", "writing & editing", "textiles", "mental
health care", "primary/secondary education", "broadcast media", "biotechnology",
"information services", "international trade & development", "motion pictures &
film", "consumer electronics", "banking", "import & export", "industrial
automation", "recreational facilities & services", "performing arts",
"utilities", "sporting goods", "fine art", "airlines/aviation", "computer &
network security", "maritime", "luxury goods & jewelry", "veterinary", "venture
capital & private equity", "wine & spirits", "plastics", "aviation & aerospace",
"commercial real estate", "computer games", "packaging & containers", "executive
office", "computer hardware", "computer networking", "market research",
"outsourcing/offshoring", "program development", "translation & localization",
"philanthropy", "public safety", "alternative medicine", "museums &
institutions", "warehousing", "defense & space", "newspapers", "paper & forest
products", "law enforcement", "investment banking", "government relations",
"fund-raising", "think tanks", "glass, ceramics & concrete", "capital markets",
"semiconductors", "animation", "political organization", "package/freight
delivery", "wireless", "international affairs", "public policy", "libraries",
"gambling & casinos", "railroad manufacture", "ranching", "military", "fishery",
"supermarkets", "dairy", "tobacco", "shipbuilding", "judiciary", "alternative
dispute resolution", "nanotechnology", "agriculture", "legislative office"

## 💰 Revenue Filters

| Field         | Type | Options                                                    | Description                                |
| :------------ | :--- | :--------------------------------------------------------- | :----------------------------------------- |
| `min_revenue` | enum | 100K, 500K, 1M, 5M, 10M, 25M, 50M, 100M, 500M, 1B, 5B, 10B | The minimum annual revenue of the company. |
| `max_revenue` | enum | 100K, 500K, 1M, 5M, 10M, 25M, 50M, 100M, 500M, 1B, 5B, 10B | The maximum annual revenue of the company. |

## Input JSON example

```json
{
    "fetch_count": 50000,
    "file_name": "Prospects",
    "email_status": ["validated"]
}
```
