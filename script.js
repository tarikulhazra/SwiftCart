const productContainer = document.getElementById('product-container');
const trendingContainer = document.getElementById('trending-container');
const categoryContainer = document.getElementById('category-container');
const loadingSpinner = document.getElementById('loading-spinner');
const cartCountElement = document.getElementById('cart-count');

let allProducts = [];
let cart = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();
});

// 1. Fetch Categories
const fetchCategories = async () => {
    try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        const data = await res.json();
        displayCategories(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

const displayCategories = (categories) => {
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.innerText = category.toUpperCase();
        btn.classList.add('btn', 'btn-outline', 'category-btn', 'capitalize');
        btn.onclick = () => filterByCategory(category);
        categoryContainer.appendChild(btn);
    });
};

// 2. Fetch All Products
const fetchProducts = async () => {
    toggleSpinner(true);
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        allProducts = data;
        displayProducts(data);
        displayTrending(data);
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        toggleSpinner(false);
    }
};

// 3. Display Products
const displayProducts = (products) => {
    productContainer.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('card', 'bg-base-100', 'shadow-xl', 'border');
        div.innerHTML = `
            <figure class="px-5 pt-5 h-48 flex justify-center items-center">
                <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
            </figure>
            <div class="card-body">
                <h2 class="card-title text-base">
                    ${product.title.length > 20 ? product.title.slice(0, 20) + '...' : product.title}
                    <div class="badge badge-secondary text-xs">${product.category}</div>
                </h2>
                <div class="flex justify-between items-center mt-2">
                    <p class="text-xl font-bold text-primary">$${product.price}</p>
                    <div class="flex items-center text-yellow-500">
                        <i class="fas fa-star mr-1"></i> ${product.rating.rate}
                    </div>
                </div>
                <div class="card-actions justify-between mt-4">
                    <button onclick="showDetails(${product.id})" class="btn btn-sm btn-outline btn-info">Details</button>
                    <button onclick="addToCart(${product.id})" class="btn btn-sm btn-primary">Add to Cart</button>
                </div>
            </div>
        `;
        productContainer.appendChild(div);
    });
};

// 4. Display Trending (Top 3 by rating)
const displayTrending = (products) => {
    const sorted = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);
    trendingContainer.innerHTML = '';
    sorted.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('card', 'bg-base-100', 'shadow-xl', 'border');
        div.innerHTML = `
            <figure class="px-5 pt-5 h-40">
                <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
            </figure>
            <div class="card-body items-center text-center">
                <h2 class="card-title text-sm">${product.title.slice(0, 20)}...</h2>
                <p class="font-bold">$${product.price}</p>
                <div class="text-yellow-500"><i class="fas fa-star"></i> ${product.rating.rate}</div>
            </div>
        `;
        trendingContainer.appendChild(div);
    });
};

// 5. Filter Logic
const filterByCategory = async (category) => {
    toggleSpinner(true);
    
    // Active class toggle
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('btn-active', 'btn-primary'));
    // Find the button clicked (simple logic) and add active class - (optional visual fix)
    
    if (category === 'all') {
        displayProducts(allProducts);
        toggleSpinner(false);
    } else {
        try {
            const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
            const data = await res.json();
            displayProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            toggleSpinner(false);
        }
    }
};

// 6. Modal Details
const showDetails = async (id) => {
    const product = allProducts.find(p => p.id === id);
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="flex-1 flex justify-center items-center">
            <img src="${product.image}" class="max-h-64 object-contain" />
        </div>
        <div class="flex-1 space-y-4">
            <h3 class="font-bold text-2xl">${product.title}</h3>
            <p class="text-gray-600">${product.description}</p>
            <p class="text-2xl font-bold text-primary">$${product.price}</p>
            <div class="badge badge-accent capitalize">${product.category}</div>
            <div class="text-yellow-500 font-bold"><i class="fas fa-star"></i> ${product.rating.rate} / 5</div>
            <button onclick="addToCart(${product.id})" class="btn btn-primary w-full mt-4">Buy Now</button>
        </div>
    `;
    document.getElementById('product_modal').showModal();
};

// 7. Add to Cart (Challenge)
const addToCart = (id) => {
    const product = allProducts.find(p => p.id === id);
    cart.push(product);
    updateCartCount();
    alert(`${product.title} added to cart!`); // Simple feedback
};

const updateCartCount = () => {
    cartCountElement.innerText = cart.length;
};

// Utils
const toggleSpinner = (show) => {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        productContainer.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
        productContainer.classList.remove('hidden');
    }
};