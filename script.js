/* ===================================
   TALES OF FAIRIES - Main JavaScript
   Shopping Cart & Interactions
   =================================== */

// ========== GLOBAL STATE ==========
let cart = [];
let products = [];

// ========== SAMPLE PRODUCTS DATA ==========
// This is sample data - you can replace with your actual products
const sampleProducts = [
    {
        id: 1,
        name: "Rainbow Alphabet Keychain - Letter A",
        price: 250,
        category: "resin-keychains",
        type: "premade",
        image: "images/keychain1.jpg",
        description: "Beautiful resin keychain with letter A in rainbow colors"
    },
    {
        id: 2,
        name: "Custom Name Keychain",
        price: 350,
        category: "resin-keychains",
        type: "custom",
        image: "images/keychain2.jpg",
        description: "Personalized resin keychain with your chosen name"
    },
    {
        id: 3,
        name: "Pastel Acrylic Keychain",
        price: 200,
        category: "acrylic-keychains",
        type: "premade",
        image: "images/acrylic1.jpg",
        description: "Cute pastel colored acrylic keychain"
    },
    {
        id: 4,
        name: "Crochet Hand Warmers - Pink",
        price: 450,
        category: "crochet",
        type: "premade",
        image: "images/crochet1.jpg",
        description: "Soft and cozy hand warmers in pink"
    },
    {
        id: 5,
        name: "Fairy Tale Bookmark",
        price: 180,
        category: "bookmarks",
        type: "premade",
        image: "images/bookmark1.jpg",
        description: "Magical resin bookmark with fairy tale theme"
    },
    {
        id: 6,
        name: "Custom Crochet Item",
        price: 500,
        category: "crochet",
        type: "custom",
        image: "images/crochet2.jpg",
        description: "Custom crochet accessory made to your specifications"
    }
];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Load products
    products = sampleProducts;
    
    // Load cart from localStorage
    loadCart();
    
    // Update cart count
    updateCartCount();
    
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
});

// ========== PRODUCT DISPLAY ==========
function displayProducts(category = 'all') {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    // Filter products by category
    let filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // Display filtered products
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const badgeClass = product.type === 'premade' ? 'badge-premade' : 'badge-custom';
    const badgeText = product.type === 'premade' ? 'Premade ✨' : 'Custom 🎨';
    
    card.innerHTML = `
        <div class="product-badge ${badgeClass}">${badgeText}</div>
        <img src="${product.image}" alt="${product.name}" class="product-image" 
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22250%22%3E%3Crect fill=%22%23E6D5F5%22 width=%22280%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%235A4A6B%22%3EProduct Image%3C/text%3E%3C/svg%3E'">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">PKR ${product.price}</div>
            <button class="btn btn-add-cart" onclick="addToCart(${product.id})">
                Add to Cart 🛒
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
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
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
    showNotification('Item added to cart! ✨');
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
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
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
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23E6D5F5%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">PKR ${item.price}</p>
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
    
    if (cartTotal) {
        cartTotal.textContent = `PKR ${getCartTotal()}`;
    }
}

// ========== CHECKOUT ==========
function displayOrderSummary() {
    const orderSummary = document.getElementById('orderSummaryItems');
    const orderTotal = document.getElementById('orderTotal');
    
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
    
    if (orderTotal) {
        orderTotal.textContent = `PKR ${getCartTotal()}`;
    }
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(checkoutForm);
        const orderData = {
            customer: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                country: formData.get('country')
            },
            items: cart,
            total: getCartTotal(),
            date: new Date().toISOString(),
            paymentMethod: formData.get('paymentMethod')
        };
        
        // In a real application, you would send this to a server
        console.log('Order placed:', orderData);
        
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
        
        // Create custom product
        const customProduct = {
            id: Date.now(), // Unique ID
            name: `Custom ${formData.get('productType')}`,
            price: 350, // Custom order price
            category: 'custom',
            type: 'custom',
            image: 'images/custom-placeholder.jpg',
            description: `Custom order: ${formData.get('customText')}`,
            customDetails: {
                text: formData.get('customText'),
                color: document.querySelector('.color-option.selected')?.dataset.color || 'Mixed',
                notes: formData.get('notes'),
                quantity: parseInt(formData.get('quantity'))
            },
            quantity: parseInt(formData.get('quantity'))
        };
        
        // Add to cart
        cart.push(customProduct);
        saveCart();
        updateCartCount();
        
        // Show success message and redirect
        showNotification('Custom order added to cart! ✨');
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
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--pastel-pink), var(--lavender));
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
