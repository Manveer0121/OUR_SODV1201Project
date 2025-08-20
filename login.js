document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailEl = document.getElementById('email');
  const passEl  = document.getElementById('password');
  const msgEl   = document.getElementById('loginMessage');

  const showMessage = (text, color = 'red') => {
    if (msgEl) { msgEl.textContent = text; msgEl.style.color = color; }
    else alert(text);
  };

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (emailEl?.value || '').trim().toLowerCase();
    const password = passEl?.value || '';

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('userId', String(data.user.id));
        localStorage.setItem('role', data.user.role || '');
        localStorage.setItem('token', data.token);
        if (data.user.contact) localStorage.setItem('contact', data.user.contact);
        showMessage('Login successful! Redirecting...', 'green');
        setTimeout(() => window.location.href = 'mybooking.html', 600);
      } else {
        showMessage('Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      showMessage('Network error. Is the server running on http://localhost:3000 ?');
    }
  });
});
