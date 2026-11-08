const avatars = window.AVATAR_STORIES;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dialogs = [$('detail-dialog'), $('settings-dialog')];
const viewport = $('gallery-viewport'), track = $('gallery-track'), group = $('gallery-grid');
let active = 0, openingStep = 0, paused = false, hovered = false, keyboardFocus = false;
let offset = 0, groupWidth = 0, stride = 0, cardWidth = 0, viewportWidth = 0, lastFrame = 0, raf = 0, motionOptIn = false;
let lastActivity = Date.now(), drag = null, suppressClick = false;
let positions = [], visibleStops = [], galleryStop = 0, tiltCard = null, tiltBounds = null, navigation = null;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let settings = {duration:12000,idle:180000,gentle:reducedMotion.matches};
try {
 const saved = JSON.parse(localStorage.getItem('avatar-gallery-settings') || 'null');
 if(saved && Number.isFinite(saved.duration) && saved.duration>=4000 && saved.duration<=48000 && [60000,90000,120000,180000].includes(saved.idle)) settings = {...settings,...saved};
} catch {}
document.documentElement.classList.toggle('gentle', settings.gentle);
const cards = avatars.map((a,i) => {
 const button = document.createElement('button');
 button.className='avatar-card';button.dataset.avatar=a.id;button.dataset.index=i;
 button.setAttribute('aria-label',`Explore ${a.name}, ${a.form}. ${a.theme.toLowerCase()}`);
 button.innerHTML=`<span class="card-surface"><span class="card-painting">${a.image?`<img src="${esc(a.image)}" alt="" loading="${i<4?'eager':'lazy'}" decoding="async" draggable="false">`:'<span class="future-card"><span lang="sa">कल्कि</span><strong>Yet to incarnate.</strong><small>A future promise of renewed dharma.</small></span>'}<span class="card-num">${String(i+1).padStart(2,'0')}</span></span><span class="card-copy"><span class="card-topline"><span class="card-theme">${esc(a.theme)}</span><svg class="card-emblem" viewBox="0 0 64 64" aria-hidden="true"><path d="${esc(window.galleryCursor?.pathFor(a.id)||'M12 32H52')}"/></svg></span><span class="card-title-row"><span class="card-name">${esc(a.name)}</span><span class="card-sanskrit" lang="sa">${esc(a.sa)}</span></span><span class="card-form">${esc(a.form)}</span><span class="card-arrow" aria-hidden="true">↗</span></span></span>`;
 group.append(button);return button;
});
const introStop=document.createElement('button');
introStop.className='intro-stop';introStop.dataset.intro='true';introStop.setAttribute('aria-label','Why Bhagwan incarnates: explore Bhagavad Gita 4.7–8');
introStop.innerHTML=`<span class="intro-portal"><svg class="portal-lotus" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="48"/><circle cx="60" cy="60" r="40"/><path d="M60 82C28 68 28 48 34 37C49 39 58 58 60 82ZM60 82C92 68 92 48 86 37C71 39 62 58 60 82ZM60 80C39 53 46 32 60 22C74 32 81 53 60 80ZM32 87H88"/></svg><span class="portal-reference">BHAGAVAD GITA 4.7–8</span><span class="portal-title">Why Bhagwan<br><em>incarnates.</em></span><span class="portal-shlok" lang="sa">यदा यदा हि धर्मस्य…</span><span class="portal-action">Explore the shlok <span aria-hidden="true">→</span></span></span>`;
group.append(introStop);
const stops=[...cards,introStop];
// One accessible set, with visual duplicates for a seamless wrap. Copies remain tappable.
for(let i=0;i<2;i++){
 const copy=group.cloneNode(true);copy.removeAttribute('id');copy.setAttribute('aria-hidden','true');copy.classList.add('gallery-copy');
 copy.querySelectorAll('button').forEach(b=>b.tabIndex=-1);track.append(copy);
}
const renderedStops=Array.from(track.querySelectorAll('.avatar-card,.intro-stop'));
// Visual copies must never become focus targets when tapped.
track.addEventListener('pointerdown',e=>{if(e.target.closest('.gallery-copy'))e.preventDefault();});
function normalize(value){return groupWidth?((value%groupWidth)+groupWidth)%groupWidth:0;}
function setActive(index){
 active=(index+avatars.length)%avatars.length;
 document.documentElement.dataset.avatar=avatars[active].id;window.galleryCursor?.sync(avatars[active].id);
}
function paint(){
 offset=normalize(offset);track.style.transform=`translate3d(${-offset}px,0,0)`;
 if(!positions.length)return;
 const midpoint=(offset+viewportWidth/2)%groupWidth;
 let nearest=0,best=Infinity;
 positions.forEach((p,i)=>{const raw=Math.abs(p.center-midpoint),d=Math.min(raw,groupWidth-raw);if(d<best){nearest=i;best=d;}});
 galleryStop=nearest;
 if(!$('detail-dialog').open&&nearest<avatars.length)setActive(nearest);
 const gentle=isStill();
 visibleStops.forEach(r=>{r.el.style.removeProperty('--depth');r.el.style.removeProperty('--yaw');});visibleStops=[];
 renderedStops.forEach((el,i)=>{
  const p=positions[i%stops.length],x=p.center+Math.floor(i/stops.length)*groupWidth-offset;
  if(x<-p.width||x>viewportWidth+p.width)return;
  const distance=Math.max(-1,Math.min(1,(x-viewportWidth/2)/(viewportWidth*.62)));
  el.style.setProperty('--yaw',`${gentle?0:-distance*11}deg`);
  el.style.setProperty('--depth',`${gentle?0:18*(1-Math.abs(distance))}px`);
  visibleStops.push({el});
 });
}
function measure(){
 navigation=null;
 const oldWidth=groupWidth;groupWidth=group.offsetWidth;
 cardWidth=cards[0].offsetWidth;viewportWidth=viewport.clientWidth;
 positions=stops.map(el=>({left:el.offsetLeft,width:el.offsetWidth,center:el.offsetLeft+el.offsetWidth/2}));
 stride=positions[1].left-positions[0].left;
 if(oldWidth)offset=offset/oldWidth*groupWidth;
 paint();updateMotion();
}
function isStill(){return settings.gentle||(reducedMotion.matches&&!motionOptIn);}
function canMove(){return openingStep===1&&!paused&&!isStill()&&!hovered&&!keyboardFocus&&!drag&&!document.hidden&&!dialogs.some(d=>d.open);}
function syncPlay(){
 const still=isStill();
 $('play-icon').textContent=paused||still?'▶':'Ⅱ';$('play-label').textContent=paused||still?'Play gallery':'Pause gallery';
 $('play').setAttribute('aria-label',paused||still?'Start moving gallery':'Pause moving gallery');
 $('play').setAttribute('aria-pressed',String(paused||still));
}
function frame(now){
 raf=0;
 if(navigation){
  const t=Math.min(1,Math.max(0,(now-navigation.start)/460));
  offset=navigation.from+(navigation.to-navigation.from)*(1-Math.pow(1-t,3));paint();
  if(t===1)navigation=null;
  lastFrame=now;if(navigation||canMove())raf=requestAnimationFrame(frame);else lastFrame=0;return;
 }
 if(!canMove()){lastFrame=0;return;}
 const delta=lastFrame?Math.min(now-lastFrame,64):0;lastFrame=now;
 offset+=delta*stride/settings.duration;paint();raf=requestAnimationFrame(frame);
}
function updateMotion(){
 syncPlay();if(canMove()||navigation){if(!raf){lastFrame=0;raf=requestAnimationFrame(frame);}}
 else{if(raf)cancelAnimationFrame(raf);raf=0;lastFrame=0;}
}
function moveTo(index,animate=false){
 index=(index+stops.length)%stops.length;const target=normalize(positions[index].center-viewportWidth/2);
 if(animate&&!isStill()){
  let delta=target-offset;if(delta>groupWidth/2)delta-=groupWidth;if(delta<-groupWidth/2)delta+=groupWidth;
  navigation={from:offset,to:offset+delta,index,start:performance.now()};updateMotion();
 }else{navigation=null;offset=target;paint();}
}
function stepGallery(direction){moveTo((navigation?.index??galleryStop)+direction,true);lastActivity=Date.now();}
track.addEventListener('click',e=>{
 const card=e.target.closest('.avatar-card,.intro-stop');if(!card)return;
 if(card.dataset.intro){if(!suppressClick)showOpening(0);return;}
 if(suppressClick){e.preventDefault();return;}openDetail(Number(card.dataset.index));
});
viewport.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;updateMotion();}});
function clearTilt(){if(tiltCard){tiltCard.style.removeProperty('--tilt-x');tiltCard.style.removeProperty('--tilt-y');tiltCard=null;tiltBounds=null;}}
viewport.addEventListener('pointerleave',()=>{hovered=false;clearTilt();if(drag&&!drag.moved)drag=null;updateMotion();});
viewport.addEventListener('focusin',e=>{
 if(e.target.matches('.avatar-card:focus-visible,.intro-stop:focus-visible')){keyboardFocus=true;viewport.scrollLeft=0;moveTo(e.target.dataset.intro?10:Number(e.target.dataset.index));updateMotion();}
});
viewport.addEventListener('focusout',e=>{if(!viewport.contains(e.relatedTarget)){keyboardFocus=false;updateMotion();}});
viewport.addEventListener('keydown',e=>{
 const card=e.target.closest('.avatar-card,.intro-stop');if(!card)return;
 if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
  e.preventDefault();let i=(card.dataset.intro?10:Number(card.dataset.index))+(e.key==='ArrowRight'?1:-1);
  if(e.key==='Home')i=0;if(e.key==='End')i=stops.length-1;i=(i+stops.length)%stops.length;
  keyboardFocus=true;moveTo(i);stops[i].focus({preventScroll:true});updateMotion();
 }
});
viewport.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;navigation=null;clearTilt();drag={id:e.pointerId,x:e.clientX,start:offset,moved:false};updateMotion();
});
viewport.addEventListener('pointermove',e=>{
 if(!drag){
  if(e.pointerType!=='mouse'||isStill())return;
  const card=e.target.closest('.avatar-card');
  if(card!==tiltCard){clearTilt();if(card){tiltCard=card;tiltBounds=card.getBoundingClientRect();}}
  if(card&&tiltBounds){const px=Math.max(0,Math.min(1,(e.clientX-tiltBounds.left)/tiltBounds.width)),py=Math.max(0,Math.min(1,(e.clientY-tiltBounds.top)/tiltBounds.height));card.style.setProperty('--tilt-x',`${(0.5-py)*4}deg`);card.style.setProperty('--tilt-y',`${(px-0.5)*5}deg`);card.style.setProperty('--light-x',`${px*100}%`);card.style.setProperty('--light-y',`${py*100}%`);}
  return;
 }
 if(drag.id!==e.pointerId)return;
 const dx=e.clientX-drag.x;if(Math.abs(dx)>8&&!drag.moved){drag.moved=true;suppressClick=true;viewport.setPointerCapture(e.pointerId);}
 if(drag.moved){offset=drag.start-dx;paint();}
});
function finishDrag(e){if(!drag||drag.id!==e.pointerId)return;drag=null;updateMotion();setTimeout(()=>suppressClick=false,0);}
viewport.addEventListener('pointerup',finishDrag);viewport.addEventListener('pointercancel',finishDrag);
viewport.addEventListener('lostpointercapture',e=>{if(drag?.id===e.pointerId){drag=null;updateMotion();}});
viewport.addEventListener('wheel',e=>{
 if(e.ctrlKey)return;const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
 if(delta){e.preventDefault();navigation=null;offset+=delta*(e.deltaMode===1?16:e.deltaMode===2?viewportWidth:1);paint();}
},{passive:false});
$('prev').addEventListener('click',()=>stepGallery(-1));$('next').addEventListener('click',()=>stepGallery(1));
$('play').addEventListener('click',()=>{
 if(isStill()){settings.gentle=false;motionOptIn=true;paused=false;document.documentElement.classList.remove('gentle');updateMotion();return;}
 paused=!paused;updateMotion();
});
function modalOpen(dialog){
 navigation=null;clearTilt();dialogs.filter(d=>d!==dialog&&d.open).forEach(d=>d.close());dialog.showModal();document.documentElement.classList.add('modal-open');lastActivity=Date.now();updateMotion();window.galleryCursor?.raise();
}
function modalClosed(){
 if(!dialogs.some(d=>d.open))document.documentElement.classList.remove('modal-open');
 lastActivity=Date.now();$('idle-notice').hidden=true;updateMotion();window.galleryCursor?.raise();
}
dialogs.forEach(d=>{
 d.addEventListener('close',modalClosed);
 d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});
});
function renderDetail(){
 const a=avatars[active];$('detail-count').textContent=`THE AVATAR GALLERY / ${String(active+1).padStart(2,'0')} OF 10`;
 $('reader-layout').dataset.avatar=a.id;
 $('reader-art').hidden=false;$('reader-layout').classList.toggle('future-exhibit',!a.image);
 $('detail-img').hidden=!a.image;$('detail-future').hidden=!!a.image;
 if(a.image){$('detail-img').src=a.image;$('detail-img').alt=a.alt;}else{$('detail-img').removeAttribute('src');$('detail-img').alt='';}
 $('detail-name').textContent=a.name;$('detail-theme').textContent=a.theme;$('detail-form').textContent=a.form;$('detail-sanskrit').textContent=a.sa;
 $('previous-name').textContent=avatars[(active+avatars.length-1)%avatars.length].name;$('next-name').textContent=avatars[(active+1)%avatars.length].name;
 $('exhibit-content').innerHTML=`<section class="exhibit-purpose" aria-labelledby="intent-title"><p class="intent-question">Intent behind this avatar</p><h3 id="intent-title">${esc(a.purpose)}</h3><p>${esc(a.mission)}</p></section><aside class="exhibit-takeaway"><span class="exhibit-label">${a.id==='krishna'?'TEACHING TO LIVE BY':'MEANING TO CARRY WITH YOU'}</span><p>${esc(a.takeaway)}</p><ul class="exhibit-values" aria-label="Values highlighted">${a.values.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></aside><section class="exhibit-shaastra" aria-label="Shaastra references to find out more"><span class="exhibit-label">FIND OUT MORE · SHAASTRA</span><div class="shaastra-list">${a.shaastra.map(g=>`<p><strong>${esc(g.name)}</strong><span>${esc(g.reference)}</span></p>`).join('')}</div></section>`;
 $('reader-content').scrollTo({top:0,left:0,behavior:'instant'});
}
function openDetail(index){setActive(index);renderDetail();if(!$('detail-dialog').open)modalOpen($('detail-dialog'));lastActivity=Date.now();}
$('close-detail').addEventListener('click',()=>$('detail-dialog').close());$('detail-prev').addEventListener('click',()=>openDetail(active-1));$('detail-next').addEventListener('click',()=>openDetail(active+1));
function toast(message){$('toast').textContent=message;$('toast').hidden=false;setTimeout(()=>$('toast').hidden=true,4500);}
function fullscreenFallback(){$('fullscreen-status').hidden=false;$('fullscreen-status').textContent='Use your browser’s fullscreen option (usually F11).';}
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else fullscreenFallback();}catch{fullscreenFallback();}});
document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement?'Exit fullscreen':'Enter fullscreen';$('fullscreen').setAttribute('aria-label',label);$('fullscreen-label').textContent=label;window.galleryCursor?.raise();});
$('display-settings').addEventListener('click',()=>{$('slide-duration').value=String(Math.round(1200000/settings.duration/5)*5);syncSpeedPreview();$('idle-duration').value=String(settings.idle);$('reduce-motion').checked=settings.gentle;modalOpen($('settings-dialog'));});
$('close-settings').addEventListener('click',()=>$('settings-dialog').close());
function syncSpeedPreview(){
 const speed=Number($('slide-duration').value)/100;
 const pace=speed<=.5?'Meditative':speed<1?'Unhurried':speed===1?'Exhibition pace':speed<=1.5?'Flowing':speed<=2?'Brisk':'Lively';
 $('speed-value').textContent=`${speed}× · ${pace}`;
 $('slide-duration').setAttribute('aria-valuetext',`${speed} times speed, ${pace}`);
 $('slide-duration').style.setProperty('--range-progress',`${(speed-.25)/2.75*100}%`);
}
$('slide-duration').addEventListener('input',syncSpeedPreview);
$('reset-speed').addEventListener('click',()=>{$('slide-duration').value='100';syncSpeedPreview();});
syncSpeedPreview();
$('save-settings').addEventListener('click',()=>{
 settings={duration:1200000/Number($('slide-duration').value),idle:Number($('idle-duration').value),gentle:$('reduce-motion').checked};
 motionOptIn=!settings.gentle;document.documentElement.classList.toggle('gentle',settings.gentle);try{localStorage.setItem('avatar-gallery-settings',JSON.stringify(settings));}catch{}
 $('settings-dialog').close();updateMotion();
});
for(const event of ['pointerdown','pointermove','keydown','wheel','touchstart','scroll'])document.addEventListener(event,()=>{lastActivity=Date.now();$('idle-notice').hidden=true;},{passive:true,capture:event==='scroll'});
$('keep-reading').addEventListener('click',()=>{lastActivity=Date.now();$('idle-notice').hidden=true;});
document.addEventListener('keydown',e=>{
 if(dialogs.some(d=>d.open)||['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;
 if(openingStep===0){if(e.key==='ArrowRight'||e.key==='Escape'){e.preventDefault();showOpening(1);}return;}
 if(viewport.contains(e.target))return;
 if(e.key==='ArrowRight'){e.preventDefault();stepGallery(1);}if(e.key==='ArrowLeft'){e.preventDefault();stepGallery(-1);}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)navigation=null;updateMotion();});reducedMotion.addEventListener('change',updateMotion);
setInterval(()=>{
 const open=dialogs.find(d=>d.open);if(!open||document.hidden)return;const idle=Date.now()-lastActivity;
 if(idle>=settings.idle){open.close();paused=false;hovered=false;keyboardFocus=false;updateMotion();}
 else if(open===$('detail-dialog')&&idle>=settings.idle-10000){$('idle-notice').hidden=false;$('idle-count').textContent=String(Math.ceil((settings.idle-idle)/1000));}
},500);
function showOpening(step){
 navigation=null;clearTilt();
 openingStep=step>0?1:0;dialogs.filter(d=>d.open).forEach(d=>d.close());const isOpening=openingStep===0;
 $('opening').hidden=!isOpening;$('gallery-app').hidden=isOpening;document.documentElement.classList.toggle('opening-active',isOpening);
 if(isOpening)document.querySelector('.opening-panel').scrollTo({top:0,left:0,behavior:'instant'});
 lastActivity=Date.now();hovered=false;keyboardFocus=false;window.scrollTo({top:0,left:0,behavior:'instant'});
 (isOpening?$('opening-title'):$('gallery-page-title')).focus({preventScroll:true});if(!isOpening)measure();updateMotion();
}
$('opening-close').addEventListener('click',()=>showOpening(1));
new ResizeObserver(()=>{if(openingStep===1)measure();}).observe(viewport);
showOpening(0);setActive(0);
