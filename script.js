// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendanceBar = document.getElementById("attendanceBar"); 
const removeBtn = document.getElementById("removeLast");
const greetingMessage = document.getElementById("greetingMessage");

// Track attendance
let count = 0; // Start with zero attendees
let attendees = []; // store objects like { name: "Lynn", team: "water" }
const maxCount = 50; // Maximum number of attendees

// Handle form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  if (!name || !team) return; 
  if (attendees.length >= maxCount) { 
    alert("Maximum number of attendees reached."); 
    return;
  }

  
  console.log(`Attendee Name: ${name}, Team: ${team}`);

  // Increment count and check if it exceeds the maximum
  count++;
  if (count > maxCount) {
    alert("Maximum number of attendees reached. Cannot check in more people.");
    count--; // Decrement count back to the previous value
    return; // Exit the function to prevent further processing
  }
  console.log("Total check-ins: ", count);

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log("Progress: ", `${percentage}`);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  console.log(teamCounter);
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1; // Increment team count by one

  // Show welcome message
  const message = `Welcome, ${name}! You have checked in for the ${teamName} team.`;
  greetingMessage.textContent = message;
  console.log(message);

  // Add attendee to the list
  attendees.push({ name, team });

  // Update team counter 
  let selectedTeamCounter = document.getElementById(team + "Count");
  selectedTeamCounter.textContent = parseInt(selectedTeamCounter.textContent) + 1; 
  // Update progress bar 
  updateProgressBar();

  // Clear form inputs
  form.reset();

  });

  



