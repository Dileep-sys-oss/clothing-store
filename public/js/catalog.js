const catalogGrid = document.getElementById("catalog-grid");

async function loadCatalog() {
  const products = await loadProducts();
  const q = document.getElementById("search-input").value.trim().toLowerCase();
  const category = document.getElementById("filter-category").value;
  const color = document.getElementById("filter-color").value;
  const size = document.getElementById("filter-size").value;
  const minPrice = Number(document.getElementById("filter-min").value || 0);
  const maxPrice = Number(document.getElementById("filter-max").value || 999999);
  const sort = document.getElementById("filter-sort").value;

  let filtered = products.filter((product) => {
    const textMatch = q
      ? `${product.name} ${product.brand} ${product.tags}`.toLowerCase().includes(q)
      : true;
    const categoryMatch = category ? product.category === category : true;
    const colorMatch = color ? product.color === color : true;
    const sizeMatch = size ? product.size === size : true;
    const priceMatch = product.price >= minPrice && product.price <= maxPrice;
    return textMatch && categoryMatch && colorMatch && sizeMatch && priceMatch;
  });

  const sortMap = {
    new: (a, b) => b.id - a.id,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating
  };

  filtered = filtered.sort(sortMap[sort] || sortMap.new);

  catalogGrid.innerHTML = "";
  filtered.forEach((product) => {
    catalogGrid.appendChild(renderProductCard(product, { showWishlist: true }));
  });
}

document.getElementById("apply-filters").addEventListener("click", loadCatalog);
loadCatalog();
