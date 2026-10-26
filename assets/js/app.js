const CATEGORIES = [
  "Keys",
  "Wallet",
  "Phone",
  "Laptop & tablet",
  "Bag & backpack",
  "Clothing",
  "Accessories",
  "School supplies",
  "Bottle & tumbler",
  "Charger & electronics",
  "Other",
];
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const state = {
  api: localStorage.getItem("foundit-api") || "",
  clientId: localStorage.getItem("foundit-client") || "",
  credential: sessionStorage.getItem("foundit-token") || "",
  user: null,
  items: [],
  filter: { type: "", category: "" },
};
const dialogs = {
  auth: $("#auth-dialog"),
  item: $("#item-dialog"),
  claim: $("#claim-dialog"),
  watch: $("#watch-dialog"),
};
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const button = $("#theme-toggle");
  if (button) {
    const dark = theme === "dark";
    button.innerHTML = dark
      ? '<span aria-hidden="true">&#9728;</span>'
      : '<span aria-hidden="true">&#9790;</span>';
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    button.title = dark ? "Switch to light mode" : "Switch to dark mode";
  }
}
function resolveLostReport(id) {
  if (
    !confirm(
      "Mark this lost report as recovered? It will disappear from the public Lost listings.",
    )
  )
    return;
  request("resolveLostReport", { itemId: id })
    .then(() => {
      toast("Your lost report is now marked recovered.");
      refresh();
      loadRecovery();
    })
    .catch((e) => toast(e.message));
}
function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("show");
  setTimeout(() => e.classList.remove("show"), 2800);
}
async function prepareItemImage(file) {
  if (!file || !file.size) return { imageData: "", imageColor: "" };
  if (!file.type.startsWith("image/")) throw Error("Choose a PNG, JPG, or WebP image.");
  if (file.size > 8 * 1024 * 1024) throw Error("Choose a photo smaller than 8 MB.");
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(Error("The photo could not be read."));
    reader.readAsDataURL(file);
  });
  const image = new Image();
  image.src = source;
  await image.decode();
  let scale = Math.min(1, 640 / Math.max(image.naturalWidth, image.naturalHeight));
  let blob;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  let imageColor = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (!imageColor) {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const counts = {};
      const stride = Math.max(4, Math.floor(pixels.length / 4000 / 4) * 4);
      for (let i = 0; i < pixels.length; i += stride) {
        if (pixels[i + 3] < 180) continue;
        const family = describeColor(pixels[i], pixels[i + 1], pixels[i + 2]);
        counts[family] = (counts[family] || 0) + 1;
      }
      imageColor = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || "";
    }
    blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.72));
    if (blob && blob.size < 29000) break;
    scale *= 0.78;
  }
  if (!blob || blob.size >= 30000) throw Error("That photo is too detailed to save. Try a smaller or simpler image.");
  const imageData = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(Error("The photo could not be prepared."));
    reader.readAsDataURL(blob);
  });
  return { imageData, imageColor };
}
function describeColor(red, green, blue) {
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue);
  const light = (max + min) / 510;
  if (light < 0.18) return "black";
  if (light > 0.9) return "white";
  const delta = max - min;
  if (delta < 24) return light < 0.42 ? "gray" : "white";
  let hue;
  if (max === red) hue = ((green - blue) / delta + (green < blue ? 6 : 0)) * 60;
  else if (max === green) hue = ((blue - red) / delta + 2) * 60;
  else hue = ((red - green) / delta + 4) * 60;
  if (light < 0.34 && hue > 15 && hue < 55) return "brown";
  if (hue < 15 || hue >= 345) return "red";
  if (hue < 42) return "orange";
  if (hue < 68) return "yellow";
  if (hue < 165) return "green";
  if (hue < 255) return "blue";
  if (hue < 290) return "purple";
  return "pink";
}
function safe(s = "") {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function icon(category = "Other") {
  const c = category.toLowerCase();
  if (c.includes("key")) return "&#128273;";
  if (c.includes("wallet")) return "&#128091;";
  if (c.includes("phone")) return "&#128241;";
  if (c.includes("laptop")) return "&#128187;";
  if (c.includes("bag")) return "&#127890;";
  if (c.includes("cloth")) return "&#129509;";
  if (c.includes("bottle")) return "&#129380;";
  if (c.includes("charger") || c.includes("elect")) return "&#128268;";
  if (c.includes("school")) return "&#128211;";
  return "&#128230;";
}
function populateCategories() {
  const opts = CATEGORIES.map((x) => `<option>${safe(x)}</option>`).join("");
  $("#category-filter").insertAdjacentHTML("beforeend", opts);
  $$('select[name="category"]').forEach((e) =>
    e.insertAdjacentHTML("beforeend", opts),
  );
  $("#category-shortcuts").innerHTML = CATEGORIES.map(
    (x) =>
      `<button class="category-chip" data-category="${safe(x)}">${safe(x)}</button>`,
  ).join("");
}
function apiConfigured() {
  return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(state.api);
}
async function request(action, data = {}) {
  if (!apiConfigured())
    throw Error(
      "Backend setup is needed. Add your Apps Script web app URL in the setup guide.",
    );
  const r = await fetch(state.api, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, token: state.credential, ...data }),
  });
  const j = await r.json();
  if (!r.ok || !j.ok)
    throw Error(j.error || "The request could not be completed.");
  return j;
}
function renderItems(items) {
  state.items = items;
  const query = $("#search").value.toLowerCase(),
    loc = $("#location-filter").value.toLowerCase(),
    type = $("#type-filter").value || state.filter.type,
    cat = $("#category-filter").value || state.filter.category;
  const list = items
    .filter(
      (x) =>
        (!type || x.type === type) &&
        (!cat || x.category === cat) &&
        (!loc || String(x.location).toLowerCase().includes(loc)) &&
        (!query ||
          [x.title, x.category, x.color, x.imageColor, x.description, x.location]
            .join(" ")
            .toLowerCase()
            .includes(query)),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  $("#items-grid").innerHTML = list.length
    ? list
        .map(
          (x) => {
            const art = x.imageData
              ? `<img class="item-photo" src="${safe(x.imageData)}" alt="Photo of ${safe(x.title)}" />`
              : icon(x.category);
            return `<article class="item-card" data-item="${safe(x.id)}" tabindex="0" role="button" aria-label="View ${safe(x.title)}"><div class="item-art ${x.type.toLowerCase()}"><span class="tag ${x.type === "LOST" ? "lost-tag" : "found-tag"}">${safe(x.type)}</span>${art}</div><div class="item-copy"><h3>${safe(x.title)}</h3><p>${safe(x.category)} · ${safe(x.color || x.imageColor || "Color not specified")}</p><div class="item-meta"><span>Location: ${safe(x.location)}</span><span>${safe(x.createdAt ? new Date(x.createdAt).toLocaleDateString() : "Recently")}</span></div></div></article>`;
          },
        )
        .join("")
    : '<div class="notice">No reports match those filters. Try clearing a filter or check again later.</div>';
  $$(".item-card").forEach((e) => {
    e.onclick = () => showItem(e.dataset.item);
    e.onkeydown = (x) => {
      if (x.key === "Enter" || x.key === " ") {
        x.preventDefault();
        showItem(e.dataset.item);
      }
    };
  });
}
function explainMatch(a, b) {
  let points = 0,
    reasons = [];
  if (a.category && a.category === b.category) {
    points += 3;
    reasons.push("same category");
  }
  const aw = (a.title + " " + a.description)
      .toLowerCase()
      .split(/\W+/)
      .filter((x) => x.length > 3),
    bw = (b.title + " " + b.description).toLowerCase().split(/\W+/);
  const overlap = [...new Set(aw.filter((x) => bw.includes(x)))].slice(0, 4);
  if (overlap.length) {
    points += Math.min(3, overlap.length);
    reasons.push("shared words: " + overlap.join(", "));
  }
  if (a.color && b.color && a.color.toLowerCase() === b.color.toLowerCase()) {
    points += 2;
    reasons.push("same color");
  }
  if (
    a.location &&
    b.location &&
    a.location.toLowerCase() === b.location.toLowerCase()
  ) {
    points += 1;
    reasons.push("same general area");
  }
  if (
    a.approxDate &&
    b.approxDate &&
    Math.abs(new Date(a.approxDate) - new Date(b.approxDate)) < 14 * 864e5
  ) {
    points += 1;
    reasons.push("dates are within two weeks");
  }
  return { points, reasons };
}
async function refresh() {
  if (!apiConfigured()) {
    $("#items-grid").innerHTML =
      '<div class="notice"><b>Backend setup required.</b> Public reports will appear here after Apps Script and Google Sheets are configured. No sample reports are shown as real campus activity.</div>';
    return;
  }
  $("#items-grid").innerHTML =
    '<div class="notice">Loading public reports...</div>';
  try {
    const r = await request("listPublic");
    renderItems(r.items || []);
    $("#browse-message").textContent =
      `${(r.items || []).length} public reports loaded.`;
    if (state.user) loadRecovery();
  } catch (e) {
    $("#items-grid").innerHTML =
      `<div class="notice">Could not load reports: ${safe(e.message)} <button class="text-button" id="retry">Retry</button></div>`;
    $("#retry").onclick = refresh;
  }
}
function showItem(id) {
  const x = state.items.find((i) => i.id === id);
  if (!x) return;
  $("#detail-title").textContent = x.title;
  $("#detail-body").innerHTML =
    `${x.imageData ? `<img class="item-detail-photo" src="${safe(x.imageData)}" alt="Photo of ${safe(x.title)}">` : ""}<p><span class="tag ${x.type === "LOST" ? "lost-tag" : "found-tag"}">${safe(x.type)}</span> · ${safe(x.category)}</p><p>${safe(x.description)}</p><p class="muted">Color: ${safe(x.color || "Not specified")} · General area: ${safe(x.location)} · Approximate date: ${safe(x.approxDate || "Not given")}</p><p class="fine-print">Public details never establish ownership. Private clues are checked through ClueLock.</p>${x.type === "FOUND" ? `<button class="button claim-button" id="start-claim">Submit a private claim</button>` : ""}`;
  if (x.type === "FOUND")
    $("#start-claim").onclick = () => {
      if (!state.user) {
        dialogs.item.close();
        dialogs.auth.showModal();
        return;
      }
      $("#claim-form [name=itemId]").value = x.id;
      dialogs.item.close();
      dialogs.claim.showModal();
    };
  dialogs.item.showModal();
}
async function claimSubmit(e) {
  e.preventDefault();
  if (!state.user) return;
  const f = new FormData(e.currentTarget);
  try {
    await request("submitClaim", {
      itemId: f.get("itemId"),
      privateClues: f.get("privateClues"),
      message: f.get("message"),
    });
    e.currentTarget.reset();
    dialogs.claim.close();
    toast("Claim submitted for authorized review.");
    loadRecovery();
  } catch (err) {
    $(".form-status", e.currentTarget).textContent = err.message;
  }
}
async function reportSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget,
    button = $("button[type=submit]", form),
    status = $(".form-status", form),
    f = new FormData(form),
    data = Object.fromEntries(f.entries());
  button.disabled = true;
  button.textContent = "Submitting...";
  status.classList.remove("success");
  status.textContent = "Submitting your report...";
  try {
    const photo = await prepareItemImage(f.get("itemImage"));
    delete data.itemImage;
    data.imageData = photo.imageData;
    data.imageColor = photo.imageColor;
    if (!data.color && photo.imageColor) data.color = photo.imageColor;
    const r = await request("createReport", data);
    form.reset();
    status.classList.add("success");
    status.textContent =
      "Report submitted successfully. It is now visible in Latest reports.";
    toast("Report submitted successfully.");
    await refresh();
    $("#browse").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    status.textContent = "Your report was not confirmed: " + err.message;
  } finally {
    button.disabled = false;
    button.textContent = "Submit report";
  }
}
async function loadRecovery() {
  if (!state.user) return;
  try {
    const r = await request("myRecovery");
    const claims = r.claims || [],
      items = r.reports || [],
      matches = r.matches || [],
      notifications = r.notifications || [];
    const root = $("#my-recovery");
    root.innerHTML = "";
    notifications.forEach((n) => {
      const row = document.createElement("div");
      row.className = "recovery-row";
      row.innerHTML = `<div><b>${safe(n.title)}</b><small>${safe(n.body)}</small></div>`;
      root.append(row);
    });
    items.forEach((i) => {
      const row = document.createElement("div");
      row.className = "recovery-row";
      row.innerHTML = `<div><b>${safe(i.title)}</b><small>${safe(i.type)} - ${safe(i.status || "Reported")}</small></div>`;
      if (i.type === "LOST") {
        const b = document.createElement("button");
        b.className = "text-button";
        b.textContent = "Add to watchlist";
        b.onclick = () => saveWatch(i.id);
        row.append(b);
        if (i.status === "OPEN") {
          const resolved = document.createElement("button");
          resolved.className = "text-button";
          resolved.textContent = "Mark recovered";
          resolved.onclick = () => resolveLostReport(i.id);
          row.append(resolved);
        }
      }
      root.append(row);
    });
    matches.forEach((m) => {
      const row = document.createElement("div");
      row.className = "recovery-row";
      row.innerHTML = `<div><b>Possible match for ${safe(m.lostTitle)}</b><small>${safe((m.reasons || []).join("; "))} - possible match only, not proof</small></div>`;
      const b = document.createElement("button");
      b.className = "text-button";
      b.textContent = "View item";
      b.onclick = () => showItem(m.itemId);
      row.append(b);
      root.append(row);
    });
    claims.forEach((c) => {
      const row = document.createElement("div");
      row.className = "recovery-row";
      row.innerHTML = `<div><b>Claim for ${safe(c.itemTitle || c.itemId)}</b><small>${safe(c.status)}${c.status === "APPROVED" && c.returnRef ? " - SafeReturn ref " + safe(c.returnRef) : ""}</small>${c.privateClues ? `<small>Private clues: ${safe(c.privateClues)}</small><small>Claimant message: ${safe(c.message || "No message")}</small>` : ""}</div>`;
      const actions = document.createElement("div");
      if (
        c.canReview &&
        ["APPROVED", "REJECTED", "DISPUTED"].indexOf(c.status) < 0
      ) {
        [
          ["APPROVED", "Approve"],
          ["MORE_INFO", "Ask for info"],
          ["REJECTED", "Reject"],
          ["DISPUTED", "Escalate"],
        ].forEach(([decision, label]) => {
          const b = document.createElement("button");
          b.className =
            decision === "APPROVED" ? "button button-small" : "text-button";
          b.textContent = label;
          b.onclick = () => reviewClaim(c.id, decision);
          actions.append(b);
        });
      }
      if (c.status === "MORE_INFO" && !c.canReview) {
        const b = document.createElement("button");
        b.className = "button button-small";
        b.textContent = "Provide requested information";
        b.onclick = () => {
          const extra = prompt("Add the requested private information:") || "";
          if (extra)
            request("addInfo", { claimId: c.id, additionalInfo: extra })
              .then(() => {
                toast("Additional information submitted.");
                loadRecovery();
              })
              .catch((e) => toast(e.message));
        };
        actions.append(b);
      }
      if (c.status === "APPROVED") {
        const b = document.createElement("button");
        b.className = "button button-small";
        b.textContent = "Confirm handover";
        b.onclick = () => confirmReturn(c.id);
        actions.append(b);
      }
      row.append(actions);
      root.append(row);
    });
    if (
      !claims.length &&
      !items.length &&
      !matches.length &&
      !notifications.length
    )
      root.innerHTML =
        "<p class=muted>No reports or claims yet. Start with a report above.</p>";
  } catch (e) {
    $("#my-recovery").innerHTML =
      `<p class=muted>Could not load recovery: ${safe(e.message)}</p>`;
  }
}
async function reviewClaim(id, decision) {
  try {
    let note = "";
    if (decision === "MORE_INFO") {
      note =
        prompt("What additional information should the claimant provide?") ||
        "";
      if (!note) return;
      await request("requestInfo", { claimId: id, note });
    } else
      await request("reviewClaim", {
        claimId: id,
        decision,
        note: decision === "DISPUTED" ? "Escalated for staff review." : "",
      });
    toast("Claim updated.");
    loadRecovery();
  } catch (e) {
    toast(e.message);
  }
}
async function saveWatch(id) {
  try {
    await request("watchReport", { itemId: id });
    toast("Lost report added to your watchlist.");
    loadRecovery();
  } catch (e) {
    toast(e.message);
  }
}
async function confirmReturn(id) {
  try {
    await request("confirmReturn", { claimId: id });
    toast("Your handover confirmation was recorded.");
    loadRecovery();
  } catch (e) {
    toast(e.message);
  }
}
function setSignedIn(payload, quiet = false) {
  state.credential = payload.credential;
  sessionStorage.setItem("foundit-token", payload.credential);
  state.user = payload.user;
  $("#session-label").textContent = payload.user.email;
  $("#signout").hidden = false;
  $("#signin-open").hidden = true;
  $("#report-lock").hidden = true;
  $("#report-form .form-fields").hidden = false;
  const recovery = $("#recovery-signin");
  recovery.textContent = "Refresh my recovery";
  recovery.onclick = loadRecovery;
  dialogs.auth.close();
  if (!quiet) toast("Signed in with Google.");
  loadRecovery();
}
function handleCredential(response) {
  state.credential = response.credential;
  request("session")
    .then((r) => setSignedIn({ credential: response.credential, user: r.user }))
    .catch((e) => ($("#auth-status").textContent = e.message));
}
function renderGoogle() {
  const status = $("#auth-status");
  if (location.protocol === "file:") {
    status.textContent =
      "Google sign-in cannot run from a file opened directly. Open FoundIt through http://localhost (for example with VS Code Live Server), then add that address to your OAuth client settings.";
    return;
  }
  if (
    !state.clientId ||
    !state.clientId.endsWith(".apps.googleusercontent.com")
  ) {
    status.textContent =
      "Enter the complete Google OAuth client ID ending in .apps.googleusercontent.com.";
    return;
  }
  if (!apiConfigured()) {
    status.textContent =
      "Enter the full Apps Script web app URL. It starts with https://script.google.com/macros/s/ and ends with /exec. The deployment ID by itself is not enough.";
    return;
  }
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.onload = () => {
    google.accounts.id.initialize({
      client_id: state.clientId,
      callback: handleCredential,
    });
    google.accounts.id.renderButton($("#google-button"), {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "signin_with",
    });
  };
  script.onerror = () =>
    (status.textContent = "Google sign-in could not load.");
  document.head.append(script);
}
function signout() {
  state.credential = "";
  sessionStorage.removeItem("foundit-token");
  state.user = null;
  $("#session-label").textContent = "Guest browsing";
  $("#signout").hidden = true;
  $("#signin-open").hidden = false;
  $("#report-lock").hidden = false;
  $("#report-form .form-fields").hidden = true;
  $("#recovery-signin").textContent = "Sign in to view my recovery";
  $("#recovery-signin").onclick = () => {
    dialogs.auth.showModal();
    renderGoogle();
  };
  $("#my-recovery").innerHTML =
    "<p class=muted>Sign in to see your recovery data.</p>";
  try {
    google.accounts.id.disableAutoSelect();
  } catch {}
  toast("Signed out.");
}
function init() {
  applyTheme(localStorage.getItem("foundit-theme") || "light");
  $("#theme-toggle").onclick = () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("foundit-theme", next);
    applyTheme(next);
  };
  populateCategories();
  refresh();
  $("#refresh").onclick = refresh;
  $("#search").oninput = () => renderItems(state.items);
  $("#type-filter").onchange = () => {
    state.filter.type = "";
    renderItems(state.items);
  };
  $("#category-filter").onchange = () => {
    state.filter.category = "";
    renderItems(state.items);
  };
  $("#location-filter").oninput = () => renderItems(state.items);
  $("#clear-filters").onclick = () => {
    $("#search").value = "";
    $("#location-filter").value = "";
    $("#type-filter").value = "";
    $("#category-filter").value = "";
    state.filter = { type: "", category: "" };
    $$(".category-chip").forEach((x) => x.classList.remove("active"));
    renderItems(state.items);
  };
  $("#category-shortcuts").onclick = (e) => {
    const b = e.target.closest("[data-category]");
    if (!b) return;
    state.filter.category = b.dataset.category;
    $("#category-filter").value = "";
    $$(".category-chip").forEach((x) => x.classList.toggle("active", x === b));
    renderItems(state.items);
  };
  $$("[data-filter-type]").forEach(
    (a) =>
      (a.onclick = () => {
        state.filter.type = a.dataset.filterType;
        $("#type-filter").value = "";
        renderItems(state.items);
      }),
  );
  $("#report-form").onsubmit = reportSubmit;
  let previewUrl = "";
  $("#item-image").onchange = (event) => {
    const preview = $("#image-preview");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const file = event.currentTarget.files[0];
    preview.replaceChildren();
    if (!file) { preview.hidden = true; return; }
    if (!file.type.startsWith("image/")) {
      event.currentTarget.value = "";
      toast("Choose a PNG, JPG, or WebP image.");
      preview.hidden = true;
      return;
    }
    previewUrl = URL.createObjectURL(file);
    const image = document.createElement("img");
    image.src = previewUrl;
    image.alt = "Preview of the item photo";
    preview.append(image);
    preview.hidden = false;
  };
  $("#claim-form").onsubmit = claimSubmit;
  $("#signin-open").onclick = () => {
    dialogs.auth.showModal();
    renderGoogle();
  };
  $("#recovery-signin").onclick = () => {
    dialogs.auth.showModal();
    renderGoogle();
  };
  $$("[data-open-auth]").forEach(
    (b) =>
      (b.onclick = () => {
        dialogs.watch.close();
        dialogs.auth.showModal();
        renderGoogle();
      }),
  );
  $("#signout").onclick = signout;
  $("#watchlist-open").onclick = () => dialogs.watch.showModal();
  $("#client-id").value = state.clientId;
  $("#api-url").value = state.api;
  $("#save-client").onclick = () => {
    state.clientId = $("#client-id").value.trim();
    state.api = $("#api-url").value.trim();
    localStorage.setItem("foundit-client", state.clientId);
    localStorage.setItem("foundit-api", state.api);
    renderGoogle();
    toast("Configuration saved on this device.");
    refresh();
  };
  $$("[data-close]").forEach(
    (b) => (b.onclick = () => b.closest("dialog").close()),
  );
  $(".menu-toggle").onclick = (e) => {
    const nav = $("#main-nav"),
      open = nav.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  };
  $$("#main-nav a").forEach(
    (a) =>
      (a.onclick = () => {
        $("#main-nav").classList.remove("open");
        $(".menu-toggle").setAttribute("aria-expanded", "false");
      }),
  );
  $$("[data-open-auth]").forEach(
    (b) =>
      (b.onclick = () => {
        dialogs.auth.showModal();
        renderGoogle();
      }),
  );
  if (state.api) {
    $("#browse-message").textContent = "Using configured API URL.";
  }
  if (state.credential) {
    request("session")
      .then((r) => setSignedIn({ credential: state.credential, user: r.user }, true))
      .catch(() => {
        state.credential = "";
        sessionStorage.removeItem("foundit-token");
      });
  }
}
document.addEventListener("DOMContentLoaded", init);











