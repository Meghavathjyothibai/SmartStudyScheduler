// ------------------- LOGIN LOGIC -------------------
const loginBtn = document.getElementById("login-btn");
const loginPassword = document.getElementById("login-password");
const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app");
const loginError = document.getElementById("login-error");

const SECRET_PASSWORD = "study123";

loginBtn.addEventListener("click", () => {
  if (loginPassword.value === SECRET_PASSWORD) {
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
  } else {
    loginError.textContent = "Incorrect password. Try again!";
  }
});

// ------------------- STUDY SCHEDULER -------------------
const subjectInput = document.getElementById("subject");
const priorityInput = document.getElementById("priority");
const hoursInput = document.getElementById("hours");
const deadlineInput = document.getElementById("deadline");
const addSubjectButton = document.getElementById("add-subject");
const generateScheduleButton = document.getElementById("generate-schedule");
const subjectList = document.getElementById("subject-list");
const generatedSchedule = document.getElementById("generated-schedule");

let subjects = [];

addSubjectButton.addEventListener("click", () => {
  const subject = subjectInput.value.trim();
  const priority = priorityInput.value;
  const hours = parseInt(hoursInput.value);
  const deadline = deadlineInput.value;

  if (subject === "" || isNaN(hours) || deadline === "") {
    alert("Please enter all fields correctly.");
    return;
  }

  const selectedDate = new Date(deadline);
  const currentDate = new Date();
  if (selectedDate <= currentDate) {
    alert("Please select a future date.");
    return;
  }

  const subjectItem = {
    subject,
    priority,
    hours,
    deadline,
    completed: false,
  };

  subjects.push(subjectItem);
  displaySubjects();

  subjectInput.value = "";
  priorityInput.value = "top";
  hoursInput.value = "";
  deadlineInput.value = "";
});

function displaySubjects() {
  subjectList.innerHTML = "";

  subjects.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("subject");

    div.innerHTML = `
      <div>
        <strong>${item.subject}</strong><br/>
        Priority: ${item.priority} | Hours: ${item.hours} | Deadline: ${item.deadline}
      </div>
      <label>
        <input type="checkbox" data-index="${index}" ${item.completed ? "checked" : ""}>
        Done
      </label>
    `;

    subjectList.appendChild(div);
  });
}

subjectList.addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    const index = event.target.dataset.index;
    subjects[index].completed = event.target.checked;
  }
});

generateScheduleButton.addEventListener("click", () => {
  if (subjects.length === 0) {
    alert("No subjects to schedule.");
    return;
  }

  const filtered = subjects.filter((s) => !s.completed);

  const sortedSubjects = [...filtered].sort((a, b) => {
    const priorityOrder = { top: 1, middle: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  let output = "<h3>Generated Study Plan:</h3><ul>";
  sortedSubjects.forEach((subj) => {
    output += `<li><strong>${subj.subject}</strong>: Study for ${subj.hours} hour(s) before ${subj.deadline}</li>`;
  });
  output += "</ul>";

  generatedSchedule.innerHTML = output;

  displaySubjects();
});

// Clear completed subjects
document.getElementById("clear-completed").addEventListener("click", () => {
  subjects = subjects.filter((subj) => !subj.completed);
  displaySubjects();
});

// Clear all subjects
document.getElementById("clear-all").addEventListener("click", () => {
  if (confirm("Are you sure you want to remove all subjects?")) {
    subjects = [];
    displaySubjects();
    generatedSchedule.innerHTML = "";
  }
});
