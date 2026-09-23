import {applyHome,homeText} from './homepage.js?v=20260923-home2';
import {loadPublished,readDraft,normalizeContent,assetURL,youtubeId,renderText,escapeHTML} from './content-model.js?v=20260923-home2';
document.documentElement.classList.add('js');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:650px)'),clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),ease=x=>x*x*(3-2*x);
let motion=!reduce.matches,scheduled=false,manualPaused=false,heroVisible=true,allowReducedPlayback=false;
const hero=$('.hero'),heroTrack=$('.hero-track'),frame=$('.reel-frame'),video=$('#hero-video'),workTrack=$('.work-track'),cards=$$('.work-card'),about=$('.about'),aboutTitle=$('#about-title'),ribbon=$('.ribbon-content'),contact=$('.contact');
if(aboutTitle)aboutTitle.innerHTML=aboutTitle.innerHTML.replace(/<br\s*\/?\s*>/gi,' ').split(/\s+/).filter(Boolean).map(w=>`<span class="word">${w}</span>`).join(' ');
let heroProgress=clamp(scrollY/(mobile.matches?64:84)),heroTime=0;
let words=$$('.word');
function setMotion(on){motion=on;heroTime=0;heroProgress=clamp(scrollY/(mobile.matches?64:84));allowReducedPlayback=false;document.body.classList.toggle('no-motion',!on);if(!on){frame?.removeAttribute('style');hero?.removeAttribute('style');const sticker=$('.hero-sticker');if(sticker)sticker.style.opacity='1'}$$('.motion-toggle').forEach(b=>{b.setAttribute('aria-pressed',String(on));b.textContent=on?homeText('motionOn'):homeText('motionOff')});syncPlayback();queue()}
function syncPlayback(){if(!video||!video.getAttribute('src'))return;const blocked=manualPaused||!heroVisible||document.hidden||!!$('dialog[open]')||(!motion&&!allowReducedPlayback);if(blocked)video.pause();else video.play().catch(()=>updatePlaybackButton())}
function updatePlaybackButton(){const b=$('#reel-pause');if(b&&video){const label=video.paused?'Resume reel':'Pause reel';b.classList.toggle('is-paused',video.paused);b.setAttribute('aria-label',label);b.title=label}}

