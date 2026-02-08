const statusEl = document.getElementById('status');
const profileOutput = document.getElementById('profile-output');
const mangaList = document.getElementById('manga-list');
const searchResults = document.getElementById('search-results');
const mangaMode = document.getElementById('manga-mode');
const mangaSubmit = document.getElementById('manga-submit');
const mangaCancel = document.getElementById('manga-cancel');
const healthButton = document.getElementById('check-health');

let editingId = null;

const setStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#fca5a5' : '#94a3b8';
};

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const clearToken = () => localStorage.removeItem('token');

const request = async (url, options = {}) => {
  const headers = options.headers || {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const renderProfile = (profile) => {
  if (!profile) {
    profileOutput.textContent = 'Not logged in';
    return;
  }
  profileOutput.textContent = `${profile.username} (${profile.email})`;
};

const setEditMode = (manga) => {
  const form = document.getElementById('manga-form');
  if (!manga) {
    editingId = null;
    mangaMode.textContent = 'Mode: Create';
    mangaSubmit.textContent = 'Save Manga';
    mangaCancel.disabled = true;
    form.reset();
    return;
  }

  editingId = manga._id;
  mangaMode.textContent = `Mode: Edit (${manga.title})`;
  mangaSubmit.textContent = 'Update Manga';
  mangaCancel.disabled = false;
  form.title.value = manga.title || '';
  form.description.value = manga.description || '';
  form.status.value = manga.status || 'planned';
  form.rating.value = manga.rating || '';
  form.volumes.value = manga.volumes || '';
};

const renderManga = (items) => {
  mangaList.innerHTML = '';
  if (!items.length) {
    mangaList.innerHTML = '<li>No manga yet.</li>';
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.title}</strong>
      <div class="muted">Status: ${item.status}</div>
      <div class="muted">Rating: ${item.rating || 'N/A'} | Volumes: ${item.volumes || 'N/A'}</div>
      <p>${item.description || ''}</p>
      <div class="button-row">
        <button data-id="${item._id}" class="secondary edit-btn">Edit</button>
        <button data-id="${item._id}" class="secondary delete-btn">Delete</button>
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

const renderSearch = (items) => {
  searchResults.innerHTML = '';
  if (!items.length) {
    searchResults.innerHTML = '<li>No results.</li>';
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.title}</strong>
      <div class="muted">Score: ${item.score || 'N/A'} | Volumes: ${item.volumes || 'N/A'}</div>
    `;
    searchResults.appendChild(li);
  });
};

const loadProfile = async () => {
  try {
    const profile = await request('/api/users/profile');
    renderProfile(profile);
  } catch (err) {
    renderProfile(null);
  }
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

const setupForms = () => {
  document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    try {
      const data = await request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setToken(data.token);
      setStatus('Registration successful');
      await loadProfile();
      await loadManga();
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setToken(data.token);
      setStatus('Login successful');
      await loadProfile();
      await loadManga();
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  document.getElementById('profile-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries([...formData.entries()].filter(([, value]) => value));
    if (!Object.keys(payload).length) {
      setStatus('Nothing to update');
      return;
    }
    try {
      const profile = await request('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStatus('Profile updated');
      renderProfile(profile);
      event.target.reset();
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearToken();
    renderProfile(null);
    renderManga([]);
    setStatus('Logged out');
  });

  document.getElementById('manga-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.title) {
      setStatus('Title is required', true);
      return;
    }
    if (payload.rating === '') delete payload.rating;
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

  mangaCancel.addEventListener('click', () => {
    setEditMode(null);
    setStatus('Edit cancelled');
  });

  document.getElementById('refresh-manga').addEventListener('click', async () => {
    await loadManga();
  });

  document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = new FormData(event.target).get('query');
    if (!query) return;
    try {
      const data = await request(`/api/external/manga/search?q=${encodeURIComponent(query)}`);
      renderSearch(data.results || []);
      setStatus('Search complete');
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  healthButton.addEventListener('click', async () => {
    try {
      const data = await request('/api/health');
      setStatus(`API is healthy: ${data.name}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });
};

const init = async () => {
  setupForms();
  mangaCancel.disabled = true;
  await loadProfile();
  await loadManga();
};

init();
