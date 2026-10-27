// Publishable browser key. Database RLS permits timetable reads only.
window.NERAM_CONFIG = {"url":"https://usarcxcmftifeapngtcs.supabase.co","publishableKey":"sb_publishable_VOA7K0U7mw2DpKA5x9KYGQ_oxl4F4Gu"};

;
'use strict';
window.NeramPrefs = (() => {
 const words = {
 'KOCHI METRO · TIMETABLE & STATIONS':'കൊച്ചി മെട്രോ · സമയപ്പട്ടികയും സ്റ്റേഷനുകളും','View departures':'പുറപ്പെടൽ സമയങ്ങൾ കാണൂ',
 'Archived timetable — not current service information':'പഴയ സമയപ്പട്ടിക — നിലവിലെ സർവീസ് വിവരമല്ല',
 'The supplied calendar ended on 31 December 2025. Times and fares below are from that catalog and may have changed. No live train tracking.':'നൽകിയ സർവീസ് കലണ്ടർ 2025 ഡിസംബർ 31-ന് അവസാനിച്ചു. താഴെയുള്ള സമയങ്ങളും നിരക്കുകളും പഴയ കാറ്റലോഗിൽനിന്നുള്ളതാണ്; അവ മാറിയിരിക്കാം. ലൈവ് ട്രാക്കിങ് ലഭ്യമല്ല.',
 'PUBLISHED TIMETABLE':'പ്രസിദ്ധീകരിച്ച സമയപ്പട്ടിക','Archived departures':'പഴയ പുറപ്പെടൽ സമയങ്ങൾ','Archive':'പഴയ രേഖ',
 'Published service pattern':'പ്രസിദ്ധീകരിച്ച സർവീസ് രീതി','Monday–Saturday (archived)':'തിങ്കൾ–ശനി (പഴയത്)','Sunday (archived)':'ഞായർ (പഴയത്)',
 'Depart after (optional)':'ഈ സമയത്തിന് ശേഷം (ഐച്ഛികം)','Catalog fare':'കാറ്റലോഗിലെ നിരക്ക്','Published fare only. Confirm the current fare before travel.':'പ്രസിദ്ധീകരിച്ച പഴയ നിരക്കാണ്. യാത്രയ്ക്ക് മുമ്പ് നിലവിലെ നിരക്ക് സ്ഥിരീകരിക്കുക.',
 'Published service period: 12 August 2024 – 31 December 2025.':'പ്രസിദ്ധീകരിച്ച സർവീസ് കാലയളവ്: 2024 ഓഗസ്റ്റ് 12 – 2025 ഡിസംബർ 31.',
 'Loading the archived timetable…':'പഴയ സമയപ്പട്ടിക തുറക്കുന്നു…','Could not load the archived timetable. Please try again.':'പഴയ സമയപ്പട്ടിക തുറക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക.',
 'No published calendar is available for this pattern.':'ഈ സർവീസ് രീതിക്ക് കലണ്ടർ ലഭ്യമല്ല.','Not available':'ലഭ്യമല്ല','{n} published departures':'പ്രസിദ്ധീകരിച്ച {n} പുറപ്പെടലുകൾ',
 'No archived trips match these stations and time.':'ഈ സ്റ്റേഷനുകൾക്കും സമയത്തിനും യോജിക്കുന്ന പഴയ ട്രിപ്പുകൾ ലഭ്യമല്ല.','View stop times':'സ്റ്റോപ്പ് സമയങ്ങൾ കാണൂ','Catalog trip':'കാറ്റലോഗ് ട്രിപ്പ്',
 'Show more departures ({n} remaining)':'കൂടുതൽ പുറപ്പെടലുകൾ കാണൂ ({n} ബാക്കി)','View route map':'റൂട്ട് മാപ്പ് കാണൂ',
 'Route geometry and station locations from the catalog. No live train positions.':'കാറ്റലോഗിലെ റൂട്ടിന്റെ രൂപവും സ്റ്റേഷൻ സ്ഥാനങ്ങളും. ലൈവ് ട്രെയിൻ സ്ഥാനങ്ങൾ ലഭ്യമല്ല.',
 'Catalog route geometry with selected stations':'തിരഞ്ഞെടുത്ത സ്റ്റേഷനുകൾ ഉൾപ്പെട്ട കാറ്റലോഗ് റൂട്ട് മാപ്പ്','Archived trip':'പഴയ ട്രിപ്പ്',
 'This trip belongs to the expired catalog. It is not confirmation of a train running today.':'കാലാവധി കഴിഞ്ഞ കാറ്റലോഗിലെ ട്രിപ്പാണിത്. ഇന്ന് ട്രെയിൻ ഓടുന്നതിന്റെ സ്ഥിരീകരണമല്ല.',
 'Departure':'പുറപ്പെടൽ','Arrival':'എത്തിച്ചേരൽ','Arrival / departure':'എത്തിച്ചേരൽ / പുറപ്പെടൽ','Day +{n}':'ദിവസം +{n}','{n} sec':'{n} സെക്കൻഡ്',
 'Station order and locations are from the uploaded catalog.':'സ്റ്റേഷനുകളുടെ ക്രമവും സ്ഥാനങ്ങളും നൽകിയ കാറ്റലോഗിൽനിന്നാണ്.','Wheelchair boarding':'വീൽചെയർ പ്രവേശനം','Available in catalog':'കാറ്റലോഗിൽ ലഭ്യമാണ്','Not available in catalog':'കാറ്റലോഗിൽ ലഭ്യമല്ല','Not specified':'വ്യക്തമാക്കിയിട്ടില്ല','Close Metro trip':'മെട്രോ ട്രിപ്പ് അടയ്ക്കുക',
 'Buses':'ബസുകൾ','Kochi Metro':'കൊച്ചി മെട്രോ','KOCHI METRO':'കൊച്ചി മെട്രോ','KOCHI METRO · STATION GUIDE':'കൊച്ചി മെട്രോ · സ്റ്റേഷൻ ഗൈഡ്',
 'A simpler way across Kochi.':'കൊച്ചിയിലൂടെ എളുപ്പമൊരു യാത്ര.','Pick your stations. See every stop along the way.':'സ്റ്റേഷനുകൾ തിരഞ്ഞെടുക്കൂ. വഴിയിലുള്ള എല്ലാ സ്റ്റോപ്പുകളും കാണൂ.',
 'Stations':'സ്റ്റേഷനുകൾ','Corridor in your station data':'നൽകിയ സ്റ്റേഷൻ പട്ടികയിലെ റൂട്ട്','View Metro Route':'മെട്രോ റൂട്ട് കാണൂ','YOUR METRO JOURNEY':'നിങ്ങളുടെ മെട്രോ യാത്ര',
 'Station route':'സ്റ്റേഷൻ റൂട്ട്','Direction':'ദിശ','Stations on route':'റൂട്ടിലെ സ്റ്റേഷനുകൾ','In between':'ഇടയിലുള്ളവ',
 'Station order is from your uploaded file. Train timings and fares are not included.':'സ്റ്റേഷനുകളുടെ ക്രമം നൽകിയ ഫയലിൽനിന്നാണ്. ട്രെയിൻ സമയങ്ങളും നിരക്കുകളും ഉൾപ്പെടുത്തിയിട്ടില്ല.',
 'Explore all 25 stations':'25 സ്റ്റേഷനുകളും കാണൂ','Search stations':'സ്റ്റേഷനുകൾ തിരയൂ','Search station name or code':'സ്റ്റേഷൻ പേരോ കോഡോ തിരയൂ',
 'Main stations only':'പ്രധാന സ്റ്റേഷനുകൾ മാത്രം','Main station labels follow the flag in your uploaded file.':'പ്രധാന സ്റ്റേഷൻ ലേബൽ നൽകിയ ഫയലിലെ അടയാളം അനുസരിച്ചാണ്.',
 'Choose two different Metro stations.':'വ്യത്യസ്തമായ രണ്ട് മെട്രോ സ്റ്റേഷനുകൾ തിരഞ്ഞെടുക്കൂ.','Towards {station}':'{station} ഭാഗത്തേക്ക്',
 '{n} more stations':'കൂടുതൽ {n} സ്റ്റേഷനുകൾ','Show fewer stations':'കുറച്ച് സ്റ്റേഷനുകൾ കാണിക്കുക','Show all {n} stations':'{n} സ്റ്റേഷനുകളും കാണൂ',
 '{n} stations':'{n} സ്റ്റേഷനുകൾ','No matching Metro stations.':'മെട്രോ സ്റ്റേഷൻ കണ്ടെത്തിയില്ല.','Main':'പ്രധാന',
 'Station code':'സ്റ്റേഷൻ കോഡ്','Route position':'റൂട്ടിലെ സ്ഥാനം','Main station':'പ്രധാന സ്റ്റേഷൻ','Yes':'അതെ','No':'അല്ല','Latitude':'അക്ഷാംശം','Longitude':'രേഖാംശം',
 'Open station on map':'സ്റ്റേഷൻ മാപ്പിൽ കാണൂ','Coordinates and station labels are from your uploaded station file.':'നൽകിയ സ്റ്റേഷൻ ഫയലിൽനിന്നുള്ള സ്ഥാനവിവരങ്ങളും ലേബലുകളും.',
 'Close station details':'സ്റ്റേഷൻ വിവരങ്ങൾ അടയ്ക്കുക',
 'Where are you heading?':'എവിടേക്കാണ് യാത്ര?', 'YOUR EVERYDAY JOURNEY, SIMPLIFIED':'നിങ്ങളുടെ യാത്ര ഇനി എളുപ്പത്തിൽ',
 'Your next bus is a search away.':'നിങ്ങളുടെ അടുത്ത ബസ് കണ്ടെത്തൂ.', 'From':'പുറപ്പെടുന്ന സ്ഥലം', 'To':'എത്തേണ്ട സ്ഥലം',
 'Select Departure Stop':'പുറപ്പെടുന്ന സ്റ്റോപ്പ് തിരഞ്ഞെടുക്കൂ', 'Select Destination Stop':'എത്തേണ്ട സ്റ്റോപ്പ് തിരഞ്ഞെടുക്കൂ',
 'Departure Time':'പുറപ്പെടുന്ന സമയം','Any Time':'ഏത് സമയവും','From now':'ഇപ്പോൾ മുതൽ',
 'After 6:00 AM':'രാവിലെ 6 മണിക്ക് ശേഷം','After 9:00 AM':'രാവിലെ 9 മണിക്ക് ശേഷം','After 12:00 PM':'ഉച്ചയ്ക്ക് 12 മണിക്ക് ശേഷം','After 3:00 PM':'വൈകിട്ട് 3 മണിക്ക് ശേഷം','After 6:00 PM':'വൈകിട്ട് 6 മണിക്ക് ശേഷം',
 'Search Buses':'ബസുകൾ തിരയൂ','Finding buses…':'ബസുകൾ തിരയുന്നു…','All Buses':'എല്ലാ ബസുകളും','Private':'സ്വകാര്യ',
 'Sorted by Time':'സമയം അനുസരിച്ച്','Shortest Journey':'കുറഞ്ഞ യാത്രാസമയം','Available Transit Buses':'ലഭ്യമായ ബസുകൾ','{n} found':'{n} എണ്ണം',
 'Where will you go next?':'അടുത്ത യാത്ര എവിടേക്ക്?','Choose your stops to find a direct bus.':'നേരിട്ടുള്ള ബസ് കണ്ടെത്താൻ സ്റ്റോപ്പുകൾ തിരഞ്ഞെടുക്കൂ.',
 'Try a popular journey':'ഒരു ജനപ്രിയ റൂട്ട് നോക്കൂ','Timetable estimates. Please confirm with the operator before travel.':'സമയങ്ങൾ ഏകദേശമാണ്. യാത്രയ്ക്കുമുമ്പ് ബസ് ഓപ്പറേറ്ററുമായി സ്ഥിരീകരിക്കുക.',
 'Made for the journeys that matter.':'നിങ്ങളുടെ യാത്രകൾക്കായി.','No direct buses found':'നേരിട്ടുള്ള ബസുകൾ കണ്ടെത്തിയില്ല',
 'Try All Buses or another operator.':'എല്ലാ ബസുകളും അല്ലെങ്കിൽ മറ്റൊരു ഓപ്പറേറ്ററും നോക്കൂ.','Try another stop or choose Any Time.':'മറ്റൊരു സ്റ്റോപ്പോ സമയമോ തിരഞ്ഞെടുക്കൂ.',
 'Searching':'തിരയുന്നു','Searching bus timetables.':'ബസ് സമയങ്ങൾ തിരയുന്നു.','{n} buses found.':'{n} ബസുകൾ കണ്ടെത്തി.',
 'Scheduled departures':'ടൈംടേബിൾ പ്രകാരമുള്ള സമയം','after the current time in India':'ഇന്ത്യയിലെ ഇപ്പോഴത്തെ സമയത്തിന് ശേഷം',
 'Showing the first {shown} of {total} matches; narrow by departure time.':'{total} ഫലങ്ങളിൽ ആദ്യത്തെ {shown} കാണിക്കുന്നു; സമയം ഉപയോഗിച്ച് ഫിൽട്ടർ ചെയ്യൂ.',
 'Finding stops…':'സ്റ്റോപ്പുകൾ തിരയുന്നു…','No matching stops. Try another spelling.':'സ്റ്റോപ്പ് കണ്ടെത്തിയില്ല. മറ്റൊരു സ്പെല്ലിംഗ് നോക്കൂ.',
 'Stops unavailable. Check your connection.':'സ്റ്റോപ്പുകൾ ലഭ്യമല്ല. ഇന്റർനെറ്റ് പരിശോധിക്കുക.','{n} scheduled services':'ടൈംടേബിളിൽ {n} സർവീസുകൾ',
 'Choose a departure stop and a destination stop.':'പുറപ്പെടുന്ന സ്റ്റോപ്പും എത്തേണ്ട സ്റ്റോപ്പും തിരഞ്ഞെടുക്കൂ.',
 'Select a matching stop from the suggestions.':'പട്ടികയിൽനിന്ന് ഒരു സ്റ്റോപ്പ് തിരഞ്ഞെടുക്കൂ.','Choose two different stops for your journey.':'യാത്രയ്ക്ക് രണ്ട് വ്യത്യസ്ത സ്റ്റോപ്പുകൾ തിരഞ്ഞെടുക്കൂ.',
 'Timetable unavailable. Please try again.':'ടൈംടേബിൾ ലഭ്യമല്ല. വീണ്ടും ശ്രമിക്കൂ.',
 'We couldn’t load the timetable':'ടൈംടേബിൾ തുറക്കാനായില്ല','Check your connection and try again.':'ഇന്റർനെറ്റ് പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.','Try again':'വീണ്ടും ശ്രമിക്കൂ',
 'Popular journey unavailable. Please choose your stops.':'ഈ റൂട്ട് ലഭ്യമല്ല. സ്റ്റോപ്പുകൾ തിരഞ്ഞെടുക്കൂ.',
 'Time unavailable':'സമയം ലഭ്യമല്ല','Duration unavailable':'യാത്രാസമയം ലഭ്യമല്ല','{n} min':'{n} മിനിറ്റ്','{h} hr':'{h} മണിക്കൂർ','{h} hr {m} min':'{h} മണിക്കൂർ {m} മിനിറ്റ്',
 'App Settings':'ആപ്പ് ക്രമീകരണങ്ങൾ','Personalize your Neram experience':'നേരം ആപ്പ് നിങ്ങൾക്കിഷ്ടമുള്ളപോലെ',
 'Language':'ഭാഷ','Appearance':'രൂപഭാവം','Automatic':'സിസ്റ്റം അനുസരിച്ച്','Light':'ലൈറ്റ്','Dark':'ഡാർക്ക്',
 'About Neram':'നേരത്തെക്കുറിച്ച്','Time format':'സമയരീതി','12-hour':'12 മണിക്കൂർ','24-hour':'24 മണിക്കൂർ',
 'about-copy':'കേരളത്തിലെയും സമീപ പ്രദേശങ്ങളിലെയും സ്റ്റോപ്പുകൾക്കിടയിൽ നേരിട്ടുള്ള ബസുകൾ കണ്ടെത്തൂ. സമയങ്ങൾ മാറാം. നേരം ടൈംടേബിൾ തിരച്ചിലിനുള്ള ആപ്പാണ്; ലൈവ് ട്രാക്കിങ്ങും സീറ്റ് ബുക്കിങ്ങും ലഭ്യമല്ല.',
 'Stop names are shown as provided in the timetable dataset.':'സ്റ്റോപ്പ് പേരുകൾ ടൈംടേബിൾ ഡാറ്റയിൽ ഉള്ളതുപോലെ കാണിക്കുന്നു.',
 'Full Route':'മുഴുവൻ റൂട്ട്','ROUTE_TIMELINE':'റൂട്ടിലെ സ്റ്റോപ്പുകൾ','Total Duration':'യാത്രാസമയം','Total Stops':'ആകെ സ്റ്റോപ്പുകൾ','{n} stops':'{n} സ്റ്റോപ്പുകൾ',
 'Report Issue':'പിശക് അറിയിക്കൂ','Loading the route…':'റൂട്ട് തുറക്കുന്നു…','BOARD HERE':'ഇവിടെ കയറുക','GET OFF HERE':'ഇവിടെ ഇറങ്ങുക',
 'Route details are unavailable. Close this window and try again.':'റൂട്ട് വിവരങ്ങൾ ലഭ്യമല്ല. ഈ വിൻഡോ അടച്ച് വീണ്ടും ശ്രമിക്കുക.',
 'No stop information available.':'സ്റ്റോപ്പ് വിവരങ്ങൾ ലഭ്യമല്ല.','Bus journey':'ബസ് യാത്ര','Bus service':'ബസ് സർവീസ്',
 'What needs correcting?':'എന്താണ് തിരുത്തേണ്ടത്?','Incorrect timing':'തെറ്റായ സമയം','Missing or incorrect stop':'വിട്ടുപോയതോ തെറ്റായതോ ആയ സ്റ്റോപ്പ്','Incorrect route':'തെറ്റായ റൂട്ട്','Other':'മറ്റുള്ളവ','Details':'വിവരങ്ങൾ',
 'Tell us what should be corrected (at least 10 characters).':'തിരുത്തേണ്ടത് എന്താണെന്ന് പറയൂ (കുറഞ്ഞത് 10 അക്ഷരങ്ങൾ).','Please avoid sharing personal or payment details.':'വ്യക്തിഗത വിവരങ്ങളും പേയ്മെന്റ് വിവരങ്ങളും പങ്കിടരുത്.',
 'Submit report':'റിപ്പോർട്ട് അയയ്ക്കൂ','Submitting…':'അയയ്ക്കുന്നു…','Thank you. Your report has been submitted for review.':'നന്ദി. നിങ്ങളുടെ റിപ്പോർട്ട് പരിശോധനയ്ക്കായി സ്വീകരിച്ചു.',
 'We couldn’t submit the report. Please try again.':'റിപ്പോർട്ട് അയയ്ക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക.','Please add at least 10 characters.':'കുറഞ്ഞത് 10 അക്ഷരങ്ങൾ നൽകൂ.',
 'Overnight · +{n} day':'അടുത്ത ദിവസം · +{n}', 'Close settings':'ക്രമീകരണങ്ങൾ അടയ്ക്കുക','Close journey details':'യാത്രാവിവരങ്ങൾ അടയ്ക്കുക','Close about':'അടയ്ക്കുക','Close report':'റിപ്പോർട്ട് അടയ്ക്കുക',
 'Open settings':'ക്രമീകരണങ്ങൾ തുറക്കുക','Back to journey details':'യാത്രാവിവരങ്ങളിലേക്ക് മടങ്ങുക','Swap departure and destination':'സ്റ്റോപ്പുകൾ പരസ്പരം മാറ്റുക'
 };
 let language='en',theme='dark';
 try{const saved=JSON.parse(localStorage.getItem('neram-preferences')||'{}');if(['en','ml'].includes(saved.language))language=saved.language;if(['auto','dark','light'].includes(saved.theme))theme=saved.theme;}catch{}
 const media=window.matchMedia('(prefers-color-scheme: dark)');
 function t(key,params={}){let value=language==='ml'?(words[key]||key):key;if(key==='about-copy'&&language==='en')value='Find direct buses between stops across Kerala and beyond. Scheduled times may change. Neram provides timetable search, with no live tracking or seat booking.';return value.replace(/\{(\w+)\}/g,(_,k)=>params[k]??'');}
 const staticText={
 '#heading':'Where are you heading?','.intro .eyebrow':'YOUR EVERYDAY JOURNEY, SIMPLIFIED','.subtitle':'Your next bus is a search away.',
 'label[for="from"]':'From','label[for="to"]':'To','label[for="departure-time"]':'Departure Time','#search-form button[type="submit"] span':'Search Buses',
 '[data-operator="all"]':'All Buses','[data-operator="Private"]':'Private','#sort-button span':'Sorted by Time','#results-heading':'Available Transit Buses',
 '#empty-state h3':'Where will you go next?','#empty-state p':'Choose your stops to find a direct bus.','.popular>span':'Try a popular journey',
 'footer p':'Timetable estimates. Please confirm with the operator before travel.','.footer-note':'Made for the journeys that matter.',
 '#data-error h3':'We couldn’t load the timetable','#data-error p':'Check your connection and try again.','#retry-button':'Try again'
 };
 Object.entries(staticText).forEach(([selector,key])=>document.querySelector(selector)?.setAttribute('data-i18n',key));
 document.querySelector('#from').dataset.placeholder='Select Departure Stop';document.querySelector('#to').dataset.placeholder='Select Destination Stop';
 document.querySelectorAll('#departure-time option').forEach(el=>el.dataset.i18n=el.textContent);
 document.querySelectorAll('[aria-label]').forEach(el=>{if(words[el.getAttribute('aria-label')])el.dataset.label=el.getAttribute('aria-label');});
 function apply(){
  document.documentElement.lang=language;document.documentElement.dataset.theme=theme==='auto'?(media.matches?'dark':'light'):theme;
  document.querySelector('meta[name="theme-color"]').content=document.documentElement.dataset.theme==='light'?'#edf3f7':'#2c3443';
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll('[data-placeholder]').forEach(el=>el.placeholder=t(el.dataset.placeholder));
  document.querySelectorAll('[data-label]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.label)));
  document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===language)));
  document.querySelectorAll('[data-theme]').forEach(el=>{if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(el.dataset.theme===theme));});
  window.dispatchEvent(new CustomEvent('neram:preferences'));
 }
 function save(){try{localStorage.setItem('neram-preferences',JSON.stringify({language,theme}));}catch{}apply();}
 document.querySelectorAll('[data-language]').forEach(el=>el.addEventListener('click',()=>{language=el.dataset.language;save();}));
 document.querySelectorAll('button[data-theme]').forEach(el=>el.addEventListener('click',()=>{theme=el.dataset.theme;save();}));
 media.addEventListener('change',()=>{if(theme==='auto')apply();});apply();
 return {t,get language(){return language;},get theme(){return theme;}};
})();

