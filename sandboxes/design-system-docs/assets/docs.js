/* Enviolo design system docs: shared shell and behaviour (nav, Display menu, copy, theme). Built from the former single-file site. */
(function(){
  var root=document.documentElement;
  /* ---------- Site shell: nav, toast and Display menu are built here so every page stays small ---------- */
  var BASE=new URL('../',document.currentScript.src).href;
  var PAGE=document.body.dataset.page||'overview';
  function href(p){return new URL(p,BASE).href;}
  var TOPICS=[
    {key:'foundations',label:'Foundations',items:[
      {path:'foundations/colour.html',label:'Colour',desc:'Enviolo ramp, gradients, neutrals, status'},
      {path:'foundations/typography.html',label:'Typography',desc:'Families, scale, weights, rules'},
      {path:'foundations/layout.html',label:'Layout',desc:'Grid, breakpoints, spacing, radius'}]},
    {key:'components',label:'Components',soon:true,items:[
      {path:'components/buttons.html',label:'Buttons',desc:'Hierarchy, variants and usage'}]}
  ];
  function pageKey(i){return i.path.replace(/\.html$/,'');}
  var CHEV='<svg class="ic nav-chev" data-icon="chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>';
  var navLinks='<a class="btn" data-variant="ghost" data-size="sm" href="'+href('index.html')+'" data-nav="overview">Overview</a>'+TOPICS.map(function(t){
    return '<a class="btn nav-trigger" data-variant="ghost" data-size="sm" href="'+href(t.items[0].path)+'" data-nav="'+t.key+'" data-menu="'+t.key+'" aria-expanded="false" aria-controls="navdd-'+t.key+'">'+t.label+CHEV+'</a>';}).join('');
  var navPanels=TOPICS.map(function(t){
    return '<div class="navdd" id="navdd-'+t.key+'" hidden>'+t.items.map(function(i){return '<a href="'+href(i.path)+'" data-sub="'+pageKey(i)+'"><b>'+i.label+'</b><span>'+i.desc+'</span></a>';}).join('')+(t.soon?'<div class="soon">More components soon</div>':'')+'</div>';}).join('');
  var BRAND=`<a class="brandmark" href="{{HOME}}" aria-label="Enviolo Design System, overview"><svg viewBox="0 0 496.06 112.06" fill="currentColor" aria-hidden="true"><path d="M276.93,32.01c-4.39,0-7.98,3.56-7.98,8.02v64.02c0,4.4,3.6,8.02,7.98,8.02s7.98-3.61,7.98-8.02V40.03c-.06-4.46-3.6-8.02-7.98-8.02Z"/><path d="M336.71,32.01c-21.99,0-39.87,17.9-39.87,40.03s17.82,40.03,39.87,40.03,39.87-17.9,39.87-40.03-17.88-40.03-39.87-40.03ZM336.65,96.09c-13.21,0-23.95-10.78-23.95-24.05s10.68-24.05,23.95-24.05,23.95,10.78,23.95,24.05-10.74,24.05-23.95,24.05Z"/><path d="M456.2,32.01c-21.99,0-39.87,17.9-39.87,40.03s17.82,40.03,39.87,40.03,39.87-17.9,39.87-40.03-17.82-40.03-39.87-40.03ZM456.2,96.09c-13.21,0-23.95-10.78-23.95-24.05s10.68-24.05,23.95-24.05,23.95,10.78,23.95,24.05-10.74,24.05-23.95,24.05Z"/><path d="M396.42,0c-4.39,0-7.98,3.56-7.98,8.02v96.03c0,4.4,3.54,8.02,7.98,8.02s7.98-3.61,7.98-8.02V8.02c0-4.4-3.54-8.02-7.98-8.02Z"/><path d="M131.47,32.01c-21.99,0-39.87,17.9-39.87,40.03v32.01c0,4.4,3.6,8.02,7.98,8.02s7.98-3.61,7.98-8.02v-32.01h0c0-13.27,10.68-23.99,23.9-23.99s23.9,10.73,23.95,23.99h0v32.01c0,4.4,3.6,8.02,7.98,8.02s7.98-3.61,7.98-8.02v-32.01c-.11-22.13-17.94-40.03-39.92-40.03Z"/><path d="M252.59,32.86c-3.94-1.98-8.72-.4-10.68,3.56l-24.74,49.68-24.74-49.68c-1.97-3.95-6.75-5.53-10.68-3.56s-5.57,6.77-3.6,10.73l31.88,64.02h0c1.29,2.6,3.99,4.4,7.14,4.4s5.79-1.81,7.14-4.46h0l31.88-64.02c1.91-3.9.34-8.69-3.6-10.67Z"/><path d="M71.52,81.18c-3.77-2.26-8.6-1.02-10.91,2.71-4.1,7.28-11.86,12.19-20.81,12.19-13.21,0-23.95-10.78-23.95-24.05s10.68-24.05,23.95-24.05c8.72,0,16.31,4.69,20.52,11.69l-20.47,12.36h39.87c0-22.07-17.82-40.03-39.87-40.03-22.04,0-39.87,17.9-39.87,40.03s17.82,40.03,39.87,40.03c14.73,0,27.61-8.02,34.53-19.98,2.14-3.84.9-8.69-2.87-10.9Z"/></svg><span>Design System</span></a>`.replace('{{HOME}}',href('index.html'));
  document.body.insertAdjacentHTML('afterbegin','<header class="topnav"><div class="topnav-inner">'+BRAND+'<nav class="mainnav" aria-label="Main">'+navLinks+'</nav></div>'+navPanels+'</header>');
  document.body.insertAdjacentHTML('beforeend',`<div class="toast" id="toast" role="status" hidden></div>`+`
<div class="settings" id="settings">
  <div class="menu" id="settingsMenu" role="menu" aria-label="Display settings" hidden>
    <div class="menu-label" id="lbl-theme">Theme</div>
    <div role="group" aria-labelledby="lbl-theme">
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="theme" data-value="system"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span>Match system</span><span class="def">Default</span></button>
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="theme" data-value="light"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span>Light</span></button>
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="theme" data-value="dark"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span>Dark</span></button>
    </div>
    <div class="menu-sep" role="separator"></div>
    <div class="menu-label" id="lbl-font">Font</div>
    <div role="group" aria-labelledby="lbl-font">
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="font" data-value="source"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span style=\"font-family:'Source Sans 3',sans-serif\">Source Sans 3</span><span class="def">Default</span><span class="sample" style=\"font-family:'Source Sans 3',sans-serif\">Aa</span></button>
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="font" data-value="urbanist"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span style=\"font-family:'Urbanist',sans-serif\">Urbanist</span><span class="sample" style=\"font-family:'Urbanist',sans-serif\">Aa</span></button>
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="font" data-value="plex"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span style=\"font-family:'IBM Plex Sans',sans-serif\">IBM Plex Sans</span><span class="sample" style=\"font-family:'IBM Plex Sans',sans-serif\">Aa</span></button>
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="font" data-value="system"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span style="font-family:system-ui,sans-serif">System</span><span class="sample" style="font-family:system-ui,sans-serif">Aa</span></button>
    </div>
    <div class="menu-sep" role="separator"></div>
    <div class="menu-label" id="lbl-icons">Icons</div>
    <div role="group" aria-labelledby="lbl-icons">
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="icons" data-value="tabler"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span>Tabler</span><span class="def">Default</span><span class="sample"><svg class="ic" data-icon="settings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-set="tabler"></svg></span></button>
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="icons" data-value="lucide"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span>Lucide</span><span class="sample"><svg class="ic" data-icon="settings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-set="lucide"></svg></span></button>
    </div>
    <div class="menu-sep" role="separator"></div>
    <div class="menu-label" id="lbl-mono">Code font</div>
    <div role="group" aria-labelledby="lbl-mono">
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="mono" data-value="sourcecode"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span style="font-family:'Source Code Pro',monospace;font-size:.86rem">Source Code Pro</span><span class="def">Default</span></button>
      <button class="menu-item" role="menuitemradio" aria-checked="false" data-group="mono" data-value="system"><svg class="ic check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.86rem">System mono</span></button>
    </div>
    <div class="menu-sep" role="separator"></div>
    <div class="menu-label" id="lbl-ramp">Mode settings</div>
    <div role="group" aria-labelledby="lbl-ramp">
      <button class="menu-item has-sub" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="subMenu" data-sub="light"><svg class="ic sub-chev" data-icon="chevron-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span>Light mode</span><span class="sample sub-val" data-val="light"></span></button>
      <button class="menu-item has-sub" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="subMenu" data-sub="dark"><svg class="ic sub-chev" data-icon="chevron-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span>Dark mode</span><span class="sample sub-val" data-val="dark"></span></button>
    </div>
  </div>
  <div class="menu submenu" id="subMenu" role="menu" aria-labelledby="subLabel" hidden></div>
  <button class="btn settings-trigger" data-variant="outline" data-size="icon-sm" id="modeToggle" type="button" aria-label="Switch to dark mode" title="Switch to dark mode"><svg class="ic" data-icon="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg></button>
  <button class="btn settings-trigger" data-variant="outline" data-size="sm" id="settingsTrigger" aria-haspopup="menu" aria-expanded="false" aria-controls="settingsMenu">
    <svg class="ic" data-icon="sliders" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>Display
    <svg class="ic chev" data-icon="chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>
  </button>
</div>
`);
  (function(){
    var top=PAGE.split('/')[0];
    document.querySelectorAll('.mainnav [data-nav]').forEach(function(a){ if(a.dataset.nav===top) a.setAttribute('aria-current','page'); });
    document.querySelectorAll('.navdd a').forEach(function(a){ if(a.dataset.sub===PAGE) a.setAttribute('aria-current','page'); });
    document.querySelectorAll('nav[data-subnav]').forEach(function(n){
      var t=TOPICS.filter(function(x){return x.key===n.dataset.subnav;})[0]; if(!t) return;
      n.innerHTML=t.items.map(function(i){return '<a class="btn" data-size="sm" href="'+href(i.path)+'" data-sub="'+pageKey(i)+'"'+(pageKey(i)===PAGE?' aria-current="page"':'')+'>'+i.label+'</a>';}).join('');
    });
  })();
  var FONTS={source:'"Source Sans 3"',urbanist:'"Urbanist"',plex:'"IBM Plex Sans"',system:'system-ui'};
  var MONO={system:'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',sourcecode:'"Source Code Pro", ui-monospace, monospace'};
  var RAMPS={"slate": ["oklch(98.4% 0.003 247.858)", "oklch(96.8% 0.007 247.896)", "oklch(92.9% 0.013 255.508)", "oklch(86.9% 0.022 252.894)", "oklch(70.4% 0.04 256.788)", "oklch(55.4% 0.046 257.417)", "oklch(44.6% 0.043 257.281)", "oklch(37.2% 0.044 257.287)", "oklch(27.9% 0.041 260.031)", "oklch(20.8% 0.042 265.755)", "oklch(12.9% 0.042 264.695)"], "gray": ["oklch(98.5% 0.002 247.839)", "oklch(96.7% 0.003 264.542)", "oklch(92.8% 0.006 264.531)", "oklch(87.2% 0.01 258.338)", "oklch(70.7% 0.022 261.325)", "oklch(55.1% 0.027 264.364)", "oklch(44.6% 0.03 256.802)", "oklch(37.3% 0.034 259.733)", "oklch(27.8% 0.033 256.848)", "oklch(21% 0.034 264.665)", "oklch(13% 0.028 261.692)"], "zinc": ["oklch(98.5% 0 none)", "oklch(96.7% 0.001 286.375)", "oklch(92% 0.004 286.32)", "oklch(87.1% 0.006 286.286)", "oklch(70.5% 0.015 286.067)", "oklch(55.2% 0.016 285.938)", "oklch(44.2% 0.017 285.786)", "oklch(37% 0.013 285.805)", "oklch(27.4% 0.006 286.033)", "oklch(21% 0.006 285.885)", "oklch(14.1% 0.005 285.823)"], "neutral": ["oklch(98.5% 0 none)", "oklch(97% 0 none)", "oklch(92.2% 0 none)", "oklch(87% 0 none)", "oklch(70.8% 0 none)", "oklch(55.6% 0 none)", "oklch(43.9% 0 none)", "oklch(37.1% 0 none)", "oklch(26.9% 0 none)", "oklch(20.5% 0 none)", "oklch(14.5% 0 none)"], "stone": ["oklch(98.5% 0.001 106.423)", "oklch(97% 0.001 106.424)", "oklch(92.3% 0.003 48.717)", "oklch(86.9% 0.005 56.366)", "oklch(70.9% 0.01 56.259)", "oklch(55.3% 0.013 58.071)", "oklch(44.4% 0.011 73.639)", "oklch(37.4% 0.01 67.558)", "oklch(26.8% 0.007 34.298)", "oklch(21.6% 0.006 56.043)", "oklch(14.7% 0.004 49.25)"], "mauve": ["oklch(98.5% 0 none)", "oklch(96% 0.003 325.6)", "oklch(92.2% 0.005 325.62)", "oklch(86.5% 0.012 325.68)", "oklch(71.1% 0.019 323.02)", "oklch(54.2% 0.034 322.5)", "oklch(43.5% 0.029 321.78)", "oklch(36.4% 0.029 323.89)", "oklch(26.3% 0.024 320.12)", "oklch(21.2% 0.019 322.12)", "oklch(14.5% 0.008 326)"], "olive": ["oklch(98.8% 0.003 106.5)", "oklch(96.6% 0.005 106.5)", "oklch(93% 0.007 106.5)", "oklch(88% 0.011 106.6)", "oklch(73.7% 0.021 106.9)", "oklch(58% 0.031 107.3)", "oklch(46.6% 0.025 107.3)", "oklch(39.4% 0.023 107.4)", "oklch(28.6% 0.016 107.4)", "oklch(22.8% 0.013 107.4)", "oklch(15.3% 0.006 107.1)"], "mist": ["oklch(98.7% 0.002 197.1)", "oklch(96.3% 0.002 197.1)", "oklch(92.5% 0.005 214.3)", "oklch(87.2% 0.007 219.6)", "oklch(72.3% 0.014 214.4)", "oklch(56% 0.021 213.5)", "oklch(45% 0.017 213.2)", "oklch(37.8% 0.015 216)", "oklch(27.5% 0.011 216.9)", "oklch(21.8% 0.008 223.9)", "oklch(14.8% 0.004 228.8)"], "taupe": ["oklch(98.6% 0.002 67.8)", "oklch(96% 0.002 17.2)", "oklch(92.2% 0.005 34.3)", "oklch(86.8% 0.007 39.5)", "oklch(71.4% 0.014 41.2)", "oklch(54.7% 0.021 43.1)", "oklch(43.8% 0.017 39.3)", "oklch(36.7% 0.016 35.7)", "oklch(26.8% 0.011 36.5)", "oklch(21.4% 0.009 43.1)", "oklch(14.7% 0.004 49.3)"]};
  var RAMP_LABELS={"slate": "Slate", "gray": "Gray", "zinc": "Zinc", "neutral": "Neutral", "stone": "Stone", "mauve": "Mauve", "olive": "Olive", "mist": "Mist", "taupe": "Taupe"};
  var STEPS=[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  var ICONS={
    lucide:{
      'chevron-down':'<path d="m6 9 6 6 6-6"/>',
      sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
      moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
      check:'<path d="M20 6 9 17l-5-5"/>',
      'chevron-up':'<path d="m18 15-6-6-6 6"/>',
      'chevron-left':'<path d="m15 18-6-6 6-6"/>',
      more:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
      download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
      share:'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>',
      search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
      sliders:'<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
      trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
      settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
      copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'
    },
    tabler:{
      'chevron-down':'<path d="M6 9l6 6l6 -6"/>',
      sun:'<path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>',
      moon:'<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>',
      check:'<path d="M5 12l5 5l10 -10"/>',
      'chevron-up':'<path d="M6 15l6 -6l6 6"/>',
      'chevron-left':'<path d="M15 6l-6 6l6 6"/>',
      more:'<path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>',
      download:'<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/>',
      share:'<path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"/><path d="M12 14v-11"/><path d="M9 6l3 -3l3 3"/>',
      search:'<path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/>',
      plus:'<path d="M12 5l0 14"/><path d="M5 12l14 0"/>',
      sliders:'<path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 6l8 0"/><path d="M16 6l4 0"/><path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 12l2 0"/><path d="M10 12l10 0"/><path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 18l11 0"/><path d="M19 18l1 0"/>',
      trash:'<path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>',
      settings:'<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>',
      copy:'<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/>'
    }
  };
  function renderIcons(){
    document.querySelectorAll('svg[data-icon]').forEach(function(el){
      var set=el.getAttribute('data-set')||state.icons;
      el.innerHTML=(ICONS[set]&&ICONS[set][el.getAttribute('data-icon')])||'';
    });
  }


  var MODE_OPTS={
    light:{
      bg:{white:['White','#FFFFFF',null],neutral:['Neutral 50','var(--l-50)','var(--l-50)'],ivory:['Ivory tint','color-mix(in srgb,var(--enviolo-50) 35%,#fff)','color-mix(in srgb,var(--enviolo-50) 35%,#fff)']},
      accent:{neutral:['Neutral 100','var(--l-100)',null],ivory:['Ivory','color-mix(in srgb,var(--enviolo-50) 70%,#fff)','color-mix(in srgb,var(--enviolo-50) 70%,#fff)'],coral:['Coral tint','color-mix(in srgb,var(--enviolo-200) 18%,#fff)','color-mix(in srgb,var(--enviolo-200) 18%,transparent)']},
      focus:{copper:['Copper','var(--enviolo-300)',null,'3.05:1'],coral:['Coral','var(--enviolo-200)','var(--enviolo-200)','2.3:1 · low'],clay:['Clay','var(--enviolo-400)','var(--enviolo-400)','4.15:1']}
    },
    dark:{
      bg:{neutral:['Neutral 950','var(--d-950)',null],pearl:['Pearl Black','var(--enviolo-950)','var(--enviolo-950)'],midnight:['Midnight','var(--enviolo-900)','var(--enviolo-900)']},
      accent:{neutral:['Neutral 800','var(--d-800)',null],nightfall:['Nightfall','var(--enviolo-800)','var(--enviolo-800)'],coral:['Coral tint','color-mix(in srgb,var(--enviolo-200) 22%,#05191E)','color-mix(in srgb,var(--enviolo-200) 20%,transparent)']},
      focus:{coral:['Coral','var(--enviolo-200)',null,'8.6:1'],ivory:['Ivory','var(--enviolo-50)','var(--enviolo-50)','16:1'],apricot:['Apricot','var(--enviolo-100)','var(--enviolo-100)','13:1']}
    }
  };
  var state={theme:'system',font:'source',icons:'tabler',mono:'sourcecode',rampLight:'taupe',rampDark:'mist',bgLight:'white',bgDark:'neutral',accentLight:'neutral',accentDark:'neutral',focusLight:'copper',focusDark:'coral'};
  try{var saved=JSON.parse(localStorage.getItem('enviolo-display')||'{}'); if(saved.theme) state.theme=saved.theme; if(saved.font&&FONTS[saved.font]) state.font=saved.font; if(saved.icons==='lucide'||saved.icons==='tabler') state.icons=saved.icons; if(saved.mono&&MONO[saved.mono]) state.mono=saved.mono; if(saved.rampLight&&RAMPS[saved.rampLight]) state.rampLight=saved.rampLight; if(saved.rampDark&&RAMPS[saved.rampDark]) state.rampDark=saved.rampDark; if(saved.darkbg==='pearl') state.bgDark='pearl'; ['bg','accent','focus'].forEach(function(t){['Light','Dark'].forEach(function(m){var k=t+m; if(saved[k]&&MODE_OPTS[m.toLowerCase()][t][saved[k]]) state[k]=saved[k];});});}catch(e){}
  var settings=document.getElementById('settings');
  var trigger=document.getElementById('settingsTrigger'), menu=document.getElementById('settingsMenu'), sub=document.getElementById('subMenu');
  var radios=[].slice.call(menu.querySelectorAll('.menu-item[data-group]'));
  var subTriggers=[].slice.call(menu.querySelectorAll('.has-sub'));
  var openSubFor=null;

  function swatch(r){var v=RAMPS[r];return '<i style="background:'+v[1]+'"></i><i style="background:'+v[5]+'"></i><i style="background:'+v[9]+'"></i>';}
  function iconSvg(n,c){return '<svg class="'+(c||'ic')+'" data-icon="'+n+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>';}

  var modeToggle=document.getElementById('modeToggle');
  var darkMQ=window.matchMedia('(prefers-color-scheme: dark)');
  function isDark(){return state.theme==='dark'||(state.theme==='system'&&darkMQ.matches);}
  function syncModeToggle(){
    var d=isDark(), label=d?'Switch to light mode':'Switch to dark mode';
    modeToggle.querySelector('svg').setAttribute('data-icon',d?'sun':'moon');
    modeToggle.setAttribute('aria-label',label); modeToggle.setAttribute('title',label);
  }
  modeToggle.addEventListener('click',function(){state.theme=isDark()?'light':'dark';apply();});
  if(darkMQ.addEventListener) darkMQ.addEventListener('change',function(){if(state.theme==='system'){syncModeToggle();renderIcons();markStatus();markNeutrals();}});
  function apply(){
    if(state.theme==='system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme',state.theme);
    root.style.setProperty('--font',FONTS[state.font]+', ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif');
    root.style.setProperty('--font-mono',MONO[state.mono]);
    RAMPS[state.rampLight].forEach(function(v,i){root.style.setProperty('--l-'+STEPS[i],v);});
    RAMPS[state.rampDark].forEach(function(v,i){root.style.setProperty('--d-'+STEPS[i],v);});
    [['--light-bg','light','bg','bgLight'],['--dark-bg','dark','bg','bgDark'],['--light-accent','light','accent','accentLight'],['--dark-accent','dark','accent','accentDark'],['--light-ring','light','focus','focusLight'],['--dark-ring','dark','focus','focusDark']].forEach(function(x){
      var v=MODE_OPTS[x[1]][x[2]][state[x[3]]][2]; if(v) root.style.setProperty(x[0],v); else root.style.removeProperty(x[0]);
    });
    radios.forEach(function(i){i.setAttribute('aria-checked',String(state[i.dataset.group]===i.dataset.value));});
    menu.querySelectorAll('.sub-val').forEach(function(el){
      var m=el.dataset.val, r=m==='light'?state.rampLight:state.rampDark;
      var bg=MODE_OPTS[m].bg[state[m==='light'?'bgLight':'bgDark']], ac=MODE_OPTS[m].accent[state[m==='light'?'accentLight':'accentDark']], fc=MODE_OPTS[m].focus[state[m==='light'?'focusLight':'focusDark']];
      el.innerHTML='<span>'+RAMP_LABELS[r]+'</span><span class="swatch" style="display:inline-flex"><i style="background:'+bg[1]+'" title="Background"></i><i style="background:'+ac[1]+'" title="Accent"></i>'+swatch(r)+'</span>';
    });
    if(openSubFor) buildSub(openSubFor,false);
    syncModeToggle();
    renderDocs();
    renderIcons();
    try{localStorage.setItem('enviolo-display',JSON.stringify(state));}catch(e){}
  }

  function buildSub(mode,focus){
    var sfx=mode==='light'?'Light':'Dark';
    var DEF={bgLight:'white',bgDark:'neutral',accentLight:'neutral',accentDark:'neutral',focusLight:'copper',focusDark:'coral',rampLight:'taupe',rampDark:'mist'};
    function defFirst(keys,key){return keys.slice().sort(function(a,b){return (b===DEF[key])-(a===DEF[key]);});} /* default option always first */
    function item(key,val,label,sw,checked){return '<button class="menu-item" role="menuitemradio" aria-checked="'+checked+'" data-key="'+key+'" data-value="'+val+'">'+iconSvg('check','ic check')+'<span>'+label+'</span>'+(DEF[key]===val?'<span class="def">Default</span>':'')+'<span class="sample swatch">'+sw+'</span></button>';}
    var html='<button class="menu-item back" role="menuitem" data-back="1">'+iconSvg('chevron-left')+'<span>Back</span></button>'+
      '<div class="menu-label" id="subLabel">'+sfx+' mode · Background</div>';
    defFirst(Object.keys(MODE_OPTS[mode].bg),'bg'+sfx).forEach(function(k){var o=MODE_OPTS[mode].bg[k];html+=item('bg'+sfx,k,o[0],'<i style="background:'+o[1]+'"></i>',state['bg'+sfx]===k);});
    html+='<div class="menu-sep" role="separator"></div><div class="menu-label">Accent · hover and muted</div>';
    defFirst(Object.keys(MODE_OPTS[mode].accent),'accent'+sfx).forEach(function(k){var o=MODE_OPTS[mode].accent[k];html+=item('accent'+sfx,k,o[0],'<i style="background:'+o[1]+'"></i>',state['accent'+sfx]===k);});
    html+='<div class="menu-sep" role="separator"></div><div class="menu-label">Focus · active fields</div>';
    defFirst(Object.keys(MODE_OPTS[mode].focus),'focus'+sfx).forEach(function(k){var o=MODE_OPTS[mode].focus[k];html+=item('focus'+sfx,k,o[0]+' <span class="def">'+o[3]+'</span>','<i style="background:'+o[1]+'"></i>',state['focus'+sfx]===k);});
    html+='<div class="menu-sep" role="separator"></div><div class="menu-label">Neutrals</div>';
    defFirst(Object.keys(RAMPS),'ramp'+sfx).forEach(function(r){html+=item('ramp'+sfx,r,RAMP_LABELS[r],swatch(r),state['ramp'+sfx]===r);});
    var ae=document.activeElement, prev=ae&&sub.contains(ae)?[ae.dataset.key,ae.dataset.value]:null;
    sub.innerHTML=html;
    renderIcons();
    if(prev){var f=sub.querySelector('[data-key="'+prev[0]+'"][data-value="'+prev[1]+'"]');if(f)f.focus();}
    if(focus){(sub.querySelector('[aria-checked="true"]')||sub.querySelector('[data-key]')).focus();}
  }
  function openSub(btn,focus){
    var mode=btn.dataset.sub; openSubFor=mode;
    subTriggers.forEach(function(t){t.setAttribute('aria-expanded',String(t===btn));});
    buildSub(mode,false);
    sub.hidden=false;
    sub.style.minHeight=window.matchMedia('(max-width:560px)').matches?menu.offsetHeight+'px':'';
    // align submenu bottom with the trigger item's bottom, kept inside viewport
    var sRect=settings.getBoundingClientRect(), bRect=btn.getBoundingClientRect();
    sub.style.top='auto';
    var bottom=sRect.bottom-bRect.bottom-6;
    sub.style.bottom=bottom+'px';
    var r=sub.getBoundingClientRect();
    if(r.top<8){sub.style.bottom=(bottom-(8-r.top))+'px';}
    if(focus)(sub.querySelector('[aria-checked="true"]')||sub.querySelector('[data-ramp]')).focus();
  }
  function closeSub(focusBack){
    if(sub.hidden) return;
    sub.hidden=true;
    var t=menu.querySelector('.has-sub[aria-expanded="true"]');
    subTriggers.forEach(function(x){x.setAttribute('aria-expanded','false');});
    openSubFor=null;
    if(focusBack&&t)t.focus();
  }
  function open(){menu.hidden=false;trigger.setAttribute('aria-expanded','true');(menu.querySelector('[aria-checked="true"]')||radios[0]).focus();}
  function close(focus){closeSub(false);menu.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}

  trigger.addEventListener('click',function(){menu.hidden?open():close(false);});
  radios.forEach(function(i){i.addEventListener('click',function(){state[i.dataset.group]=i.dataset.value;closeSub(false);apply();});});
  subTriggers.forEach(function(t){
    t.addEventListener('click',function(){ if(!sub.hidden&&openSubFor===t.dataset.sub) closeSub(false); else openSub(t,true); });
    t.addEventListener('mouseenter',function(){ if(window.matchMedia('(hover:hover) and (min-width:561px)').matches) openSub(t,false); });
  });
  radios.forEach(function(i){i.addEventListener('mouseenter',function(){ if(window.matchMedia('(hover:hover)').matches) closeSub(false); });});
  sub.addEventListener('click',function(e){
    var b=e.target.closest('.menu-item'); if(!b) return;
    if(b.dataset.back){closeSub(true);return;}
    if(!b.dataset.key) return;
    state[b.dataset.key]=b.dataset.value;
    // preview the mode being edited
    if(state.theme==='system'){var dark=window.matchMedia('(prefers-color-scheme: dark)').matches; if((openSubFor==='dark')!==dark){state.theme=openSubFor;}}
    else if(state.theme!==openSubFor){state.theme=openSubFor;}
    apply();
  });

  function navKeys(container,e,onLeft,onRight){
    var list=[].slice.call(container.querySelectorAll('.menu-item')).filter(function(x){return x.offsetParent!==null;});
    var idx=list.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();list[(idx+1)%list.length].focus();}
    else if(e.key==='ArrowUp'){e.preventDefault();list[(idx-1+list.length)%list.length].focus();}
    else if(e.key==='Home'){e.preventDefault();list[0].focus();}
    else if(e.key==='End'){e.preventDefault();list[list.length-1].focus();}
    else if(e.key==='ArrowLeft'&&onLeft){e.preventDefault();onLeft();}
    else if(e.key==='ArrowRight'&&onRight){e.preventDefault();onRight();}
  }
  menu.addEventListener('keydown',function(e){
    var cur=document.activeElement;
    if(e.key==='Escape'){close(true);return;}
    if(e.key==='Tab'){close(false);return;}
    navKeys(menu,e,function(){ if(cur.classList.contains('has-sub')) openSub(cur,true); },null);
  });
  sub.addEventListener('keydown',function(e){
    if(e.key==='Escape'){e.stopPropagation();closeSub(true);return;}
    if(e.key==='Tab'){close(false);return;}
    navKeys(sub,e,null,function(){closeSub(true);});
  });
  document.addEventListener('click',function(e){if(!menu.hidden&&e.composedPath().indexOf(settings)===-1)close(false);});
  apply();
  var aboutToggle=document.getElementById('aboutToggle'), aboutPanel=document.getElementById('aboutPanel');
  if(aboutToggle) aboutToggle.addEventListener('click',function(){var o=aboutToggle.getAttribute('aria-expanded')==='true';aboutToggle.setAttribute('aria-expanded',String(!o));aboutPanel.hidden=o;});
  document.querySelectorAll('.seg').forEach(function(g){
    g.addEventListener('click',function(ev){
      var b=ev.target.closest('button'); if(!b) return;
      g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false')});
      b.setAttribute('aria-pressed','true');
    });
  });

  document.addEventListener('click',function(e){var a=e.target.closest('a[href="#"]'); if(a) e.preventDefault();});

  /* ---------- Docs: live bits ---------- */
  /* Which neutral steps components use, per mode. Mirrors tokens.css; labels are short, tokens are the full list. */
  function markNeutrals(){
    var mode=isDark()?'dark':'light';
    var ROLES={
      light:{50:[['Card'],'--card, --primary-foreground'],100:[['Muted','Accent'],'--muted, --secondary, --accent'],200:[['Border'],'--border, --input, --secondary-hover'],500:[['Muted text'],'--muted-foreground'],700:[['Primary','hover'],'--primary-hover'],900:[['Primary'],'--primary, --secondary-foreground'],950:[['Text'],'--foreground']},
      dark:{50:[['Text','Primary'],'--foreground, --primary, --secondary-foreground'],200:[['Primary','hover'],'--primary-hover'],400:[['Muted text'],'--muted-foreground'],700:[['Secondary','hover'],'--secondary-hover'],800:[['Border','Accent'],'--border, --input, --secondary, --accent'],900:[['Card','Muted'],'--card, --muted, --popover, --primary-foreground'],950:[['Background'],'--background']}
    }[mode];
    [['neutralLight','light'],['neutralDark','dark']].forEach(function(r){
      var row=document.getElementById(r[0]); if(!row) return;
      [].slice.call(row.querySelectorAll('button')).forEach(function(b){
        if(!b.dataset.baseTitle){b.dataset.baseTitle=b.title;b.dataset.baseLabel=b.getAttribute('aria-label');}
        var step=parseInt(b.dataset.baseTitle,10), role=r[1]===mode?ROLES[step]:null;
        b.classList.toggle('used',!!role);
        b.innerHTML=role?role[0].map(function(t){return '<span>'+t+'</span>';}).join(''):'';
        b.style.color='';
        if(role){var hx=toHex(b), rr=parseInt(hx.substr(1,2),16), gg=parseInt(hx.substr(3,2),16), bb=parseInt(hx.substr(5,2),16); b.style.color=(0.299*rr+0.587*gg+0.114*bb)>150?'#1c1917':'#FFFFFF';}
        b.title=b.dataset.baseTitle+(role?' · '+role[1]:'');
        b.setAttribute('aria-label',b.dataset.baseLabel+(role?', used for '+role[1]+' in '+mode+' mode':''));
      });
    });
    var key=document.getElementById('neutralKey');
    if(key){
      key.innerHTML='Labelled for <b>'+mode+' mode</b>, the steps components use: '+Object.keys(ROLES).map(function(k){return '<b>'+k+'</b> <code>'+ROLES[k][1].split(', ').join('</code> <code>')+'</code>';}).join(' · ')+(mode==='light'?' · <code>--background</code> is white by default.':'.')+' Labels follow the Display theme.';
    }
  }
  function markStatus(){
    var mode=isDark()?'dark':'light', m=mode==='dark'?{bg:950,text:300}:{bg:50,text:700}; /* --{status}-bg / -text steps, design.md 4.3 */
    document.querySelectorAll('.status-block .neutral-row button').forEach(function(b){
      if(!b.dataset.base) b.dataset.base=b.getAttribute('aria-label');
      var step=parseInt(b.title,10), role=step===m.bg?'Bg':(step===m.text?'Text':'');
      b.classList.toggle('used',!!role);
      b.innerHTML=role?'<span>'+role+'</span>':'';
      b.style.color='';
      if(role){var hx=toHex(b), r=parseInt(hx.substr(1,2),16), g=parseInt(hx.substr(3,2),16), bl=parseInt(hx.substr(5,2),16); b.style.color=(0.299*r+0.587*g+0.114*bl)>150?'#1c1917':'#FFFFFF';}
      b.setAttribute('aria-label',b.dataset.base+(role?(role==='Bg'?', background colour':', text colour')+' in '+mode+' mode':''));
    });
    var key=document.getElementById('statusKey');
    if(key) key.innerHTML='Outlined for <b>'+mode+' mode</b>: <b>Bg</b> is step '+m.bg+' (<code>--{status}-bg</code>), <b>Text</b> is step '+m.text+' (<code>--{status}-text</code>). They follow the Display theme.';
  }
  function renderDocs(){
    function row(id,titleId,key,mode){
      var el=document.getElementById(id); if(!el) return;
      el.innerHTML=RAMPS[state[key]].map(function(v,i){return '<button type="button" data-copy-color style="background:'+v+'" title="'+STEPS[i]+' · '+v+' · select to copy hex" aria-label="Copy '+RAMP_LABELS[state[key]]+' '+STEPS[i]+' hex"></button>';}).join('');
      document.getElementById(titleId).innerHTML=mode+' <small>'+RAMP_LABELS[state[key]]+'</small>';
    }
    row('neutralLight','nl-title','rampLight','Light mode');
    row('neutralDark','nd-title','rampDark','Dark mode');
    markStatus();
    markNeutrals();
    var fontNames={source:'Source Sans 3',urbanist:'Urbanist',plex:'IBM Plex Sans',system:'System font'};
    var monoNames={system:'System mono',sourcecode:'Source Code Pro'};
    document.querySelectorAll('[data-font-label]').forEach(function(el){el.textContent=fontNames[state.font];});
    document.querySelectorAll('[data-mono-label]').forEach(function(el){el.textContent=monoNames[state.mono];});
  }

  var toast=document.getElementById('toast'), toastT;
  function showToast(msg){toast.textContent=msg;toast.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){toast.hidden=true;},1600);}
  function toHex(el){
    try{
      var c=getComputedStyle(el).backgroundColor, x=document.createElement('canvas').getContext('2d');
      x.fillStyle='#000'; x.fillStyle=c; x.fillRect(0,0,1,1);
      var d=x.getImageData(0,0,1,1).data;
      return '#'+[0,1,2].map(function(i){return ('0'+d[i].toString(16)).slice(-2);}).join('').toUpperCase();
    }catch(e){return getComputedStyle(el).backgroundColor;}
  }
  var TYPE_PROPS=['font-family','font-size','font-weight','line-height','letter-spacing'];
  function copyValue(b){
    if(b.hasAttribute('data-copy-color')) return toHex(b.querySelector('i')||b);
    if(b.hasAttribute('data-copy-style')){
      var st=b.closest('.scale-row').querySelector('.sample').style;
      return TYPE_PROPS.filter(function(k){return st.getPropertyValue(k);}).map(function(k){return k+': '+st.getPropertyValue(k)+';';}).join('\n');
    }
    if(b.hasAttribute('data-copy-font')){
      var v=getComputedStyle(root).getPropertyValue(b.dataset.copyFont).trim();
      return 'font-family: '+v+';';
    }
    return b.dataset.copy||b.dataset.copyCss;
  }
  function writeClipboard(v,done,fail){
    function fallback(){
      try{var t=document.createElement('textarea');t.value=v;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();var ok=document.execCommand('copy');document.body.removeChild(t);ok?done():fail();}catch(e){fail();}
    }
    try{ if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done,fallback); else fallback(); }catch(e){fallback();}
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-copy],[data-copy-color],[data-copy-css],[data-copy-style],[data-copy-font]'); if(!b) return;
    var v=copyValue(b); if(!v) return;
    var label=v.length>34||v.indexOf('\n')>-1?(b.dataset.copyLabel||'CSS'):v;
    writeClipboard(v,function(){showToast('Copied '+label);},function(){showToast('Copy failed');});
  });

  var bpName=document.getElementById('bpName'), bpWidth=document.getElementById('bpWidth');
  function bp(){if(!bpName) return; var w=window.innerWidth;bpName.textContent=w<600?'Mobile':(w<880?'Tablet':'Desktop');bpWidth.textContent=w+'px';}
  window.addEventListener('resize',bp); bp();

  var ovBtn=document.getElementById('overlayToggle'), ov=document.getElementById('gridOverlay');
  if(ovBtn) ovBtn.addEventListener('click',function(){var on=ovBtn.getAttribute('aria-pressed')!=='true';ovBtn.setAttribute('aria-pressed',String(on));ov.hidden=!on;ovBtn.textContent=on?'Hide grid overlay':'Show grid overlay';});

  /* ---------- Top nav dropdowns ---------- */
  var topnav=document.querySelector('.topnav'), navTriggers=[].slice.call(document.querySelectorAll('.nav-trigger')), openDD=null, ddTimer;
  function ddPanel(t){return document.getElementById('navdd-'+t.dataset.menu);}
  function placeDD(t,p){
    var tr=t.getBoundingClientRect(), nr=topnav.getBoundingClientRect();
    p.style.top=(tr.bottom-nr.top+6)+'px';
    var w=Math.min(280,window.innerWidth-16), left=Math.min(tr.left,window.innerWidth-w-8);
    p.style.left=Math.max(8,left)-nr.left+'px';
  }
  function showDD(t,focus){
    clearTimeout(ddTimer);
    if(openDD&&openDD!==t) hideDD(false);
    var p=ddPanel(t); placeDD(t,p); p.hidden=false; t.setAttribute('aria-expanded','true'); openDD=t;
    if(focus){var f=p.querySelector('a'); if(f) f.focus();}
  }
  function hideDD(focusBack){
    if(!openDD) return; var t=openDD; ddPanel(t).hidden=true; t.setAttribute('aria-expanded','false'); openDD=null;
    if(focusBack) t.focus();
  }
  var canHover=window.matchMedia('(hover:hover) and (pointer:fine)');
  navTriggers.forEach(function(t){
    var p=ddPanel(t);
    t.addEventListener('click',function(){ hideDD(false); });
    t.addEventListener('keydown',function(e){ if(e.key==='ArrowDown'){e.preventDefault();showDD(t,true);} else if(e.key==='Escape'){hideDD(true);} });
    [t,p].forEach(function(el){
      el.addEventListener('mouseenter',function(){ if(canHover.matches) showDD(t,false); });
      el.addEventListener('mouseleave',function(){ if(canHover.matches){clearTimeout(ddTimer);ddTimer=setTimeout(function(){if(openDD===t)hideDD(false);},160);} });
    });
    p.addEventListener('keydown',function(e){
      var links=[].slice.call(p.querySelectorAll('a')), i=links.indexOf(document.activeElement);
      if(e.key==='ArrowDown'){e.preventDefault();links[(i+1)%links.length].focus();}
      else if(e.key==='ArrowUp'){e.preventDefault();links[(i-1+links.length)%links.length].focus();}
      else if(e.key==='Escape'){e.preventDefault();hideDD(true);}
      else if(e.key==='Tab'){hideDD(false);}
    });
    p.addEventListener('click',function(e){ if(e.target.closest('a')) hideDD(false); });
  });
  document.addEventListener('click',function(e){ if(openDD&&!e.target.closest('.nav-trigger')&&!e.target.closest('.navdd')) hideDD(false); });
  window.addEventListener('resize',function(){ if(openDD) placeDD(openDD,ddPanel(openDD)); });
})();
