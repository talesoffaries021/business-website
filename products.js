/* ===================================
   TALES OF FAIRIES - PRODUCT DATA
   Central data store for all products
   =================================== */

// This array holds all product data
// Admin panel will modify this data, and changes reflect immediately on customer view

let productsData = [
    // RESIN KEYCHAINS
    {
        id: 1,
        name: "Rainbow Resin Keychain",
        price: 250,
        category: "resin-keychains",
        type: "premade",
        image: "images/keychain1.jpg",
        description: "Beautiful rainbow colored resin keychain with sparkles",
        stock: 10,
        dateAdded: "2025-01-01"
    },
    {
        id: 2,
        name: "Custom Name Resin Keychain",
        price: 350,
        category: "resin-keychains",
        type: "custom",
        image: "images/keychain2.jpg",
        description: "Personalized resin keychain with your chosen name",
        stock: 999,
        dateAdded: "2025-01-01"
    },
    {
        id: 3,
        name: "Glitter Resin Keychain - Pink",
        price: 280,
        category: "resin-keychains",
        type: "premade",
        image: "images/resin-pink.jpg",
        description: "Stunning pink resin keychain with gold glitter",
        stock: 12,
        dateAdded: "2025-01-01"
    },
    {
        id: 4,
        name: "Ocean Wave Resin Keychain",
        price: 300,
        category: "resin-keychains",
        type: "premade",
        image: "images/resin-ocean.jpg",
        description: "Beautiful ocean wave design in blue and white resin",
        stock: 8,
        dateAdded: "2025-01-01"
    },
    
    // ALPHABET KEYCHAINS
    {
        id: 5,
        name: "Rainbow Alphabet Keychain - Letter A",
        price: 250,
        category: "alphabet-keychains",
        type: "premade",
        image: "images/alphabet-a.jpg",
        description: "Beautiful resin keychain with letter A in rainbow colors",
        stock: 10,
        dateAdded: "2025-01-01"
    },
    {
        id: 6,
        name: "Lavender Alphabet Keychain - Letter B",
        price: 250,
        category: "alphabet-keychains",
        type: "premade",
        image: "images/alphabet-b.jpg",
        description: "Elegant resin keychain with letter B in lavender",
        stock: 12,
        dateAdded: "2025-01-02"
    },
    {
        id: 7,
        name: "Custom Alphabet Keychain",
        price: 280,
        category: "alphabet-keychains",
        type: "custom",
        image: "images/alphabet-custom.jpg",
        description: "Choose any letter in your favorite color",
        stock: 999,
        dateAdded: "2025-01-02"
    },
    
    // ACRYLIC KEYCHAINS
    {
        id: 8,
        name: "Pastel Acrylic Keychain",
        price: 200,
        category: "acrylic-keychains",
        type: "premade",
        image: "images/acrylic1.jpg",
        description: "Cute pastel colored acrylic keychain",
        stock: 15,
        dateAdded: "2025-01-01"
    },
    {
        id: 9,
        name: "Mint Green Acrylic Keychain",
        price: 200,
        category: "acrylic-keychains",
        type: "premade",
        image: "images/acrylic2.jpg",
        description: "Fresh mint green acrylic keychain with sparkles",
        stock: 10,
        dateAdded: "2025-01-02"
    },
    
    // CROCHET ITEMS
    {
        id: 10,
        name: "Crochet Hand Warmers - Pink",
        price: 450,
        category: "crochet-items",
        type: "premade",
        image: "images/crochet1.jpg",
        description: "Soft and cozy hand warmers in pink",
        stock: 8,
        dateAdded: "2025-01-01"
    },
    {
        id: 11,
        name: "Custom Crochet Item",
        price: 500,
        category: "crochet-items",
        type: "custom",
        image: "images/crochet2.jpg",
        description: "Custom crochet accessory made to your specifications",
        stock: 999,
        dateAdded: "2025-01-01"
    },
    
    // BOOKMARKS
    {
        id: 12,
        name: "Fairy Tale Bookmark",
        price: 180,
        category: "bookmarks",
        type: "premade",
        image: "images/bookmark1.jpg",
        description: "Magical resin bookmark with fairy tale theme",
        stock: 20,
        dateAdded: "2025-01-01"
    },
    {
        id: 13,
        name: "Floral Resin Bookmark",
        price: 180,
        category: "bookmarks",
        type: "premade",
        image: "images/bookmark2.jpg",
        description: "Beautiful pressed flower resin bookmark",
        stock: 15,
        dateAdded: "2025-01-02"
    }
];

