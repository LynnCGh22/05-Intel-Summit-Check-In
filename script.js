// DOM elements (queried during init)
var form;
var nameInput;
var teamSelect;
var attendeeCountEl;
var progressBar;
var attendeeListEl;
var waterCountEl;
var netzeroCountEl;
var renewablesCountEl;
var resetCounterBtn;

// Track attendance
let count = 0;
const maxCount = 50; // Maximum number of attendees
let teams = {
  water: 0,
  netzero: 0,
  renewables: 0,
};
let attendees = []; // array of { name, team, teamName }

// Local storage keys
var STORAGE_KEYS = {
  count: "checkin_count",
  teams: "checkin_teams",
  attendees: "checkin_attendees",
};

// Surface fatal errors to the page for easier debugging
function showFatalError(msg) {
  try {
    var greetingEl = document.getElementById("greeting");
    if (greetingEl) {
      greetingEl.textContent = "Error: " + msg;
      greetingEl.classList.add("success-message", "greeting-show");
      return;
    }
    var banner = document.createElement("div");
    banner.style.background = "#ffecec";
    banner.style.color = "#900";
    banner.style.padding = "18px";
    banner.style.fontWeight = "600";
    banner.style.textAlign = "center";
    banner.textContent = "Error: " + msg;
    document.body.insertBefore(banner, document.body.firstChild);
  } catch (e) {
    console.error("Failed to show fatal error", e);
  }
}

window.addEventListener("error", function (ev) {
  console.error("Unhandled error:", ev.error || ev.message || ev);
  showFatalError(ev.error ? ev.error.message : ev.message || String(ev));
});

window.addEventListener("unhandledrejection", function (ev) {
  console.error("Unhandled promise rejection:", ev.reason);
  showFatalError(
    ev.reason ? ev.reason.message || String(ev.reason) : "Promise rejection",
  );
});

// Save current state to localStorage
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.count, String(count));
    localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
    localStorage.setItem(STORAGE_KEYS.attendees, JSON.stringify(attendees));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

// Reset all saved check-in data and UI back to zero
function resetAllData() {
  count = 0;
  teams = {
    water: 0,
    netzero: 0,
    renewables: 0,
  };
  attendees = [];

  if (waterCountEl) waterCountEl.textContent = "0";
  if (netzeroCountEl) netzeroCountEl.textContent = "0";
  if (renewablesCountEl) renewablesCountEl.textContent = "0";

  updateProgressUI();
  renderAttendeeList();

  try {
    localStorage.removeItem(STORAGE_KEYS.count);
    localStorage.removeItem(STORAGE_KEYS.teams);
    localStorage.removeItem(STORAGE_KEYS.attendees);
  } catch (e) {
    console.warn("Could not clear localStorage", e);
  }

  var checkInBtn = document.getElementById("checkInBtn");
  if (checkInBtn) checkInBtn.disabled = false;
  if (nameInput) nameInput.disabled = false;
  if (teamSelect) teamSelect.disabled = false;

  if (form) form.reset();

  var greeting = document.getElementById("greeting");
  if (greeting) {
    greeting.textContent = "Counter reset. You can check in again.";
    greeting.classList.add("success-message", "greeting-show");
  }
}

// Render the attendee list in the DOM
function renderAttendeeList() {
  if (!attendeeListEl) return;
  attendeeListEl.innerHTML = "";
  for (var i = 0; i < attendees.length; i++) {
    var a = attendees[i];
    var li = document.createElement("li");
    li.textContent = a.name;
    var span = document.createElement("span");
    span.className = "attendee-team";
    span.textContent = a.teamName ? " — " + a.teamName : "";
    li.appendChild(span);
    attendeeListEl.appendChild(li);
  }
}

// Update progress bar and attendee counter
function updateProgressUI() {
  if (attendeeCountEl) attendeeCountEl.textContent = String(count);
  if (progressBar) {
    var percentage = Math.round((count / maxCount) * 100) + "%";
    progressBar.style.width = percentage;
    progressBar.setAttribute("aria-valuenow", String(count));
    progressBar.textContent = count + " / " + maxCount + " Attendees";
  }
}

