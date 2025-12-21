const hoursInput = document.getElementById("hoursInput");
const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");

// Load saved hours (main page only)
if (hoursInput) {
    const savedHours = localStorage.getItem("hours");
    if (savedHours !== null) {
        hoursInput.value = savedHours;
    }
}

// Save hours
if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        const hours = parseInt(hoursInput.value, 10);

        if (isNaN(hours)) {
            status.textContent = "Please enter a valid integer.";
            return;
        }

        localStorage.setItem("hours", hours);
        status.textContent = `Saved: ${hours} hour(s)`;
    });
}

/* ---------- JSON OUTPUT PAGE ---------- */

if (!hoursInput) {
    const hours = parseInt(localStorage.getItem("hours") || "0", 10);

    const now = new Date();
    now.setHours(now.getHours() + hours);

    const response = {
        downtime_start: now.toISOString(),
        hours_added: hours,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    document.body.innerText = JSON.stringify(response, null, 2);
}
