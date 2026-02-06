// ===== Theme Toggle =====
const themeBtn = document.getElementById('theme-toggle');
if(themeBtn){
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
}

// ===== Username Display =====
const username = localStorage.getItem('username') || 'Student';
document.getElementById('username-display').textContent = username;

// ===== Tutorial Progress Data =====
const tutorials = [
    {title: 'Intro to HTML', id: 'html'},
    {title: 'Styling with CSS', id: 'css'},
    {title: 'JavaScript Basics', id: 'js'},
    {title: 'Web Design Project', id: 'wd'}
];

// Load progress from localStorage
let progress = JSON.parse(localStorage.getItem('progress')) || {};

// Render progress cards
const container = document.getElementById('progress-container');

tutorials.forEach(tut => {
    const card = document.createElement('div');
    card.classList.add('tutorial-card','card');

    const title = document.createElement('h3');
    title.textContent = tut.title;

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');

    const progressFill = document.createElement('div');
    progressFill.classList.add('progress-fill');
    progressFill.style.width = progress[tut.id] ? '100%' : '0%';
    progressFill.textContent = progress[tut.id] ? 'Complete' : '0%';

    progressBar.appendChild(progressFill);

    const completeBtn = document.createElement('button');
    completeBtn.textContent = progress[tut.id] ? 'Reset' : 'Mark Complete';
    completeBtn.onclick = () => {
        if(progress[tut.id]){
            delete progress[tut.id];
        } else {
            progress[tut.id] = true;
        }
        localStorage.setItem('progress', JSON.stringify(progress));
        renderDashboard(); // Re-render
    };

    card.appendChild(title);
    card.appendChild(progressBar);
    card.appendChild(completeBtn);
    container.appendChild(card);
});

// ===== Function to re-render dashboard =====
function renderDashboard(){
    container.innerHTML = '';
    tutorials.forEach(tut => {
        const card = document.createElement('div');
        card.classList.add('tutorial-card','card');

        const title = document.createElement('h3');
        title.textContent = tut.title;

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');

        const progressFill = document.createElement('div');
        progressFill.classList.add('progress-fill');
        progressFill.style.width = progress[tut.id] ? '100%' : '0%';
        progressFill.textContent = progress[tut.id] ? 'Complete' : '0%';

        progressBar.appendChild(progressFill);

        const completeBtn = document.createElement('button');
        completeBtn.textContent = progress[tut.id] ? 'Reset' : 'Mark Complete';
        completeBtn.onclick = () => {
            if(progress[tut.id]){
                delete progress[tut.id];
            } else {
                progress[tut.id] = true;
            }
            localStorage.setItem('progress', JSON.stringify(progress));
            renderDashboard();
        };

        card.appendChild(title);
        card.appendChild(progressBar);
        card.appendChild(completeBtn);
        container.appendChild(card);
    });

    renderBookedSessions();
}

// ===== Render Booked Sessions from Schedule Page =====
function renderBookedSessions(){
    const bookedList = document.getElementById('booked-sessions');
    bookedList.innerHTML = '';

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    if(bookings.length === 0){
        bookedList.innerHTML = '<li>No sessions booked yet.</li>';
        return;
    }

    bookings.forEach((b, index) => {
        const li = document.createElement('li');
        li.textContent = `${b.day} - ${b.time}`;
        bookedList.appendChild(li);
    });
}

// Initial Render
renderDashboard();
