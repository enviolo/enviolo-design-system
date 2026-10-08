/* Applies the saved theme before first paint, so pages don't flash light in dark mode. Full logic lives in docs.js. */
(function(){try{var t=(JSON.parse(localStorage.getItem('enviolo-display')||'{}')).theme||'system';if(t!=='system')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
