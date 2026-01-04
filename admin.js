/* ===================================
   TALES OF FAIRIES - ADMIN PANEL
   Admin authentication and CRUD operations
   (Updated: WhatsApp removed, Export/Import/Reset removed)
   =================================== */

// ========== ADMIN AUTHENTICATION ==========

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'fairy2025'  // Change this to your preferred password
};

// Check if admin is logged in
function isAdminLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Admin login
function adminLogin(username, password) {
    if (username === ADMIN_CREDENTIALS.username && 
        password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

// Admin logout
function adminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin.html';
}

// Protect admin pages
function requireAdmin() {
    if (!isAdminLoggedIn()) {
        window.location.href = 'admin.html';
    }
}

// ========== ADMIN DASHBOARD ==========

// Display all products in admin table
function displayAdminProducts() {
    const tableBody = document.getElementById('adminProductsTable');
    if (!tableBody) return;
    
    const products = getAllProducts();
    
    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem;">
                    No products found. Add your first product! ✨
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23E6D5F5%22 width=%2250%22 height=%2250%22/%3E%3C/svg%3E'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>PKR ${product.price}</td>
            <td>
                <span class="category-badge">${categoryNames[product.category] || product.category}</span>
            </td>
            <td>
                <span class="type-badge ${product.type === 'premade' ? 'type-premade' : 'type-custom'}">
                    ${product.type === 'premade' ? 'Premade ✨' : 'Custom 🎨'}
                </span>
            </td>
            <td>
                <span class="stock-badge ${product.stock <= 5 ? 'stock-low' : 'stock-good'}">
                    ${product.stock}
                </span>
            </td>
            <td>${product.dateAdded || 'N/A'}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editProduct(${product.id})" class="btn-edit" title="Edit">
                        ✏️
                    </button>
                    <button onclick="confirmDeleteProduct(${product.id})" class="btn-delete" title="Delete">
                        🗑️
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    updateAdminStats();
}

// Update admin dashboard statistics (UPDATED: Now shows actual product count)
function updateAdminStats() {
    const products = getAllProducts();
    
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock <= 5 && p.type === 'premade').length;
    const customItems = products.filter(p => p.type === 'custom').length;
    
    const statTotalProducts = document.getElementById('statTotalProducts');
    const statTotalValue = document.getElementById('statTotalValue');
    const statLowStock = document.getElementById('statLowStock');
    const statCustomItems = document.getElementById('statCustomItems');
    
    if (statTotalProducts) statTotalProducts.textContent = totalProducts;
    if (statTotalValue) statTotalValue.textContent = `PKR ${totalValue.toLocaleString()}`;
    if (statLowStock) statLowStock.textContent = lowStock;
    if (statCustomItems) statCustomItems.textContent = customItems;
}

// ========== ADD PRODUCT ==========

function showAddProductModal() {
    document.getElementById('addProductModal').style.display = 'flex';
    document.getElementById('addProductForm').reset();
}

function hideAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

function handleAddProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        name: formData.get('name'),
        price: formData.get('price'),
        category: formData.get('category'),
        type: formData.get('type'),
        image: formData.get('image'),
        description: formData.get('description'),
        stock: formData.get('stock')
    };
    
    // Validation
    if (!productData.name || !productData.price || !productData.category) {
        showAdminNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Add product
    const newProduct = addProduct(productData);
    
    if (newProduct) {
        showAdminNotification('Product added successfully! ✨', 'success');
        hideAddProductModal();
        displayAdminProducts();
    } else {
        showAdminNotification('Error adding product. Please try again.', 'error');
    }
}

// ========== EDIT PRODUCT ==========

function editProduct(id) {
    const product = getProductById(id);
    if (!product) return;
    
    // Populate edit form
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editType').value = product.type;
    document.getElementById('editImage').value = product.image;
    document.getElementById('editDescription').value = product.description;
    document.getElementById('editStock').value = product.stock;
    
    // Show modal
    document.getElementById('editProductModal').style.display = 'flex';
}

function hideEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

function handleEditProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productId = formData.get('productId');
    const updates = {
        name: formData.get('name'),
        price: formData.get('price'),
        category: formData.get('category'),
        type: formData.get('type'),
        image: formData.get('image'),
        description: formData.get('description'),
        stock: formData.get('stock')
    };
    
    // Update product
    const updated = updateProduct(productId, updates);
    
    if (updated) {
        showAdminNotification('Product updated successfully! ✨', 'success');
        hideEditProductModal();
        displayAdminProducts();
    } else {
        showAdminNotification('Error updating product. Please try again.', 'error');
    }
}

// ========== DELETE PRODUCT ==========

