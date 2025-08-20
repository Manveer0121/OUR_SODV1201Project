document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-bar input');
  const cards = Array.from(document.querySelectorAll('.property-card'));

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      cards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        card.style.display = title.includes(q) ? 'block' : 'none';
      });
    });
  }

  document.querySelectorAll('.property-card a').forEach(link => {
    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      const name = link.closest('.property-card')?.querySelector('h4')?.textContent || 'this property';
      alert(`Viewing details for: ${name}`);
    });
  });
});