if(video){video.muted=true;video.addEventListener('play',updatePlaybackButton);video.addEventListener('pause',updatePlaybackButton);new IntersectionObserver(es=>{heroVisible=es[0].isIntersecting;syncPlayback()},{threshold:.04}).observe(hero);$('#reel-pause')?.addEventListener('click',()=>{manualPaused=!video.paused;allowReducedPlayback=!manualPaused;syncPlayback()});document.addEventListener('visibilitychange',syncPlayback)}
function render(now){scheduled=false;const vh=innerHeight,y=scrollY;$('.scroll-progress').style.transform=`scaleX(${clamp(y/(document.documentElement.scrollHeight-vh))})`;if(!motion)return;
// A short scroll sets the destination; time-based damping softens wheel and touch bursts.
let heroMoving=false;
if(hero&&heroTrack&&frame){
 const target=clamp(y/(mobile.matches?64:84)),dt=heroTime?Math.min(now-heroTime,40):16;
 heroProgress+=(target-heroProgress)*(1-Math.exp(-dt/165));
 heroMoving=Math.abs(target-heroProgress)>.0005;
 if(!heroMoving)heroProgress=target;
 heroTime=heroMoving?now:0;
 const p=heroProgress,q=ease(p),small=mobile.matches,tablet=innerWidth<=1000;
 const text=ease(clamp(p/.82)),intro=ease(clamp(p/.7));
 hero.style.setProperty('--title-x',`${-text*(small?18:45)}px`);
 hero.style.setProperty('--title-y',`${-text*32}px`);
 hero.style.setProperty('--title2-x',`${text*(small?8:28)}px`);
 hero.style.setProperty('--title-s',String(1-text*.035));
 hero.style.setProperty('--title-blur',`${text*3}px`);
 hero.style.setProperty('--title-o',String(1-text));
 hero.style.setProperty('--intro-y',`${-intro*24}px`);
 hero.style.setProperty('--intro-o',String(1-intro));
 const startW=small?78:tablet?53:innerWidth>=1700?46:48,startR=small?9:tablet?5:innerWidth>=1700?(innerWidth-1550)/2/innerWidth*100:6.5,startT=small?28:tablet?23:17,startH=small?(hero.clientWidth*.78*9/16)/hero.clientHeight*100:tablet?45:55;
 frame.style.width=`${startW+(100-startW)*q}%`;
 frame.style.right=`${startR*(1-q)}%`;
 frame.style.top=`${startT*(1-q)}%`;
 frame.style.height=`${startH+(100-startH)*q}%`;
 frame.style.borderRadius=`${(small?12:18)*(1-q)}px`;
 frame.style.transform=`rotate(${(small?6:7)*(1-q)}deg)`;
 hero.style.setProperty('--reel-scale',String(1.035-.035*q));
 hero.style.setProperty('--sticker-r',`${-15+text*20}deg`);
 hero.style.setProperty('--sticker-s',String(1-text*.12));
 $('.hero-sticker').style.opacity=String(1-ease(clamp(p/.65)));
 hero.classList.toggle('hero-expanded',p>.7);
}

const workMoving=renderWork(now,vh);
if(ribbon){const r=ribbon.parentElement.getBoundingClientRect();if(r.top<vh&&r.bottom>0)ribbon.style.transform=`translateX(${-clamp(vh-r.top,0,2000)*.22}px)`}
if(about){const r=about.getBoundingClientRect(),p=clamp((vh*.85-r.top)/(vh*.8));about.style.setProperty('--photo-r',`${-7+p*11}deg`);const t=aboutTitle.getBoundingClientRect(),q=clamp((vh*.84-t.top)/(vh*.48));words.forEach((w,i)=>w.style.opacity=q>i/words.length?'1':'.24')}
if(contact){const r=contact.getBoundingClientRect();contact.style.setProperty('--underline',String(clamp((vh-r.top-vh*.12)/(vh*.6))))}if(heroMoving||workMoving)queue()}
function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
const workHeading=$('#work-heading'),workIntro=$('.work-intro');
const pointer={x:0,y:0,active:false};
let workTime=0,workProgress=0,cardProgress=0;
let letters=[];
if(workHeading){
 workHeading.setAttribute('aria-label','Pick your kind of play.');
 workHeading.innerHTML='<span class="work-line" aria-hidden="true"><span class="kinetic-word">Pick</span> <span class="kinetic-word">your</span></span><span class="work-line" aria-hidden="true"><span class="kinetic-word">kind</span> <span class="kinetic-word">of</span> <span class="kinetic-word play-word">play.</span></span>';
 workHeading.querySelectorAll('.kinetic-word').forEach(word=>word.innerHTML=[...word.textContent].map(c=>`<span class="kinetic-char">${c}</span>`).join(''));
 letters=[...workHeading.querySelectorAll('.kinetic-char')].map(el=>({el,lift:0}));
 if(matchMedia('(pointer:fine)').matches){
  workIntro.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;queue()});
  workIntro.addEventListener('pointerleave',()=>{pointer.active=false;queue()});
 }
}
function renderWork(now,vh){
 if(!workHeading||!workTrack)return false;
 const rect=workHeading.getBoundingClientRect(),stage=workTrack.getBoundingClientRect();
 if(rect.top>vh+200||stage.bottom < -200){workTime=0;return false}
 const dt=workTime?Math.min(now-workTime,40):16,alpha=1-Math.exp(-dt/110);
 const target=ease(clamp((vh*.94-rect.top)/(vh*.52))),cardsTarget=clamp((vh*.96-stage.top)/(vh*.54));
 workProgress+=(target-workProgress)*alpha;cardProgress+=(cardsTarget-cardProgress)*alpha;
 let moving=Math.abs(target-workProgress)>.001||Math.abs(cardsTarget-cardProgress)>.001;
 if(!moving){workProgress=target;cardProgress=cardsTarget}
 const px=pointer.x-rect.left,py=pointer.y-rect.top;
 const centers=letters.map(({el})=>({x:el.parentElement.offsetLeft+el.offsetLeft+el.offsetWidth/2,y:el.parentElement.offsetTop+el.offsetTop+el.offsetHeight/2}));
 letters.forEach((letter,i)=>{
  const distance=Math.hypot(px-centers[i].x,py-centers[i].y),influence=pointer.active?Math.pow(clamp(1-distance/155),2):0;
  const lift=-influence*32;
  letter.lift+=(lift-letter.lift)*alpha;
  if(Math.abs(lift-letter.lift)>.08)moving=true;
  const drift=(1-workProgress)*Math.sin(i*.62+workProgress*2.4);
  letter.el.style.transform=`translate3d(0,${(1-workProgress)*25+drift*19+letter.lift}px,0) rotate(${drift*7+letter.lift*.14}deg)`;
 });
 workHeading.style.setProperty('--play-line',String(workProgress));
 cards.forEach((card,i)=>{
  const p=ease(clamp((cardProgress-i*.07)/.86)),remaining=1-p;
  card.style.setProperty('--cx',`${mobile.matches?0:(1-i)*remaining*48}px`);
  card.style.setProperty('--cy',`${remaining*(mobile.matches?22:65+i*10)}px`);
  card.style.setProperty('--cr',`${mobile.matches?0:(i-1)*remaining*7}deg`);
  card.style.setProperty('--image-reveal',String(1+remaining*.12));
 });
 workTime=moving?now:0;
 return moving;
}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);reduce.addEventListener('change',()=>setMotion(!reduce.matches));$$('.motion-toggle').forEach(b=>b.addEventListener('click',()=>setMotion(!motion)));setMotion(motion);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(e=>observer.observe(e));
if(matchMedia('(pointer:fine)').matches){cards.forEach(c=>{c.addEventListener('pointermove',e=>{if(!motion)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.querySelector('img').style.transform=`scale(1.07) translate(${-x*9}px,${-y*9}px)`});c.addEventListener('pointerleave',()=>c.querySelector('img').style.transform='')})}
$$('dialog').forEach(d=>{d.querySelector('[data-close]')?.addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()});d.addEventListener('close',()=>{document.body.classList.toggle('locked',!!$('dialog[open]'));syncPlayback()})});
$$('[data-contact="Email"]').forEach(b=>b.addEventListener('click',()=>{const d=$('#contact-dialog');d.showModal();document.body.classList.add('locked');syncPlayback()}));
const emailForm=$('#email-form');
if(emailForm){const recipient=()=>emailForm.dataset.recipient?.trim();const submit=emailForm.querySelector('[type="submit"]'),status=$('#email-status');if(recipient()){submit.disabled=false;status.textContent='Your message will open in your email app. Nothing is sent automatically.'}emailForm.addEventListener('submit',e=>{e.preventDefault();if(!recipient()||!emailForm.reportValidity())return;const fields=new FormData(emailForm);const body=`${fields.get('message')}\n\nFrom: ${fields.get('name')}\nReply to: ${fields.get('email')}`;location.href=`mailto:${encodeURIComponent(recipient())}?subject=${encodeURIComponent(fields.get('subject'))}&body=${encodeURIComponent(body)}`;status.textContent=homeText('emailOpened')})}
// Editable collections and mixed-media albums.
const collectionDialog=$('#collection-dialog'),projectDialog=$('#project-dialog');
let collections=[],activeCollection=null,activeProject=null,albumIndex=0;
const isPreview=new URLSearchParams(location.search).has('preview');
const contentReady=(async()=>{try{
 const draft=isPreview?await readDraft().catch(()=>null):null;
 const content=draft?.content?normalizeContent(draft.content):await loadPublished();
 applyHome(content.home);
 words=$$('.word');letters=[...document.querySelectorAll('#work-heading .kinetic-char')].map(el=>({el,lift:0}));
 setMotion(motion);queue();
 collections=content.collections;
 if(draft?.content){const note=document.createElement('div');note.className='preview-banner';note.textContent='پیش‌نمایش — هنوز منتشر نشده';document.body.append(note)}
 collections.forEach(c=>{const card=$(`[data-collection="${c.id}"]`);if(card&&card.classList.contains('work-card')){card.querySelector('h3').textContent=c.title;const img=card.querySelector('img');if(assetURL(c.image))img.src=assetURL(c.image);img.alt=c.title;card.setAttribute('aria-label','Open '+c.title+' gallery')}});
 const heroSource=assetURL(content.settings.heroVideo,'video');
 if(video){const control=$('#reel-pause');if(control)control.hidden=!heroSource;if(heroSource){video.src=heroSource;video.load();syncPlayback()}else{video.pause();video.removeAttribute('src');video.querySelectorAll('source').forEach(s=>s.remove());video.load()}}
 const a=content.settings.analytics;
 if(!isPreview&&a.enabled&&a.scriptUrl&&/^[a-f0-9-]{36}$/i.test(a.websiteId)&&!document.querySelector('script[data-website-id]')){
  const tracker=document.createElement('script');tracker.defer=true;tracker.src=a.scriptUrl;tracker.dataset.websiteId=a.websiteId;document.head.append(tracker);
 }
 return true;
}catch(error){console.warn('Portfolio content could not be loaded.');return false}})();
const galleryArrow='<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m5 19 14-14M5 5h14v14"/></svg>';
function track(name,data){if(!isPreview)window.umami?.track(name,data)}
async function openCollection(id){
 const ready=await contentReady,collection=collections.find(c=>c.id===id);if(!collectionDialog)return;
 activeCollection=collection||null;
 $('#collection-title').textContent=collection?.title||'Work';$('#collection-description').textContent=collection?.description||'';
 $('#collection-kicker').textContent=homeText('galleryKicker');
 const projects=(collection?.projects||[]).filter(p=>p.published);
 $('#collection-count').textContent=`${String(projects.length).padStart(2,'0')} ${homeText('projectsLabel')}`;
 $('#collection-grid').innerHTML=projects.length?projects.map(p=>`<button type="button" class="gallery-item" data-project="${escapeHTML(p.id)}" aria-label="View ${escapeHTML(p.title)} project" aria-haspopup="dialog" aria-controls="project-dialog"><div class="gallery-item-image"><img src="${escapeHTML(assetURL(p.cover)||assetURL(p.media.find(m=>m.type==='image')?.src)||assetURL(collection.image))}" alt="${escapeHTML(p.title)}" width="1200" height="800" loading="lazy"><span class="gallery-open">${galleryArrow}</span></div><div class="gallery-item-meta"><h3>${escapeHTML(p.title)}</h3>${p.kind?`<p>${escapeHTML(p.kind)}</p>`:''}</div></button>`).join(''):`<p class="collection-empty">${escapeHTML(ready?homeText('emptyGallery'):homeText('galleryError'))}</p>`;
 collectionDialog.showModal();collectionDialog.scrollTop=0;document.body.classList.add('locked');syncPlayback();$('#collection-title').focus({preventScroll:true});track('open-collection',{collection:id});
}
function openProject(id){
 if(!activeCollection)return;const projects=activeCollection.projects.filter(p=>p.published),i=projects.findIndex(p=>p.id===id),p=projects[i];if(!p)return;
 activeProject=p;albumIndex=0;$('#detail-position').textContent=`${String(i+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
 $('#project-content').innerHTML=`<div class="detail-heading"><div class="eyebrow">${escapeHTML(activeCollection.title)}</div><h2 class="display" id="detail-title" tabindex="-1">${escapeHTML(p.title)}</h2><p id="detail-subtitle">${escapeHTML(p.subtitle)}</p></div><figure class="album" aria-label="Project media gallery" aria-roledescription="carousel"><div class="album-stage" id="album-stage"></div><figcaption class="album-nav"><span class="album-caption" id="album-caption"></span><span class="album-count" id="album-count" aria-live="polite"></span><div class="album-arrows"><button type="button" data-slide="-1" aria-label="Previous media">←</button><button type="button" data-slide="1" aria-label="Next media">→</button></div></figcaption></figure><dl class="detail-facts">${p.facts.filter(f=>f.label||f.value).map(f=>`<div><dt>${escapeHTML(f.label)}</dt><dd>${escapeHTML(f.value)}</dd></div>`).join('')}</dl>${p.sections.filter(s=>s.heading||s.body).map(s=>`<section class="case-section ${s.heading?'':'no-heading'}">${s.heading?`<h3>${escapeHTML(s.heading)}</h3>`:''}<div class="custom-section-body">${renderText(s.body)}</div></section>`).join('')}<div class="project-end"><span>${escapeHTML(activeCollection.title)}</span><button type="button" data-return-gallery>${escapeHTML(homeText('projectBack'))}</button></div>`;
 renderAlbum();projectDialog.showModal();projectDialog.scrollTop=0;document.body.classList.add('locked');syncPlayback();$('#detail-title').focus({preventScroll:true});track('open-project',{project:p.id,collection:activeCollection.id});
 let startX=0,startY=0;const stage=$('#album-stage');
 stage.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;startY=e.touches[0].clientY},{passive:true});
 stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)stepAlbum(dx<0?1:-1)},{passive:true});
}
function albumMedia(){return (activeProject?.media||[]).filter(m=>m.type==='youtube'?youtubeId(m.src):assetURL(m.src))}
function renderAlbum(){const stage=$('#album-stage');if(!stage)return;const media=albumMedia();if(!media.length){stage.closest('.album').hidden=true;return}
 const m=media[albumIndex],id=m.type==='youtube'?youtubeId(m.src):null;
 stage.innerHTML=id?`<button type="button" class="youtube-start" data-youtube="${id}" aria-label="Play YouTube video"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${escapeHTML(m.alt||activeProject.title)}"><span>${escapeHTML(homeText('watchVideo'))}</span></button>`:`<img src="${escapeHTML(assetURL(m.src))}" alt="${escapeHTML(m.alt||activeProject.title)}" draggable="false">`;
 $('#album-caption').textContent=m.caption;$('#album-count').textContent=`${albumIndex+1} / ${media.length}`;
 $('.album-arrows').hidden=media.length<2;$('#album-count').hidden=media.length<2;$('.album-nav').hidden=media.length<2&&!m.caption;
}
function stepAlbum(direction){const n=albumMedia().length;if(n<2)return;albumIndex=(albumIndex+direction+n)%n;renderAlbum()}
$$('[data-collection]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openCollection(b.dataset.collection)}));
$('#collection-grid')?.addEventListener('click',e=>{const b=e.target.closest('[data-project]');if(b)openProject(b.dataset.project)});
$('#back-to-gallery')?.addEventListener('click',()=>projectDialog.close());
$('#project-content')?.addEventListener('click',e=>{if(e.target.closest('[data-return-gallery]'))projectDialog.close();const slide=e.target.closest('[data-slide]');if(slide)stepAlbum(Number(slide.dataset.slide));const play=e.target.closest('[data-youtube]');if(play){const id=play.dataset.youtube;if(!/^[\w-]{11}$/.test(id))return;$('#album-stage').innerHTML=`<iframe title="${escapeHTML(activeProject.title)} — YouTube video" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;track('play-project-video',{project:activeProject.id})}});
projectDialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){if(['INPUT','TEXTAREA'].includes(e.target.tagName))return;e.preventDefault();stepAlbum(e.key==='ArrowLeft'?-1:1)}});
projectDialog?.addEventListener('close',()=>{const stage=$('#album-stage');if(stage)stage.replaceChildren();activeProject=null});

