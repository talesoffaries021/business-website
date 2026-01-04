/* ===================================
   TALES OF FAIRIES - Main JavaScript
   Shopping Cart & Customer Interactions
   (Updated to work with centralized product data)
   =================================== */

// ========== GLOBAL STATE ==========
let cart = [];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    loadCart();
    
    // Update cart count
    updateCartCount();
    
    // Listen for product updates from admin panel
    window.addEventListener('productsUpdated', function() {
        // Reload products display when admin makes changes
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'shop.html' || currentPage === 'index.html' || currentPage === '') {
            displayProducts();
        }
    });
    
    // Check which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'shop.html' || currentPage === 'index.html' || currentPage === '') {
        displayProducts();
        setupCategoryFilters();
    }
    
    if (currentPage === 'cart.html') {
        displayCart();
    }
    
    if (currentPage === 'checkout.html') {
        displayOrderSummary();
        setupCheckoutForm();
    }
    
    if (currentPage === 'custom-order.html') {
        setupCustomOrderForm();
    }
});

// ========== PRODUCT DISPLAY ==========
function displayProducts(category = 'all') {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    // Get products from centralized data
    let products = category === 'all' 
        ? getAllProducts() 
        : getProductsByCategory(category);
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // Check if products exist
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.5rem; color: var(--text-light);">
                    No products available in this category 🔍
                </p>
            </div>
        `;
        return;
    }
    
    // Display products
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const badgeClass = product.type === 'premade' ? 'badge-premade' : 'badge-custom';
    const badgeText = product.type === 'premade' ? 'Premade ✨' : 'Custom 🎨';
    
    // Check stock status
    const isOutOfStock = product.type === 'premade' && product.stock <= 0;
    const isLowStock = product.type === 'premade' && product.stock <= 5 && product.stock > 0;
    
    card.innerHTML = `
        <div class="product-badge ${badgeClass}">${badgeText}</div>
        ${isOutOfStock ? '<div class="product-badge" style="top: 55px; background: #FF6B6B;">Out of Stock</div>' : ''}
        ${isLowStock ? '<div class="product-badge" style="top: 55px; background: #FFA500;">Only ' + product.stock + ' left!</div>' : ''}
        <img src="${product.image}" alt="${product.name}" class="product-image" 
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22250%22%3E%3Crect fill=%22%23E6D5F5%22 width=%22280%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%235A4A6B%22%3EProduct Image%3C/text%3E%3C/svg%3E'">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">PKR ${product.price}</div>
            ${product.type === 'premade' ? `<p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem;">Stock: ${product.stock}</p>` : ''}
            <button class="btn btn-add-cart" onclick="addToCart(${product.id})" ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                ${isOutOfStock ? 'Out of Stock' : 'Add to Cart 🛒'}
            </button>
        </div>
    `;
    
    return card;
}

// ========== CATEGORY FILTERS ==========
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.tab-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category and display products
            const category = this.dataset.category;
            displayProducts(category);
        });
    });
}

// ========== CART FUNCTIONS ==========
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Check stock for premade items
    if (product.type === 'premade' && product.stock <= 0) {
        showNotification('Sorry, this item is out of stock!', 'error');
        return;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Check if adding one more would exceed stock
        if (product.type === 'premade' && existingItem.quantity >= product.stock) {
            showNotification('Cannot add more - stock limit reached!', 'error');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show success message
    showNotification('Item added to cart! ✨', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
    
    showNotification('Item removed from cart');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    // Check minimum
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    // Check stock for premade items
    const product = getProductById(productId);
    if (product && product.type === 'premade' && newQuantity > product.stock) {
        showNotification('Cannot exceed available stock!', 'error');
        return;
    }
    
    item.quantity = newQuantity;
    
    saveCart();
    displayCart();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ========== CART PAGE ==========
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartTotalFinal = document.getElementById('cartTotalFinal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <p style="font-size: 1.5rem; color: var(--text-light);">
                    Your cart is empty 🛒
                </p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 2rem;">
                    Start Shopping ✨
                </a>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = 'PKR 0';
        if (cartTotalFinal) cartTotalFinal.textContent = 'PKR 0';
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        // Get current product data to check stock
        const currentProduct = getProductById(item.id);
        const stockWarning = currentProduct && currentProduct.type === 'premade' && item.quantity > currentProduct.stock;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23E6D5F5%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">PKR ${item.price}</p>
                ${stockWarning ? '<p style="color: #FF6B6B; font-size: 0.9rem;">⚠️ Exceeds available stock!</p>' : ''}
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span style="padding: 0 1rem; font-weight: 600;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div>
                <p style="font-size: 1.2rem; font-weight: bold; color: var(--gold);">
                    PKR ${item.price * item.quantity}
                </p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    const total = getCartTotal();
    if (cartTotal) {
        cartTotal.textContent = `PKR ${total}`;
    }
    if (cartTotalFinal) {
        cartTotalFinal.textContent = `PKR ${total}`;
    }
}

// ========== CHECKOUT ==========
function displayOrderSummary() {
    const orderSummary = document.getElementById('orderSummaryItems');
    const orderTotal = document.getElementById('orderTotal');
    const orderTotalFinal = document.getElementById('orderTotalFinal');
    
    if (!orderSummary) return;
    
    orderSummary.innerHTML = '';
    
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.style.cssText = 'display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--soft-mint);';
        
        summaryItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p style="color: var(--text-light); font-size: 0.9rem;">Quantity: ${item.quantity}</p>
            </div>
            <div style="font-weight: bold; color: var(--gold);">
                PKR ${item.price * item.quantity}
            </div>
        `;
        
        orderSummary.appendChild(summaryItem);
    });
    
    const total = getCartTotal();
    if (orderTotal) {
        orderTotal.textContent = `PKR ${total}`;
    }
    if (orderTotalFinal) {
        orderTotalFinal.textContent = `PKR ${total}`;
    }
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(checkoutForm);
        
        // Create order object
        const orderData = {
            orderId: 'ORD-' + Date.now(),
            customer: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                country: formData.get('country')
            },
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                type: item.type,
                customDetails: item.customDetails || null
            })),
            total: getCartTotal(),
            paymentMethod: formData.get('paymentMethod'),
            date: new Date().toISOString()
        };
        
        // Save order to localStorage
        let orders = [];
        try {
            orders = JSON.parse(localStorage.getItem('talesOfFairiesOrders') || '[]');
        } catch (e) {
            console.error('Error loading orders', e);
        }
        orders.push(orderData);
        localStorage.setItem('talesOfFairiesOrders', JSON.stringify(orders));
        
        console.log('Order placed:', orderData);
        
        // Update stock for premade items (simulate purchase)
        cart.forEach(item => {
            const product = getProductById(item.id);
            if (product && product.type === 'premade') {
                const newStock = Math.max(0, product.stock - item.quantity);
                updateStock(item.id, newStock);
            }
        });
        
        // Clear cart
        cart = [];
        saveCart();
        
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    });
}

