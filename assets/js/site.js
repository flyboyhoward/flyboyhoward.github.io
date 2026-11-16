/* Accessibility and fragment navigation for the adapted AcademicPages template. */
(() => {
  const themeControl = document.querySelector('#theme-toggle a');
  themeControl?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      themeControl.click();
    }
  });

  const syncDisclosure = (button, isExpanded, observed) => {
    if (!button || !observed) return;
    const sync = () => button.setAttribute('aria-expanded', String(isExpanded()));
    new MutationObserver(sync).observe(observed, { attributes: true, attributeFilter: ['class', 'style'] });
    sync();
  };
  const navigation = document.querySelector('#navigation-overflow');
  syncDisclosure(document.querySelector('#site-nav > button'), () => !navigation.classList.contains('hidden'), navigation);
  const profileButton = document.querySelector('.author__urls-wrapper button');
  syncDisclosure(profileButton, () => profileButton.classList.contains('open'), profileButton);

  // Correct the inline display value left by the theme's desktop resize handler.
  const profileLinks = document.querySelector('#profile-links');
  const desktopProfile = window.matchMedia('(min-width: 925px)');
  const syncProfileLayout = () => {
    if (!profileLinks || !profileButton) return;
    profileLinks.style.display = desktopProfile.matches || profileButton.classList.contains('open') ? 'block' : 'none';
  };
  desktopProfile.addEventListener('change', () => requestAnimationFrame(syncProfileLayout));
  syncProfileLayout();

  const openFragment = (hash) => {
    if (!hash || hash === '#') return;
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (target?.matches('details')) target.open = true;
  };
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin === window.location.origin && destination.pathname === window.location.pathname) {
      openFragment(destination.hash);
    }
  });
  window.addEventListener('hashchange', () => openFragment(window.location.hash));
  openFragment(window.location.hash);
})();
