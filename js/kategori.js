/**
 * XivaScarf Category Management Controller
 */

const CategoryModule = {
  getAll() {
    return DBStore.getCollection(DBStore.KEYS.KATEGORI);
  },

  save(katData) {
    const categories = this.getAll();
    if (katData.idKategori) {
      const index = categories.findIndex(c => c.idKategori === katData.idKategori);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...katData };
      }
    } else {
      katData.idKategori = DBStore.generateId('kat');
      categories.push(katData);
    }
    DBStore.setCollection(DBStore.KEYS.KATEGORI, categories);
    return katData;
  },

  delete(id) {
    let categories = this.getAll();
    categories = categories.filter(c => c.idKategori !== id);
    DBStore.setCollection(DBStore.KEYS.KATEGORI, categories);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const adminKatTable = document.getElementById('admin-kategori-table-body');
  if (adminKatTable) {
    renderAdminKategoriTable();

    const searchInput = document.getElementById('search-kategori');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderAdminKategoriTable(searchInput.value.trim());
      });
    }

    const modalForm = document.getElementById('kategori-modal-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const katData = {
          idKategori: document.getElementById('kat-id').value || null,
          namaKategori: document.getElementById('kat-nama').value.trim(),
          description: document.getElementById('kat-desc').value.trim(),
          icon: document.getElementById('kat-icon').value.trim() || 'bi-tag'
        };
        CategoryModule.save(katData);
        showToast('Kategori berhasil disimpan!', 'success');
        
        // Close modal safely
        const modalEl = document.getElementById('kategoriModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
        
        renderAdminKategoriTable();
      });
    }
  }
});

function renderAdminKategoriTable(query = '') {
  const tbody = document.getElementById('admin-kategori-table-body');
  if (!tbody) return;

  let categories = CategoryModule.getAll();
  if (query) {
    categories = categories.filter(c => c.namaKategori.toLowerCase().includes(query.toLowerCase()));
  }

  if (categories.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">Belum ada kategori.</td></tr>`;
    return;
  }

  tbody.innerHTML = categories.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>
        <i class="bi ${c.icon || 'bi-tag'} fs-5 me-2 text-primary"></i>
        <strong>${c.namaKategori}</strong>
      </td>
      <td><small class="text-muted">${c.description || '-'}</small></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button onclick="editKategoriModal('${c.idKategori}')" class="btn btn-outline-primary" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button onclick="confirmDeleteKategori('${c.idKategori}', '${c.namaKategori}')" class="btn btn-outline-danger" title="Hapus">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddKategoriModal() {
  document.getElementById('kategori-modal-form').reset();
  document.getElementById('kat-id').value = '';
  document.getElementById('modalKategoriTitle').textContent = 'Tambah Kategori Jilbab';
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('kategoriModal'));
  modal.show();
}

function editKategoriModal(id) {
  const categories = CategoryModule.getAll();
  const kat = categories.find(c => c.idKategori === id);
  if (kat) {
    document.getElementById('kat-id').value = kat.idKategori;
    document.getElementById('kat-nama').value = kat.namaKategori;
    document.getElementById('kat-desc').value = kat.description || '';
    document.getElementById('kat-icon').value = kat.icon || 'bi-tag';
    document.getElementById('modalKategoriTitle').textContent = 'Edit Kategori Jilbab';
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('kategoriModal'));
    modal.show();
  }
}

function confirmDeleteKategori(id, name) {
  if (confirm(`Apakah Anda yakin menghapus kategori "${name}"?`)) {
    CategoryModule.delete(id);
    showToast(`Kategori "${name}" berhasil dihapus.`, 'success');
    renderAdminKategoriTable();
  }
}
