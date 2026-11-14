import { META_PIXEL_ID } from './config';

// No trusted country is available in static HTML: resolve the hosting trace before loading Meta.
export const PIXEL_BOOTSTRAP = `(function(){
if(window.__metaBootstrapped)return;window.__metaBootstrapped=true;window.__metaAllowed=false;
function refused(){try{var a=JSON.parse(localStorage.getItem('cookie_consent_advertising')||'null');return navigator.globalPrivacyControl===true||(a&&a.choice)==='denied'||localStorage.getItem('cookie_consent')==='denied';}catch(e){return navigator.globalPrivacyControl===true;}}
if(refused())return;
var ac=window.AbortController?new AbortController():null;if(ac)setTimeout(function(){ac.abort()},2000);
fetch('/cdn-cgi/trace',ac?{signal:ac.signal}:{}).then(function(r){if(!r.ok)throw Error();return r.text();}).then(function(text){
var host=(text.match(/^h=(.+)$/m)||[])[1],country=(text.match(/^loc=([A-Z]{2})$/m)||[])[1];
var blocked='AT,BE,BG,HR,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,IS,LI,NO,GB,CH,RE,GP,MQ,GF,YT,MF,AX,CA,XX'.split(',');
if(!host||host.trim().toLowerCase().replace(/:\\d+$/,'')!==location.hostname||!country||blocked.indexOf(country)!==-1||refused())return;
window.__metaAllowed=true;
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.id='fb-pixel';t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
try{fbq('init',${JSON.stringify(META_PIXEL_ID)},{},{agent:'lovable'});fbq('track','PageView');}catch(e){}
window.dispatchEvent(new Event('meta-ready'));
}).catch(function(){});
})();`;
