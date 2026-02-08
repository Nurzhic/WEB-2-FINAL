const setStatus = (message, isError = false) => {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;
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

const ensureAuth = () => {
  if (!getToken()) {
    setStatus('Please login first', true);
  }
};

const getProfileSafely = async () => {
  try {
    return await request('/api/users/profile');
  } catch (err) {
    clearToken();
    return null;
  }
};

const updateNavAuthLinks = async () => {
  const token = getToken();
  const loginLinks = document.querySelectorAll('a[href="/pages/login.html"]');
  const registerLinks = document.querySelectorAll('a[href="/pages/register.html"]');
  const profileLinks = document.querySelectorAll('a[href="/pages/profile.html"]');
  const mangaLinks = document.querySelectorAll('a[href="/pages/manga.html"]');
  const navs = document.querySelectorAll('.top-nav');

  if (token) {
    const profile = await getProfileSafely();
    if (!profile) {
      updateNavAuthLinks();
      return;
    }
    loginLinks.forEach((link) => {
      link.textContent = 'Logout';
      link.setAttribute('href', '#logout');
      link.onclick = (event) => {
        event.preventDefault();
        clearToken();
        setStatus('Logged out');
        window.location.href = '/';
      };
    });
    registerLinks.forEach((link) => {
      link.style.display = 'none';
    });
    profileLinks.forEach((link) => {
      link.style.display = '';
    });
    mangaLinks.forEach((link) => {
      link.style.display = '';
    });

    navs.forEach((nav) => {
      let userBadge = nav.querySelector('.nav-user');
      if (!userBadge) {
        userBadge = document.createElement('span');
        userBadge.className = 'nav-user';
        nav.appendChild(userBadge);
      }
      userBadge.textContent = `Hi, ${profile.username}`;
    });
  } else {
    loginLinks.forEach((link) => {
      link.textContent = 'Login';
      link.setAttribute('href', '/pages/login.html');
      link.onclick = null;
    });
    registerLinks.forEach((link) => {
      link.style.display = '';
    });
    profileLinks.forEach((link) => {
      link.style.display = 'none';
    });
    mangaLinks.forEach((link) => {
      link.style.display = 'none';
    });
    navs.forEach((nav) => {
      const userBadge = nav.querySelector('.nav-user');
      if (userBadge) {
        userBadge.remove();
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', updateNavAuthLinks);
