/* =========================================
   ByteBridge Unified JavaScript
   Handles Dark Mode, Progress, Quiz, Schedule
============================================= */

/* -------- Dark Mode Toggle -------- */
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        // Save preference in localStorage
        if(document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark');
}

/* -------- Dashboard Progress Tracking -------- */
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    // Get completed activities from localStorage
    let completed = JSON.parse(localStorage.getItem('completedActivities') || '[]');
    let total = JSON.parse(localStorage.getItem('allActivities') || '["HTML","CSS","JS","Project"]');

    const percent = Math.round((completed.length / total.length) * 100);
    progressBar.style.width = percent + '%';
}

// Call on Dashboard load
updateProgress();

/* -------- Resources Quiz -------- */
function initQuiz() {
    const quizForm = document.getElementById('resources-quiz');
    if (!quizForm) return;

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let score = 0;
        const totalQuestions = quizForm.querySelectorAll('fieldset').length;

        quizForm.querySelectorAll('fieldset').forEach(fieldset => {
            const correct = fieldset.dataset.correct;
            const selected = fieldset.querySelector('input:checked');
            if (selected && selected.value === correct) score++;
        });

        alert(`You scored ${score} / ${totalQuestions}`);

        // Mark all questions as completed in localStorage
        const completed = JSON.parse(localStorage.getItem('completedActivities') || '[]');
        if (!completed.includes('Quiz')) {
            completed.push('Quiz');
            localStorage.setItem('completedActivities', JSON.stringify(completed));
        }

        // Update dashboard progress
        updateProgress();
    });
}

initQuiz();

/* -------- Schedule Page -------- */
function initSchedule() {
    const scheduleButtons = document.querySelectorAll('.schedule-btn');
    if (!scheduleButtons.length) return;

    scheduleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const session = btn.dataset.session;
            let signups = JSON.parse(localStorage.getItem('scheduledSessions') || '[]');

            if (!signups.includes(session)) signups.push(session);
            localStorage.setItem('scheduledSessions', JSON.stringify(signups));

            alert(`Signed up for: ${session}`);
        });
    });
}

initSchedule();

/* -------- Display Schedule on Dashboard -------- */
function displayScheduledSessions() {
    const dashboardSessions = document.getElementById('dashboard-sessions');
    if (!dashboardSessions) return;

    let signups = JSON.parse(localStorage.getItem('scheduledSessions') || '[]');
    if (signups.length === 0) {
        dashboardSessions.textContent = 'No upcoming sessions.';
    } else {
        dashboardSessions.innerHTML = '';
        signups.forEach(session => {
            const li = document.createElement('li');
            li.textContent = session;
            dashboardSessions.appendChild(li);
        });
    }
}

// Call on Dashboard load
displayScheduledSessions();

/* -------- Track activity clicks to mark progress -------- */
document.querySelectorAll('.track-progress').forEach(link => {
    link.addEventListener('click', () => {
        let completed = JSON.parse(localStorage.getItem('completedActivities') || '[]');
        const activity = link.dataset.activity;
        if (activity && !completed.includes(activity)) {
            completed.push(activity);
            localStorage.setItem('completedActivities', JSON.stringify(completed));
            updateProgress();
        }
    });
});
