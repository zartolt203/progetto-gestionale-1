// main.js //

// ==========================
// Utils
// ==========================

// Render a list of pictures in the detail panel
// Each picture is displayed with a preview and a delete button
// Clicking on the picture opens it in a lightbox viewer
// Clicking the delete button sends a request to remove the image from the server
// @param {Array} pictures - Array of picture objects with id and file_path properties

function renderPictures(pictures) {
  const picturesList = document.getElementById('pictures-list');
  picturesList.innerHTML = '';    // clear previous content

  pictures.forEach(pic => {
    // Create a container for each picture
    const wrapper = document.createElement('div');
    wrapper.className = 'picture-item';

    // Create the image element
    const img = document.createElement('img');
    img.src = '/static/uploads/colli/' + encodeURIComponent(pic.file_path);
    img.alt = 'Foto';

    // When clicked, open the image in a lightbox modal 
    img.addEventListener('click', () => {
      document.getElementById('lightbox-image').src = img.src;
      document.getElementById('lightbox-modal').classList.add('active');
    });

    // Create the delete button
    const btn = document.createElement('button');
    btn.className = 'btn-delete-item';
    btn.textContent = 'X';
    btn.dataset.photoId = pic.id;

    // Attach click event to the delete button
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const filename = pic.file_path.split('/').pop();
      if (!confirm(`Sei sicuro di voler eliminare la foto ${filename}?`)) return;   // Double check before deletion

      // Send a request to delete the photo
      fetch(`/delete_photos/${pic.id}`, { method: 'POST' })
        .then(r => {
          if (!r.ok) throw new Error();
          wrapper.remove();
          showFlashMessage('Foto eliminata con successo!', 'success');
        })
        .catch(() => showFlashMessage('Errore durante eliminazione foto.', 'error'));
    });

    // Append image and button to the wrapper, then to the list
    wrapper.appendChild(img);
    wrapper.appendChild(btn);
    picturesList.appendChild(wrapper);
  });
}

// ==========================
// Add Item Modal Handling
// ==========================

const addBtn = document.getElementById('btn-add-item');
const addModal = document.getElementById('adding-modal');
const closeAddBtn = document.getElementById('btn-close-add');

// Open add item modal when button is clicked
addBtn.addEventListener('click', e => {
  if (!window.isAuthenticated) {
    e.preventDefault();
    return;
  }
  addModal.style.display = 'flex';
});

// Close add item modal when close button is clicked or outside the box is clicked
closeAddBtn.addEventListener('click', () => {
  addModal.style.display = 'none';
});
addModal.addEventListener('click', e => { 
  if (e.target === addModal) addModal.style.display = 'none';
});

// ==========================
// Delete Item
// ==========================

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Bind click event to all delete buttons
  document.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();

      const deleteUrl = btn.dataset.deleteUrl;
      const li = btn.closest('li.item-item');
      const collo = li.dataset.collo;
      const matricola = li.dataset.matricola;
      const selected = document.querySelector('.item-item.selected');

      // Show confirmation window before deletion
      if (!confirm(`Sei sicuro di voler eliminare "${collo} - ${matricola}"?\nL'operazione è irreversibile e rimuoverà anche le foto.`)) return;

      // Perform deletion via fetch
      fetch(deleteUrl, { method: 'POST' })
        .then(async r => {
          const data = await r.json();
          if (!r.ok || !data.success) throw new Error(data.message || 'Errore generico');

          // If selected item is being deleted, hide the detail panel
          if (selected == li) {
            const detailPanel = document.querySelector('.detail-panel');
            detailPanel.style.display = 'none';
          }

          li.remove();
          showFlashMessage(data.message, 'success');
        })
        .catch(() => showFlashMessage('Errore durante l\'eliminazione.', 'error'));
    });
  });
});

