// Basic JavaScript for potential future use (e.g., smooth scrolling, menu toggle)

// Example: Smooth scrolling for anchor links
// This function adds smooth scrolling behavior when clicking on navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default jump-to-anchor behavior

        // Get the target element based on the href attribute
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Check if the target element exists
        if (targetElement) {
            // Calculate the offset needed to account for the fixed header height
            const headerHeight = document.querySelector('.fixed-top-bar').offsetHeight;
            // Get the target element's position relative to the viewport, add scrollY for absolute position
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            // Subtract the header height from the target position
            const offsetPosition = targetPosition - headerHeight;

            // Scroll smoothly to the calculated position
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // Use smooth scrolling
            });
        }
    });
});

// Theme Toggle Functionality
// This section handles switching between dark and light modes and saving the preference
const themeToggle = document.getElementById('theme-toggle'); // Gets the theme toggle button element
const body = document.body; // Gets the body element
const currentTheme = localStorage.getItem('theme'); // Checks local storage for a saved theme preference

// Apply the saved theme on page load
if (currentTheme) {
    body.classList.add(currentTheme); // If a theme is saved, add that class to the body
} else {
    // If no theme is saved (first visit or cleared storage), default to dark mode
    body.classList.add('dark-mode'); // Add the dark-mode class by default
}

// Add an event listener to the theme toggle button
themeToggle.addEventListener('click', () => {
    // Check if the body currently has the 'light-mode' class
    if (body.classList.contains('light-mode')) {
        // If it's in light mode, switch to dark mode
        body.classList.remove('light-mode'); // Remove light-mode class
        body.classList.add('dark-mode'); // Add dark-mode class
        localStorage.setItem('theme', 'dark-mode'); // Save the preference in local storage
    } else {
        // If it's not in light mode (meaning it's in dark mode or no class is set), switch to light mode
        body.classList.remove('dark-mode'); // Remove dark-mode class (if present)
        body.classList.add('light-mode'); // Add light-mode class
        localStorage.setItem('theme', 'light-mode'); // Save the preference in local storage
    }
});

// Fullscreen Image Modal Functionality
// This section handles opening and closing a modal to view images in fullscreen
const fullscreenModal = document.getElementById('fullscreen-modal');
const fullscreenImage = document.getElementById('fullscreen-image');
const closeButton = document.querySelector('.fullscreen-modal .close-button');
// Select all images within elements having the class 'creation-item'
const creationImages = document.querySelectorAll('.creation-item img');
// Get the element to display the price in the modal
const modalPriceElement = document.getElementById('modal-price');

// --- Modal Navigation Elements ---
// Create elements for modal navigation buttons
const modalNav = document.createElement('div');
modalNav.classList.add('modal-navigation'); // Add a class for styling
const prevButton = document.createElement('button');
prevButton.classList.add('modal-nav-button', 'prev'); // Add classes for styling and identification
prevButton.innerHTML = '&#10094;'; // Left arrow character
const nextButton = document.createElement('button');
nextButton.classList.add('modal-nav-button', 'next'); // Add classes for styling and identification
nextButton.innerHTML = '&#10095;'; // Right arrow character

// Append buttons to the navigation container, and the container to the modal
modalNav.appendChild(prevButton);
modalNav.appendChild(nextButton);
fullscreenModal.appendChild(modalNav); // Add navigation container to modal

let currentImageIndex = -1; // To keep track of the currently displayed image index, initialized to -1

