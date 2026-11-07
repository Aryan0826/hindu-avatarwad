const avatars = window.AVATAR_STORIES;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dialogs = [$('detail-dialog'), $('settings-dialog')];
const viewport = $('gallery-viewport'), track = $('gallery-track'), group = $('gallery-grid');
let active = 0, openingStep = 0, paused = false, hovered = false, keyboardFocus = false;
let offset = 0, groupWidth = 0, stride = 0, cardWidth = 0, viewportWidth = 0, lastFrame = 0, raf = 0, motionOptIn = false;
let lastActivity = Date.now(), drag = null, suppressClick = false;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let settings = {duration:12000,idle:180000,gentle:reducedMotion.matches};
try {
 const saved = JSON.parse(localStorage.getItem('avatar-gallery-settings') || 'null');
 if(saved && [8000,12000,18000,24000].includes(saved.duration) && [60000,90000,120000,180000].includes(saved.idle)) settings = {...settings,...saved};
} catch {}
document.documentElement.classList.toggle('gentle', settings.gentle);
const cards = avatars.map((a,i) => {
 const button = document.createElement('button');
 button.className='avatar-card';button.dataset.avatar=a.id;button.dataset.index=i;
 button.setAttribute('aria-label',`Explore ${a.name}, ${a.form}. ${a.theme.toLowerCase()}`);
 button.innerHTML=`<span class="card-painting">${a.image?`<img src="${esc(a.image)}" alt="" loading="${i<4?'eager':'lazy'}" decoding="async">`:'<span class="future-card"><span lang="sa">कल्कि</span><strong>Yet to manifest.</strong><small>A future promise of renewed dharma.</small></span>'}<span class="card-num">${String(i+1).padStart(2,'0')}</span></span><span class="card-copy"><span class="card-theme">${esc(a.theme)}</span><span class="card-name">${esc(a.name)}</span><span class="card-form">${esc(a.form)}</span><span class="card-arrow" aria-hidden="true">↗</span></span>`;
 group.append(button);return button;
});
// One accessible set, with visual duplicates for a seamless wrap. Copies remain tappable.
for(let i=0;i<2;i++){
 const copy=group.cloneNode(true);copy.removeAttribute('id');copy.setAttribute('aria-hidden','true');copy.classList.add('gallery-copy');
 copy.querySelectorAll('button').forEach(b=>b.tabIndex=-1);track.append(copy);
}
function normalize(value){return groupWidth?((value%groupWidth)+groupWidth)%groupWidth:0;}
function setActive(index){
 active=(index+avatars.length)%avatars.length;
 document.documentElement.dataset.avatar=avatars[active].id;window.galleryCursor?.sync(avatars[active].id);
}
function paint(){
 offset=normalize(offset);track.style.transform=`translate3d(${-offset}px,0,0)`;
 if(stride&&!$('detail-dialog').open)setActive(Math.floor((offset+viewportWidth/2)/stride)%avatars.length);
}
function measure(){
 const oldWidth=groupWidth;groupWidth=group.getBoundingClientRect().width;
 cardWidth=cards[0].getBoundingClientRect().width;stride=groupWidth/avatars.length;viewportWidth=viewport.clientWidth;
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
 raf=0;if(!canMove()){lastFrame=0;return;}
 const delta=lastFrame?Math.min(now-lastFrame,64):0;lastFrame=now;
 offset+=delta*stride/settings.duration;paint();raf=requestAnimationFrame(frame);
}
function updateMotion(){
 syncPlay();if(canMove()){if(!raf){lastFrame=0;raf=requestAnimationFrame(frame);}}
 else{if(raf)cancelAnimationFrame(raf);raf=0;lastFrame=0;}
}
function moveTo(index){offset=normalize(index*stride-(viewportWidth-cardWidth)/2);paint();}
function stepGallery(direction){moveTo(active+direction);lastActivity=Date.now();}
track.addEventListener('click',e=>{
 const card=e.target.closest('.avatar-card');if(!card)return;
 if(suppressClick){e.preventDefault();return;}openDetail(Number(card.dataset.index));
});
viewport.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;updateMotion();}});
viewport.addEventListener('pointerleave',()=>{hovered=false;if(drag&&!drag.moved)drag=null;updateMotion();});
viewport.addEventListener('focusin',e=>{
 if(e.target.matches('.avatar-card:focus-visible')){keyboardFocus=true;viewport.scrollLeft=0;moveTo(Number(e.target.dataset.index));updateMotion();}
});
viewport.addEventListener('focusout',e=>{if(!viewport.contains(e.relatedTarget)){keyboardFocus=false;updateMotion();}});
viewport.addEventListener('keydown',e=>{
 const card=e.target.closest('.avatar-card');if(!card)return;
 if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
  e.preventDefault();let i=Number(card.dataset.index)+(e.key==='ArrowRight'?1:-1);
  if(e.key==='Home')i=0;if(e.key==='End')i=avatars.length-1;i=(i+avatars.length)%avatars.length;
  keyboardFocus=true;moveTo(i);cards[i].focus({preventScroll:true});updateMotion();
 }
});
viewport.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,start:offset,moved:false};updateMotion();
});
viewport.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;
 const dx=e.clientX-drag.x;if(Math.abs(dx)>8&&!drag.moved){drag.moved=true;suppressClick=true;viewport.setPointerCapture(e.pointerId);}
 if(drag.moved){offset=drag.start-dx;paint();}
});
function finishDrag(e){if(!drag||drag.id!==e.pointerId)return;drag=null;updateMotion();setTimeout(()=>suppressClick=false,0);}
viewport.addEventListener('pointerup',finishDrag);viewport.addEventListener('pointercancel',finishDrag);
viewport.addEventListener('lostpointercapture',e=>{if(drag?.id===e.pointerId){drag=null;updateMotion();}});
viewport.addEventListener('wheel',e=>{
 if(e.ctrlKey)return;const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
 if(delta){e.preventDefault();offset+=delta*(e.deltaMode===1?16:e.deltaMode===2?viewport.clientWidth:1);paint();}
},{passive:false});
$('prev').addEventListener('click',()=>stepGallery(-1));$('next').addEventListener('click',()=>stepGallery(1));
$('play').addEventListener('click',()=>{
 if(isStill()){settings.gentle=false;motionOptIn=true;paused=false;document.documentElement.classList.remove('gentle');updateMotion();return;}
 paused=!paused;updateMotion();
});
function modalOpen(dialog){
 dialogs.filter(d=>d!==dialog&&d.open).forEach(d=>d.close());dialog.showModal();document.documentElement.classList.add('modal-open');lastActivity=Date.now();updateMotion();window.galleryCursor?.raise();
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
 $('reader-art').hidden=false;$('reader-layout').classList.toggle('future-exhibit',!a.image);
 $('detail-img').hidden=!a.image;$('detail-future').hidden=!!a.image;
 if(a.image){$('detail-img').src=a.image;$('detail-img').alt=a.alt;}else{$('detail-img').removeAttribute('src');$('detail-img').alt='';}
 $('detail-name').textContent=a.name;$('detail-theme').textContent=a.theme;$('detail-form').textContent=a.form;$('detail-sanskrit').textContent=a.sa;
 $('previous-name').textContent=avatars[(active+avatars.length-1)%avatars.length].name;$('next-name').textContent=avatars[(active+1)%avatars.length].name;
 $('reader-content').innerHTML=`<div class="exhibit-inner"><section class="exhibit-purpose" aria-labelledby="intent-title"><p class="intent-question">Intent behind this avatar</p><h3 id="intent-title">${esc(a.purpose)}</h3><p>${esc(a.mission)}</p></section><aside class="exhibit-takeaway"><span class="exhibit-label">${a.id==='krishna'?'TEACHING TO LIVE BY':'MEANING TO CARRY WITH YOU'}</span><p>${esc(a.takeaway)}</p><ul class="exhibit-values" aria-label="Values highlighted">${a.values.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></aside><section class="exhibit-shaastra" aria-label="Shaastra references for further reading"><span class="exhibit-label">FURTHER READING · SHAASTRA</span><div class="shaastra-list">${a.shaastra.map(g=>`<p><strong>${esc(g.name)}</strong><span>${esc(g.reference)}</span></p>`).join('')}</div></section></div>`;
 $('reader-content').scrollTo({top:0,left:0,behavior:'instant'});
}
function openDetail(index){setActive(index);renderDetail();if(!$('detail-dialog').open)modalOpen($('detail-dialog'));lastActivity=Date.now();}
$('close-detail').addEventListener('click',()=>$('detail-dialog').close());$('detail-prev').addEventListener('click',()=>openDetail(active-1));$('detail-next').addEventListener('click',()=>openDetail(active+1));
$('about').addEventListener('click',()=>showOpening(0));$('home').addEventListener('click',e=>{e.preventDefault();showOpening(0);});
function toast(message){$('toast').textContent=message;$('toast').hidden=false;setTimeout(()=>$('toast').hidden=true,4500);}
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Use your browser’s fullscreen option for this display.');}catch{toast('Use your browser’s fullscreen option for this display.');}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');$('fullscreen').title=document.fullscreenElement?'Exit fullscreen':'Enter fullscreen';window.galleryCursor?.raise();});
$('display-settings').addEventListener('click',()=>{$('slide-duration').value=String(settings.duration);$('idle-duration').value=String(settings.idle);$('reduce-motion').checked=settings.gentle;modalOpen($('settings-dialog'));});
$('close-settings').addEventListener('click',()=>$('settings-dialog').close());
$('save-settings').addEventListener('click',()=>{
 settings={duration:Number($('slide-duration').value),idle:Number($('idle-duration').value),gentle:$('reduce-motion').checked};
 motionOptIn=!settings.gentle;document.documentElement.classList.toggle('gentle',settings.gentle);try{localStorage.setItem('avatar-gallery-settings',JSON.stringify(settings));}catch{}
 $('settings-dialog').close();updateMotion();
});
for(const event of ['pointerdown','pointermove','keydown','wheel','touchstart','scroll'])document.addEventListener(event,()=>{lastActivity=Date.now();$('idle-notice').hidden=true;},{passive:true,capture:event==='scroll'});
$('keep-reading').addEventListener('click',()=>{lastActivity=Date.now();$('idle-notice').hidden=true;});
document.addEventListener('keydown',e=>{
 if(dialogs.some(d=>d.open)||['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;
 if(openingStep===0){if(e.key==='ArrowRight'){e.preventDefault();showOpening(1);}return;}
 if(viewport.contains(e.target))return;
 if(e.key==='ArrowRight'){e.preventDefault();stepGallery(1);}if(e.key==='ArrowLeft'){e.preventDefault();stepGallery(-1);}
});
document.addEventListener('visibilitychange',updateMotion);reducedMotion.addEventListener('change',updateMotion);
setInterval(()=>{
 const open=dialogs.find(d=>d.open);if(!open||document.hidden)return;const idle=Date.now()-lastActivity;
 if(idle>=settings.idle){open.close();paused=false;hovered=false;keyboardFocus=false;updateMotion();}
 else if(open===$('detail-dialog')&&idle>=settings.idle-10000){$('idle-notice').hidden=false;$('idle-count').textContent=String(Math.ceil((settings.idle-idle)/1000));}
},500);
function showOpening(step){
 openingStep=step>0?1:0;dialogs.filter(d=>d.open).forEach(d=>d.close());const isOpening=openingStep===0;
 $('opening').hidden=!isOpening;$('gallery-app').hidden=isOpening;document.documentElement.classList.toggle('opening-active',isOpening);
 if(isOpening)document.querySelector('.opening-panel').scrollTo({top:0,left:0,behavior:'instant'});
 lastActivity=Date.now();hovered=false;keyboardFocus=false;window.scrollTo({top:0,left:0,behavior:'instant'});
 (isOpening?$('opening-title'):$('gallery-page-title')).focus({preventScroll:true});if(!isOpening)measure();updateMotion();
}
$('opening-next').addEventListener('click',()=>showOpening(1));
new ResizeObserver(()=>{if(openingStep===1)measure();}).observe(viewport);
showOpening(0);setActive(0);
