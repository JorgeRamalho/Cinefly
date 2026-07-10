/* Cinefly — Perfil / área do cliente */
document.addEventListener('DOMContentLoaded', () => {
  if (!CineflyAuth.requireAuth()) return;

  const user = CineflyAuth.getCurrentUser();
  const alertOk = document.getElementById('alert-ok');
  const alertErr = document.getElementById('alert-err');

  function showOk(msg) {
    alertErr.classList.remove('show');
    alertOk.textContent = msg;
    alertOk.classList.add('show');
    CineflyUI.toast(msg);
    setTimeout(() => alertOk.classList.remove('show'), 4000);
  }

  function showErr(msg) {
    alertOk.classList.remove('show');
    alertErr.textContent = msg;
    alertErr.classList.add('show');
  }

  function fillAvatar(el, u) {
    if (u.avatar) {
      el.innerHTML = `<img src="${u.avatar}" alt="" />`;
    } else {
      el.textContent = CineflyAuth.initials(u);
    }
  }

  function refreshSidebar(u) {
    document.getElementById('side-name').textContent = u.name || u.username;
    document.getElementById('side-email').textContent = u.email;
    fillAvatar(document.getElementById('side-avatar'), u);
    fillAvatar(document.getElementById('avatar-preview'), u);
    document.getElementById('avatar-url').value = u.avatar || '';
    document.getElementById('stat-favs').textContent = CineflyAuth.getFavorites().length;
    if (u.createdAt) {
      const d = new Date(u.createdAt);
      document.getElementById('stat-member').textContent = d.toLocaleDateString('pt-BR', {
        month: 'short',
        year: 'numeric'
      });
    }
  }

  function fillForms(u) {
    document.getElementById('name').value = u.name || '';
    document.getElementById('username').value = u.username || '';
    document.getElementById('email').value = u.email || '';
    document.getElementById('phone').value = u.phone || '';
    document.getElementById('bio').value = u.bio || '';
    document.getElementById('address').value = u.address || '';
    document.getElementById('city').value = u.city || '';
    document.getElementById('state').value = u.state || '';
    document.getElementById('zip').value = u.zip || '';
  }

  refreshSidebar(user);
  fillForms(user);

  // Navegação lateral
  document.querySelectorAll('.profile-nav a[data-panel]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.profile-nav a[data-panel]').forEach((a) => a.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.profile-panel').forEach((p) => p.classList.remove('active'));
      document.getElementById('panel-' + link.dataset.panel).classList.add('active');
      alertOk.classList.remove('show');
      alertErr.classList.remove('show');
    });
  });

  // Máscaras
  const phone = document.getElementById('phone');
  const zip = document.getElementById('zip');
  phone.addEventListener('input', () => {
    phone.value = CineflyAuth.maskPhone(phone.value);
  });
  zip.addEventListener('input', () => {
    zip.value = CineflyAuth.maskZip(zip.value);
  });

  // Avatar
  document.getElementById('btn-avatar-apply').addEventListener('click', () => {
    const url = document.getElementById('avatar-url').value.trim();
    const result = CineflyAuth.updateProfile({ avatar: url });
    if (!result.ok) return showErr(result.error);
    refreshSidebar(result.user);
    showOk('Foto de perfil atualizada.');
  });

  document.getElementById('btn-avatar-clear').addEventListener('click', () => {
    const result = CineflyAuth.updateProfile({ avatar: '' });
    if (!result.ok) return showErr(result.error);
    document.getElementById('avatar-url').value = '';
    refreshSidebar(result.user);
    showOk('Foto removida.');
  });

  // Dados pessoais
  document.getElementById('form-dados').addEventListener('submit', (e) => {
    e.preventDefault();
    const result = CineflyAuth.updateProfile({
      name: document.getElementById('name').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      bio: document.getElementById('bio').value
    });
    if (!result.ok) return showErr(result.error);
    refreshSidebar(result.user);
    showOk('Dados pessoais salvos com sucesso.');
  });

  // Endereço
  document.getElementById('form-endereco').addEventListener('submit', (e) => {
    e.preventDefault();
    const result = CineflyAuth.updateProfile({
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zip: document.getElementById('zip').value
    });
    if (!result.ok) return showErr(result.error);
    showOk('Endereço atualizado.');
  });

  // Senha
  document.getElementById('form-senha').addEventListener('submit', (e) => {
    e.preventDefault();
    const result = CineflyAuth.updateProfile({
      currentPassword: document.getElementById('currentPassword').value,
      newPassword: document.getElementById('newPassword').value,
      confirmPassword: document.getElementById('confirmPassword').value
    });
    if (!result.ok) return showErr(result.error);
    e.target.reset();
    showOk('Senha alterada com sucesso.');
  });

  // Logout
  document.getElementById('btn-logout-profile').addEventListener('click', () => {
    CineflyAuth.logout();
    window.location.href = 'index.html';
  });

  // Excluir conta
  document.getElementById('form-delete').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é permanente.')) return;
    const result = CineflyAuth.deleteAccount(document.getElementById('deletePassword').value);
    if (!result.ok) return showErr(result.error);
    CineflyUI.toast('Conta excluída. Até logo.');
    setTimeout(() => (window.location.href = 'index.html'), 700);
  });
});
