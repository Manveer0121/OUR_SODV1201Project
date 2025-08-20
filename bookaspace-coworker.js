document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const resultsEl = document.getElementById("searchResults");
  const detailsEl = document.getElementById("workspaceDetails");

  input?.addEventListener("input", async (e) => {
    const q = e.target.value.trim();
    if (!q) {
      resultsEl.innerHTML = "";
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        resultsEl.innerHTML = data.results.map(r => {
          return `
            <div class="result-card">
              <h3>${r.property.name} - ${r.property.city}</h3>
              <p>${r.property.description}</p>
              <ul>
                ${r.workspaces.map(w => `<li>${w.name} (${w.type}) - <a href="#" data-id="${w.id}" class="view-workspace">View</a></li>`).join("")}
              </ul>
            </div>
          `;
        }).join("");
      } else {
        resultsEl.innerHTML = "<p>No results found.</p>";
      }
    } catch (err) {
      console.error(err);
      resultsEl.innerHTML = "<p>Error searching.</p>";
    }
  });

  resultsEl?.addEventListener("click", async (e) => {
    const link = e.target.closest(".view-workspace");
    if (!link) return;
    e.preventDefault();
    const wsId = link.getAttribute("data-id");
    try {
      const res = await fetch(`http://localhost:3000/workspaces/${wsId}`);
      const data = await res.json();
      if (data.success) {
        const w = data.workspace;
        const p = data.property;
        detailsEl.innerHTML = `
          <div class="workspace-card">
            <h3>${w.name}</h3>
            <p>Type: ${w.type}</p>
            <p>${p.name} - ${p.city}</p>
            <button onclick="bookWorkspace(${w.id})">Book This Workspace</button>
          </div>
        `;
      }
    } catch (err) {
      console.error(err);
      detailsEl.innerHTML = "<p>Error loading details.</p>";
    }
  });
});

async function bookWorkspace(workspaceId) {
  const userId = localStorage.getItem('userId');
  if (!userId) return alert('Please login first.');
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ userId, workspaceId })
    });
    const data = await res.json();
    if (data.success) {
      alert('Booking successful!');
      window.location.href = 'mybooking.html';
    } else {
      alert(data.message || 'Booking failed.');
    }
  } catch (e) {
    console.error(e);
    alert('Network error while booking.');
  }
}


