/* Web CV Đinh Quý Văn – điều khiển chung cho mọi trang */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const root = body.dataset.root || "";
  const page = body.dataset.page || "";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const P = typeof PROFILE !== "undefined" ? PROFILE : {};
  const S = typeof SOCIAL !== "undefined" ? SOCIAL : {};
  const posts = (typeof POSTS !== "undefined" ? POSTS : []).map(p => ({ ...p, img: p.img || ((P.covers || {})[p.slug]) }));
  const videos = typeof VIDEOS !== "undefined" ? VIDEOS : [];
  const fmtDate = d => { const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}`; };
  const initials = (typeof SITE !== "undefined" && SITE.initials) || "VĐ";
  const zaloUrl = P.zalo ? "https://zalo.me/" + P.zalo : "";
  const fmtPhone = x => String(x).replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");

  /* ---------- Header ---------- */
  const SI = typeof SITE !== "undefined" ? SITE : {};
  const NAV = (SI.nav || [
    { key: "home", href: "index.html", text: "Trang chủ" }, { key: "cv", href: "ho-so.html", text: "Hồ sơ" }, { key: "posts", href: "bai-viet.html", text: "Bài viết" },
    { key: "projects", href: "du-an.html", text: "Dự án" }, { key: "video", href: "video.html", text: "Video" }, { key: "run", href: "chay-bo.html", text: "Chạy bộ" }, { key: "contact", href: "lien-he.html", text: "Liên hệ" }
  ]).filter(n => !n.hide).map(n => [n.key, n.href, esc(n.text)]);
  const absUrl = h => /^(https?:|mailto:|tel:|#)/.test(h) ? h : root + h;
  const activeKey = page === "post" ? "posts" : page;
  const header = $("#site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `<div class="container nav">
      <a class="brand" href="${root}index.html">${P.logo ? `<img class="brand-mark" src="${root}${P.logo}" alt="${initials}" onerror="this.outerHTML='<span class=&quot;brand-mark&quot;>${initials}</span>'">` : `<span class="brand-mark">${initials}</span>`}<span>${esc(P.name || "Đinh Quý Văn")}<small>${esc(SI.brandSub ?? "Quản lý sản xuất · Kỷ luật · Học tập")}</small></span></a>
      <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false">☰</button>
      <ul class="menu">${NAV.map(([k, h, t]) => `<li><a href="${absUrl(h)}"${k === activeKey ? ' class="active" aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul>
      ${SI.navCta === "" ? "" : `<a class="btn btn-dark btn-sm nav-cta" href="${absUrl(SI.navCtaHref || "lien-he.html")}">${esc(SI.navCta || "Kết nối")}</a>`}
    </div>`;
    const tg = $(".menu-toggle", header), menu = $(".menu", header);
    tg.addEventListener("click", () => { const o = menu.classList.toggle("open"); tg.setAttribute("aria-expanded", o); tg.textContent = o ? "✕" : "☰"; });
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 10);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---------- Footer ---------- */
  const footer = $("#site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `<div class="container foot">
      <div><a class="brand" href="${root}index.html">${P.logo ? `<img class="brand-mark" src="${root}${P.logo}" alt="${initials}" onerror="this.outerHTML='<span class=&quot;brand-mark&quot;>${initials}</span>'">` : `<span class="brand-mark">${initials}</span>`}<span>${esc(P.name)}<small>${esc(P.title || "")}</small></span></a>
        <p style="margin-top:14px">${esc(P.motto || "")}</p></div>
      <div><h4>${esc(SI.footPages || "Trang")}</h4><ul>${NAV.map(([, h, t]) => `<li><a href="${absUrl(h)}">${t}</a></li>`).join("")}</ul></div>
      <div><h4>${esc(SI.footConnect || "Kết nối")}</h4><ul>
        ${P.phone ? `<li><a href="tel:${esc(P.phone)}">📞 ${esc(P.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3"))}</a></li>` : ""}
        ${zaloUrl ? `<li><a href="${zaloUrl}" target="_blank" rel="noopener">💬 Zalo ${fmtPhone(P.zalo)}</a></li>` : ""}
        ${P.email ? `<li><a href="mailto:${esc(P.email)}">✉️ ${esc(P.email)}</a></li>` : ""}
        ${S.facebookPage ? `<li><a href="${S.facebookPage}" target="_blank" rel="noopener">Facebook</a></li>` : ""}
        ${S.tiktok ? `<li><a href="${S.tiktok}" target="_blank" rel="noopener">${esc(SI.tiktokLabel || "TikTok @vandq96")}</a></li>` : ""}
        <li>📍 ${esc(P.area || "Hải Phòng")}</li></ul></div>
    </div>
    <div class="container copy">© ${new Date().getFullYear()} ${esc(P.name)} · ${esc(SI.copyright ?? (P.area || "Hải Phòng"))}</div>`;
  }

  /* ---------- Thẻ bài viết ---------- */
  const card = (p, featured) => `<article class="post-card${featured ? " post-featured" : ""} reveal">
    <a class="post-cover" style="--c:${p.color}" href="${root}bai-viet/${p.slug}.html">${p.img ? `<img src="${root}${p.img}" alt="" loading="lazy">` : ""}<span class="emoji" aria-hidden="true">${p.emoji}</span><span class="cat">${esc(p.cat)}</span></a>
    <div class="post-body"><div class="post-meta">${fmtDate(p.date)} · ${p.read} phút đọc</div>
      <h3><a href="${root}bai-viet/${p.slug}.html">${esc(p.title)}</a></h3>
      <p>${esc(p.short)}</p></div></article>`;

  /* ---------- Thẻ video ---------- */
  const thumbCache = {};
  const vcard = v => `<a class="vcard reveal" href="https://www.tiktok.com/@vandq96/video/${v.id}" target="_blank" rel="noopener" data-vid="${v.id}" aria-label="Xem video: ${esc(v.title)}">
    <img alt="" loading="lazy" src="${root}images/videos/${v.id}.jpg" onerror="this.remove()">
    ${v.pinned ? '<span class="pin">📌 Ghim</span>' : ""}<span class="play">▶</span>
    <span class="vinfo"><span class="vtag">${esc(v.tag)}</span><h3>${esc(v.title)}</h3><div class="views">▶ ${esc(v.views)} lượt xem</div></span></a>`;
  function loadThumbs(scope) {
    $$("img[data-thumb]", scope).forEach(img => {
      const id = img.dataset.thumb;
      const set = u => { if (u) { img.src = u; img.hidden = false; img.onerror = () => (img.hidden = true); } };
      if (thumbCache[id]) return thumbCache[id].then(set);
      thumbCache[id] = fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent("https://www.tiktok.com/@vandq96/video/" + id)}`)
        .then(r => (r.ok ? r.json() : null)).then(j => j && j.thumbnail_url).catch(() => null);
      thumbCache[id].then(set);
    });
  }

  /* ---------- Modal xem video ---------- */
  let modal;
  function openVideo(id) {
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
      modal.innerHTML = `<div class="modal-box"><button class="modal-close" type="button" aria-label="Đóng">✕</button><div class="frame"></div><div class="m-foot"></div></div>`;
      document.body.appendChild(modal);
      modal.addEventListener("click", e => { if (e.target === modal || e.target.closest(".modal-close")) closeVideo(); });
      addEventListener("keydown", e => { if (e.key === "Escape") closeVideo(); });
    }
    $(".frame", modal).innerHTML = `<iframe src="https://www.tiktok.com/embed/v2/${id}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Video TikTok"></iframe>`;
    $(".m-foot", modal).innerHTML = `<a href="https://www.tiktok.com/@vandq96/video/${id}" target="_blank" rel="noopener">Mở trên TikTok ↗</a>`;
    modal.classList.add("open"); document.body.style.overflow = "hidden";
    $(".modal-close", modal).focus();
  }
  function closeVideo() { if (!modal) return; modal.classList.remove("open"); $(".frame", modal).innerHTML = ""; document.body.style.overflow = ""; }
  const canEmbed = /(^|\.)vandq\.id\.vn$|netlify\.app$|github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-vid]"); if (!b) return;
    if (canEmbed) { e.preventDefault(); openVideo(b.dataset.vid); }
    else if (b.tagName !== "A") { e.preventDefault(); window.open("https://www.tiktok.com/@vandq96/video/" + b.dataset.vid, "_blank", "noopener"); }
  });

  /* ---------- Avatar ---------- */
  const avatar = (el, ph = P.photo) => { if (!el) return; el.innerHTML = ph ? `<img src="${root}${ph}" alt="${esc(P.name)}">` : `<div class="avatar-empty">${initials}</div>`; };

  /* ---------- Trang chủ ---------- */
  if (page === "home") {
    $("#hero-name").textContent = P.name; avatar($("#hero-avatar"));
    const hero = $("#hero"), photos = (P.heroPhotos || []);
    if (photos.length) {
      hero.classList.remove("no-photo");
      photos.forEach((u, i) => { const d = document.createElement("div"); d.className = "hero-bg" + (i ? "" : " show"); d.style.backgroundImage = `url(${root}${u})`; hero.prepend(d); });
      const bgs = $$(".hero-bg", hero); let i = 0;
      if (bgs.length > 1) setInterval(() => { bgs[i].classList.remove("show"); i = (i + 1) % bgs.length; bgs[i].classList.add("show"); }, 6000);
    }
    $("#home-posts").innerHTML = posts.slice(0, 4).map((p, i) => card(p, i === 0)).join("");
    $("#home-videos").innerHTML = videos.slice(0, 4).map(vcard).join("");
    
  }

  /* ---------- Dự án ---------- */
  const PJ = typeof PROJECTS !== "undefined" ? PROJECTS : [];
  const pjCard = (x, short) => `<article class="pj reveal" id="${x.id}">
    <a class="pj-shot" href="${root}${x.demo}" target="_blank" rel="noopener"><img src="${root}images/du-an/${x.id}.jpg" alt="Giao diện ${esc(x.name)} (dữ liệu ảo)" loading="lazy"><span class="pj-play">▶ Dùng thử</span></a>
    <div class="pj-body">
      <div class="pj-top"><span class="pj-ico">${x.icon}</span><div><h3>${esc(x.name)}</h3><span class="pj-tag">${esc(x.tag)}</span></div><span class="pj-st ${x.status === "Đang dùng thực tế" ? "live" : x.status === "Thử nghiệm" ? "beta" : "dev"}">${esc(x.status)}</span></div>
      <p class="pj-prob">${esc(x.problem)}</p>
      ${short ? "" : `<ul class="pj-feat">${x.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>`}
      <div class="tags">${x.tech.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="pj-act"><a class="btn btn-dark btn-sm" href="${root}${x.demo}" target="_blank" rel="noopener">Dùng thử demo ↗</a>${short ? `<a class="btn btn-line btn-sm" href="${root}du-an.html#${x.id}">Chi tiết</a>` : ""}</div>
    </div></article>`;
  if (page === "projects") {
    $("#ds-du-an").innerHTML = PJ.map(x => pjCard(x)).join("");
    const live = PJ.filter(x => x.status === "Đang dùng thực tế").length;
    $("#pj-stats").innerHTML = [[PJ.length, "ứng dụng tự xây"], [live, "đang dùng thực tế"], ["1 người", "tự thiết kế & vận hành"], ["100%", "bắt đầu từ việc thật"]].map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("");
  }
  if (page === "home" && $("#home-projects")) $("#home-projects").innerHTML = PJ.slice(0, 3).map(x => pjCard(x, true)).join("");
  /* Khóa mật khẩu bản demo (cấu hình trong /admin) */
  if ($$(".pj").length) fetch(root + "du-an/pass.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(c => {
    if (!c || !c.enabled) return;
    $$(".pj").forEach(card => {
      $$(".pj-play", card).forEach(e => e.textContent = "🔒 Dùng thử");
      $$(".pj-act .btn-dark", card).forEach(e => e.textContent = "🔒 Dùng thử demo ↗");
      if (c.cardNote && !$(".pj-lock", card)) { const n = document.createElement("p"); n.className = "pj-lock"; n.textContent = c.cardNote; const act = $(".pj-act", card); act && act.after(n); }
    });
  }).catch(() => {});

  /* ---------- Hồ sơ ---------- */
  if (page === "cv") {
    $("#cv-name").textContent = P.name; avatar($("#cv-avatar"), P.photoCv || P.photo);
    $("#motto").textContent = "“" + (P.motto || "") + "”";
    const facts = [["Khu vực", P.area], ["Điện thoại", P.phone && `<a href="tel:${P.phone}">${P.phone}</a>`], ["Email", P.email && `<a href="mailto:${P.email}">${P.email}</a>`],
      ["Kinh nghiệm", "9 năm sản xuất"], ["Học vấn", "QTKD – năm 3"], ["Chứng chỉ", "2 chứng chỉ kế toán"]].filter(f => f[1]);
    $("#facts").innerHTML = facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
    $("#print-cv").addEventListener("click", () => print());
  }

  /* ---------- Danh sách bài viết ---------- */
  if (page === "posts") {
    const cats = ["Tất cả", ...new Set(posts.map(p => p.cat))];
    let cur = "Tất cả", q = "";
    const f = $("#filters"), list = $("#all-posts"), empty = $("#empty");
    f.innerHTML = cats.map(c => `<button class="chip${c === cur ? " active" : ""}" type="button" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
    const render = () => {
      const items = posts.filter(p => (cur === "Tất cả" || p.cat === cur) && (!q || norm(p.title + " " + p.short).includes(norm(q))));
      list.innerHTML = items.map((p, i) => card(p, i === 0 && cur === "Tất cả" && !q)).join("");
      empty.style.display = items.length ? "none" : "block"; reveal();
    };
    f.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; cur = b.dataset.c; $$(".chip", f).forEach(x => x.classList.toggle("active", x === b)); render(); });
    $("#search").addEventListener("input", e => { q = e.target.value.trim(); render(); });
    render();
  }

  /* ---------- Video ---------- */
  if (page === "video") {
    $("#tt-follow").href = S.tiktok; $("#fb-follow").href = S.facebookPage;
    const tags = ["Tất cả", ...new Set(videos.map(v => v.tag))]; let cur = "Tất cả";
    const f = $("#vfilters"), grid = $("#all-videos");
    f.innerHTML = tags.map(t => `<button class="chip${t === cur ? " active" : ""}" type="button" data-t="${esc(t)}">${esc(t)}</button>`).join("");
    const render = () => { grid.innerHTML = videos.filter(v => cur === "Tất cả" || v.tag === cur).map(vcard).join(""); reveal(); };
    f.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; cur = b.dataset.t; $$(".chip", f).forEach(x => x.classList.toggle("active", x === b)); render(); });
    render();
    const st = S.tiktokStats || {};
    $("#tt-box").innerHTML = `<h3><span class="dot-tt">♪</span>TikTok @vandq96</h3><p>Video ngắn về kinh nghiệm làm việc, học tập và chạy bộ.</p>
      <div class="stat-row"><div><b>${st.followers || ""}</b><span>người theo dõi</span></div><div><b>${st.likes || ""}</b><span>lượt thích</span></div><div><b>${st.topViews || ""}</b><span>video xem nhiều nhất</span></div></div>
      <blockquote class="tiktok-embed" cite="${S.tiktok}" data-unique-id="vandq96" data-embed-type="creator" style="max-width:780px;min-width:288px"><section><a target="_blank" href="${S.tiktok}">@vandq96</a></section></blockquote>`;
    $("#fb-box").innerHTML = `<h3><span class="dot-fb">f</span>Trang Facebook</h3><p>Bài viết mới nhất từ trang của tôi.</p>
      <iframe title="Trang Facebook" height="560" loading="lazy" scrolling="no" allow="encrypted-media"
        src="https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(S.facebookPage)}&tabs=timeline&width=500&height=560&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&locale=vi_VN"></iframe>`;
    const s = document.createElement("script"); s.src = "https://www.tiktok.com/embed.js"; s.async = true; document.body.appendChild(s);
  }

  /* ---------- Chạy bộ ---------- */
  if (page === "run") {
    $("#run-stats").innerHTML = (typeof RUN_STATS !== "undefined" ? RUN_STATS : []).map(r => `<div class="run-stat reveal"><b>${esc(r.v)}</b><span>${esc(r.l)}</span></div>`).join("");
    $("#milestones").innerHTML = (typeof RUN_MILESTONES !== "undefined" ? RUN_MILESTONES : []).map(m => `<div class="ms reveal${m.when === "Tiếp theo" ? " next" : ""}">
      <div class="when">${esc(m.when)}</div><div><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p>
      ${m.post ? `<a class="btn btn-line btn-sm" href="bai-viet/${m.post}.html">Đọc bài viết →</a>` : ""}
      ${m.video ? `<button class="btn btn-line btn-sm" type="button" data-vid="${m.video}">▶ Xem video</button>` : ""}</div></div>`).join("");
    $("#run-posts").innerHTML = posts.filter(p => p.key && /suc-khoe|chay|ky-luat/.test(p.key) || p.cat.startsWith("Sức khỏe")).map(p => card(p)).join("");
  }

  /* ---------- Liên hệ ---------- */
  if (page === "contact") {
    const items = [
      P.phone && ["📞", "Điện thoại", `<a href="tel:${P.phone}">${P.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}</a>`],
      zaloUrl && ["💬", "Zalo", `<a href="${zaloUrl}" target="_blank" rel="noopener">${fmtPhone(P.zalo)} – nhắn tin ngay</a>`],
      P.email && ["✉️", "Email", `<a href="mailto:${P.email}">${P.email}</a>`],
      ["📍", "Khu vực", esc(P.area || "Hải Phòng")],
      S.facebookPage && ["f", "Facebook", `<a href="${S.facebookPage}" target="_blank" rel="noopener">facebook.com/vandq96</a>`],
      S.tiktok && ["♪", "TikTok", `<a href="${S.tiktok}" target="_blank" rel="noopener">@vandq96</a>`]
    ].filter(Boolean);
    $("#contact-list").innerHTML = items.map(([i, k, v]) => `<li><span class="ico">${i}</span><div><b>${k}</b>${v}</div></li>`).join("");
    const form = $("#contact-form");
    const zalo = $("#zalo-btn"); if (zalo && zaloUrl) zalo.href = zaloUrl; else if (zalo) zalo.remove();
    form.addEventListener("submit", e => {
      e.preventDefault();
      const v = id => $(id).value.trim();
      const subject = `[vandq.id.vn] ${v("#f-topic")} – ${v("#f-name")}`;
      const bodyTxt = `${v("#f-msg")}\n\n—\nHọ tên: ${v("#f-name")}\nLiên hệ: ${v("#f-contact")}`;
      location.href = `mailto:${P.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
    });
  }

  /* ---------- Trang bài viết ---------- */
  if (page === "post") {
    const slug = body.dataset.slug, p = posts.find(x => x.slug === slug) || {};
    const cover = $("[data-cover]"); if (cover && p.img) cover.innerHTML = `<img src="${root}${p.img}" alt="">`;
    const url = location.href.split("#")[0];
    $("#share").innerHTML = `<span>Chia sẻ:</span><a class="btn btn-line btn-sm" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}">Facebook</a><button class="btn btn-line btn-sm" type="button" id="copy-link">Sao chép liên kết</button>`;
    $("#copy-link").addEventListener("click", e => { (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => (e.target.textContent = "Đã sao chép ✓")).catch(() => prompt("Sao chép liên kết:", url)); });
    $("#author").innerHTML = `<div class="avatar" style="width:56px;height:56px;border-radius:16px;overflow:hidden;flex-shrink:0;background:var(--ink)">${P.photo ? `<img src="${root}${P.photo}" alt="" style="width:100%;height:100%;object-fit:cover">` : `<div class="avatar-empty" style="font-size:1.2rem">${initials}</div>`}</div>
      <div><b>${esc(P.name)}</b><p>${esc(P.title)}</p><a href="${root}ho-so.html">Xem hồ sơ →</a></div>`;
    $("#more-posts").innerHTML = posts.filter(x => x.slug !== slug).slice(0, 3).map(x => card(x)).join("");
  }

  /* ---------- Ảnh nền đầu trang con ---------- */
  $$(".page-hero .bg[data-bg]").forEach(el => { const u = (P.pageBg || {})[el.dataset.bg]; if (u) { el.style.backgroundImage = `url(${root}${u})`; el.classList.add("show"); } });

  /* ---------- Nút Zalo nổi ---------- */
  if (zaloUrl) { const z = document.createElement("a"); z.className = "zalo-float"; z.href = zaloUrl; z.target = "_blank"; z.rel = "noopener"; z.setAttribute("aria-label", "Nhắn Zalo " + fmtPhone(P.zalo)); z.innerHTML = "<b>Zalo</b>"; document.body.appendChild(z); }

  /* ---------- Nút lên đầu trang ---------- */
  const top = document.createElement("button");
  top.className = "to-top"; top.type = "button"; top.setAttribute("aria-label", "Lên đầu trang"); top.textContent = "↑";
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(top);
  addEventListener("scroll", () => top.classList.toggle("show", scrollY > 600), { passive: true });

  /* ---------- Hiệu ứng xuất hiện ---------- */
  function reveal() {
    const els = $$(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("visible"));
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -40px 0px" });
    els.forEach(e => io.observe(e));
  }
  reveal();
})();
