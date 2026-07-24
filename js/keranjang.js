/**
 * XivaScarf Shopping Cart Controller
 */

const CartModule = {
  getCart(uid) {
    const allCart = DBStore.getCollection(DBStore.KEYS.KERANJANG);
    return allCart.filter(item => item.uid === uid);
  },

  addItem(uid, produkId, qty = 1) {
    const allCart = DBStore.getCollection(DBStore.KEYS.KERANJANG);
    const existingIndex = allCart.findIndex(item => item.uid === uid && item.produkId === produkId);

    if (existingIndex !== -1) {
      allCart[existingIndex].jumlah += qty;
    } else {
      allCart.push({
        idKeranjang: DBStore.generateId('cart'),
        uid: uid,
        produkId: produkId,
        jumlah: qty
      });
    }

    DBStore.setCollection(DBStore.KEYS.KERANJANG, allCart);
    updateCartBadge();
  },

  updateQty(idKeranjang, newQty) {
    let allCart = DBStore.getCollection(DBStore.KEYS.KERANJANG);
    if (newQty <= 0) {
      allCart = allCart.filter(item => item.idKeranjang !== idKeranjang);
    } else {
      const index = allCart.findIndex(item => item.idKeranjang === idKeranjang);
      if (index !== -1) {
        allCart[index].jumlah = newQty;
      }
    }
    DBStore.setCollection(DBStore.KEYS.KERANJANG, allCart);
    updateCartBadge();
  },

  removeItem(idKeranjang) {
    let allCart = DBStore.getCollection(DBStore.KEYS.KERANJANG);
    allCart = allCart.filter(item => item.idKeranjang !== idKeranjang);
    DBStore.setCollection(DBStore.KEYS.KERANJANG, allCart);
    updateCartBadge();
  },

  clearCart(uid) {
    let allCart = DBStore.getCollection(DBStore.KEYS.KERANJANG);
    allCart = allCart.filter(item => item.uid !== uid);
    DBStore.setCollection(DBStore.KEYS.KERANJANG, allCart);
    updateCartBadge();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.getElementById('cart-table-body');
  if (cartTableBody) {
    renderCartView();
  }
});

