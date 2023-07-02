// home.js

// Get the current time and display it
function getCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    const currentTime = new Date().toLocaleString();
    currentTimeElement.innerText = currentTime;
}

// Update the current time every second
setInterval(getCurrentTime, 1000);
