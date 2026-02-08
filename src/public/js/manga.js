const mangaList = document.getElementById('manga-list');
const mangaMode = document.getElementById('manga-mode');
const mangaSubmit = document.getElementById('manga-submit');
const mangaCancel = document.getElementById('manga-cancel');
const refreshButton = document.getElementById('refresh-manga');
const mangaForm = document.getElementById('manga-form');

let editingId = null;

const setEditMode = (manga) => {
  if (!manga) {
    editingId = null;
    mangaMode.textContent = 'Mode: Create';
    mangaSubmit.textContent = 'Save Manga';
    mangaCancel.disabled = true;
    mangaForm.reset();
    return;
  }

  editingId = manga._id;
  mangaMode.textContent = `Mode: Edit (${manga.title})`;
  mangaSubmit.textContent = 'Update Manga';
  mangaCancel.disabled = false;
  mangaForm.title.value = manga.title || '';
  mangaForm.description.value = manga.description || '';
  mangaForm.status.value = manga.status || 'planned';
  mangaForm.rating.value = manga.rating || '';
  mangaForm.coverImage.value = manga.coverImage || '';
  mangaForm.volumes.value = manga.volumes || '';
};

const renderManga = (items) => {
  mangaList.innerHTML = '';
  if (!items.length) {
    mangaList.innerHTML = '<li>No manga yet.</li>';
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    const resultClass = item.coverImage ? 'result' : 'result no-image';
    li.innerHTML = `
      <div class="${resultClass}">
        ${item.coverImage ? `<img src="${item.coverImage}" alt="${item.title}" />` : ''}
        <div>
          <strong>${item.title}</strong>
          <div class="muted">Status: ${item.status}</div>
          <div class="muted">Rating: ${item.rating || 'N/A'} | Volumes: ${item.volumes || 'N/A'}</div>
          ${item.coverImage ? '<div class="muted">Custom cover</div>' : ''}
          <p>${item.description || ''}</p>
          <div class="button-row">
            <button data-id="${item._id}" class="secondary edit-btn">Edit</button>
            <button data-id="${item._id}" class="secondary delete-btn">Delete</button>
          </div>
        </div>
      </div>
    `;
    mangaList.appendChild(li);
  });

  document.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const manga = items.find((item) => item._id === button.dataset.id);
      if (manga) {
        setEditMode(manga);
        setStatus('Editing manga entry');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await request(`/api/manga/${button.dataset.id}`, { method: 'DELETE' });
        setStatus('Manga deleted');
        if (editingId === button.dataset.id) {
          setEditMode(null);
        }
        await loadManga();
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });
};

const loadManga = async () => {
  try {
    const data = await request('/api/manga');
    renderManga(data);
  } catch (err) {
    renderManga([]);
    setStatus(err.message, true);
  }
};

if (mangaForm) {
  mangaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.title) {
      setStatus('Title is required', true);
      return;
    }
    if (payload.rating === '') delete payload.rating;
    if (payload.coverImage === '') delete payload.coverImage;
    if (payload.volumes === '') delete payload.volumes;

    try {
      if (editingId) {
        await request(`/api/manga/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setStatus('Manga updated');
      } else {
        await request('/api/manga', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setStatus('Manga saved');
      }

      setEditMode(null);
      await loadManga();
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

if (mangaCancel) {
  mangaCancel.addEventListener('click', () => {
    setEditMode(null);
    setStatus('Edit cancelled');
  });
}

if (refreshButton) {
  refreshButton.addEventListener('click', async () => {
    await loadManga();
  });
}

mangaCancel.disabled = true;
loadManga();