// ========== CUSTOM ORDER FORM ==========
function setupCustomOrderForm() {
    const customForm = document.getElementById('customOrderForm');
    if (!customForm) return;
    
    // Color picker functionality
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    customForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(customForm);
        
        // Find a matching custom product or create a generic one
        const customProducts = getProductsByType('custom');
        const baseProduct = customProducts.find(p => 
            p.name.toLowerCase().includes(formData.get('productType').toLowerCase())
        ) || customProducts[0];
        
        if (!baseProduct) {
            showNotification('Custom orders are currently unavailable. Please contact us!', 'error');
            return;
        }
        
        // Create custom product for cart
        const customProduct = {
            id: baseProduct.id,
            name: `Custom ${formData.get('productType')}`,
            price: baseProduct.price,
            category: baseProduct.category,
            type: 'custom',
            image: baseProduct.image,
            description: `Custom order: ${formData.get('customText')}`,
            customDetails: {
                text: formData.get('customText'),
                color: document.querySelector('.color-option.selected')?.dataset.color || 'Mixed',
                notes: formData.get('notes'),
                quantity: parseInt(formData.get('quantity'))
            },
            quantity: parseInt(formData.get('quantity')),
            stock: 999 // Custom items are always available
        };
        
        // Add to cart
        cart.push(customProduct);
        saveCart();
        updateCartCount();
        
        // Show success message and redirect
        showNotification('Custom order added to cart! ✨', 'success');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    });
}

// ========== LOCAL STORAGE ==========
function saveCart() {
    localStorage.setItem('talesOfFairiesCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('talesOfFairiesCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, ${type === 'error' ? '#FF6B6B, #FF8E8E' : 'var(--pastel-pink), var(--lavender)'});
        color: white;
        padding: 1rem 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== WHATSAPP INTEGRATION ==========
function openWhatsApp() {
    // Replace with your WhatsApp number (include country code without +)
    const phoneNumber = '923001234567'; // Example Pakistani number
    const message = 'Hello! I would like to order from Tales of Fairies 🧚‍♀️';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openWhatsApp = openWhatsApp;
window.displayProducts = displayProducts;
