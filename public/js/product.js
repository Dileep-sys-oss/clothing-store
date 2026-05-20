const productDetail = document.getElementById("product-detail");
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

async function loadProduct() {
  const products = await loadProducts();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    productDetail.innerHTML = "<p>Product not found.</p>";
    return;
  }

  productDetail.innerHTML = `
    <div class="card">
      <div class="media" style="height: 320px; background: ${resolveMedia(product)}"></div>
    </div>
    <div class="card">
      <h2>${product.name}</h2>
      <p>${product.brand} • ${product.category}</p>
      <p>${product.description}</p>
      <p><strong>${formatPrice(product.price)}</strong></p>
      <div class="actions">
        <button class="button primary" id="add-cart">Add to cart</button>
        <button class="button secondary" id="add-wishlist">Wishlist</button>
        <a class="button secondary" id="order-whatsapp">Order on WhatsApp</a>
      </div>
    </div>
  `;

  document.getElementById("add-cart").addEventListener("click", () => {
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

  document.getElementById("add-wishlist").addEventListener("click", () => {
    const wishlist = getWishlist();
    if (!wishlist.includes(product.id)) {
      wishlist.push(product.id);
      setWishlist(wishlist);
      refreshCounts();
    }
  });

  const link = buildWhatsAppLink([{ id: product.id, quantity: 1 }], products);
  const orderLink = document.getElementById("order-whatsapp");
  orderLink.href = link;
  orderLink.target = "_blank";
}

loadProduct();
