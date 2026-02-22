// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0; // Start with zero attendees
const maxCount = 50; // Maximum number of attendees

// Handle form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;


  console.log(`Attendee Name: ${name}, Team: ${team}`);

  // Increment count and check if it exceeds the maximum
  count++;
  if (count > maxCount) {
    alert("Maximum number of attendees reached. Cannot check in more people.");
    count--; // Decrement count back to the previous value
    return; // Exit the function to prevent further processing
  }
  console.log("Total check-ins: ", count);

});
