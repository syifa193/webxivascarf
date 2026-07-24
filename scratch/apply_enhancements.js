const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update user/dashboard.html category links
const userDashboardPath = path.join(rootDir, 'user', 'dashboard.html');
let userDashboardHtml = fs.readFileSync(userDashboardPath, 'utf8');
userDashboardHtml = userDashboardHtml.replace(
  /<a href="home\.html" class="card card-xiva text-center p-3 text-decoration-none h-100">/,
  `<a href="home.html?category=\${encodeURIComponent(c.namaKategori)}" class="card card-xiva text-center p-3 text-decoration-none h-100">`
);
fs.writeFileSync(userDashboardPath, userDashboardHtml, 'utf8');
console.log('Updated user/dashboard.html category links!');

// 2. Update user/detail-produk.html navbar and add related products section
const detailPath = path.join(rootDir, 'user', 'detail-produk.html');
let detailHtml = fs.readFileSync(detailPath, 'utf8');

const updatedDetailNav = `  <!-- Navigation Bar -->
  <nav class="navbar navbar-expand-lg navbar-xiva sticky-top">
    <div class="container">
      <a class="navbar-brand" href="home.html">
        <i class="bi bi-heart-pulse-fill text-primary" style="color: var(--primary) !important;"></i>
        <span>XivaScarf</span>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navDetailContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navDetailContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="home.html">Katalog Jilbab</a></li>
          <li class="nav-item"><a class="nav-link" href="riwayat.html">Riwayat Pembelian</a></li>
          <li class="nav-item"><a class="nav-link" href="wishlist.html">Wishlist</a></li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <a href="keranjang.html" class="btn btn-xiva-secondary position-relative me-2">
            <i class="bi bi-cart3"></i> Keranjang
            <span id="cart-badge-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
          </a>

          <div class="dropdown">
            <button class="btn btn-xiva-outline dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle me-1"></i> <span class="user-display-name">Pelanggan</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow">
              <li><a class="dropdown-item" href="profil.html"><i class="bi bi-person me-2"></i> Profil Saya</a></li>
              <li><a class="dropdown-item" href="riwayat.html"><i class="bi bi-bag-check me-2"></i> Riwayat Pesanan</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger btn-logout" href="#"><i class="bi bi-box-arrow-right me-2"></i> Keluar</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>`;

detailHtml = detailHtml.replace(/<!-- Navigation Bar -->[\s\S]*?<\/nav>/, updatedDetailNav);

// Add related products container to detail-produk.html before footer
const relatedSection = `
    <!-- Related Products Section -->
    <div class="mt-5 pt-4 border-top">
      <h4 class="brand-font fw-bold mb-4"><i class="bi bi-grid-3x3-gap-fill text-primary me-2"></i>Rekomendasi Jilbab Lainnya</h4>
      <div id="related-products-grid" class="row">
        <!-- Rendered dynamically -->
      </div>
    </div>
  </div>`;

detailHtml = detailHtml.replace(/<\/div>\s*<footer class="footer-xiva mt-5">/, `${relatedSection}\n\n  <footer class="footer-xiva mt-5">`);

fs.writeFileSync(detailPath, detailHtml, 'utf8');
console.log('Updated user/detail-produk.html navbar and related products section!');

// 3. Update admin/pesanan.html - Add Order Invoice Modal & Detail Button
const adminPesananPath = path.join(rootDir, 'admin', 'pesanan.html');
let adminPesananHtml = fs.readFileSync(adminPesananPath, 'utf8');

// Update Table headers
adminPesananHtml = adminPesananHtml.replace(/<th>Ubah Status<\/th>/, '<th>Ubah Status</th>\n                <th>Aksi</th>');

// Add Invoice Modal before end of body
const adminInvoiceModal = `
  <!-- Order Invoice Modal for Admin -->
  <div class="modal fade" id="adminInvoiceModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title brand-font fw-bold">Detail & Rincian Pesanan</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4" id="admin-invoice-modal-body">
          <!-- Rendered dynamically -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
          <button type="button" class="btn btn-xiva-primary" onclick="window.print()"><i class="bi bi-printer me-1"></i> Cetak Bukti</button>
        </div>
      </div>
    </div>
  </div>`;

adminPesananHtml = adminPesananHtml.replace(/<\/main>/, `</main>\n${adminInvoiceModal}`);

