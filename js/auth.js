/**
 * XivaScarf Authentication & User Session Module
 */

const AuthModule = {
  getCurrentUser() {
    const userStr = localStorage.getItem(DBStore.KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(DBStore.KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(DBStore.KEYS.CURRENT_USER);
    }
  },

  login(email, password) {
    const users = DBStore.getCollection(DBStore.KEYS.USERS);
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, message: 'Email tidak ditemukan' };
    }

    // Demo password check (plain text for localStorage demo mode)
    if (foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Password salah. Coba lagi.' };
    }

    // Save session
    this.setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  },

  register(userData) {
    const users = DBStore.getCollection(DBStore.KEYS.USERS);
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (existing) {
      return { success: false, message: 'Email sudah terdaftar!' };
    }

    const newUser = {
      uid: DBStore.generateId('usr'),
      nama: userData.nama,
      email: userData.email,
      role: userData.role || 'user',
      alamat: userData.alamat || '',
      nohp: userData.nohp || '',
      emailVerified: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    DBStore.setCollection(DBStore.KEYS.USERS, users);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  logout() {
    this.setCurrentUser(null);
    window.location.href = '../login.html';
  },

  requireAuth(requiredRole = null) {
    const user = this.getCurrentUser();
    if (!user) {
      const isSubdir = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/user/');
      const loginUrl = isSubdir ? '../login.html' : 'login.html';
      window.location.href = loginUrl;
      return null;
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'admin') {
        window.location.href = '../admin/dashboard.html';
      } else {
        window.location.href = '../user/dashboard.html';
      }
      return null;
    }

    return user;
  }
};
