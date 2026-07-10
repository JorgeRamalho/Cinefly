/* Cinefly — Autenticação e Perfil (localStorage) */
const CineflyAuth = (() => {
  const USERS_KEY = 'cinefly_users';
  const SESSION_KEY = 'cinefly_session';
  const FAVORITES_KEY = 'cinefly_favorites';

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  function setSession(user) {
    const safe = { ...user };
    delete safe.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    const users = getUsers();
    return users.find((u) => u.id === session.id) || session;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  function register(data) {
    const users = getUsers();
    const username = data.username.trim().toLowerCase();
    const email = data.email.trim().toLowerCase();

    if (users.some((u) => u.username === username)) {
      return { ok: false, error: 'Este nome de usuário já está em uso.' };
    }
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'Este e-mail já está cadastrado.' };
    }
    if (!validateEmail(email)) {
      return { ok: false, error: 'Informe um e-mail válido.' };
    }
    if (data.password.length < 6) {
      return { ok: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
    }
    if (data.password !== data.confirmPassword) {
      return { ok: false, error: 'As senhas não coincidem.' };
    }

    const user = {
      id: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      username,
      email,
      password: data.password,
      name: data.name.trim(),
      phone: data.phone.trim(),
      address: data.address?.trim() || '',
      city: data.city?.trim() || '',
      state: data.state?.trim() || '',
      zip: data.zip?.trim() || '',
      bio: data.bio?.trim() || '',
      avatar: data.avatar || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);
    setSession(user);
    return { ok: true, user };
  }

  function login(usernameOrEmail, password) {
    const users = getUsers();
    const key = usernameOrEmail.trim().toLowerCase();
    const user = users.find(
      (u) => (u.username === key || u.email === key) && u.password === password
    );
    if (!user) {
      return { ok: false, error: 'Usuário ou senha incorretos.' };
    }
    setSession(user);
    return { ok: true, user };
  }

  function logout() {
    clearSession();
  }

  function updateProfile(updates) {
    const session = getSession();
    if (!session) return { ok: false, error: 'Sessão expirada. Faça login novamente.' };

    const users = getUsers();
    const idx = users.findIndex((u) => u.id === session.id);
    if (idx === -1) return { ok: false, error: 'Usuário não encontrado.' };

    const current = users[idx];

    if (updates.email && updates.email !== current.email) {
      const email = updates.email.trim().toLowerCase();
      if (!validateEmail(email)) return { ok: false, error: 'E-mail inválido.' };
      if (users.some((u) => u.email === email && u.id !== current.id)) {
        return { ok: false, error: 'Este e-mail já está em uso.' };
      }
      updates.email = email;
    }

    if (updates.username && updates.username !== current.username) {
      const username = updates.username.trim().toLowerCase();
      if (users.some((u) => u.username === username && u.id !== current.id)) {
        return { ok: false, error: 'Nome de usuário já em uso.' };
      }
      updates.username = username;
    }

    if (updates.phone && !validatePhone(updates.phone)) {
      return { ok: false, error: 'Telefone inválido. Use DDD + número.' };
    }

    if (updates.newPassword) {
      if (updates.currentPassword !== current.password) {
        return { ok: false, error: 'Senha atual incorreta.' };
      }
      if (updates.newPassword.length < 6) {
        return { ok: false, error: 'A nova senha deve ter pelo menos 6 caracteres.' };
      }
      if (updates.newPassword !== updates.confirmPassword) {
        return { ok: false, error: 'As novas senhas não coincidem.' };
      }
      updates.password = updates.newPassword;
    }

    delete updates.newPassword;
    delete updates.confirmPassword;
    delete updates.currentPassword;

    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    users[idx] = updated;
    saveUsers(users);
    setSession(updated);
    return { ok: true, user: updated };
  }

  function deleteAccount(password) {
    const session = getSession();
    if (!session) return { ok: false, error: 'Sessão expirada.' };
    const users = getUsers();
    const user = users.find((u) => u.id === session.id);
    if (!user || user.password !== password) {
      return { ok: false, error: 'Senha incorreta.' };
    }
    saveUsers(users.filter((u) => u.id !== session.id));
    localStorage.removeItem(FAVORITES_KEY + '_' + session.id);
    clearSession();
    return { ok: true };
  }

  function getFavorites() {
    const session = getSession();
    if (!session) return [];
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY + '_' + session.id)) || [];
    } catch {
      return [];
    }
  }

  function toggleFavorite(contentId) {
    const session = getSession();
    if (!session) return { ok: false, needAuth: true };
    const key = FAVORITES_KEY + '_' + session.id;
    let favs = [];
    try {
      favs = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      favs = [];
    }
    const exists = favs.includes(contentId);
    favs = exists ? favs.filter((id) => id !== contentId) : [...favs, contentId];
    localStorage.setItem(key, JSON.stringify(favs));
    return { ok: true, added: !exists, favorites: favs };
  }

  function isFavorite(contentId) {
    return getFavorites().includes(contentId);
  }

  function requireAuth(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
      window.location.href = redirectTo + '?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop());
      return false;
    }
    return true;
  }

  function initials(user) {
    if (!user) return '?';
    const name = user.name || user.username || 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  function maskPhone(value) {
    const d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 10) {
      return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
        [a && `(${a}`, a && ') ', b, c && `-${c}`].filter(Boolean).join('')
      );
    }
    return d.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_, a, b, c) =>
      [a && `(${a}`, a && ') ', b, c && `-${c}`].filter(Boolean).join('')
    );
  }

  function maskZip(value) {
    const d = value.replace(/\D/g, '').slice(0, 8);
    return d.replace(/(\d{0,5})(\d{0,3})/, (_, a, b) => (b ? `${a}-${b}` : a));
  }

  return {
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    getCurrentUser,
    isLoggedIn,
    getFavorites,
    toggleFavorite,
    isFavorite,
    requireAuth,
    initials,
    maskPhone,
    maskZip,
    validateEmail,
    validatePhone
  };
})();
