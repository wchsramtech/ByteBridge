// script.js

// =================== DARK / LIGHT MODE ===================
const themeToggle = document.getElementById('theme-toggle');

function loadTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme','dark');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('theme','light');
        themeToggle.textContent = '🌙';
    }
});

loadTheme();

// =================== SCHEDULE INTERACTIVITY ===================
const bookedSessions = JSON.parse(localStorage.getItem('bookedSessions') || '[]');

function renderSchedule() {
    const calendars = document.querySelectorAll('.calendar');
    calendars.forEach(cal => {
        const times = ['3:30 PM','4:00 PM','4:30 PM','5:00 PM'];
        const container = document.createElement('div');
        times.forEach(time => {
            const btn = document.createElement('button');
            btn.textContent = time;
            btn.className = 'schedule-btn';
            // Highlight if already booked
            if(bookedSessions.includes(time)) btn.classList.add('booked');
            btn.addEventListener('click', ()=> {
                if(!bookedSessions.includes(time)) {
                    bookedSessions.push(time);
                    btn.classList.add('booked');
                    localStorage.setItem('bookedSessions', JSON.stringify(bookedSessions));
                    updateDashboardProgress();
                }
            });
            container.appendChild(btn);
        });
        cal.appendChild(container);
    });
}

renderSchedule();

// =================== DASHBOARD PROGRESS ===================
function updateDashboardProgress() {
    const totalItems = document.querySelectorAll('.track-progress-item').length;
    let completed = 0;

    // Videos
    document.querySelectorAll('iframe').forEach(vid => {
        if(localStorage.getItem(vid.src+'watched') === 'true') completed++;
    });

    // PDFs
    document.querySelectorAll('.pdf-btn').forEach(pdf => {
        if(localStorage.getItem(pdf.dataset.pdf+'opened') === 'true') completed++;
    });

    // Quizzes
    document.querySelectorAll('.quiz-question').forEach(q => {
        if(localStorage.getItem(q.dataset.question+'answered') === 'true') completed++;
    });

    // Booked sessions
    const bookedCount = JSON.parse(localStorage.getItem('bookedSessions') || '[]').length;
    completed += bookedCount;

    const progressBar = document.getElementById('progressBar');
    if(progressBar) {
        const pct = Math.min(100, Math.floor((completed/totalItems)*100));
        progressBar.style.width = pct+'%';
    }
}

updateDashboardProgress();

// =================== VIDEO & PDF TRACKING ===================
document.querySelectorAll('iframe').forEach(vid => {
    vid.addEventListener('load', ()=> {
        vid.addEventListener('click', ()=> {
            localStorage.setItem(vid.src+'watched','true');
            updateDashboardProgress();
        });
    });
});

document.querySelectorAll('.pdf-btn').forEach(pdf => {
    pdf.addEventListener('click', ()=> {
        localStorage.setItem(pdf.dataset.pdf+'opened','true');
        updateDashboardProgress();
    });
});

// =================== QUIZ SUBMISSION ===================
const submitQuizBtn = document.getElementById('submit-quiz');
if(submitQuizBtn){
    submitQuizBtn.addEventListener('click', ()=>{
        let correct = 0;
        document.querySelectorAll('.quiz-question').forEach(q=>{
            const selected = document.querySelector('input[name="'+q.dataset.question+'"]:checked');
            if(selected && selected.value === q.dataset.correct) correct++;
            localStorage.setItem(q.dataset.question+'answered','true');
        });
        alert('You scored '+correct+' out of '+document.querySelectorAll('.quiz-question').length);
        updateDashboardProgress();
    });
}
