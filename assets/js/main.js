/* ════════════════════════════════════════════════════════════════
   ESCAPING PLANET EARTH — main.js
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Starfield (amber, pinned to the page so it scrolls with content) ── */
  (function () {
    var c = document.getElementById("stars");
    if (!c) return;
    var x = c.getContext("2d"), st = [], W, H, docH;
    function pageHeight() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, innerHeight);
    }
    function size() { W = c.width = innerWidth; H = c.height = innerHeight; docH = pageHeight(); build(); }
    function build() {
      st = [];
      var n = Math.min(210, Math.floor((W * docH) / 16000));
      for (var i = 0; i < n; i++) st.push({
        x: Math.random() * W, y: Math.random() * docH,
        r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.55 + 0.15,
        tw: Math.random() * 0.016 + 0.004, d: Math.random() < 0.5 ? 1 : -1
      });
    }
    function draw() {
      x.clearRect(0, 0, W, H);
      var off = window.scrollY || window.pageYOffset || 0;
      for (var i = 0; i < st.length; i++) {
        var s = st[i];
        if (!reduce) { s.a += s.tw * s.d; if (s.a > 0.75 || s.a < 0.12) s.d *= -1; }
        var y = s.y - off;
        if (y < -2 || y > H + 2) continue;
        x.beginPath(); x.arc(s.x, y, s.r, 0, 6.283);
        // warm amber stars (brighter cores on the larger ones)
        x.fillStyle = (s.r > 1 ? "rgba(232,180,120," : "rgba(224,151,76,") + s.a + ")";
        x.fill();
      }
    }
    function loop() { draw(); if (!reduce) requestAnimationFrame(loop); }
    addEventListener("resize", function () { size(); if (reduce) draw(); });
    addEventListener("load", function () { docH = pageHeight(); build(); if (reduce) draw(); });
    size();
    if (!reduce) requestAnimationFrame(loop);
    else { draw(); addEventListener("scroll", draw, { passive: true }); }
  })();

  /* ── Scroll reveal (emerge from blur) ───────────────────────── */
  (function () {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ── Cursor-follow glow on cards, featured, picks, doors ────── */
  document.querySelectorAll(".card, .featured, .pick, .links3 a").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ── Reading progress bar ───────────────────────────────────── */
  (function () {
    var bar = document.getElementById("readingProgress");
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = max > 0 ? (h.scrollTop / max * 100) + "%" : "0%";
    }
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update, { passive: true });
    update();
  })();

  /* ── Header solidifies on scroll ────────────────────────────── */
  (function () {
    var head = document.querySelector("header.top");
    if (!head) return;
    function onScroll() { head.classList.toggle("solid", scrollY > 60); }
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ── Background music: autoplays on open, clear mute button ──── */
  (function () {
    var btn = document.getElementById("audioBtn");
    var a = document.getElementById("bgAudio");
    if (!btn || !a) return;
    var KEY = "epe-audio", POS = "epe-audio-pos", SRC = "epe-audio-src", TARGET = 0.5, ramp = null;
    var tip = btn.querySelector(".tip");
    function curSrc() { var s = a.querySelector("source"); return (a.currentSrc || (s && s.src) || ""); }
    function setUI(on) {
      btn.classList.toggle("playing", on);
      if (tip) tip.textContent = on ? "Mute the music" : "Play music";
      btn.setAttribute("aria-label", on ? "Mute background music" : "Play background music");
      btn.setAttribute("title", on ? "Mute the music" : "Play music");
    }
    function fadeTo(vol, then) {
      clearInterval(ramp);
      ramp = setInterval(function () {
        var step = 0.04;
        if (Math.abs(a.volume - vol) <= step) { a.volume = vol; clearInterval(ramp); if (then) then(); return; }
        a.volume += a.volume < vol ? step : -step;
        a.volume = Math.max(0, Math.min(1, a.volume));
      }, 40);
    }
    function start() {
      try {
        var last = localStorage.getItem(SRC), cur = curSrc();
        if (last === cur) { var p = parseFloat(localStorage.getItem(POS)); if (!isNaN(p) && p < (a.duration || 1e9)) a.currentTime = p; }
        else { localStorage.setItem(SRC, cur); localStorage.removeItem(POS); }
      } catch (e) {}
      a.volume = 0;
      var pr = a.play();
      if (pr && pr.then) pr.then(function () { setUI(true); fadeTo(TARGET); })
        .catch(function () { setUI(false); arm(); });
      else { setUI(true); fadeTo(TARGET); }
    }
    function stop() { fadeTo(0, function () { a.pause(); }); setUI(false); }
    // if the browser blocks autoplay, begin on the visitor's first interaction
    function arm() {
      var go = function () {
        if (localStorage.getItem(KEY) !== "off" && a.paused) start();
        document.removeEventListener("pointerdown", go);
        document.removeEventListener("keydown", go);
        document.removeEventListener("scroll", go);
      };
      document.addEventListener("pointerdown", go);
      document.addEventListener("keydown", go);
      document.addEventListener("scroll", go, { passive: true });
    }

    btn.addEventListener("click", function () {
      var on = !btn.classList.contains("playing");
      try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
      if (on) start(); else stop();
    });
    setInterval(function () { try { if (!a.paused) localStorage.setItem(POS, a.currentTime); } catch (e) {} }, 1000);

    // default ON: play on open unless the visitor muted it before
    var want = "on";
    try { want = localStorage.getItem(KEY) || "on"; } catch (e) {}
    if (want !== "off") start(); else setUI(false);
  })();

  /* ── Focus mode (reading only) ──────────────────────────────── */
  (function () {
    var btn = document.getElementById("focusBtn");
    if (!btn) return;
    var label = btn.querySelector(".f-label");
    function set(on) {
      document.body.classList.toggle("focus", on);
      if (label) label.textContent = on ? "Exit focus" : "Focus";
    }
    btn.addEventListener("click", function () { set(!document.body.classList.contains("focus")); });
    addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  })();

  /* ── Archive search filter ──────────────────────────────────── */
  (function () {
    var input = document.getElementById("archSearch");
    if (!input) return;
    var rows = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
    var years = Array.prototype.slice.call(document.querySelectorAll(".arch-year"));
    var empty = document.getElementById("archEmpty");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      rows.forEach(function (r) {
        var hit = r.getAttribute("data-search").indexOf(q) > -1;
        r.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      // hide year headers that have no visible rows
      years.forEach(function (y) {
        var sib = y.nextElementSibling, any = false;
        while (sib && !sib.classList.contains("arch-year")) {
          if (sib.hasAttribute("data-search") && sib.style.display !== "none") { any = true; break; }
          sib = sib.nextElementSibling;
        }
        y.style.display = any ? "" : "none";
      });
      if (empty) empty.style.display = shown === 0 ? "" : "none";
    });
  })();
})();
