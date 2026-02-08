const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');
const searchInput = document.querySelector('input[name=\"query\"]');

const STORAGE_KEY = 'lastSearchResults';

const saveLastSearch = (query, items) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ query, items, savedAt: Date.now() })
  );
};

const loadLastSearch = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
};

const renderSearch = (items) => {
  searchResults.innerHTML = '';
  if (!items.length) {
    searchResults.innerHTML = '<li>No results.</li>';
    return;
  }

  items.forEach((item) => {
    const imageUrl = item.images?.jpg?.image_url || '';
    const synopsis = item.synopsis ? `${item.synopsis.slice(0, 180)}...` : 'No synopsis available.';
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="result">
        ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}" />` : ''}
        <div>
          <strong>${item.title}</strong>
          <div class="muted">Score: ${item.score || 'N/A'} | Volumes: ${item.volumes || 'N/A'}</div>
          <p class="muted">${synopsis}</p>
          <a class="button secondary" href="/pages/manga-detail.html?id=${item.mal_id}">View details</a>
        </div>
      </div>
    `;
    searchResults.appendChild(li);
  });
};

if (searchForm) {
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = new FormData(event.target).get('query');
    if (!query) return;
    try {
      const data = await request(`/api/external/manga/search?q=${encodeURIComponent(query)}`);
      renderSearch(data.results || []);
      saveLastSearch(query, data.results || []);
      setStatus('Search complete');
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

const restoreLastSearch = () => {
  const cached = loadLastSearch();
  if (!cached) return;
  if (searchInput) {
    searchInput.value = cached.query || '';
  }
  if (cached.items) {
    renderSearch(cached.items);
  }
};

restoreLastSearch();
