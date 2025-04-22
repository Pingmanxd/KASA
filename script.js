// Sayfa içerikleri
const pages = {
    home: `
        <section class="hero">
            <div class="container">
                <h1>Valorant Point Kazan ve Harika Ödüller Aç!</h1>
                <p>Pingman34 & Edoro0 KAZANMANIZ DİLEĞİYLE</p>
                <a href="#" class="btn" data-page="cases">Kasaları Gör</a>
            </div>
        </section>
    `,
    
    cases: `
        <section class="cases-section">
            <div class="container">
                <h2>Kasalar</h2>
                <div class="cases-grid">
                    <div class="case-card" data-case="1">
                        <img src="case1.png" alt="Temel Kasa">
                        <h3>Temel Kasa</h3>
                        <p>50 VP - 1000 VP arası</p>
                        <button class="btn open-case">50 VP - Aç</button>
                    </div>
                    <div class="case-card" data-case="2">
                        <img src="case2.png" alt="Premium Kasa">
                        <h3>Premium Kasa</h3>
                        <p>200 VP - 5000 VP arası</p>
                        <button class="btn open-case">200 VP - Aç</button>
                    </div>
                    <div class="case-card" data-case="3">
                        <img src="case3.png" alt="Elit Kasa">
                        <h3>Elit Kasa</h3>
                        <p>500 VP - 10000 VP arası</p>
                        <button class="btn open-case">500 VP - Aç</button>
                    </div>
                </div>
            </div>
        </section>
    `,
    
    balance: `
        <section class="bakiye-section">
            <div class="container">
                <h2>Bakiye Yükle</h2>
                <div class="payment-methods">
                    <div class="method-card">
                        <i class="fab fa-cc-paypal"></i>
                        <h3>PayPal</h3>
                        <button class="btn payment-btn" data-method="paypal">Seç</button>
                    </div>
                    <div class="method-card">
                        <i class="fas fa-credit-card"></i>
                        <h3>Kredi Kartı</h3>
                        <button class="btn payment-btn" data-method="creditcard">Seç</button>
                    </div>
                    <div class="method-card">
                        <i class="fab fa-bitcoin"></i>
                        <h3>Crypto</h3>
                        <button class="btn payment-btn" data-method="crypto">Seç</button>
                    </div>
                </div>
                <div id="payment-form" class="payment-form"></div>
            </div>
        </section>
    `
};

// Uygulama durumu
const state = {
    balance: localStorage.getItem('valorantBalance') || 0
};

// DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Bakiye göster
    updateBalanceDisplay();
    
    // Ana sayfayı yükle
    loadPage('home');
    
    // Modal event listener'ları
    initModal();
    
    // Menü event listener'ları
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            loadPage(pageId);
        });
    });
    
    // Logo tıklanınca ana sayfaya dön
    document.querySelector('.logo').addEventListener('click', function(e) {
        e.preventDefault();
        loadPage('home');
    });
});

// Sayfa yükleme fonksiyonu
function loadPage(pageId) {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = pages[pageId] || pages.home;
    
    // Aktif menüyü güncelle
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
    
    // Sayfaya özel JS fonksiyonlarını çalıştır
    if(pageId === 'cases') initCases();
    if(pageId === 'balance') initBalance();
}

// Kasa fonksiyonları
function initCases() {
    document.querySelectorAll('.open-case').forEach(button => {
        button.addEventListener('click', function() {
            const caseType = this.parentElement.getAttribute('data-case');
            openCase(caseType);
            document.getElementById('caseModal').style.display = 'block';
        });
    });
}

