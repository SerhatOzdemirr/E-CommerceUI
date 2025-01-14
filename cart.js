let sepet = JSON.parse(localStorage.getItem('sepet')) || []; // Sepeti localStorage'dan yükle
const sepetSayisi = document.getElementById('sepetSayisi');
const sepetListesi = document.getElementById('sepetListesi');
const productDetailsContainer = document.getElementById('productDetails');

// Sayfa yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', function () {
    updateSepetSayisi();
    updateSepetListesi();

    // Ürün detaylarını yükle (URL'den ID al)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId); // Ürün detaylarını API'den getir
    }

    // Sepet modalı tetikleyicileri
    document.getElementById('sepetimButton')?.addEventListener('click', sepetiGoster);
    document.getElementById('temizleButton')?.addEventListener('click', sepetiTemizle);
});

// Ürün detaylarını getir
function fetchProductDetails(productId) {
    const apiUrl = `https://dummyjson.com/products/${productId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(product => {
            displayProductDetails(product); // Ürün detaylarını göster
        })
        .catch(error => console.error('API Error:', error));
}

// Ürün detaylarını göster
function displayProductDetails(product) {
    if (!productDetailsContainer) return;

    productDetailsContainer.innerHTML = `
        <div class="col-md-6">
            <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid">
        </div>
        <div class="col-md-6">
            <h2>${product.title}</h2>
            <p class="lead">${product.description}</p>
            <p><strong>Price:</strong> ${product.price} USD</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <button class="btn btn-primary btn-lg mt-3" onclick="sepeteEkle(${product.id}, '${product.title}', ${product.price}, '${product.thumbnail}')">Add to Cart</button>
        </div>
    `;
}

// Sepete ürün ekle
function sepeteEkle(id, title, price, thumbnail) {
    const sepetUrun = sepet.find(item => item.id === id);

    if (sepetUrun) {
        sepetUrun.adet++; // Ürün zaten varsa adetini artır
    } else {
        sepet.push({ id, title, price, thumbnail, adet: 1 }); // Yeni ürün ekle
    }

    // Sepeti localStorage'a kaydet
    localStorage.setItem('sepet', JSON.stringify(sepet));

    // Sepet bilgilerini güncelle
    updateSepetSayisi();
    alert(`${title} sepete eklendi.`);
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
