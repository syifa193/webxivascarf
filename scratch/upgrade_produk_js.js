const fs = require('fs');
const path = require('path');

const produkJsPath = path.join(__dirname, '..', 'js', 'produk.js');
let content = fs.readFileSync(produkJsPath, 'utf8');

const updatedJs = `/**
 * XivaScarf Product Management & Catalog Controller
 */

let currentCustomerSearchQuery = '';
let currentCustomerCategoryFilter = 'All';
let currentCustomerSortBy = 'popular';

const ProductModule = {
  getAll() {
    return DBStore.getCollection(DBStore.KEYS.PRODUK);
  },

  getById(id) {
    const products = this.getAll();
    return products.find(p => p.idProduk === id);
  },

  save(productData) {
    const products = this.getAll();
    if (productData.idProduk) {
      // Update
      const index = products.findIndex(p => p.idProduk === productData.idProduk);
      if (index !== -1) {
        products[index] = { ...products[index], ...productData };
      }
    } else {
      // Create
      productData.idProduk = DBStore.generateId('prod');
      productData.soldCount = 0;
      productData.createdAt = new Date().toISOString();
      products.push(productData);
    }
    DBStore.setCollection(DBStore.KEYS.PRODUK, products);
    return productData;
  },

  delete(id) {
    let products = this.getAll();
    products = products.filter(p => p.idProduk !== id);
    DBStore.setCollection(DBStore.KEYS.PRODUK, products);
  },

  formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }
};

// Auto-run view handlers based on page elements
document.addEventListener('DOMContentLoaded', () => {
  // 1. Customer Home Product Grid Controller
  const productGrid = document.getElementById('customer-product-grid');
  if (productGrid) {
    // Parse URL category parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      currentCustomerCategoryFilter = catParam;
    }

    // Category filter buttons
    const categoryContainer = document.getElementById('category-pills-container');
    if (categoryContainer) {
      renderCategoryPills(categoryContainer);
    }

    // Search bar
    const searchInput = document.getElementById('search-product-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        currentCustomerSearchQuery = searchInput.value.trim();
        renderCustomerProductGrid();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-product-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentCustomerSortBy = sortSelect.value;
        renderCustomerProductGrid();
      });
    }

    renderCustomerProductGrid();
  }

  // 2. Admin Product List Table Controller
  const adminProductTable = document.getElementById('admin-product-table-body');
  if (adminProductTable) {
    renderAdminProductTable();

    const searchAdmin = document.getElementById('admin-product-search');
    if (searchAdmin) {
      searchAdmin.addEventListener('input', () => {
        renderAdminProductTable(searchAdmin.value.trim());
      });
    }
  }

  // 3. Admin Add/Edit Product Form Handler
  const productForm = document.getElementById('product-form');
  if (productForm) {
    initProductForm(productForm);
  }

  // 4. Product Detail View Handler
  const detailContainer = document.getElementById('product-detail-view');
  if (detailContainer) {
    initProductDetailView(detailContainer);
  }
});

function renderCustomerProductGrid() {
  const container = document.getElementById('customer-product-grid');
  if (!container) return;

  let products = ProductModule.getAll();

  // 1. Category Filter
  if (currentCustomerCategoryFilter && currentCustomerCategoryFilter !== 'All') {
    products = products.filter(p => p.kategori.toLowerCase() === currentCustomerCategoryFilter.toLowerCase());
  }

  // 2. Search Query
  if (currentCustomerSearchQuery) {
    const q = currentCustomerSearchQuery.toLowerCase();
    products = products.filter(p => 
      p.nama.toLowerCase().includes(q) || 
      p.kategori.toLowerCase().includes(q) || 
      (p.deskripsi && p.deskripsi.toLowerCase().includes(q)) ||
      (p.warna && p.warna.toLowerCase().includes(q))
    );
  }

  // 3. Sorting Logic
  if (currentCustomerSortBy === 'price-low') {
    products.sort((a, b) => a.harga - b.harga);
  } else if (currentCustomerSortBy === 'price-high') {
    products.sort((a, b) => b.harga - a.harga);
  } else if (currentCustomerSortBy === 'newest') {
    products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else {
    // Default 'popular'
    products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
  }

  if (products.length === 0) {
    container.innerHTML = \`
      <div class="col-12 text-center py-5">
        <i class="bi bi-box-seam text-muted display-1"></i>
        <h5 class="mt-3 text-muted">Tidak ada produk jilbab ditemukan</h5>
        <p class="text-muted">Coba ubah kata kunci pencarian atau kategori Anda.</p>
      </div>
    \`;
    return;
  }

  container.innerHTML = products.map(p => \`
    <div class="col-6 col-md-4 col-lg-3 mb-4">
      <div class="card card-xiva product-card">
        <div class="img-wrapper">
          <img src="\${p.gambar}" alt="\${p.nama}">
          <span class="badge badge-xiva-primary position-absolute top-0 start-0 m-2 font-weight-normal">\${p.kategori}</span>
        </div>
        <div class="card-body">
          <a href="detail-produk.html?id=\${p.idProduk}" class="product-title" title="\${p.nama}">\${p.nama}</a>
          <div class="product-price">\${ProductModule.formatRupiah(p.harga)}</div>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <small class="text-muted"><i class="bi bi-box-seam me-1"></i>Stok \${p.stok}</small>
            <small class="text-muted"><i class="bi bi-bag-check me-1"></i>Terjual \${p.soldCount || 0}</small>
          </div>
          <div class="d-grid gap-2 mt-3">
            <a href="detail-produk.html?id=\${p.idProduk}" class="btn btn-xiva-outline btn-sm">
              <i class="bi bi-eye me-1"></i> Lihat Detail
            </a>
          </div>
        </div>
      </div>
    </div>
  \`).join('');
}

function renderCategoryPills(container) {
  const categories = DBStore.getCollection(DBStore.KEYS.KATEGORI);
  const isAllActive = currentCustomerCategoryFilter === 'All';

  container.innerHTML = \`
    <span class="category-pill \${isAllActive ? 'active' : ''}" onclick="filterCategory(this, 'All')">
      <i class="bi bi-grid-fill me-1"></i> Semua Kategori
    </span>
    \${categories.map(c => {
      const isActive = currentCustomerCategoryFilter.toLowerCase() === c.namaKategori.toLowerCase();
      return \`
        <span class="category-pill \${isActive ? 'active' : ''}" onclick="filterCategory(this, '\${c.namaKategori}')">
          <i class="bi \${c.icon || 'bi-tag'} me-1"></i> \${c.namaKategori}
        </span>
      \`;
    }).join('')}
  \`;
}

function filterCategory(element, categoryName) {
  document.querySelectorAll('.category-pill').forEach(pill => pill.classList.remove('active'));
  element.classList.add('active');
  currentCustomerCategoryFilter = categoryName;
  renderCustomerProductGrid();
}

function renderAdminProductTable(searchQuery = '') {
  const tbody = document.getElementById('admin-product-table-body');
  if (!tbody) return;

  let products = ProductModule.getAll();
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter(p => p.nama.toLowerCase().includes(q) || p.kategori.toLowerCase().includes(q));
  }

  if (products.length === 0) {
    tbody.innerHTML = \`<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada data produk.</td></tr>\`;
    return;
  }

  tbody.innerHTML = products.map((p, index) => \`
    <tr>
      <td>\${index + 1}</td>
      <td>
        <img src="\${p.gambar}" class="rounded" width="48" height="48" style="object-fit:cover;">
      </td>
      <td>
        <strong class="d-block">\${p.nama}</strong>
        <small class="text-muted">Warna: \${p.warna || '-'}</small>
      </td>
      <td><span class="badge badge-xiva-primary">\${p.kategori}</span></td>
      <td class="fw-bold text-dark">\${ProductModule.formatRupiah(p.harga)}</td>
      <td>
        <span class="badge \${p.stok > 10 ? 'bg-success' : p.stok > 0 ? 'bg-warning text-dark' : 'bg-danger'}">
          \${p.stok} pcs
        </span>
      </td>
      <td>
        <div class="btn-group btn-group-sm">
          <a href="edit-produk.html?id=\${p.idProduk}" class="btn btn-outline-primary" title="Edit">
            <i class="bi bi-pencil"></i>
          </a>
          <button onclick="confirmDeleteProduct('\${p.idProduk}', '\${p.nama}')" class="btn btn-outline-danger" title="Hapus">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  \`).join('');
}

function confirmDeleteProduct(id, name) {
  if (confirm(\`Apakah Anda yakin ingin menghapus produk "\${name}"?\`)) {
    ProductModule.delete(id);
    showToast(\`Produk "\${name}" berhasil dihapus.\`, 'success');
    renderAdminProductTable();
  }
}

function initProductForm(form) {
  // Populate category select options
  const categorySelect = document.getElementById('kategori');
  if (categorySelect) {
    const categories = DBStore.getCollection(DBStore.KEYS.KATEGORI);
    categorySelect.innerHTML = \`<option value="">-- Pilih Kategori --</option>\` +
      categories.map(c => \`<option value="\${c.namaKategori}">\${c.namaKategori}</option>\`).join('');
  }

  // Check if edit mode
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  if (editId) {
    const existing = ProductModule.getById(editId);
    if (existing) {
      document.getElementById('idProduk').value = existing.idProduk;
      document.getElementById('nama').value = existing.nama;
      document.getElementById('kategori').value = existing.kategori;
      document.getElementById('harga').value = existing.harga;
      document.getElementById('stok').value = existing.stok;
      document.getElementById('warna').value = existing.warna || '';
      document.getElementById('ukuran').value = existing.ukuran || '';
      document.getElementById('deskripsi').value = existing.deskripsi || '';
      document.getElementById('gambar-url').value = existing.gambar || '';
      if (document.getElementById('img-preview')) {
        document.getElementById('img-preview').src = existing.gambar;
      }
    }
  }

  // Image preview listener
  const imgUrlInput = document.getElementById('gambar-url');
  const imgFileInput = document.getElementById('gambar-file');
  const imgPreview = document.getElementById('img-preview');

  if (imgUrlInput && imgPreview) {
    imgUrlInput.addEventListener('input', () => {
      if (imgUrlInput.value.trim()) {
        imgPreview.src = imgUrlInput.value.trim();
      }
    });
  }

  if (imgFileInput && imgPreview) {
    imgFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          imgPreview.src = evt.target.result;
          if (imgUrlInput) imgUrlInput.value = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const productData = {
      idProduk: document.getElementById('idProduk') ? document.getElementById('idProduk').value : null,
      nama: document.getElementById('nama').value.trim(),
      kategori: document.getElementById('kategori').value,
      harga: parseFloat(document.getElementById('harga').value),
      stok: parseInt(document.getElementById('stok').value),
      warna: document.getElementById('warna').value.trim(),
      ukuran: document.getElementById('ukuran').value.trim(),
      deskripsi: document.getElementById('deskripsi').value.trim(),
      gambar: (imgPreview && imgPreview.src) ? imgPreview.src : ''
    };

    ProductModule.save(productData);
    showToast('Data produk berhasil disimpan!', 'success');
    setTimeout(() => {
      window.location.href = 'produk.html';
    }, 1000);
  });
}

function initProductDetailView(container) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const product = ProductModule.getById(productId);

  if (!product) {
    container.innerHTML = \`
      <div class="col-12 text-center py-5">
        <h4>Produk tidak ditemukan.</h4>
        <a href="home.html" class="btn btn-xiva-primary mt-3">Kembali ke Katalog</a>
      </div>
    \`;
    return;
  }

  container.innerHTML = \`
    <div class="row align-items-center g-4">
      <div class="col-md-6">
        <div class="card card-xiva overflow-hidden p-2">
          <img src="\${product.gambar}" class="img-fluid rounded-3 w-100" style="max-height: 480px; object-fit: cover;" alt="\${product.nama}">
        </div>
      </div>
      <div class="col-md-6">
        <span class="badge badge-xiva-primary mb-2">\${product.kategori}</span>
        <h2 class="brand-font fw-bold text-dark mb-2">\${product.nama}</h2>
        <div class="display-6 fw-bold text-primary mb-3" style="color: var(--primary) !important;">
          \${ProductModule.formatRupiah(product.harga)}
        </div>

        <p class="text-muted mb-4">\${product.deskripsi}</p>

        <div class="row mb-3">
          <div class="col-6">
            <strong>Pilihan Warna:</strong>
            <p class="text-muted mb-0">\${product.warna || 'Sesuai gambar'}</p>
          </div>
          <div class="col-6">
            <strong>Ukuran:</strong>
            <p class="text-muted mb-0">\${product.ukuran || 'All Size'}</p>
          </div>
        </div>

        <div class="mb-4">
          <strong>Ketersediaan Stok:</strong>
          <span class="badge \${product.stok > 0 ? 'bg-success' : 'bg-danger'} ms-2">\${product.stok} Pcs Tersedia</span>
        </div>

        <div class="d-flex align-items-center gap-3 mb-4">
          <label class="fw-bold">Jumlah:</label>
          <div class="input-group" style="width: 130px;">
            <button class="btn btn-outline-secondary" onclick="adjustQty(-1)"><i class="bi bi-dash"></i></button>
            <input type="number" id="detail-qty" class="form-control text-center" value="1" min="1" max="\${product.stok}">
            <button class="btn btn-outline-secondary" onclick="adjustQty(1)"><i class="bi bi-plus"></i></button>
          </div>
        </div>

        <div class="d-flex gap-3">
          <button class="btn btn-xiva-primary btn-lg flex-grow-1" onclick="addToCartDetail('\${product.idProduk}')">
            <i class="bi bi-cart-plus me-2"></i> Tambah ke Keranjang
          </button>
          <button class="btn btn-xiva-secondary btn-lg" onclick="addToWishlistDetail('\${product.idProduk}')" title="Simpan ke Wishlist">
            <i class="bi bi-heart"></i>
          </button>
        </div>
      </div>
    </div>
  \`;

  // Render related products (same category or popular)
  renderRelatedProducts(product);
}

function renderRelatedProducts(currentProduct) {
  const relatedGrid = document.getElementById('related-products-grid');
  if (!relatedGrid) return;

  const allProducts = ProductModule.getAll();
  let related = allProducts.filter(p => p.idProduk !== currentProduct.idProduk && p.kategori === currentProduct.kategori);

  // If not enough in same category, pad with top products
  if (related.length < 4) {
    const extra = allProducts.filter(p => p.idProduk !== currentProduct.idProduk && !related.includes(p));
    related = [...related, ...extra].slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  relatedGrid.innerHTML = related.map(p => \`
    <div class="col-6 col-md-3 mb-3">
      <div class="card card-xiva product-card">
        <div class="img-wrapper">
          <img src="\${p.gambar}" alt="\${p.nama}">
          <span class="badge badge-xiva-primary position-absolute top-0 start-0 m-2">\${p.kategori}</span>
        </div>
        <div class="card-body">
          <a href="detail-produk.html?id=\${p.idProduk}" class="product-title">\${p.nama}</a>
          <div class="product-price">\${ProductModule.formatRupiah(p.harga)}</div>
          <div class="mt-auto">
            <a href="detail-produk.html?id=\${p.idProduk}" class="btn btn-xiva-outline btn-sm w-100">Lihat Detail</a>
          </div>
        </div>
      </div>
    </div>
  \`).join('');
}

function adjustQty(amount) {
  const qtyInput = document.getElementById('detail-qty');
  if (!qtyInput) return;
  let currentVal = parseInt(qtyInput.value) || 1;
  const maxVal = parseInt(qtyInput.getAttribute('max')) || 99;
  currentVal += amount;
  if (currentVal >= 1 && currentVal <= maxVal) {
    qtyInput.value = currentVal;
  }
}

function addToCartDetail(productId) {
  const user = AuthModule.getCurrentUser();
  if (!user) {
    showToast('Silakan login terlebih dahulu untuk belanja.', 'danger');
    setTimeout(() => { window.location.href = '../login.html'; }, 1200);
    return;
  }

  const qtyInput = document.getElementById('detail-qty');
  const qty = qtyInput ? parseInt(qtyInput.value) : 1;

  CartModule.addItem(user.uid, productId, qty);
  showToast('Produk berhasil ditambahkan ke keranjang!', 'success');
  updateCartBadge();
}

function addToWishlistDetail(productId) {
  const user = AuthModule.getCurrentUser();
  if (!user) {
    showToast('Silakan login terlebih dahulu.', 'danger');
    return;
  }
  const wishlist = DBStore.getCollection(DBStore.KEYS.WISHLIST);
  const exists = wishlist.find(w => w.uid === user.uid && w.produkId === productId);
  if (!exists) {
    wishlist.push({ idWishlist: DBStore.generateId('wish'), uid: user.uid, produkId: productId });
    DBStore.setCollection(DBStore.KEYS.WISHLIST, wishlist);
    showToast('Produk ditambahkan ke Wishlist Anda!', 'success');
  } else {
    showToast('Produk sudah ada di Wishlist Anda.', 'info');
  }
}
`;

fs.writeFileSync(produkJsPath, updatedJs, 'utf8');
console.log('Successfully upgraded js/produk.js!');
