/* =====================================================================
   demo-runtime.js – giả lập môi trường chạy (claude.use) cho bản DEMO
   Toàn bộ dữ liệu là dữ liệu ẢO, lưu trên trình duyệt của người xem
   (localStorage). Không kết nối máy chủ, không có dữ liệu thật.
   Dùng: đặt window.DEMO = { key, seed: {"coll/id": {...}}, ai: fn } trước khi nạp file này.
   ===================================================================== */
(function () {
  const CFG = window.DEMO || {};
  const KEY = "demo:" + (CFG.key || "app");
  const clone = o => (o == null ? o : JSON.parse(JSON.stringify(o)));
  let store;
  function loadStore() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s && s.__v === (CFG.version || 1)) return s.data; } catch (e) {}
    return clone(typeof CFG.seed === "function" ? CFG.seed() : CFG.seed || {});
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify({ __v: CFG.version || 1, data: store })); } catch (e) {} }
  store = loadStore();

  /* ---------- Firestore-like DB ---------- */
  const listeners = new Set();
  let pending = false;
  function notify() {
    if (pending) return; pending = true;
    setTimeout(() => { pending = false; persist(); listeners.forEach(l => { try { l.fire(); } catch (e) { console.error(e); } }); }, 0);
  }
  const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const docSnap = (path) => {
    const id = path.split("/").pop(), d = store[path];
    return { id, exists: d !== undefined, ref: docRef(path), data: () => clone(d), get: f => (d ? clone(d[f]) : undefined) };
  };
  function querySnap(docs) {
    return { docs, size: docs.length, empty: !docs.length, forEach: fn => docs.forEach(fn), metadata: { fromCache: false, hasPendingWrites: false }, docChanges: () => docs.map(d => ({ type: "added", doc: d })) };
  }
  function cmp(a, op, b) {
    switch (op) {
      case "==": case "eq": return a === b; case "!=": case "ne": return a !== b;
      case "<": case "lt": return a < b; case "<=": case "lte": return a <= b;
      case ">": case "gt": return a > b; case ">=": case "gte": return a >= b;
      case "in": return (b || []).includes(a); case "not-in": return !(b || []).includes(a);
      case "array-contains": return Array.isArray(a) && a.includes(b);
      default: return true;
    }
  }
  function query(coll, opts) {
    const q = Object.assign({ where: [], order: null, lim: 0 }, opts);
    const api = {
      where: (f, op, v) => query(coll, Object.assign({}, q, { where: q.where.concat([[f, op, v]]) })),
      orderBy: (f, dir) => query(coll, Object.assign({}, q, { order: [f, dir || "asc"] })),
      limit: n => query(coll, Object.assign({}, q, { lim: n })),
      run() {
        const pre = coll + "/";
        let ps = Object.keys(store).filter(p => p.startsWith(pre) && p.indexOf("/", pre.length) < 0);
        ps = ps.filter(p => q.where.every(([f, op, v]) => cmp((store[p] || {})[f], op, v)));
        if (q.order) { const [f, dir] = q.order; ps.sort((a, b) => { const x = store[a][f], y = store[b][f]; return (x > y ? 1 : x < y ? -1 : 0) * (dir === "desc" ? -1 : 1); }); }
        if (q.lim) ps = ps.slice(0, q.lim);
        return querySnap(ps.map(docSnap));
      },
      get: async () => api.run(),
      onSnapshot(next, err) {
        const cb = typeof next === "function" ? next : next && next.next;
        const l = { fire: () => cb && cb(api.run()) };
        listeners.add(l); setTimeout(l.fire, 30);
        return () => listeners.delete(l);
      }
    };
    return api;
  }
  function collRef(coll) {
    const q = query(coll);
    return Object.assign(q, {
      id: coll.split("/").pop(), path: coll,
      doc: id => docRef(coll + "/" + (id || rid())),
      add: async data => { const id = rid(); store[coll + "/" + id] = clone(data); notify(); return docRef(coll + "/" + id); }
    });
  }
  function merge(a, b) { const o = Object.assign({}, a || {}); Object.keys(b || {}).forEach(k => { o[k] = b[k]; }); return o; }
  function docRef(path) {
    return {
      id: path.split("/").pop(), path,
      collection: sub => collRef(path + "/" + sub),
      get: async () => docSnap(path),
      set: async (data, opt) => { store[path] = opt && opt.merge ? merge(store[path], clone(data)) : clone(data); notify(); },
      update: async patch => {
        const cur = clone(store[path] || {});
        Object.keys(patch || {}).forEach(k => { if (k.includes(".")) { const ks = k.split("."); let o = cur; ks.slice(0, -1).forEach(x => { o[x] = o[x] || {}; o = o[x]; }); o[ks.at(-1)] = clone(patch[k]); } else cur[k] = clone(patch[k]); });
        store[path] = cur; notify();
      },
      delete: async () => { delete store[path]; notify(); },
      onSnapshot(next, err) {
        const cb = typeof next === "function" ? next : next && next.next;
        const l = { fire: () => cb && cb(docSnap(path)) };
        listeners.add(l); setTimeout(l.fire, 30);
        return () => listeners.delete(l);
      }
    };
  }
  const DB = {
    collection: c => collRef(c),
    doc: p => docRef(p),
    batch() { const ops = []; return { set: (r, d, o) => ops.push(() => r.set(d, o)), update: (r, d) => ops.push(() => r.update(d)), delete: r => ops.push(() => r.delete()), commit: async () => { for (const f of ops) await f(); } }; },
    runTransaction: async fn => fn({ get: r => r.get(), set: (r, d, o) => r.set(d, o), update: (r, d) => r.update(d), delete: r => r.delete() })
  };

  /* ---------- Ảnh/tệp tải lên (chỉ trong phiên) ---------- */
  const blobs = {};
  const ASSETS = {
    upload: async (file, opt) => { const id = "demo-" + rid(); blobs[id] = file instanceof Blob ? file : new Blob([file], { type: (opt && opt.type) || "" }); return { id, sizeBytes: blobs[id].size }; },
    delete: async id => { delete blobs[id]; },
    url: id => (blobs[id] ? URL.createObjectURL(blobs[id]) : "")
  };
  const _fetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const s = typeof u === "string" ? u : (u && u.url) || "";
    const m = s.match(/\/_blob\/([^?#]+)/);
    if (m) return Promise.resolve(blobs[m[1]] ? new Response(blobs[m[1]]) : new Response("", { status: 404 }));
    return _fetch(u, o);
  };
  const DL = {
    save: async ({ filename, data }) => {
      const b = data instanceof Blob ? data : new Blob([data]);
      const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = filename || "file"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000); return { ok: true };
    }
  };
  const USER = { can: async () => true, id: "demo-user", name: "Khách xem demo", role: "admin", get: async () => ({ id: "demo-user", name: "Khách xem demo" }) };

  /* ---------- AI (giả lập, trả lời mẫu) ---------- */
  const DEMO_AI = "🔒 Đây là bản DEMO với dữ liệu ảo: tính năng AI đã được tắt. Ở bản thật, nhân viên AI sẽ đọc yêu cầu, làm việc và trả kết quả ngay tại đây.";
  async function sample(prompt, opt) {
    const text = (CFG.ai && CFG.ai(prompt)) || DEMO_AI;
    if (opt && opt.onText) { let i = 0; while (i < text.length) { i = Math.min(text.length, i + 18); opt.onText({ text: text.slice(0, i) }); await new Promise(r => setTimeout(r, 25)); } }
    return { text, content: text, stopReason: "end_turn" };
  }
  sample.json = async () => (CFG.aiJson ? CFG.aiJson() : { tasks: [] });
  sample.text = async p => (await sample(p)).text;

  /* ---------- Đọc to (dùng giọng đọc của trình duyệt) ---------- */
  function makeTTS() {
    if (!("speechSynthesis" in window)) return null;
    const lineCbs = [], stateCbs = [];
    const emit = (arr, e) => arr.forEach(f => { try { f(e); } catch (x) {} });
    return {
      speak(lines) {
        speechSynthesis.cancel(); const arr = Array.isArray(lines) ? lines : [{ text: String(lines) }];
        return new Promise(res => {
          arr.forEach((l, i) => {
            const u = new SpeechSynthesisUtterance(l.text || ""); u.lang = (l.language || "vi").startsWith("en") ? "en-US" : "vi-VN"; if (l.rate) u.rate = l.rate;
            u.onstart = () => { emit(lineCbs, { id: l.id }); emit(stateCbs, { state: "speaking" }); };
            if (i === arr.length - 1) u.onend = () => { emit(stateCbs, { state: "idle" }); res(); };
            speechSynthesis.speak(u);
          });
        });
      },
      say(t) { return this.speak([{ text: t }]); },
      stop() { speechSynthesis.cancel(); emit(stateCbs, { state: "idle" }); },
      onLine: f => lineCbs.push(f), onState: f => stateCbs.push(f)
    };
  }
  /* ---------- Nhận giọng nói (nếu trình duyệt hỗ trợ) ---------- */
  function makeDictation() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return null;
    let rec = null, on = false; const P = [], F = [], S = [];
    const emit = (arr, e) => arr.forEach(f => { try { f(e); } catch (x) {} });
    return {
      start(opt) {
        return new Promise((res, rej) => {
          rec = new SR(); rec.lang = (opt && opt.language) || "en-US"; rec.interimResults = true; rec.continuous = true;
          rec.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; (r.isFinal ? F : P).forEach(f => f({ text: r[0].transcript + (r.isFinal ? " " : "") })); } };
          rec.onerror = e => { on = false; emit(S, { state: "idle" }); rej({ code: e.error === "not-allowed" ? "not_granted" : e.error }); };
          rec.onend = () => { on = false; emit(S, { state: "idle" }); };
          rec.onstart = () => { on = true; emit(S, { state: "listening" }); res(); };
          rec.start();
        });
      },
      stop: async () => { if (rec) rec.stop(); },
      active: () => on,
      onPartial: f => P.push(f), onFinal: f => F.push(f), onState: f => S.push(f)
    };
  }

  const caps = { db: DB, assets: ASSETS, downloads: DL, user: USER, sample, tts: makeTTS(), dictation: makeDictation() };
  window.claude = { use: async name => (name in caps ? caps[name] : null), demo: true };

  /* ---------- Thanh thông báo DEMO ---------- */
  function banner() {
    if (document.getElementById("demo-bar")) return;
    const b = document.createElement("div"); b.id = "demo-bar";
    b.innerHTML = `<span title="${CFG.title || ""}">🧪 <b>DEMO</b> · dữ liệu ảo</span><span><button type="button" id="demo-reset">↺ Làm mới</button><a href="${CFG.back || "../../du-an.html"}">← Dự án</a></span>`;
    b.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:2147483000;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;max-width:calc(100vw - 20px);padding:6px 8px 6px 12px;border-radius:999px;background:rgba(18,20,24,.92);color:#fff;font:500 12px/1.3 system-ui,'Segoe UI',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3);backdrop-filter:blur(6px)";
    b.querySelectorAll("button,a").forEach(x => x.style.cssText = "margin-left:6px;color:#fff;background:#10b981;border:0;border-radius:999px;padding:4px 9px;font:inherit;cursor:pointer;text-decoration:none");
    b.querySelector("a").style.background = "rgba(255,255,255,.16)";
    document.body.appendChild(b);
    b.querySelector("#demo-reset").onclick = () => { if (confirm("Khôi phục toàn bộ dữ liệu mẫu ban đầu?")) { localStorage.removeItem(KEY); location.reload(); } };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", banner); else banner();
})();
