const STORE_KEYS = {
  cart: "embo_cart",
  wishlist: "embo_wishlist",
  products: "embo_products"
};

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  return readStore(STORE_KEYS.cart, []);
}

function setCart(items) {
  writeStore(STORE_KEYS.cart, items);
}

function getWishlist() {
  return readStore(STORE_KEYS.wishlist, []);
}

function setWishlist(items) {
  writeStore(STORE_KEYS.wishlist, items);
}

function getAdminProducts() {
  return readStore(STORE_KEYS.products, null);
}

function setAdminProducts(items) {
  writeStore(STORE_KEYS.products, items);
}
