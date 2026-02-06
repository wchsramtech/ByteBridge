// ===== Dark / Light Mode =====
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// ===== Progress Bar =====
const progressBar = document.getElementById('progressBar');
let progress = JSON.parse(localStorage.getItem('progress')) || 0;

function updateProgress(amount) {
    progress += amount;
    if(progress > 100) progress = 100;
    localStorage.setItem('progress', progress);
    if(progressBar) progressBar.style.width = `${progress}%`;
}

// Initialize progress on page load
if(progressBar) progressBar.style.width = `${progress}%`;

// ===== Quiz Handling =====
const quizForm = document.getElementById('quizForm');
if(quizForm){
    quizForm.addEventListener('submit', function(e){
        e.preventDefault();
        const answers = { q1:'b', q2:'a', q3:'c', q4:'b', q5:'a' }; // Extend to 5 questions
        let score = 0;

        Object.keys(answers).forEach(q=>{
            const val = quizForm[q].value;
            if(val === answers[q]) score++;
        });

        alert(`You scored ${score} out of ${Object.keys(answers).length}`);
        if(score > 0) updateProgress(10); // Increment progress
    });
}

// ===== Schedule Booking =====
const liveSlots = document.getElementById('live-sessions');
const groupSlots = document.getElementById('group-sessions');
let bookedSessions = JSON.parse(localStorage.getItem('bookedSessions')) || [];

function createSlots(container, times, type){
    times.forEach(time=>{
        const btn = document.createElement('button');
        btn.textContent = time;
        btn.className = bookedSessions.includes(`${type}|${time}`) ? 'booked' : '';
        btn.addEventListener('click', ()=>{
            const key = `${type}|${time}`;
            if(!bookedSessions.includes(key)){
                bookedSessions.push(key);
                localStorage.setItem('bookedSessions', JSON.stringify(bookedSessions));
                btn.classList.add('booked');
                updateProgress(5); // Update progress for booking
                alert(`Session booked: ${time}`);
            } else {
                alert('You already booked this session.');
            }
        });
        container.appendChild(btn);
    });
}

if(liveSlots){
    createSlots(liveSlots, ['3:30 PM','4:00 PM','4:30 PM'], 'Live');
}
if(groupSlots){
    createSlots(groupSlots, ['3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM'], 'Group');
}

// ===== Dashboard Display =====
const dashboardProgressBar = document.getElementById('progressBar');
if(dashboardProgressBar) dashboardProgressBar.style.width = `${progress}%`;

const dashboardSessions = document.querySelector('#dashboard-sessions');
if(dashboardSessions && bookedSessions.length){
    dashboardSessions.innerHTML = '';
    bookedSessions.forEach(session=>{
        const [type, time] = session.split('|');
        const li = document.createElement('li');
        li.textContent = `${type} Tutoring: ${time}`;
        dashboardSessions.appendChild(li);
    });
}

// ===== Track Resource Clicks =====
document.querySelectorAll('.track-progress-resource').forEach(el=>{
    el.addEventListener('click', ()=>{
        updateProgress(5); // Increment progress for viewing a resource
    });
});
