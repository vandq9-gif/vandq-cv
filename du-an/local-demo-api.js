/* local-demo-api.js – giả lập máy chủ nội bộ (/api/...) cho bản DEMO.
   Dữ liệu ảo, lưu trong localStorage của người xem. Không gửi đi đâu cả.
   window.DEMO_API = { key, title, back, initState: () => object | null, ext: { hr: fn, pb: fn } } */
(function () {
  const C = window.DEMO_API || {};
  const KEY = "demo-api:" + (C.key || "app");
  const json = (o, st) => new Response(JSON.stringify(o), { status: st || 200, headers: { "Content-Type": "application/json" } });
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
  const save = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} };
  const _fetch = window.fetch.bind(window);
  window.fetch = async function (u, o) {
    const url = typeof u === "string" ? u : (u && u.url) || "";
    const m = url.match(/^(?:https?:\/\/[^/]+)?\/api\/([^?#]*)/);
    if (!m) return _fetch(u, o);
    const p = m[1], method = ((o && o.method) || "GET").toUpperCase();
    if (p === "state") {
      if (method === "GET") {
        let s = load();
        if (!s && C.initState) { s = C.initState(); if (s) save(s); }
        return s ? json(s) : json({ error: "not found" }, 404);
      }
      try { save(JSON.parse(o.body)); } catch (e) {}
      return json({ ok: true, ts: Date.now() });
    }
    if (p.startsWith("ext/")) { const k = p.slice(4); return json(C.ext && C.ext[k] ? C.ext[k]() : {}); }
    if (p === "backups" || p === "kt/files" || p === "inbox" || p === "scanners") return json([]);
    if (p === "ping") return json({ ok: false }, 404);
    return json({ ok: false, error: "Bản demo không có chức năng này (cần máy tính văn phòng)." }, 501);
  };
  function banner() {
    if (document.getElementById("demo-bar")) return;
    const b = document.createElement("div"); b.id = "demo-bar";
    b.innerHTML = `<span title="${C.title || ""}">🧪 <b>DEMO</b> · dữ liệu ảo</span><span><button type="button">↺ Làm mới</button><a href="${C.back || "../../du-an.html"}">← Dự án</a></span>`;
    b.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:2147483000;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:6px 8px 6px 12px;border-radius:999px;background:rgba(18,20,24,.92);color:#fff;font:500 12px/1.3 system-ui,'Segoe UI',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3)";
    b.querySelectorAll("button,a").forEach(x => x.style.cssText = "margin-left:6px;color:#fff;background:#10b981;border:0;border-radius:999px;padding:4px 9px;font:inherit;cursor:pointer;text-decoration:none");
    b.querySelector("a").style.background = "rgba(255,255,255,.16)";
    b.querySelector("button").onclick = () => { if (confirm("Khôi phục dữ liệu mẫu ban đầu?")) { localStorage.removeItem(KEY); (C.clearKeys || []).forEach(k => localStorage.removeItem(k)); try { indexedDB.deleteDatabase && (C.clearIdb || []).forEach(n => indexedDB.deleteDatabase(n)); } catch (e) {} location.reload(); } };
    document.body.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", banner); else banner();
})();
