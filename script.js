// DARK MODE
function toggleMode(){
    document.body.classList.toggle("dark");
    localStorage.setItem("mode",
        document.body.classList.contains("dark"));
}

window.onload = () => {
    if(localStorage.getItem("mode")==="true")
        document.body.classList.add("dark");
}

/* QUIZ */

function gradeQuiz(){
    let score=0;
    if(document.querySelector('input[name=q1]:checked')?.value==="b") score++;
    if(document.querySelector('input[name=q2]:checked')?.value==="a") score++;

    document.getElementById("result").innerText=
        "Score: "+score+"/2";

    updateProgress(score*50);
}

/* PROGRESS STORAGE */

function updateProgress(val){
    localStorage.setItem("progress",val);
}

function loadProgress(){
    let val=localStorage.getItem("progress")||0;
    document.getElementById("bar").style.width=val+"%";
    document.getElementById("label").innerText=val+"% Complete";
}

/* SCHEDULING */

function book(btn){
    btn.innerText="Booked ✔";
    btn.disabled=true;
}