// Function to open the modal with a specific image index
function openModal(index) {
    // Check if the provided index is valid within the range of creation images
    if (index >= 0 && index < creationImages.length) {
        currentImageIndex = index; // Update the current image index
        const image = creationImages[currentImageIndex]; // Get the image element at the current index
        fullscreenImage.src = image.src; // Set the modal image source to the selected image source

        // Get the parent creation item to access the price
        const creationItem = image.closest('.creation-item');
        if (creationItem) {
            const price = creationItem.getAttribute('data-price'); // Get the price from the data-price attribute
            if (modalPriceElement && price) {
                modalPriceElement.textContent = 'Price: ' + price; // Display the price in the modal
            } else if (modalPriceElement) {
                modalPriceElement.textContent = 'Price information not available.'; // Display message if price is missing
            }
        } else if (modalPriceElement) {
            modalPriceElement.textContent = 'Could not determine item price.'; // Display message if parent item is not found
        }

        fullscreenModal.classList.add('is-visible'); // Add class to make the modal visible (handled by CSS)
        updateModalNavigation(); // Update button visibility based on the current index
    }
}

// Function to close the modal
function closeModal() {
    fullscreenModal.classList.remove('is-visible'); // Remove class to hide the modal
    fullscreenImage.src = ''; // Clear image source to free up memory
    if (modalPriceElement) {
        modalPriceElement.textContent = ''; // Clear price display
    }
    currentImageIndex = -1; // Reset index
    // Hide navigation buttons when closing the modal
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
}

// Function to update the visibility of modal navigation buttons
function updateModalNavigation() {
    // Hide the previous button if it's the first image
    if (currentImageIndex <= 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'block'; // Show the previous button otherwise
    }

    // Hide the next button if it's the last image
    if (currentImageIndex >= creationImages.length - 1) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'block'; // Show the next button otherwise
    }
}

// Add event listeners to each creation image to open the modal
creationImages.forEach((image, index) => {
    // Add click listener for desktop/mouse interactions
    image.addEventListener('click', function() {
        openModal(index); // Open modal with the clicked image index
    });

    // --- Touch Event Listeners for Modal ---
    // Add touchstart listener to record the starting touch position
    image.addEventListener('touchstart', function(e) {
        // Record the initial touch coordinates from the first touch point
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    // Add touchend listener to determine if the touch was a tap
    image.addEventListener('touchend', function(e) {
        // Calculate the distance moved horizontally and vertically
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const distanceX = Math.abs(touchEndX - touchStartX);
        const distanceY = Math.abs(touchEndY - touchStartY);

        // If the total distance moved is less than the defined threshold, treat it as a tap
        if (distanceX < tapThreshold && distanceY < tapThreshold) {
            // Prevent default behavior only if it's a tap to avoid potential issues
            // like triggering both click and touchend events or default touch actions
             e.preventDefault();
            openModal(index); // Open modal with the tapped image index
        }
        // If the touch moved more than the threshold, it was likely a drag/scroll, so do nothing,
        // allowing the default browser scroll behavior.
    });
});

// Add a click event listener to the close button to hide the modal
closeButton.addEventListener('click', closeModal);

// Close the modal if the user clicks outside the image (on the modal background)
fullscreenModal.addEventListener('click', function(event) {
    // Check if the click target is the modal background itself, and not the image or close button
    if (event.target === fullscreenModal) {
        closeModal();
    }
});

// --- Modal Navigation Event Listeners ---
// Add event listener for the previous button
prevButton.addEventListener('click', () => {
    // If not on the first image, open the previous image
    if (currentImageIndex > 0) {
        openModal(currentImageIndex - 1);
    }
});

// Add event listener for the next button
nextButton.addEventListener('click', () => {
    // If not on the last image, open the next image
    if (currentImageIndex < creationImages.length - 1) {
        openModal(currentImageIndex + 1);
    }
});


// Ensure the modal is hidden on page load and price is cleared
window.addEventListener('load', () => {
    if (fullscreenModal.classList.contains('is-visible')) {
        fullscreenModal.classList.remove('is-visible');
    }
    if (modalPriceElement) {
      modalPriceElement.textContent = ''; // Ensure price is cleared on load
    }
    // Hide navigation buttons on load
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
});


// --- Creation Filtering Functionality ---
// This section allows filtering the creation items based on categories

// Get all filter buttons and all creation items
const filterButtons = document.querySelectorAll('.filter-button');
const creationItems = document.querySelectorAll('.creation-item');

// Add event listeners to each filter button
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get the filter value (category) from the data-filter attribute of the clicked button
        const filterValue = button.getAttribute('data-filter');

        // Remove the 'active' class from all filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Add the 'active' class to the clicked button
        button.classList.add('active');

        // Iterate through all creation items to show or hide them based on the filter
        creationItems.forEach(item => {
            // Get the category of the current creation item from its data-category attribute
            const itemCategory = item.getAttribute('data-category');

            // Check if the item should be shown:
            // - If the filter value is 'all', show all items.
            // - If the item's category matches the filter value, show the item.
            if (filterValue === 'all' || itemCategory === filterValue) {
                // Show the item by removing the 'hidden' class
                item.classList.remove('hidden');
            } else {
                // Hide the item by adding the 'hidden' class
                item.classList.add('hidden');
            }
        });
    });
});

