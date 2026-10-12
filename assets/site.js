/* MATH 2201 — shared navigation + diagram layout.
   To add a page: give it an entry in PAGES (in study order) and load
   assets/site.css + assets/site.js like the other pages. */
(function () {
  'use strict';

  var UNITS = {
    u1: { exam: 'Midterm', name: 'Unit 1 · Vectors, Lines & Planes' },
    u3: { exam: 'Midterm', name: 'Unit 3 · Multiple Integrals' },
    mprep: { exam: 'Midterm', name: 'Midterm Exam Prep' },
    u4: { exam: 'Final', name: 'Unit 4 · Conic Sections' },
    u5: { exam: 'Final', name: 'Unit 5 · Polar, Cylindrical & Spherical' },
    u6: { exam: 'Final', name: 'Unit 6 · Gradient, Divergence & Curl' },
    u7: { exam: 'Final', name: 'Unit 7 · Surface Integrals & Theorems' },
    fprep: { exam: 'Final', name: 'Final Exam Prep' }
  };

  // Study order. `label` is the short chip name shown in the top bar.
  var PAGES = [
    { f: 'unit_01_vectors.html', u: 'u1', label: 'Notes' },
    { f: 'midterm-vectors.html', u: 'u1', label: 'Vectors Summary' },
    { f: 'midterm-lines-planes.html', u: 'u1', label: 'Lines & Planes' },
    { f: 'unit_01_vectors_practice.html', u: 'u1', label: 'Worksheet' },
    { f: 'midterm-vectors-practice.html', u: 'u1', label: 'Vector Problems' },
    { f: 'midterm-lines-planes-practice.html', u: 'u1', label: 'Line & Plane Problems' },
    { f: 'ct2-notes.html', u: 'u1', label: 'CT2 Notes' },
    { f: 'ct2-practice.html', u: 'u1', label: 'CT2 Review' },
    { f: 'midterm-integrals-practice.html', u: 'u3', label: 'Practice Problems' },
    { f: 'midterm-review-guide.html', u: 'mprep', label: 'Review Guide' },
    { f: 'midterm-formula-sheet.html', u: 'mprep', label: 'Formula Sheet' },
    { f: 'final-conic-sections.html', u: 'u4', label: 'Notes' },
    { f: 'final-conic-sections-practice.html', u: 'u4', label: 'Exercise Solutions' },
    { f: 'final-coordinate-systems.html', u: 'u5', label: 'Notes' },
    { f: 'final-coordinate-lab.html', u: 'u5', label: 'Interactive Lab' },
    { f: 'final-coordinate-systems-practice.html', u: 'u5', label: 'Worksheet Solutions' },
    { f: 'final-vector-fields.html', u: 'u6', label: 'Notes' },
    { f: 'final-vector-fields-practice.html', u: 'u6', label: 'CT4 Solutions' },
    { f: 'final-integral-theorems.html', u: 'u7', label: 'Notes' },
    { f: 'final-exam-review.html', u: 'fprep', label: 'Final Exam Review' },
    { f: 'final-formula-sheet.html', u: 'fprep', label: 'Cheat Sheet' }
  ];

  // Extra chips shown on every page of a unit (pages that live in another group).
  var EXTRA = {
    u3: [{ f: 'midterm-review-guide.html#p6', label: 'Notes (Review Guide)' }],
    u7: [{ f: 'final-exam-review.html', label: 'Final Exam Review', star: true }]
  };
  var PREP = {
    Midterm: { f: 'midterm-formula-sheet.html', label: '★ Formula Sheet' },
    Final: { f: 'final-formula-sheet.html', label: '★ Cheat Sheet' }
  };

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }

  function pageTitle(p) {
    var u = UNITS[p.u];
    var unit = u.name.split(' · ')[0];
    return (p.u.charAt(0) === 'u' ? unit + ' · ' : '') + p.label;
  }

  function buildNav() {
    var file = location.pathname.split('/').pop() || 'index.html';
    var idx = -1;
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].f === file) idx = i;
    if (idx < 0) return;
    var page = PAGES[idx];
    var unit = UNITS[page.u];
    var examId = unit.exam === 'Final' ? 'final' : 'midterm';

    // ---- top bar ----
    var bar = el('nav', { 'class': 'topbar', 'aria-label': 'Site' });
    var path = el('div', { 'class': 'tb-path' });
    path.appendChild(el('a', { 'class': 'tb-home', href: 'index.html' }, 'MATH 2201'));
    path.appendChild(el('span', { 'class': 'sep' }, '/'));
    path.appendChild(el('a', { href: 'index.html#' + examId }, unit.exam + ' Exam'));
    path.appendChild(el('span', { 'class': 'sep' }, '/'));
    path.appendChild(el('span', { 'class': 'here' }, unit.name));
    bar.appendChild(path);

    var links = el('div', { 'class': 'tb-links' });
    PAGES.forEach(function (p) {
      if (p.u !== page.u) return;
      var a = el('a', { href: p.f }, p.label);
      if (p === page) { a.className = 'on'; a.setAttribute('aria-current', 'page'); }
      links.appendChild(a);
    });
    (EXTRA[page.u] || []).forEach(function (x) {
      var a = el('a', { href: x.f }, x.label);
      if (x.star) a.className = 'star';
      links.appendChild(a);
    });
    var prep = PREP[unit.exam];
    if (page.u.charAt(0) === 'u') {
      var s = el('a', { href: prep.f, 'class': 'star' }, prep.label);
      links.appendChild(s);
    }
    if (document.body.classList.contains('sheet')) {
      var b = el('button', { type: 'button' }, '🖨 Print / PDF');
      b.addEventListener('click', function () { window.print(); });
      links.appendChild(b);
    }
    bar.appendChild(links);
    document.body.insertBefore(bar, document.body.firstChild);

    // ---- previous / next ----
    var pager = el('nav', { 'class': 'pager', 'aria-label': 'Previous and next page' });
    if (idx > 0) {
      var prev = el('a', { 'class': 'prev', href: PAGES[idx - 1].f });
      prev.appendChild(el('small', {}, '← Previous'));
      prev.appendChild(el('span', {}, pageTitle(PAGES[idx - 1])));
      pager.appendChild(prev);
    }
    if (idx < PAGES.length - 1) {
      var next = el('a', { 'class': 'next', href: PAGES[idx + 1].f });
      next.appendChild(el('small', {}, 'Next →'));
      next.appendChild(el('span', {}, pageTitle(PAGES[idx + 1])));
      pager.appendChild(next);
    }
    document.body.appendChild(pager);
  }

  // On wide screens, pair each diagram with the section of text around it, so the
  // picture sits in a left-hand column beside the maths (see site.css).
  // On narrow screens the original reading order is restored.
  var rows = [];

  function wrapFigures() {
    var figs = document.querySelectorAll('.note-card > figure.diagram, .problem > figure.diagram');
    Array.prototype.forEach.call(figs, function (fig) {
      var card = fig.parentElement;
      var before = [];
      var p = fig.previousElementSibling;
      while (p && !p.matches('figure.diagram, .fig-row')) {
        before.unshift(p);
        if (p.matches('h2, h3')) break;
        p = p.previousElementSibling;
      }
      // keep a problem's title and question above the row
      while (before.length && before[0].matches('h2, .prompt') && before.length > 1) before.shift();
      var after = [];
      var n = fig.nextElementSibling;
      while (n && !n.matches('figure.diagram') &&
             !(before.length + after.length >= 3 && n.matches('h2, h3'))) {
        after.push(n);
        n = n.nextElementSibling;
      }
      if (!before.length && !after.length) return;
      var row = el('div', { 'class': 'fig-row' });
      var text = el('div', { 'class': 'fig-text' });
      card.insertBefore(row, before[0] || fig);
      row.appendChild(fig);
      row.appendChild(text);
      before.concat(after).forEach(function (e) { text.appendChild(e); });
      card.classList.add('fig-card');
      rows.push({ row: row, fig: fig, before: before, after: after });
    });
  }

  function unwrapFigures() {
    rows.forEach(function (r) {
      var card = r.row.parentElement;
      r.before.concat([r.fig], r.after).forEach(function (e) { card.insertBefore(e, r.row); });
      card.removeChild(r.row);
      card.classList.remove('fig-card');
    });
    rows = [];
  }

  function layoutFigures() {
    if (!document.body.classList.contains('rail') || !window.matchMedia) return;
    var mq = window.matchMedia('(min-width: 1100px)');
    var apply = function () { if (mq.matches) { if (!rows.length) wrapFigures(); } else unwrapFigures(); };
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
  }

  // Wide tables scroll sideways inside their own box instead of widening the page.
  function wrapTables() {
    Array.prototype.forEach.call(document.querySelectorAll('body.page table'), function (t) {
      if (t.closest('.table-wrap')) return;
      var w = el('div', { 'class': 'table-wrap' });
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  // Inline formulas too long for a phone line scroll on their own rather than
  // stretching the page (runs once MathJax has finished typesetting).
  function fixWideInline(tries) {
    var mj = window.MathJax;
    if (!mj || !mj.startup || !mj.startup.promise) {
      if (tries < 40) setTimeout(function () { fixWideInline(tries + 1); }, 250);
      return;
    }
    mj.startup.promise.then(function () {
      Array.prototype.forEach.call(document.querySelectorAll('mjx-container:not([display="true"])'), function (m) {
        var p = m.parentElement;
        if (p && m.getBoundingClientRect().width > p.clientWidth + 1) m.classList.add('wide-inline');
      });
    });
  }

  function init() { wrapTables(); layoutFigures(); buildNav(); fixWideInline(0); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
