// Número de WhatsApp de la tienda (en formato internacional sin el signo +)
const TELEFONO_WHATSAPP = "573227242643"; 

document.addEventListener("DOMContentLoaded", () => {
    // Escuchar únicamente el clic en el botón flotante
    const botonFlotante = document.getElementById("cart-floating-button");
    if (botonFlotante) {
        botonFlotante.style.cursor = "pointer";
        botonFlotante.addEventListener("click", abrirChatWhatsApp);
    }
});

// Función simple para abrir la conversación directa con un saludo elegante
function abrirChatWhatsApp() {
    const mensaje = "✨ *¡Hola Aira Moda!* Me gustaría recibir asesoría sobre sus prendas y conocer el catálogo disponible. 🖤";
    
    // Codificamos el texto para que la URL del navegador sea válida
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Construimos el enlace final de WhatsApp
    const urlWhatsApp = `https://wa.me/${TELEFONO_WHATSAPP}?text=${mensajeCodificado}`;

    // Abrimos la ventana de WhatsApp en una pestaña nueva
    window.open(urlWhatsApp, "_blank");
}
