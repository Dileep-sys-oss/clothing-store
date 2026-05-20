const homeGrid = document.getElementById("home-products");

async function loadHome() {
  if (!homeGrid) {
    return;
  }

  const products = await loadProducts();
  homeGrid.innerHTML = "";
  products.slice(0, 6).forEach((product) => {
    homeGrid.appendChild(renderProductCard(product, { showWishlist: true }));
  });
}

loadHome();
