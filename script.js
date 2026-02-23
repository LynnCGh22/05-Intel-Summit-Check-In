// DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendanceBar = document.getElementById("attendanceBar");
const greetingMessage = document.getElementById("greetingMessage");

// Attendance tracking
let attendees = [];
const maxCount = 50;

  // Update progress bar
  function updateProgressBar() {
      const count = attendees.length;
      const percentage = Math.round((count / maxCount) * 100);

      attendanceBar.style.width = percentage + "%";
      attendanceBar.textContent = `${count} / ${maxCount} Attendees`;
      attendanceBar.setAttribute("aria-valuenow", count); 
    }

// Handle form submission
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value; // "water", "netzero", "renewables"
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  if (!name || !team) return;

  // Check max
  if (attendees.length >= maxCount) {
    alert("Maximum number of attendees reached.");
    return;
  }

  // Add attendee
  attendees.push({ name, team });

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Update progress bar
  updateProgressBar();

  // Greeting
  greetingMessage.textContent = `Welcome, ${name}! You have checked in for the ${teamName} team.`;

  // Reset form
  form.reset();
});
