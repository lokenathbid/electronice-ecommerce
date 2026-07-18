// --- DATA ---
const products = [
    {
        id: 1,
        name: "Sony WH-1000XM5",
        category: "Headphones",
        price: 348.00,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500",
        description: "Industry-leading noise cancellation with 30-hour battery life."
    },
    {
        id: 2,
        name: "Apple Watch Ultra 2",
        category: "Wearables",
        price: 799.00,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "The rugged and capable Apple Watch. Titanium case."
    },
    {
        id: 3,
        name: "Marshall Stanmore III",
        category: "Speakers",
        price: 379.00,
        image: "https://images.unsplash.com/photo-1671856114466-757e82694ff9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Legendary sound with a wider soundstage."
    },
    {
        id: 4,
        name: "AirPods Max",
        category: "Headphones",
        price: 549.00,
        image: "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?auto=format&fit=crop&q=80&w=500",
        description: "High-fidelity audio. Active Noise Cancellation with Transparency mode."
    },
    {
        id: 5,
        name: "Sonos Era 300",
        category: "Speakers",
        price: 449.00,
        image: "https://images.unsplash.com/photo-1743521442683-08ffd8ac9e14?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Next-gen acoustic architecture for spatial audio."
    },
    {
        id: 6,
        name: "Garmin Fenix 7 Pro",
        category: "Wearables",
        price: 899.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500",
        description: "Multisport GPS watch with solar charging capability."
    }
];

// --- STATE ---
let cart = [];

// --- FUNCTIONS ---

// 1. Navigation Logic
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    
    // Show requested page
    if (pageId === 'home') {
        document.getElementById('home-page').classList.add('active');
        window.scrollTo(0,0);
    } else if (pageId === 'cart') {
        document.getElementById('cart-page').classList.add('active');
        renderCartPage();
        window.scrollTo(0,0);
    }
}

function scrollToGrid() {
    document.getElementById('shop-grid').scrollIntoView({ behavior: 'smooth' });
}

// 2. Render Products (Home)
function renderProducts() {
    const container = document.getElementById('product-list');
    container.innerHTML = products.map(product => `
        <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col">
            <div class="relative h-72 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply">
                <span class="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-slate-500">${product.category}</span>
            </div>
            
            <div class="p-6 flex-1 flex flex-col">
                <h3 class="text-xl font-bold text-slate-900 mb-2">${product.name}</h3>
                <p class="text-sm text-slate-500 mb-4 line-clamp-2">${product.description}</p>
                
                <div class="mt-auto flex items-center justify-between">
                    <span class="text-2xl font-bold text-slate-900">$${product.price}</span>
                    <button onclick="addToCart(${product.id})" class="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                        <i data-lucide="plus" class="w-4 h-4"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// 3. Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCounter();
    
    // Visual feedback
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Added`;
    btn.classList.add('bg-green-600', 'text-white');
    lucide.createIcons();
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-600');
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCounter();
    renderCartPage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCartPage();
        }
    }
}

function updateCartCounter() {
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = totalItems;
    
    if (totalItems > 0) {
        badge.classList.remove('scale-0');
    } else {
        badge.classList.add('scale-0');
    }
}

// 4. Render Cart Page
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const summary = document.querySelector('.bg-slate-50.rounded-2xl'); // Order Summary Box

    if (cart.length === 0) {
        container.innerHTML = '';
        emptyMsg.classList.remove('hidden');
        // Disable checkout button essentially
        document.getElementById('cart-total').innerText = '$0.00';
        document.getElementById('cart-subtotal').innerText = '$0.00';
        document.getElementById('cart-tax').innerText = '$0.00';
        return;
    }

    emptyMsg.classList.add('hidden');

    // Render Items
    container.innerHTML = cart.map(item => `
        <div class="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div class="h-24 w-24 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                <img src="${item.image}" class="h-full w-full object-contain mix-blend-multiply">
            </div>
            
            <div class="flex-1 text-center sm:text-left">
                <h3 class="font-bold text-slate-900">${item.name}</h3>
                <p class="text-sm text-slate-500">${item.category}</p>
            </div>

            <div class="flex items-center gap-4 bg-slate-50 rounded-lg px-2 py-1">
                <button onclick="updateQuantity(${item.id}, -1)" class="p-1 hover:text-blue-600"><i data-lucide="minus" class="w-4 h-4"></i></button>
                <span class="font-medium text-slate-900 w-4 text-center">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="p-1 hover:text-blue-600"><i data-lucide="plus" class="w-4 h-4"></i></button>
            </div>

            <div class="text-right min-w-[80px]">
                <p class="font-bold text-slate-900">$${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})" class="text-xs text-red-500 hover:text-red-700 mt-1 underline">Remove</button>
            </div>
        </div>
    `).join('');

    // Calculate Totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% Tax
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').innerText = '$' + subtotal.toFixed(2);
    document.getElementById('cart-tax').innerText = '$' + tax.toFixed(2);
    document.getElementById('cart-total').innerText = '$' + total.toFixed(2);
    
    lucide.createIcons();
}

// --- INIT ---
renderProducts();
lucide.createIcons();