function openCase(caseType) {
    const itemsContainer = document.querySelector('.items-container');
    const wonAmount = document.getElementById('wonAmount');
    
    let minVP, maxVP;
    switch(caseType) {
        case '1': minVP = 50; maxVP = 1000; break;
        case '2': minVP = 200; maxVP = 5000; break;
        case '3': minVP = 500; maxVP = 10000; break;
    }
    
    const wonVP = Math.floor(Math.random() * (maxVP - minVP + 1)) + minVP;
    
    // Animasyon için öğeler oluştur
    itemsContainer.innerHTML = '';
    for(let i = 0; i < 20; i++) {
        const randomVP = Math.floor(Math.random() * (maxVP - minVP + 1)) + minVP;
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = randomVP + ' VP';
        itemsContainer.appendChild(item);
    }
    
    // Animasyonu başlat
    setTimeout(() => {
        itemsContainer.style.left = '-2000px';
        wonAmount.textContent = wonVP + ' VP';
        document.getElementById('claimBtn').style.display = 'block';
    }, 100);
}

// Bakiye fonksiyonları
function initBalance() {
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            showPaymentForm(method);
        });
    });
}

function showPaymentForm(method) {
    const formContainer = document.getElementById('payment-form');
    formContainer.innerHTML = '';
    formContainer.classList.add('active');
    
    const amounts = [100, 250, 500, 1000, 2500, 5000];
    let formHTML = '';
    
    switch(method) {
        case 'paypal':
            formHTML = `
                <h3>PayPal ile Yükleme</h3>
                <div class="form-group">
                    <label>Yüklenecek Miktar (VP)</label>
                    <select id="amount">
                        ${amounts.map(amt => `<option value="${amt}">${amt} VP - $${(amt/50).toFixed(2)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>PayPal Email</label>
                    <input type="email" id="paypal-email" placeholder="email@example.com">
                </div>
                <button class="payment-submit">Ödemeyi Yap</button>
            `;
            break;
            
        case 'creditcard':
            formHTML = `
                <h3>Kredi Kartı ile Yükleme</h3>
                <div class="form-group">
                    <label>Yüklenecek Miktar (VP)</label>
                    <select id="amount">
                        ${amounts.map(amt => `<option value="${amt}">${amt} VP - $${(amt/50).toFixed(2)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Kart Numarası</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
                </div>
                <div class="form-group">
                    <label>Son Kullanma Tarihi</label>
                    <input type="text" id="card-expiry" placeholder="MM/YY">
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" id="card-cvv" placeholder="123">
                </div>
                <button class="payment-submit">Ödemeyi Yap</button>
            `;
            break;
            
        case 'crypto':
            formHTML = `
                <h3>Crypto ile Yükleme</h3>
                <div class="form-group">
                    <label>Yüklenecek Miktar (VP)</label>
                    <select id="amount">
                        ${amounts.map(amt => `<option value="${amt}">${amt} VP - ${(amt/50*0.0005).toFixed(6)} BTC</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Cüzdan Adresi</label>
                    <input type="text" id="crypto-address" placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa">
                </div>
                <button class="payment-submit">Ödemeyi Yap</button>
            `;
            break;
    }
    
    formContainer.innerHTML = formHTML;
    
    // Ödeme butonuna event listener ekle
    const submitBtn = formContainer.querySelector('.payment-submit');
    if(submitBtn) {
        submitBtn.addEventListener('click', function() {
            const amount = document.getElementById('amount').value;
            updateBalance(amount);
            alert(`${amount} VP başarıyla yüklendi!`);
            formContainer.classList.remove('active');
        });
    }
}

// Bakiye güncelleme fonksiyonları
function updateBalance(amount) {
    state.balance = parseInt(state.balance) + parseInt(amount);
    localStorage.setItem('valorantBalance', state.balance);
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    document.getElementById('balanceLink').textContent = `Bakiye: ${state.balance} VP`;
}

// Modal fonksiyonları
function initModal() {
    const modal = document.getElementById('caseModal');
    const closeBtn = document.querySelector('.close');
    const claimBtn = document.getElementById('claimBtn');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    claimBtn.addEventListener('click', function() {
        const wonAmount = document.getElementById('wonAmount').textContent;
        const vpAmount = parseInt(wonAmount);
        updateBalance(vpAmount);
        modal.style.display = 'none';
        alert(`Tebrikler! ${wonAmount} kazandınız!`);
    });
    
    window.addEventListener('click', function(e) {
        if(e.target === modal) {
            modal.style.display = 'none';
        }
    });
}