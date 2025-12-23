const saveBtn = document.getElementById("saveBtn");
const hoursInput = document.getElementById("hours");
const result = document.getElementById("result");

saveBtn.addEventListener("click", async () => {
  const hours = parseInt(hoursInput.value, 10);

  if (isNaN(hours) || hours < 0) {
    result.textContent = "Please enter a valid number of hours.";
    return;
  }

  result.textContent = "Saving...";

  try {
    const response = await fetch(`/api/downtime-start?hours=${hours}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    result.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    result.textContent = "Error: " + err.message;
  }
});

async function loadDowntime() {
  try {
    const res = await fetch("/api/downtime-get");
    if (!res.ok) return;

    const data = await res.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch {}
}

loadDowntime();

import { Blob } from '@vercel/blob';

const statusEl = document.getElementById('lockdown-status');

// Create a reference to the blob
const lockdownBlob = new Blob({ name: 'lockdown.json', addRandomSuffix: false, access: 'public' });

// Fetch current status
async function fetchLockdownStatus() {
    try {
        const content = await lockdownBlob.read();
        const data = content ? JSON.parse(content) : { lockdown_active: false };
        statusEl.innerText = data.lockdown_active ? 'Lockdown is ENABLED' : 'Lockdown is DISABLED';
    } catch {
        statusEl.innerText = 'Lockdown is DISABLED';
    }
}

// Toggle lockdown
async function toggleLockdown(enable) {
    try {
        const data = {
            lockdown_active: enable,
            updated_at: new Date().toISOString()
        };

        await lockdownBlob.write(JSON.stringify(data), { allowOverwrite: true });
        statusEl.innerText = enable ? 'Lockdown is ENABLED' : 'Lockdown is DISABLED';
    } catch {
        statusEl.innerText = 'Failed to update lockdown status';
    }
}

// Button event listeners
document.getElementById('enable-lockdown').addEventListener('click', () => toggleLockdown(true));
document.getElementById('disable-lockdown').addEventListener('click', () => toggleLockdown(false));

// Load initial status
fetchLockdownStatus();
