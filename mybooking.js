document.addEventListener('DOMContentLoaded', () => {
  const userId = parseInt(localStorage.getItem('userId') || '0', 10);
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  const listEl = document.getElementById('bookingList');

  async function loadBookings() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/bookings?userId=${userId}`, { headers: { 'Authorization': `Bearer ${token}` }
    });
      const data = await res.json();
      if (!data.success) return (listEl.textContent = 'Failed to load bookings.');
      const items = data.bookings;
      if (!items.length) {
        listEl.innerHTML = '<p>No bookings yet.</p>';
        return;
      }

      listEl.innerHTML = items.map(b => {
        const prop = b.property ? `${b.property.name}, ${b.property.city}` : 'Unknown property';
        const ws   = b.workspace ? `${b.workspace.name} (${b.workspace.type})` : 'Unknown workspace';
        return `
          <div class="booking-card">
            <h4>${prop}</h4>
            <p>${ws}</p>
            <p>Created: ${new Date(b.createdAt).toLocaleString()}</p>
            <button data-id="${b.id}" class="delete-booking">Delete</button>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error(e);
      listEl.textContent = 'Network error while loading bookings.';
    }
  }

  listEl?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.delete-booking');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (!confirm('Delete this booking?')) return;
    try {
      const res = await fetch(`http://localhost:3000/bookings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadBookings();
      else alert(data.message || 'Delete failed.');
    } catch (e2) {
      console.error(e2);
      alert('Network error.');
    }
  });

  loadBookings();
});


