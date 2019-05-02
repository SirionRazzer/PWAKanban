// Check that service workers are registered
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

var drake = null;
// Initialize Dragula
window.onload = function() {
    drake = dragula([document.getElementById('right1'), document.getElementById('right2'), document.getElementById('right3')]);
    console.log(drake.containers);
}
