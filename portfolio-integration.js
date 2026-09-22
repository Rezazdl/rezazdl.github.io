/* Portfolio content labels and optional Google Analytics. No admin credentials here. */
(() => {
  'use strict';
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => {
    dialog.querySelectorAll('iframe').forEach(frame => { frame.src = 'about:blank'; });
  }));
  const data = window.PORTFOLIO_CONTENT;
  if (!data) return;
  const updateLabels = () => {
    const projects = data.categories.flatMap(c => c.projects).filter(p => p.status !== 'draft');
    const note = document.querySelector('#work .demo-note');
    if (note) note.hidden = !projects.some(p => p.demo);
    document.querySelectorAll('[data-project]').forEach(card => {
      const category = data.categories.find(c => c.id === location.hash.slice(1).split('/')[0]);
      const project = category?.projects.find(p => p.id === card.dataset.project);
      const badge = card.querySelector('.art-type');
      if (badge) badge.textContent = project?.demo ? 'CONCEPT PREVIEW' : 'VIEW PROJECT';
    });
    const category = data.categories.find(c => c.id === location.hash.slice(1).split('/')[0]);
    const categoryNote = document.querySelector('#categoryDialog .demo-note');
    if (categoryNote) categoryNote.hidden = !category?.projects.some(p => p.demo && p.status !== 'draft');
  };
  new MutationObserver(updateLabels).observe(document.querySelector('#projectGrid'), {childList: true});
  addEventListener('hashchange', updateLabels);
  addEventListener('popstate', updateLabels);
  updateLabels();
  const id = data.settings.analyticsId || '';
  if (!/^G-[A-Z0-9]+$/.test(id) || location.protocol === 'file:') return;
  // Basic consent: no analytics request or cookie before an affirmative choice.
  const readConsent = () => { try { return localStorage.getItem('rezazdl-analytics-consent'); } catch { return null; } };
  let started = false;
  function start() {
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, {allow_google_signals: false, allow_ad_personalization_signals: false});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.append(script);
    document.addEventListener('click', event => {
      const project = event.target.closest('[data-project]');
      const category = event.target.closest('[data-category]');
      const contact = event.target.closest('[data-contact],[data-channel]');
      if (project) window.gtag('event', 'view_project', {project_id: project.dataset.project});
      if (category) window.gtag('event', 'view_category', {category_id: category.dataset.category});
      if (contact) window.gtag('event', 'contact_click', {channel: contact.dataset.channel || 'brief'});
    });
    // Names, emails and brief text are never sent as analytics event parameters.
  }
  const consent = readConsent();
  if (consent === 'yes') start();
  const box = document.createElement('aside');
  box.setAttribute('aria-label', 'Analytics preferences');
  box.style.cssText = 'position:fixed;bottom:18px;left:18px;z-index:90;max-width:340px;padding:18px;background:#f4f2ec;color:#29231e;border:1px solid #bcb6ad;border-radius:12px;font:13px/1.5 Arial;box-shadow:0 8px 30px #0002';
  const text = document.createElement('p');
  text.textContent = 'Allow Google Analytics to measure visits and project clicks? Your choice is optional. Google processes usage data to create these reports.';
  box.append(text);
  const preference = document.createElement('button');
  preference.textContent = 'Analytics preferences';
  preference.style.cssText = 'background:none;font-size:11px;text-decoration:underline;margin-top:10px';
  document.querySelector('.contact-meta')?.append(preference);
  preference.onclick = () => { box.hidden = false; };
  for (const [label, value] of [['Allow', 'yes'], ['Decline', 'no']]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.cssText = 'margin:12px 10px 0 0;padding:8px 16px;border-radius:20px;background:#193c32;color:white';
    button.onclick = () => {
      try { localStorage.setItem('rezazdl-analytics-consent', value); } catch { /* Session choice only. */ }
      box.hidden = true;
      if (value === 'yes') start();
      else if (started) { window['ga-disable-' + id] = true; location.reload(); }
    };
    box.append(button);
  }
  box.hidden = consent !== null;
  document.body.append(box);
})();
