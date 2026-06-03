/* ===========================
   LUMINAROMA — main.js
   =========================== */

// =========== NAVBAR SCROLL ===========
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  handleBackToTop();
  revealOnScroll();
  updateActiveNav();
});

// =========== HAMBURGER / MOBILE MENU ===========
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("open");
  isOpen ? closeMobileMenu() : openMobileMenu();
});

function openMobileMenu() {
  mobileMenu.classList.add("open");
  hamburger.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  hamburger.classList.remove("open");
  document.body.style.overflow = "";
}

mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) closeMobileMenu();
});

// =========== SCROLL REVEAL ===========
const revealTargets = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right",
);

function revealOnScroll() {
  revealTargets.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
}
revealOnScroll();

// =========== BACK TO TOP ===========
const backToTopBtn = document.getElementById("backToTop");

function handleBackToTop() {
  backToTopBtn.classList.toggle("visible", window.scrollY > 400);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========== MOOD FINDER ===========
function switchMood(mood) {
  // Update tabs
  document.querySelectorAll(".mood-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mood === mood);
  });
  // Update panels
  document.querySelectorAll(".mood-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === "mood-" + mood);
  });
}

// =========== ACTIVE NAV ===========
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute("id");
  });
  navLinks.forEach((link) => {
    link.style.color = "";
    if (link.getAttribute("href") === "#" + current)
      link.style.color = "var(--stone)";
  });
}

// =========================================================
// CART SYSTEM
// =========================================================
let cart = []; // Array of { id, name, price, qty }

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartEmpty = document.getElementById("cartEmpty");
const cartItemsEl = document.getElementById("cartItems");
const cartFooter = document.getElementById("cartFooter");
const cartBadge = document.getElementById("cartBadge");
const cartSubtotalEl = document.getElementById("cartSubtotal");

// Peta gambar asli per produk
const productImages = {
  "Cocoa Calm":
    "https://images.unsplash.com/photo-1602607337800-e31e5ae18e21?w=120&q=80",
  "Forest Mist":
    "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=120&q=80",
  "Lavender Dusk":
    "https://images.unsplash.com/photo-1603905009956-2bd2bafbbf20?w=120&q=80",
  "Peony Dusk":
    "https://images.unsplash.com/photo-1602607337800-e31e5ae18e21?w=120&q=80",
  "English Rose":
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=120&q=80",
  "Mediterranean Fig":
    "https://images.unsplash.com/photo-1519455953755-af066f52f1a6?w=120&q=80",
  "Cedar & Smoke":
    "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=120&q=80",
  "Vanilla Cloud":
    "https://images.unsplash.com/photo-1603905009956-2bd2bafbbf20?w=120&q=80",
  "Bergamot Breeze":
    "https://images.unsplash.com/photo-1602607337800-e31e5ae18e21?w=120&q=80",
};

// Emoji tetap dipakai untuk pesan WA
const productEmoji = {
  "Cocoa Calm": "🍫",
  "Forest Mist": "🌲",
  "Lavender Dusk": "💜",
  "Peony Dusk": "🌸",
  "English Rose": "🌹",
  "Mediterranean Fig": "🌿",
  "Cedar & Smoke": "🪵",
  "Vanilla Cloud": "☁️",
  "Bergamot Breeze": "🍋",
};

function toggleCart() {
  const isOpen = cartDrawer.classList.contains("open");
  if (isOpen) {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  } else {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function addToCart(name, price) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: Date.now(), name, price, qty: 1 });
  }
  renderCart();
  updateBadge();
  showToast(`✓ ${name} ditambahkan ke keranjang`);

  // Open cart drawer briefly to show feedback
  if (!cartDrawer.classList.contains("open")) {
    toggleCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
  updateBadge();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  renderCart();
  updateBadge();
}

