/**
 * XivaScarf Login View Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const demoAdminBtn = document.getElementById('btn-demo-admin');
  const demoUserBtn = document.getElementById('btn-demo-user');
  const alertContainer = document.getElementById('login-alert');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      const res = AuthModule.login(email, password);
      if (res.success) {
        showToast('Login berhasil! Mengalihkan...', 'success');
        setTimeout(() => {
          if (res.user.role === 'admin') {
            window.location.href = 'admin/dashboard.html';
          } else {
            window.location.href = 'user/home.html';
          }
        }, 1000);
      } else {
        showAlert(res.message);
      }
    });
  }

  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      document.getElementById('email').value = 'admin@xivascarf.com';
      document.getElementById('password').value = 'admin123';
      if (typeof loginForm.requestSubmit === 'function') {
        loginForm.requestSubmit();
      } else {
        loginForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });
  }

  if (demoUserBtn) {
    demoUserBtn.addEventListener('click', () => {
      document.getElementById('email').value = 'user@xivascarf.com';
      document.getElementById('password').value = 'user123';
      if (typeof loginForm.requestSubmit === 'function') {
        loginForm.requestSubmit();
      } else {
        loginForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });
  }

  function showAlert(msg) {
    if (alertContainer) {
      alertContainer.className = 'alert alert-danger mb-3';
      alertContainer.textContent = msg;
      alertContainer.classList.remove('d-none');
    }
  }
});
