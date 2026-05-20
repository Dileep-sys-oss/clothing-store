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

  const gallery = product.images?.length ? product.images : [product.image].filter(Boolean);
  const mainImage = gallery[0] || "";

  productDetail.innerHTML = `
    <div class="card">
      <div id="product-main" class="media" style="height: 360px; background: ${mainImage ? `url('${mainImage}') center/cover` : resolveMedia(product)}"></div>
      <div class="gallery" id="product-gallery">
        ${gallery
          .map(
            (image, index) =>
              `<button class="gallery-thumb${index === 0 ? " active" : ""}" data-image="${image}" style="background-image: url('${image}')"></button>`
          )
          .join("")}
      </div>
    </div>
    <div class="card">
      <h2>${product.name}</h2>
      <p>${product.brand} • ${product.category}</p>
      <p>${product.description}</p>
      <p><strong>${formatPrice(product.price)}</strong></p>
      <div class="actions">
        <button class="button primary" id="add-cart">Add to cart</button>
        <button class="button secondary" id="add-wishlist">Wishlist</button>
        <a class="button secondary" id="order-whatsapp">Order on <span class="wa-inline">WhatsApp</span></a>
      </div>
    </div>
  `;

  const galleryEl = document.getElementById("product-gallery");
  const mainEl = document.getElementById("product-main");
  if (galleryEl) {
    galleryEl.querySelectorAll("[data-image]").forEach((button) => {
      button.addEventListener("click", () => {
        const image = button.dataset.image;
        mainEl.style.background = `url('${image}') center/cover`;
        galleryEl.querySelectorAll(".gallery-thumb").forEach((el) => {
          el.classList.remove("active");
        });
        button.classList.add("active");
      });
    });
  }

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
