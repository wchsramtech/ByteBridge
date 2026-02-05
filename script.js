// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Example booking function for schedule page
function book(button) {
    alert(`You booked: ${button.textContent}`);
}

// Example quiz grading
function gradeQuiz() {
    const answers = {
        q1: 'b',
        q2: 'b',
        q3: 'c',
        q4: 'a'
    };
    let score = 0;
    for (let q in answers) {
        const selected = document.querySelector(`input[name=${q}]:checked`);
        if (selected && selected.value === answers[q]) score++;
    }
    document.getElementById('quiz-result').textContent = `Score: ${score}/4`;
}
