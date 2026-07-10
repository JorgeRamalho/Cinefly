/* Cinefly — Cadastro (formulário + QR Code) */
document.addEventListener('DOMContentLoaded', () => {
  if (CineflyAuth.isLoggedIn()) {
    window.location.href = 'perfil.html';
    return;
  }

  const tabs = document.querySelectorAll('.auth-tab');
  const panelForm = document.getElementById('panel-form');
  const panelQr = document.getElementById('panel-qr');
  const form = document.getElementById('register-form');
  const alertEl = document.getElementById('alert');
  const alertOk = document.getElementById('alert-ok');
  const phoneInput = document.getElementById('phone');
  const zipInput = document.getElementById('zip');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const isQr = tab.dataset.tab === 'qr';
      panelForm.classList.toggle('active', !isQr);
      panelQr.classList.toggle('active', isQr);
      if (isQr) initQr();
    });
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.value = CineflyAuth.maskPhone(phoneInput.value);
  });
  zipInput.addEventListener('input', () => {
    zipInput.value = CineflyAuth.maskZip(zipInput.value);
  });

  let qrReady = false;
  function initQr() {
    if (qrReady) return;
    const signupUrl = window.location.href.split('#')[0] + '?via=qr';
    document.getElementById('qr-url').textContent = signupUrl;
    const box = document.getElementById('qrcode');
    box.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      new QRCode(box, {
        text: signupUrl,
        width: 200,
        height: 200,
        colorDark: '#0B0F14',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      box.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(signupUrl)}" alt="QR Code de cadastro" width="200" height="200" />`;
    }
    qrReady = true;
  }

  document.getElementById('btn-copy-link').addEventListener('click', async () => {
    const url = window.location.href.split('#')[0];
    try {
      await navigator.clipboard.writeText(url);
      CineflyUI.toast('Link copiado! 📋');
    } catch {
      CineflyUI.toast('Não foi possível copiar. Copie o link manualmente.');
    }
  });

  // Se chegou via QR, foca no formulário
  if (new URLSearchParams(window.location.search).get('via') === 'qr') {
    alertOk.textContent = 'Cadastro via QR Code — preencha o formulário abaixo.';
    alertOk.classList.add('show');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertEl.classList.remove('show');
    alertOk.classList.remove('show');

    const required = ['name', 'username', 'email', 'phone', 'password', 'confirmPassword'];
    let valid = true;
    required.forEach((id) => {
      const input = document.getElementById(id);
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group.classList.add('has-error');
        valid = false;
      } else {
        group.classList.remove('has-error');
      }
    });

    if (!document.getElementById('terms').checked) {
      alertEl.textContent = 'Aceite os termos para continuar.';
      alertEl.classList.add('show');
      return;
    }

    if (!valid) return;

    const data = {
      name: form.name.value,
      username: form.username.value,
      email: form.email.value,
      phone: form.phone.value,
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      zip: form.zip.value,
      password: form.password.value,
      confirmPassword: form.confirmPassword.value
    };

    const result = CineflyAuth.register(data);
    if (!result.ok) {
      alertEl.textContent = result.error;
      alertEl.classList.add('show');
      return;
    }

    alertOk.textContent = 'Conta criada com sucesso! Redirecionando…';
    alertOk.classList.add('show');
    CineflyUI.toast('Bem-vindo à Cinefly! ✈️🎬');
    setTimeout(() => {
      window.location.href = 'perfil.html';
    }, 800);
  });
});