function renderCart() {
  const isEmpty = cart.length === 0;
  cartEmpty.style.display = isEmpty ? "flex" : "none";
  cartItemsEl.style.display = isEmpty ? "none" : "flex";
  cartFooter.style.display = isEmpty ? "none" : "block";

  cartItemsEl.innerHTML = "";

  cart.forEach((item) => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item-img">
        ${
          productImages[item.name]
            ? `<img src="${productImages[item.name]}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"/>`
            : "🕯️"
        }
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatRupiah(item.price * item.qty)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Hapus">✕</button>
    `;
    cartItemsEl.appendChild(el);
  });

  // Update subtotal
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartSubtotalEl.textContent = formatRupiah(total);
}

function updateBadge() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  cartBadge.textContent = total;
  cartBadge.classList.remove("bump");
  void cartBadge.offsetWidth; // reflow to restart animation
  cartBadge.classList.add("bump");
}

function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

// =========================================================
// CHECKOUT MODAL
// =========================================================

// ⬇️ GANTI nomor WhatsApp toko di sini (format: 62xxxxxxxxxx)
const WA_NUMBER = "6285726300988";

function checkout() {
  if (cart.length === 0) return;

  // Tutup cart drawer dulu
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "hidden";

  // Isi ringkasan pesanan di modal
  renderCheckoutSummary();

  // Buka modal
  document.getElementById("checkoutOverlay").classList.add("open");
  document.getElementById("checkoutModal").classList.add("open");

  // Reset & fokus nama
  setTimeout(() => document.getElementById("ckName").focus(), 300);
}

function closeCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("open");
  document.getElementById("checkoutModal").classList.remove("open");
  document.body.style.overflow = "";
  clearAllErrors();
}

// Tutup dengan Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCheckout();
});

function renderCheckoutSummary() {
  const listEl = document.getElementById("checkoutOrderList");
  const totalEl = document.getElementById("checkoutTotal");
  listEl.innerHTML = "";

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "checkout-order-item";
    row.innerHTML = `
      <div class="checkout-order-item-name">
        <span>${productEmoji[item.name] || "🕯️"}</span>
        <span>${item.name}</span>
        <span class="checkout-order-qty">x${item.qty}</span>
      </div>
      <span class="checkout-order-price">${formatRupiah(item.price * item.qty)}</span>
    `;
    listEl.appendChild(row);
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = formatRupiah(total);
}

// ── Validasi form ──────────────────────────────────────────
function clearAllErrors() {
  ["errName", "errPhone", "errAddress", "errCity", "errShipping"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    },
  );
  ["ckName", "ckPhone", "ckAddress", "ckCity"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("error");
  });
}

function setError(fieldId, errId, msg) {
  document.getElementById(fieldId).classList.add("error");
  document.getElementById(errId).textContent = msg;
}

function validateCheckout() {
  clearAllErrors();
  let valid = true;

  const name = document.getElementById("ckName").value.trim();
  const phone = document.getElementById("ckPhone").value.trim();
  const address = document.getElementById("ckAddress").value.trim();
  const city = document.getElementById("ckCity").value.trim();

  if (!name) {
    setError("ckName", "errName", "Nama lengkap wajib diisi.");
    valid = false;
  }

  const phoneClean = phone.replace(/[\s\-().]/g, "");
  if (!phone) {
    setError("ckPhone", "errPhone", "Nomor WhatsApp wajib diisi.");
    valid = false;
  } else if (!/^\d{8,13}$/.test(phoneClean)) {
    setError("ckPhone", "errPhone", "Nomor tidak valid (8–13 digit).");
    valid = false;
  }

  if (!address) {
    setError("ckAddress", "errAddress", "Alamat pengiriman wajib diisi.");
    valid = false;
  }

  if (!city) {
    setError("ckCity", "errCity", "Kota wajib diisi.");
    valid = false;
  }

  return valid;
}

// ── Kirim ke WhatsApp ──────────────────────────────────────
function submitToWhatsApp() {
  if (!validateCheckout()) {
    // Scroll ke error pertama
    const firstErr = document.querySelector(
      ".form-group input.error, .form-group textarea.error",
    );
    if (firstErr)
      firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const name = document.getElementById("ckName").value.trim();
  const phone = document
    .getElementById("ckPhone")
    .value.trim()
    .replace(/[\s\-().]/g, "");
  const address = document.getElementById("ckAddress").value.trim();
  const city = document.getElementById("ckCity").value.trim();
  const postal = document.getElementById("ckPostal").value.trim();
  const note = document.getElementById("ckNote").value.trim();
  const shipping =
    document.querySelector('input[name="shipping"]:checked')?.value || "-";

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // ── Susun pesan WhatsApp ──
  const lines = [];
  lines.push("🕯️ *PESANAN BARU — Luminaroma*");
  lines.push("─────────────────────────");
  lines.push(`👤 *Nama:* ${name}`);
  lines.push(`📱 *WhatsApp:* +62${phone}`);
  lines.push(`📍 *Alamat:* ${address}, ${city}${postal ? ", " + postal : ""}`);
  lines.push(`🚚 *Pengiriman:* ${shipping}`);
  lines.push("");
  lines.push("🛒 *Detail Pesanan:*");
  cart.forEach((item) => {
    lines.push(
      `  ${productEmoji[item.name] || "🕯️"} ${item.name} × ${item.qty}  —  ${formatRupiah(item.price * item.qty)}`,
    );
  });
  lines.push("");
  lines.push(`💰 *Total Produk: ${formatRupiah(total)}*`);
  lines.push("_(Ongkos kirim akan dikonfirmasi)_");
  if (note) {
    lines.push("");
    lines.push(`📝 *Catatan:* ${note}`);
  }
  lines.push("");
  lines.push("Mohon konfirmasi ketersediaan dan total akhir. Terima kasih! 🙏");

  const message = lines.join("\n");
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  // Buka WhatsApp di tab baru
  window.open(waUrl, "_blank");

  // Tutup modal & kosongkan keranjang
  closeCheckout();
  cart = [];
  renderCart();
  updateBadge();
  showToast("✅ Pesanan dikirim ke WhatsApp!");
}

// =========== TOAST ===========
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// =========================================================
// REVIEW SLIDESHOW
// =========================================================
let currentReview = 0;
let reviewAutoTimer = null;
let reviewProgressTimer = null;
const REVIEW_INTERVAL = 5000; // ms per slide

const reviewsTrack = document.getElementById("reviewsTrack");
const reviewsDots = document.querySelectorAll(".rev-dot");
const progressBar = document.getElementById("reviewsProgressBar");

function getReviewCount() {
  return reviewsTrack ? reviewsTrack.children.length : 0;
}

function reviewGoTo(index) {
  currentReview = (index + getReviewCount()) % getReviewCount();
  reviewsTrack.style.transform = `translateX(-${currentReview * 100}%)`;
  reviewsDots.forEach((d, i) =>
    d.classList.toggle("active", i === currentReview),
  );
  resetProgressBar();
}

function reviewMove(dir) {
  reviewGoTo(currentReview + dir);
}

function resetProgressBar() {
  if (!progressBar) return;
  // Reset animasi
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";
  void progressBar.offsetWidth; // reflow
  progressBar.style.transition = `width ${REVIEW_INTERVAL}ms linear`;
  progressBar.style.width = "100%";
}

function startReviewAuto() {
  stopReviewAuto();
  reviewAutoTimer = setInterval(() => reviewMove(1), REVIEW_INTERVAL);
  resetProgressBar();
}

function stopReviewAuto() {
  clearInterval(reviewAutoTimer);
  if (progressBar) {
    progressBar.style.transition = "none";
    // Bekukan di posisi sekarang
    const computed = getComputedStyle(progressBar).width;
    const parentW = progressBar.parentElement.offsetWidth;
    progressBar.style.width = computed;
  }
}

// Touch swipe untuk reviews
let revTouchX = 0;
const revWrap = document.querySelector(".reviews-track-wrap");
if (revWrap) {
  revWrap.addEventListener(
    "touchstart",
    (e) => {
      revTouchX = e.touches[0].clientX;
    },
    { passive: true },
  );
  revWrap.addEventListener("touchend", (e) => {
    const diff = revTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      reviewMove(diff > 0 ? 1 : -1);
    }
  });
  // Pause saat hover (desktop)
  revWrap.addEventListener("mouseenter", stopReviewAuto);
  revWrap.addEventListener("mouseleave", startReviewAuto);
}

// =========== INIT ===========
revealOnScroll();
handleBackToTop();
renderCart();
updateBadge();
startReviewAuto();

// =========== CONTACT FORM ===========
function selectTopic(btn) {
  document
    .querySelectorAll(".cf-topic")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function sendContactMessage() {
  const name = document.getElementById("cfName").value.trim();
  const contactInfo = document.getElementById("cfContact").value.trim();
  const message = document.getElementById("cfMessage").value.trim();
  const topic =
    document.querySelector(".cf-topic.active")?.textContent || "Umum";

  if (!name || !message) {
    showToast("Mohon isi nama dan pesan terlebih dahulu.");
    return;
  }

  const text = encodeURIComponent(
    `Halo Luminaroma! 👋\n\n*Nama:* ${name}\n*Kontak:* ${contactInfo || "-"}\n*Topik:* ${topic}\n\n*Pesan:*\n${message}`,
  );
  window.open(`https://wa.me/6285726300988?text=${text}`, "_blank");
}
