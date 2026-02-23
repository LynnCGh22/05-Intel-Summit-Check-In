// DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50; // Maximum number of attendees


// Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get form values
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text; // Get the text of the selected option


    console.log(name, team, teamName); // Log the values to the console (for testing)

    // Increment the count
    count++;
    console.log("Total check-ins: ", count);

    // Update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    console.log('Progress: ${percentage}'); // Log the progress percentage to the console (for testing)

    // Update team counter
    const teamCounter = document.getElementById(team + "Count");
    const current = parseInt(teamCounter.textContent) + 1; // Get the current count for the team
    
});
