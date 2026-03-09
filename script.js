// script.js — booking sync for Schedule_Page.html and Student_Dashboard.html
(() => {
    const KEY = 'bb_bookings';

    function getBookings() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }
    function saveBookings(b) {
        localStorage.setItem(KEY, JSON.stringify(b));
        window.dispatchEvent(new CustomEvent('bookings-updated'));
    }

    function makeId(day, time) {
        return `${day}||${time}`;
    }

    function renderScheduleSlots() {
        const slots = document.querySelectorAll('.slot');
        if (!slots.length) return;
        const bookings = getBookings();
        const bookedIds = new Set(bookings.map(b => b.id));

        slots.forEach(btn => {
            const day = btn.dataset.day;
            const time = btn.dataset.time;
            const id = makeId(day, time);
            btn.dataset.id = id;

            // reflect booked state
            if (bookedIds.has(id)) {
                btn.classList.add('booked');
                btn.disabled = true;
                btn.textContent = `${time} — Booked`;
            } else {
                // restore default text (in case of page re-render)
                if (!btn.classList.contains('booked')) {
                    btn.textContent = time;
                }
                btn.disabled = false;
                btn.classList.remove('booked');
            }

            // click to book
            btn.onclick = () => {
                if (btn.disabled) return;
                const bookingsNow = getBookings();
                if (bookingsNow.find(b => b.id === id)) {
                    // already booked (race)
                    renderAllLists();
                    return;
                }
                bookingsNow.push({ id, day, time, created: Date.now() });
                saveBookings(bookingsNow);
                renderAllLists();
            };
        });
    }

    function renderBookingList() {
        const el = document.getElementById('booking-list');
        if (!el) return;
        const bookings = getBookings();
        el.innerHTML = '';
        if (!bookings.length) {
            el.innerHTML = '<li>No sessions booked yet.</li>';
            return;
        }
        bookings.forEach(b => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = `${b.day} — ${b.time}`;
            const btn = document.createElement('button');
            btn.textContent = '✖';
            btn.title = 'Cancel booking';
            btn.setAttribute('aria-label','Cancel booking');
            btn.className = 'cancel-booking';
            btn.onclick = (e) => {
                e.stopPropagation();
                const remaining = getBookings().filter(x => x.id !== b.id);
                saveBookings(remaining);
                renderAllLists();
            };
            li.appendChild(span);
            li.appendChild(btn);
            el.appendChild(li);
        });
    }

    function renderDashboardList() {
        // support both dashboard-bookings (if present) and booked-sessions used in Student_Dashboard.html
        const el = document.getElementById('dashboard-bookings') || document.getElementById('booked-sessions');
        if (!el) return;
        const bookings = getBookings();
        el.innerHTML = '';
        if (!bookings.length) {
            el.innerHTML = '<li>No sessions booked yet.</li>';
            return;
        }
        bookings.forEach(b => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = `${b.day} — ${b.time}`;
            const btn = document.createElement('button');
            btn.textContent = '✖';
            btn.title = 'Cancel booking';
            btn.setAttribute('aria-label','Cancel booking');
            btn.className = 'cancel-booking';
            btn.onclick = (e) => {
                e.stopPropagation();
                const remaining = getBookings().filter(x => x.id !== b.id);
                saveBookings(remaining);
                renderAllLists();
            };
            li.appendChild(span);
            li.appendChild(btn);
            el.appendChild(li);
        });
    }

    function renderAllLists() {
        renderScheduleSlots();
        renderBookingList();
        renderDashboardList();
    }

    window.addEventListener('storage', (e) => {
        if (e.key === KEY) renderAllLists();
    });

    window.addEventListener('bookings-updated', renderAllLists);
    document.addEventListener('DOMContentLoaded', renderAllLists);
})();

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

// ===== ByteBridge Quiz Grader =====
function gradeQuiz(){

    const correct = ["b","b","c","a"];
    let score = 0;

    const form = document.getElementById("quiz-form");

    if(!form){
        console.log("Quiz form not found");
        return;
    }

    const data = new FormData(form);

    let i = 0;
    for (let value of data.values()){
        if(value === correct[i]){
            score++;
        }
        i++;
    }

    const result = document.getElementById("quiz-result");

    result.innerHTML =
        `<h3>Score: ${score}/4</h3>` +
        (score === 4
            ? "🔥 Perfect — You're ByteBridge Certified!"
            : score >= 2
            ? "👍 Solid work — review weak spots!"
            : "📘 Keep learning and retry!"
        );
}

