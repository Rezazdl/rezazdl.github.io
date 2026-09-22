/* GitHub storage adapter. Credentials exist only in this page's memory. */
(() => {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  function safeURL(value, kind = 'media') {
    if (!value) return true;
    if (typeof value !== 'string' || value.length > 2000 || /[\u0000-\u0020\\]/.test(value)) return false;
    if (kind === 'link') { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
    if (/^https:\/\//.test(value)) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
    return !value.startsWith('/') && !value.includes('..') && /^[\w./-]+$/.test(value);
  }
  function validate(data) {
    const fail = message => { throw new Error(message); };
    if (data?.version !== 1 || !Array.isArray(data.categories) || data.categories.length !== 4) fail('ساختار فایل اطلاعات با این پنل سازگار نیست.');
    const ids = ['games','3d','motion','ai'];
    const seen = new Set();
    for (const [i, category] of data.categories.entries()) {
      if (category.id !== ids[i] || !Array.isArray(category.projects)) fail('ترتیب یا شناسه دسته‌ها معتبر نیست.');
      for (const key of ['name','sub','label','title','number','description','short']) if (typeof category[key] !== 'string' || /[<>"']/.test(category[key])) fail('اطلاعات دسته معتبر نیست: ' + key);
      if (!/^\d+% \d+%$/.test(category.crop) || !Array.isArray(category.tools) || category.tools.some(x => typeof x !== 'string' || /[<>"']/.test(x))) fail('قالب دسته معتبر نیست.');
      for (const p of category.projects) {
        if (!/^[a-z0-9][a-z0-9-]{0,100}$/.test(p.id) || seen.has(p.id)) fail('شناسه پروژه تکراری یا نامعتبر است.');
        seen.add(p.id);
        if (!p.title?.trim() || !p.summary?.trim()) fail('عنوان و خلاصه پروژه را کامل کن.');
        for (const key of ['title','summary','type','year','challenge']) if (typeof p[key] !== 'string') fail('متن پروژه نامعتبر است.');
        if (!Array.isArray(p.tools) || !Array.isArray(p.process) || [...p.tools,...p.process].some(x => typeof x !== 'string')) fail('ابزارها یا مراحل پروژه نامعتبر هستند.');
        if (p.status && !['published','draft'].includes(p.status)) fail('وضعیت پروژه نامعتبر است.');
        if (!safeURL(p.image) || !safeURL(p.projectUrl,'link')) fail('آدرس عکس یا پروژه معتبر نیست؛ برای لینک خارجی از HTTPS استفاده کن.');
        if (p.video && !window.portfolioYoutubeId(p.video)) fail('ویدیوی پروژه باید لینک معتبر یوتیوب باشد.');
        if (p.referenceImages && (!Array.isArray(p.referenceImages) || p.referenceImages.some(x => !safeURL(x)))) fail('آدرس عکس تکمیلی معتبر نیست.');
      }
    }
    const s = data.settings;
    if (!s || ['email','telegram','whatsapp','heroVideo','analyticsId','analyticsProperty'].some(key => typeof s[key] !== 'string')) fail('تنظیمات سایت معتبر نیست.');
    if (s.email && !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(s.email)) fail('ایمیل معتبر نیست.');
    if (s.telegram && !/^@?[a-zA-Z0-9_]{3,32}$/.test(s.telegram)) fail('نام کاربری تلگرام معتبر نیست.');
    if (s.whatsapp && !/^\+?[0-9 ()-]{7,24}$/.test(s.whatsapp)) fail('شماره واتس‌اپ معتبر نیست.');
    if (!safeURL(s.heroVideo)) fail('مسیر ویدیوی هدر معتبر نیست.');
    if (s.analyticsId && !/^G-[A-Z0-9]+$/.test(s.analyticsId)) fail('شناسه آمارگیر باید با G- شروع شود.');
    if (s.analyticsProperty && !/^\d+$/.test(s.analyticsProperty)) fail('شماره Property فقط شامل عدد است.');
    if (!Array.isArray(data.media) || !Array.isArray(data.trash)) fail('فهرست عکس‌ها معتبر نیست.');
    for (const m of data.media) if (!/^assets\/uploads\/[a-zA-Z0-9._-]+$/.test(m.path) || typeof m.name !== 'string') fail('مسیر فایل معتبر نیست.');
    return data;
  }
  function compile(data) {
    validate(data);
    const published = {version:1,settings:clone(data.settings),categories:clone(data.categories)};
    published.categories.forEach(c => { c.projects = c.projects.filter(p => p.status !== 'draft'); });
    return 'window.PORTFOLIO_CONTENT = ' + JSON.stringify(published).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029') + ';\n';
  }
  const bytesToBase64 = bytes => {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i,i+32768));
    return btoa(binary);
  };
  const decodeBase64 = value => new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g,'')), c => c.charCodeAt(0)));
  class GitHubStore {
    #token; #config;
    constructor(config, token) {
      if (!/^[\w.-]+$/.test(config.owner) || !/^[\w.-]+$/.test(config.repo) || !config.branch || /[\s?#]/.test(config.branch)) throw new Error('مشخصات مخزن یا شاخه معتبر نیست.');
      config.folder = config.folder.replace(/^\/+|\/+$/g,'');
      if (config.folder && (!/^[\w./-]+$/.test(config.folder) || config.folder.includes('..'))) throw new Error('پوشه سایت معتبر نیست.');
      this.#config = {...config}; this.#token = token;
      this.base = null; this.tree = null; this.paths = new Map();
    }
    clear() { this.#token = ''; }
    path(file) { return (this.#config.folder ? this.#config.folder+'/' : '') + file; }
    async api(path, method = 'GET', body) {
      if (!this.#token) throw new Error('ابتدا به گیت‌هاب متصل شو.');
      const response = await fetch('https://api.github.com/repos/'+encodeURIComponent(this.#config.owner)+'/'+encodeURIComponent(this.#config.repo)+'/'+path, {
        method, cache:'no-store', redirect:'error', headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+this.#token,'X-GitHub-Api-Version':'2022-11-28',...(body ? {'Content-Type':'application/json'} : {})}, ...(body ? {body:JSON.stringify(body)} : {})
      });
      if (!response.ok) {
        const messages = {401:'کلید گیت‌هاب معتبر نیست یا منقضی شده.',403:'دسترسی کافی نیست یا محدودیت درخواست گیت‌هاب فعال شده.',404:'مخزن، شاخه یا فایل اطلاعات پیدا نشد. فایل‌های نسخه جدید سایت باید ابتدا در مخزن بارگذاری شوند.',409:'مخزن تغییر کرده است. پشتیبان بگیر و دوباره متصل شو.',422:'انتشار رد شد؛ شاخه ممکن است تغییر کرده یا محدودیت محافظت داشته باشد.'};
        throw new Error(messages[response.status] || 'خطای ارتباط با گیت‌هاب ('+response.status+').');
      }
      return response.json();
    }
    refPath(write = false) { return 'git/'+(write?'refs':'ref')+'/heads/'+this.#config.branch.split('/').map(encodeURIComponent).join('/'); }
    async read() {
      const ref = await this.api(this.refPath());
      const commit = await this.api('git/commits/'+ref.object.sha);
      const tree = await this.api('git/trees/'+commit.tree.sha+'?recursive=1');
      if (tree.truncated) throw new Error('مخزن برای خواندن کامل بسیار بزرگ است.');
      this.paths = new Map(tree.tree.map(file => [file.path,file]));
      const source = this.paths.get(this.path('data/content.json'));
      if (!source || source.type !== 'blob') throw new Error('ابتدا بسته جدید سایت را در همین پوشه گیت‌هاب بارگذاری کن.');
      const blob = await this.api('git/blobs/'+source.sha);
      const data = validate(JSON.parse(decodeBase64(blob.content)));
      this.base = ref.object.sha; this.tree = commit.tree.sha;
      return data;
    }
    async publish(data, uploads, deletions, progress) {
      validate(data);
      const current = await this.api(this.refPath());
      if (current.object.sha !== this.base) throw new Error('از زمان اتصال، مخزن تغییر کرده. برای جلوگیری از پاک‌شدن تغییرات دیگر، انتشار متوقف شد. از ویرایش فعلی پشتیبان بگیر و دوباره متصل شو.');
      const changes = [];
      for (const [path,file] of uploads) {
        progress('در حال آپلود '+file.name+'…');
        if (!/^assets\/uploads\/[\w.-]+$/.test(path)) throw new Error('مسیر آپلود غیرمجاز است.');
        const blob = await this.api('git/blobs','POST',{content:bytesToBase64(new Uint8Array(await file.arrayBuffer())),encoding:'base64'});
        changes.push({path:this.path(path),mode:'100644',type:'blob',sha:blob.sha});
      }
      for (const path of deletions) {
        if (!/^assets\/uploads\/[\w.-]+$/.test(path)) throw new Error('حذف فقط برای فایل‌های آپلودشده از پنل مجاز است.');
        if (this.paths.has(this.path(path))) changes.push({path:this.path(path),mode:'100644',type:'blob',sha:null});
      }
      changes.push({path:this.path('data/content.json'),mode:'100644',type:'blob',content:JSON.stringify(data,null,2)+'\n'});
      changes.push({path:this.path('data/content.js'),mode:'100644',type:'blob',content:compile(data)});
      progress('در حال ثبت نسخه جدید سایت…');
      const tree = await this.api('git/trees','POST',{base_tree:this.tree,tree:changes});
      const commit = await this.api('git/commits','POST',{message:'Update portfolio from admin panel',tree:tree.sha,parents:[this.base]});
      await this.api(this.refPath(true),'PATCH',{sha:commit.sha,force:false});
      this.base = commit.sha; this.tree = tree.sha;
      for (const change of changes) { if (change.sha === null) this.paths.delete(change.path); else this.paths.set(change.path,change); }
      return commit.sha;
    }
  }
  window.PortfolioCore = {clone,safeURL,validate,compile,GitHubStore};
})();