// Category mapping for display - FIXED: Now includes resin-keychains
const categoryNames = {
    "resin-keychains": "Resin Keychains ✨",
    "alphabet-keychains": "Alphabet Keychains 🔤",
    "acrylic-keychains": "Acrylic Keychains 💎",
    "crochet-items": "Crochet Items 🧶",
    "bookmarks": "Bookmarks 📚"
};

// Generate unique ID for new products
function generateProductId() {
    return productsData.length > 0 
        ? Math.max(...productsData.map(p => p.id)) + 1 
        : 1;
}

// Get all products
function getAllProducts() {
    return [...productsData]; // Return copy to prevent direct modification
}

// Get product by ID
function getProductById(id) {
    return productsData.find(p => p.id === parseInt(id));
}

// Get products by category
function getProductsByCategory(category) {
    if (category === 'all') return getAllProducts();
    return productsData.filter(p => p.category === category);
}

// Get products by type (premade/custom)
function getProductsByType(type) {
    return productsData.filter(p => p.type === type);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return productsData.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
}

// ========== ADMIN CRUD OPERATIONS ==========

// Add new product
function addProduct(productData) {
    const newProduct = {
        id: generateProductId(),
        name: productData.name,
        price: parseFloat(productData.price),
        category: productData.category,
        type: productData.type,
        image: productData.image,
        description: productData.description,
        stock: parseInt(productData.stock),
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    productsData.push(newProduct);
    saveProductsToStorage();
    return newProduct;
}

// Update existing product
function updateProduct(id, updates) {
    const index = productsData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    
    productsData[index] = {
        ...productsData[index],
        ...updates,
        id: parseInt(id), // Ensure ID doesn't change
        price: parseFloat(updates.price),
        stock: parseInt(updates.stock)
    };
    
    saveProductsToStorage();
    return productsData[index];
}

// Delete product
function deleteProduct(id) {
    const index = productsData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    
    productsData.splice(index, 1);
    saveProductsToStorage();
    return true;
}

// Update stock quantity
function updateStock(id, quantity) {
    const product = getProductById(id);
    if (!product) return false;
    
    product.stock = parseInt(quantity);
    saveProductsToStorage();
    return true;
}

// ========== ORDER MANAGEMENT ==========

// Store all orders
let ordersData = [];

// Generate unique order ID
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Add new order
function addOrder(orderData) {
    const newOrder = {
        id: generateOrderId(),
        customer: orderData.customer,
        items: orderData.items,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        status: 'pending', // pending, processing, completed, cancelled
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString('en-PK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    ordersData.push(newOrder);
    saveOrdersToStorage();
    return newOrder;
}

// Get all orders
function getAllOrders() {
    return [...ordersData].reverse(); // Most recent first
}

// Get order by ID
function getOrderById(id) {
    return ordersData.find(o => o.id === id);
}

// Update order status
function updateOrderStatus(id, status) {
    const order = ordersData.find(o => o.id === id);
    if (!order) return false;
    
    order.status = status;
    saveOrdersToStorage();
    return true;
}

// Delete order
function deleteOrder(id) {
    const index = ordersData.findIndex(o => o.id === id);
    if (index === -1) return false;
    
    ordersData.splice(index, 1);
    saveOrdersToStorage();
    return true;
}

// ========== WHATSAPP NOTIFICATION ==========

const ADMIN_WHATSAPP = '+923354078626'; // Your WhatsApp number

// Send order notification to admin via WhatsApp
function sendOrderNotificationWhatsApp(order) {
    let message = `🧚‍♀️ *New Order from Tales of Fairies!*\n\n`;
    message += `📋 *Order ID:* ${order.id}\n`;
    message += `📅 *Date:* ${order.dateFormatted}\n\n`;
    
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${order.customer.fullName}\n`;
    message += `Phone: ${order.customer.phone}\n`;
    message += `Email: ${order.customer.email}\n`;
    message += `Address: ${order.customer.address}, ${order.customer.city}\n\n`;
    
    message += `🛍️ *Order Items:*\n`;
    order.items.forEach((item, index) => {
        message += `\n${index + 1}. ${item.name}\n`;
        message += `   Type: ${item.type === 'premade' ? 'Premade ✨' : 'Custom 🎨'}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: PKR ${item.price} each\n`;
        message += `   Subtotal: PKR ${item.price * item.quantity}\n`;
        
        // Add custom details if it's a custom order
        if (item.customDetails) {
            message += `   ✏️ Custom Text: ${item.customDetails.text}\n`;
            message += `   🎨 Color: ${item.customDetails.color}\n`;
            if (item.customDetails.notes) {
                message += `   📝 Notes: ${item.customDetails.notes}\n`;
            }
        }
    });
    
    message += `\n💰 *Total Amount:* PKR ${order.total}\n`;
    message += `💳 *Payment Method:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}\n\n`;
    message += `✨ Please confirm this order with the customer!\n`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP.replace('+', '')}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    return true;
}

// ========== PERSISTENCE (LocalStorage) ==========

// Save products to localStorage
function saveProductsToStorage() {
    try {
        localStorage.setItem('talesOfFairiesProducts', JSON.stringify(productsData));
        // Trigger custom event to notify all pages of data change
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        return true;
    } catch (error) {
        console.error('Error saving products:', error);
        return false;
    }
}

// Load products from localStorage
function loadProductsFromStorage() {
    try {
        const stored = localStorage.getItem('talesOfFairiesProducts');
        if (stored) {
            productsData = JSON.parse(stored);
            return true;
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
    return false;
}

// Save orders to localStorage
function saveOrdersToStorage() {
    try {
        localStorage.setItem('talesOfFairiesOrders', JSON.stringify(ordersData));
        // Trigger custom event to notify admin dashboard
        window.dispatchEvent(new CustomEvent('ordersUpdated'));
        return true;
    } catch (error) {
        console.error('Error saving orders:', error);
        return false;
    }
}

// Load orders from localStorage
function loadOrdersFromStorage() {
    try {
        const stored = localStorage.getItem('talesOfFairiesOrders');
        if (stored) {
            ordersData = JSON.parse(stored);
            return true;
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
    return false;
}

// Reset to default products
function resetToDefaultProducts() {
    productsData = [
        // RESIN KEYCHAINS
        {
            id: 1,
            name: "Rainbow Resin Keychain",
            price: 250,
            category: "resin-keychains",
            type: "premade",
            image: "images/keychain1.jpg",
            description: "Beautiful rainbow colored resin keychain with sparkles",
            stock: 10,
            dateAdded: "2025-01-01"
        },
        {
            id: 2,
            name: "Custom Name Resin Keychain",
            price: 350,
            category: "resin-keychains",
            type: "custom",
            image: "images/keychain2.jpg",
            description: "Personalized resin keychain with your chosen name",
            stock: 999,
            dateAdded: "2025-01-01"
        },
        {
            id: 3,
            name: "Glitter Resin Keychain - Pink",
            price: 280,
            category: "resin-keychains",
            type: "premade",
            image: "images/resin-pink.jpg",
            description: "Stunning pink resin keychain with gold glitter",
            stock: 12,
            dateAdded: "2025-01-01"
        },
        {
            id: 4,
            name: "Pastel Acrylic Keychain",
            price: 200,
            category: "acrylic-keychains",
            type: "premade",
            image: "images/acrylic1.jpg",
            description: "Cute pastel colored acrylic keychain",
            stock: 15,
            dateAdded: "2025-01-01"
        },
        {
            id: 5,
            name: "Crochet Hand Warmers - Pink",
            price: 450,
            category: "crochet-items",
            type: "premade",
            image: "images/crochet1.jpg",
            description: "Soft and cozy hand warmers in pink",
            stock: 8,
            dateAdded: "2025-01-01"
        },
        {
            id: 6,
            name: "Fairy Tale Bookmark",
            price: 180,
            category: "bookmarks",
            type: "premade",
            image: "images/bookmark1.jpg",
            description: "Magical resin bookmark with fairy tale theme",
            stock: 20,
            dateAdded: "2025-01-01"
        }
    ];
    
    saveProductsToStorage();
}

// Initialize - load from storage on page load
(function initData() {
    if (!loadProductsFromStorage()) {
        // If no saved data, use default products
        saveProductsToStorage();
    }
    
    // Always load orders
    loadOrdersFromStorage();
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsData,
        categoryNames,
        getAllProducts,
        getProductById,
        getProductsByCategory,
        getProductsByType,
        searchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        resetToDefaultProducts,
        saveProductsToStorage,
        loadProductsFromStorage,
        // Order functions
        addOrder,
        getAllOrders,
        getOrderById,
        updateOrderStatus,
        deleteOrder,
        sendOrderNotificationWhatsApp
    };
}