// Load saved state from localStorage
function loadState() {
  try {
    var storedCount = parseInt(localStorage.getItem(STORAGE_KEYS.count), 10);
    if (!isNaN(storedCount)) {
      count = Math.min(storedCount, maxCount);
    }
    var storedTeams = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.teams) || "null",
    );
    if (storedTeams && typeof storedTeams === "object") {
      teams = Object.assign(teams, storedTeams);
    }
    var storedAttendees = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.attendees) || "null",
    );
    if (Array.isArray(storedAttendees)) {
      attendees = storedAttendees;
    }
  } catch (e) {
    console.warn("Could not load saved state", e);
  }

  // Update team counters
  if (waterCountEl) waterCountEl.textContent = String(teams.water || 0);
  if (netzeroCountEl) netzeroCountEl.textContent = String(teams.netzero || 0);
  if (renewablesCountEl)
    renewablesCountEl.textContent = String(teams.renewables || 0);

  // Update progress UI and attendee list
  updateProgressUI();
  renderAttendeeList();

  // Disable form if at capacity
  if (count >= maxCount) {
    var checkInBtn = document.getElementById("checkInBtn");
    if (checkInBtn) checkInBtn.disabled = true;
    if (nameInput) nameInput.disabled = true;
    if (teamSelect) teamSelect.disabled = true;
  }
}

// Initialize after DOM is ready
function init() {
  try {
    form = document.getElementById("checkInForm");
    nameInput = document.getElementById("attendeeName");
    teamSelect = document.getElementById("teamSelect");
    attendeeCountEl = document.getElementById("attendeeCount");
    progressBar = document.getElementById("attendanceBar");
    attendeeListEl = document.getElementById("attendeeList");
    waterCountEl = document.getElementById("waterCount");
    netzeroCountEl = document.getElementById("netzeroCount");
    renewablesCountEl = document.getElementById("renewablesCount");
    resetCounterBtn = document.getElementById("resetCounterBtn");

    if (!form) {
      showFatalError(
        "Missing required form element (#checkInForm). Page cannot run.",
      );
      return;
    }

    // Attach submit handler
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form from submitting normally

      // If capacity reached, show message and prevent further check-ins
      if (count >= maxCount) {
        const greetingFull = document.getElementById("greeting");
        if (greetingFull) {
          greetingFull.textContent =
            "Sorry — capacity reached. Check-in is closed.";
          greetingFull.classList.add("success-message", "greeting-show");
          setTimeout(function () {
            greetingFull.classList.remove("greeting-show");
          }, 3000);
        }
        return;
      }

      // Get form values
      const name = nameInput.value.trim();
      const team = teamSelect.value;
      const teamName = teamSelect.selectedOptions[0].text; // Get the text of the selected option

      if (!name || !team) {
        return;
      }

      console.log(name, team, teamName); // Log the values to the console (for testing)

      // Increment the count
      count++;
      console.log("Total check-ins: ", count);

      // Update progress bar
      const percentage = Math.round((count / maxCount) * 100) + "%";
      console.log(`Progress: ${percentage}`); // Log the progress percentage to the console (for testing)

      // Update attendee count and progress
      updateProgressUI();

      // Update team counter
      if (!teams[team]) teams[team] = 0;
      teams[team] = teams[team] + 1;
      if (team === "water" && waterCountEl)
        waterCountEl.textContent = String(teams[team]);
      if (team === "netzero" && netzeroCountEl)
        netzeroCountEl.textContent = String(teams[team]);
      if (team === "renewables" && renewablesCountEl)
        renewablesCountEl.textContent = String(teams[team]);

      // Add attendee to list and save
      attendees.push({ name: name, team: team, teamName: teamName });
      renderAttendeeList();
      saveState();

      // Welcome message
      const message = `Thanks, ${name}! You are registered for ${teamName}.`;
      console.log(message);

      // Show greeting/confirmation to user
      const greeting = document.getElementById("greeting");
      if (greeting) {
        greeting.textContent = message;
        greeting.classList.add("success-message", "greeting-show");

        // Auto-hide greeting after a short delay
        setTimeout(function () {
          if (greeting) {
            greeting.classList.remove("greeting-show");
          }
        }, 3000);
      }

      // If we've reached capacity after this check-in, disable inputs/button
      if (count >= maxCount) {
        const checkInBtn = document.getElementById("checkInBtn");
        if (checkInBtn) checkInBtn.disabled = true;
        if (nameInput) nameInput.disabled = true;
        if (teamSelect) teamSelect.disabled = true;
        if (greeting) {
          greeting.textContent = `Capacity reached — ${count}/${maxCount}. Check-in closed.`;
          greeting.classList.add("success-message", "greeting-show");
        }
      }

      form.reset();
    });

    // Reset button: clear all counters and start fresh
    if (resetCounterBtn) {
      resetCounterBtn.addEventListener("click", function () {
        resetAllData();
      });
    }

    // Load saved state when script runs
    loadState();
  } catch (err) {
    console.error("Initialization error:", err);
    showFatalError(err && err.message ? err.message : String(err));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
