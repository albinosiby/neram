'use strict';
window.NeramPrefs = (() => {
 const words = {
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
