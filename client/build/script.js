document.getElementById('getAdsBtn').addEventListener('click', () => {
  fetch('/api/ads', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('adsContainer').innerHTML =
        '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    })
    .catch(console.error);
});

document.getElementById('createAdForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch('/api/ads', {
    method: 'POST',
    credentials: 'include',
    body: formData
  })
    .then(res => res.json())
    .then(result => alert('Create Ad: ' + JSON.stringify(result)))
    .catch(console.error);
});

document.getElementById('searchAdsBtn').addEventListener('click', () => {
  const phrase = document.getElementById('searchPhrase').value;
  fetch(`/api/ads/search/${encodeURIComponent(phrase)}`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('searchResults').innerHTML =
        '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    })
    .catch(console.error);
});

document.getElementById('updateAdForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = this.id.value;
  const formData = new FormData(this);
  fetch(`/api/ads/${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData
  })
    .then(res => res.json())
    .then(result => alert('Update Ad: ' + JSON.stringify(result)))
    .catch(console.error);
});

document.getElementById('deleteAdBtn').addEventListener('click', () => {
  const id = document.getElementById('deleteAdId').value;
  fetch(`/api/ads/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(result => alert('Delete Ad: ' + JSON.stringify(result)))
    .catch(console.error);
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch('/auth/register', {
    method: 'POST',
    credentials: 'include',
    body: formData
  })
    .then(res => res.json())
    .then(result => alert('Register: ' + JSON.stringify(result)))
    .catch(console.error);
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    login: this.login.value,
    password: this.password.value
  };
  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => alert('Login: ' + JSON.stringify(result)))
    .catch(console.error);
});

document.getElementById('getUserBtn').addEventListener('click', () => {
  fetch('/auth/user', { credentials: 'include' })
    .then(res => res.json())
    .then(user => {
      document.getElementById('userInfo').innerHTML =
        '<pre>' + JSON.stringify(user, null, 2) + '</pre>';
    })
    .catch(console.error);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  fetch('/auth/logout', {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(result => alert('Logout: ' + JSON.stringify(result)))
    .catch(console.error);
});
