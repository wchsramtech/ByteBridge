// =============================
// BYTEBRIDGE CORE SCRIPT
// Dark Mode + Quiz Logic
// =============================

// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("theme-toggle");

    if(toggle){

        // Load saved theme
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
    }
});


// Quiz Grader
function gradeQuiz(){

    const answers = ["b","b","c","a"];
    let score = 0;

    for(let i=1;i<=4;i++){
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if(selected && selected.value === answers[i-1]){
            score++;
        }
    }

    const result = document.getElementById("quiz-result");

    if(result){
        result.innerHTML =
            `<h3>Score: ${score}/4</h3>` +
            (score === 4
                ? "🔥 Outstanding — Mastery demonstrated!"
                : score >= 2
                ? "👍 Solid understanding — review weak areas."
                : "📘 Keep practicing and retry!");
    }
}

