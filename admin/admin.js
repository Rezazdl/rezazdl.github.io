(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const core = window.PortfolioCore;
  let data, store = null, dirty = false, busy = false, editing = null;
  const uploads = new Map(), deletions = new Set(), previews = new Map();
  const localKey = 'rezazdl-draft:' + location.origin + location.pathname;
  const connectionKey = 'rezazdl-repo:' + location.origin + location.pathname;
  const titles = {projects:'پروژه‌های من',media:'کتابخانه عکس‌ها',analytics:'آمار بازدید',settings:'تنظیمات سایت',connection:'اتصال به گیت‌هاب'};
  const status = (message, error = false) => { $('#status').textContent = message; $('#status').classList.toggle('error',error); };
  const element = (tag, text, className) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; if (className) el.className = className; return el; };
  const button = (text, action, className = 'secondary') => { const el = element('button',text,className); el.type = 'button'; el.onclick = () => { if (!busy) action(); }; return el; };
  function run(task) { return Promise.resolve().then(task).catch(error => status(error.message,true)); }
  function getLocal(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function putLocal(key, value) { try { localStorage.setItem(key,value); } catch { status('فضای ذخیره مرورگر در دسترس نیست؛ قبل از خروج پشتیبان بگیر.',true); } }
  function clearLocal(key) { try { localStorage.removeItem(key); } catch { /* Optional recovery storage. */ } }
  function markDirty() {
    dirty = true;
    // Uploaded bytes stay in memory. Recovery is offered only when no uploads are pending.
    if (!uploads.size) putLocal(localKey,JSON.stringify({data,base:store?.base || null,repo:getLocal(connectionKey),deletions:[...deletions]}));
    else clearLocal(localKey);
    $('#publish').disabled = !store || busy;
    status(uploads.size ? 'تغییرات آماده انتشار است. تا پایان انتشار این صفحه را نبند؛ فایل‌های جدید هنوز آپلود نشده‌اند.' : 'تغییرات ذخیره شد؛ برای نمایش در سایت «انتشار تغییرات» را بزن.');
  }
  function tab(id) {
    document.querySelectorAll('.tab').forEach(section => { section.hidden = section.id !== id; });
    document.querySelectorAll('.nav').forEach(item => item.classList.toggle('active',item.dataset.tab === id));
    $('#pageTitle').textContent = titles[id];
  }
  document.querySelectorAll('[data-tab],[data-goto]').forEach(el => el.onclick = () => tab(el.dataset.tab || el.dataset.goto));
  function mediaURL(path) {
    if (!path || !core.safeURL(path)) return '';
    return previews.get(path) || (/^https:\/\//.test(path) ? path : new URL('../'+path,location.href).href);
  }
  function image(path, title, className) {
    const img = element('img',undefined,className); img.alt = title; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.src = mediaURL(path);
    img.onerror = () => { img.replaceWith(element('div','◇',className)); };
    return img;
  }
  function allProjects() { return data.categories.flatMap(c => c.projects.map(p => ({category:c,project:p}))); }
  function fillCategories() {
    for (const select of [$('#categoryFilter'),$('#projectForm').elements.category]) {
      const value = select.value; select.replaceChildren();
      if (select.id === 'categoryFilter') select.add(new Option('همه دسته‌ها',''));
      data.categories.forEach(c => select.add(new Option(c.title,c.id)));
      select.value = value || (select.id === 'categoryFilter' ? '' : data.categories[0].id);
    }
  }
  function renderProjects() {
    const entries = allProjects();
    $('#totalCount').textContent = entries.length.toLocaleString('fa');
    $('#publishedCount').textContent = entries.filter(x => x.project.status !== 'draft').length.toLocaleString('fa');
    $('#draftCount').textContent = entries.filter(x => x.project.status === 'draft').length.toLocaleString('fa');
    const query = $('#search').value.trim().toLowerCase(), categoryId = $('#categoryFilter').value;
    const list = $('#projectList'); list.replaceChildren();
    entries.filter(({category,project}) => (!categoryId || category.id === categoryId) && (project.title+' '+project.type).toLowerCase().includes(query)).forEach(({category,project}) => {
      const card = element('article',undefined,'project-card');
      card.append(project.image ? image(project.image,project.title,'project-art') : element('div','◇','project-art'));
      const body = element('div',undefined,'project-body');
      body.append(element('span',project.status === 'draft' ? 'پیش‌نویس' : project.demo ? 'نمونه نمایشی' : 'در سایت','tag'),element('h3',project.title),element('p',category.title+' / '+project.year,'muted'));
      const actions = element('div',undefined,'actions');
      actions.append(button('ویرایش',() => openEditor(category.id,project.id)),button('کپی',() => {
        const copy = core.clone(project); copy.id = 'project-'+crypto.randomUUID(); copy.title += ' — Copy'; copy.status = 'draft'; category.projects.push(copy); markDirty(); renderProjects();
      }));
      const index = category.projects.indexOf(project);
      const move = delta => { const next = index+delta; [category.projects[index],category.projects[next]] = [category.projects[next],category.projects[index]]; markDirty(); renderProjects(); };
      const up = button('↑',() => move(-1)); up.disabled = index === 0; up.setAttribute('aria-label','انتقال پروژه به بالا');
      const down = button('↓',() => move(1)); down.disabled = index === category.projects.length-1; down.setAttribute('aria-label','انتقال پروژه به پایین');
      actions.append(up,down,button('حذف',() => {
        if (!confirm('«'+project.title+'» به سطل زباله منتقل شود؟')) return;
        category.projects.splice(index,1); data.trash.push({categoryId:category.id,project,deletedAt:new Date().toISOString()}); markDirty(); renderProjects();
      },'danger'));
      body.append(actions); card.append(body); list.append(card);
    });
    if (!list.childElementCount) list.append(element('p','پروژه‌ای برای نمایش وجود ندارد.','muted'));
    $('#trashCount').textContent = '('+data.trash.length.toLocaleString('fa')+')';
    $('#trashList').replaceChildren();
    data.trash.forEach((entry,index) => {
      const row = element('div',undefined,'trash-row'); row.append(element('span',entry.project.title),button('بازیابی',() => {
        const category = data.categories.find(c => c.id === entry.categoryId);
        if (!category) return;
        category.projects.push(entry.project); data.trash.splice(index,1); markDirty(); renderProjects();
      })); $('#trashList').append(row);
    });
  }
  function references(path) {
    return data.settings.heroVideo === path || [...allProjects().map(x=>x.project),...data.trash.map(x=>x.project)].some(p => p.image === path || (p.referenceImages || []).includes(path));
  }
  function renderMedia() {
    $('#mediaList').replaceChildren();
    data.media.forEach(media => {
      const card = element('article',undefined,'media-card');
      card.append(media.kind === 'hero' ? element('div','ویدیوی هدر','project-art') : image(media.path,media.name));
      card.append(element('p',media.name),element('p',media.path),element('span',uploads.has(media.path) ? 'آماده آپلود' : 'ذخیره‌شده','tag'));
      const actions = element('div',undefined,'actions');
      actions.append(button('کپی مسیر',() => run(async () => { await navigator.clipboard.writeText(media.path); status('مسیر فایل کپی شد.'); })),button('حذف',() => {
        if (references(media.path)) { status('این فایل در یک پروژه، سطل زباله یا هدر استفاده شده است. ابتدا آن ارجاع را تغییر بده.',true); return; }
        if (!confirm('این فایل از گیت‌هاب حذف شود؟ حذف با انتشار تغییرات انجام می‌شود.')) return;
        if (uploads.has(media.path)) uploads.delete(media.path); else deletions.add(media.path);
        if (previews.has(media.path)) { URL.revokeObjectURL(previews.get(media.path)); previews.delete(media.path); }
        data.media = data.media.filter(m => m.path !== media.path); markDirty(); renderMedia();
      },'danger')); card.append(actions); $('#mediaList').append(card);
    });
    if (!data.media.length) $('#mediaList').append(element('p','هنوز عکسی از طریق پنل اضافه نشده است. تصاویر اصلی طراحی سایت دست‌نخورده می‌مانند.','muted'));
  }
  function renderSettings() {
    const form = $('#settingsForm');
    Object.entries(data.settings).forEach(([key,value]) => { if (form.elements[key]) form.elements[key].value = value; });
    const id = data.settings.analyticsId;
    $('#analyticsState').textContent = id ? 'شناسه تنظیم‌شده: '+id+' — ثبت داده به انتشار تنظیمات و اجازه بازدیدکننده بستگی دارد.' : 'آمارگیر هنوز متصل نشده. شناسه حساب خودت را در تنظیمات وارد کن.';
    $('#analyticsLink').href = /^\d+$/.test(data.settings.analyticsProperty) ? 'https://analytics.google.com/analytics/web/#/p'+data.settings.analyticsProperty+'/reports/intelligenthome' : 'https://analytics.google.com/';
  }
  function renderAll() { fillCategories(); renderProjects(); renderMedia(); renderSettings(); }
  function coverPreview() {
    const url = mediaURL($('#projectForm').elements.image.value.trim());
    $('#coverPreview').hidden = !url;
    if (url) $('#coverPreview').src = url; else $('#coverPreview').removeAttribute('src');
  }
  function openEditor(categoryId, id) {
    const form = $('#projectForm'); form.reset(); $('#editorError').textContent = '';
    const category = data.categories.find(c => c.id === categoryId) || data.categories[0];
    const p = category.projects.find(p => p.id === id);
    editing = p ? {categoryId:category.id,id:p.id} : null;
    $('#editorTitle').textContent = p ? 'ویرایش پروژه' : 'پروژه جدید';
    form.elements.category.value = category.id;
    form.elements.year.value = String(new Date().getFullYear());
    if (p) {
      for (const key of ['title','type','year','summary','challenge','image','video','projectUrl','references']) form.elements[key].value = p[key] || '';
      form.elements.status.value = p.status || 'published';
      form.elements.tools.value = p.tools.join(', '); form.elements.process.value = p.process.join('\n');
      form.elements.referenceImages.value = (p.referenceImages || []).join('\n'); form.elements.demo.checked = !!p.demo;
    }
    $('#coverPicker').replaceChildren(new Option('انتخاب عکس…',''));
    data.media.filter(m => m.kind !== 'hero').forEach(m => $('#coverPicker').add(new Option(m.name,m.path)));
    coverPreview(); $('#editor').showModal();
  }
  $('#newProject').onclick = () => { if (!busy) openEditor(); };
  $('#closeEditor').onclick = () => $('#editor').close();
  $('#projectForm').elements.image.addEventListener('input',coverPreview);
  $('#coverPicker').onchange = event => { if (event.target.value) { $('#projectForm').elements.image.value = event.target.value; coverPreview(); } };
  $('#projectForm').onsubmit = event => {
    event.preventDefault(); if (busy) return;
    try {
      const form = event.target, next = core.clone(data), category = next.categories.find(c => c.id === form.elements.category.value);
      const oldCategory = editing && next.categories.find(c => c.id === editing.categoryId);
      const old = oldCategory?.projects.find(p => p.id === editing.id);
      const project = {...(old || {}),id:old?.id || 'project-'+crypto.randomUUID()};
      for (const key of ['title','type','year','summary','challenge','image','video','projectUrl','references','status']) project[key] = form.elements[key].value.trim();
      project.tools = form.elements.tools.value.split(/[,،]/).map(x=>x.trim()).filter(Boolean);
      project.process = form.elements.process.value.split('\n').map(x=>x.trim()).filter(Boolean);
      project.referenceImages = form.elements.referenceImages.value.split('\n').map(x=>x.trim()).filter(Boolean);
      project.demo = form.elements.demo.checked;
      if (old && oldCategory === category) category.projects.splice(category.projects.indexOf(old),1,project);
      else { if (old) oldCategory.projects.splice(oldCategory.projects.indexOf(old),1); category.projects.push(project); }
      core.validate(next); data = next; markDirty(); renderProjects(); $('#editor').close();
    } catch (error) { $('#editorError').textContent = error.message; }
  };
  async function addFile(file, kind = 'image') {
    if (!file) return null;
    const ext = file.name.split('.').pop().toLowerCase();
    const types = kind === 'hero' ? {mp4:'video/mp4',webm:'video/webm'} : {jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',avif:'image/avif'};
    if (!types[ext] || file.type !== types[ext]) throw new Error('نوع فایل مجاز نیست. برای پروژه‌ها عکس و لینک یوتیوب استفاده کن.');
    if (file.size > (kind === 'hero' ? 20 : 8)*1024*1024) throw new Error(kind === 'hero' ? 'ویدیوی هدر باید کمتر از ۲۰ مگابایت باشد.' : 'عکس باید کمتر از ۸ مگابایت باشد.');
    if ([...uploads.values()].reduce((sum,f)=>sum+f.size,0)+file.size > 40*1024*1024) throw new Error('ابتدا فایل‌های انتخاب‌شده را منتشر کن؛ حداکثر حجم هر نوبت ۴۰ مگابایت است.');
    if (kind === 'image') { const bitmap = await createImageBitmap(file); bitmap.close(); }
    const path = 'assets/uploads/'+crypto.randomUUID()+'.'+ext;
    uploads.set(path,file); previews.set(path,URL.createObjectURL(file));
    data.media.push({path,name:file.name,size:file.size,kind});
    markDirty(); renderMedia(); return path;
  }
  $('#mediaUpload').onchange = event => run(async () => { for (const file of event.target.files) await addFile(file); event.target.value = ''; });
  $('#coverUpload').onchange = event => run(async () => {
    const path = await addFile(event.target.files[0]); if (path) { $('#projectForm').elements.image.value = path; coverPreview(); } event.target.value = '';
  });
  $('#heroUpload').onchange = event => run(async () => {
    const path = await addFile(event.target.files[0],'hero');
    if (path) { data.settings.heroVideo = path; $('#settingsForm').elements.heroVideo.value = path; markDirty(); } event.target.value = '';
  });
  $('#settingsForm').onsubmit = event => { event.preventDefault(); if (busy) return; run(() => {
    const next = core.clone(data);
    for (const key of Object.keys(next.settings)) if (event.target.elements[key]) next.settings[key] = event.target.elements[key].value.trim();
    core.validate(next); data = next; markDirty(); renderSettings();
  }); };
  $('#search').oninput = renderProjects; $('#categoryFilter').onchange = renderProjects;
  $('#connectionForm').onsubmit = event => { event.preventDefault(); if (busy) return; run(async () => {
    if (dirty && !confirm('خواندن نسخه گیت‌هاب جای ویرایش فعلی را می‌گیرد. اگر لازم است ابتدا پشتیبان بگیر. ادامه می‌دهی؟')) return;
    const form = event.target, config = {};
    for (const key of ['owner','repo','branch','folder']) config[key] = form.elements[key].value.trim();
    const candidate = new core.GitHubStore(config,form.elements.token.value.trim());
    busy = true; $('#publish').disabled = true; status('در حال اتصال و خواندن نسخه گیت‌هاب…');
    try {
      const remote = await candidate.read();
      store?.clear(); store = candidate; data = remote; dirty = false;
      uploads.clear(); deletions.clear(); previews.forEach(URL.revokeObjectURL); previews.clear();
      form.elements.token.value = '';
      putLocal(connectionKey,JSON.stringify(config));
      $('#connectionBadge').textContent = 'متصل به '+config.owner+'/'+config.repo;
      $('#setupNotice').hidden = true; renderAll();
      $('#restoreLocal').hidden = !getLocal(localKey);
      status('متصل شد. حالا پروژه‌ها و عکس‌ها را مدیریت کن.'); tab('projects');
    } catch (error) { candidate.clear(); throw error; }
    finally { busy = false; $('#publish').disabled = !store || !dirty; }
  }); };
  $('#disconnect').onclick = () => {
    if (busy) return; store?.clear(); store = null; $('#connectionForm').elements.token.value = ''; $('#connectionBadge').textContent = 'اتصال قطع شد'; $('#publish').disabled = true; status('کلید دسترسی از حافظه این صفحه پاک شد.');
  };
  $('#publish').onclick = () => run(async () => {
    if (!store || busy || !dirty) return;
    core.validate(data);
    if (!confirm('تغییرات پروژه‌ها و فایل‌ها در گیت‌هاب ذخیره و برای انتشار سایت ارسال شوند؟')) return;
    busy = true; $('#publish').disabled = true;
    // Prevent changes to the working copy while its files are committing.
    document.querySelectorAll('main input,main textarea,main select,main button').forEach(el => { el.dataset.wasDisabled = String(el.disabled); el.disabled = true; });
    try {
      await store.publish(core.clone(data),new Map(uploads),new Set(deletions),status);
      uploads.clear(); deletions.clear(); dirty = false; clearLocal(localKey); $('#restoreLocal').hidden = true;
      renderMedia(); status('تغییرات در گیت‌هاب ثبت شد. انتشار سایت معمولاً کمی زمان می‌برد؛ برای بررسی، «مشاهده سایت» را باز کن.');
    } finally {
      busy = false;
      document.querySelectorAll('[data-was-disabled]').forEach(el => { el.disabled = el.dataset.wasDisabled === 'true'; delete el.dataset.wasDisabled; });
      $('#publish').disabled = !dirty;
    }
  });
  $('#export').onclick = () => {
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'}), url = URL.createObjectURL(blob);
    const link = element('a'); link.href = url; link.download = 'portfolio-backup-'+new Date().toISOString().slice(0,10)+'.json'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    if (uploads.size) status('پشتیبان فقط شامل اطلاعات است. فایل‌های انتخاب‌شده را پیش از خروج منتشر کن.',true);
  };
  $('#restoreLocal').onclick = () => run(() => {
    const saved = JSON.parse(getLocal(localKey) || 'null');
    if (!saved) throw new Error('ویرایش ذخیره‌شده‌ای پیدا نشد.');
    if ((saved.repo || null) !== (getLocal(connectionKey) || null) || (store && saved.base && saved.base !== store.base)) throw new Error('این ویرایش برای نسخه یا مخزن دیگری است؛ برای جلوگیری از جایگزینی اشتباه بازیابی نشد.');
    if (!confirm('ویرایش ذخیره‌شده مرورگر بازیابی شود؟')) return;
    data = core.validate(saved.data); deletions.clear(); (saved.deletions || []).forEach(path=>deletions.add(path)); markDirty(); renderAll();
  });
  addEventListener('beforeunload',event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
  run(async () => {
    const response = await fetch('../data/content.json',{cache:'no-store'});
    if (!response.ok) throw new Error('فایل اطلاعات پیدا نشد. پنل را از آدرس سایت باز کن، نه با دوبار کلیک روی فایل.');
    data = core.validate(await response.json()); renderAll();
    const config = JSON.parse(getLocal(connectionKey) || 'null');
    if (config) for (const key of ['owner','repo','branch','folder']) $('#connectionForm').elements[key].value = config[key] || '';
    $('#restoreLocal').hidden = !getLocal(localKey);
    status('اطلاعات سایت آماده است.');
  });
})();
