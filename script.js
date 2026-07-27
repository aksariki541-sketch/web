/* ============================================================
   RIKI AKSA — INTERACTIVE SCRIPT
   Updated: JSON-based icons, per-theme scenes, character modes
   ============================================================ */
(function(){
  'use strict';

  /* ---------- JSON Data: Icons (all shapes from code, no emojis) ---------- */
  const ICONS = {
    code: {
      viewBox: "0 0 24 24",
      paths: `<polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    },
    web: {
      viewBox: "0 0 24 24",
      paths: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2" fill="none"/>`
    },
    design: {
      viewBox: "0 0 24 24",
      paths: `<path d="M12 19l7-7 3 3-7 7-3-3z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 2l7.586 7.586" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="11" cy="11" r="2" stroke="currentColor" stroke-width="2" fill="none"/>`
    },
    ai: {
      viewBox: "0 0 24 24",
      paths: `<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
              <path d="M9 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 3v2M12 19v2M3 12h1M20 12h1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
    },
    idea: {
      viewBox: "0 0 24 24",
      paths: `<path d="M9 18h6M10 22h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    },
    flask: {
      viewBox: "0 0 24 24",
      paths: `<path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 14h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
    }
  };

  /* ---------- JSON Data: World items (rendered dynamically, no emojis) ---------- */
  const WORLD_ITEMS = [
    {icon:'code', name:'Coding', desc:'Writing lines of logic and watching them come alive in the browser.'},
    {icon:'web', name:'Websites', desc:'Designing and building little places on the internet that feel alive.'},
    {icon:'design', name:'Design', desc:'Playing with colors, layouts, typography, and visual stories.'},
    {icon:'ai', name:'AI', desc:'Experimenting with artificial intelligence and what it can create.'},
    {icon:'idea', name:'Technology', desc:'Curious about new tools, gadgets, and how the digital world evolves.'},
    {icon:'flask', name:'Experiments', desc:'Random digital projects, creative tinkering, and happy accidents.'}
  ];

  /* ---------- Theme & Scene Config ---------- */
  const THEMES = ['bw','green','blue','red','orange'];
  const THEME_COLOR_MAP = {
    bw:'#ffffff',
    green:'#4ade80',
    blue:'#60a5fa',
    red:'#f87171',
    orange:'#fb923c'
  };
  // Moods for each theme (mouth shape, eye size, speed)
  const CHAR_MOODS = {
    bw:    {mouth:'M26 28 Q30 30 34 28', eyes:2.2, speedMod:1,   greetings:['Hey.','Welcome.','Cool vibes.','Stay a while.']},
    green: {mouth:'M25 27 Q30 33 35 27', eyes:2.4, speedMod:1.3, greetings:['Hey!','Nice to see you!','Let\'s explore!','Yo!']},
    blue:  {mouth:'M26 28.5 Q30 29 34 28.5', eyes:2.0, speedMod:0.7, greetings:['Hey.','Welcome.','Take your time.','Just swimming~']},
    red:   {mouth:'M27 29 Q30 32 33 29', eyes:2.3, speedMod:0.5, greetings:['Panas ya!','Haus...','Hi!','Cari es yuk!']},
    orange:{mouth:'M27 29 Q30 32 33 29', eyes:2.3, speedMod:0.5, greetings:['Panas banget!','Wah!','Hey!','Matahari terik!']}
  };
  const isMobile = window.matchMedia('(max-width:900px)').matches || ('ontouchstart' in window);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const baseSpeed = isMobile ? 0.5 : 0.7;

  /* ---------- Elements ---------- */
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const body = document.body;
  const loader = $('#loader');
  const navbar = $('#navbar');
  const scrollProgress = $('#scrollProgress');
  const cursorDot = $('#cursorDot');
  const cursorRing = $('#cursorRing');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const character = $('#character');
  const charBubble = $('#charBubble');
  const charMouth = () => document.querySelector('.char-mouth');
  const scene = $('#scene');
  const particlesCanvas = $('#particles-canvas');
  const pctx = particlesCanvas.getContext('2d');
  const worldGrid = $('#worldGrid');

  /* ---------- Helper: Render icon from JSON ---------- */
  function renderIcon(name, size=40){
    const ic = ICONS[name];
    if(!ic) return '';
    return `<svg class="${name === 'world' ? 'world-icon' : ''}" width="${size}" height="${size}" viewBox="${ic.viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic.paths}</svg>`;
  }

  /* ---------- Render World Cards from JSON ---------- */
  function renderWorld(){
    worldGrid.innerHTML = WORLD_ITEMS.map((item,i) => `
      <div class="world-card reveal" data-world style="transition-delay:${i*0.08}s">
        <div class="world-icon">${renderIcon(item.icon, 40)}</div>
        <div class="world-name">${item.name}</div>
        <div class="world-desc">${item.desc}</div>
      </div>
    `).join('');
    // bind hover events
    $$('[data-world]').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx',(e.clientX-r.left)+'px');
        card.style.setProperty('--my',(e.clientY-r.top)+'px');
      });
    });
  }

  /* ---------- Build Scene per theme ---------- */
  function buildScene(theme){
    scene.innerHTML = '';
    const ground = document.createElement('div');
    ground.className = 'scene-ground';
    scene.appendChild(ground);

    if(theme === 'bw'){
      // Normal: simple line
      const line = document.createElement('div');
      line.className = 'scene-line';
      scene.appendChild(line);
    }
    else if(theme === 'green'){
      // Grass scene
      const line = document.createElement('div');
      line.className = 'scene-line';
      scene.appendChild(line);
      const grass = document.createElement('div');
      grass.className = 'scene-grass';
      const bladeCount = isMobile ? 20 : 45;
      for(let i=0;i<bladeCount;i++){
        const blade = document.createElement('div');
        blade.className = 'grass-blade';
        blade.style.height = (8 + Math.random()*18)+'px';
        blade.style.animationDelay = (Math.random()*3)+'s';
        blade.style.opacity = 0.4 + Math.random()*0.5;
        grass.appendChild(blade);
      }
      scene.appendChild(grass);
    }
    else if(theme === 'blue'){
      // Water scene
      const water = document.createElement('div');
      water.className = 'scene-water';
      // Wave
      const wave = document.createElement('div');
      wave.className = 'water-wave';
      wave.innerHTML = `<svg viewBox="0 0 1200 20" preserveAspectRatio="none">
        <path d="M0 10 Q 150 0 300 10 T 600 10 T 900 10 T 1200 10" stroke="currentColor" stroke-width="2" fill="none" opacity=".6">
          <animate attributeName="d" dur="4s" repeatCount="indefinite" values="
            M0 10 Q 150 0 300 10 T 600 10 T 900 10 T 1200 10;
            M0 10 Q 150 20 300 10 T 600 10 T 900 10 T 1200 10;
            M0 10 Q 150 0 300 10 T 600 10 T 900 10 T 1200 10
          "/>
        </path>
      </svg>`;
      water.appendChild(wave);
      // Bubbles
      const bubbleCount = isMobile ? 5 : 10;
      for(let i=0;i<bubbleCount;i++){
        const b = document.createElement('div');
        b.className = 'water-bubble';
        const size = 3 + Math.random()*6;
        b.style.width = size+'px';
        b.style.height = size+'px';
        b.style.left = (Math.random()*100)+'%';
        b.style.animationDelay = (Math.random()*4)+'s';
        b.style.animationDuration = (3 + Math.random()*3)+'s';
        water.appendChild(b);
      }
      scene.appendChild(water);
    }
    else if(theme === 'red' || theme === 'orange'){
      // Hot scene
      const sun = document.createElement('div');
      sun.className = 'scene-sun';
      scene.appendChild(sun);
      const heat = document.createElement('div');
      heat.className = 'scene-heat';
      scene.appendChild(heat);
      // Cracked ground lines
      for(let i=0;i<8;i++){
        const c = document.createElement('div');
        c.className = 'crack';
        c.style.left = (Math.random()*90)+'%';
        c.style.width = (30 + Math.random()*80)+'px';
        c.style.transform = `rotate(${-15 + Math.random()*30}deg)`;
        scene.appendChild(c);
      }
      const line = document.createElement('div');
      line.className = 'scene-line';
      scene.appendChild(line);
    }
  }

  /* ---------- Theme Application ---------- */
  function applyTheme(theme){
    if(!THEMES.includes(theme)) theme = 'bw';
    body.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--accent', THEME_COLOR_MAP[theme]);
    // character color
    character.style.color = THEME_COLOR_MAP[theme];
    // mood
    const mood = CHAR_MOODS[theme];
    const cm = charMouth();
    if(cm) cm.setAttribute('d', mood.mouth);
    const el = document.querySelector('.char-eye-l circle');
    const er = document.querySelector('.char-eye-r circle');
    if(el) el.setAttribute('r', mood.eyes);
    if(er) er.setAttribute('r', mood.eyes);
    // character mode
    setCharMode(theme, mood.speedMod);
    // build scene
    buildScene(theme);
    // update active buttons
    $$('.theme-orb').forEach(b=>{
      b.classList.toggle('active', b.dataset.theme===theme);
    });
    // save to localStorage
    try{ localStorage.setItem('riki_theme', theme); }catch(e){}
    // update particles
    if(particles) particles.forEach(p=>p.color=THEME_COLOR_MAP[theme]);
  }
  function initTheme(){
    let saved='bw';
    try{ saved = localStorage.getItem('riki_theme') || 'bw'; }catch(e){}
    applyTheme(saved);
  }

  /* ---------- Theme Switcher Events ---------- */
  $$('.theme-orb').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      applyTheme(btn.dataset.theme);
      createRipple(e.clientX||window.innerWidth/2, e.clientY||window.innerHeight/2);
    });
  });

  /* ---------- Loader ---------- */
  function hideLoader(){
    setTimeout(()=>loader.classList.add('hidden'), 1900);
  }

  /* ---------- Custom Cursor ---------- */
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let ringX = mouseX, ringY = mouseY;
  let trails = [];
  if(!isMobile && !prefersReducedMotion){
    document.addEventListener('mousemove', e=>{
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
      if(Math.random()<.3) addTrail(mouseX, mouseY);
    });
    function animateCursor(){
      ringX += (mouseX-ringX)*.18;
      ringY += (mouseY-ringY)*.18;
      cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    $$('a,button,.world-card,.stat-card,.theme-orb,.character').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave',()=>cursorRing.classList.remove('hover'));
    });
  }
  function addTrail(x,y){
    const t = document.createElement('div');
    t.className='cursor-trail';
    t.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;
    document.body.appendChild(t);
    const trail = {el:t,x,y,life:1};
    trails.push(trail);
    if(trails.length>18){const old=trails.shift();old.el.remove();}
    requestAnimationFrame(()=>animateTrail(trail));
  }
  function animateTrail(t){
    t.life-=.06;
    if(t.life<=0){t.el.remove();return;}
    t.el.style.opacity = t.life*.5;
    t.el.style.transform = `translate(${t.x}px,${t.y}px) translate(-50%,-50%) scale(${t.life})`;
    requestAnimationFrame(()=>animateTrail(t));
  }

  /* ---------- Magnetic Buttons ---------- */
  if(!isMobile){
    $$('[data-magnetic]').forEach(btn=>{
      btn.addEventListener('mousemove', e=>{
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        btn.style.transform = `translate(${x*.25}px,${y*.25}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
    });
  }

  /* ---------- Click Ripple ---------- */
  document.addEventListener('click', e=>{createRipple(e.clientX, e.clientY);});
  function createRipple(x,y){
    const r = document.createElement('div');
    r.className='ripple';
    r.style.left=x+'px';r.style.top=y+'px';r.style.width='20px';r.style.height='20px';
    document.body.appendChild(r);
    setTimeout(()=>r.remove(),750);
  }

  /* ---------- Navbar Scroll ---------- */
  window.addEventListener('scroll',()=>{
    navbar.classList.toggle('scrolled', window.scrollY>40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = h>0 ? (window.scrollY/h*100)+'%' : '0%';
  },{passive:true});

  /* ---------- Mobile Menu ---------- */
  hamburger.addEventListener('click',()=>{
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open')?'hidden':'';
  });
  $$('.mobile-link').forEach(el=>{
    el.addEventListener('click',()=>{
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow='';
    });
  });

  /* ---------- Reveal on Scroll ---------- */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
    });
  },{threshold:.12});
  function observeReveals(){$$('.reveal').forEach(el=>io.observe(el));}

  /* ---------- Count Up ---------- */
  function countUp(el, target, duration=1600){
    const start = performance.now();
    function tick(now){
      const p = Math.min((now-start)/duration,1);
      const eased = 1-Math.pow(1-p,3);
      el.textContent = Math.floor(eased*target);
      if(p<1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  const countIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const n = en.target.dataset.count;
        if(n) countUp(en.target, parseInt(n,10));
        countIO.unobserve(en.target);
      }
    });
  },{threshold:.5});

  /* ---------- Typing Effect ---------- */
  const typingPhrases = [
    "Building ideas in the digital world.",
    "Code · Design · Create.",
    "Learning one line at a time."
  ];
  function typeWriter(el, phrases, speed=55, pause=1800){
    let pi=0, ci=0, deleting=false;
    function tick(){
      const phrase = phrases[pi];
      if(!deleting){
        el.textContent = phrase.slice(0,++ci);
        if(ci===phrase.length){deleting=true;setTimeout(tick,pause);return;}
      }else{
        el.textContent = phrase.slice(0,--ci);
        if(ci===0){deleting=false;pi=(pi+1)%phrases.length;}
      }
      setTimeout(tick, deleting?speed/2:speed);
    }
    setTimeout(tick,2400);
  }

  /* ---------- Particles ---------- */
  let particles = [];
  let canvasW=0, canvasH=0;
  function resizeCanvas(){
    const dpr = Math.min(window.devicePixelRatio||1,2);
    canvasW = window.innerWidth; canvasH = window.innerHeight;
    particlesCanvas.width = canvasW*dpr;
    particlesCanvas.height = canvasH*dpr;
    particlesCanvas.style.width=canvasW+'px';
    particlesCanvas.style.height=canvasH+'px';
    pctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function initParticles(){
    resizeCanvas();
    const count = isMobile?22:55;
    particles = [];
    for(let i=0;i<count;i++){
      particles.push({
        x:Math.random()*canvasW,y:Math.random()*canvasH,
        vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
        r:Math.random()*1.8+.5,a:Math.random()*.5+.2,
        color: THEME_COLOR_MAP[body.getAttribute('data-theme')] || '#fff'
      });
    }
  }
  function drawParticles(){
    if(prefersReducedMotion) return;
    pctx.clearRect(0,0,canvasW,canvasH);
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvasW) p.vx*=-1;
      if(p.y<0||p.y>canvasH) p.vy*=-1;
      if(!isMobile){
        const dx=mouseX-p.x, dy=mouseY-p.y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<150){p.vx+=dx/d*0.005;p.vy+=dy/d*0.005;}
        p.vx*=.99;p.vy*=.99;
      }
      pctx.beginPath();pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      pctx.fillStyle = hexToRgba(p.color,p.a);
      pctx.shadowBlur=8;pctx.shadowColor=p.color;pctx.fill();
    }
    pctx.shadowBlur=0;
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i],b=particles[j];
        const dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;
        if(d<12000){
          pctx.beginPath();pctx.moveTo(a.x,a.y);pctx.lineTo(b.x,b.y);
          pctx.strokeStyle=hexToRgba(a.color,(1-d/12000)*0.12);
          pctx.lineWidth=.6;pctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  function hexToRgba(hex,a){
    const h=hex.replace('#','');
    const bigint=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);
    const r=(bigint>>16)&255,g=(bigint>>8)&255,b=bigint&255;
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ---------- Parallax Orbs ---------- */
  function parallaxOrbs(){
    if(prefersReducedMotion||isMobile) return;
    const orb1=$('#orb1'),orb2=$('#orb2');
    document.addEventListener('mousemove',e=>{
      const x=(e.clientX/window.innerWidth-.5)*20;
      const y=(e.clientY/window.innerHeight-.5)*20;
      orb1.style.transform=`translate3d(${x}px,${y}px,0)`;
      orb2.style.transform=`translate3d(${-x}px,${-y}px,0)`;
    });
  }

  /* ---------- 2D Character ---------- */
  const char = {
    el:character,
    x: -80,
    y: 0,
    dir: 1,
    speed: baseSpeed,
    state: 'walking',
    stateUntil: 0,
    mode: 'walk', // walk | swim | hot
    width: isMobile?45:60
  };
  function setCharMode(theme, speedMod){
    // Clear all mode classes
    character.classList.remove('char-walking','char-swimming','char-hot','char-idle','grass-speed','hot-speed');
    let mode = 'walk';
    let yOffset = 0;
    if(theme === 'blue'){
      mode = 'swim';
      yOffset = -25; // half in water
      character.classList.add('char-swimming');
    } else if(theme === 'red' || theme === 'orange'){
      mode = 'hot';
      yOffset = 0;
      character.classList.add('char-walking','char-hot','hot-speed');
    } else if(theme === 'green'){
      mode = 'walk';
      yOffset = 0;
      character.classList.add('char-walking','grass-speed');
    } else {
      // bw normal
      mode = 'walk';
      yOffset = 0;
      character.classList.add('char-walking');
    }
    char.mode = mode;
    char.y = yOffset;
    char.speed = baseSpeed * speedMod;
  }
  function updateCharState(){
    const vw = window.innerWidth;
    const now = performance.now();
    if(char.state==='walking'){
      char.x += char.speed * char.dir;
      if(!character.classList.contains('char-walking') && char.mode !== 'swim'){
        character.classList.add('char-walking');
      }
      character.classList.remove('char-idle');
      // Edge reached
      const stopPoint = vw - char.width - 10;
      if(char.dir===1 && char.x >= stopPoint){
        char.x = stopPoint;
        char.state='idle';
        char.stateUntil = now + 1200 + Math.random()*1200;
        turnChar(-1);
      } else if(char.dir===-1 && char.x <= 10){
        char.x = 10;
        char.state='idle';
        char.stateUntil = now + 1200 + Math.random()*1200;
        turnChar(1);
      }
    } else {
      character.classList.remove('char-walking');
      character.classList.add('char-idle');
      if(now>char.stateUntil) char.state='walking';
    }
    // Direction flip
    const svg = $('#charSvg');
    svg.style.transform = char.dir===-1 ? 'scaleX(-1)' : 'scaleX(1)';
    character.style.transform = `translate3d(${char.x}px,${char.y}px,0)`;
    requestAnimationFrame(updateCharState);
  }
  function turnChar(dir){
    char.dir=dir;
    character.classList.add('char-blinking');
    setTimeout(()=>character.classList.remove('char-blinking'),180);
  }
  function randomBlink(){
    if(!character.classList.contains('char-blinking')){
      character.classList.add('char-blinking');
      setTimeout(()=>character.classList.remove('char-blinking'),150);
    }
    setTimeout(randomBlink,2000+Math.random()*4000);
  }
  // Character click
  character.addEventListener('click', e=>{
    e.stopPropagation();
    const theme = body.getAttribute('data-theme')||'bw';
    const msgs = CHAR_MOODS[theme]?.greetings || ['Hey!'];
    charBubble.textContent = msgs[Math.floor(Math.random()*msgs.length)];
    charBubble.classList.add('show');
    // Jump animation
    character.animate([
      {transform:`translate3d(${char.x}px,${char.y}px,0)`},
      {transform:`translate3d(${char.x}px,${char.y-15}px,0)`},
      {transform:`translate3d(${char.x}px,${char.y}px,0)`}
    ],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});
    createRipple(e.clientX||(char.x+30), e.clientY||(window.innerHeight-40));
    clearTimeout(character._bubbleTO);
    character._bubbleTO = setTimeout(()=>charBubble.classList.remove('show'),2000);
  });

  /* ---------- Smooth Scroll ---------- */
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id = a.getAttribute('href');
      if(id.length<=1) return;
      const tgt = document.querySelector(id);
      if(!tgt) return;
      e.preventDefault();
      const y = tgt.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({top:y,behavior:'smooth'});
    });
  });

  /* ---------- Resize ---------- */
  let resizeTO;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTO);
    resizeTO = setTimeout(()=>{
      resizeCanvas();
      // rebuild scene for new mobile/desktop size
      applyTheme(body.getAttribute('data-theme'));
    },150);
  });

  /* ---------- Init ---------- */
  function init(){
    renderWorld();
    initTheme();
    observeReveals();
    $$('[data-count]').forEach(el=>countIO.observe(el));
    hideLoader();
    if(!prefersReducedMotion){
      initParticles();
      drawParticles();
    }else particlesCanvas.style.display='none';
    parallaxOrbs();
    typeWriter($('#typingSub'), typingPhrases);
    $('#typingTarget').textContent = '14 YEARS OLD STUDENT';
    setTimeout(()=>{
      updateCharState();
      randomBlink();
    },2200);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else init();
})();
