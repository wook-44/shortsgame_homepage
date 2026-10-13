// 결(Kyeol) — 공통 스크립트: 모바일 메뉴 · 등장 효과 · 스크린샷 확대
(function () {
  document.documentElement.classList.remove('no-js');

  var hd = document.querySelector('.hd');
  var btn = document.querySelector('.menu-btn');
  if (hd && btn) {
    btn.addEventListener('click', function () {
      var open = hd.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    hd.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { hd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }

  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  var shots = document.querySelectorAll('[data-zoom]');
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', '스크린샷 크게 보기');
    var im = document.createElement('img'); lb.appendChild(im); document.body.appendChild(lb);
    var close = function () { lb.classList.remove('on'); };
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    shots.forEach(function (b) {
      b.addEventListener('click', function () {
        im.src = b.getAttribute('data-zoom'); im.alt = b.querySelector('img').alt; lb.classList.add('on');
      });
    });
  }

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
