const PLAYLIST = [
  './videos/hero-jetski.mp4',
  './videos/hero-aerial.mp4',
  './videos/hero-kite.mp4',
  './videos/hero-wake.mp4',
];

export function initHeroVideo(root = document) {
  const stack = root.querySelector('[data-hero-videos]');
  if (!stack) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Skip autoplay on very slow connections when API exists
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;

  const vids = [...stack.querySelectorAll('video.hero-video')];
  if (vids.length < 2) return;

  let index = 0;
  let active = 0;
  let swapping = false;

  const loadInto = (video, src) => new Promise((resolve, reject) => {
    const onReady = () => { cleanup(); resolve(); };
    const onErr = () => { cleanup(); reject(new Error('video load failed')); };
    const cleanup = () => {
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('error', onErr);
    };
    video.addEventListener('loadeddata', onReady, { once: true });
    video.addEventListener('error', onErr, { once: true });
    video.src = src;
    video.load();
  });

  const playSafe = async (video) => {
    try { await video.play(); } catch { /* autoplay policies */ }
  };

  const swap = async () => {
    if (swapping) return;
    swapping = true;
    try {
      index = (index + 1) % PLAYLIST.length;
      const nextActive = 1 - active;
      const incoming = vids[nextActive];
      const outgoing = vids[active];
      await loadInto(incoming, PLAYLIST[index]);
      incoming.currentTime = 0;
      await playSafe(incoming);
      incoming.classList.add('is-active');
      outgoing.classList.remove('is-active');
      active = nextActive;
      // pause outgoing after fade
      setTimeout(() => { try { outgoing.pause(); } catch {} }, 1500);
    } catch (e) {
      // keep current clip looping
    } finally {
      swapping = false;
    }
  };

  // bootstrap first clip
  (async () => {
    try {
      await loadInto(vids[0], PLAYLIST[0]);
      vids[0].classList.add('is-active');
      await playSafe(vids[0]);
      // crossfade every ~9s for a modern playlist feel
      setInterval(swap, 9000);
    } catch {
      // still poster / CSS fallback
    }
  })();
}