// ===============================
// Right Panel + Modify Modal Handling
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements used for the right panel and modify modal
  const detailPanel = document.querySelector('.detail-panel');
  const fields = {
    collo: document.getElementById('detail-collo'),
    matricola: document.getElementById('detail-matricola'),
    codice: document.getElementById('detail-codice'),
    descrizione: document.getElementById('detail-descrizione'),
    quantita: document.getElementById('detail-quantita'),
    locazione: document.getElementById('detail-locazione'),
    note: document.getElementById('detail-note'),
  };

  const btnEdit = document.getElementById('btn-edit-item');
  const btnTransfer = document.getElementById('btn-request-transfer');
  const modifyModal = document.getElementById('modify-modal');
  const modifyForm = document.getElementById('modify-form');
  const btnCloseMod = document.getElementById('btn-close-modify');

  // Hide detail panel initially
  detailPanel.style.display = 'none';

  // When an item in the left list is clicked, show its details in the panel
  document.querySelectorAll('.item-item').forEach(li => {
    li.addEventListener('click', () => {
      // Unselect any previously selected item
      document.querySelectorAll('.item-item.selected').forEach(el => el.classList.remove('selected'));

      // Highlight the clicked item
      li.classList.add('selected');

      // Show the detail panel and populate it with data from the clicked item
      detailPanel.style.display = 'block';
      Object.keys(fields).forEach(key => fields[key].textContent = li.dataset[key] || '');

      // Load and display the item's associated pictures
      const pictures = JSON.parse(li.dataset.pictures || '[]');
      renderPictures(pictures);

      // Edit button: open modal and pre-fill the form with current item values
      btnEdit.onclick = () => {
        const id = li.dataset.id;
        ['collo','codice','matricola','descrizione','quantita','locazione','note']
          .forEach(name => {
            if (modifyForm.elements[name]) {
              modifyForm.elements[name].value = li.dataset[name] || '';
            }
          });

        // Set the form action dynamically based on selected item ID
        modifyForm.action = window.modifyItemUrlBase.replace(/0$/, id);
        modifyModal.style.display = 'flex';
      };

      // Transfer button: ask for confirmation and open Outlook mailto link
      btnTransfer.onclick = () => {
        const id = li.dataset.id;
        if (!confirm('Vuoi aprire Outlook per preparare la mail di trasferimento?')) return;
        window.location.href = window.requestTransferUrlBase + id;
        showFlashMessage('Richiesta trasferimento avviata, a breve verrà aperto Outlook.', 'success');
      };
    });
  });

  // Close the modify modal on cancel button or outside click
  btnCloseMod.addEventListener('click', () => modifyModal.style.display = 'none');
  modifyModal.addEventListener('click', e => { if (e.target === modifyModal) modifyModal.style.display = 'none'; });
});

// ==========================
// Upload Photos
// ==========================

document.getElementById('upload-photos-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Send files to the server
  fetch('/upload_photos', {
    method: 'POST',
    body: formData,
  })
  .then(async response => {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Errore dal server: ${text}`);
    }

    const data = await response.json();

    // Check backend JSON success field
    if (!data.success) {
      throw new Error(data.error || 'Errore sconosciuto');
    }

    // On success, show message and re-render updated pictures
    showFlashMessage('Foto caricate con successo!', 'success');
    renderPictures(data.pictures);
  })
  .catch(error => {
    console.error('Errore durante upload:', error);
    showFlashMessage('Errore durante upload foto.', 'error');
  });
});

// ==========================
// Auto set item_id before upload
// ==========================

// When user clicks the file input, automatically attach selected item's ID to the hidden input
document.querySelector('input[name="photos"]').addEventListener('click', () => {
  const selected = document.querySelector('.item-item.selected');
  if (selected) {
    const id = selected.dataset.id;
    document.getElementById('upload-item-id').value = id;
  }
});

// ==========================
// Lightbox Viewer for Photos
// ==========================

// Close lightbox when backdrop or close button is clicked
document.getElementById('lightbox-backdrop').addEventListener('click', () => {
  document.getElementById('lightbox-modal').classList.remove('active');
});
document.getElementById('lightbox-close').addEventListener('click', () => {
  document.getElementById('lightbox-modal').classList.remove('active');
});

// ==========================
// Export Excel File
// ==========================

document.getElementById('btn-export-excel').addEventListener('click', function(e) {
  e.preventDefault();
  const url = this.dataset.exportUrl;

  // Request Excel file from server
  fetch(url, { method: 'POST' })
    .then(resp => {
      if (!resp.ok) throw new Error('Errore nel download.');
      return resp.blob();
    })
    .then(blob => {
      // Trigger file download in the browser
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const today = new Date().toLocaleDateString('it-IT').replace(/\//g, '-');
      a.download = `resoconto_colli_${today}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    })
    .catch(err => console.error(err));
});
