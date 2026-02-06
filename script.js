// ==========================
// ByteBridge Unified Script
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------
    // Dark Mode Toggle
    // --------------------------
    const themeBtn = document.getElementById("theme-toggle");
    themeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    // Persist dark mode
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        themeBtn.textContent = "☀️";
    }

    // --------------------------
    // Resources Page Quiz
    // --------------------------
    const quizForm = document.getElementById("resources-quiz");
    if (quizForm) {
        quizForm.addEventListener("submit", e => {
            e.preventDefault();
            let score = 0;
            const fieldsets = quizForm.querySelectorAll("fieldset");
            fieldsets.forEach(fs => {
                const correct = fs.dataset.correct;
                const checked = fs.querySelector("input[type=radio]:checked");
                if (checked && checked.value === correct) score++;
            });
            const resultDiv = document.getElementById("quiz-result");
            resultDiv.textContent = `You scored ${score} / ${fieldsets.length}`;
            resultDiv.style.color = score === fieldsets.length ? "green" : "orange";

            // Mark completion for dashboard
            localStorage.setItem("quizCompleted", score === fieldsets.length ? "true" : "false");
        });
    }

    // --------------------------
    // Tutorial Completion Buttons
    // --------------------------
    const tutorialButtons = document.querySelectorAll(".mark-complete");
    tutorialButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            localStorage.setItem(`tutorial-${id}`, "completed");
            btn.textContent = "✅ Completed";
            updateDashboard();
        });

        // Show completed state if already done
        const id = btn.dataset.id;
        if (localStorage.getItem(`tutorial-${id}`) === "completed") {
            btn.textContent = "✅ Completed";
        }
    });

    // --------------------------
    // Schedule Page Buttons
    // --------------------------
    const scheduleBtns = document.querySelectorAll(".schedule-btn");
    scheduleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const session = btn.dataset.session;
            localStorage.setItem(`session-${session}`, "booked");
            btn.textContent = "✅ Booked";
            updateDashboard();
        });

        // Pre-mark booked sessions
        const session = btn.dataset.session;
        if (localStorage.getItem(`session-${session}`) === "booked") {
            btn.textContent = "✅ Booked";
        }
    });

    // --------------------------
    // Dashboard Progress Tracking
    // --------------------------
    function updateDashboard() {
        const progressBar = document.getElementById("progressBar");
        const activityList = document.getElementById("activityList");
        const sessionList = document.getElementById("dashboard-sessions");

        if (!progressBar) return;

        let completed = 0;
        const activities = [];

        // Count tutorial completions
        document.querySelectorAll(".mark-complete").forEach(btn => {
            const id = btn.dataset.id;
            if (localStorage.getItem(`tutorial-${id}`) === "completed") {
                completed++;
                activities.push(`Completed: ${id}`);
            }
        });

        // Quiz completion
        if (localStorage.getItem("quizCompleted") === "true") {
            completed++;
            activities.push("Completed: Quiz");
        }

        // Count booked sessions
        const sessions = [];
        document.querySelectorAll(".schedule-btn").forEach(btn => {
            const session = btn.dataset.session;
            if (localStorage.getItem(`session-${session}`) === "booked") {
                completed++;
                sessions.push(session);
            }
        });

        // Calculate % progress
        const totalItems = document.querySelectorAll(".mark-complete").length + 1 + document.querySelectorAll(".schedule-btn").length;
        const percent = totalItems ? Math.min(100, Math.round((completed / totalItems) * 100)) : 0;
        progressBar.style.width = `${percent}%`;

        // Update dashboard lists
        if (activityList) {
            activityList.innerHTML = activities.map(a => `<li>${a}</li>`).join("");
        }
        if (sessionList) {
            sessionList.innerHTML = sessions.map(s => `<li>${s}</li>`).join("");
        }
    }

    // Initial dashboard update
    updateDashboard();
});
