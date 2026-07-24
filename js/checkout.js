/**
 * XivaScarf Checkout Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    initCheckoutPage();
  }
});

function initCheckoutPage() {
  const user = AuthModule.getCurrentUser();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  // Pre-fill user profile info if available
  document.getElementById('namaPenerima').value = user.nama || '';
  document.getElementById('nohp').value = user.nohp || '';
  document.getElementById('alamat').value = user.alamat || '';

  // Render Checkout Summary items
  const cartItems = CartModule.getCart(user.uid);
  const products = ProductModule.getAll();
  const checkoutSummaryContainer = document.getElementById('checkout-summary-items');
  const summaryTotalEl = document.getElementById('checkout-total-price');

  if (cartItems.length === 0) {
    showToast('Keranjang Anda kosong! Mengalihkan ke halaman belanja...', 'danger');
    setTimeout(() => { window.location.href = 'home.html'; }, 1500);
    return;
  }

  let total = 0;

  if (checkoutSummaryContainer) {
    checkoutSummaryContainer.innerHTML = cartItems.map(item => {
      const prod = products.find(p => p.idProduk === item.produkId) || { nama: 'Produk', harga: 0 };
      const itemSub = prod.harga * item.jumlah;
      total += itemSub;
      return `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 class="my-0 text-dark" style="font-size:0.95rem;">${prod.nama}</h6>
            <small class="text-muted">${item.jumlah}x @ ${ProductModule.formatRupiah(prod.harga)}</small>
          </div>
          <span class="text-muted fw-bold">${ProductModule.formatRupiah(itemSub)}</span>
        </div>
      `;
    }).join('');
  }

  if (summaryTotalEl) {
    summaryTotalEl.textContent = ProductModule.formatRupiah(total);
  }

  // Payment Method Selection Dynamic Helper
  const paymentSelect = document.getElementById('metodePembayaran');
  const paymentInstructions = document.getElementById('payment-instructions');

  if (paymentSelect && paymentInstructions) {
    paymentSelect.addEventListener('change', () => {
      const method = paymentSelect.value;
      if (method === 'Transfer Bank BCA') {
        paymentInstructions.innerHTML = `
          <div class="alert alert-info">
            <strong>Nomor Rekening BCA:</strong> 8830-1928-4491 a/n XivaScarf Boutique<br>
            <small>Harap sertakan ID Pesanan pada berita transfer.</small>
          </div>
        `;
      } else if (method === 'ShopeePay' || method === 'GoPay' || method === 'OVO') {
        paymentInstructions.innerHTML = `
          <div class="alert alert-info">
            <strong>E-Wallet (${method}):</strong> 0812-3456-7890 a/n XivaScarf Official<br>
            <small>Silakan scan QRIS atau bayar ke nomor di atas.</small>
          </div>
        `;
      } else if (method === 'COD') {
        paymentInstructions.innerHTML = `
          <div class="alert alert-warning">
            <strong>Cash On Delivery (COD):</strong> Bayar langsung tunai kepada kurir saat pesanan tiba di alamat Anda.
          </div>
        `;
      } else {
        paymentInstructions.innerHTML = '';
      }
    });
    paymentSelect.dispatchEvent(new Event('change'));
  }

  // Handle Form Submit
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const orderData = {
      idPesanan: 'ORD-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000),
      uid: user.uid,
      namaPenerima: document.getElementById('namaPenerima').value.trim(),
      nohp: document.getElementById('nohp').value.trim(),
      alamat: document.getElementById('alamat').value.trim(),
      metodePembayaran: document.getElementById('metodePembayaran').value,
      catatan: document.getElementById('catatan').value.trim(),
      total: total,
      status: 'Menunggu Pembayaran',
      tanggal: new Date().toISOString().split('T')[0],
      items: cartItems.map(item => {
        const prod = products.find(p => p.idProduk === item.produkId);
        return {
          idProduk: item.produkId,
          nama: prod ? prod.nama : 'Produk',
          qty: item.jumlah,
          harga: prod ? prod.harga : 0
        };
      })
    };

    // Save order
    const orders = DBStore.getCollection(DBStore.KEYS.PESANAN);
    orders.unshift(orderData);
    DBStore.setCollection(DBStore.KEYS.PESANAN, orders);

    // Save order details to detailPesanan collection
    const detailOrders = DBStore.getCollection(DBStore.KEYS.DETAIL_PESANAN);
    orderData.items.forEach(item => {
      detailOrders.push({
        idDetail: DBStore.generateId('dtl'),
        pesananId: orderData.idPesanan,
        produkId: item.idProduk,
        qty: item.qty,
        harga: item.harga
      });
    });
    DBStore.setCollection(DBStore.KEYS.DETAIL_PESANAN, detailOrders);

    // Update product soldCount & stock
    const allProducts = ProductModule.getAll();
    orderData.items.forEach(orderItem => {
      const pIndex = allProducts.findIndex(p => p.idProduk === orderItem.idProduk);
      if (pIndex !== -1) {
        allProducts[pIndex].stok = Math.max(0, allProducts[pIndex].stok - orderItem.qty);
        allProducts[pIndex].soldCount = (allProducts[pIndex].soldCount || 0) + orderItem.qty;
      }
    });
    DBStore.setCollection(DBStore.KEYS.PRODUK, allProducts);

    // Clear cart
    CartModule.clearCart(user.uid);

    showToast('Pesanan berhasil dibuat!', 'success');
    setTimeout(() => {
      window.location.href = 'riwayat.html';
    }, 1200);
  });
}
