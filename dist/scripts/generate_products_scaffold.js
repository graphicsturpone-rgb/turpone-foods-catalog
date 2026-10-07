const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract everything up to </header>
const headerMatch = indexHtml.match(/^([\s\S]*?<\/header>)/i);
const header = headerMatch ? headerMatch[1] : '';

// Extract everything from <footer to the end
const footerMatch = indexHtml.match(/(<footer[\s\S]*)$/i);
const footer = footerMatch ? footerMatch[1] : '';

// Fix paths in header/footer to be absolute from root
const fixPaths = (html) => {
    return html.replace(/(href|src)="assets\//g, '$1="/assets/');
};

const fixedHeader = fixPaths(header);
const fixedFooter = fixPaths(footer);

const customCSS = `
<style>
/* Products Block Layout CSS */
.products-layout {
    display: flex;
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
    gap: 40px;
    font-family: 'Poppins', sans-serif;
}
.products-sidebar {
    width: 250px;
    flex-shrink: 0;
    background: #fbfaf6;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #efebe1;
    align-self: flex-start;
}
.products-sidebar h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
}
.products-sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.products-sidebar li {
    margin-bottom: 15px;
}
.products-sidebar label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
    cursor: pointer;
}
.products-sidebar input[type="checkbox"] {
    margin-right: 10px;
    cursor: pointer;
}
.products-grid {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}
.product-card {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #efebe1;
    padding: 20px;
    text-align: center;
    transition: box-shadow 0.3s ease;
}
.product-card:hover {
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.product-card .img-placeholder {
    width: 100%;
    height: 200px;
    background: #f4ebd8;
    border-radius: 4px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a4977a;
    font-size: 12px;
}
.product-card h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}
.product-card p {
    font-size: 13px;
    color: #777;
    margin-bottom: 15px;
    line-height: 1.4;
}
.product-card .btn-details {
    color: #a31d24;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
}
.product-card .btn-details i {
    margin-left: 5px;
}

/* Detail Layout CSS */
.detail-layout {
    display: flex;
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
    gap: 40px;
    font-family: 'Poppins', sans-serif;
}
.detail-left {
    flex: 1;
}
.detail-right {
    flex: 1;
}
.main-img-box {
    border: 1px solid #efebe1;
    border-radius: 8px;
    padding: 20px;
    background: #fff;
    text-align: center;
    margin-bottom: 15px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.thumbnail-row {
    display: flex;
    gap: 15px;
}
.thumbnail-box {
    flex: 1;
    border: 1px solid #efebe1;
    border-radius: 8px;
    padding: 10px;
    background: #fff;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.store-list {
    border: 1px solid #d1c8b3;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;
}
.store-list-header {
    display: flex;
}
.store-list-header div {
    flex: 1;
    text-align: center;
    padding: 12px;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    color: #fff;
    background: #a31d24;
}
.store-list-header div:last-child {
    background: #fbfaf6;
    color: #a31d24;
}
.store-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid #efebe1;
}
.store-item:last-child {
    border-bottom: none;
}
.store-item .store-logo {
    font-weight: bold;
    font-size: 20px;
    color: #0071ce; /* Walmart color for demo */
}
.store-item .btn-buy {
    background: #a31d24;
    color: #fff;
    border: none;
    padding: 8px 24px;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
}
.buy-direct {
    display: block;
    width: 100%;
    text-align: center;
    background: #a31d24;
    color: #fff;
    text-decoration: none;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
    font-weight: 600;
    text-transform: uppercase;
}

/* Accordion for Details */
.accordion {
    margin-top: 30px;
    border-top: 1px solid #efebe1;
}
.accordion-item {
    border-bottom: 1px solid #efebe1;
    padding: 15px 0;
}
.accordion-title {
    font-weight: 600;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
}
.accordion-title:after {
    content: '\\f107'; /* FontAwesome down arrow */
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
}
</style>
`;

const catalogHtml = `${fixedHeader}
${customCSS}
<main style="background: #fbfaf6; min-height: 80vh; padding-top: 40px; padding-bottom: 40px;">
    
    <div style="text-align: center; padding-bottom: 40px;">
        <h1 style="font-size: 36px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #333;">Turpone Products</h1>
        <p style="color: #666; font-size: 16px;">Discover our premium selection of authentic ingredients.</p>
    </div>

    <div class="products-layout">
        <!-- Filters Sidebar -->
        <aside class="products-sidebar">
            <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">By Product Categories</h3>
            <ul>
                <li><label><input type="checkbox"> Infused Oils</label></li>
                <li><label><input type="checkbox"> Honeys</label></li>
                <li><label><input type="checkbox"> Seasoning</label></li>
                <li><label><input type="checkbox"> Pizza Sauce</label></li>
                <li><label><input type="checkbox"> Pizza Flour</label></li>
                <li><label><input type="checkbox"> Frozen Pizza Dough</label></li>
                <li><label><input type="checkbox"> Frozen Pizza</label></li>
                <li><label><input type="checkbox"> Frozen Pinsa</label></li>
            </ul>
        </aside>

        <!-- Product Grid -->
        <div class="products-grid">
            <!-- Product Card 1 -->
            <div class="product-card">
                <div class="img-placeholder">Product Image</div>
                <div style="font-size: 10px; color: #a31d24; text-transform: uppercase; margin-bottom: 5px;">Pizza Sauce</div>
                <h4>Marinara Pizza Sauce</h4>
                <p>Crafted with the finest whole-peeled tomatoes, picked at their peak ripeness.</p>
                <a href="/products/detail.html" class="btn-details">View Details <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            
            <!-- Product Card 2 -->
            <div class="product-card">
                <div class="img-placeholder">Product Image</div>
                <div style="font-size: 10px; color: #a31d24; text-transform: uppercase; margin-bottom: 5px;">Pizza Sauce</div>
                <h4>Arrabbiata Pizza Sauce</h4>
                <p>Indulge in a premium tomato sauce that delivers a vibrant, bright tomato taste with every bite.</p>
                <a href="/products/detail.html" class="btn-details">View Details <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            
            <!-- Product Card 3 -->
            <div class="product-card">
                <div class="img-placeholder">Product Image</div>
                <div style="font-size: 10px; color: #a31d24; text-transform: uppercase; margin-bottom: 5px;">Pizza Flour</div>
                <h4>00 Pizza Flour</h4>
                <p>The authentic choice for Neapolitan pizza, giving you the perfect rise and chew.</p>
                <a href="/products/detail.html" class="btn-details">View Details <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
</main>
${fixedFooter}`;

const detailHtml = `${fixedHeader}
${customCSS}
<main style="background: #fbfaf6; min-height: 80vh; padding-top: 40px; padding-bottom: 40px;">

    <!-- Breadcrumb -->
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; font-size: 12px; color: #777;">
        Home <i class="fa-solid fa-angle-right" style="margin: 0 5px;"></i> Products <i class="fa-solid fa-angle-right" style="margin: 0 5px;"></i> Pizza Sauce
    </div>

    <!-- Title Area -->
    <div style="max-width: 1200px; margin: 20px auto 0; padding: 0 20px;">
        <span style="font-size: 12px; color: #a31d24; text-transform: uppercase; font-weight: 600;">Pizza Sauce</span>
        <h1 style="font-size: 32px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #a31d24; text-transform: uppercase; margin-top: 5px;">Marinara Sauce</h1>
    </div>

    <div class="detail-layout">
        <!-- Left Side: Images -->
        <div class="detail-left">
            <div class="main-img-box">
                <div style="color: #a4977a;">Main Product Image (e.g. Jar)</div>
            </div>
            <div class="thumbnail-row">
                <div class="thumbnail-box"><div style="font-size: 10px; color: #a4977a;">Thumb 1</div></div>
                <div class="thumbnail-box"><div style="font-size: 10px; color: #a4977a;">Thumb 2</div></div>
                <div class="thumbnail-box"><div style="font-size: 10px; color: #a4977a;">Thumb 3</div></div>
                <div class="thumbnail-box"><div style="font-size: 10px; color: #a4977a;">Thumb 4</div></div>
            </div>

            <!-- Accordion Details -->
            <div class="accordion">
                <div class="accordion-item">
                    <div class="accordion-title">More Details</div>
                    <div style="font-size: 13px; color: #555; padding-top: 10px;">
                        This package contains 24 oz of product.<br>
                        • It is designed to provide approximately 5 Servings Per Container.<br>
                        • Each serving size is 0.5 Cup (125g).
                    </div>
                </div>
                <div class="accordion-item"><div class="accordion-title">Ingredients</div></div>
                <div class="accordion-item"><div class="accordion-title">Nutrition Facts</div></div>
                <div class="accordion-item"><div class="accordion-title">Instructions / Storage</div></div>
            </div>
        </div>

        <!-- Right Side: Buying Options -->
        <div class="detail-right">
            <div class="store-list">
                <div class="store-list-header">
                    <div>Online</div>
                    <div style="background: #fbfaf6; color: #a31d24;">In Store</div>
                </div>
                
                <div class="store-item">
                    <div class="store-logo">Walmart</div>
                    <button class="btn-buy">Buy</button>
                </div>
                <div class="store-item">
                    <div class="store-logo" style="color: #ff9900;">amazon</div>
                    <button class="btn-buy">Buy</button>
                </div>
                <div class="store-item">
                    <div class="store-logo" style="color: #cc0000;">TARGET</div>
                    <button class="btn-buy">Buy</button>
                </div>
                <div style="text-align: center; padding: 10px; font-size: 12px; color: #a31d24; cursor: pointer;">
                    See More <i class="fa-solid fa-angle-down"></i>
                </div>
            </div>

            <a href="#" class="buy-direct">Buy Direct on Goldbelly</a>

            <!-- Description Text -->
            <div style="margin-top: 30px; font-size: 14px; line-height: 1.6; color: #444;">
                <p>Discover our Marinara Sauce, slow cooked with sweet Italian plum tomatoes and fresh ingredients, like garlic, onion and basil.</p>
                <p>Crafted with the finest whole-peeled tomatoes, picked at their peak ripeness, this premium tomato sauce delivers a vibrant, bright tomato taste with every bite. Made with no added sugar and no artificial colors, our sauce is all natural and sets the standard for restaurant-quality from the comfort of your home.</p>
            </div>
        </div>
    </div>

</main>
${fixedFooter}`;

fs.writeFileSync('products/index.html', catalogHtml);
fs.writeFileSync('products/detail.html', detailHtml);

console.log("Pages generated successfully!");
