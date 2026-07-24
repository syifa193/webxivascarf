/**
 * XivaScarf Role & Dynamic UI Guard
 */

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = AuthModule.getCurrentUser();

  // Render current user profile info on headers/navbars if present
  const userNameElements = document.querySelectorAll('.user-display-name');
  const userEmailElements = document.querySelectorAll('.user-display-email');
  const userRoleElements = document.querySelectorAll('.user-display-role');

  if (currentUser) {
    userNameElements.forEach(el => el.textContent = currentUser.nama);
    userEmailElements.forEach(el => el.textContent = currentUser.email);
    userRoleElements.forEach(el => el.textContent = currentUser.role === 'admin' ? 'Administrator' : 'Pelanggan');
  }

  // Bind logout buttons
  const logoutBtns = document.querySelectorAll('.btn-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
        AuthModule.logout();
      }
    });
  });

  // Update Cart Badge counter across customer pages
  updateCartBadge();
});

function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge-count');
  if (!cartBadge) return;

  const currentUser = AuthModule.getCurrentUser();
  if (!currentUser) {
    cartBadge.textContent = '0';
    return;
  }

  const cart = DBStore.getCollection(DBStore.KEYS.KERANJANG);
  const userCart = cart.filter(item => item.uid === currentUser.uid);
  const totalCount = userCart.reduce((sum, item) => sum + (item.jumlah || 1), 0);
  cartBadge.textContent = totalCount.toString();
}

function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'danger'} border-0 show shadow-lg mb-2`;
  toastEl.role = 'alert';
  toastEl.style.borderRadius = '12px';
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body font-weight-bold">
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'info' ? 'bi-info-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  toastContainer.appendChild(toastEl);

  setTimeout(() => {
    toastEl.remove();
  }, 3500);
}

// Admin Sidebar Mobile Toggle
function toggleAdminSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle('show');

  // Create/manage overlay
  let overlay = document.getElementById('sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:999;display:none;';
    overlay.addEventListener('click', () => toggleAdminSidebar());
    document.body.appendChild(overlay);
  }
  overlay.style.display = isOpen ? 'block' : 'none';
}
