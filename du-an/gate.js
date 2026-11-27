/* Khóa mật khẩu cho các bản demo – cấu hình trong /admin (mục "Mật khẩu dùng thử"), lưu ở du-an/pass.json */
(function () {
  var KEY = "demo_unlock_v1";
  var app = (location.pathname.match(/du-an\/([^/]+)\//) || [])[1] || "";
  var css = document.createElement("style");
  css.textContent = "body{visibility:hidden!important}";
  (document.head || document.documentElement).appendChild(css);
  var done = false;
  function open() { if (done) return; done = true; css.remove(); var o = document.getElementById("__gate"); if (o) o.remove(); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function ok(cfg, h) {
    return (cfg.list || []).some(function (e) {
      return e.hash === h && e.on !== false && (!e.exp || today() <= e.exp) && (!e.apps || !e.apps.length || e.apps.indexOf(app) >= 0);
    });
  }
  function sha(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    });
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ask(cfg) {
    var z = cfg.zalo ? '<a href="https://zalo.me/' + esc(cfg.zalo) + '" target="_blank" rel="noopener">💬 Zalo ' + esc(cfg.zalo) + "</a>" : "";
    var m = cfg.email ? '<a href="mailto:' + esc(cfg.email) + '">✉️ ' + esc(cfg.email) + "</a>" : "";
    var o = document.createElement("div");
    o.id = "__gate";
    o.innerHTML = '<style>#__gate{position:fixed;inset:0;z-index:2147483647;visibility:visible;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 30% 20%,#1c2a24,#0b0c0f 70%);font:15px/1.55 "Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#121418}' +
      "#__gate *{box-sizing:border-box;margin:0;padding:0}#__gate .bx{width:min(420px,100%);background:#fff;border-radius:22px;padding:28px 26px;box-shadow:0 30px 80px rgba(0,0,0,.45);text-align:center}" +
      "#__gate .ic{width:58px;height:58px;border-radius:18px;background:#dcfce9;display:grid;place-items:center;font-size:28px;margin:0 auto 14px}" +
      "#__gate h2{font-size:21px;font-weight:800;margin-bottom:6px}#__gate p{color:#5f6570;font-size:14px;margin-bottom:16px;white-space:pre-line}" +
      "#__gate form{display:flex;gap:8px}#__gate input{flex:1;min-width:0;border:1.5px solid #e3e1dc;border-radius:12px;padding:11px 13px;font:inherit;outline:none}#__gate input:focus{border-color:#10b981;box-shadow:0 0 0 3px #dcfce9}" +
      "#__gate button{border:0;border-radius:12px;background:#10b981;color:#04140d;font:inherit;font-weight:700;padding:0 18px;cursor:pointer}#__gate button:disabled{opacity:.6}" +
      "#__gate .er{color:#b91c1c;font-size:13px;min-height:20px;margin-top:8px}#__gate .ct{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:6px;font-size:14px}#__gate a{color:#047857;font-weight:600;text-decoration:none}" +
      "#__gate .bk{display:inline-block;margin-top:16px;font-size:13px;color:#5f6570}</style>" +
      '<div class="bx"><div class="ic">🔒</div><h2>' + esc(cfg.title || "Bản dùng thử cần mật khẩu") + "</h2><p>" + esc(cfg.message || "Vui lòng nhập mật khẩu để dùng thử ứng dụng.") + "</p>" +
      '<form><input type="password" placeholder="Nhập mật khẩu" autocomplete="off" autofocus><button type="submit">Mở khóa</button></form><div class="er"></div>' +
      ((z || m) ? '<div class="ct">' + z + m + "</div>" : "") + '<a class="bk" href="../../du-an.html">← Quay lại trang Dự án</a></div>';
    document.documentElement.appendChild(o);
    var f = o.querySelector("form"), i = o.querySelector("input"), b = o.querySelector("button"), er = o.querySelector(".er");
    setTimeout(function () { i.focus(); }, 50);
    f.onsubmit = function (e) {
      e.preventDefault();
      var v = i.value.trim(); if (!v) return;
      b.disabled = true; er.textContent = "";
      sha((cfg.salt || "") + ":" + v).then(function (h) {
        b.disabled = false;
        var hit = (cfg.list || []).filter(function (x) { return x.hash === h; })[0];
        if (ok(cfg, h)) { try { var md = cfg.remember || "never"; if (md !== "never") (md === "session" ? sessionStorage : localStorage).setItem(KEY, JSON.stringify({ h: h, at: Date.now() })); } catch (e) {} open(); return; }
        er.textContent = !hit ? "Mật khẩu chưa đúng." : hit.on === false ? "Mật khẩu này đã bị khóa." : (hit.exp && today() > hit.exp) ? "Mật khẩu này đã hết hạn." : "Mật khẩu này không dùng cho ứng dụng này.";
        i.select();
      });
    };
  }
  fetch("../pass.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (cfg) {
    if (!cfg || !cfg.enabled || !window.crypto || !crypto.subtle) return open();
    var mode = cfg.remember || "never", s = null;
    try {
      if (mode === "never") { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); }
      else s = JSON.parse((mode === "session" ? sessionStorage : localStorage).getItem(KEY) || "null");
    } catch (e) {}
    if (s && s.h && ok(cfg, s.h)) return open();
    var go = function () { ask(cfg); };
    if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
  }).catch(open);
})();
