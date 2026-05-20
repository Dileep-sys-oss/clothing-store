const adminUnlock = document.getElementById("admin-unlock");
const adminKeyInput = document.getElementById("admin-key");
const adminForm = document.getElementById("admin-form");
const adminSave = document.getElementById("admin-save");
const adminList = document.getElementById("admin-list");
const adminExport = document.getElementById("admin-export");
const adminImport = document.getElementById("admin-import");
const adminLock = document.getElementById("admin-lock");
const adminPanel = document.getElementById("admin-panel");
const adminInventory = document.getElementById("admin-inventory");
const adminStatus = document.getElementById("admin-status");

let adminUnlocked = false;
let productsCache = [];

function renderAdminList() {
  adminList.innerHTML = productsCache
    .map(
      (product) => `
      <div class="card" style="margin-bottom: 16px;">
        <h3>${product.name}</h3>
        <p>${product.brand} • ${formatPrice(product.price)}</p>
        <div class="actions">
          <button class="button secondary" data-edit="${product.id}">Edit</button>
          <button class="button secondary" data-delete="${product.id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!adminUnlocked) {
        return;
      }
      const product = productsCache.find((item) => item.id === Number(button.dataset.edit));
      if (!product) {
        return;
      }
      Object.entries(product).forEach(([key, value]) => {
        if (adminForm.elements[key]) {
          adminForm.elements[key].value = value;
        }
      });
      adminForm.dataset.editId = product.id;
      adminSave.textContent = "Update product";
    });
  });

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!adminUnlocked) {
        return;
      }
      const id = Number(button.dataset.delete);
      productsCache = productsCache.filter((item) => item.id !== id);
      setAdminProducts(productsCache);
      renderAdminList();
    });
  });
}

function setAdminVisibility(isUnlocked) {
  adminPanel.classList.toggle("is-hidden", !isUnlocked);
  adminInventory.classList.toggle("is-hidden", !isUnlocked);
  adminLock.classList.toggle("is-hidden", isUnlocked);
}

async function loadAdmin() {
  const baseProducts = await loadProducts();
  productsCache = [...baseProducts];
  renderAdminList();
}

adminUnlock.addEventListener("click", () => {
  if (adminKeyInput.value === EMBO_CONFIG.adminKey) {
    adminUnlocked = true;
    adminKeyInput.value = "";
    adminStatus.textContent = "Admin unlocked. You can edit products now.";
    setAdminVisibility(true);
    loadAdmin();
  } else {
    adminStatus.textContent = "Invalid admin key. Try again.";
  }
});

adminSave.addEventListener("click", (event) => {
  event.preventDefault();
  if (!adminUnlocked) {
    alert("Unlock admin first");
    return;
  }

  const formData = new FormData(adminForm);
  const payload = Object.fromEntries(formData.entries());
  payload.price = Number(payload.price || 0);

  const editId = Number(adminForm.dataset.editId || 0);
  if (editId) {
    productsCache = productsCache.map((item) =>
      item.id === editId ? { ...item, ...payload, id: editId } : item
    );
  } else {
    const nextId = productsCache.length
      ? Math.max(...productsCache.map((item) => item.id)) + 1
      : 1;
    productsCache.push({ ...payload, id: nextId });
  }

  setAdminProducts(productsCache);
  adminForm.reset();
  adminForm.dataset.editId = "";
  adminSave.textContent = "Add product";
  renderAdminList();
});

adminExport.addEventListener("click", () => {
  if (!adminUnlocked) {
    adminStatus.textContent = "Unlock admin first.";
    return;
  }
  const blob = new Blob([JSON.stringify(productsCache, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "products.json";
  link.click();
  URL.revokeObjectURL(url);
});

adminImport.addEventListener("change", async (event) => {
  if (!adminUnlocked) {
    adminStatus.textContent = "Unlock admin first.";
    return;
  }
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const text = await file.text();
  productsCache = JSON.parse(text);
  setAdminProducts(productsCache);
  renderAdminList();
});

setAdminVisibility(false);
