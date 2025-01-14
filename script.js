let allProducts = []; // Tüm ürünleri saklayacak dizi
let sepet = []; // Sepete eklenen ürünler
const h2_products = document.getElementById("products");
const urunContainer = document.getElementById('urun-kartlari');
const sepetListesi = document.getElementById('sepetListesi');
const sepetSayisi = document.getElementById('sepetSayisi');

// Rastgele ürünleri sayfa yüklendiğinde getir
document.addEventListener('DOMContentLoaded', function () {
    // Sepeti `localStorage`'dan al
    const storedSepet = localStorage.getItem('sepet');

    // Sepette ürün varsa sepet dizisine ekle
    if (storedSepet) {
        sepet = JSON.parse(storedSepet);
        sepetSayisi.innerText = sepet.reduce((acc, item) => acc + item.adet, 0); // Sepet ürün sayısını güncelle
        updateSepetListesi(); // Sepet içeriğini güncelle
    }

    // Ürünleri getir
    getRandomProducts();
});

// Rastgele ürünleri getir
function getRandomProducts() {
    const apiUrl = `https://dummyjson.com/products?limit=12`;
    urunContainer.innerHTML = '';
    allProducts = [];

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allProducts = data.products;
            displayProducts(allProducts);
        })
        .catch(error => console.log('API Hatası:', error));
}

// Kategoriye göre ürünleri getir
function getProducts(category) {
    const apiUrl = `https://dummyjson.com/products/category/${category}`;
    urunContainer.innerHTML = '';
    allProducts = [];

    // Kategori ismini h2'ye yaz ve sınıf ekle
    h2_products.innerHTML = `<h2 class="shared-header">${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}</h2>`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allProducts = data.products;
            displayProducts(allProducts);
        })
        .catch(error => console.log('API Hatası:', error));
}


// Ürünleri ekranda göster
function displayProducts(products) {
    urunContainer.innerHTML = '';
    products.forEach((urun, index) => {
        const delay = index * 0.8;

        // Varsayılan değerleri kontrol et
        const price = urun.price !== undefined ? urun.price : 0;
        const title = urun.title || 'No Title';
        const thumbnail = urun.thumbnail || 'default-image.jpg';

        urunContainer.innerHTML += `
        <div class="col-md-3 col-sm-6 col-xs-12 mb-4 d-flex justify-content-center">
            <div class="card h-100 product-cards" style="animation-delay: ${delay}s">
                <a href="product-detail.html?id=${urun.id}">
                    <img src="${thumbnail}" class="card-img-top" alt="${title}">
                </a>
                <div class="card-body">
                    <h5 class="card-title text-center">${title}</h5>
                    <p class="card-text text-center price-text">
                        ${price} USD
                    </p>
                    <button class="btn btn-shopping-cart mt-2" 
                        onclick="sepeteEkle(${urun.id}, '${title}', ${price}, '${thumbnail}')">Add to Cart</button>
                </div>
            </div>
        </div>
        `;
    });
}




function goToProductDetail(urunId) {
    window.location.href = `product_detail.html?id=${urunId}`;
}

function sepeteEkle(id, title, price, thumbnail) {
    const sepetUrun = sepet.find(item => item.id === id);

    if (sepetUrun) {
        sepetUrun.adet++; 
    } else {
        sepet.push({ id, title, price, thumbnail, adet: 1 }); 
    }

    localStorage.setItem('sepet', JSON.stringify(sepet));

    updateSepetSayisi();
    updateSepetListesi(); 

    alert(`${title} added to cart.`);
}

// Sepet ürün sayısını güncelle
function updateSepetSayisi() {
    if (sepetSayisi) {
        sepetSayisi.innerText = sepet.reduce((acc, item) => acc + item.adet, 0);
    }
}

// Sepeti görüntüle
function updateSepetListesi() {
    if (!sepetListesi) return;

    sepetListesi.innerHTML = '';
    let toplamFiyat = 0;

    sepet.forEach(item => {
        const urunToplamFiyat = item.price * item.adet;
        toplamFiyat += urunToplamFiyat;

        sepetListesi.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <img src="${item.thumbnail}" alt="${item.title}" style="width: 50px; height: auto; margin-right: 10px;">
                ${item.title} (${item.adet} adet)
                <span>${urunToplamFiyat.toFixed(2)} USD</span>
            </li>
        `;
    });

    // Sepet toplam fiyatını listeye ekle
    sepetListesi.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <strong>Total Price</strong>
            <strong>${toplamFiyat.toFixed(2)} USD</strong>
        </li>
    `;
}

// Sepeti temizle
function sepetiTemizle() {
    sepet = [];
    localStorage.removeItem('sepet');
    updateSepetSayisi();
    updateSepetListesi();
    alert('Shopping cart cleared!');
}

// Sepet modalını aç
function sepetiGoster() {
    updateSepetListesi(); // Sepet güncel olsun
    const sepetimModal = new bootstrap.Modal(document.getElementById('sepetimModal'));
    sepetimModal.show();
}

// "Sepetim" butonuna tıklayınca modal açılması
document.getElementById('sepetimButton').addEventListener('click', function () {
    const sepetimModal = new bootstrap.Modal(document.getElementById('sepetimModal'));
    sepetimModal.show();
});

// Temizleme butonuna olay dinleyici ekle
document.getElementById('temizleButton').addEventListener('click', sepetiTemizle);





