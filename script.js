// ========================
// ByteBridge Unified Script
// Handles: dark/light mode, progress tracking, schedule, dashboard, quiz
// ========================

// ------------------------
// DARK / LIGHT MODE TOGGLE
// ------------------------
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// ------------------------
// PROGRESS TRACKING
// ------------------------
let progress = JSON.parse(localStorage.getItem('progress')) || {
    videos: {},
    documents: {},
    quiz: {}
};

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    // Calculate total items
    const totalItems = Object.keys(progress.videos).length + Object.keys(progress.documents).length + Object.keys(progress.quiz).length;
    const completedItems = Object.values(progress.videos).filter(v => v).length +
                           Object.values(progress.documents).filter(d => d).length +
                           Object.values(progress.quiz).filter(q => q).length;
    const percent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    progressBar.style.width = `${percent}%`;
}
updateProgressBar();

// ------------------------
// VIDEO CLICK TRACKING
// ------------------------
const videoIframes = document.querySelectorAll('iframe');
videoIframes.forEach((iframe, idx) => {
    iframe.addEventListener('load', () => {
        const key = 'video_' + idx;
        if (!(key in progress.videos)) progress.videos[key] = false;
        iframe.addEventListener('click', () => {
            progress.videos[key] = true;
            localStorage.setItem('progress', JSON.stringify(progress));
            updateProgressBar();
        });
    });
});

// ------------------------
// DOCUMENT CLICK TRACKING
// ------------------------
const docButtons = document.querySelectorAll('button[onclick*="window.open"]');
docButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        const key = 'doc_' + idx;
        progress.documents[key] = true;
        localStorage.setItem('progress', JSON.stringify(progress));
        updateProgressBar();
    });
});

// ------------------------
// QUIZ FUNCTIONALITY
// ------------------------
const quizForm = document.getElementById('quizForm');
if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(quizForm);
        const correctAnswers = {
            q1: 'a',
            q2: 'b',
            q3: 'c'
        };
        let score = 0;
        for (let [key, value] of formData.entries()) {
            progress.quiz[key] = value === correctAnswers[key];
            if (progress.quiz[key]) score++;
        }
        localStorage.setItem('progress', JSON.stringify(progress));
        updateProgressBar();
        alert(`You scored ${score} / ${Object.keys(correctAnswers).length}`);
    });
}

// ------------------------
// SCHEDULE PAGE INTERACTIVITY
// ------------------------
const scheduleSlots = document.querySelectorAll('.time-slot');
scheduleSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        const date = slot.dataset.date;
        const time = slot.dataset.time;
        // Store booked sessions in localStorage
        let booked = JSON.parse(localStorage.getItem('bookedSessions')) || [];
        const exists = booked.find(b => b.date === date && b.time === time);
        if (!exists) {
            booked.push({date, time});
            localStorage.setItem('bookedSessions', JSON.stringify(booked));
            slot.classList.add('booked');
            alert(`You booked ${date} at ${time}`);
        } else {
            alert('You already booked this slot');
        }
    });
});

// ------------------------
// DASHBOARD: Show Booked Sessions
// ------------------------
const dashboardBookedList = document.getElementById('dashboardBookedList');
if (dashboardBookedList) {
    const booked = JSON.parse(localStorage.getItem('bookedSessions')) || [];
    dashboardBookedList.innerHTML = booked.map(b => `<li>${b.date} - ${b.time}</li>`).join('');
}

// ------------------------
// DASHBOARD: Update Progress Bar
// ------------------------
updateProgressBar();
