const sheetURL = "https://opensheet.elk.sh/1WQdEnCMDfx0Snh58n6Zd3yac7SdXpFihFgJfUK3HCUY/Sheet1";

let allData = [];

const subCategories = {
    mens_wear: ['shirts', 'tshirts_hoodies', 'jeans', 'trousers', 'jackets_coats', 'traditional_wear', 'shorts'],
    womens_wear: ['tops_tshirts', 'shirts', 'dresses', 'pants', 'traditional_wear', 'saree', 'night_wear'],
   /* kids_wear: ['boys_clothing', 'girls_clothing', 'baby_clothing'], */
    mens_footwear: ['slippers','casual_shoes', 'formal_shoes', 'sports_shoes'],
    womens_footwear: ['heels', 'flats'],
    bags: ['backpacks', 'handbags']
};

fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
        allData = data.reverse();
        renderPage();
    });

window.addEventListener('hashchange', renderPage);

function renderPage() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const mainCategory = hash.split('-')[0]; // e.g., mens_wear from mens_wear-shirts
    const subCategory = hash.includes('-') ? hash : null;

    const pageTitle = hash === 'home' ? 'Recently Added Items' : hash.replace(/_/g, ' ').toUpperCase();
    document.getElementById('page-title').innerText = pageTitle;

    const container = document.getElementById('recent-items-container');
    container.innerHTML = '';

    // Handle Sub Navigation
    const subNav = document.getElementById('sub-nav');


    subNav.innerHTML = '';
    if (subCategories[mainCategory]) {
        subCategories[mainCategory].forEach(sub => {
            const link = document.createElement('a');
            link.href = `#${mainCategory}-${sub}`;
            link.innerText = sub.replace(/_/g, ' ').toUpperCase();
            
            subNav.appendChild(link);
        });
}


    // Filter items
    let filteredItems;
    if (hash === 'home') {
        filteredItems = allData;
    } else if (subCategory) {
        filteredItems = allData.filter(item => item.category === hash);
    } else {
        filteredItems = allData.filter(item => item.category && (item.category === hash || item.category.startsWith(hash)));
    }

    if (filteredItems.length === 0) {
        container.innerHTML = `<p>No products found in this category.</p>`;
        return;
    }

    filteredItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-item';

        div.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <strong>${item.name}</strong>
            <span>${item.price}</span>
            <a href="${item.link}" target="_blank">View Product</a>
        `;

        container.appendChild(div);
    });
}
