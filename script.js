// ---------------- Dark Mode ----------------
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

// ---------------- Interactive Quiz ----------------
const quizForm = document.getElementById('quiz-form');
if (quizForm) {
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;
    const total = quizForm.querySelectorAll('.quiz-question').length;

    quizForm.querySelectorAll('.quiz-question').forEach(q => {
      const selected = q.querySelector('input[type="radio"]:checked');
      if (selected && selected.value === q.dataset.answer) score++;
    });

    alert(`You scored ${score} / ${total}`);
    localStorage.setItem('quizCompleted', score);
    updateProgress();
  });
}

// ---------------- Video Completion ----------------
document.querySelectorAll('.tutorial-video').forEach(video => {
  video.addEventListener('ended', () => {
    const completedVideos = JSON.parse(localStorage.getItem('videosCompleted') || '[]');
    if (!completedVideos.includes(video.id)) {
      completedVideos.push(video.id);
      localStorage.setItem('videosCompleted', JSON.stringify(completedVideos));
      updateProgress();
    }
  });
});

// ---------------- Schedule Booking ----------------
function handleBooking(btn) {
  const session = btn.closest('li').dataset.session;
  let booked = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
  if (!booked.includes(session)) booked.push(session);
  localStorage.setItem('bookedSessions', JSON.stringify(booked));
  updateBookedSessions();
  updateProgress();
}

document.querySelectorAll('.book-btn').forEach(btn => {
  btn.addEventListener('click', () => handleBooking(btn));
});

function updateBookedSessions() {
  const ul = document.getElementById('booked-sessions');
  if (!ul) return;
  const booked = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
  ul.innerHTML = '';
  booked.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    ul.appendChild(li);
  });
}

// ---------------- Dashboard Progress ----------------
function updateProgress() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  // Calculate progress: videos + quiz + booked sessions
  const videosCompleted = JSON.parse(localStorage.getItem('videosCompleted') || '[]').length;
  const quizScore = localStorage.getItem('quizCompleted') ? 1 : 0;
  const bookedSessions = JSON.parse(localStorage.getItem('bookedSessions') || '[]').length;

  // Total items (example: 4 videos + 1 quiz + 4 sessions = 9)
  const totalItems = 4 + 1 + 4;
  const completed = videosCompleted + quizScore + bookedSessions;

  const percent = Math.min((completed / totalItems) * 100, 100);
  progressBar.style.width = percent + '%';
}

// Initialize on load
updateBookedSessions();
updateProgress();
