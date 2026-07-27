/* =====================================================================
   RIKI AKSA — PERSONAL DIGITAL UNIVERSE  (vanilla JS, no libraries)
   ===================================================================== */
(function(){
  "use strict";
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const rand  = (a,b)=>a+Math.random()*(b-a);
  const pick  = a => a[Math.floor(Math.random()*a.length)];

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover     = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isTouch      = matchMedia('(hover: none)').matches;
  if(reduceMotion) document.body.classList.add('reduce');

  /* ---------- LANGUAGE (EN / ID) ---------- */
  // default = saved choice, else browser language, else English
  let LANG = localStorage.getItem('ra-lang')
          || (navigator.language && navigator.language.toLowerCase().indexOf('id') === 0 ? 'id' : 'en');
  const I18N = {
    en:{
      'nav.home':'Home','nav.about':'About','nav.world':'World','nav.school':'School',
      'hero.hello':"HELLO, I'M",
      'hero.subtitle':'14 YEARS OLD STUDENT',
      'hero.desc':'Exploring code, design, technology, AI, and digital creativity.',
      'hero.welcome':'Welcome to my digital universe.',
      'hero.enter':'ENTER MY WORLD','hero.about':'ABOUT ME','hero.scroll':'SCROLL',
      'about.eyebrow':'ABOUT ME',
      'about.heading':'Just a student<br>with a <span class="accent">curious mind</span>',
      'about.text':"Hi, I'm <b>Riki Aksa</b>. A 14 years old student from <b>SMP Negeri 4 Sigi</b> who enjoys exploring technology, coding, design, AI, and digital creativity. This isn't a portfolio — it's my little world on the internet. Come look around.",
      'stat.years':'Years Old','stat.student':'Student','stat.ideas':'Ideas',
      'world.eyebrow':'MY DIGITAL WORLD',
      'world.heading':'Things I <span class="accent">love to build</span>',
      'world.lead':'Tap or hover a card — each one is a little universe of its own.',
      'card.coding.t':'CODING','card.coding.d':'Turning ideas into things that actually work.',
      'card.website.t':'WEBSITE','card.website.d':'Building places on the internet worth visiting.',
      'card.design.t':'DESIGN','card.design.d':'Making things feel clean, smooth and alive.',
      'card.ai.t':'AI','card.ai.d':'Playing with intelligence that learns and creates.',
      'card.tech.t':'TECHNOLOGY','card.tech.d':'The tools that make the impossible feel normal.',
      'card.experiments.t':'DIGITAL EXPERIMENTS','card.experiments.d':'Small weird projects that teach me a lot.',
      'school.eyebrow':'PART OF THE JOURNEY',
      'school.text':'One of the places that is part of my journey. A small piece of where this digital universe began.',
      'school.btn':'VISIT SCHOOL WEBSITE',
      'footer.text':'Built with curiosity by <b>Riki Aksa</b> · SMP Negeri 4 Sigi · Sigi, Sulawesi Tengah, Indonesia',
      'loader.init':'INITIALIZING DIGITAL UNIVERSE',
      'tip.mono':'Mono','tip.green':'Green','tip.blue':'Blue','tip.red':'Red'
    },
    id:{
      'nav.home':'Beranda','nav.about':'Tentang','nav.world':'Dunia','nav.school':'Sekolah',
      'hero.hello':'HALO, SAYA',
      'hero.subtitle':'SISWA BERUSIA 14 TAHUN',
      'hero.desc':'Menjelajahi kode, desain, teknologi, AI, dan kreativitas digital.',
      'hero.welcome':'Selamat datang di alam semesta digital saya.',
      'hero.enter':'MASUK KE DUNIAKU','hero.about':'TENTANG SAYA','hero.scroll':'GULIR',
      'about.eyebrow':'TENTANG SAYA',
      'about.heading':'Hanya seorang pelajar<br>dengan <span class="accent">pikiran yang penasaran</span>',
      'about.text':'Hai, saya <b>Riki Aksa</b>. Pelajar berusia 14 tahun dari <b>SMP Negeri 4 Sigi</b> yang suka menjelajahi teknologi, coding, desain, AI, dan kreativitas digital. Ini bukan portofolio — ini dunia kecil saya di internet. Mari lihat-lihat.',
      'stat.years':'Tahun','stat.student':'Siswa','stat.ideas':'Ide',
      'world.eyebrow':'DUNIA DIGITAL SAYA',
      'world.heading':'Hal yang saya <span class="accent">suka buat</span>',
      'world.lead':'Ketuk atau arahkan kursor ke kartu — setiap kartu adalah alam semestanya sendiri.',
      'card.coding.t':'KODING','card.coding.d':'Mengubah ide menjadi sesuatu yang benar-benar berfungsi.',
      'card.website.t':'WEBSITE','card.website.d':'Membangun tempat di internet yang layak dikunjungi.',
      'card.design.t':'DESAIN','card.design.d':'Membuat sesuatu terasa rapi, halus, dan hidup.',
      'card.ai.t':'AI','card.ai.d':'Bermain dengan kecerdasan yang belajar dan mencipta.',
      'card.tech.t':'TEKNOLOGI','card.tech.d':'Alat yang membuat yang mustahil terasa biasa.',
      'card.experiments.t':'EKSPERIMEN DIGITAL','card.experiments.d':'Proyek aneh kecil yang banyak mengajari saya.',
      'school.eyebrow':'BAGIAN DARI PERJALANAN',
      'school.text':'Salah satu tempat yang menjadi bagian perjalanan saya. Sepenggal kecil awal mula alam semesta digital ini.',
      'school.btn':'KUNJUNGI WEBSITE SEKOLAH',
      'footer.text':'Dibuat dengan rasa ingin tahu oleh <b>Riki Aksa</b> · SMP Negeri 4 Sigi · Sigi, Sulawesi Tengah, Indonesia',
      'loader.init':'MENGINISIALISASI ALAM SEMESTA DIGITAL',
      'tip.mono':'Mono','tip.green':'Hijau','tip.blue':'Biru','tip.red':'Merah'
    }
  };
  const BUBBLES = {
    en:{ click:["Hey!","Welcome!","Let's explore!","Nice to see you!","Cool!","Stay curious!"],
         green:["Nice weather!","Let's enjoy the grass!","Feels peaceful.","Grass mode!"],
         blue:["Just keep swimming.","Water mode activated.","Relax...","So cool."],
         hot:["Too hot...","Need water!","Where is the water?!","Ahh, it burns!"],
         relief:["Ahh... cool!","Finally!","Much better!"],
         swim:["Much better!","Just keep swimming.","Cool!"] },
    id:{ click:["Hai!","Selamat datang!","Ayo jelajahi!","Senang bertemu!","Keren!","Tetap penasaran!"],
         green:["Cuaca bagus!","Nikmati rumputnya!","Terasa damai.","Mode rumput!"],
         blue:["Terus berenang.","Mode air aktif.","Santai...","Sejuk sekali."],
         hot:["Panas banget...","Butuh air!","Di mana airnya?!","Aduh, panas!"],
         relief:["Ahh... sejuk!","Akhirnya!","Jauh lebih baik!"],
         swim:["Jauh lebih baik!","Terus berenang.","Keren!"] }
  };
  function B(key){ return pick(BUBBLES[LANG][key]); }
  function setLang(lang){
    LANG = lang;
    localStorage.setItem('ra-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    $$('[data-i18n]').forEach(el=>{
      const v = I18N[lang][el.getAttribute('data-i18n')];
      if(v !== undefined) el.innerHTML = v;
    });
    $$('.lang-toggle span[data-lang]').forEach(s=>s.classList.toggle('on', s.dataset.lang===lang));
  }

  /* ---------- THEME SYSTEM (worlds) ---------- */
  const THEMES = ['mono','green','blue','red'];
  let THEME_TOKEN = 0;            // bumped on every theme change (cancels scripts)
  const saved = localStorage.getItem('ra-theme');
  const startTheme = THEMES.includes(saved) ? saved : 'mono';

  function setTheme(name, opts){
    opts = opts || {};
    document.documentElement.setAttribute('data-theme', name);
    if(opts.save !== false) localStorage.setItem('ra-theme', name);
    THEME_TOKEN++;
    onThemeChange(name, opts);
  }

  function onThemeChange(name, opts){
    // dock active state
    $$('.theme-dot').forEach(d=>d.classList.toggle('active', d.dataset.theme===name));
    document.querySelector('meta[name=theme-color]').setAttribute('content',
      getComputedStyle(document.body).getPropertyValue('--bg-0').trim());
    buildEnv(name);                 // regenerate world particles
    updateParticleColor();
    if(opts && opts.scripting) return;   // story controls the character itself
    // leaving the hot world cancels any running hot->water story
    if(char.storyToken && name!=='red') char.storyToken = 0;
    // neutral (non-story) behaviour per world
    if(name==='mono'){ setMode('patrol'); setExpr('cool'); }
    else if(name==='green'){ setMode('green'); setExpr('happy'); }
    else if(name==='blue'){ setMode('swim'); setExpr('relief'); }
    else if(name==='red'){ startHotStory(); }
  }

  /* ---------- CHARACTER STATE MACHINE ---------- */
  const charEl = $('#character');
  const charY  = $('#charY');
  const bubble = $('#charBubble');
  const stage  = $('#stage');

  const char = {
    x: 60, dir: 1, speed: 0.7,
    minX: 10, maxX: 600, width: 88,
    mode: 'patrol', motion: 'idle', expr: 'cool',
    press: false, transientUntil: 0,
    gotoTarget: 0, gotoSpeed: 1, gotoToken: 0, _resolve: null,
    storyToken: 0,
    edgePause: 0
  };

  function paint(){
    charEl.className = 'character ' + char.motion + (char.press?' press':'') + ' expr-' + char.expr;
  }
  function setMotion(m){ char.motion = m; paint(); }
  function setExpr(e){ char.expr = e; paint(); }
  function setMode(m){ char.mode = m; }
  // transient overrides loop motion (e.g. celebrate on click)
  function transientMotion(m, ms){
    char.motion = m; paint();
    char.transientUntil = performance.now() + ms;
  }
  function setMotionIfFree(m){
    if(performance.now() < char.transientUntil) return;
    char.motion = m; paint();
  }

  function measure(){
    char.width = charEl.offsetWidth || 88;
    char.maxX = Math.max(char.minX, window.innerWidth - char.width - 10);
    if(char.x > char.maxX) char.x = char.maxX;
  }

  /* ---- bubble text (bilingual via B()) ---- */
  let bubbleTimer = null;
  function showBubble(text){
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(()=>bubble.classList.remove('show'), 2200);
  }

  /* ---- main character loop ---- */
  let last = performance.now();
  function loop(now){
    const dt = Math.min(2.4, (now - last) / 16.67); // normalized to ~60fps frames
    last = now;
    step(dt);
    applyTransform();
    drawCursorTrail();
    requestAnimationFrame(loop);
  }

  function applyTransform(){
    const flip = char.dir < 0 ? -1 : 1;
    charEl.style.transform = 'translateX(' + char.x + 'px) scaleX(' + flip + ')';
  }

  function step(dt){
    switch(char.mode){
      case 'patrol': patrol(dt); break;
      case 'green':  green(dt);  break;
      case 'swim':   swimMode(dt); break;
      case 'hot':    setMotionIfFree('hot'); break;          // standing, fanning
      case 'look':   setMotionIfFree('look'); break;
      case 'sit':    setMotionIfFree('sit'); break;
      case 'idle':   setMotionIfFree('idle'); break;
      case 'blueWait': setMotionIfFree('idle'); break;
      case 'goto':   gotoMode(dt); break;
    }
  }

  function walker(dt, speed){
    char.x += char.dir * speed * dt;
    if(char.x >= char.maxX){ char.x = char.maxX; char.dir = -1; }
    if(char.x <= char.minX){ char.x = char.minX; char.dir =  1; }
    setMotionIfFree(speed > 1.5 ? 'run' : 'walk');
  }
  function patrol(dt){
    if(char.edgePause > 0){ char.edgePause -= dt; setMotionIfFree('idle'); return; }
    walker(dt, char.speed);
    if(Math.random() < 0.004) char.edgePause = rand(40, 90); // occasional pause
  }
  function green(dt){
    walker(dt, char.speed * 0.8);
    if(Math.random() < 0.0016){
      // little moment: sit / look / jump
      const r = Math.random();
      if(r < 0.4){ setMode('sit'); showBubble(B('green')); setTimeout(()=>{ if(char.mode==='sit') setMode('green'); }, 1600); }
      else { setMode('look'); setTimeout(()=>{ if(char.mode==='look') setMode('green'); }, 1500); }
    }
  }
  function swimMode(dt){
    char.x += char.dir * 0.3 * dt;
    if(char.x >= char.maxX || char.x <= char.minX) char.dir *= -1;
    setMotionIfFree('swim');
    if(Math.random() < 0.02) spawnSplashBubble();
  }

  function gotoMode(dt){
    const dx = char.gotoTarget - char.x;
    const stepLen = char.gotoSpeed * dt;
    if(char.gotoToken !== THEME_TOKEN){ // theme changed mid-run -> abort
      char.mode = 'idle'; if(char._resolve){const r=char._resolve;char._resolve=null;r();} return;
    }
    if(Math.abs(dx) <= stepLen){
      char.x = char.gotoTarget; char.mode = 'idle';
      if(char._resolve){const r=char._resolve;char._resolve=null;r();}
      return;
    }
    char.dir = dx > 0 ? 1 : -1;
    char.x += char.dir * stepLen;
    setMotionIfFree(char.gotoSpeed > 1.5 ? 'run' : 'walk');
  }
  function moveTo(targetX, speed){
    return new Promise(resolve=>{
      char.mode = 'goto';
      char.gotoTarget = clamp(targetX, char.minX, char.maxX);
      char.gotoSpeed = speed;
      char.gotoToken = THEME_TOKEN;
      char._resolve = resolve;
    });
  }
  const wait = ms => new Promise(r=>setTimeout(r, ms));

  /* ---- HOT -> WATER STORY (red) ---- */
  function startHotStory(){
    if(char.storyToken) return;            // already running
    if(isTouch && reduceMotion) { /* still run, just lighter */ }
    char.storyToken = Date.now();
    runHotStory(char.storyToken);
  }
  async function runHotStory(token){
    const stale = ()=> token !== char.storyToken;
    setMode('hot'); setExpr('hot');
    await wait(1400); if(stale()) return;
    showBubble(B('hot'));
    await wait(1900); if(stale()) return;
    showBubble(B('hot'));
    setMode('look');                       // looks toward the BLUE button
    await wait(1100); if(stale()) return;
    setMode('run');                        // RUN to the BLUE button
    const tx = blueTargetX();
    await moveTo(tx, 2.6); if(stale()) return;
    setMode('idle');
    pressAnim();                           // reaches up & presses BLUE
    await wait(420); if(stale()) return;
    // trigger the world change (story drives the character afterwards)
    setTheme('blue', { save:true, scripting:true });
    await wait(500); if(stale()) return;
    setMode('blueWait'); setExpr('relief');
    showBubble(B('relief'));
    await wait(650); if(stale()) return;
    enterWater(token);
  }
  function blueTargetX(){
    const r = $('#theme-blue').getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    return (r.left + r.width/2) - sr.left - char.width/2;
  }
  function pressAnim(){
    char.press = true; paint();
    setTimeout(()=>{ char.press = false; paint(); }, 420);
  }
  function enterWater(token){
    if(token !== char.storyToken) return;
    splash();                              // gentle ripple, no jump
    setMode('swim'); setExpr('relief');
    showBubble(B('swim'));
    char.storyToken = 0;
  }
  function splash(){
    const s = document.createElement('div');
    s.className = 'splash';
    s.style.left = (char.x + char.width/2) + 'px';
    stage.appendChild(s);
    setTimeout(()=>s.remove(), 800);
    for(let i=0;i<6;i++) setTimeout(spawnSplashBubble, i*70);
  }
  function spawnSplashBubble(big){
    const b = document.createElement('div');
    b.className = 'water-bubble';
    b.style.left = (char.x + rand(10,char.width-10)) + 'px';
    b.style.bottom = '0';
    if(big){ b.style.width = b.style.height = '12px'; }
    b.style.animationDuration = rand(1.4, 2.6) + 's';
    $('#envWater').appendChild(b);
    setTimeout(()=>b.remove(), 2800);
  }

  /* ---- clicking the character ---- */
  charEl.addEventListener('click', ()=>{
    const key = char.mode==='swim' ? 'blue'
              : (document.documentElement.dataset.theme==='green') ? 'green'
              : (char.expr==='hot') ? 'hot' : 'click';
    showBubble(B(key));
    transientMotion('celebrate', 650);
  });

  /* ---------- ENVIRONMENTS (world particles) ---------- */
  const envGrass = $('#envGrass'), envWater = $('#envWater'), envHeat = $('#envHeat');
  function buildEnv(name){
    // clear dynamic bits
    envGrass.querySelectorAll('.leaf').forEach(e=>e.remove());
    envWater.querySelectorAll('.water-bubble').forEach(e=>e.remove());
    envHeat.querySelectorAll('.ember').forEach(e=>e.remove());
    if(reduceMotion) return;
    const base = isTouch ? 10 : 22;
    if(name==='green'){
      // grass blades
      const gb = $('#grassBlades'); gb.innerHTML='';
      const n = isTouch ? 26 : 48;
      for(let i=0;i<n;i++){
        const b=document.createElement('div'); b.className='grass-blade';
        b.style.left = (i/n*100 + rand(-1,1)) + '%';
        b.style.height = rand(22,46)+'px';
        b.style.animationDelay = rand(0,3.5)+'s';
        b.style.animationDuration = rand(2.6,4.4)+'s';
        gb.appendChild(b);
      }
      // falling leaves
      for(let i=0;i<base;i++) spawnLeaf();
    } else if(name==='blue'){
      for(let i=0;i<base;i++) spawnWaterBubble();
    } else if(name==='red'){
      for(let i=0;i<base;i++) spawnEmber();
    }
  }
  function spawnLeaf(){
    const l=document.createElement('div'); l.className='leaf';
    l.style.left = rand(0,100)+'%';
    l.style.background = pick(['var(--accent-2)','var(--accent)','#bbf7d0','#fde68a']);
    l.style.setProperty('--dx', rand(-50,50)+'px');
    l.style.animationDuration = rand(6,12)+'s';
    l.style.animationDelay = rand(0,6)+'s';
    l.style.opacity = rand(.5,.9);
    envGrass.appendChild(l);
    setTimeout(()=>l.remove(), 14000);
  }
  function spawnWaterBubble(){
    const b=document.createElement('div'); b.className='water-bubble';
    b.style.left = rand(0,100)+'%';
    b.style.animationDuration = rand(2.2,4.5)+'s';
    b.style.animationDelay = rand(0,3)+'s';
    envWater.appendChild(b);
    setTimeout(()=>b.remove(), 7000);
  }
  function spawnEmber(){
    const e=document.createElement('div'); e.className='ember';
    e.style.left = rand(0,100)+'%';
    e.style.setProperty('--dx', rand(-30,30)+'px');
    e.style.animationDuration = rand(3.5,7)+'s';
    e.style.animationDelay = rand(0,4)+'s';
    envHeat.appendChild(e);
    setTimeout(()=>e.remove(), 8000);
  }

  /* ---------- AMBIENT PARTICLE CANVAS ---------- */
  const fx = $('#fx');
  const ctx = fx.getContext('2d');
  let particles = [], pColor = 'rgba(255,255,255,.5)';
  function updateParticleColor(){
    pColor = getComputedStyle(document.body).getPropertyValue('--particle').trim() || 'rgba(255,255,255,.5)';
  }
  function sizeCanvas(){
    fx.width = window.innerWidth; fx.height = window.innerHeight;
  }
  function initParticles(){
    const n = reduceMotion ? 0 : (isTouch ? 26 : 60);
    particles = [];
    for(let i=0;i<n;i++){
      particles.push({
        x: Math.random()*fx.width, y: Math.random()*fx.height,
        r: rand(0.6,2.2), vy: rand(-0.25,-0.6), vx: rand(-0.15,0.15),
        a: rand(0.15,0.6), ph: rand(0,6.28)
      });
    }
  }
  function drawParticles(){
    if(reduceMotion || !particles.length) return;
    ctx.clearRect(0,0,fx.width,fx.height);
    for(const p of particles){
      p.y += p.vy; p.x += p.vx + Math.sin(p.ph += 0.01)*0.15;
      if(p.y < -10){ p.y = fx.height+10; p.x = Math.random()*fx.width; }
      if(p.x < -10) p.x = fx.width+10; if(p.x > fx.width+10) p.x = -10;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.28);
      ctx.fillStyle = pColor; ctx.globalAlpha = p.a; ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- CURSOR GLOW + TRAIL ---------- */
  const cursorGlow = $('#cursorGlow');
  const trail = [];
  const TRAIL_N = 8;
  let mouse = {x:-100,y:-100};
  if(canHover && !reduceMotion){
    for(let i=0;i<TRAIL_N;i++){
      const t=document.createElement('div'); t.className='cursor-trail';
      document.body.appendChild(t); trail.push({el:t,x:-100,y:-100});
    }
    window.addEventListener('mousemove', e=>{
      mouse.x=e.clientX; mouse.y=e.clientY;
      cursorGlow.style.opacity='1';
      cursorGlow.style.transform='translate('+e.clientX+'px,'+e.clientY+'px) translate(-50%,-50%)';
    });
    window.addEventListener('mouseleave', ()=> cursorGlow.style.opacity='0');
  }
  function drawCursorTrail(){
    if(!trail.length) return;
    let px=mouse.x, py=mouse.y;
    for(const t of trail){
      t.x += (px - t.x)*0.35; t.y += (py - t.y)*0.35;
      t.el.style.transform='translate('+t.x+'px,'+t.y+'px) translate(-50%,-50%)';
      t.el.style.opacity = (0.5 * (trail.indexOf(t)+1)/TRAIL_N).toFixed(2);
      px=t.x; py=t.y;
    }
  }

  /* ---------- NAV / MENU / BUTTONS ---------- */
  const hamburger = $('#hamburger');
  hamburger.addEventListener('click', ()=> document.body.classList.toggle('menu-open'));
  $$('[data-link]').forEach(a=>a.addEventListener('click', ()=>document.body.classList.remove('menu-open')));

  // theme dots (dock + mobile menu)
  $$('.theme-dot').forEach(dot=>{
    dot.addEventListener('click', ()=>{
      document.body.classList.remove('menu-open');
      setTheme(dot.dataset.theme);
    });
  });

  // language toggle (EN / ID)
  $('#langToggle').addEventListener('click', ()=> setLang(LANG==='en' ? 'id' : 'en'));

  // magnetic + ripple + scroll buttons
  $$('[data-scroll]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const t = $(btn.dataset.scroll);
      if(t) t.scrollIntoView({behavior: reduceMotion?'auto':'smooth'});
    });
  });
  if(canHover && !reduceMotion){
    $$('.btn, .theme-dot').forEach(el=>{
      el.addEventListener('mousemove', e=>{
        const r=el.getBoundingClientRect();
        const mx=e.clientX-r.left-r.width/2, my=e.clientY-r.top-r.height/2;
        el.style.transform='translate('+(mx*0.25)+'px,'+(my*0.35)+'px)';
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
    });
  }
  // ripple on any .btn click
  $$('.btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const r=btn.getBoundingClientRect();
      const s=document.createElement('span'); s.className='ripple';
      const size=Math.max(r.width,r.height);
      s.style.width=s.style.height=size+'px';
      s.style.left=(e.clientX-r.left-size/2)+'px';
      s.style.top=(e.clientY-r.top-size/2)+'px';
      btn.appendChild(s); setTimeout(()=>s.remove(),600);
    });
  });

  // card tap (mobile)
  $$('.card').forEach(c=>{
    c.addEventListener('click', ()=>{
      c.classList.add('tap');
      setTimeout(()=>c.classList.remove('tap'), 600);
    });
  });

  /* ---------- SCROLL: progress + reveal + count-up ---------- */
  const progress = $('#progress');
  function onScroll(){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h>0 ? (window.scrollY/h*100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('in');
        const counter = en.target.querySelector('[data-count]');
        if(counter) countUp(counter);
        io.unobserve(en.target);
      }
    });
  }, {threshold:0.2});
  $$('.reveal').forEach(el=>io.observe(el));

  function countUp(el){
    const target = parseFloat(el.dataset.count);
    if(isNaN(target)) return;
    const dur = reduceMotion ? 0 : 1100;
    const t0 = performance.now();
    function tick(t){
      const k = dur? clamp((t-t0)/dur,0,1) : 1;
      const e = 1-Math.pow(1-k,3);
      el.textContent = Math.round(target*e);
      if(k<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- RESIZE ---------- */
  window.addEventListener('resize', ()=>{ sizeCanvas(); initParticles(); measure(); });

  /* ---------- LOADER / BOOT ---------- */
  function boot(){
    sizeCanvas(); initParticles(); measure(); updateParticleColor();
    setLang(LANG);                        // restore saved language + highlight toggle
    setTheme(startTheme, {save:true});    // restore saved world
    requestAnimationFrame(loop);
    // animate loader dots
    let d=0; const ld=$('#loadDots');
    const dotInt=setInterval(()=>{ d=(d+1)%4; ld.textContent='.'.repeat(d||1)+'.'.repeat(3-d).slice(0,3); }, 350);
    const reveal = ()=>{
      clearInterval(dotInt);
      $('#loader').classList.add('hide');
      document.body.classList.add('loaded');
    };
    const delay = reduceMotion ? 350 : 750;
    // reveal as soon as possible (DOM is already parsed at this point)
    setTimeout(reveal, delay);
    // safety: never trap the user, even if something stalls
    setTimeout(reveal, 2500);
  }

  // tiny canvas draw tied into rAF via its own loop (lightweight)
  (function pLoop(){ drawParticles(); requestAnimationFrame(pLoop); })();

  boot();
})();

(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a21b8badb9eece2b',t:'MTc4NTE1NDI3NQ=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
