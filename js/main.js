/* ========================================
   Aloysius Technologies – E-Commerce JS
   Product data, cart, filters, interactions
   ======================================== */

// ===== PRODUCT DATA =====
const products = [
  // Vacuum Cleaners
  {
    id: 1, name: "AMWD15F Wet & Dry Vacuum Cleaner", model: "AMWD15F", category: "vacuum",
    price: 14500, img: "images/vacuum_cleaner.png",
    specs: { "Power": "1000 W", "Tank Capacity": "15 L", "Type": "Industrial", "Material": "Steel / Plastic", "Usage": "Home, Hotel, Workshop, Warehouse, Office" }
  },
  {
    id: 2, name: "AMWD15E Wet & Dry Vacuum Cleaner", model: "AMWD15E", category: "vacuum",
    price: 12500, img: "images/vacuum_cleaner.png",
    specs: { "Power": "1000 W", "Tank Capacity": "15 L", "Material": "Steel / Plastic", "Type": "Industrial" }
  },
  {
    id: 3, name: "AMWD602E Wet & Dry Vacuum Cleaner", model: "AMWD602E", category: "vacuum",
    price: 28600, img: "images/vacuum_cleaner.png",
    specs: { "Power": "2000 W", "Tank Capacity": "60 L", "Type": "Heavy-Duty Industrial", "Material": "Stainless Steel" }
  },
  {
    id: 4, name: "4-in-1 Carpet Vacuum Cleaner", model: "Carpet Pro", category: "vacuum",
    price: 49500, img: "images/vacuum_cleaner.png",
    specs: { "Functions": "Spray Extract, Dry Vacuum, Wet Vacuum", "Pump Pressure": "87 psi", "Air Flow": "55 L/s", "Tank Material": "Stainless Steel" }
  },
  // Single Disc Machines
  {
    id: 5, name: "AMSD1E Single Disc Machine", model: "AMSD1E", category: "disc",
    price: 43800, img: "images/single_disc_machine.png",
    specs: { "Motor": "1.5 HP", "Brush Diameter": "17 inch", "Speed": "175 RPM", "Drive": "Gear Drive", "Weight": "48 kg" }
  },
  {
    id: 6, name: "AMSD1T Single Disc Machine", model: "AMSD1T", category: "disc",
    price: 42800, img: "images/single_disc_machine.png",
    specs: { "Motor": "1.5 HP", "Brush Diameter": "13 inch", "Speed": "175 RPM", "Drive": "Gear Drive", "Weight": "48 kg" }
  },
  {
    id: 7, name: "AMSD1F Single Disc Machine", model: "AMSD1F", category: "disc",
    price: 42800, img: "images/single_disc_machine.png",
    specs: { "Motor": "1.5 HP", "Brush Diameter": "17 inch", "Speed": "175 RPM", "Drive": "Gear Drive" }
  },
  // Floor Scrubbers & Dryers
  {
    id: 8, name: "Walk Behind Scrubber Dryer", model: "AMAS45", category: "scrubber",
    price: 96000, img: "images/floor_scrubber.png",
    specs: { "Working Width": "455 mm", "Tank Capacity": "30–35 L", "Speed": "170 RPM", "Weight": "69 kg", "Type": "Walk Behind" }
  },
  {
    id: 9, name: "AMAS45T Walk Behind Scrubber Dryer", model: "AMAS45T", category: "scrubber",
    price: 96000, img: "images/floor_scrubber.png",
    specs: { "Brush Motor": "1100 W", "Vacuum Motor": "400 W", "Water Tank": "42 L", "Recovery Tank": "42 L", "Weight": "88.7 kg" }
  },
  {
    id: 10, name: "Floor Cleaning Machine", model: "AMAS45T-FC", category: "scrubber",
    price: 96000, img: "images/floor_scrubber.png",
    specs: { "Motor Power": "3 HP", "Working Width": "450 mm", "Tank Capacity": "30 L", "Cable Length": "20 m", "Type": "Walk Behind" }
  },
  // Pressure Washers
  {
    id: 11, name: "AHP130H Industrial Pressure Washer", model: "AHP130H", category: "pressure",
    price: 36500, img: "images/pressure_washer.png",
    specs: { "Pressure": "150 bar", "Power": "1800 W", "Flow Rate": "10 L/min", "Phase": "Single Phase", "Detergent Tank": "8 L" }
  },
  // Sweeping Machines
  {
    id: 12, name: "ATMS920 Manual Sweeping Machine", model: "ATMS920", category: "sweeper",
    price: 18600, img: "images/sweeping_machine.png",
    specs: { "Operation": "Manual Push", "Cleaning Width": "920 mm", "Hopper Capacity": "40 L", "Type": "Walk Behind" }
  },
  // Foam Generators
  {
    id: 13, name: "AMEFME Foam Generator", model: "AMEFME", category: "foam",
    price: 41500, img: "images/foam_generator.png",
    specs: { "Capacity": "50 LPH", "Motor": "0.5 HP", "Material": "Stainless Steel 304", "Type": "Industrial" }
  }
];

