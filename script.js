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

// ===== DARK MODE TOGGLE (Reliable Version) =====

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("theme-toggle");

    if(!toggle) return;

    // Load saved preference
    if(localStorage.getItem("darkMode") === "on"){
        document.body.classList.add("dark-mode");
    }

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if(document.body.classList.contains("dark-mode")){
            localStorage.setItem("darkMode","on");
        } else {
            localStorage.setItem("darkMode","off");
        }
    });

});
