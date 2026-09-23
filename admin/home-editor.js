import {HOME_FIELDS,HOME_GROUPS,HOME_SECTIONS} from '../homepage-model.js?v=20260923-images3';
import {assetURL,safeAsset,httpsURL,escapeHTML as esc} from '../content-model.js?v=20260923-images3';

export function homeEditor({getContent,changed,imageData,notify}){
 const root=document.querySelector('#home-editor');
 const imageField=(label,value,attrs)=>`<div class="home-image-field"><label>${label}<input dir="ltr" ${attrs} value="${esc(value.startsWith('data:')?'':value)}" placeholder="https://… یا assets/…"></label>${value?`<img class="home-image-preview" src="${esc(assetURL(value))}" alt="پیش‌نمایش عکس">`:''}<label class="upload-button">آپلود عکس<input type="file" ${attrs.replaceAll('data-home-key','data-home-upload').replaceAll('data-collection-field="image"','data-collection-upload').replaceAll('data-extra-field="image"','data-extra-upload')} accept="image/jpeg,image/png,image/webp,image/gif"></label><button type="button" class="text-button" data-image-clear ${attrs}>حذف عکس</button><p class="help">JPG، PNG، WebP یا GIF؛ حداکثر ۱۲ مگابایت. عکس با انتشار در سایت ذخیره می‌شود.</p></div>`;
 const field=f=>{const value=getContent().home[f.key],attrs=`data-home-key="${f.key}"`;if(f.kind==='image')return imageField(f.label,value,attrs);return `<label>${esc(f.label)}${['lines','label','ribbon'].includes(f.kind)||value.length>110?`<textarea dir="auto" rows="${value.length>110?3:2}" ${attrs}>${esc(value)}</textarea>`:`<input dir="${['email','link'].includes(f.kind)?'ltr':'auto'}" ${attrs} value="${esc(value)}">`}</label>`};
 function render(){
  const c=getContent();if(!c)return;const h=c.home;
  const open=new Set([...root.querySelectorAll('details[open]')].map(x=>x.dataset.group));
  if(!root.children.length)open.add('about');
  root.innerHTML=`<section class="panel home-order"><h2>نمایش و ترتیب بخش‌ها</h2><p class="help">هیرو در ابتدای صفحه می‌ماند. بخش‌های دیگر را با فلش‌ها جابه‌جا کنید. بخش‌های اضافی پیش از تماس نمایش داده می‌شوند.</p>${['hero',...h.order].map(id=>`<div class="home-order-row"><label class="check"><input type="checkbox" data-home-visible="${id}" ${h.visibility[id]?'checked':''}>${esc(HOME_GROUPS.find(g=>g.id===id).label)}</label>${id==='hero'?'':`<div class="mini-actions"><button type="button" data-order="${id}" data-delta="-1" aria-label="${id} بالاتر" ${h.order.indexOf(id)===0?'disabled':''}>↑</button><button type="button" data-order="${id}" data-delta="1" aria-label="${id} پایین‌تر" ${h.order.indexOf(id)===h.order.length-1?'disabled':''}>↓</button></div>`}</div>`).join('')}</section>`+
  HOME_GROUPS.map(g=>`<details class="panel home-group" data-group="${g.id}" ${open.has(g.id)?'open':''}><summary>${esc(g.label)}</summary><div class="home-fields">${HOME_FIELDS.filter(f=>f.group===g.id).map(field).join('')}${g.id==='work'?c.collections.map(col=>`<section class="editor-section"><h3>${esc(col.title)}</h3><label>نام دسته<input data-collection-id="${col.id}" data-collection-field="title" dir="auto" value="${esc(col.title)}"></label><label>توضیح دسته<textarea data-collection-id="${col.id}" data-collection-field="description" dir="auto">${esc(col.description)}</textarea></label>${imageField('عکس روی کارت دسته',col.image,`data-collection-id="${col.id}" data-collection-field="image"`)}</section>`).join(''):''}</div></details>`).join('')+
  `<section class="panel"><div class="section-title"><h2>بخش‌های اضافی</h2><button type="button" class="secondary" data-extra-add>＋ بخش جدید</button></div><p class="help">برای توضیحات بیشتر، روش همکاری یا هر موضوع دلخواه؛ متن ساده و Markdown پشتیبانی می‌شود.</p>${h.extraSections.map((s,i)=>`<article class="block"><div class="block-head"><b>بخش ${i+1}</b><div class="mini-actions"><button data-extra-move="${i}" data-delta="-1" ${i===0?'disabled':''}>↑</button><button data-extra-move="${i}" data-delta="1" ${i===h.extraSections.length-1?'disabled':''}>↓</button><button class="danger" data-extra-delete="${i}">حذف بخش ${i+1}</button></div></div><label class="check"><input type="checkbox" data-extra-index="${i}" data-extra-field="visible" ${s.visible?'checked':''}>نمایش بخش</label><label>عنوان بخش<input dir="auto" data-extra-index="${i}" data-extra-field="title" value="${esc(s.title)}"></label><label>متن بخش<textarea dir="auto" rows="5" data-extra-index="${i}" data-extra-field="body">${esc(s.body)}</textarea></label>${imageField('عکس بخش (اختیاری)',s.image,`data-extra-index="${i}" data-extra-field="image"`)}<label>توضیح عکس<input dir="auto" data-extra-index="${i}" data-extra-field="alt" value="${esc(s.alt)}"></label></article>`).join('')}</section>`;
 }
 function target(el){const c=getContent();if(el.dataset.homeKey)return [c.home,el.dataset.homeKey];if(el.dataset.collectionField)return [c.collections.find(x=>x.id===el.dataset.collectionId),el.dataset.collectionField];if(el.dataset.extraField)return [c.home.extraSections[Number(el.dataset.extraIndex)],el.dataset.extraField];return []}
 root.addEventListener('input',e=>{const el=e.target;if(el.type==='file'||el.type==='checkbox')return;const [obj,key]=target(el);if(!obj)return;const f=HOME_FIELDS.find(f=>f.key===key);if(key==='image'||f?.kind==='image'||f?.kind==='link'||f?.kind==='email')return;obj[key]=el.value;changed()});
 root.addEventListener('change',async e=>{const el=e.target,c=getContent();try{
  if(el.dataset.homeVisible){c.home.visibility[el.dataset.homeVisible]=el.checked;changed();return}
  if(el.type==='file'){
   const file=el.files[0];if(!file)return;const [obj,key]=el.dataset.homeUpload?[c.home,el.dataset.homeUpload]:el.hasAttribute('data-collection-upload')?[c.collections.find(x=>x.id===el.dataset.collectionId),'image']:[c.home.extraSections[Number(el.dataset.extraIndex)],'image'];
   const src=await imageData(file);if(c!==getContent()){notify('محتوا تغییر کرده است؛ عکس را دوباره انتخاب کنید.',true);return}obj[key]=src;changed();render();return;
  }
  const [obj,key]=target(el);if(!obj)return;const f=HOME_FIELDS.find(f=>f.key===key),value=el.value.trim();
  if(key==='image'||f?.kind==='image'){if(value&&!safeAsset(value))throw Error('آدرس عکس باید https یا مسیر assets باشد.');obj[key]=value;changed();render()}
  else if(f?.kind==='link'){if(value&&!httpsURL(value)&&!/^\.?\/[a-zA-Z0-9/_-]*$/.test(value))throw Error('لینک باید با https شروع شود یا مسیر داخلی سایت باشد.');obj[key]=value;changed()}
  else if(f?.kind==='email'){if(value&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value))throw Error('ایمیل معتبر وارد کنید.');obj[key]=value;changed()}
  else if(el.type==='checkbox'){obj[key]=el.checked;changed()}
 }catch(err){notify(err.message,true);render()}});
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const h=getContent().home;
  if(b.hasAttribute('data-image-clear')){const [obj,key]=target(b);if(!obj)return;obj[key]=''}
  else if(b.dataset.order){const i=h.order.indexOf(b.dataset.order),j=i+Number(b.dataset.delta);if(j>=0&&j<h.order.length)[h.order[i],h.order[j]]=[h.order[j],h.order[i]]}
  else if(b.hasAttribute('data-extra-add')){if(h.extraSections.length>=30)return;h.extraSections.push({id:'extra-'+h.extraSections.length,title:'',body:'',image:'',alt:'',visible:true})}
  else if(b.hasAttribute('data-extra-delete')){h.extraSections.splice(Number(b.dataset.extraDelete),1)}
  else if(b.hasAttribute('data-extra-move')){const i=Number(b.dataset.extraMove),j=i+Number(b.dataset.delta);if(j>=0&&j<h.extraSections.length)[h.extraSections[i],h.extraSections[j]]=[h.extraSections[j],h.extraSections[i]]}
  else return;changed();render();
 });
 return {render};
}
