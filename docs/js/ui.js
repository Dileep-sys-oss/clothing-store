let cachedProducts = [];

function formatPrice(value) {
  return `INR ${Number(value || 0).toLocaleString("en-IN")}`;
}

function mediaStyle(seed) {
  const hue = (seed * 47) % 360;
  return `linear-gradient(135deg, hsl(${hue} 70% 60%) 0%, hsl(${hue + 40} 70% 50%) 45%, hsl(${hue + 80} 70% 45%) 100%)`;
}

function resolveMedia(product) {
  return product.image
    ? `url('${product.image}') center/cover`
    : mediaStyle(product.id);
}

async function loadProducts() {
  if (cachedProducts.length) {
    return cachedProducts;
  }

  const response = await fetch("data/products.json");
  const baseProducts = await response.json();
  const adminOverride = getAdminProducts();
  cachedProducts = adminOverride || baseProducts;
  return cachedProducts;
}

function buildWhatsAppSingle(product) {
  const message = `Hello, I want to order: ${product.name} (INR ${product.price})`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${EMBO_CONFIG.whatsappNumber}?text=${encoded}`;
}

function renderProductCard(product, options = {}) {
  const card = document.createElement("div");
  card.className = "card product-card reveal";
  card.innerHTML = `
    <div class="media" style="background: ${resolveMedia(product)}"></div>
    <div class="card-body">
      <div class="brand">${product.brand}</div>
      <h3>${product.name}</h3>
      <div class="meta-row">
        <span class="chip">${product.color}</span>
        <span class="chip">${product.size}</span>
        <span class="chip">${product.category}</span>
      </div>
      <div class="price-row">
        <span class="price">${formatPrice(product.price)}</span>
      </div>
      <div class="actions">
        <a class="button ghost" href="product.html?id=${product.id}">View</a>
        <button class="button primary" data-add-cart="${product.id}">Add to cart</button>
        ${options.showWishlist ? `<button class="button secondary" data-add-wishlist="${product.id}">Wishlist</button>` : ""}
        <a class="button secondary" data-order="${product.id}" href="#">WhatsApp</a>
      </div>
    </div>
  `;

  card.querySelector("[data-add-cart]").addEventListener("click", () => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }
    setCart(cart);
    refreshCounts();
  });

  if (options.showWishlist) {
    card.querySelector("[data-add-wishlist]").addEventListener("click", () => {
      const wishlist = getWishlist();
      if (!wishlist.includes(product.id)) {
        wishlist.push(product.id);
        setWishlist(wishlist);
        refreshCounts();
      }
    });
  }

  card.querySelector("[data-order]").addEventListener("click", (event) => {
    event.preventDefault();
    window.open(buildWhatsAppSingle(product), "_blank");
  });

  return card;
}

function refreshCounts() {
  const cartCount = document.getElementById("cart-count");
  const wishlistCount = document.getElementById("wishlist-count");

  if (!cartCount || !wishlistCount) {
    return;
  }

  const cart = getCart();
  const wishlist = getWishlist();
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  wishlistCount.textContent = wishlist.length;
}

function buildWhatsAppLink(items, products) {
  const lines = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return product
      ? `${product.name} x ${item.quantity} (INR ${product.price})`
      : `Item ${item.id} x ${item.quantity}`;
  });
  const message = `Hello, I want to order:\n${lines.join("\n")}`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${EMBO_CONFIG.whatsappNumber}?text=${encoded}`;
}

refreshCounts();
