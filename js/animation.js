// animations.js

document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.project-card');
  const triggerBottom = window.innerHeight * 0.8;

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerBottom) {
      el.classList.add('show');
    } else {
      el.classList.remove('show');
    }
  });
});
