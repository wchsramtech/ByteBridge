/* =============================
   Dark Mode Toggle
============================= */
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

/* =============================
   Progress Tracking
============================= */
let progress = {
    videos: {},
    pdfs: {},
    quiz: {}
};

function updateProgressBar() {
    const totalItems = Object.keys(progress.videos).length + Object.keys(progress.pdfs).length + Object.keys(progress.quiz).length;
    const completedItems = Object.values(progress.videos).filter(v => v).length +
        Object.values(progress.pdfs).filter(v => v).length +
        Object.values(progress.quiz).filter(v => v).length;
    const percent = totalItems ? (completedItems / totalItems) * 100 : 0;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = percent + '%';
}

/* -----------------------------
   Track Video Clicks
----------------------------- */
document.querySelectorAll('iframe').forEach((frame, index) => {
    frame.addEventListener('load', () => {
        // Placeholder: consider user clicked to "watch"
        progress.videos[index] = false; // init
    });
});

document.querySelectorAll('.play-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        progress.videos[index] = true;
        updateProgressBar();
    });
});

/* -----------------------------
   Track PDF Clicks
----------------------------- */
document.querySelectorAll('button').forEach(btn => {
    const href = btn.getAttribute('onclick');
    if (href && href.includes('.pdf')) {
        btn.addEventListener('click', () => {
            progress.pdfs[href] = true;
            updateProgressBar();
        });
    }
});

/* =============================
   Quiz Submission & Grading
============================= */
document.querySelectorAll('.quiz-form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(form);
        let correct = 0, total = 0;
        form.querySelectorAll('.quiz-question').forEach((q, idx) => {
            const selected = formData.get('q' + idx);
            if (selected === q.dataset.answer) {
                correct++;
                progress.quiz[idx] = true;
            } else {
                progress.quiz[idx] = false;
            }
            total++;
        });
        updateProgressBar();
        alert(`You scored ${correct} / ${total}`);
    });
});

/* =============================
   Schedule Booking
============================= */
let schedule = JSON.parse(localStorage.getItem('schedule')) || [];

document.querySelectorAll('.calendar-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        const date = cell.dataset.date;
        const time = cell.dataset.time;
        const exists = schedule.find(s => s.date === date && s.time === time);
        if (!exists) {
            schedule.push({ date, time });
            localStorage.setItem('schedule', JSON.stringify(schedule));
            cell.classList.add('booked');
            alert(`Booked session on ${date} at ${time}`);
            updateDashboardSchedule();
        } else {
            alert(`Session already booked`);
        }
    });
});

/* =============================
   Update Dashboard with Booked Sessions
============================= */
function updateDashboardSchedule() {
    const dashboardList = document.getElementById('dashboard-schedule-list');
    if (!dashboardList) return;
    dashboardList.innerHTML = '';
    schedule.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.date} • ${s.time}`;
        dashboardList.appendChild(li);
    });
}

/* Run on page load */
updateDashboardSchedule();
updateProgressBar();

