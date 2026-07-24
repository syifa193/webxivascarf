/**
 * XivaScarf Sales Report & PDF / Excel Export Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const laporanTableBody = document.getElementById('laporan-table-body');
  if (laporanTableBody) {
    initLaporanPage();
  }
});

let currentFilteredOrders = [];

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Menunggu Pembayaran': return 'badge-pending';
    case 'Diproses': return 'badge-processing';
    case 'Dikirim': return 'badge-shipped';
    case 'Selesai': return 'badge-completed';
    default: return 'badge-cancelled';
  }
}

function initLaporanPage() {
  const filterBtn = document.getElementById('btn-filter-laporan');
  const exportPdfBtn = document.getElementById('btn-export-pdf');
  const exportExcelBtn = document.getElementById('btn-export-excel');

  // Initial load
  filterLaporan();

  if (filterBtn) {
    filterBtn.addEventListener('click', () => filterLaporan());
  }

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => exportToPDF());
  }

  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', () => exportToExcel());
  }
}

function filterLaporan() {
  const filterType = document.getElementById('filter-periode') ? document.getElementById('filter-periode').value : 'semua';
  const startDate = document.getElementById('filter-tgl-mulai') ? document.getElementById('filter-tgl-mulai').value : '';
  const endDate = document.getElementById('filter-tgl-selesai') ? document.getElementById('filter-tgl-selesai').value : '';

  let orders = DBStore.getCollection(DBStore.KEYS.PESANAN);

  if (filterType === 'harian') {
    const today = new Date().toISOString().split('T')[0];
    orders = orders.filter(o => o.tanggal === today);
  } else if (filterType === 'bulanan') {
    const currentMonth = new Date().toISOString().slice(0, 7);
    orders = orders.filter(o => o.tanggal.startsWith(currentMonth));
  } else if (filterType === 'tahunan') {
    const currentYear = new Date().getFullYear().toString();
    orders = orders.filter(o => o.tanggal.startsWith(currentYear));
  } else if (startDate && endDate) {
    orders = orders.filter(o => o.tanggal >= startDate && o.tanggal <= endDate);
  }

  currentFilteredOrders = orders;
  renderLaporanTable(orders);
}

function renderLaporanTable(orders) {
  const tbody = document.getElementById('laporan-table-body');
  const totalOmzetEl = document.getElementById('laporan-total-omzet');
  const totalTransaksiEl = document.getElementById('laporan-total-transaksi');

  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada transaksi ditemukan pada periode ini.</td></tr>`;
    if (totalOmzetEl) totalOmzetEl.textContent = 'Rp 0';
    if (totalTransaksiEl) totalTransaksiEl.textContent = '0 Transaksi';
    return;
  }

  let omzet = 0;

  tbody.innerHTML = orders.map((o, idx) => {
    omzet += o.total;
    const itemNames = (o.items || []).map(i => `${i.nama} (${i.qty}x)`).join(', ');

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${o.idPesanan}</strong></td>
        <td>${o.tanggal}</td>
        <td>${o.namaPenerima}</td>
        <td><small class="text-muted">${itemNames || 'Jilbab'}</small></td>
        <td class="fw-bold">${ProductModule.formatRupiah(o.total)}</td>
        <td><span class="badge-status ${getStatusBadgeClass(o.status)}">${o.status}</span></td>
      </tr>
    `;
  }).join('');

  if (totalOmzetEl) totalOmzetEl.textContent = ProductModule.formatRupiah(omzet);
  if (totalTransaksiEl) totalTransaksiEl.textContent = `${orders.length} Transaksi`;
}

function exportToPDF() {
  if (!currentFilteredOrders || currentFilteredOrders.length === 0) {
    showToast('Tidak ada data laporan untuk diekspor!', 'danger');
    return;
  }

  if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
    showToast('Library jsPDF sedang diisi...', 'info');
  }

  const { jsPDF } = window.jspdf || { jsPDF: window.jsPDF };
  const doc = new jsPDF();

  // Header Brand
  doc.setFontSize(18);
  doc.setTextColor(139, 94, 131); // #8B5E83
  doc.text('XivaScarf Boutique', 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text('Laporan Penjualan Jilbab', 14, 27);
  doc.setFontSize(9);
  doc.setTextColor(108, 117, 125);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')} | Total Transaksi: ${currentFilteredOrders.length}`, 14, 33);

  // Table Data Preparation
  const tableData = currentFilteredOrders.map((o, i) => [
    i + 1,
    o.idPesanan,
    o.tanggal,
    o.namaPenerima,
    ProductModule.formatRupiah(o.total),
    o.status
  ]);

  if (doc.autoTable) {
    doc.autoTable({
      startY: 38,
      head: [['No', 'ID Pesanan', 'Tanggal', 'Pelanggan', 'Total', 'Status']],
      body: tableData,
      headStyles: { fillColor: [139, 94, 131], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 237, 235] }
    });
  } else {
    // Fallback simple text rendering
    let y = 45;
    doc.setFontSize(10);
    tableData.forEach(row => {
      doc.text(`${row[0]}. ${row[1]} | ${row[2]} | ${row[3]} | ${row[4]} | ${row[5]}`, 14, y);
      y += 8;
    });
  }

  doc.save(`Laporan-Penjualan-XivaScarf-${new Date().toISOString().slice(0, 10)}.pdf`);
  showToast('Laporan PDF berhasil diunduh!', 'success');
}

function exportToExcel() {
  if (!currentFilteredOrders || currentFilteredOrders.length === 0) {
    showToast('Tidak ada data laporan untuk diekspor!', 'danger');
    return;
  }

  if (typeof XLSX === 'undefined') {
    showToast('Library SheetJS belum dimuat.', 'danger');
    return;
  }

  const excelData = currentFilteredOrders.map((o, idx) => ({
    No: idx + 1,
    'ID Pesanan': o.idPesanan,
    Tanggal: o.tanggal,
    'Nama Pelanggan': o.namaPenerima,
    'No HP': o.nohp || '-',
    'Metode Pembayaran': o.metodePembayaran,
    'Total Pembelian': o.total,
    Status: o.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Penjualan');

  XLSX.writeFile(workbook, `Laporan-Penjualan-XivaScarf-${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast('Laporan Excel berhasil diunduh!', 'success');
}