function confirmDeleteProduct(id) {
    const product = getProductById(id);
    if (!product) return;
    
    if (confirm(`Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`)) {
        const deleted = deleteProduct(id);
        
        if (deleted) {
            showAdminNotification('Product deleted successfully.', 'success');
            displayAdminProducts();
        } else {
            showAdminNotification('Error deleting product. Please try again.', 'error');
        }
    }
}

// ========== SEARCH & FILTER ==========

function handleAdminSearch() {
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    let products = getAllProducts();
    
    // Apply search
    if (searchTerm) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
        products = products.filter(p => p.category === categoryFilter);
    }
    
    // Apply type filter
    if (typeFilter && typeFilter !== 'all') {
        products = products.filter(p => p.type === typeFilter);
    }
    
    // Display filtered products
    displayFilteredProducts(products);
}

function displayFilteredProducts(products) {
    const tableBody = document.getElementById('adminProductsTable');
    if (!tableBody) return;
    
    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem;">
                    No products found matching your filters. 🔍
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23E6D5F5%22 width=%2250%22 height=%2250%22/%3E%3C/svg%3E'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>PKR ${product.price}</td>
            <td>
                <span class="category-badge">${categoryNames[product.category] || product.category}</span>
            </td>
            <td>
                <span class="type-badge ${product.type === 'premade' ? 'type-premade' : 'type-custom'}">
                    ${product.type === 'premade' ? 'Premade ✨' : 'Custom 🎨'}
                </span>
            </td>
            <td>
                <span class="stock-badge ${product.stock <= 5 ? 'stock-low' : 'stock-good'}">
                    ${product.stock}
                </span>
            </td>
            <td>${product.dateAdded || 'N/A'}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editProduct(${product.id})" class="btn-edit" title="Edit">
                        ✏️
                    </button>
                    <button onclick="confirmDeleteProduct(${product.id})" class="btn-delete" title="Delete">
                        🗑️
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ========== ORDERS MANAGEMENT (UPDATED: No WhatsApp) ==========

// Switch between Products and Orders view
function showProductsView() {
    document.getElementById('productsView').style.display = 'block';
    document.getElementById('ordersView').style.display = 'none';
}

function showOrdersView() {
    document.getElementById('productsView').style.display = 'none';
    document.getElementById('ordersView').style.display = 'block';
    displayOrders();
    updateOrdersStats();
}

// Get all orders from localStorage
function getAllOrders() {
    try {
        const orders = localStorage.getItem('talesOfFairiesOrders');
        return orders ? JSON.parse(orders) : [];
    } catch (e) {
        console.error('Error loading orders:', e);
        return [];
    }
}

// Display all orders in table (UPDATED: No WhatsApp button)
function displayOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    const orders = getAllOrders().reverse(); // Show newest first
    
    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                    No orders yet. Waiting for customers! 🛍️
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${order.orderId}</strong></td>
            <td>${new Date(order.date).toLocaleDateString('en-PK')}<br>
                <small>${new Date(order.date).toLocaleTimeString('en-PK', {hour: '2-digit', minute: '2-digit'})}</small>
            </td>
            <td>
                <strong>${order.customer.fullName}</strong><br>
                <small>📞 ${order.customer.phone}</small>
            </td>
            <td>${order.items.length} item(s)</td>
            <td><strong style="color: var(--gold);">PKR ${order.total}</strong></td>
            <td>
                <span class="payment-badge">
                    ${order.paymentMethod === 'cod' ? '💵 COD' : '🏦 Bank'}
                </span>
            </td>
            <td>
                <span class="status-badge status-pending">⏳ Pending</span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button onclick="viewOrderDetails('${order.orderId}')" class="btn-edit" title="View Details">
                        👁️
                    </button>
                    <button onclick="confirmDeleteOrder('${order.orderId}')" class="btn-delete" title="Delete">
                        🗑️
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update order statistics
function updateOrdersStats() {
    const orders = getAllOrders();
    
    const totalOrders = orders.length;
    const pendingOrders = orders.length; // All orders are pending in this simple system
    const completedOrders = 0;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    
    const statTotalOrders = document.getElementById('statTotalOrders');
    const statPendingOrders = document.getElementById('statPendingOrders');
    const statCompletedOrders = document.getElementById('statCompletedOrders');
    const statTotalRevenue = document.getElementById('statTotalRevenue');
    
    if (statTotalOrders) statTotalOrders.textContent = totalOrders;
    if (statPendingOrders) statPendingOrders.textContent = pendingOrders;
    if (statCompletedOrders) statCompletedOrders.textContent = completedOrders;
    if (statTotalRevenue) statTotalRevenue.textContent = `PKR ${totalRevenue.toLocaleString()}`;
}

// View order details in modal
function viewOrderDetails(orderId) {
    const orders = getAllOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const modal = document.getElementById('viewOrderModal');
    const content = document.getElementById('orderDetailsContent');
    
    let itemsHTML = '';
    order.items.forEach((item, index) => {
        itemsHTML += `
            <div style="border: 2px solid var(--soft-mint); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4>${index + 1}. ${item.name}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
                    <div>
                        <strong>Type:</strong> ${item.type === 'premade' ? 'Premade ✨' : 'Custom 🎨'}
                    </div>
                    <div>
                        <strong>Quantity:</strong> ${item.quantity}
                    </div>
                    <div>
                        <strong>Price:</strong> PKR ${item.price} each
                    </div>
                    <div>
                        <strong>Subtotal:</strong> PKR ${item.price * item.quantity}
                    </div>
                </div>
                ${item.customDetails ? `
                    <div style="margin-top: 1rem; background: var(--sky-blue); padding: 1rem; border-radius: 8px;">
                        <strong>✏️ Custom Details:</strong><br>
                        <strong>Text:</strong> ${item.customDetails.text || 'N/A'}<br>
                        <strong>Color:</strong> ${item.customDetails.color || 'N/A'}
                        ${item.customDetails.notes ? `<br><strong>Notes:</strong> ${item.customDetails.notes}` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    content.innerHTML = `
        <div style="display: grid; gap: 2rem;">
            <div>
                <h3 style="margin-bottom: 1rem;">📋 Order Information</h3>
                <div style="background: linear-gradient(135deg, var(--pastel-pink), var(--lavender)); padding: 1.5rem; border-radius: 15px; color: white;">
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleString('en-PK')}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                </div>
            </div>
            
            <div>
                <h3 style="margin-bottom: 1rem;">👤 Customer Details</h3>
                <div style="background: var(--soft-mint); padding: 1.5rem; border-radius: 15px;">
                    <p><strong>Name:</strong> ${order.customer.fullName}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Address:</strong> ${order.customer.address}</p>
                    <p><strong>City:</strong> ${order.customer.city}</p>
                    <p><strong>Country:</strong> ${order.customer.country}</p>
                </div>
            </div>
            
            <div>
                <h3 style="margin-bottom: 1rem;">🛍️ Order Items</h3>
                ${itemsHTML}
            </div>
            
            <div style="background: linear-gradient(135deg, var(--sky-blue), var(--soft-mint)); padding: 1.5rem; border-radius: 15px; text-align: center;">
                <h3 style="margin-bottom: 0.5rem;">💰 Total Amount</h3>
                <p style="font-size: 2rem; font-weight: bold; color: var(--text-dark); margin: 0;">PKR ${order.total}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Hide order modal
function hideOrderModal() {
    document.getElementById('viewOrderModal').style.display = 'none';
}

// Delete order with confirmation
function confirmDeleteOrder(orderId) {
    if (!confirm('Delete this order?\n\nThis action cannot be undone.')) return;
    
    let orders = getAllOrders();
    orders = orders.filter(o => o.orderId !== orderId);
    localStorage.setItem('talesOfFairiesOrders', JSON.stringify(orders));
    
    showAdminNotification('Order deleted successfully', 'success');
    displayOrders();
    updateOrdersStats();
}

// ========== NOTIFICATIONS ==========

function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin.html') {
        // Admin login page
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            // If already logged in, redirect to dashboard
            if (isAdminLoggedIn()) {
                window.location.href = 'admin-dashboard.html';
                return;
            }
            
            loginForm.addEventListener('submit', handleAdminLogin);
        }
    } else if (currentPage === 'admin-dashboard.html') {
        // Admin dashboard page
        requireAdmin();
        
        // Initialize dashboard
        displayAdminProducts();
        
        // Setup event listeners
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', handleAddProduct);
        }
        
        const editProductForm = document.getElementById('editProductForm');
        if (editProductForm) {
            editProductForm.addEventListener('submit', handleEditProduct);
        }
        
        // Search and filter
        const adminSearch = document.getElementById('adminSearch');
        if (adminSearch) {
            adminSearch.addEventListener('input', handleAdminSearch);
        }
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', handleAdminSearch);
        }
        
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', handleAdminSearch);
        }
    }
});

// Handle admin login form submission
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('loginError');
    
    if (adminLogin(username, password)) {
        window.location.href = 'admin-dashboard.html';
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Invalid username or password. Please try again.';
        
        // Shake animation
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginBox.style.animation = '';
        }, 500);
    }
}

// Make functions available globally
window.showAddProductModal = showAddProductModal;
window.hideAddProductModal = hideAddProductModal;
window.editProduct = editProduct;
window.hideEditProductModal = hideEditProductModal;
window.confirmDeleteProduct = confirmDeleteProduct;
window.adminLogout = adminLogout;
window.showProductsView = showProductsView;
window.showOrdersView = showOrdersView;
window.viewOrderDetails = viewOrderDetails;
window.hideOrderModal = hideOrderModal;
window.confirmDeleteOrder = confirmDeleteOrder;
