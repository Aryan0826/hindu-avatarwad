const avatars = window.AVATAR_STORIES;
const homeAvatar = avatars.findIndex(a => a.id === 'krishna');
const $ = id => document.getElementById(id);
const dialogs = [$('detail-dialog'), $('settings-dialog')];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active = homeAvatar, paused = false, elapsed = 0, lastFrame = performance.now(), lastActivity = Date.now(), transitionId = 0;
let settings = { duration: 12000, idle: 180000, gentle: matchMedia('(prefers-reduced-motion: reduce)').matches };
try {
 const saved = JSON.parse(localStorage.getItem('avatar-gallery-settings') || 'null');
 if (saved && [8000,12000,18000,24000].includes(saved.duration) && [60000,90000,120000,180000].includes(saved.idle)) settings = {...settings, ...saved};
} catch {}
document.documentElement.classList.toggle('gentle', settings.gentle);
const futureCard = '<span class="future-card" aria-hidden="true"><small>THE TENTH MANIFESTATION</small><strong>Yet to<br>come.</strong><span>A promise of<br>renewed dharma.</span></span>';
const cards = avatars.map((a,i) => {
 const button = document.createElement('button');
 button.className = 'avatar-card'; button.dataset.avatar = a.id;
 button.setAttribute('aria-label', `Explore ${a.name}: ${a.short}`);
 button.innerHTML = `${a.image ? `<img src="${esc(a.image)}" alt="" loading="lazy">` : futureCard}<span class="card-num">${String(i+1).padStart(2,'0')}</span><span class="card-copy"><span class="card-name">${esc(a.name)}</span><span class="card-form">${esc(a.form)}</span><span class="card-theme">${esc(a.theme)}</span><span class="card-arrow" aria-hidden="true">↗</span></span>`;
 button.addEventListener('click', () => openDetail(i)); $('gallery-grid').append(button); return button;
});
function updateCards() {
 cards.forEach((card,i) => { card.classList.toggle('selected', i===active); card.toggleAttribute('aria-current', i===active); if (i===active) card.setAttribute('aria-current','true'); card.querySelector('.now-viewing')?.remove(); if(i===active){const dot=document.createElement('span');dot.className='now-viewing';dot.setAttribute('aria-hidden','true');card.append(dot);} });
}
function select(index, animate=true) {
 active = (index+avatars.length)%avatars.length; elapsed=0;
 const a=avatars[active], token=++transitionId, img=$('hero-img');
 document.documentElement.dataset.avatar=a.id; window.galleryCursor?.sync(a.id);
 $('avatar-motif').setAttribute('d',window.galleryCursor?.pathFor(a.id)||'M12 32H52');
 if(animate&&!settings.gentle) img.classList.add('image-transition');
 const apply=()=>{if(token!==transitionId)return; img.hidden=!a.image; $('hero-future').hidden=!!a.image; $('art-open').classList.toggle('future-frame',!a.image); if(a.image){img.src=a.image;img.alt=a.alt;}else{img.removeAttribute('src');img.alt='';} img.classList.remove('image-transition');};
 if(animate&&!settings.gentle)setTimeout(apply,220);else apply();
 $('feature-count').textContent=`${String(active+1).padStart(2,'0')} / ${String(avatars.length).padStart(2,'0')}`;
 $('feature-theme').textContent=a.theme; $('feature-name').textContent=a.name; $('feature-summary').textContent=a.summary; $('art-sanskrit').textContent=a.sa; $('art-open').setAttribute('aria-label',`Explore ${a.name}`);
 $('featured-copy').classList.remove('transition-copy'); if(animate){void $('featured-copy').offsetWidth;$('featured-copy').classList.add('transition-copy');}
 updateCards(); const next=avatars[(active+1)%avatars.length];if(next.image){const preload=new Image();preload.src=next.image;}
}
function modalOpen(dialog) {
 dialogs.filter(d=>d!==dialog&&d.open).forEach(d=>d.close());dialog.showModal();document.documentElement.classList.add('modal-open');lastActivity=Date.now();window.galleryCursor?.raise();
}
function modalClosed(){if(!dialogs.some(d=>d.open)){document.documentElement.classList.remove('modal-open');elapsed=0;lastFrame=performance.now();}lastActivity=Date.now();$('idle-notice').hidden=true;window.galleryCursor?.raise();}
dialogs.forEach(d=>{d.addEventListener('close',modalClosed);d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});
function renderDetail(){
 const a=avatars[active];
 $('detail-count').textContent=`THE AVATAR GALLERY / ${String(active+1).padStart(2,'0')} OF 10`;
 $('reader-layout').classList.toggle('no-portrait',!a.image);$('reader-art').hidden=!a.image;
 if(a.image){$('detail-img').src=a.image;$('detail-img').alt=a.alt;}else{$('detail-img').removeAttribute('src');$('detail-img').alt='';}
 $('detail-sanskrit').textContent=a.sa;
 $('previous-name').textContent=avatars[(active+avatars.length-1)%avatars.length].name;
 $('next-name').textContent=avatars[(active+1)%avatars.length].name;
 $('reader-content').innerHTML=`<div class="exhibit-inner"><header class="exhibit-heading"><div class="reader-eyebrow">${esc(a.theme)}</div><h2 id="detail-name">${esc(a.name)}</h2><p class="exhibit-form">${esc(a.form)}${a.id==='kalki'?' · A future prophecy':''}</p></header><section class="exhibit-purpose" aria-label="Purpose of this manifestation"><span class="exhibit-label">WHY THIS AVATAR CAME</span><h3>${esc(a.purpose)}</h3><p>${esc(a.mission)}</p></section><aside class="exhibit-takeaway"><span class="exhibit-label">${a.id==='krishna'?'TEACHING TO LIVE BY':'MEANING TO CARRY WITH YOU'}</span><p>${esc(a.takeaway)}</p><ul class="exhibit-values" aria-label="Values highlighted">${a.values.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></aside><section class="exhibit-granth" aria-label="Granths for further reading"><span class="exhibit-label">READ MORE · GRANTH</span><div class="granth-list">${a.granth.map(g=>`<a href="${esc(g.url)}" target="_blank" rel="noopener noreferrer"><span><strong>${esc(g.name)}</strong><small>${esc(g.reference)}</small></span><span class="granth-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></section></div>`;
}
function openDetail(index){
 select(index,false);renderDetail();
 if(!$('detail-dialog').open)modalOpen($('detail-dialog'));
 $('reader-content').scrollTo({top:0,left:0,behavior:'instant'});lastActivity=Date.now();
}
$('discover').addEventListener('click',()=>openDetail(active));$('art-open').addEventListener('click',()=>openDetail(active));$('close-detail').addEventListener('click',()=>$('detail-dialog').close());$('detail-prev').addEventListener('click',()=>openDetail(active-1));$('detail-next').addEventListener('click',()=>openDetail(active+1));$('prev').addEventListener('click',()=>select(active-1));$('next').addEventListener('click',()=>select(active+1));
function syncPlay(){ $('play-icon').textContent=paused?'▶':'Ⅱ';$('play-label').textContent=paused?'Gallery paused':'Gallery in motion';$('play').setAttribute('aria-label',paused?'Resume automatic slideshow':'Pause automatic slideshow'); }
$('play').addEventListener('click',()=>{lastFrame=performance.now();paused=!paused;syncPlay();});
$('about').addEventListener('click',()=>showOpening(0));$('home').addEventListener('click',e=>{e.preventDefault();showOpening(0);});
function toast(message){$('toast').textContent=message;$('toast').hidden=false;setTimeout(()=>$('toast').hidden=true,4500);}
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Use your browser’s fullscreen option for this display.');}catch{toast('Use your browser’s fullscreen option for this display.');}});document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');$('fullscreen').title=document.fullscreenElement?'Exit fullscreen':'Enter fullscreen';window.galleryCursor?.raise();});
$('display-settings').addEventListener('click',()=>{$('slide-duration').value=String(settings.duration);$('idle-duration').value=String(settings.idle);$('reduce-motion').checked=settings.gentle;modalOpen($('settings-dialog'));});$('close-settings').addEventListener('click',()=>$('settings-dialog').close());$('save-settings').addEventListener('click',()=>{settings={duration:Number($('slide-duration').value),idle:Number($('idle-duration').value),gentle:$('reduce-motion').checked};document.documentElement.classList.toggle('gentle',settings.gentle);try{localStorage.setItem('avatar-gallery-settings',JSON.stringify(settings));}catch{}$('settings-dialog').close();elapsed=0;window.galleryCursor?.sync(avatars[active].id);});
for(const event of ['pointerdown','pointermove','keydown','wheel','touchstart','scroll'])document.addEventListener(event,()=>{lastActivity=Date.now();$('idle-notice').hidden=true;},{passive:true,capture:event==='scroll'});$('keep-reading').addEventListener('click',()=>{lastActivity=Date.now();$('idle-notice').hidden=true;});
document.addEventListener('keydown',e=>{if(dialogs.some(d=>d.open)||['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;if(openingStep===0){if(e.key==='ArrowRight'){e.preventDefault();showOpening(openingStep+1);}if(e.key==='ArrowLeft'){e.preventDefault();showOpening(Math.max(0,openingStep-1));}if(e.key==='Escape'){showOpening(1);}return;}if(e.key==='ArrowRight'){e.preventDefault();select(active+1);}if(e.key==='ArrowLeft'){e.preventDefault();select(active-1);}});
document.addEventListener('visibilitychange',()=>{lastFrame=performance.now();});
function frame(now){const delta=Math.max(0,now-lastFrame);lastFrame=now;const open=dialogs.find(d=>d.open);if(!paused&&!open&&!document.hidden&&openingStep===1){elapsed+=delta;if(elapsed>=settings.duration)select(active+1);}$('progress').style.width=`${Math.min(elapsed/settings.duration*100,100)}%`;requestAnimationFrame(frame);}
setInterval(()=>{const open=dialogs.find(d=>d.open);if(!open||document.hidden)return;const idle=Date.now()-lastActivity;if(idle>=settings.idle){open.close();paused=false;syncPlay();elapsed=0;window.scrollTo({top:0});}else if(open===$('detail-dialog')&&idle>=settings.idle-10000){$('idle-notice').hidden=false;$('idle-count').textContent=String(Math.ceil((settings.idle-idle)/1000));}},500);
// A clear two-page journey: the complete shlok, then the avatar gallery.
let openingStep=0;
function showOpening(step){
 openingStep=step>0?1:0;
 dialogs.filter(d=>d.open).forEach(d=>d.close());
 const isOpening=openingStep===0;
 $('opening').hidden=!isOpening;$('gallery-app').hidden=isOpening;
 document.documentElement.classList.toggle('opening-active',isOpening);
 if(isOpening)document.querySelector('.opening-panel').scrollTo({top:0,left:0,behavior:'instant'});
 elapsed=0;lastFrame=performance.now();lastActivity=Date.now();
 window.scrollTo({top:0,left:0,behavior:'instant'});
 (isOpening?$('opening-title'):$('gallery-page-title')).focus({preventScroll:true});
}
$('opening-next').addEventListener('click',()=>showOpening(1));
select(homeAvatar,false);showOpening(0);requestAnimationFrame(frame);
