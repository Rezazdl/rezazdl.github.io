(() => {
  'use strict';
  window.portfolioYoutubeId = function (value) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return null;
      let id;
      if (url.hostname === 'youtu.be') id = url.pathname.split('/')[1];
      else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
        id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(embed|shorts|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : null;
      }
      return /^[\w-]{11}$/.test(id || '') ? id : null;
    } catch { return null; }
  };
  window.portfolioYoutubeMarkup = function (url) {
    const id = window.portfolioYoutubeId(url);
    return id ? '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '" title="Project video on YouTube" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen style="width:100%;height:100%;border:0;display:block"></iframe>' : '';
  };
})();
