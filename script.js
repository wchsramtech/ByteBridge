// ===============================
// ByteBridge Unified Script
// Handles Dark Mode, Progress, Quiz, and Schedule
// ===============================

// ===== DARK MODE TOGGLE =====
const toggle = document.getElementById("theme-toggle");
if (toggle) {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("bb_theme", document.body.classList.contains("dark"));
    });
    if (localStorage.getItem("bb_theme") === "true") {
        document.body.classList.add("dark");
    }
}

// ===== GLOBAL STORAGE =====
function getProgress() {
    return JSON.parse(localStorage.getItem("bb_progress") || "{}");
}

function setProgress(key) {
    let progress = getProgress();
    progress[key] = true;
    localStorage.setItem("bb_progress", JSON.stringify(progress));
}

function getSessions() {
    return JSON.parse(localStorage.getItem("bb_sessions") || "[]");
}

function addSession(time) {
    let sessions = getSessions();
    if (!sessions.includes(time)) {
        sessions.push(time);
        localStorage.setItem("bb_sessions", JSON.stringify(sessions));
        setProgress("schedule");
        displaySessions();
        updateProgressBar();
    }
}

// ===== PROGRESS CALCULATION =====
function calculateProgress() {
    const p = getProgress();
    const totalTasks = 3; // quiz, video, schedule
    let completed = 0;
    if (p.quiz) completed++;
    if (p.video) completed++;
    if (p.schedule) completed++;
    return Math.round((completed / totalTasks) * 100);
}

function updateProgressBar() {
    const percent = calculateProgress();
    const bar = document.getElementById("progressFill");
    const text = document.getElementById("progressText");
    if (bar) bar.style.width = percent + "%";
    if (text) text.innerText = percent + "% Complete";
}

// ===== VIDEO TRACKING =====
document.querySelectorAll("iframe").forEach(video => {
    video.addEventListener("mouseenter", () => {
        setProgress("video");
        updateProgressBar();
    });
});

// ===== QUIZ HANDLER =====
function gradeQuiz() {
    let score = 0;
    // Update these answers to match your quiz questions
    if (document.querySelector('input[name="q1"]:checked')?.value === "b") score++;
    if (document.querySelector('input[name="q2"]:checked')?.value === "c") score++;
    if (document.querySelector('input[name="q3"]:checked')?.value === "a") score++;

    const result = document.getElementById("quizResult");
    if (result) result.innerText = `Score: ${score}/3`;

    setProgress("quiz");
    updateProgressBar();
}

// ===== SCHEDULE HANDLER =====
function initSchedule() {
    const buttons = document.querySelectorAll(".schedule-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            addSession(btn.dataset.time);
        });
    });
    displaySessions();
}

function displaySessions() {
    const list = document.getElementById("selectedSessions") || document.getElementById("dashboardSessions");
    if (!list) return;

    list.innerHTML = "";
    const sessions = getSessions();
    sessions.forEach(s => {
        const li = document.createElement("li");
        li.innerText = s;
        list.appendChild(li);
    });
}

// ===== DASHBOARD INITIALIZATION =====
function initDashboard() {
    updateProgressBar();
    displaySessions();
}

// ===== WINDOW ONLOAD =====
window.addEventListener("DOMContentLoaded", () => {
    initSchedule();
    initDashboard();

    // If quiz submit button exists
    const quizBtn = document.getElementById("quizSubmit");
    if (quizBtn) {
        quizBtn.addEventListener("click", gradeQuiz);
    }
});
