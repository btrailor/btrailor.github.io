// Digital Artifacts — minimal UI interactions
(function () {
  'use strict';

  function init() {
    // Mobile hamburger toggle
    var hamburger = document.querySelector('.hamburger');
    var mobileMenu = document.getElementById('primary-nav-menu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        var expanded = hamburger.getAttribute('aria-expanded') === 'true';
        mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(!expanded));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