// Initially trigger the 'all' filter on page load to display all items by default
// This ensures that when the page loads, the 'All' button is active and all creations are visible.
document.addEventListener('DOMContentLoaded', () => {
    // Find the button with the data-filter="all" attribute
    const allButton = document.querySelector('.filter-button[data-filter="all"]');
    // If the 'All' button is found, simulate a click on it
    if (allButton) {
        allButton.click(); // This will trigger the filtering logic for 'all'
    }

    // Also trigger the Intersection Observer logic on DOMContentLoaded
    observeSections(); // Ensure sections fade in on load
});


// --- Intersection Observer for Fade-in Animations ---
// This section adds the 'fade-in' class to elements when they become visible in the viewport

// Options for the Intersection Observer
const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: '0px', // No margin around the root
    threshold: 0.1 // Trigger when 10% of the element is visible
};

// Callback function to be executed when an element's visibility changes
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        // If the element is intersecting (visible in the viewport)
        if (entry.isIntersecting) {
            // Add the 'fade-in' class to trigger the CSS animation
            entry.target.classList.add('fade-in');
            // Stop observing the element once it has faded in
            observer.unobserve(entry.target);
        }
    });
};

// Create a new Intersection Observer instance
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Get all elements that should have the fade-in animation
const elementsToAnimate = document.querySelectorAll('.section, .creation-item, .price-item'); // Select sections, creation items, and price items

// Function to start observing elements
function observeSections() {
  elementsToAnimate.forEach(element => {
      observer.observe(element);
  });
}

// --- Review Submission Functionality ---
// This section handles submitting reviews from the form and adding them to the list

// Get the review form and the reviews list container
const reviewForm = document.getElementById('review-form');
const reviewsList = document.querySelector('#reviews .reviews-list'); // Select the specific reviews-list within the reviews section

// Add an event listener for the form submission
reviewForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Get the name and review content from the input fields
    const customerNameInput = document.getElementById('customer-name');
    const reviewContentInput = document.getElementById('review-content');

    const customerName = customerNameInput.value.trim(); // Get value and remove leading/trailing whitespace
    const reviewContent = reviewContentInput.value.trim(); // Get value and remove leading/trailing whitespace

    // Check if both fields are filled
    if (customerName && reviewContent) {
        // Create a new div element for the review item
        const newReviewItem = document.createElement('div');
        newReviewItem.classList.add('review-item'); // Add the review-item class for styling

        // Create the HTML structure for the new review item
        newReviewItem.innerHTML = `
            <p class="review-text">"${reviewContent}"</p>
            <p class="customer-name">- ${customerName}</p>
        `;

        // Add the new review item to the beginning of the reviews list
        // This makes the newest review appear at the top
        reviewsList.prepend(newReviewItem);

        // Clear the form fields after submission
        customerNameInput.value = '';
        reviewContentInput.value = '';

        // Optional: Provide user feedback (e.g., a simple alert or a temporary message)
        // alert('Review submitted successfully!'); // Using alert for simplicity, consider a better UI message
        console.log('Review submitted:', { name: customerName, review: reviewContent });

    } else {
        // If fields are empty, alert the user (optional)
        alert('Please enter both your name and review.');
    }
});
