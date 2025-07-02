// main.js

document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');

  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 2000);

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector(link.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
