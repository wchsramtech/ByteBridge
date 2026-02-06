// ===============================
// ByteBridge Global Script Engine
// Tracks user interaction progress
// Uses browser LocalStorage
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

// PROGRESS SYSTEM
function getProgress(){
    return JSON.parse(localStorage.getItem("bb_progress") || "{}");
}

function setProgress(key){
    let p = getProgress();
    p[key] = true;
    localStorage.setItem("bb_progress", JSON.stringify(p));
}

function calcPercent(){
    const p = getProgress();
    const total = 3; // quiz + video + schedule
    let score = 0;
    if(p.quiz) score++;
    if(p.video) score++;
    if(p.schedule) score++;
    return Math.round((score/total)*100);
}

// VIDEO TRACK
document.querySelectorAll("iframe").forEach(v=>{
    v.addEventListener("mouseenter",()=>setProgress("video"));
});

// QUIZ FUNCTION
function gradeQuiz(){
    let score = 0;
    if(document.querySelector('input[name=q1]:checked')?.value==="b") score++;
    if(document.querySelector('input[name=q2]:checked')?.value==="c") score++;
    if(document.querySelector('input[name=q3]:checked')?.value==="a") score++;
    document.getElementById("quizResult").innerHTML = `Score: ${score}/3`;
    setProgress("quiz");
    loadDashboard();
}

// SCHEDULE TRACK
function bookedSession(){
    alert("Session Booked!");
    setProgress("schedule");
    loadDashboard();
}

// DASHBOARD UPDATE
function loadDashboard(){
    const percent = calcPercent();
    const bar = document.getElementById("progressFill");
    const text = document.getElementById("progressText");
    if(bar) bar.style.width = percent + "%";
    if(text) text.innerText = percent + "% Complete";
}

window.onload = loadDashboard;
