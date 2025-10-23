// static/js/base.js

// ==============================
// Helper: Flash Message Display
// ==============================

function showFlashMessage(message, category = 'warning') {
  const container = document.getElementById('flashes');
  if (!container) return;

  const li = document.createElement('li');
  li.className = category;
  li.textContent = message;
  container.appendChild(li);

  setTimeout(() => {
    li.classList.add('fade-out');
    setTimeout(() => li.remove(), 500);
  }, 3000);
}

// ==============================
// Auth Requirement Handler
// ==============================

function requireAuth(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('click', e => {
      if (!window.isAuthenticated) {
        e.preventDefault();               // Prevent default behavior (link, submit, etc.)
        e.stopImmediatePropagation();     // Stop execution of other click handlers
        showFlashMessage(
          'Devi aver effettuato l\'accesso per eseguire questa azione.',
          'error'
        );
      }
    }, true);
  });
}

// ==============================
// DOM Ready: Setup Auth and Flash Cleanup
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  // Set global authentication status
  window.isAuthenticated =
    document.body.dataset.isAuthenticated === 'true';

  // Auto-hide existing flash messages after 3 seconds
  document.querySelectorAll('#flashes li').forEach(li => {
    setTimeout(() => {
      li.classList.add('fade-out');
      setTimeout(() => li.remove(), 500);
    }, 3000);
  });

  // Attach auth requirement handlers
  requireAuth('.requires-auth');
});

// ==============================
// Item List Filter Handler
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-item');
  const listIds = ['item-list-magazzino-1', 'item-list-magazzino-2'];

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    listIds.forEach(listId => {
      const ul = document.getElementById(listId);
      if (!ul) return;

      const items = Array.from(ul.querySelectorAll('li.item-item'));

      // Remove previous "no-results" message if any
      const oldNoRes = ul.querySelector('li.no-results');
      if (oldNoRes) oldNoRes.remove();

      // Filter visibility based on data attributes
      items.forEach(li => {
        const collo       = li.dataset.collo.toLowerCase();
        const codice      = li.dataset.codice.toLowerCase();
        const matricola   = li.dataset.matricola.toLowerCase();
        const descrizione = li.dataset.descrizione.toLowerCase();

        const match =
            collo.includes(query) ||
            codice.includes(query) ||
            matricola.includes(query) ||
            descrizione.includes(query);

        li.style.display = match ? '' : 'none';
      });

      // If all items are hidden, show "no results" message
      if (items.length > 0 && items.every(li => li.style.display === 'none')) {
        const noRes = document.createElement('li');
        noRes.className = 'no-results';
        noRes.textContent = 'No results found';
        ul.appendChild(noRes);
      }
    });
  });
});
