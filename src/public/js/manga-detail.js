const detailTitle = document.getElementById('detail-title');
const detailSubtitle = document.getElementById('detail-subtitle');
const detailSynopsis = document.getElementById('detail-synopsis');
const detailTags = document.getElementById('detail-tags');
const detailImage = document.getElementById('detail-image');
const detailLink = document.getElementById('detail-link');
const detailExtra = document.getElementById('detail-extra');

const getParam = (name) => new URLSearchParams(window.location.search).get(name);

const addExtra = (label, value) => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${label}:</strong> ${value || 'N/A'}`;
  detailExtra.appendChild(li);
};

const renderDetails = (data) => {
  const imageUrl = data.images?.jpg?.large_image_url || data.images?.jpg?.image_url;
  detailTitle.textContent = data.title || 'Manga details';
  detailSubtitle.textContent = `${data.type || 'N/A'} · Status: ${data.status || 'N/A'} · Score: ${data.score || 'N/A'}`;
  detailSynopsis.textContent = data.synopsis || 'No synopsis available.';

  if (imageUrl) {
    detailImage.innerHTML = `<img src="${imageUrl}" alt="${data.title}" />`;
  }

  detailTags.innerHTML = '';
  const tags = [
    ...(data.genres || []),
    ...(data.themes || []),
    ...(data.demographics || []),
  ];
  tags.slice(0, 10).forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag.name;
    detailTags.appendChild(span);
  });

  detailLink.href = data.url || '#';

  addExtra('Chapters', data.chapters);
  addExtra('Volumes', data.volumes);
  addExtra('Published', data.published?.string || 'N/A');
  addExtra('Authors', (data.authors || []).map((author) => author.name).join(', '));
  addExtra('Serializations', (data.serializations || []).map((mag) => mag.name).join(', '));
  addExtra('Rank', data.rank);
  addExtra('Popularity', data.popularity);
  addExtra('Members', data.members);
};

const loadDetails = async () => {
  const id = getParam('id');
  if (!id) {
    detailTitle.textContent = 'Missing manga ID';
    return;
  }

  try {
    const response = await request(`/api/external/manga/${id}`);
    renderDetails(response.data);
  } catch (err) {
    detailTitle.textContent = 'Failed to load details';
    detailSynopsis.textContent = err.message;
  }
};

loadDetails();