function renderCartView() {
  const user = AuthModule.getCurrentUser();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const cartItems = CartModule.getCart(user.uid);
  const products = ProductModule.getAll();
  const tbody = document.getElementById('cart-table-body');
  const summarySubtotal = document.getElementById('cart-subtotal');
  const summaryTotal = document.getElementById('cart-total');

  if (cartItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5">
          <i class="bi bi-cart-x display-1 text-muted"></i>
          <h5 class="mt-3 text-muted">Keranjang Belanja Anda Kosong</h5>
          <p class="text-muted">Ayo jelajahi koleksi jilbab cantik kami!</p>
          <a href="home.html" class="btn btn-xiva-primary">Mulai Belanja</a>
        </td>
      </tr>
    `;
    if (summarySubtotal) summarySubtotal.textContent = 'Rp 0';
    if (summaryTotal) summaryTotal.textContent = 'Rp 0';
    const checkoutBtn = document.getElementById('btn-proceed-checkout');
    if (checkoutBtn) checkoutBtn.classList.add('disabled');
    return;
  }

  let subtotal = 0;

  tbody.innerHTML = cartItems.map(item => {
    const prod = products.find(p => p.idProduk === item.produkId) || {
      nama: 'Produk Tidak Ditemukan',
      harga: 0,
      gambar: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22600%22%20height%3D%22600%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%238B5E83%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23D4A373%22%2F%3E%0A%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%3ClinearGradient%20id%3D%22silk%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%220%25%22%3E%0A%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFFFFF%22%20stop-opacity%3D%220.4%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23FFFFFF%22%20stop-opacity%3D%220.1%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23000000%22%20stop-opacity%3D%220.15%22%2F%3E%0A%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%3Cfilter%20id%3D%22shadow%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2212%22%20stdDeviation%3D%2216%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%220.2%22%2F%3E%0A%20%20%20%20%20%20%3C%2Ffilter%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url(%23bg)%22%2F%3E%0A%20%20%20%20%3C!--%20Decorative%20background%20patterns%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22300%22%20cy%3D%22250%22%20r%3D%22190%22%20fill%3D%22%23FFFFFF%22%20fill-opacity%3D%220.12%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22300%22%20cy%3D%22250%22%20r%3D%22150%22%20fill%3D%22%23FFFFFF%22%20fill-opacity%3D%220.15%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M%20120%20500%20Q%20300%20420%20480%20500%22%20stroke%3D%22%23F8EDEB%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20opacity%3D%220.4%22%2F%3E%0A%0A%20%20%20%20%3C!--%20Pashmina%20Hijab%20Drape%20Illustration%20--%3E%0A%20%20%20%20%3Cg%20filter%3D%22url(%23shadow)%22%3E%0A%20%20%20%20%20%20%3C!--%20Face%20Oval%20%2F%20Inner%20Ciput%20--%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20245%20160%20C%20245%20120%2C%20355%20120%2C%20355%20160%20C%20355%20210%2C%20245%20210%2C%20245%20160%20Z%22%20fill%3D%22%23F8EDEB%22%20opacity%3D%220.95%22%2F%3E%0A%20%20%20%20%20%20%3C!--%20Ciput%20Band%20--%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20252%20145%20Q%20300%20135%20348%20145%20Q%20350%20158%20300%20162%20Q%20250%20158%20252%20145%20Z%22%20fill%3D%22%23F8EDEB%22%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%3C!--%20Main%20Scarf%20Wrap%20Around%20Head%20--%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20230%20170%20C%20220%20110%2C%20380%20110%2C%20370%20170%20C%20375%20220%2C%20380%20280%2C%20370%20330%20C%20340%20370%2C%20260%20370%2C%20230%20330%20C%20220%20280%2C%20225%20220%2C%20230%20170%20Z%22%20fill%3D%22%238B5E83%22%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%3C!--%20Pashmina%20Left%20Flowing%20Tail%20--%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20235%20240%20C%20180%20270%2C%20150%20350%2C%20160%20440%20C%20190%20450%2C%20230%20430%2C%20245%20340%20Z%22%20fill%3D%22%238B5E83%22%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20235%20240%20C%20180%20270%2C%20150%20350%2C%20160%20440%20C%20190%20450%2C%20230%20430%2C%20245%20340%20Z%22%20fill%3D%22url(%23silk)%22%2F%3E%0A%0A%20%20%20%20%20%20%3C!--%20Pashmina%20Right%20Wrapped%20Layer%20--%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20365%20240%20C%20410%20270%2C%20430%20340%2C%20400%20420%20C%20360%20430%2C%20340%20380%2C%20345%20320%20Z%22%20fill%3D%22%238B5E83%22%20opacity%3D%220.9%22%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%3C!--%20Fold%20Lines%20%2F%20Folds%20--%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20250%20200%20Q%20300%20220%20350%20200%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20opacity%3D%220.6%22%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20240%20230%20Q%20300%20255%20360%20230%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20opacity%3D%220.5%22%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%20245%20260%20Q%20300%20285%20355%20260%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20opacity%3D%220.4%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%0A%20%20%20%20%3C!--%20Bottom%20Title%20Banner%20--%3E%0A%20%20%20%20%3Crect%20x%3D%2240%22%20y%3D%22475%22%20width%3D%22520%22%20height%3D%2285%22%20rx%3D%2218%22%20fill%3D%22%23FFFFFF%22%20fill-opacity%3D%220.92%22%20filter%3D%22url(%23shadow)%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22300%22%20y%3D%22515%22%20font-family%3D%22'Playfair%20Display'%2C%20Georgia%2C%20serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%23333333%22%20text-anchor%3D%22middle%22%3EPashmina%20Silk%20Rose%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22300%22%20y%3D%22542%22%20font-family%3D%22'Plus%20Jakarta%20Sans'%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%238B5E83%22%20text-anchor%3D%22middle%22%3E%E2%9C%A8%20Rose%20Gold%20%26%20Mauve%20%E2%80%A2%20PASHMINA%20COLLECTION%20%E2%9C%A8%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E'
    };

    const itemSubtotal = prod.harga * item.jumlah;
    subtotal += itemSubtotal;

    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${prod.gambar}" class="cart-item-img rounded" alt="${prod.nama}">
            <div>
              <h6 class="mb-1 text-dark">${prod.nama}</h6>
              <small class="text-muted">Kategori: ${prod.kategori || '-'}</small>
            </div>
          </div>
        </td>
        <td class="align-middle fw-bold">${ProductModule.formatRupiah(prod.harga)}</td>
        <td class="align-middle">
          <div class="input-group input-group-sm" style="width: 110px;">
            <button class="btn btn-outline-secondary" onclick="changeCartQty('${item.idKeranjang}', ${item.jumlah - 1})">-</button>
            <input type="text" class="form-control text-center bg-white" value="${item.jumlah}" readonly>
            <button class="btn btn-outline-secondary" onclick="changeCartQty('${item.idKeranjang}', ${item.jumlah + 1})">+</button>
          </div>
        </td>
        <td class="align-middle fw-bold text-primary">${ProductModule.formatRupiah(itemSubtotal)}</td>
        <td class="align-middle text-end">
          <button onclick="removeCartItem('${item.idKeranjang}')" class="btn btn-sm btn-outline-danger" title="Hapus">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (summarySubtotal) summarySubtotal.textContent = ProductModule.formatRupiah(subtotal);
  if (summaryTotal) summaryTotal.textContent = ProductModule.formatRupiah(subtotal);

  const checkoutBtn = document.getElementById('btn-proceed-checkout');
  if (checkoutBtn) checkoutBtn.classList.remove('disabled');
}

function changeCartQty(idKeranjang, newQty) {
  CartModule.updateQty(idKeranjang, newQty);
  renderCartView();
}

function removeCartItem(idKeranjang) {
  if (confirm('Hapus produk dari keranjang?')) {
    CartModule.removeItem(idKeranjang);
    showToast('Produk dihapus dari keranjang.', 'info');
    renderCartView();
  }
}
