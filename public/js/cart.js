const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const cartWhatsApp = document.getElementById("cart-whatsapp");

async function loadCart() {
  const products = await loadProducts();
  const cart = getCart();

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: INR 0";
    cartWhatsApp.disabled = true;
    return;
  }

  let total = 0;
  cartList.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return "";
      }
      total += product.price * item.quantity;
      return `
        <div class="card" style="margin-bottom: 16px;">
          <h3>${product.name}</h3>
          <p>${product.brand}</p>
          <p>${formatPrice(product.price)} • Qty ${item.quantity}</p>
          <div class="actions">
            <button class="button secondary" data-decrease="${product.id}">-</button>
            <button class="button secondary" data-increase="${product.id}">+</button>
            <button class="button secondary" data-remove="${product.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = `Total: ${formatPrice(total)}`;

  document.querySelectorAll("[data-decrease]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.decrease);
      const updated = cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      );
      setCart(updated);
      refreshCounts();
      loadCart();
    });
  });

  document.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.increase);
      const updated = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updated);
      refreshCounts();
      loadCart();
    });
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.remove);
      const updated = cart.filter((item) => item.id !== id);
      setCart(updated);
      refreshCounts();
      loadCart();
    });
  });

  cartWhatsApp.disabled = false;
  cartWhatsApp.addEventListener("click", () => {
    const link = buildWhatsAppLink(cart, products);
    window.open(link, "_blank");
  });
}

loadCart();
