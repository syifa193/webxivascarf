/**
 * XivaScarf Admin Dashboard Analytics & Chart.js Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const adminDashboardView = document.getElementById('admin-dashboard-view');
  if (adminDashboardView) {
    initAdminDashboard();
  }
});

function initAdminDashboard() {
  const products = DBStore.getCollection(DBStore.KEYS.PRODUK);
  const users = DBStore.getCollection(DBStore.KEYS.USERS);
  const orders = DBStore.getCollection(DBStore.KEYS.PESANAN);

  // 1. Calculate KPI Metrics
  const totalProduk = products.length;
  const totalPelanggan = users.filter(u => u.role === 'user').length;
  const totalPesanan = orders.length;

  const totalPenjualan = orders.reduce((sum, order) => {
    return sum + (order.status !== 'Dibatalkan' ? order.total : 0);
  }, 0);

  // Render KPI values
  if (document.getElementById('stat-total-produk')) document.getElementById('stat-total-produk').textContent = totalProduk;
  if (document.getElementById('stat-total-pelanggan')) document.getElementById('stat-total-pelanggan').textContent = totalPelanggan;
  if (document.getElementById('stat-total-pesanan')) document.getElementById('stat-total-pesanan').textContent = totalPesanan;
  if (document.getElementById('stat-total-penjualan')) document.getElementById('stat-total-penjualan').textContent = ProductModule.formatRupiah(totalPenjualan);

  // 2. Render Recent Orders Table
  renderRecentOrders(orders);

  // 3. Render Sales Charts using Chart.js if available
  if (typeof Chart !== 'undefined') {
    initMonthlySalesChart(orders);
    initTopProductsChart(products);
    initTopCategoriesChart(products);
  }
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById('dashboard-recent-orders-body');
  if (!tbody) return;

  const recent = orders.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-3 text-muted">Belum ada pesanan terbaru.</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(o => `
    <tr>
      <td><strong>${o.idPesanan}</strong></td>
      <td>${o.namaPenerima}</td>
      <td><small>${o.tanggal}</small></td>
      <td class="fw-bold">${ProductModule.formatRupiah(o.total)}</td>
      <td><span class="badge-status ${getStatusBadgeClass(o.status)}">${o.status}</span></td>
    </tr>
  `).join('');
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Menunggu Pembayaran': return 'badge-pending';
    case 'Diproses': return 'badge-processing';
    case 'Dikirim': return 'badge-shipped';
    case 'Selesai': return 'badge-completed';
    default: return 'badge-cancelled';
  }
}

function initMonthlySalesChart(orders) {
  const ctx = document.getElementById('chartMonthlySales');
  if (!ctx) return;

  // Generate monthly data labels for past 6 months
  const monthLabels = ['Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
  const salesData = [1250000, 2100000, 1850000, 3200000, 2900000, 3850000];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [{
        label: 'Penjualan (Rp)',
        data: salesData,
        borderColor: '#8B5E83',
        backgroundColor: 'rgba(139, 94, 131, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8B5E83',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'Rp ' + (value / 1000) + 'k';
            }
          }
        }
      }
    }
  });
}

function initTopProductsChart(products) {
  const ctx = document.getElementById('chartTopProducts');
  if (!ctx) return;

  const sorted = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5);
  const labels = sorted.map(p => p.nama);
  const data = sorted.map(p => p.soldCount || 0);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#8B5E83', '#D4A373', '#F8EDEB', '#734b6b', '#c49261']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function initTopCategoriesChart(products) {
  const ctx = document.getElementById('chartTopCategories');
  if (!ctx) return;

  const categoryMap = {};
  products.forEach(p => {
    categoryMap[p.kategori] = (categoryMap[p.kategori] || 0) + (p.soldCount || 10);
  });

  const labels = Object.keys(categoryMap);
  const data = Object.values(categoryMap);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Terjual (Pcs)',
        data: data,
        backgroundColor: '#D4A373',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}
