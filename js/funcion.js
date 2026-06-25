// Número de WhatsApp de la tienda (en formato internacional sin el signo +)
const TELEFONO_WHATSAPP = "573227242643";
const WHATSAPP_BASE_URL = `https://wa.me/${TELEFONO_WHATSAPP}?text=`;
const cart = {};

document.addEventListener("DOMContentLoaded", () => {
    const addButtons = document.querySelectorAll(".btn-add-cart");
    addButtons.forEach(button => button.addEventListener("click", handleAddToCart));

    const clearButton = document.getElementById("cart-clear-button");
    if (clearButton) {
        clearButton.addEventListener("click", clearCart);
    }

    updateCartDisplay();
});

function handleAddToCart(event) {
    const button = event.currentTarget;
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price, 10);

    if (!id || !name || Number.isNaN(price)) {
        return;
    }

    if (!cart[id]) {
        cart[id] = { id, name, price, quantity: 0 };
    }

    cart[id].quantity += 1;
    updateCartDisplay();
    button.textContent = "Agregado ✓";

    setTimeout(() => {
        button.textContent = "Agregar";
    }, 800);
}

function updateCartDisplay() {
    const cartCounter = document.getElementById("cart-counter");
    const cartTotalItems = document.getElementById("cart-total-items");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const cartItemsList = document.getElementById("cart-items-list");
    const checkoutButton = document.getElementById("cart-checkout-button");
    const clearButton = document.getElementById("cart-clear-button");

    const items = Object.values(cart).filter(item => item.quantity > 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCounter.textContent = totalItems;
    cartTotalItems.textContent = totalItems;
    cartTotalPrice.textContent = formatCurrency(totalPrice);

    cartItemsList.innerHTML = "";

    if (items.length === 0) {
        cartItemsList.innerHTML = `<div class="text-muted">Tu carrito está vacío. Agrega una prenda para continuar.</div>`;
        checkoutButton.classList.add("disabled");
        checkoutButton.href = "#";
        checkoutButton.textContent = "Agrega productos para pagar";
        clearButton.disabled = true;
        return;
    }

    items.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = "cart-item-row d-flex justify-content-between align-items-start mb-3";
        itemRow.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p class="mb-0 text-muted">${item.quantity} × ${formatCurrency(item.price)}</p>
            </div>
            <div class="text-end">
                <button type="button" class="btn btn-sm btn-outline-danger btn-remove-item mb-2" data-id="${item.id}" aria-label="Eliminar uno">
                    <i class="fas fa-trash"></i>
                </button>
                <div>${formatCurrency(item.price * item.quantity)}</div>
            </div>
        `;
        cartItemsList.appendChild(itemRow);
        const removeButton = itemRow.querySelector(".btn-remove-item");
        removeButton.addEventListener("click", () => removeItemFromCart(item.id));
    });

    checkoutButton.href = WHATSAPP_BASE_URL + encodeURIComponent(buildWhatsAppMessage(items, totalPrice));
    checkoutButton.classList.remove("disabled");
    checkoutButton.textContent = "Pagar por WhatsApp";
    clearButton.disabled = false;
}

function removeItemFromCart(id) {
    if (!cart[id]) {
        return;
    }

    cart[id].quantity -= 1;
    if (cart[id].quantity <= 0) {
        delete cart[id];
    }

    updateCartDisplay();
}

function clearCart() {
    Object.keys(cart).forEach(id => delete cart[id]);
    updateCartDisplay();
}

function buildWhatsAppMessage(items, totalPrice) {
    const lines = [
        "Hola Aira Moda, quiero hacer un pedido desde la página web.",
        `Total de la compra: ${formatCurrency(totalPrice)}`,
        "Productos:"
    ];

    items.forEach(item => {
        lines.push(`- ${item.name} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}`);
    });

    lines.push("Por favor confirmen disponibilidad y envío. Gracias.");
    return lines.join("\n");
}

function formatCurrency(value) {
    return `$${value.toLocaleString("es-CO")}`;
}
