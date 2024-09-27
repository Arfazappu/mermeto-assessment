
document.addEventListener('DOMContentLoaded', () => {

    const categoryButtons = document.querySelectorAll('.category-btn');
    const productList = document.querySelector('.product-list');
    
    //by default fetching hte mens product
    fetchProduct('Men');

    categoryButtons.forEach( button => {
        button.addEventListener( 'click', (e)=>{

            categoryButtons.forEach( btn => btn.classList.remove('active-category'));

            e.target.closest('button').classList.add('active-category');

            const currentCategory = e.target.getAttribute('data-category');
            
            fetchProduct(currentCategory); 
        })
    })



function fetchProduct(category){

    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
    .then( response => response.json())
    .then( data => {
        // console.log(data);

        const categoryData = data.categories.find( itemCategory => itemCategory.category_name == category);

        if(!categoryData){
            productList.innerHTML = '<p>No category matched.</p>'
            return;
        }

        const categoryProducts = categoryData.category_products;

        productList.innerHTML = '';

        if(categoryProducts.length === 0){
            productList.innerHTML = '<p>No products found in the category.</p>'
            return;
        }

        categoryProducts.forEach( product => {
            const productCard = createProductCard(product)

            productList.appendChild(productCard);
        })


        // console.log(categoryData)

    })
    .catch( error => {
        console.error('Error:', error);
        productList.innerHTML = '<p>Error loading products, Please try again.</p>'
    })
}

function createProductCard(product){

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
            <div class="image-cont">
                <img src=${product.image} alt=${product.title} class="prod-img">
                ${product.badge_text ? `<span class="badge">${product.badge_text}</span>` : '' }
                
            </div>
            <div class="prod-detail">
                <div class="prod-title-cont">
                    <span class="prod-title">${product.title}</span>
                    <li></li>
                    <span class="prod-vendor">${product.vendor}</span>
                </div>
                <div class="prod-price-cont">
                    <span class="prod-price">Rs ${product.price}</span>
                    <span class="compare-price">${product.compare_at_price}</span>
                    <span class="discount">${calculateDiscount(product.price, product.compare_at_price)}</span>
                </div>
                <div class="button-cont">
                    <button>Add to Cart</button>
                </div>
            </div>
        `;

        return productCard;
            
}


function calculateDiscount(price, comparePrice){
    const discount = Math.round(((comparePrice - price) / comparePrice) * 100);

    return `${discount}% Off`;
}

})