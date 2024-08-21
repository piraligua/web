document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const reserveCartItemsList = document.querySelector('.reserve-cart-items-list');
    const totalContainer = document.querySelector('.total');
    const cartToggle = document.getElementById('cart-toggle');
    const cartElement = document.getElementById('cart');
    const cartCount = document.getElementById('cart-count');
    const closeCartButton = document.querySelector('.close-cart');
    const reservePopup = document.getElementById('reserve-popup');
    const closeReservePopupButton = document.querySelector('.close-reserve-popup');
    const reserveForm = document.getElementById('reserve-form');
    const sendToWhatsAppButton = document.getElementById('send-to-whatsapp');

    // Agregar eventos a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const img = button.getAttribute('data-img');
            addItemToCart(name, price, img);
        });
    });

    // Abrir y cerrar carrito
    cartToggle.addEventListener('click', () => {
        if (cartElement.classList.contains('active')) {
            cartElement.classList.remove('active');
        } else {
            cartElement.classList.add('active');
            reservePopup.style.display = 'none'; // Cerrar la ventana de reserva si está abierta
        }
    });

    closeCartButton.addEventListener('click', () => {
        cartElement.classList.remove('active');
    });

    // Abrir y cerrar ventana emergente de reserva
    document.querySelector('.checkout').addEventListener('click', () => {
        updateReserveCartItems();
        reservePopup.style.display = 'block';
        cartElement.classList.remove('active'); // Cerrar el carrito si está abierto
    });

    closeReservePopupButton.addEventListener('click', () => {
        reservePopup.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target == reservePopup) {
            reservePopup.style.display = 'none';
        }
    };

    // Agregar item al carrito
    function addItemToCart(name, price, img) {
        const item = cart.find(i => i.name === name);
        if (item) {
            item.quantity++;
        } else {
            // Asume que el precio está en centavos
            const priceInDollars = price / 1;
            cart.push({ name, price: priceInDollars, quantity: 1, img });
        }
        updateCartCount();
        renderCart();
    }

    // Eliminar item del carrito
    function removeItemFromCart(name) {
        const itemIndex = cart.findIndex(i => i.name === name);
        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
        }
        updateCartCount();
        renderCart();
    }

    // Actualizar conteo de carrito
    function updateCartCount() {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = count;
    }

    // Renderizar carrito
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const li = document.createElement('li');
            li.innerHTML = `<img src="${item.img}" alt="${item.name}" width="50"> ${item.name} x${item.quantity} - ${itemTotal.toFixed(3)} <button class="remove-item" data-name="${item.name}">Eliminar</button>`;
            cartItemsContainer.appendChild(li);
            total += itemTotal;
        });
        totalContainer.textContent = `${total.toFixed(3)}`;
    
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                removeItemFromCart(name);
            });
        });
    }

    // Actualizar los elementos del carrito en el formulario de reserva
    function updateReserveCartItems() {
        reserveCartItemsList.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<img src="${item.img}" alt="${item.name}" width="50"> ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(3)}`;
            reserveCartItemsList.appendChild(li);
        });
    }
    

    // Enviar información a WhatsApp
    sendToWhatsAppButton.addEventListener('click', (event) => {
        event.preventDefault();

        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const people = document.getElementById('people').value;
        const comments = document.getElementById('comments').value;

        let message = `Reserva realizada por ${firstName} ${lastName}.\nCorreo: ${email}\nFecha: ${date}\nHora: ${time}\nCantidad de personas: ${people}\nComentario: ${comments}\n\nItems del carrito:\n`;

        cart.forEach(item => {
            message += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(3)}\n`;
        });

        const whatsappNumber = '3229134464'; // Cambia esto por tu número de WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, '_blank');
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el sidenav
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {
        edge: 'left',
        inDuration: 250,
        outDuration: 500
    });

    // Inicializar el botón sidenav-trigger
    var triggers = document.querySelectorAll('.sidenav-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            var instance = M.Sidenav.getInstance(document.querySelector('#slide-out'));
            if (instance.isOpen) {
                instance.close();
            } else {
                instance.open();
            }
        });
    });
});


// Muestra el formulario al hacer clic en el botón
document.getElementById('toggleFormButton').addEventListener('click', function() {
    document.getElementById('formContainer').style.display = 'flex';
});

// Oculta el formulario al hacer clic en el botón de cierre
document.getElementById('closeFormButton').addEventListener('click', function() {
    document.getElementById('formContainer').style.display = 'none';
});

// Maneja el envío del formulario
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    var formData = new FormData(this); // Obtiene los datos del formulario

    fetch('registro.php', {
        method: 'POST', // Método HTTP para enviar datos
        body: formData // Envia los datos del formulario al servidor
    })
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
        // Muestra el mensaje recibido del servidor en un alert
        alert(data.message);

        // Limpia el formulario
        document.getElementById('registrationForm').reset();

        // Oculta el formulario después de enviar
        document.getElementById('formContainer').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error); // Muestra errores en la consola
    });
});



