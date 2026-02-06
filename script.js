// ===============================
// ByteBridge Global Script
// Tracks progress and schedule
// ===============================

// THEME TOGGLE
const toggle = document.getElementById("theme-toggle");
if(toggle){
    toggle.onclick = () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("bb_theme",
            document.body.classList.contains("dark"));
    };
    if(localStorage.getItem("bb_theme") === "true"){
        document.body.classList.add("dark");
    }
}

// ======== PROGRESS STORAGE ========
function getProgress(){
    return JSON.parse(localStorage.getItem("bb_progress") || "{}");
}

function setProgress(key){
    let p = getProgress();
    p[key] = true;
    localStorage.setItem("bb_progress", JSON.stringify(p));
}

// ======== CALCULATE PERCENT ========
function calcPercent(){
    const p = getProgress();
    const total = 3; // quiz + video + schedule
    let score = 0;
    if(p.quiz) score++;
    if(p.video) score++;
    if(p.schedule) score++;
    return Math.round((score/total)*100);
}

// ======== VIDEO TRACK ========
document.querySelectorAll("iframe").forEach(v=>{
    v.addEventListener("mouseenter",()=>setProgress("video"));
});

// ======== QUIZ ========
function gradeQuiz(){
    let score = 0;
    if(document.querySelector('input[name=q1]:checked')?.value==="b") score++;
    if(document.querySelector('input[name=q2]:checked')?.value==="c") score++;
    if(document.querySelector('input[name=q3]:checked')?.value==="a") score++;
    document.getElementById("quizResult").innerHTML = `Score: ${score}/3`;
    setProgress("quiz");
    loadDashboard();
}

// ======== SCHEDULE ========
function initSchedule(){
    const buttons = document.querySelectorAll(".schedule-btn");
    buttons.forEach(btn=>{
        btn.addEventListener("click",()=>{
            const time = btn.dataset.time;
            addSession(time);
        });
    });
    displaySessions();
}

function addSession(time){
    let sessions = JSON.parse(localStorage.getItem("bb_sessions") || "[]");
    if(!sessions.includes(time)){
        sessions.push(time);
        localStorage.setItem("bb_sessions", JSON.stringify(sessions));
        setProgress("schedule");
        displaySessions();
        loadDashboard();
    }
}

function displaySessions(){
    const list = document.getElementById("selectedSessions") || document.getElementById("dashboardSessions");
    if(!list) return;
    list.innerHTML = "";
    let sessions = JSON.parse(localStorage.getItem("bb_sessions") || "[]");
    sessions.forEach(s=>{
        const li = document.createElement("li");
        li.textContent = s;
        list.appendChild(li);
    });
}

// ======== DASHBOARD ========
function loadDashboard(){
    const percent = calcPercent();
    const bar = document.getElementById("progressFill");
    const text = document.getElementById("progressText");
    if(bar) bar.style.width = percent + "%";
    if(text) text.innerText = percent + "% Complete";

    displaySessions();
}

// ======== INITIALIZE ========
window.onload = ()=>{
    loadDashboard();
    initSchedule();
}
