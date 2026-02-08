const profileOutput = document.getElementById('profile-output');
const profileForm = document.getElementById('profile-form');
const logoutBtn = document.getElementById('logout-btn');

const loadProfile = async () => {
  try {
    const profile = await request('/api/users/profile');
    profileOutput.textContent = `${profile.username} (${profile.email})`;
  } catch (err) {
    profileOutput.textContent = 'Not logged in';
    setStatus(err.message, true);
  }
};

if (profileForm) {
  profileForm.addEventListener('submit', async (event) => {
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
      profileOutput.textContent = `${profile.username} (${profile.email})`;
      event.target.reset();
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    clearToken();
    profileOutput.textContent = 'Not logged in';
    setStatus('Logged out');
  });
}

loadProfile();