// Category display names
const categoryNames = {
  all: "All Machines",
  vacuum: "Vacuum Cleaners",
  disc: "Single Disc Machines",
  scrubber: "Floor Scrubbers & Dryers",
  pressure: "Pressure Washers",
  sweeper: "Sweeping Machines",
  foam: "Foam Generators"
};

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('aloysius_cart') || '[]');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  updateCartUI();
  initNavScroll();
  initCartDrawer();
  initBackToTop();
  initHamburger();
});

// ===== RENDER PRODUCTS =====
function renderProducts(category) {
  const grid = document.getElementById('productGrid');
  const filtered = category === 'all' ? products : products.filter(p => p.category === category);
  
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${p.category}">
      <img class="product-img" src="${p.img}" alt="${p.name}" onclick="openModal(${p.id})" style="cursor:pointer" />
      <div class="product-body">
        <div class="product-cat-label">${categoryNames[p.category]}</div>
        <h5>${p.name}</h5>
        <p class="product-model">Model: ${p.model}</p>
        <div class="product-specs">
          ${Object.entries(p.specs).slice(0, 3).map(([k, v]) => `<span class="spec-tag">${k}: ${v}</span>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price">₹${p.price.toLocaleString('en-IN')} <small>/ piece</small></div>
          <button class="btn-add-cart" onclick="addToCart(${p.id})" id="addBtn-${p.id}">
            <i class="bi bi-bag-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Update button states for items already in cart
  cart.forEach(item => {
    const btn = document.getElementById(`addBtn-${item.id}`);
    if (btn) {
      btn.classList.add('added');
      btn.innerHTML = '<i class="bi bi-bag-check"></i> Added';
    }
  });
}

// ===== FILTER PRODUCTS =====
function filterProducts(category, catCardEl) {
  // Update category cards
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
  if (catCardEl) {
    catCardEl.classList.add('active');
  } else {
    const matching = document.querySelector(`.cat-card[data-category="${category}"]`);
    if (matching) matching.classList.add('active');
  }

  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === category);
  });

  // Update title
  document.getElementById('productsTitle').textContent = categoryNames[category] || 'All Machines';

  renderProducts(category);

  // Scroll to products section
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ===== CART LOGIC =====
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, qty: 1 });
  }
  
  saveCart();
  updateCartUI();
  
  // Update button appearance
  const btn = document.getElementById(`addBtn-${productId}`);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="bi bi-bag-check"></i> Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="bi bi-bag-plus"></i> Add';
    }, 1500);
  }

  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  
  saveCart();
  updateCartUI();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem('aloysius_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  
  badge.textContent = totalItems;
  badge.classList.toggle('hidden', totalItems === 0);
  
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    emptyEl.style.display = 'block';
    footerEl.style.display = 'none';
    // Clear any rendered items but keep the empty div
    const items = container.querySelectorAll('.cart-item');
    items.forEach(i => i.remove());
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';

  // Build cart items HTML
  let html = '';
  let total = 0;
  
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    
    const lineTotal = product.price * item.qty;
    total += lineTotal;
    
    html += `
      <div class="cart-item">
        <img class="cart-item-img" src="${product.img}" alt="${product.name}" />
        <div class="cart-item-info">
          <h6>${product.name}</h6>
          <span class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</span>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateCartQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `;
  });

  // Remove old items, keep empty div
  const oldItems = container.querySelectorAll('.cart-item');
  oldItems.forEach(i => i.remove());
  
  container.insertAdjacentHTML('beforeend', html);
  totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// ===== CART DRAWER =====
function initCartDrawer() {
  const toggle = document.getElementById('cartToggle');
  const close = document.getElementById('cartClose');
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');

  toggle.addEventListener('click', () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  close.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
}

// ===== PRODUCT MODAL =====
let currentModalProductId = null;

function openModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;

  document.getElementById('modalImg').src = product.img;
  document.getElementById('modalImg').alt = product.name;
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalModel').textContent = `Model: ${product.model} · ${categoryNames[product.category]}`;
  document.getElementById('modalPrice').textContent = `₹${product.price.toLocaleString('en-IN')} / piece`;

  // Specs table
  const specsHtml = Object.entries(product.specs).map(([k, v]) => `
    <tr><td>${k}</td><td>${v}</td></tr>
  `).join('');
  document.getElementById('modalSpecs').innerHTML = specsHtml;

  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
  currentModalProductId = null;
}

function addToCartFromModal() {
  if (currentModalProductId) {
    addToCart(currentModalProductId);
    closeModal();
  }
}

// Close modal on overlay click
document.getElementById('productModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('productModal')) {
    closeModal();
  }
});

// ===== NAVBAR SCROLL =====
function initNavScroll() {
  const nav = document.getElementById('siteNav');
  
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== HAMBURGER =====
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('bi-list');
    icon.classList.toggle('bi-x-lg');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const icon = hamburger.querySelector('i');
      icon.classList.add('bi-list');
      icon.classList.remove('bi-x-lg');
    });
  });
}

// ===== QUOTE FORM =====
function toggleQuoteForm() {
  const form = document.getElementById('quoteForm');
  const btn = document.getElementById('quoteToggleBtn');
  
  if (form.style.display === 'none') {
    form.style.display = 'block';
    btn.style.display = 'none';
    // Focus on first input
    document.getElementById('quoteName').focus();
  } else {
    form.style.display = 'none';
    btn.style.display = 'block';
  }
}

function submitQuote() {
  const name = document.getElementById('quoteName');
  const phone = document.getElementById('quotePhone');
  const email = document.getElementById('quoteEmail');
  
  // Clear previous errors
  name.classList.remove('error');
  phone.classList.remove('error');
  
  let valid = true;
  
  if (!name.value.trim()) {
    name.classList.add('error');
    valid = false;
  }
  if (!phone.value.trim() || phone.value.trim().length < 10) {
    phone.classList.add('error');
    valid = false;
  }
  
  if (!valid) {
    showToast('Please fill in your name and phone number');
    return;
  }
  
  // Build cart summary for the quote
  const cartSummary = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? `${product.name} (x${item.qty})` : '';
  }).filter(Boolean).join(', ');
  
  // Show success state
  const formEl = document.getElementById('quoteForm');
  formEl.innerHTML = `
    <div class="quote-success">
      <i class="bi bi-check-circle-fill"></i>
      <p><strong>Quote request submitted!</strong></p>
      <p>We'll contact you at <strong>${phone.value.trim()}</strong> shortly.</p>
    </div>
  `;
  
  showToast('Quote request sent successfully!');
  
  // Reset after delay
  setTimeout(() => {
    cart = [];
    saveCart();
    updateCartUI();
    
    // Restore form
    formEl.innerHTML = `
      <p class="quote-form-label">Enter your details and we'll get back to you</p>
      <input type="text" id="quoteName" class="quote-input" placeholder="Your Name" required />
      <input type="tel" id="quotePhone" class="quote-input" placeholder="Phone Number" required />
      <input type="email" id="quoteEmail" class="quote-input" placeholder="Email Address (optional)" />
      <button class="btn-quote btn-submit-quote" onclick="submitQuote()">
        Submit Quote Request <i class="bi bi-check-circle-fill ms-1"></i>
      </button>
    `;
    formEl.style.display = 'none';
    document.getElementById('quoteToggleBtn').style.display = 'block';
    
    // Close drawer
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }, 3000);
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}
