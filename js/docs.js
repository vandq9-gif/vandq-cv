/* Ảnh chứng chỉ / giấy tờ trên trang Hồ sơ.
   Ảnh xem trước bị làm mờ; bản rõ được mã hóa (AES-GCM) và chỉ mở được bằng mật khẩu cấp trong /admin. */
(function () {
  const box = document.getElementById("cv-docs");
  if (!box) return;
  const root = document.body.dataset.root || "";
  const KS = "docs_key_v1";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const hexToBytes = h => new Uint8Array((h.match(/../g) || []).map(x => parseInt(x, 16)));
  const toHex = b => Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
  const b64ToBytes = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const bytesToB64 = b => { let s = ""; b.forEach(x => s += String.fromCharCode(x)); return btoa(s); };
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const fresh = u => fetch(root + u + "?t=" + Date.now(), { cache: "no-store" });
  let DOCS = [], CFG = null;

  async function derive(pw, saltHex) {
    const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
    return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: hexToBytes(saltHex), iterations: 150000, hash: "SHA-256" }, k, 512));
  }
  const allowed = e => e && e.on !== false && (!e.exp || today() <= e.exp) && (!e.apps || !e.apps.length || e.apps.includes("ho-so"));
  async function keyFromSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem(KS) || "null"); if (!s) return null;
      const e = (CFG.list || []).find(x => x.h2 === s.h); if (!allowed(e)) { sessionStorage.removeItem(KS); return null; }
      return crypto.subtle.importKey("raw", b64ToBytes(s.k), "AES-GCM", false, ["decrypt"]);
    } catch (e) { return null; }
  }
  async function unlock(pw) {
    const bits = await derive(pw, CFG.salt), h = toHex(bits.slice(0, 32));
    const e = (CFG.list || []).find(x => x.h2 === h);
    if (!e) {
      // mật khẩu kiểu cũ (chỉ mở được demo)
      const d = toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(CFG.salt + ":" + pw))));
      if ((CFG.list || []).some(x => x.hash === d)) throw new Error("Mật khẩu này chỉ dùng cho bản demo, chưa được cấp quyền xem chứng chỉ.");
      throw new Error("Mật khẩu chưa đúng.");
    }
    if (e.on === false) throw new Error("Mật khẩu này đã bị khóa.");
    if (e.exp && today() > e.exp) throw new Error("Mật khẩu này đã hết hạn.");
    if (!allowed(e) || !e.k) throw new Error("Mật khẩu này chưa được cấp quyền xem chứng chỉ.");
    const wk = await crypto.subtle.importKey("raw", bits.slice(32), "AES-GCM", false, ["decrypt"]);
    const raw = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(e.k.iv) }, wk, b64ToBytes(e.k.ct)));
    try { if ((CFG.remember || "never") !== "never") sessionStorage.setItem(KS, JSON.stringify({ h, k: bytesToB64(raw) })); } catch (x) {}
    return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
  }

  function modal(html) {
    const m = document.createElement("div");
    m.className = "doc-modal";
    m.innerHTML = `<div class="doc-box">${html}</div>`;
    m.addEventListener("click", e => { if (e.target === m || e.target.closest("[data-close]")) m.remove(); });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { m.remove(); document.removeEventListener("keydown", k); } });
    document.body.appendChild(m);
    return m;
  }
  function askPassword() {
    return new Promise(res => {
      const z = CFG.zalo ? `<a href="https://zalo.me/${esc(CFG.zalo)}" target="_blank" rel="noopener">💬 Zalo ${esc(CFG.zalo)}</a>` : "";
      const m = modal(`<button class="doc-x" data-close aria-label="Đóng">✕</button><div class="doc-lock">🔒</div><h3>Xem bản rõ của giấy tờ</h3>
        <p>Nhập mật khẩu được cấp (cùng mật khẩu dùng thử ứng dụng) để xem bản rõ.</p>
        <form><input type="password" placeholder="Nhập mật khẩu" autocomplete="off"><button type="submit">Xem</button></form><div class="doc-er"></div>${z ? `<div class="doc-ct">${z}</div>` : ""}`);
      const f = m.querySelector("form"), i = m.querySelector("input"), b = m.querySelector("button[type=submit]"), er = m.querySelector(".doc-er");
      setTimeout(() => i.focus(), 50);
      new MutationObserver(() => { if (!m.isConnected) res(null); }).observe(document.body, { childList: true });
      f.onsubmit = async e => {
        e.preventDefault(); const v = i.value.trim(); if (!v) return;
        b.disabled = true; b.textContent = "…"; er.textContent = "";
        try { const k = await unlock(v); m.remove(); res(k); }
        catch (x) { er.textContent = x.message || "Không mở được."; i.select(); }
        b.disabled = false; b.textContent = "Xem";
      };
    });
  }
  async function view(d) {
    CFG = await fresh("du-an/pass.json").then(r => r.ok ? r.json() : null).catch(() => null);
    if (!CFG || !CFG.salt) return alert("Chưa thể xem lúc này, vui lòng thử lại sau.");
    let key = await keyFromSession();
    if (!key) key = await askPassword();
    if (!key) return;
    const m = modal(`<button class="doc-x" data-close aria-label="Đóng">✕</button><h3>${esc(d.title)}</h3>${d.note ? `<p>${esc(d.note)}</p>` : ""}<div class="doc-pages"><div class="doc-load">Đang mở…</div></div>`);
    m.classList.add("wide");
    const pages = m.querySelector(".doc-pages");
    try {
      const urls = [];
      for (let i = 0; i < (d.pages || 1); i++) {
        const buf = new Uint8Array(await (await fresh(`docs/${d.id}-${i}.bin`)).arrayBuffer());
        const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.slice(0, 12) }, key, buf.slice(12));
        urls.push(URL.createObjectURL(new Blob([plain], { type: "image/jpeg" })));
      }
      pages.innerHTML = urls.map((u, i) => `<img src="${u}" alt="${esc(d.title)} – trang ${i + 1}">`).join("");
      pages.querySelectorAll("img").forEach(im => im.onclick = () => im.classList.toggle("zoom"));
    } catch (e) { pages.innerHTML = `<div class="doc-load">Không giải mã được tệp. Vui lòng liên hệ để được hỗ trợ.</div>`; try { sessionStorage.removeItem(KS); } catch (x) {} }
  }
  fresh("docs/docs.json").then(r => r.ok ? r.json() : []).then(list => {
    DOCS = (list || []).filter(d => !d.hide);
    if (!DOCS.length) { box.remove(); return; }
    box.innerHTML = `<h3 class="docs-h">Ảnh chứng chỉ &amp; giấy tờ <small>🔒 bấm vào ảnh, nhập mật khẩu để xem bản rõ</small></h3><div class="docs-grid">` +
      DOCS.map((d, i) => `<button class="doc-card" type="button" data-i="${i}"><span class="doc-th"><img src="${root}docs/${esc(d.id)}-blur.jpg" alt="" loading="lazy"><span class="doc-badge">🔒 Xem rõ</span></span><b>${esc(d.title)}</b>${d.note ? `<small>${esc(d.note)}</small>` : ""}</button>`).join("") + `</div>`;
    box.querySelectorAll(".doc-card").forEach(b => b.onclick = () => view(DOCS[+b.dataset.i]));
  }).catch(() => box.remove());
})();
