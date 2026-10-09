/* Enviolo design system docs: shared shell and behaviour (nav, copy, page behaviour; the Display menu is display.js). Built from the former single-file site. */
(function(){
  var root=document.documentElement;
  /* The Display personalizer lives in display.js (loaded first); the docs pages read its state */
  var D=window.EnvioloDisplay, state=D.state, isDark=D.isDark, STEPS=D.STEPS, RAMPS=D.RAMPS, RAMP_LABELS=D.RAMP_LABELS;
  /* ---------- Site shell: nav and toast are built here so every page stays small ---------- */
  var PAGE=document.body.dataset.page||'overview';
  /* The Overview is the repo's root index.html; every other page lives in docs/<topic>/.
     Links are relative, so the site works from a folder, a local server or an embedded browser. */
  var IN_DOCS=PAGE!=='overview', DEPTH=PAGE.split('/').length;
  var TO_ROOT=IN_DOCS?new Array(DEPTH+1).join('../'):'';
  var TO_DOCS=IN_DOCS?new Array(DEPTH).join('../'):'docs/';
  function homeHref(){return TO_ROOT+'index.html';}
  function href(p){return TO_DOCS+p;} /* p is relative to docs/ */
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
  var navLinks='<a class="btn" data-variant="ghost" data-size="sm" href="'+homeHref()+'" data-nav="overview">Overview</a>'+TOPICS.map(function(t){
    return '<a class="btn nav-trigger" data-variant="ghost" data-size="sm" href="'+href(t.items[0].path)+'" data-nav="'+t.key+'" data-menu="'+t.key+'" aria-expanded="false" aria-controls="navdd-'+t.key+'">'+t.label+CHEV+'</a>';}).join('');
  var navPanels=TOPICS.map(function(t){
    return '<div class="navdd" id="navdd-'+t.key+'" hidden>'+t.items.map(function(i){return '<a href="'+href(i.path)+'" data-sub="'+pageKey(i)+'"><b>'+i.label+'</b><span>'+i.desc+'</span></a>';}).join('')+(t.soon?'<div class="soon">More components soon</div>':'')+'</div>';}).join('');
  var BRAND=`<a class="brandmark" href="{{HOME}}" aria-label="Enviolo Design System, overview"><svg viewBox="0 0 496.06 112.06" fill="currentColor" aria-hidden="true"><path d="M276.93,32.01c-4.39,0-7.98,3.56-7.98,8.02v64.02c0,4.4,3.6,8.02,7.98,8.02s7.98-3.61,7.98-8.02V40.03c-.06-4.46-3.6-8.02-7.98-8.02Z"/><path d="M336.71,32.01c-21.99,0-39.87,17.9-39.87,40.03s17.82,40.03,39.87,40.03,39.87-17.9,39.87-40.03-17.88-40.03-39.87-40.03ZM336.65,96.09c-13.21,0-23.95-10.78-23.95-24.05s10.68-24.05,23.95-24.05,23.95,10.78,23.95,24.05-10.74,24.05-23.95,24.05Z"/><path d="M456.2,32.01c-21.99,0-39.87,17.9-39.87,40.03s17.82,40.03,39.87,40.03,39.87-17.9,39.87-40.03-17.82-40.03-39.87-40.03ZM456.2,96.09c-13.21,0-23.95-10.78-23.95-24.05s10.68-24.05,23.95-24.05,23.95,10.78,23.95,24.05-10.74,24.05-23.95,24.05Z"/><path d="M396.42,0c-4.39,0-7.98,3.56-7.98,8.02v96.03c0,4.4,3.54,8.02,7.98,8.02s7.98-3.61,7.98-8.02V8.02c0-4.4-3.54-8.02-7.98-8.02Z"/><path d="M131.47,32.01c-21.99,0-39.87,17.9-39.87,40.03v32.01c0,4.4,3.6,8.02,7.98,8.02s7.98-3.61,7.98-8.02v-32.01h0c0-13.27,10.68-23.99,23.9-23.99s23.9,10.73,23.95,23.99h0v32.01c0,4.4,3.6,8.02,7.98,8.02s7.98-3.61,7.98-8.02v-32.01c-.11-22.13-17.94-40.03-39.92-40.03Z"/><path d="M252.59,32.86c-3.94-1.98-8.72-.4-10.68,3.56l-24.74,49.68-24.74-49.68c-1.97-3.95-6.75-5.53-10.68-3.56s-5.57,6.77-3.6,10.73l31.88,64.02h0c1.29,2.6,3.99,4.4,7.14,4.4s5.79-1.81,7.14-4.46h0l31.88-64.02c1.91-3.9.34-8.69-3.6-10.67Z"/><path d="M71.52,81.18c-3.77-2.26-8.6-1.02-10.91,2.71-4.1,7.28-11.86,12.19-20.81,12.19-13.21,0-23.95-10.78-23.95-24.05s10.68-24.05,23.95-24.05c8.72,0,16.31,4.69,20.52,11.69l-20.47,12.36h39.87c0-22.07-17.82-40.03-39.87-40.03-22.04,0-39.87,17.9-39.87,40.03s17.82,40.03,39.87,40.03c14.73,0,27.61-8.02,34.53-19.98,2.14-3.84.9-8.69-2.87-10.9Z"/></svg><span>Design System</span></a>`.replace('{{HOME}}',homeHref());
  document.body.insertAdjacentHTML('afterbegin','<header class="topnav"><div class="topnav-inner">'+BRAND+'<nav class="mainnav" aria-label="Main">'+navLinks+'</nav></div>'+navPanels+'</header>');
  document.body.insertAdjacentHTML('beforeend','<div class="toast" id="toast" role="status" hidden></div>');
  (function(){
    var top=PAGE.split('/')[0];
    document.querySelectorAll('.mainnav [data-nav]').forEach(function(a){ if(a.dataset.nav===top) a.setAttribute('aria-current','page'); });
    document.querySelectorAll('.navdd a').forEach(function(a){ if(a.dataset.sub===PAGE) a.setAttribute('aria-current','page'); });
    document.querySelectorAll('nav[data-subnav]').forEach(function(n){
      var t=TOPICS.filter(function(x){return x.key===n.dataset.subnav;})[0]; if(!t) return;
      n.innerHTML=t.items.map(function(i){return '<a class="btn" data-size="sm" href="'+href(i.path)+'" data-sub="'+pageKey(i)+'"'+(pageKey(i)===PAGE?' aria-current="page"':'')+'>'+i.label+'</a>';}).join('');
    });
  })();
  D.renderIcons(); /* the nav chevrons were just added */
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

  D.onChange(renderDocs);

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
