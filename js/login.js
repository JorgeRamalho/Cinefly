/* Cinefly — Login */
document.addEventListener('DOMContentLoaded', () => {
  if (CineflyAuth.isLoggedIn()) {
    window.location.href = 'perfil.html';
    return;
  }

  const form = document.getElementById('login-form');
  const alertEl = document.getElementById('alert');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertEl.classList.remove('show');

    const login = form.login.value.trim();
    const password = form.password.value;
    let valid = true;

    [form.login, form.password].forEach((input) => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group.classList.add('has-error');
        valid = false;
      } else {
        group.classList.remove('has-error');
      }
    });

    if (!valid) return;

    const result = CineflyAuth.login(login, password);
    if (!result.ok) {
      alertEl.textContent = result.error;
      alertEl.classList.add('show');
      return;
    }

    CineflyUI.toast('Bem-vindo de volta! 🎬');
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || 'index.html';
    setTimeout(() => {
      window.location.href = redirect.includes('.html') ? redirect : 'index.html';
    }, 500);
  });
});
