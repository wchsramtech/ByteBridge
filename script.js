/* ==============================
   ByteBridge - Final Script
   Handles Dark Mode, Quiz, Schedule, Progress
   ============================== */

// ---------- Dark Mode Toggle ----------
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "dark-mode",
      document.body.classList.contains("dark-mode")
    );
  });

  // Load saved theme
  if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark-mode");
  }
}

// ---------- Progress Tracking ----------
const progressBar = document.getElementById("progressBar");
let progressPoints = 0;
let totalPoints = 0;

// Update progress bar
function updateProgress() {
  if (!progressBar) return;
  const percent = totalPoints ? Math.min((progressPoints / totalPoints) * 100, 100) : 0;
  progressBar.style.width = percent + "%";
}

// ---------- Interactive Quiz ----------
const quizData = [
  {
    question: "HTML stands for?",
    options: ["HyperText Markup Language", "HighText Machine Language", "HyperTabular Markup Language"],
    answer: 0,
  },
  {
    question: "Which tag is used for a paragraph?",
    options: ["<p>", "<div>", "<span>"],
    answer: 0,
  },
  {
    question: "CSS is used to?",
    options: ["Style webpages", "Structure content", "Add images"],
    answer: 0,
  },
  {
    question: "JavaScript can manipulate?",
    options: ["HTML DOM", "Server files", "Images only"],
    answer: 0,
  },
  {
    question: "The <a> tag is for?",
    options: ["Links", "Buttons", "Tables"],
    answer: 0,
  },
];

// Render quiz if quiz container exists
const quizContainer = document.getElementById("quizContainer");
if (quizContainer) {
  totalPoints += quizData.length; // Each question = 1 point

  quizData.forEach((q, i) => {
    const qDiv = document.createElement("div");
    qDiv.className = "quiz-question";
    qDiv.innerHTML = `<p>${i + 1}. ${q.question}</p>`;
    q.options.forEach((opt, j) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        if (btn.dataset.answered) return;
        btn.dataset.answered = true;
        if (j === q.answer) {
          btn.style.backgroundColor = "green";
          progressPoints++;
        } else {
          btn.style.backgroundColor = "red";
        }
        // Mark all options disabled
        qDiv.querySelectorAll("button").forEach(b => (b.disabled = true));
        updateProgress();
      });
      qDiv.appendChild(btn);
    });
    quizContainer.appendChild(qDiv);
  });
}

// ---------- Video & PDF Click Tracking ----------
document.querySelectorAll("iframe, button").forEach(el => {
  if (el.tagName === "IFRAME") {
    el.addEventListener("click", () => {
      progressPoints++;
      totalPoints++;
      updateProgress();
    });
  } else if (el.tagName === "BUTTON") {
    el.addEventListener("click", () => {
      // Only count resource buttons for PDFs/Links
      if (!el.classList.contains("primary")) {
        progressPoints++;
        totalPoints++;
        updateProgress();
      }
    });
  }
});

// ---------- Interactive Schedule ----------
let bookedSessions = JSON.parse(localStorage.getItem("bookedSessions") || "[]");

function renderSchedule() {
  const liveContainer = document.getElementById("calendar-live");
  const groupContainer = document.getElementById("calendar-group");
  if (!liveContainer || !groupContainer) return;

  const daysLive = ["Mon", "Wed", "Thu"];
  const daysGroup = ["Tue", "Thu"];
  const timesLive = "3:30 PM - 5:00 PM";
  const timesGroup = "3:00 PM - 6:00 PM";

  liveContainer.innerHTML = "";
  groupContainer.innerHTML = "";

  daysLive.forEach(d => {
    const btn = document.createElement("button");
    btn.textContent = `${d} • ${timesLive}`;
    btn.addEventListener("click", () => bookSession(d, timesLive));
    liveContainer.appendChild(btn);
  });

  daysGroup.forEach(d => {
    const btn = document.createElement("button");
    btn.textContent = `${d} • ${timesGroup}`;
    btn.addEventListener("click", () => bookSession(d, timesGroup));
    groupContainer.appendChild(btn);
  });
}

function bookSession(day, time) {
  const session = { day, time };
  bookedSessions.push(session);
  localStorage.setItem("bookedSessions", JSON.stringify(bookedSessions));
  alert(`Booked ${day} ${time}`);
  updateDashboard();
  progressPoints++;
  totalPoints++;
  updateProgress();
}

// ---------- Dashboard Display ----------
function updateDashboard() {
  const dashboardContainer = document.getElementById("dashboard-sessions");
  if (!dashboardContainer) return;
  dashboardContainer.innerHTML = "";

  if (!bookedSessions.length) {
    dashboardContainer.innerHTML = "<p>No booked sessions yet.</p>";
    return;
  }

  bookedSessions.forEach(s => {
    const p = document.createElement("p");
    p.textContent = `${s.day} • ${s.time}`;
    dashboardContainer.appendChild(p);
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderSchedule();
  updateDashboard();
  updateProgress();
});
