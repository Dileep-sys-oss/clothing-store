const wishlistList = document.getElementById("wishlist-list");

async function loadWishlist() {
  const products = await loadProducts();
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    wishlistList.innerHTML = "<p>No saved items yet.</p>";
    return;
  }

  wishlistList.innerHTML = wishlist
    .map((id) => {
      const product = products.find((item) => item.id === id);
      if (!product) {
        return "";
      }
      return `
        <div class="card" style="margin-bottom: 16px;">
          <h3>${product.name}</h3>
          <p>${product.brand}</p>
          <p>${formatPrice(product.price)}</p>
          <div class="actions">
            <a class="button secondary" href="/product.html?id=${product.id}">View</a>
            <button class="button primary" data-remove="${product.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.remove);
      const updated = wishlist.filter((item) => item !== id);
      setWishlist(updated);
      refreshCounts();
      loadWishlist();
    });
  });
}

loadWishlist();
