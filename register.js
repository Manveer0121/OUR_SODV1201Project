document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const nameEl = document.getElementById("fullName");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");
  const roleEl  = document.getElementById("role");
  const passEl  = document.getElementById("password");
  const confirmEl = document.getElementById("confirmPassword");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = (nameEl?.value || '').trim();
    const email    = (emailEl?.value || '').trim().toLowerCase();
    const phone    = (phoneEl?.value || '').trim();
    const role     = roleEl?.value || 'coworker';
    const password = passEl?.value || '';
    const confirm  = confirmEl?.value || '';

    if (fullName.length < 3) return alert("Full name must be at least 3 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Enter a valid email.");
    if (!/^\+?\d{10,15}$/.test(phone)) return alert("Enter a valid phone number (10–15 digits).");
    if (password.length < 6) return alert("Password must be at least 6 characters.");
    if (password !== confirm) return alert("Passwords do not match.");

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, role, password })
      });
      const data = await res.json();
      if (data.success) {
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Is the server running?");
    }
  });
});

