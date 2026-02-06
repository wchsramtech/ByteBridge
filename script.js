// ======================
// DARK MODE TOGGLE
// ======================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme === 'dark');

themeToggle?.addEventListener('click', () => {
    setTheme(body.classList.contains('dark-mode') ? false : true);
});


// ======================
// DASHBOARD PROGRESS TRACKING
// ======================
const progressBar = document.getElementById('progressBar');
const totalContent = document.querySelectorAll('.track-progress, .track-video, .track-doc').length;
let completedContent = JSON.parse(localStorage.getItem('completedContent')) || [];

function updateProgress() {
    const completedCount = completedContent.length;
    const percent = Math.round((completedCount / totalContent) * 100);
    if(progressBar) progressBar.style.width = percent + '%';
}

// Mark content as completed
function markCompleted(id) {
    if (!completedContent.includes(id)) {
        completedContent.push(id);
        localStorage.setItem('completedContent', JSON.stringify(completedContent));
        updateProgress();
    }
}

// Track clicks for videos
document.querySelectorAll('.track-video').forEach(btn => {
    btn.addEventListener('click', () => {
        markCompleted(btn.dataset.id);
    });
});

// Track clicks for docs
document.querySelectorAll('.track-doc').forEach(btn => {
    btn.addEventListener('click', () => {
        markCompleted(btn.dataset.id);
    });
});

// Track navigation clicks (optional for overall progress)
document.querySelectorAll('.track-progress').forEach(link => {
    link.addEventListener('click', () => {
        markCompleted(link.dataset.id || link.href);
    });
});

// Initialize progress bar
updateProgress();


// ======================
// RESOURCES QUIZ GRADING
// ======================
function gradeQuiz() {
    const quizForm = document.getElementById('quizForm');
    const result = document.getElementById('quizResult');
    if(!quizForm || !result) return;

    const correctAnswers = {
        q1: 'b',
        q2: 'c',
        q3: 'a',
        q4: 'b',
        q5: 'c'
    };

    let score = 0;
    for (let q in correctAnswers) {
        const answer = quizForm.elements[q]?.value;
        if (answer === correctAnswers[q]) score++;
    }

    const total = Object.keys(correctAnswers).length;
    result.textContent = `You scored ${score} out of ${total}`;

    // Mark quiz as completed for progress
    if(score === total) {
        markCompleted('quiz');
    }
}

const submitQuizBtn = document.getElementById('submitQuiz');
submitQuizBtn?.addEventListener('click', gradeQuiz);


// ======================
// SCHEDULE BOOKING
// ======================
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Function to book a session
function bookSession(date, time) {
    const id = date + '_' + time;
    if(!bookings.some(b => b.id === id)) {
        bookings.push({id, date, time});
        localStorage.setItem('bookings', JSON.stringify(bookings));
        updateDashboardBookings();
    }
}

// Populate dashboard with booked sessions
function updateDashboardBookings() {
    const dashboardList = document.getElementById('upcomingSessions');
    if(!dashboardList) return;

    dashboardList.innerHTML = '';
    bookings.forEach(b => {
        const li = document.createElement('li');
        li.textContent = `Booked: ${b.date} at ${b.time}`;
        dashboardList.appendChild(li);
    });
}

// Example: connect calendar buttons (assuming you give each time slot a class "time-slot")
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        const date = slot.dataset.date;
        const time = slot.dataset.time;
        bookSession(date, time);
        alert(`Booked ${date} at ${time}`);
    });
});

// Initialize dashboard
updateDashboardBookings();
updateProgress();
