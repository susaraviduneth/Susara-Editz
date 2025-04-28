// Basic JavaScript for potential future use (e.g., smooth scrolling, menu toggle)

// Example: Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Get the target element
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Calculate the offset needed to account for the fixed header
            const headerHeight = document.querySelector('.fixed-top-bar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = targetPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentTheme = localStorage.getItem('theme');

// Apply saved theme on load
if (currentTheme) {
    body.classList.add(currentTheme);
} else {
    // Default to dark mode if no theme is saved
    body.classList.add('dark-mode');
}


themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
});

// Fullscreen Image Modal Functionality
const fullscreenModal = document.getElementById('fullscreen-modal');
const fullscreenImage = document.getElementById('fullscreen-image');
const closeButton = document.querySelector('.fullscreen-modal .close-button');
const creationImages = document.querySelectorAll('.creation-item img'); // Select images within creation items

let touchStartX = 0;
let touchStartY = 0;
const tapThreshold = 10; // Distance in pixels to consider a tap

// Add event listeners to each creation image
creationImages.forEach(image => {
    // Add click listener for desktop/mouse
    image.addEventListener('click', function() {
        // Set the clicked image's source to the fullscreen image
        fullscreenImage.src = this.src;
        // Add the 'is-visible' class to display the modal using flexbox
        fullscreenModal.classList.add('is-visible');
    });

    // Add touchstart listener to record the starting position
    image.addEventListener('touchstart', function(e) {
        // Record the starting touch coordinates
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    // Add touchend listener to check if it was a tap
    image.addEventListener('touchend', function(e) {
        // Calculate the distance moved
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const distanceX = Math.abs(touchEndX - touchStartX);
        const distanceY = Math.abs(touchEndY - touchStartY);

        // If the touch moved less than the threshold, treat it as a tap
        if (distanceX < tapThreshold && distanceY < tapThreshold) {
            // Prevent default behavior only if it's a tap to avoid triggering click and touchend
             e.preventDefault(); // Prevent potential double-triggering or default touch actions

            // Set the clicked image's source to the fullscreen image
            fullscreenImage.src = this.src;
            // Add the 'is-visible' class to display the modal using flexbox
            fullscreenModal.classList.add('is-visible');
        }
        // If it was a drag/scroll, do nothing, allowing default scroll behavior
    });
});

// Add click event listener to the close button (handles both mouse and touch taps)
closeButton.addEventListener('click', function() {
    // Remove the 'is-visible' class to hide the modal
    fullscreenModal.classList.remove('is-visible');
    // Optionally clear the image source to save memory
    fullscreenImage.src = '';
});

// Close the modal if the user clicks outside the image (handles both mouse and touch taps on background)
fullscreenModal.addEventListener('click', function(event) {
    // Check if the click target is the modal background itself, not the image or close button
    if (event.target === fullscreenModal) {
        // Remove the 'is-visible' class to hide the modal
        fullscreenModal.classList.remove('is-visible');
        fullscreenImage.src = ''; // Clear image source
    }
});

// Ensure modal is hidden on page load by removing the 'is-visible' class
// This is a safeguard in case the class was somehow present in the HTML
window.addEventListener('load', () => {
    if (fullscreenModal.classList.contains('is-visible')) {
        fullscreenModal.classList.remove('is-visible');
    }
});
