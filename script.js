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

// Add click and touchstart event listeners to each creation image
creationImages.forEach(image => {
    // Add click listener for desktop/mouse
    image.addEventListener('click', function() {
        // Set the clicked image's source to the fullscreen image
        fullscreenImage.src = this.src;
        // Add the 'is-visible' class to display the modal using flexbox
        fullscreenModal.classList.add('is-visible');
    });

    // Add touchstart listener for mobile/touch
    image.addEventListener('touchstart', function(e) {
        // Prevent potential default touch behaviors like scrolling or zooming
        e.preventDefault();
        // Set the clicked image's source to the fullscreen image
        fullscreenImage.src = this.src;
        // Add the 'is-visible' class to display the modal using flexbox
        fullscreenModal.classList.add('is-visible');
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
