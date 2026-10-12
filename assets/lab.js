/* Shared helpers for the interactive lab pages (canvas drawing, controls, 2-D/3-D views). */
(function () {
  'use strict';
  var C = { blue: '#2471a3', orange: '#e67e22', red: '#c0392b', green: '#1e8449', purple: '#8e44ad',
            grid: '#e3e8ee', axis: '#9aa7b4', ink: '#2c3e50', fill: 'rgba(230,126,34,0.28)', field: '#5d6d7e' };
  var D2R = Math.PI / 180;

  function $(id) { return document.getElementById(id); }
  function fmt(v, d) { return (Math.abs(v) < 5e-4 ? 0 : v).toFixed(d === undefined ? 2 : d); }
  function deg(v) { return Math.round(v) + '°'; }

  // size a canvas to its box (sharp on high-DPI screens)
  function fit(cv, ratio) {
    var dpr = window.devicePixelRatio || 1;
    var w = cv.parentElement.clientWidth || 300, h = Math.round(w * ratio);
    cv.style.height = h + 'px';
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    return { ctx: ctx, w: w, h: h };
  }
  function label(ctx, s, x, y, col, align, size, weight) {
    ctx.font = (weight || 600) + ' ' + (size || 13) + "px Inter, 'Segoe UI', sans-serif";
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(251,252,253,0.92)'; ctx.strokeText(s, x, y);
    ctx.fillStyle = col || C.ink; ctx.fillText(s, x, y);
  }
  function arrow(ctx, x1, y1, x2, y2, col, w, k) {
    var a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 0.5) return;
    k = Math.min(k || 8, 0.7 * L);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 1.5;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - 0.6 * k * Math.cos(a), y2 - 0.6 * k * Math.sin(a)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - k * Math.cos(a - 0.42), y2 - k * Math.sin(a - 0.42));
    ctx.lineTo(x2 - k * Math.cos(a + 0.42), y2 - k * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill();
  }
  function poly(ctx, pts, stroke, fill, w, dash, close) {
    if (!pts.length) return;
    ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    if (close || fill) ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.setLineDash(dash || []); ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.5; ctx.stroke(); ctx.setLineDash([]); }
  }
  function range(id, show, cb) {
    var el = $(id), out = $(id + '-o');
    el.addEventListener('input', function () { if (out) out.textContent = show(+el.value); cb(); });
    if (out) out.textContent = show(+el.value);
    return el;
  }
  function setRange(el, v, show) { el.value = v; var o = $(el.id + '-o'); if (o) o.textContent = show(+el.value); }
  function segmented(id, cb) {
    var box = $(id);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      cb(b);
    });
  }
  function typeset(el) { if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([el]); }

  // ---------------------------------------------------------------- 2-D world view
  function Plane(cv, ratio, win) {
    var v = { cv: cv, ratio: ratio, win: win };
    v.begin = function () {
      var g = fit(cv, ratio); v.ctx = g.ctx; v.w = g.w; v.h = g.h;
      var W = v.win;
      v.s = Math.min((g.w - 24) / (W[1] - W[0]), (g.h - 24) / (W[3] - W[2]));
      v.ox = g.w / 2 - v.s * (W[0] + W[1]) / 2; v.oy = g.h / 2 + v.s * (W[2] + W[3]) / 2;
      return v.ctx;
    };
    v.P = function (x, y) { return [v.ox + v.s * x, v.oy - v.s * y]; };
    v.X = function (px, py) { return [(px - v.ox) / v.s, (v.oy - py) / v.s]; };
    v.grid = function (step, labels) {
      var ctx = v.ctx, W = v.win, k;
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      for (k = Math.ceil(W[0] / step) * step; k <= W[1]; k += step) { var a = v.P(k, W[2]), b = v.P(k, W[3]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      for (k = Math.ceil(W[2] / step) * step; k <= W[3]; k += step) { var c = v.P(W[0], k), d = v.P(W[1], k); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke(); }
      var o = v.P(0, 0);
      arrow(ctx, 4, o[1], v.w - 4, o[1], C.axis, 1.2, 7); arrow(ctx, o[0], v.h - 4, o[0], 4, C.axis, 1.2, 7);
      label(ctx, (labels || 'xy')[0], v.w - 12, o[1] + 13, C.axis, 'center', 12, 500);
      label(ctx, (labels || 'xy')[1], o[0] + 11, 12, C.axis, 'center', 12, 500);
    };
    v.line = function (a, b, col, w, dash) { poly(v.ctx, [v.P(a[0], a[1]), v.P(b[0], b[1])], col, null, w, dash); };
    v.arrow = function (a, b, col, w, k) { var p = v.P(a[0], a[1]), q = v.P(b[0], b[1]); arrow(v.ctx, p[0], p[1], q[0], q[1], col, w, k); };
    v.curve = function (f, t0, t1, col, w, n, dash, fill) {
      var pts = []; n = n || 160;
      for (var i = 0; i <= n; i++) { var p = f(t0 + (t1 - t0) * i / n); if (p) pts.push(v.P(p[0], p[1])); }
      poly(v.ctx, pts, col, fill, w, dash);
    };
    v.dot = function (x, y, col, r) { var p = v.P(x, y); v.ctx.fillStyle = col || C.ink; v.ctx.beginPath(); v.ctx.arc(p[0], p[1], r || 4.5, 0, 2 * Math.PI); v.ctx.fill(); };
    v.text = function (s, x, y, col, align, dx, dy, size) { var p = v.P(x, y); label(v.ctx, s, p[0] + (dx || 0), p[1] + (dy || 0), col, align, size); };
    // implicit curve f(x, y) = c by marching squares
    v.contour = function (f, c, col, w, n) {
      var W = v.win; n = n || 120;
      var dx = (W[1] - W[0]) / n, dy = (W[3] - W[2]) / n, i, j, V = [];
      for (i = 0; i <= n; i++) { V.push([]); for (j = 0; j <= n; j++) V[i].push(f(W[0] + i * dx, W[2] + j * dy) - c); }
      var ctx = v.ctx; ctx.strokeStyle = col; ctx.lineWidth = w || 1.4; ctx.beginPath();
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
        var cs = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], pts = [];
        for (var k = 0; k < 4; k++) {
          var a = cs[k], b = cs[(k + 1) % 4], va = V[a[0]][a[1]], vb = V[b[0]][b[1]];
          if ((va < 0) !== (vb < 0)) { var t = va / (va - vb); pts.push([W[0] + (a[0] + t * (b[0] - a[0])) * dx, W[2] + (a[1] + t * (b[1] - a[1])) * dy]); }
        }
        for (var m = 0; m + 1 < pts.length; m += 2) { var p = v.P(pts[m][0], pts[m][1]), q = v.P(pts[m + 1][0], pts[m + 1][1]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
      }
      ctx.stroke();
    };
    // background colour map: f > 0 red, f < 0 blue
    v.heat = function (f, vmax, step) {
      var ctx = v.ctx, st = step || 6;
      for (var px = 0; px < v.w; px += st) for (var py = 0; py < v.h; py += st) {
        var p = v.X(px + st / 2, py + st / 2), val = f(p[0], p[1]);
        if (!isFinite(val)) continue;
        var a = Math.min(1, Math.abs(val) / vmax) * 0.5;
        ctx.fillStyle = val > 0 ? 'rgba(192,57,43,' + a + ')' : 'rgba(36,113,163,' + a + ')';
        ctx.fillRect(px, py, st, st);
      }
    };
    v.field = function (F, n, col, maxLen) {
      var W = v.win, nx = n, ny = Math.round(n * (W[3] - W[2]) / (W[1] - W[0])), i, j, vals = [], m = 0;
      for (i = 0; i < nx; i++) for (j = 0; j < ny; j++) {
        var x = W[0] + (i + 0.5) * (W[1] - W[0]) / nx, y = W[2] + (j + 0.5) * (W[3] - W[2]) / ny, f = F(x, y);
        vals.push([x, y, f[0], f[1]]); m = Math.max(m, Math.hypot(f[0], f[1]));
      }
      var L = maxLen || 0.45 * (W[1] - W[0]) / nx;
      vals.forEach(function (q) {
        var mg = Math.hypot(q[2], q[3]); if (mg < 1e-9 || !m) return;
        var k = L * (0.3 + 0.7 * mg / m) / mg;
        v.arrow([q[0] - q[2] * k / 2, q[1] - q[3] * k / 2], [q[0] + q[2] * k / 2, q[1] + q[3] * k / 2], col || C.field, 1.4, 6);
      });
    };
    v.onDrag = function (cb) {
      var down = false;
      var go = function (e) { var r = cv.getBoundingClientRect(); cb(v.X(e.clientX - r.left, e.clientY - r.top)); };
      cv.addEventListener('pointerdown', function (e) { down = true; cv.setPointerCapture(e.pointerId); go(e); });
      cv.addEventListener('pointermove', function (e) { if (down) go(e); });
      ['pointerup', 'pointercancel'].forEach(function (n) { cv.addEventListener(n, function () { down = false; }); });
      cv.style.cursor = 'crosshair';
    };
    return v;
  }

  // ---------------------------------------------------------------- 3-D orthographic view (drag to rotate)
  function View3D(cv, ratio, scaleFor) {
    var v = { yaw: 0.55, pitch: 0.42, cv: cv, ratio: ratio };
    v.begin = function () {
      var g = fit(cv, ratio); v.ctx = g.ctx; v.w = g.w; v.h = g.h;
      v.s = scaleFor(g.w); v.cx = g.w * 0.5; v.cy = g.h * 0.56;
      return v.ctx;
    };
    v.depth = function (x, y, z) { return x * Math.cos(v.yaw) + y * Math.sin(v.yaw) + z * 0; };
    v.P = function (x, y, z) {
      var sx = -x * Math.sin(v.yaw) + y * Math.cos(v.yaw), d = x * Math.cos(v.yaw) + y * Math.sin(v.yaw);
      return [v.cx + v.s * sx, v.cy - v.s * (z * Math.cos(v.pitch) - d * Math.sin(v.pitch))];
    };
    // how much a direction points towards the viewer
    v.toward = function (n) {
      var cx = Math.cos(v.pitch), sx = Math.sin(v.pitch);
      return (n[0] * Math.cos(v.yaw) + n[1] * Math.sin(v.yaw)) * cx + n[2] * sx;
    };
    v.line = function (a, b, col, w, dash) { var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]); poly(v.ctx, [p, q], col, null, w, dash); };
    v.arrow = function (a, b, col, w, k) { var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]); arrow(v.ctx, p[0], p[1], q[0], q[1], col, w, k); };
    v.curve = function (f, t0, t1, col, w, dash, n, fill) {
      var pts = []; n = n || 60;
      for (var i = 0; i <= n; i++) { var p = f(t0 + (t1 - t0) * i / n); pts.push(v.P(p[0], p[1], p[2])); }
      poly(v.ctx, pts, col, fill, w, dash);
    };
    v.quad = function (pts3, stroke, fill, w) { poly(v.ctx, pts3.map(function (p) { return v.P(p[0], p[1], p[2]); }), stroke, fill, w, null, true); };
    v.text = function (s, p3, col, dx, dy, align) { var p = v.P(p3[0], p3[1], p3[2]); label(v.ctx, s, p[0] + (dx || 0), p[1] + (dy || 0), col, align || 'left'); };
    v.dot = function (p3, col, r) { var p = v.P(p3[0], p3[1], p3[2]); v.ctx.fillStyle = col; v.ctx.beginPath(); v.ctx.arc(p[0], p[1], r || 4.5, 0, 2 * Math.PI); v.ctx.fill(); };
    v.axes = function (L) {
      [[[L, 0, 0], 'x'], [[0, L, 0], 'y'], [[0, 0, L], 'z']].forEach(function (a) {
        var o = v.P(0, 0, 0), e = v.P(a[0][0], a[0][1], a[0][2]);
        arrow(v.ctx, o[0], o[1], e[0], e[1], C.axis, 1.2, 7);
        label(v.ctx, a[1], e[0] + (e[0] < o[0] ? -10 : 10), e[1] + (a[1] === 'z' ? -6 : 8), C.axis, 'center', 12, 500);
      });
    };
    // draw a parametrised surface as depth-sorted quads; colour(u, v, quad) may return a fill
    v.surface = function (f, u0, u1, v0, v1, nu, nv, colour, stroke) {
      var quads = [], i, j;
      for (i = 0; i < nu; i++) for (j = 0; j < nv; j++) {
        var a = u0 + (u1 - u0) * i / nu, b = u0 + (u1 - u0) * (i + 1) / nu, c = v0 + (v1 - v0) * j / nv, d = v0 + (v1 - v0) * (j + 1) / nv;
        var q = [f(a, c), f(b, c), f(b, d), f(a, d)];
        var m = [0, 1, 2].map(function (k) { return (q[0][k] + q[1][k] + q[2][k] + q[3][k]) / 4; });
        var cx = Math.cos(v.pitch), sx = Math.sin(v.pitch);
        var depth = (m[0] * Math.cos(v.yaw) + m[1] * Math.sin(v.yaw)) * cx + m[2] * sx;
        quads.push({ q: q, d: depth, u: (a + b) / 2, v: (c + d) / 2 });
      }
      quads.sort(function (p, q) { return p.d - q.d; });
      quads.forEach(function (Q) { v.quad(Q.q, stroke || 'rgba(36,113,163,0.35)', colour ? colour(Q.u, Q.v, Q.q) : 'rgba(234,242,248,0.75)', 0.8); });
    };
    var drag = null, redraw = function () {};
    v.onDraw = function (f) { redraw = f; };
    cv.addEventListener('pointerdown', function (e) { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) {
      if (!drag) return;
      v.yaw -= (e.clientX - drag[0]) * 0.01;
      v.pitch = Math.max(-0.2, Math.min(1.5, v.pitch + (e.clientY - drag[1]) * 0.01));
      drag = [e.clientX, e.clientY]; redraw();
    });
    ['pointerup', 'pointercancel'].forEach(function (n) { cv.addEventListener(n, function () { drag = null; }); });
    cv.style.cursor = 'grab';
    return v;
  }

  // redraw every registered sim on resize / once fonts load
  var sims = [];
  function register(f) { sims.push(f); f(); }
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { sims.forEach(function (f) { f(); }); }, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { sims.forEach(function (f) { f(); }); });

  window.Lab = { C: C, D2R: D2R, $: $, fmt: fmt, deg: deg, fit: fit, label: label, arrow: arrow, poly: poly,
                 range: range, setRange: setRange, segmented: segmented, typeset: typeset,
                 Plane: Plane, View3D: View3D, register: register };
})();