// Update renderAdminPesananTable in admin/pesanan.html
const updatedAdminPesananScript = `    function renderAdminPesananTable() {
      const tbody = document.getElementById('admin-pesanan-table-body');
      const search = document.getElementById('search-pesanan').value.trim().toLowerCase();
      const statusFilter = document.getElementById('filter-status').value;

      let orders = DBStore.getCollection(DBStore.KEYS.PESANAN);

      if (search) {
        orders = orders.filter(o => o.idPesanan.toLowerCase().includes(search) || o.namaPenerima.toLowerCase().includes(search));
      }

      if (statusFilter !== 'Semua') {
        orders = orders.filter(o => o.status === statusFilter);
      }

      if (orders.length === 0) {
        tbody.innerHTML = \`<tr><td colspan="8" class="text-center py-4 text-muted">Tidak ada data pesanan.</td></tr>\`;
        return;
      }

      tbody.innerHTML = orders.map(o => \`
        <tr>
          <td><strong>\${o.idPesanan}</strong></td>
          <td><small class="text-muted">\${o.tanggal}</small></td>
          <td>
            <strong>\${o.namaPenerima}</strong><br>
            <small class="text-muted"><i class="bi bi-geo-alt me-1"></i>\${o.alamat} (\${o.nohp})</small>
          </td>
          <td>
            <small class="d-block text-dark fw-semibold">
              \${(o.items || []).map(i => \`\${i.nama} (\${i.qty}x)\`).join('<br>')}
            </small>
          </td>
          <td class="fw-bold text-primary">\${ProductModule.formatRupiah(o.total)}</td>
          <td><span class="badge-status \${getStatusBadgeClass(o.status)}">\${o.status}</span></td>
          <td>
            <select class="form-select form-select-sm" onchange="updateOrderStatus('\${o.idPesanan}', this.value)">
              <option value="Menunggu Pembayaran" \${o.status === 'Menunggu Pembayaran' ? 'selected' : ''}>Menunggu Pembayaran</option>
              <option value="Diproses" \${o.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
              <option value="Dikirim" \${o.status === 'Dikirim' ? 'selected' : ''}>Dikirim</option>
              <option value="Selesai" \${o.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
              <option value="Dibatalkan" \${o.status === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
            </select>
          </td>
          <td>
            <button onclick="viewAdminInvoice('\${o.idPesanan}')" class="btn btn-outline-primary btn-sm" title="Lihat Faktur">
              <i class="bi bi-file-earmark-text"></i>
            </button>
          </td>
        </tr>
      \`).join('');
    }

    function viewAdminInvoice(idPesanan) {
      const orders = DBStore.getCollection(DBStore.KEYS.PESANAN);
      const o = orders.find(item => item.idPesanan === idPesanan);
      if (!o) return;

      const body = document.getElementById('admin-invoice-modal-body');
      body.innerHTML = \`
        <div class="d-flex justify-content-between mb-4">
          <div>
            <h4 class="brand-font fw-bold text-primary mb-1">XivaScarf Boutique</h4>
            <small class="text-muted">Bukti Faktur Transaksi Pelanggan</small>
          </div>
          <div class="text-end">
            <h6 class="fw-bold mb-0">FAKTUR PESANAN</h6>
            <small class="text-muted">\${o.idPesanan}</small><br>
            <small class="text-muted">Tanggal: \${o.tanggal}</small>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-6">
            <strong>Penerima:</strong>
            <p class="mb-0 text-muted">\${o.namaPenerima}<br>\${o.nohp}<br>\${o.alamat}</p>
          </div>
          <div class="col-6 text-end">
            <strong>Metode Pembayaran:</strong>
            <p class="mb-0 text-muted">\${o.metodePembayaran}<br>Status: <strong>\${o.status}</strong></p>
          </div>
        </div>

        <table class="table table-bordered align-middle mb-3">
          <thead class="table-light">
            <tr>
              <th>Item Jilbab</th>
              <th class="text-center">Jumlah</th>
              <th class="text-end">Harga Satuan</th>
              <th class="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            \${(o.items || []).map(i => \`
              <tr>
                <td>\${i.nama}</td>
                <td class="text-center">\${i.qty}</td>
                <td class="text-end">\${ProductModule.formatRupiah(i.harga)}</td>
                <td class="text-end fw-bold">\${ProductModule.formatRupiah(i.harga * i.qty)}</td>
              </tr>
            \`).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-end fw-bold">Total Pembayaran:</td>
              <td class="text-end fw-bold text-primary">\${ProductModule.formatRupiah(o.total)}</td>
            </tr>
          </tfoot>
        </table>
      \`;

      const modalEl = document.getElementById('adminInvoiceModal');
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }`;

adminPesananHtml = adminPesananHtml.replace(/function renderAdminPesananTable\(\) \{[\s\S]*?\}\s*function updateOrderStatus/, `${updatedAdminPesananScript}\n\n    function updateOrderStatus`);

fs.writeFileSync(adminPesananPath, adminPesananHtml, 'utf8');
console.log('Updated admin/pesanan.html with invoice modal and detail view!');

// 4. Update js/kategori.js - use bootstrap.Modal.getOrCreateInstance
const kategoriJsPath = path.join(rootDir, 'js', 'kategori.js');
let kategoriJs = fs.readFileSync(kategoriJsPath, 'utf8');
kategoriJs = kategoriJs.replace(/const modal = bootstrap\.Modal\.getInstance\(modalEl\) \|\| new bootstrap\.Modal\(modalEl\);/g, 'const modal = bootstrap.Modal.getOrCreateInstance(modalEl);');
kategoriJs = kategoriJs.replace(/const modal = new bootstrap\.Modal\(document\.getElementById\('kategoriModal'\)\);/g, "const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('kategoriModal'));");
fs.writeFileSync(kategoriJsPath, kategoriJs, 'utf8');
console.log('Updated js/kategori.js modal handling!');

console.log('All feature enhancements prepared successfully!');
