// Digital Artifacts — minimal UI interactions
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Mobile nav toggle — core interaction is pure CSS via checkbox + label.
    // This JS only enhances accessibility states where supported.
    var toggle = document.getElementById('nav-toggle');
    var hamburger = document.querySelector('.hamburger');

    if (toggle && hamburger) {
      toggle.addEventListener('change', function () {
        hamburger.setAttribute('aria-expanded', String(toggle.checked));
      });
    }
  }
})();