;
'use strict';
const $ = (s) => document.querySelector(s);
const t = (...args) => window.NeramPrefs.t(...args);
const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const state = {from:null,to:null,rows:[],operator:'all',sort:'time',searched:false,loading:false,total:0,request:0};
let format = '12';
try { format = localStorage.getItem('neram-time-format') || '12'; } catch {}
const cache = new Map();
const pretty = (s) => String(s || '').replace(/\S+/g, w => /^[A-Z\d]+$/.test(w) ? w.charAt(0)+w.slice(1).toLowerCase() : w);
function timeLabel(value) {
 if (!value || !/^\d{2}:\d{2}$/.test(value)) return t('Time unavailable');
 if(format==='24') return value;
 const [h,m]=value.split(':').map(Number);return `${String(h%12||12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}
function durationLabel(n){if(n==null||n<0)return t('Duration unavailable');if(n<60)return t('{n} min',{n});return n%60?t('{h} hr {m} min',{h:Math.floor(n/60),m:n%60}):t('{h} hr',{h:Math.floor(n/60)});}
function textNode(tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;}
async function rpc(name,body,signal){
 const config=window.NERAM_CONFIG;
 const response=await fetch(`${config.url}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(body),signal});
 if(!response.ok)throw new Error(`Timetable request failed (${response.status})`);
 return response.json();
}
async function getStops(query,signal){
 const key=query.trim().toLowerCase();
 if(cache.has(key))return cache.get(key);
 const rows=await rpc('neram_find_stops',{p_query:key},signal);
 if(cache.size>100)cache.delete(cache.keys().next().value);
 cache.set(key,rows);return rows;
}
function setupStop(id){
 const input=$(`#${id}`),list=$(`#${id}-options`),wrap=$(`#${id}-wrap`);
 let timer,controller,items=[],index=-1,version=0;
 function close(){list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');index=-1;}
 function choose(item){state[id]=item;input.value=pretty(item.name);close();clearError();invalidate();}
 function mark(){[...list.querySelectorAll('[role="option"]')].forEach((li,i)=>{li.classList.toggle('selected',i===index);li.setAttribute('aria-selected',String(i===index));});if(index>=0){input.setAttribute('aria-activedescendant',`${id}-option-${index}`);list.children[index]?.scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');}
 function notice(message){list.replaceChildren(textNode('li',message,'notice'));}
 async function load(){
  const v=++version;controller?.abort();controller=new AbortController();items=[];list.hidden=false;input.setAttribute('aria-expanded','true');input.setAttribute('aria-busy','true');notice(t('Finding stops…'));index=-1;
  try{const found=await getStops(input.value,controller.signal);if(v!==version||document.activeElement!==input)return;items=found;list.replaceChildren();if(!items.length)notice(t('No matching stops. Try another spelling.'));
   items.forEach((item,i)=>{const li=document.createElement('li');li.id=`${id}-option-${i}`;li.setAttribute('role','option');li.setAttribute('aria-selected','false');li.append(textNode('span',pretty(item.name)),textNode('small',t('{n} scheduled services',{n:item.service_count.toLocaleString()})));li.addEventListener('mousedown',e=>e.preventDefault());li.addEventListener('click',()=>choose(item));list.append(li);});
  }catch(e){if(e.name!=='AbortError'&&v===version){items=[];notice(t('Stops unavailable. Check your connection.'));}}finally{if(v===version)input.removeAttribute('aria-busy');}
 }
 input.addEventListener('focus',load);
 input.addEventListener('input',()=>{state[id]=null;invalidate();clearTimeout(timer);timer=setTimeout(load,220);});
 input.addEventListener('keydown',e=>{
  if(e.key==='Escape'){close();return;}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(list.hidden){load();return;}if(items.length){index=index<0?(e.key==='ArrowDown'?0:items.length-1):(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;mark();}}
  if(e.key==='Enter'&&!list.hidden&&index>=0&&items[index]){e.preventDefault();choose(items[index]);}
 });
 document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close();});
 input.addEventListener('blur',()=>{clearTimeout(timer);controller?.abort();version++;input.removeAttribute('aria-busy');setTimeout(close,160);});
 return {close,choose};
}
const fields={from:setupStop('from'),to:setupStop('to')};
function clearError(){$('#form-error').hidden=true;}
function showError(message){$('#form-error').textContent=message;$('#form-error').hidden=false;}
function invalidate(){state.request++;if(state.searched||state.loading){state.rows=[];state.searched=false;state.loading=false;state.total=0;$('#search-form button[type="submit"]').disabled=false;$('#search-form button[type="submit"] span').textContent=t('Search Buses');$('#data-error').hidden=true;render();}}
async function resolveStop(id){if(state[id])return state[id];const input=$(`#${id}`);const rows=await getStops(input.value);const match=rows.find(x=>x.stop_key===input.value.trim().toLowerCase());if(match){state[id]=match;input.value=pretty(match.name);}return match;}
function departureMinutes(){const v=$('#departure-time').value;if(v==='')return null;if(v==='now'){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());return Number(parts.find(x=>x.type==='hour').value)*60+Number(parts.find(x=>x.type==='minute').value);}return Number(v);}
async function search(){
 clearError();fields.from.close();fields.to.close();
 if(!$('#from').value.trim()||!$('#to').value.trim()){showError(t('Choose a departure stop and a destination stop.'));(!$('#from').value.trim()?$('#from'):$('#to')).focus();return;}
 const request=++state.request;state.loading=true;state.searched=false;state.rows=[];state.total=0;$('#data-error').hidden=true;$('#search-form button[type="submit"]').disabled=true;$('#search-form button[type="submit"] span').textContent=t('Finding buses…');render();
 try{
  const from=await resolveStop('from'),to=await resolveStop('to');if(request!==state.request)return;
  if(!from||!to){showError(t('Select a matching stop from the suggestions.'));state.loading=false;render();return;}
  if(from.stop_key===to.stop_key){showError(t('Choose two different stops for your journey.'));state.loading=false;render();return;}
  const rows=await rpc('neram_search_buses',{p_from:from.stop_key,p_to:to.stop_key,p_after:departureMinutes(),p_limit:200});if(request!==state.request)return;
  state.rows=rows;state.total=Number(rows[0]?.total_matches||0);state.searched=true;state.loading=false;render();
 }catch(e){if(request!==state.request)return;state.loading=false;$('#data-error').hidden=false;$('#empty-state').hidden=true;$('#results-list').replaceChildren();$('#results-live').textContent=t('Timetable unavailable. Please try again.');}
 finally{if(request===state.request){state.loading=false;$('#search-form button[type="submit"]').disabled=false;$('#search-form button[type="submit"] span').textContent=t('Search Buses');}}
}
function render(){
 const list=$('#results-list');list.replaceChildren();$('#result-caption').hidden=true;
 if(!state.searched&&!state.loading)$('#results-live').textContent='';
 if(state.loading){$('#empty-state').hidden=true;for(let i=0;i<3;i++){const div=document.createElement('div');div.className='skeleton';div.setAttribute('aria-hidden','true');list.append(div);}$('#result-count').textContent=t('Searching');$('#results-live').textContent=t('Searching bus timetables.');return;}
 const rows=state.rows.filter(x=>state.operator==='all'||x.operator===state.operator).sort((a,b)=>{if(state.sort==='duration')return (a.duration_minutes??Infinity)-(b.duration_minutes??Infinity)||(a.departure_time||'99').localeCompare(b.departure_time||'99');return (a.departure_time||'99').localeCompare(b.departure_time||'99');});
 $('#result-count').textContent=t('{n} found',{n:rows.length});
 $('#empty-state').hidden=rows.length>0||!$('#data-error').hidden;
 $('#empty-state h3').textContent=state.searched?t('No direct buses found'):t('Where will you go next?');
 $('#empty-state p').textContent=state.searched?(state.rows.length?t('Try All Buses or another operator.'):t('Try another stop or choose Any Time.')):t('Choose your stops to find a direct bus.');
 $('.popular').hidden=state.searched;
 if(state.searched){$('#results-live').textContent=t('{n} buses found.',{n:rows.length});$('#result-caption').hidden=false;const caption=`${pretty(state.from?.name)} → ${pretty(state.to?.name)} · ${t('Scheduled departures')}${$('#departure-time').value==='now'?' '+t('after the current time in India'):''}`;$('#result-caption').textContent=state.total>state.rows.length?`${caption}. ${t('Showing the first {shown} of {total} matches; narrow by departure time.',{shown:state.rows.length,total:state.total})}`:caption;}
 rows.forEach(row=>{
  const card=document.createElement('button');card.type='button';card.className='bus-card';card.setAttribute('aria-label',`${row.name}, ${timeLabel(row.departure_time)}. View stops`);
  const img=document.createElement('img');img.src='/assets/bus.svg';img.alt='';img.width=89;img.height=89;
  const content=document.createElement('div');content.className='bus-content';const top=document.createElement('div');top.className='bus-top';top.append(textNode('span',row.name||'Bus service','bus-name'),textNode('span',t(row.operator),`operator-tag ${row.operator==='Private'?'private':''}`));
  const route=document.createElement('div');route.className='bus-route';route.innerHTML='<span class="green-dot"></span>';route.append(textNode('span',`${pretty(row.origin)} → ${pretty(row.destination)}`,'route-text'));
  const duration=document.createElement('div');duration.className='bus-duration';duration.innerHTML=icon('clock');duration.append(textNode('span',durationLabel(row.duration_minutes)));
  content.append(top,route,duration);const side=document.createElement('div');side.className='bus-side';side.append(textNode('span',timeLabel(row.departure_time),'departure-badge'));side.insertAdjacentHTML('beforeend',icon('chevron'));card.append(img,content,side);card.addEventListener('click',()=>showJourney(row));list.append(card);
 });
}
let journeyRequest=0;
let activeJourney=null;
const journeys=new Map();
function busHeader(row,full=false){
 const header=document.createElement('div');header.className='journey-bus-header';
 const image=document.createElement('img');image.src='/assets/bus.svg';image.alt='';image.width=60;image.height=60;
 const content=document.createElement('div');content.className='bus-content';
 const top=document.createElement('div');top.className='bus-top';top.append(textNode('span',row.name||t('Bus service'),'bus-name'),textNode('span',t(row.operator),`operator-tag ${row.operator==='Private'?'private':''}`));content.append(top);
 const route=document.createElement('div');route.className='bus-route';route.innerHTML='<span class="green-dot"></span>';route.append(textNode('span',`${pretty(row.origin)} → ${pretty(row.destination)}`,'route-text'));content.append(route);
 const when=document.createElement('div');when.className='journey-bus-time';when.innerHTML=icon('clock');when.append(textNode('span',timeLabel(full?activeJourney.stops[0]?.time:row.departure_time)));
 header.append(image,content,when);return header;
}
function timeline(stops,row,full=false){
 const list=document.createElement('ol');list.className='timeline';
 for(const stop of stops){const li=document.createElement('li'),label=document.createElement('span');
  const board=stop.sequence===row.boarding_sequence,alight=stop.sequence===row.alighting_sequence;
  if(board||alight){li.className='selected-stop';if(full)label.append(textNode('small',t(board?'BOARD HERE':'GET OFF HERE')));}
  label.append(document.createTextNode(pretty(stop.stop)));const time=textNode('time',timeLabel(stop.time));
  if(stop.day_offset>0){time.append(textNode('small',t('Overnight · +{n} day',{n:stop.day_offset})));}
  li.append(label,time);list.append(li);
 }
 return list;
}
function renderJourney(){
 if(!activeJourney)return;const {row,stops}=activeJourney;
 $('#journey-summary').replaceChildren(busHeader(row));$('#segment-duration').textContent=durationLabel(row.duration_minutes);
 const container=$('#journey-stops');
 if(!stops){container.replaceChildren(textNode('p',t('Loading the route…'),'journey-note'));$('#segment-count').textContent='—';$('#full-route-button').disabled=true;return;}
 const segment=stops.filter(x=>x.sequence>=row.boarding_sequence&&x.sequence<=row.alighting_sequence);
 $('#segment-count').textContent=t('{n} stops',{n:segment.length});$('#full-route-button').disabled=!stops.length;
 container.replaceChildren(segment.length?timeline(segment,row):textNode('p',t('No stop information available.'),'journey-note'));
}
async function showJourney(row){
 const req=++journeyRequest;activeJourney={row,stops:journeys.get(row.service_id)||null};renderJourney();$('#journey-dialog').showModal();
 if(activeJourney.stops)return;
 try{const stops=await rpc('neram_journey',{p_id:row.service_id});journeys.set(row.service_id,stops);if(req!==journeyRequest)return;activeJourney.stops=stops;renderJourney();}
 catch{if(req===journeyRequest)$('#journey-stops').replaceChildren(textNode('p',t('Route details are unavailable. Close this window and try again.'),'journey-note'));}
}
function renderFullRoute(){if(!activeJourney?.stops)return;$('#full-route-bus').replaceChildren(busHeader(activeJourney.row,true));$('#full-route-stops').replaceChildren(timeline(activeJourney.stops,activeJourney.row,true));}
function closeFullRoute(){if($('#full-route-view').hidden)return;$('#full-route-view').hidden=true;document.body.classList.remove('route-open');window.scrollTo(0,routeScroll);renderJourney();if(!$('#journey-dialog').open)$('#journey-dialog').showModal();}
let routeScroll=0;
$('#full-route-button').addEventListener('click',()=>{if(!activeJourney?.stops?.length)return;routeScroll=window.scrollY;$('#journey-dialog').close();renderFullRoute();$('#full-route-view').hidden=false;document.body.classList.add('route-open');history.pushState({neramFullRoute:true},'',location.href);window.scrollTo(0,0);$('#route-back').focus({preventScroll:true});});
$('#route-back').addEventListener('click',()=>{if(history.state?.neramFullRoute)history.back();else closeFullRoute();});
window.addEventListener('popstate',()=>{if(!history.state?.neramFullRoute)closeFullRoute();else if(activeJourney?.stops){$('#journey-dialog').close();renderFullRoute();$('#full-route-view').hidden=false;document.body.classList.add('route-open');window.scrollTo(0,0);}});
$('#report-button').addEventListener('click',()=>{if(!activeJourney)return;$('#report-form').reset();$('#report-status').textContent='';$('#report-status').className='';$('#report-form button[type="submit"]').disabled=false;$('#report-context').textContent=`${activeJourney.row.name} · ${pretty(activeJourney.row.boarding_stop)} → ${pretty(activeJourney.row.alighting_stop)}`;$('#report-dialog').showModal();});
$('#report-form').addEventListener('submit',async e=>{
 e.preventDefault();if(!activeJourney)return;const details=$('#report-details').value.trim();if(details.length<10){$('#report-status').textContent=t('Please add at least 10 characters.');return;}
 const button=$('#report-form button[type="submit"]'),serviceId=activeJourney.row.service_id;button.disabled=true;button.querySelector('span').textContent=t('Submitting…');$('#report-status').textContent='';
 try{const c=window.NERAM_CONFIG;const r=await fetch(`${c.url}/rest/v1/neram_issue_reports`,{method:'POST',headers:{apikey:c.publishableKey,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({service_id:serviceId,category:$('#report-category').value,details})});if(!r.ok)throw Error();$('#report-status').className='';$('#report-status').textContent=t('Thank you. Your report has been submitted for review.');$('#report-form').reset();}
 catch{$('#report-status').className='error';$('#report-status').textContent=t('We couldn’t submit the report. Please try again.');button.disabled=false;}
 finally{button.querySelector('span').textContent=t('Submit report');}
});
$('#about-button').addEventListener('click',()=>$('#about-dialog').showModal());
$('#search-form').addEventListener('submit',e=>{e.preventDefault();search();});
$('#swap-button').addEventListener('click',()=>{[state.from,state.to]=[state.to,state.from];const a=$('#from').value;$('#from').value=$('#to').value;$('#to').value=a;invalidate();clearError();fields.from.close();fields.to.close();});
$('#departure-time').addEventListener('change',invalidate);
document.querySelectorAll('[data-operator]').forEach(btn=>btn.addEventListener('click',()=>{state.operator=btn.dataset.operator;document.querySelectorAll('[data-operator]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});render();}));
$('#sort-button').addEventListener('click',()=>{state.sort=state.sort==='time'?'duration':'time';$('#sort-button span').textContent=t(state.sort==='time'?'Sorted by Time':'Shortest Journey');render();});
$('#retry-button').addEventListener('click',search);
$('#popular-route').addEventListener('click',async()=>{try{const [from,to]=await Promise.all([getStops('aluva'),getStops('ernakulam')]);const a=from.find(x=>x.stop_key==='aluva'),b=to.find(x=>x.stop_key==='ernakulam');if(!a||!b)throw Error();fields.from.choose(a);fields.to.choose(b);search();}catch{showError(t('Popular journey unavailable. Please choose your stops.'));}});
$('#settings-button').addEventListener('click',()=>$('#settings-dialog').showModal());
$('#time-format').value=format;
$('#time-format').addEventListener('change',e=>{format=e.target.value;try{localStorage.setItem('neram-time-format',format);}catch{}render();renderJourney();renderFullRoute();});
window.addEventListener('neram:preferences',()=>{render();renderJourney();renderFullRoute();$('#sort-button span').textContent=t(state.sort==='time'?'Sorted by Time':'Shortest Journey');if(state.loading)$('#search-form button[type="submit"] span').textContent=t('Finding buses…');});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
render();

;
// Source: kochi_metro_catalog.zip/stops.json.
window.NERAM_METRO_STATIONS = [
  {
    "sequence": 1,
    "stop_id": "ALVA",
    "station_name": "Aluva",
    "latitude": 10.1099,
    "longitude": 76.3495,
    "main_station_flag": true,
    "names": {
      "ml": "ആലുവ",
      "hi": "आलुवा"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 2,
    "stop_id": "PNCU",
    "station_name": "Pulinchodu",
    "latitude": 10.0951,
    "longitude": 76.3466,
    "main_station_flag": true,
    "names": {
      "ml": "പുളിഞ്ചോട്",
      "hi": "पुलिनचोडु"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 3,
    "stop_id": "CPPY",
    "station_name": "Companypady",
    "latitude": 10.0873,
    "longitude": 76.3428,
    "main_station_flag": true,
    "names": {
      "ml": "കമ്പനിപ്പടി",
      "hi": "कंपनीपडी"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 4,
    "stop_id": "ATTK",
    "station_name": "Ambattukavu",
    "latitude": 10.0793,
    "longitude": 76.3389,
    "main_station_flag": false,
    "names": {
      "ml": "അമ്പാട്ടുകാവ്",
      "hi": "अम्बाटुकाव्"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 5,
    "stop_id": "MUTT",
    "station_name": "Muttom",
    "latitude": 10.0727,
    "longitude": 76.3336,
    "main_station_flag": false,
    "names": {
      "ml": "മുട്ടം",
      "hi": "मुट्टम"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 6,
    "stop_id": "KLMT",
    "station_name": "Kalamassery",
    "latitude": 10.0586,
    "longitude": 76.322,
    "main_station_flag": true,
    "names": {
      "ml": "കളമശ്ശേരി",
      "hi": "कलमशेरी"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 7,
    "stop_id": "CCUV",
    "station_name": "Cochin University",
    "latitude": 10.0467,
    "longitude": 76.3182,
    "main_station_flag": false,
    "names": {
      "ml": "കൊച്ചിൻ യൂണിവേഴ്സിറ്റി",
      "hi": "कोच्चिन यूनिवर्सिटी"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 8,
    "stop_id": "PDPM",
    "station_name": "Pathadipalam",
    "latitude": 10.0361,
    "longitude": 76.3144,
    "main_station_flag": true,
    "names": {
      "ml": "പത്തടിപ്പോലം",
      "hi": "पत्तडिप्पालम"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 9,
    "stop_id": "EDAP",
    "station_name": "Edapally",
    "latitude": 10.0251,
    "longitude": 76.3083,
    "main_station_flag": true,
    "names": {
      "ml": "ഇടപ്പള്ളി",
      "hi": "इडप्पल्ली"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 10,
    "stop_id": "CGPP",
    "station_name": "Changampuzha Park",
    "latitude": 10.0152,
    "longitude": 76.3023,
    "main_station_flag": false,
    "names": {
      "ml": "ചങ്ങമ്പുഴ പാർക്ക്",
      "hi": "चंगमपुष़ा पार्क"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 11,
    "stop_id": "PARV",
    "station_name": "Palarivattom",
    "latitude": 10.0064,
    "longitude": 76.3048,
    "main_station_flag": true,
    "names": {
      "ml": "പാലാരിവട്ടം",
      "hi": "पालारिवट्टम"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 12,
    "stop_id": "JLSD",
    "station_name": "JLN Stadium",
    "latitude": 10.0002,
    "longitude": 76.2989,
    "main_station_flag": false,
    "names": {
      "ml": "ജെ എൽ എൻ സ്റ്റേഡിയം",
      "hi": "जे.एल.एन स्टेडियम"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 13,
    "stop_id": "KALR",
    "station_name": "Kaloor",
    "latitude": 9.9943,
    "longitude": 76.2914,
    "main_station_flag": true,
    "names": {
      "ml": "കലൂർ",
      "hi": "कलूर"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 14,
    "stop_id": "TNHL",
    "station_name": "Town Hall",
    "latitude": 9.9913775,
    "longitude": 76.2883601,
    "main_station_flag": false,
    "names": {
      "ml": "ടൗൺ ഹാൾ",
      "hi": "टाउन हॉल"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 15,
    "stop_id": "MGRD",
    "station_name": "MG Road",
    "latitude": 9.9834,
    "longitude": 76.2823,
    "main_station_flag": true,
    "names": {
      "ml": "എം.ജി റോഡ്",
      "hi": "एम जी रोड"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 16,
    "stop_id": "MACE",
    "station_name": "Maharajas College",
    "latitude": 9.9732,
    "longitude": 76.2851,
    "main_station_flag": false,
    "names": {
      "ml": "മഹാരാജാസ് കോളേജ്",
      "hi": "महाराजास् कॉलज"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 17,
    "stop_id": "ERSH",
    "station_name": "Ernakulam South",
    "latitude": 9.9686042,
    "longitude": 76.2895744,
    "main_station_flag": true,
    "names": {
      "ml": "എറണാകുളം സൗത്ത്",
      "hi": "एर्नाकुलम साउथ"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 18,
    "stop_id": "KVTR",
    "station_name": "Kadavanthra",
    "latitude": 9.9665809,
    "longitude": 76.2981877,
    "main_station_flag": false,
    "names": {
      "ml": "കടവന്ത്ര",
      "hi": "कडवान्त्र"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 19,
    "stop_id": "EMKM",
    "station_name": "Elamkulam",
    "latitude": 9.9671248,
    "longitude": 76.3084899,
    "main_station_flag": false,
    "names": {
      "ml": "ഇളങ്കുളം",
      "hi": "एलमकुलम"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 20,
    "stop_id": "VYTA",
    "station_name": "Vyttila",
    "latitude": 9.9675457,
    "longitude": 76.3203664,
    "main_station_flag": true,
    "names": {
      "ml": "വൈറ്റില",
      "hi": "व्यत्तिला"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 21,
    "stop_id": "THYK",
    "station_name": "Thykoodam",
    "latitude": 9.9600311,
    "longitude": 76.3236762,
    "main_station_flag": false,
    "names": {
      "ml": "തൈക്കൂടം",
      "hi": "थाईकूडम"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 22,
    "stop_id": "PETT",
    "station_name": "Pettah",
    "latitude": 9.9524842,
    "longitude": 76.3302101,
    "main_station_flag": true,
    "names": {
      "ml": "പേട്ട",
      "hi": "पेट्टा"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 23,
    "stop_id": "VAKK",
    "station_name": "Vadakkekotta",
    "latitude": 9.952838,
    "longitude": 76.3394827,
    "main_station_flag": false,
    "names": {
      "ml": "വടക്കേക്കോട്ട",
      "hi": "वडक्केकोटा"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 24,
    "stop_id": "SNJN",
    "station_name": "SN Junction",
    "latitude": 9.9547532,
    "longitude": 76.3458505,
    "main_station_flag": false,
    "names": {
      "ml": "എസ്. എൻ. ജംഗ്ഷൻ",
      "hi": "एस.एन. जंक्शन"
    },
    "wheelchair_boarding": 1
  },
  {
    "sequence": 25,
    "stop_id": "TPHT",
    "station_name": "Tripunithura",
    "latitude": 9.95078,
    "longitude": 76.35183,
    "main_station_flag": true,
    "names": {
      "ml": "തൃപ്പൂണിത്തുറ",
      "hi": "त्रिपुनिथुरा"
    },
    "wheelchair_boarding": 1
  }
];

;
// Versioned, lazy-loaded archive catalog.
window.NERAM_METRO_CATALOG_MANIFEST = {"url": "/data/metro-catalog.5408afb0a9afd9cd.json", "calendarEnd": "2025-12-31", "calendarStart": "2024-08-12", "completeTrips": 446, "missingTrips": 4};

;
// Pure catalogue operations. Times are seconds from the published service-day start.
window.NeramMetroSchedule = (() => {
 function query(data,from,to,service,after=null){
  const a=data.stationCodes.indexOf(from),b=data.stationCodes.indexOf(to);
  if(a<0||b<0||a===b)return [];
  const matches=[];
  for(const [id,serviceId,direction,shapeId,calls] of data.trips){
   if(service&&serviceId!==service)continue;
   const start=calls.findIndex(s=>s[0]===a);if(start<0)continue;
   const end=calls.findIndex((s,i)=>i>start&&s[0]===b);if(end<0)continue;
   const departure=calls[start][2],arrival=calls[end][1];
   if(arrival<departure||(after!==null&&departure<after))continue;
   matches.push({id,serviceId,direction,shapeId,departure,arrival,duration:arrival-departure,
    origin:data.stationCodes[calls[0][0]],destination:data.stationCodes[calls.at(-1)[0]],
    calls:calls.slice(start,end+1),fullCalls:calls,stopCount:end-start+1});
  }
  return matches.sort((x,y)=>x.departure-y.departure||x.id.localeCompare(y.id));
 }
 function fare(data,from,to){const price=data.fares[`${from}:${to}`];return typeof price==='number'?price:null;}
 function seconds(value){if(!/^\d{1,3}:[0-5]\d(?::[0-5]\d)?$/.test(value))return null;const [h,m,s=0]=value.split(':').map(Number);return h*3600+m*60+s;}
 function fields(value){return {day:Math.floor(value/86400),hours:Math.floor(value/3600)%24,minutes:Math.floor(value/60)%60,seconds:value%60};}
 function validOn(calendar,date){
  const d=new Date(date+'T12:00:00Z');if(!Number.isFinite(d.getTime()))return false;
  const numeric=Number(date.replaceAll('-',''));const day=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][d.getUTCDay()];
  return numeric>=calendar.start_date&&numeric<=calendar.end_date&&calendar.days[day]===true;
 }
 return {query,fare,seconds,fields,validOn};
})();

;
// Station guide derived solely from stations.csv; no schedule or fare assumptions.
(() => {
 const stations=window.NERAM_METRO_STATIONS;
 const byId=new Map(stations.map(s=>[s.stop_id,s]));
 const stationName=s=>window.NeramPrefs.language==='ml'?(s.names?.ml||s.station_name):s.station_name;
 let route=[],expanded=false,mode=location.hash==='#metro'?'metro':'bus',detailId=null;
 for(const selector of ['#metro-from','#metro-to']){
  for(const station of stations){const option=document.createElement('option');option.value=station.stop_id;option.textContent=station.station_name;$(selector).append(option);}
 }
 $('#metro-from').value=stations[0].stop_id;$('#metro-to').value=stations.at(-1).stop_id;
 function setMode(next,updateUrl=true){
  mode=next;$('#bus-view').hidden=next!=='bus';$('#metro-view').hidden=next!=='metro';
  $('#mode-bus').setAttribute('aria-pressed',String(next==='bus'));$('#mode-metro').setAttribute('aria-pressed',String(next==='metro'));
  $('#footer-timetable-note').hidden=next==='metro';
  window.dispatchEvent(new CustomEvent('neram:metro-mode',{detail:next}));
  if(updateUrl)history.replaceState(null,'',location.pathname+location.search+(next==='metro'?'#metro':''));
 }
 $('#mode-bus').addEventListener('click',()=>setMode('bus'));
 $('#mode-metro').addEventListener('click',()=>setMode('metro'));
 window.addEventListener('hashchange',()=>setMode(location.hash==='#metro'?'metro':'bus',false));
 function selectRoute(){
  const from=byId.get($('#metro-from').value),to=byId.get($('#metro-to').value);
  if(!from||!to||from.stop_id===to.stop_id){$('#metro-error').hidden=false;$('#metro-error').textContent=t('Choose two different Metro stations.');$('#metro-route-result').hidden=true;window.dispatchEvent(new CustomEvent('neram:metro-route',{detail:null}));return false;}
  $('#metro-error').hidden=true;$('#metro-route-result').hidden=false;
  const low=Math.min(from.sequence,to.sequence),high=Math.max(from.sequence,to.sequence);
  route=stations.filter(s=>s.sequence>=low&&s.sequence<=high);
  if(from.sequence>to.sequence)route.reverse();expanded=false;renderRoute();window.dispatchEvent(new CustomEvent('neram:metro-route',{detail:{from:from.stop_id,to:to.stop_id}}));return true;
 }
 function renderRoute(){
  if(!route.length)return;
  $('#metro-route-title').textContent=`${stationName(route[0])} → ${stationName(route.at(-1))}`;
  const terminal=route[0].sequence<route.at(-1).sequence?stations.at(-1):stations[0];
  $('#metro-direction').textContent=t('Towards {station}',{station:stationName(terminal)});
  $('#metro-station-count').textContent=route.length;$('#metro-between-count').textContent=Math.max(0,route.length-2);
  const list=$('#metro-timeline');list.replaceChildren();
  const visible=expanded||route.length<=6?route:[...route.slice(0,3),null,route.at(-1)];
  visible.forEach((station,i)=>{
   const li=document.createElement('li');
   if(!station){li.className='metro-timeline-gap';li.textContent=t('{n} more stations',{n:route.length-4});list.append(li);return;}
   const position=route.indexOf(station);li.className=position===0?'metro-boarding':position===route.length-1?'metro-alighting':'';
   const dot=textNode('span',String(position+1),'metro-station-dot');dot.setAttribute('aria-hidden','true');
   const button=document.createElement('button');button.type='button';button.append(textNode('span',stationName(station),'metro-stop-name'));
   const code=textNode('small',station.stop_id);button.append(code);button.addEventListener('click',()=>openStation(station.stop_id));
   if(position===0)button.prepend(textNode('small',t('BOARD HERE'),'metro-stop-role'));else if(position===route.length-1)button.prepend(textNode('small',t('GET OFF HERE'),'metro-stop-role'));
   li.append(dot,button);list.append(li);
  });
  $('#metro-expand').hidden=route.length<=6;$('#metro-expand').textContent=expanded?t('Show fewer stations'):t('Show all {n} stations',{n:route.length});
 }
 $('#metro-form').addEventListener('submit',e=>{e.preventDefault();if(selectRoute())$('#metro-schedule').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
 $('#metro-swap').addEventListener('click',()=>{const from=$('#metro-from').value;$('#metro-from').value=$('#metro-to').value;$('#metro-to').value=from;selectRoute();});
 $('#metro-from').addEventListener('change',selectRoute);$('#metro-to').addEventListener('change',selectRoute);
 $('#metro-expand').addEventListener('click',()=>{expanded=!expanded;renderRoute();});
 function renderCatalogue(){
  const q=$('#metro-station-query').value.trim().toLowerCase();const main=$('#metro-main-only').checked;
  const filtered=stations.filter(s=>(!main||s.main_station_flag)&&`${s.station_name} ${s.names?.ml||''} ${s.names?.hi||''} ${s.stop_id}`.toLowerCase().includes(q));
  const list=$('#metro-station-list');list.replaceChildren();$('#metro-catalogue-count').textContent=t('{n} stations',{n:filtered.length});
  if(!filtered.length){list.append(textNode('p',t('No matching Metro stations.'),'metro-source-note'));return;}
  filtered.forEach(station=>{const button=document.createElement('button');button.className='metro-catalogue-station';button.type='button';
   const n=textNode('span',String(station.sequence).padStart(2,'0'),'metro-catalogue-number'),label=document.createElement('span');
   label.append(textNode('strong',stationName(station)),textNode('small',station.stop_id));button.append(n,label);
   if(station.main_station_flag)button.append(textNode('span',t('Main'),'metro-main-badge'));
   button.insertAdjacentHTML('beforeend',icon('chevron'));button.addEventListener('click',()=>openStation(station.stop_id));list.append(button);
  });
 }
 $('#metro-station-query').addEventListener('input',renderCatalogue);$('#metro-main-only').addEventListener('change',renderCatalogue);
 function renderStation(){
  const station=byId.get(detailId);if(!station)return;$('#metro-station-title').textContent=stationName(station);
  const container=$('#metro-station-detail');container.replaceChildren();const dl=document.createElement('dl');dl.className='metro-station-facts';
  for(const [key,value] of [['Station code',station.stop_id],['Route position',`${station.sequence} / ${stations.length}`],['Main station',t(station.main_station_flag?'Yes':'No')],['Wheelchair boarding',t(station.wheelchair_boarding===1?'Available in catalog':station.wheelchair_boarding===2?'Not available in catalog':'Not specified')],['Latitude',String(station.latitude)],['Longitude',String(station.longitude)]]){
   const entry=document.createElement('div');entry.append(textNode('dt',t(key)),textNode('dd',value));dl.append(entry);
  }
  const map=document.createElement('a');map.className='sheet-action primary metro-map-link';map.href=`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;map.target='_blank';map.rel='noopener noreferrer';map.innerHTML=icon('map');map.append(textNode('span',t('Open station on map')));
  container.append(dl,map,textNode('p',t('Coordinates and station labels are from your uploaded station file.'),'metro-source-note'));
 }
 function openStation(id){detailId=id;renderStation();$('#metro-station-dialog').showModal();}
 window.addEventListener('neram:metro-station',e=>{if(byId.has(e.detail))openStation(e.detail);});
 window.addEventListener('neram:preferences',()=>{for(const id of ['#metro-from','#metro-to']){for(const option of $(id).options)option.textContent=stationName(byId.get(option.value));}renderRoute();renderCatalogue();renderStation();$('#footer-timetable-note').hidden=mode==='metro';if(!$('#metro-error').hidden)$('#metro-error').textContent=t('Choose two different Metro stations.');});
 selectRoute();renderCatalogue();setMode(mode,false);
})();

;
(() => {
 const core=window.NeramMetroSchedule,manifest=window.NERAM_METRO_CATALOG_MANIFEST;
 const stations=window.NERAM_METRO_STATIONS,byId=new Map(stations.map(s=>[s.stop_id,s]));
 const name=id=>{const s=byId.get(id);return window.NeramPrefs.language==='ml'?(s?.names?.ml||s?.station_name||id):(s?.station_name||id);};
 let catalog=null,loading=null,failed=false,limit=12,matches=[],activeTrip=null;
 function clock(seconds,precise=false){
  const f=core.fields(seconds),base=`${String(f.hours).padStart(2,'0')}:${String(f.minutes).padStart(2,'0')}`;
  let value=timeLabel(base);if(precise)value=value.replace(/(\d{2}:\d{2})/,`$1:${String(f.seconds).padStart(2,'0')}`);
  return value+(f.day?` · ${t('Day +{n}',{n:f.day})}`:'');
 }
 function travelTime(seconds){const mins=Math.floor(seconds/60),s=seconds%60;return [mins?durationLabel(mins):'',s?t('{n} sec',{n:s}):''].filter(Boolean).join(' ')||t('{n} sec',{n:0});}
 async function loadCatalog(){
  if(catalog)return catalog;if(loading)return loading;failed=false;render();
  loading=fetch(manifest.url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json();}).then(data=>{
   if(data.schemaVersion!==1||!Array.isArray(data.trips)||!Array.isArray(data.stationCodes)||data.trips.length!==manifest.completeTrips)throw Error('Invalid catalog');
   catalog=data;failed=false;return data;
  }).catch(()=>{failed=true;return null;}).finally(()=>{loading=null;render();});
  return loading;
 }
 function routeSelection(){const from=$('#metro-from').value,to=$('#metro-to').value;return from!==to&&byId.has(from)&&byId.has(to)?{from,to}:null;}
 function render(){
  const selected=routeSelection();$('#metro-schedule').hidden=!selected;if(!selected)return;
  const list=$('#metro-departures');list.replaceChildren();$('#metro-departures-more').hidden=true;$('#metro-schedule-retry').hidden=!failed;
  if(!catalog){$('#metro-catalog-fare').textContent='—';$('#metro-calendar-range').textContent=t('Published service period: 12 August 2024 – 31 December 2025.');$('#metro-schedule-status').textContent=t(failed?'Could not load the archived timetable. Please try again.':'Loading the archived timetable…');return;}
  const service=$('#metro-service').value,after=core.seconds($('#metro-after').value);
  const calendar=catalog.calendar.find(c=>c.service_id===service);
  if(!calendar){$('#metro-schedule-status').textContent=t('No published calendar is available for this pattern.');return;}
  $('#metro-calendar-range').textContent=t('Published service period: 12 August 2024 – 31 December 2025.');
  const price=core.fare(catalog,selected.from,selected.to);$('#metro-catalog-fare').textContent=price===null?t('Not available'):`₹${price}`;
  matches=core.query(catalog,selected.from,selected.to,service,after);
  $('#metro-schedule-status').textContent=matches.length?t('{n} published departures',{n:matches.length}):t('No archived trips match these stations and time.');
  for(const trip of matches.slice(0,limit)){
   const button=document.createElement('button');button.className='metro-departure';button.type='button';
   button.setAttribute('aria-label',`${t('Archived trip')} ${trip.id}, ${clock(trip.departure)}. ${t('View stop times')}`);
   const mark=document.createElement('span');mark.className='metro-departure-icon';mark.innerHTML=icon('metro');
   const body=document.createElement('span');body.className='metro-departure-body';
   const times=document.createElement('span');times.className='metro-departure-times';
   const dep=textNode('strong',clock(trip.departure)),arr=textNode('strong',clock(trip.arrival));dep.title=clock(trip.departure,true);arr.title=clock(trip.arrival,true);
   times.append(dep,textNode('span','→'),arr);
   body.append(times,textNode('small',`${name(trip.origin)} → ${name(trip.destination)}`),textNode('small',`${t('Catalog trip')} ${trip.id} · ${t('{n} stations',{n:trip.stopCount})}`));
   const side=document.createElement('span');side.className='metro-departure-side';side.append(textNode('span',travelTime(trip.duration)));side.insertAdjacentHTML('beforeend',icon('chevron'));
   button.append(mark,body,side);button.addEventListener('click',()=>{activeTrip=trip;renderTrip();$('#metro-trip-dialog').showModal();});list.append(button);
  }
  $('#metro-departures-more').hidden=matches.length<=limit;$('#metro-departures-more').textContent=t('Show more departures ({n} remaining)',{n:Math.max(0,matches.length-limit)});
  if($('#metro-geometry').open)renderMap();
 }
 function renderTrip(){
  if(!activeTrip||!catalog)return;const trip=activeTrip;
  $('#metro-trip-title').textContent=`${name(catalog.stationCodes[trip.calls[0][0]])} → ${name(catalog.stationCodes[trip.calls.at(-1)[0]])}`;
  $('#metro-trip-summary').textContent=`${t('Catalog trip')} ${trip.id} · ${travelTime(trip.duration)} · ${t('{n} stations',{n:trip.stopCount})}`;
  const list=$('#metro-trip-timeline');list.replaceChildren();
  trip.calls.forEach((call,i)=>{
   const id=catalog.stationCodes[call[0]],li=document.createElement('li');li.className=i===0?'metro-boarding':i===trip.calls.length-1?'metro-alighting':'';
   const dot=textNode('span',String(i+1),'metro-station-dot');dot.setAttribute('aria-hidden','true');
   const body=document.createElement('span');body.className='metro-trip-stop';body.append(textNode('strong',name(id)),textNode('small',id));
   const when=document.createElement('span');when.className='metro-trip-stop-times';
   if(i===0)when.append(textNode('small',t('Departure')),textNode('strong',clock(call[2],true)));
   else if(i===trip.calls.length-1)when.append(textNode('small',t('Arrival')),textNode('strong',clock(call[1],true)));
   else when.append(textNode('small',t('Arrival / departure')),textNode('span',`${clock(call[1],true)} / ${clock(call[2],true)}`));
   li.append(dot,body,when);list.append(li);
  });
 }
 const svgNS='http://www.w3.org/2000/svg';
 function svgEl(tag,attributes={}){const el=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attributes))el.setAttribute(k,v);return el;}
 function renderMap(){
  if(!catalog)return;const selected=routeSelection();if(!selected)return;
  const from=byId.get(selected.from),to=byId.get(selected.to),container=$('#metro-route-map');container.replaceChildren();
  const nearest=(points,s)=>points.reduce((best,p,i)=>{const d=(p[0]-s.latitude)**2+((p[1]-s.longitude)*Math.cos(s.latitude*Math.PI/180))**2;return d<best.d?{i,d}:best;},{i:0,d:Infinity});
  const shape=[...catalog.shapes].sort((a,b)=>nearest(a.points,from).d+nearest(a.points,to).d-nearest(b.points,from).d-nearest(b.points,to).d)[0];
  const points=shape.points,minLat=Math.min(...points.map(p=>p[0]),...stations.map(s=>s.latitude)),maxLat=Math.max(...points.map(p=>p[0]),...stations.map(s=>s.latitude));
  const minLon=Math.min(...points.map(p=>p[1]),...stations.map(s=>s.longitude)),maxLon=Math.max(...points.map(p=>p[1]),...stations.map(s=>s.longitude));
  const cos=Math.cos((minLat+maxLat)/2*Math.PI/180),scale=Math.min(360/((maxLon-minLon)*cos),330/(maxLat-minLat));
  const width=(maxLon-minLon)*cos*scale,height=(maxLat-minLat)*scale;
  const project=(lat,lon)=>[240-width/2+(lon-minLon)*cos*scale,25+(maxLat-lat)*scale];
  const coordinates=pts=>pts.map(p=>project(p[0],p[1]).map(v=>v.toFixed(2)).join(',')).join(' ');
  const svg=svgEl('svg',{viewBox:'0 0 480 390',role:'group','aria-label':t('Catalog route geometry with selected stations')});
  svg.append(svgEl('polyline',{points:coordinates(points),fill:'none',stroke:'#597287','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round',opacity:'.5'}));
  const start=nearest(points,from).i,end=nearest(points,to).i,part=points.slice(Math.min(start,end),Math.max(start,end)+1);
  svg.append(svgEl('polyline',{points:coordinates(part),fill:'none',stroke:'#11c7a5','stroke-width':6,'stroke-linecap':'round','stroke-linejoin':'round'}));
  const labels=new Set([stations[0].stop_id,stations.at(-1).stop_id,from.stop_id,to.stop_id]);
  for(const station of stations){
   const [x,y]=project(station.latitude,station.longitude),isFrom=station.stop_id===from.stop_id,isTo=station.stop_id===to.stop_id;
   const circle=svgEl('circle',{cx:x,cy:y,r:isFrom||isTo?6:3.5,fill:isFrom?'#16d4ad':isTo?'#ffbc2f':'#afc7d5',stroke:'#102638','stroke-width':1.5,tabindex:'0',role:'button','aria-label':name(station.stop_id)});
   const title=svgEl('title');title.textContent=name(station.stop_id);circle.append(title);
   const open=()=>window.dispatchEvent(new CustomEvent('neram:metro-station',{detail:station.stop_id}));circle.addEventListener('click',open);circle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});svg.append(circle);
   if(labels.has(station.stop_id)){const text=svgEl('text',{x:x+12,y:y+4,fill:isFrom?'#35dbb8':isTo?'#ffc747':'#a2b9c9','font-size':11,'font-family':'system-ui'});text.textContent=station.stop_id;svg.append(text);}
  }
  const north=svgEl('text',{x:22,y:28,fill:'#9cb6c7','font-size':11});north.textContent='N ↑';svg.append(north);
  container.append(svg,textNode('p',`${name(selected.from)} → ${name(selected.to)}`,'metro-map-caption'));
 }
 function routeChanged(){limit=12;activeTrip=null;render();if(!$('#metro-view').hidden)loadCatalog();}
 $('#metro-service').addEventListener('change',()=>{limit=12;render();});$('#metro-after').addEventListener('input',()=>{limit=12;render();});
 $('#metro-any-time').addEventListener('click',()=>{$('#metro-after').value='';limit=12;render();});
 $('#metro-schedule-retry').addEventListener('click',loadCatalog);
 $('#metro-departures-more').addEventListener('click',()=>{limit+=20;render();});
 $('#metro-geometry').addEventListener('toggle',()=>{if($('#metro-geometry').open)renderMap();});
 window.addEventListener('neram:metro-route',routeChanged);
 window.addEventListener('neram:metro-mode',e=>{if(e.detail==='metro')loadCatalog();});
 window.addEventListener('neram:preferences',()=>{render();renderTrip();if($('#metro-geometry').open)renderMap();});
 render();if(!$('#metro-view').hidden)loadCatalog();
})();
