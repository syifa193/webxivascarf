/**
 * XivaScarf Register View Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const alertContainer = document.getElementById('register-alert');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nama = document.getElementById('nama').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const nohp = document.getElementById('nohp').value.trim();
      const alamat = document.getElementById('alamat').value.trim();
      const role = document.getElementById('role') ? document.getElementById('role').value : 'user';

      if (password !== confirmPassword) {
        showAlert('Konfirmasi password tidak cocok!');
        return;
      }

      if (password.length < 6) {
        showAlert('Password minimal 6 karakter!');
        return;
      }

      const res = AuthModule.register({
        nama,
        email,
        password,
        nohp,
        alamat,
        role
      });

      if (res.success) {
        showToast('Pendaftaran berhasil! Mengalihkan ke dashboard...', 'success');
        setTimeout(() => {
          if (res.user.role === 'admin') {
            window.location.href = 'admin/dashboard.html';
          } else {
            window.location.href = 'user/home.html';
          }
        }, 1200);
      } else {
        showAlert(res.message);
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
