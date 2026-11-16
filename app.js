const STORAGE_KEY = "desk_data_path";
const POLL_MS = 5000;

function siteRoot() {
  const p = location.pathname;
  if (p.startsWith("/fomo-desk")) {
    return "/fomo-desk/";
  }
  if (p.endsWith("/index.html")) return p.slice(0, p.length - "index.html".length);
  if (p.endsWith("/")) return p;
  const i = p.lastIndexOf("/");
  return p.slice(0, i + 1);
}

function dataPathFromHash() {
  const raw = (location.hash || "").replace(/^#/, "");
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  const value = params.get("d");
  return value && value.trim() ? value.trim() : null;
}

function resolveDataPath() {
  const fromHash = dataPathFromHash();
  if (fromHash) {
    try { localStorage.setItem(STORAGE_KEY, fromHash); } catch (err) { /* ignore quota */ }
    return fromHash;
  }
  try { return localStorage.getItem(STORAGE_KEY); } catch (err) { return null; }
}

function formatCash(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return "$" + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function tick() {
  const status = document.getElementById("status");
  const modeEl = document.getElementById("mode");
  const balanceEl = document.getElementById("balance");
  const path = resolveDataPath();
  if (!path) {
    modeEl.textContent = "Waiting for link";
    balanceEl.textContent = "—";
    status.textContent = "Open the private desk link once on this phone or browser (it ends with #d=…). The path is stored here after that.";
    return;
  }
  const url = siteRoot() + "d/" + encodeURIComponent(path) + "/state.json?t=" + Date.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      status.textContent = "Could not read desk state (" + res.status + ").";
      return;
    }
    const state = await res.json();
    const mode = state.mode || "PAPER";
    const cash = state.balance ?? state.cash ?? state.cash_usd;
    modeEl.textContent = mode;
    balanceEl.textContent = formatCash(cash);
    status.textContent = "Live from the desk · " + mode;
  } catch (err) {
    status.textContent = "Network error reading desk state.";
  }
}

function boot() {
  tick();
  setInterval(tick, POLL_MS);
  window.addEventListener("hashchange", tick);
  if (window.DeskChart) {
    DeskChart.placeholder(document.getElementById("chart"));
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
boot();
