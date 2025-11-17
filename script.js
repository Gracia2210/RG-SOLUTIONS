// *** 1. CONFIGURACIÓN CRÍTICA: URL DEL APPS SCRIPT ***
    const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7XqyL4j6VorQr5GeH7RibnqA34V3t7MyMZ5m7P9e95s9JjbuGhNUmUo4CJG2FSjgf/exec"; 

    // === Lógica de Single Page Application (SPA) ===
    const views = document.querySelectorAll('.view');
    let currentView = 'home';
    const notificationMessage = document.getElementById('notification-message');

    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationMessage.classList.remove('hidden');
        notificationMessage.classList.add('notification-show');

        setTimeout(() => {
            notificationMessage.classList.remove('notification-show');
            setTimeout(() => {
                notificationMessage.classList.add('hidden');
            }, 300); 
        }, 3000); 
    }

    // *** FUNCIÓN showView MODIFICADA ***
    function showView(viewName) {
        // Oculta todas las vistas
        views.forEach(view => view.classList.remove('active'));
        
        // Muestra la vista solicitada
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add('active');
            currentView = viewName;
            window.scrollTo(0, 0); // Regresa al inicio de la página
            
            // *** AÑADIDO: Actualizar el hash de la URL ***
            // Esto cambia la URL a .../#viewName
            if (window.location.hash.substring(1) !== viewName) {
                window.location.hash = viewName; 
            }

            // Gestionar el slider
            const isHome = viewName === 'home';
            if (isHome) {
                if (!slideInterval) {
                    startSlider();
                }
            } else {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }
    }
    
    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.add('hidden');
    }

    // Función para pre-llenar la cotización desde el Catálogo o Servicios
    function fillQuotation(serviceName) {
        showView('quotation');
        const checkboxes = document.querySelectorAll('#quotation-form input[name^="Servicio_"]'); 
        
        checkboxes.forEach(cb => cb.checked = false);
        
        let generalService = '';
        if (serviceName.includes('Paquete Web')) { generalService = 'Desarrollo Web'; } 
        else if (serviceName.includes('Alquiler')) { generalService = 'Alquiler de Equipos'; } 
        else if (serviceName.includes('Venta') || serviceName.includes('Mini PC') || serviceName.includes('Laptop')) { generalService = 'Venta de Hardware'; } 
        else if (serviceName.includes('Soporte')) { generalService = 'Soporte Técnico'; }
        else if (serviceName.includes('Automatización')) { generalService = 'Automatización de Procesos'; }
        else { generalService = serviceName; }

        checkboxes.forEach(cb => {
            if (cb.value.includes(generalService)) {
                cb.checked = true;
            }
        });
        
        document.getElementById('quotation-message').value = `Solicitud de cotización para: ${serviceName}. Por favor, detallar los siguientes pasos.`;
    }
    
    // Función para agregar al carrito (simula el pre-llenado de cotización)
    function addToQuotation(productName) {
        fillQuotation(productName); // Usamos el nombre del producto para pre-seleccionar Venta/Alquiler
        document.getElementById('quotation-message').value += `\nProducto de interés adicional: ${productName}. Se requieren 1 unidad.`;
        showNotification(`¡${productName} agregado a tu lista de cotización!`);
    }


    // === Lógica del Slider ===
    const slides = document.querySelectorAll('.slider-item');
    const dots = document.querySelectorAll('.slider-dot');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides.length > 0) {
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            slides.forEach((slide) => slide.classList.remove('active'));
            dots.forEach((dot) => {
                dot.classList.remove('opacity-100', 'bg-rg-red', 'scale-125');
                dot.classList.add('opacity-50', 'bg-white');
            });

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.remove('opacity-50', 'bg-white');
            dots[currentSlide].classList.add('opacity-100', 'bg-rg-red', 'scale-125');
        }
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startSlider() {
        if (slides.length > 0) {
            showSlide(currentSlide);
            slideInterval = setInterval(nextSlide, 5000);
        }
    }

    // *** LÓGICA DE ROUTEO CON HASH (FUNCIÓN CRÍTICA) ***
    function route() {
        let hash = window.location.hash.substring(1); 
        if (!hash) {
            hash = 'home'; 
        }
        showView(hash);
    }
    // *** FIN DE LÓGICA DE ROUTEO ***


    document.addEventListener('DOMContentLoaded', () => {
        // 1. Iniciar la ruta para cargar la vista correcta (si hay hash en la URL)
        route();
        
        // 2. Iniciar el slider solo si la vista actual es 'home'
        if (currentView === 'home' && slides.length > 0) {
            startSlider();
        }

        // Manejadores de eventos para el slider (código existente)
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                clearInterval(slideInterval);
                nextSlide();
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                clearInterval(slideInterval);
                prevSlide();
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        dots.forEach(dot => {
            dot.addEventListener('click', (event) => {
                const slideIndex = parseInt(event.target.dataset.slide);
                clearInterval(slideInterval);
                showSlide(slideIndex);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });

        // Lógica del Menú Móvil
        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    });

    // *** 3. ESCUCHA EL CAMBIO DE HASH DESDE EL NAVEGADOR ***
    window.addEventListener('hashchange', route);


    // === Lógica de ENVÍO ASÍNCRONO a APPS SCRIPT (MÉTODO FETCH) ===
    // (Tu lógica de formularios no fue modificada ya que es funcional)
    
    // 1. Formulario de Contacto General
    document.getElementById('contact-form-final').addEventListener('submit', function(event) {
        event.preventDefault(); 
        document.getElementById('contact-form-final').style.display = 'none';
        document.getElementById('contact-success-message').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('contact-success-message').classList.add('hidden');
            document.getElementById('contact-form-final').style.display = 'block';
            document.getElementById('contact-form-final').reset();
        }, 5000);
    });

    // 2. Formulario de Cotización
    document.getElementById('quotation-form').addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const statusMessage = document.getElementById('quotation-success-message');

        // 1. Deshabilitar botón y mostrar estado de carga
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');
        statusMessage.classList.add('bg-yellow-100', 'text-yellow-700');
        statusMessage.textContent = 'Procesando envío a RG Solutions...';

        // 2. Recolectar datos con tratamiento especial para checkboxes
        const formData = new FormData(form);
        const params = {};
        let serviciosSeleccionados = [];
        
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('Servicio_')) {
                serviciosSeleccionados.push(value);
            } else {
                params[key] = value;
            }
        }

        params['Servicios'] = serviciosSeleccionados.join(' | ');

        // 3. Enviar datos a Apps Script mediante Fetch
        try {
            const response = await fetch(APP_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(params).toString()
            });

            // 4. Mostrar mensaje de éxito
            statusMessage.classList.remove('bg-yellow-100', 'text-yellow-700');
            statusMessage.classList.add('bg-green-100', 'text-green-700');
            statusMessage.textContent = '¡Gracias! Tu solicitud ha sido enviada.';
            
            form.reset(); 
            
        } catch (error) {
            // 4. Mostrar mensaje de error
            statusMessage.classList.remove('bg-yellow-100', 'text-yellow-700');
            statusMessage.classList.add('bg-red-100', 'text-red-700');
            statusMessage.textContent = 'Error al enviar la solicitud. Por favor, revisa tu conexión.';
            console.error('Error de Fetch:', error);
        } finally {
            // 5. Restablecer el botón
            submitButton.textContent = 'Enviar Solicitud de Cotización';
            submitButton.disabled = false;
            
            setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 8000);
        }
    });

    // 3. WhatsApp en la Cotización
    document.getElementById('cotizar-whatsapp-btn').addEventListener('click', function(event) {
        const empresa = document.getElementById('empresa').value || 'No especificado';
        const email = document.getElementById('quotation-email').value || 'No especificado';
        const telefono = document.getElementById('telefono').value || 'No especificado';
        const mensaje = document.getElementById('quotation-message').value || 'Sin detalles adicionales.';

        let servicios = [];
        document.querySelectorAll('#quotation-form input[name^="Servicio_"]:checked').forEach(cb => {
            servicios.push(cb.value);
        });
        const servicioList = servicios.join(', ') || 'Ninguno seleccionado';

        const waText = `¡Hola RG Solutions! Mi empresa *${empresa}* está solicitando una cotización.
*Correo:* ${email}
*Teléfono:* ${telefono}
*Servicios de interés:* ${servicioList}
*Detalles del requerimiento:*
${mensaje}`;
        
        event.currentTarget.href = `https://wa.me/51983519503?text=${encodeURIComponent(waText)}`;
        
        showNotification('Redirigiendo a WhatsApp con los datos del formulario...');
    });