/* A single top-layer SVG follows input with compositor transforms. No image downloads,
   canvas redraws, particle arrays, or recurring JS work once the follower settles. */
(() => {
 const el=document.getElementById('gallery-cursor');
 if(!el || !('showPopover' in el))return;
 const fine=matchMedia('(hover: hover) and (pointer: fine)'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const point=el.querySelector('.cursor-point'),aura=el.querySelector('.cursor-aura'),sigil=document.getElementById('cursor-sigil'),outline=document.getElementById('cursor-sigil-outline');
 const motifs={
  matsya:['M17 23Q26 13 39 23T55 23M13 32Q25 22 39 32T57 32M17 41Q28 31 42 41','#a9d8d5'],
  kurma:['M32 17C20 17 15 25 15 36C15 47 23 53 32 53C41 53 49 47 49 36C49 25 44 17 32 17ZM27 17C21 10 25 5 32 5C39 5 43 10 37 17M18 25C11 18 7 22 10 29L15 34M46 25C53 18 57 22 54 29L49 34M19 47L12 51L11 45L16 40M45 47L52 51L53 45L48 40M29 53L32 59L35 53M32 25L40 30V40L32 45L24 40V30ZM32 17V25M16 30H24M48 30H40M20 48L25 40M44 48L39 40','#d8e7b4'],
  varaha:['M55 32A23 23 0 1 1 9 32A23 23 0 1 1 55 32ZM17 16L25 15L28 21L23 25L24 31L18 31L15 24L12 23M24 31L31 34L29 42L25 49L22 40ZM38 11L37 17L31 20L33 25L39 26L43 32L50 30L54 34M34 27L42 29L43 36L37 44L33 38L31 32ZM46 44L51 44L52 48L46 49Z','#aee5ce'],
  narasimha:['M21 14Q24 32 12 49M34 12Q38 32 26 52M47 15Q51 33 40 50','#f3b67d'],
  vamana:['M32 20C25 14 14 14 9 17V45C17 41 25 43 32 49C39 43 47 41 55 45V17C50 14 39 14 32 20ZM32 20V49M15 24Q22 22 27 26M15 31Q22 29 27 33M37 26Q43 22 49 24M37 33Q43 29 49 31M32 5V10M22 8L25 12M42 8L39 12','#ffe1a0'],
  parashurama:['M23 7L28 5L45 48L40 50ZM35 33C26 38 21 35 18 27C7 44 18 58 40 58C31 52 30 47 38 43ZM18 30C11 44 22 54 36 56M28 19L33 17M32 28L37 26M37 39L42 37','#ffd0a0'],
  rama:['M22 12Q53 32 22 52M22 12V52M14 32H50','#bfcea8'],
  krishna:['M9 44L49 15L54 22L14 51ZM15 43L19 48M44 18L49 25M23 39L25 41M30 34L32 36M37 29L39 31M54 22L58 30L54 33M18 18C13 12 17 6 24 8C31 10 30 21 22 25C21 21 19 18 18 18ZM23 15L22 25L18 31','#d5d7ff'],
  buddha:['M32 46Q12 35 15 23Q29 23 32 46M32 46Q52 35 49 23Q35 23 32 46M32 44Q20 22 32 12Q44 22 32 44','#e9cfac'],
  kalki:['M12 42H52M19 32H45M26 22H38','#dfd7be']
 };
 let enabled=false,selected='krishna',hovered='',current='',x=0,y=0,fx=0,fy=0,seen=false,raf=0,last=0;
 function motif(id){if(current===id)return;current=id;const [path,color]=motifs[id]||motifs.krishna;sigil.setAttribute('d',path);outline.setAttribute('d',path);el.style.setProperty('--cursor-ink',color);el.dataset.avatar=id;}
 function raise(){if(!enabled)return;try{if(el.matches(':popover-open'))el.hidePopover();el.showPopover();}catch{disable();}}
 function disable(){enabled=false;document.documentElement.classList.remove('cursor-ready');el.classList.remove('visible');if(raf)cancelAnimationFrame(raf);raf=0;try{if(el.matches(':popover-open'))el.hidePopover();}catch{}}
 function setup(){if(!fine.matches){disable();return;}enabled=true;raise();if(enabled)document.documentElement.classList.add('cursor-ready');}
 function draw(now){raf=0;const dt=Math.min(40,now-(last||now-16));last=now;const gentle=reduced.matches||document.documentElement.classList.contains('gentle');const k=gentle?1:1-Math.exp(-dt/48);fx+=(x-fx)*k;fy+=(y-fy)*k;aura.style.transform=`translate3d(${fx.toFixed(2)}px,${fy.toFixed(2)}px,0)`;if(Math.abs(x-fx)+Math.abs(y-fy)>.08)raf=requestAnimationFrame(draw);else{last=0;}}
 function hide(){el.classList.remove('visible');seen=false;if(raf)cancelAnimationFrame(raf);raf=0;last=0;}
 document.addEventListener('pointermove',e=>{
  if(!enabled||e.pointerType==='touch')return;
  x=e.clientX;y=e.clientY;point.style.transform=`translate3d(${x}px,${y}px,0)`;
  if(!seen){fx=x;fy=y;seen=true;el.classList.add('visible');}
  const card=e.target.closest?.('.avatar-card[data-avatar]');hovered=card?.dataset.avatar||'';motif(hovered||selected);
  el.classList.toggle('interactive',!!e.target.closest?.('button,a,summary,select,input'));
  if(!raf)raf=requestAnimationFrame(draw);
 },{passive:true});
 document.addEventListener('pointerdown',()=>{if(enabled)el.classList.add('pressed');},{passive:true});
 document.addEventListener('pointerup',()=>el.classList.remove('pressed'),{passive:true});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)hide();},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Tab')hide();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});window.addEventListener('blur',hide);
 fine.addEventListener('change',setup);
 window.galleryCursor={pathFor(id){return (motifs[id]||motifs.krishna)[0];},sync(id){selected=id;motif(hovered||selected);},raise};setup();motif(selected);
})();
