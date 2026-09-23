import {HOME_FIELDS,HOME_SECTIONS,homeDefaults} from './homepage-model.js?v=20260923-home2';
import {assetURL,escapeHTML as esc,renderText} from './content-model.js?v=20260923-home2';
let copy=homeDefaults();
export const homeText=key=>copy[key]??'';
const lines=text=>String(text).split('\n').map(esc).join('<br>');
function setLabel(el,value){
 // Preserve icons, emphasis and form controls while replacing the label.
 [...el.childNodes].filter(n=>n.nodeType===3||n.nodeName==='BR'||n.nodeType===1&&n.hasAttribute('data-editable-label')).forEach(n=>n.remove());
 const fragment=document.createDocumentFragment();String(value).split('\n').forEach((line,i)=>{if(i)fragment.append(document.createElement('br'));fragment.append(document.createTextNode(line))});el.prepend(fragment);
}
export function applyHome(home){
 copy=home;
 for(const f of HOME_FIELDS){if(!f.selector)continue;document.querySelectorAll(f.selector).forEach(el=>{
  const value=home[f.key];
  if(f.kind==='image'){const src=assetURL(value);if(src)el.src=src;else el.removeAttribute('src');el.hidden=!src;return}
  if(f.attr){el.setAttribute(f.attr,value);return}
  if(f.kind==='label')setLabel(el,value);
  else if(f.kind==='lines')el.innerHTML=lines(value);
  else if(f.kind==='ribbon')el.innerHTML=Array.from({length:3},()=>esc(value)+' <b>✳</b>').join(' ');
  else el.textContent=value;
 });}
 const name=home.brandName,brand=document.querySelector('.brand');if(brand)brand.setAttribute('aria-label',name+' home');
 const about=document.querySelector('#about-title');if(about)about.innerHTML=String(home.aboutTitle).split('\n').map(line=>line.split(/\s+/).filter(Boolean).map(w=>`<span class="word">${esc(w)}</span>`).join(' ')).join('<br>');
 const heading=document.querySelector('#work-heading');if(heading){heading.setAttribute('aria-label',home.workHeading.replaceAll('\n',' '));heading.innerHTML=home.workHeading.split('\n').map(line=>`<span class="work-line" aria-hidden="true">${line.split(/\s+/).filter(Boolean).map(w=>`<span class="kinetic-word">${[...w].map(c=>`<span class="kinetic-char">${esc(c)}</span>`).join('')}</span>`).join(' ')}</span>`).join('')}
 // Turn placeholder social buttons into links without dropping their SVG icons.
 for(const [key,label] of [['telegram','Telegram'],['whatsapp','WhatsApp'],['instagram','Instagram'],['linkedin','LinkedIn']]){
  let el=document.querySelector(`.contact-icons [aria-label^="${label}"]`);if(!el)continue;
  if(el.tagName!=='A'){const a=document.createElement('a');a.className=el.className;a.append(...el.childNodes);el.replaceWith(a);el=a}
  const value=home[key];el.hidden=!value;el.setAttribute('aria-label',label);el.title=label;el.removeAttribute('aria-disabled');el.target='_blank';el.rel='noopener noreferrer';if(value)el.href=value;else el.removeAttribute('href');
 }
 const form=document.querySelector('#email-form');if(form){form.dataset.recipient=home.email;form.querySelector('[type="submit"]').disabled=!home.email;const status=document.querySelector('#email-status');if(status)status.textContent=home.email?home.emailReady:home.emailMissing}
 // Preserve existing sections/handlers; visibility and order change only their container.
 const main=document.querySelector('#main');
 if(main){
  for(const s of HOME_SECTIONS){const el=document.querySelector(s.selector);if(el)el.hidden=!home.visibility[s.id]}
  for(const id of home.order){const spec=HOME_SECTIONS.find(s=>s.id===id),el=document.querySelector(spec.selector);if(el?.parentElement===main)main.append(el)}
  main.querySelectorAll('[data-extra-home]').forEach(el=>el.remove());
  const contact=main.querySelector('#contact');
  for(const section of home.extraSections){if(!section.visible)continue;const el=document.createElement('section');el.className='home-extra container';el.dataset.extraHome=section.id;el.innerHTML=`${section.title?`<h2 class="display">${esc(section.title)}</h2>`:''}${section.image?`<img src="${esc(assetURL(section.image))}" alt="${esc(section.alt)}" loading="lazy">`:''}<div class="custom-section-body">${renderText(section.body)}</div>`;main.insertBefore(el,contact?.parentElement===main?contact:null)}
  for(const [id,hash] of [['work','#work'],['about','#about'],['contact','#contact']])document.querySelectorAll(`a[href="${hash}"]`).forEach(a=>a.hidden=!home.visibility[id]);
 }
}
