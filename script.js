// ===== Theme Toggle =====
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// ===== Toggle Tutorial Video =====
function toggleTutorialVideo(btn) {
    const card = btn.closest('.tutorial-card');
    const video = card.querySelector('.tutorial-body');
    if (video.style.display === 'none') {
        video.style.display = 'block';
    } else {
        video.style.display = 'none';
    }
}

// ===== Dashboard Greeting (localStorage simulation) =====
document.addEventListener('DOMContentLoaded', () => {
    let username = localStorage.getItem('username') || 'Student';
    const greetingElements = document.querySelectorAll('.greeting');
    greetingElements.forEach(el => el.textContent = `Hello, ${username} 👋`);
});

// ===== Save Username Example =====
// For Sign-Up page, store user in localStorage
function saveUsername() {
    const nameInput = document.getElementById('username');
    if (nameInput.value.trim() !== '') {
        localStorage.setItem('username', nameInput.value.trim());
        alert('Username saved! Refreshing homepage...');
        window.location.href = 'index.html';
    }
}
