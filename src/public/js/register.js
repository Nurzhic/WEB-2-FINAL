const registerForm = document.getElementById('register-form');

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
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
      window.location.href = '/pages/manga.html';
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}
