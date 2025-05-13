// Basic JavaScript for potential future use (e.g., smooth scrolling, menu toggle)

// Example: Smooth scrolling for anchor links
// This function adds smooth scrolling behavior when clicking on navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Don't handle scroll if it's a feedback image
        if (this.classList.contains('review-image-link')) {
            return;
        }

        e.preventDefault(); // Prevent the default jump-to-anchor behavior

        const targetId = this.getAttribute('href');
        console.log('Smooth scroll clicked:', targetId); // Debugging line

        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetElement = document.querySelector(targetId);
            // Define an extra offset (in pixels) below the fixed header
            const extraOffset = 20; // You can adjust this value (e.g., 10, 30, 50)

            if (targetElement) {
                // Calculate the offset needed to account for the fixed header height
                const headerHeight = document.querySelector('.fixed-top-bar').offsetHeight;
                // Get the target element's position relative to the viewport, add scrollY for absolute position
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                // Subtract the header height AND the extra offset from the target position
                const offsetPosition = targetPosition - headerHeight - extraOffset;

                console.log('Scrolling to:', targetId, 'Calculated offset:', offsetPosition); // Debugging line

                // Scroll smoothly to the calculated position
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' // Use smooth scrolling
                });
            } else {
                console.warn('Target element not found for ID:', targetId); // Debugging line if target is missing
            }
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

// --- Fullscreen Image Modal Functionality (with Previews) ---
const fullscreenModal = document.getElementById('fullscreen-modal');
const fullscreenImage = document.getElementById('fullscreen-image');
const closeButton = document.querySelector('.fullscreen-modal .close-button');
const modalPriceElement = document.getElementById('modal-price');
const modalPreviewsContainer = document.getElementById('modal-previews');

// Add click event listeners to creation items
document.querySelectorAll('.creation-item').forEach(item => {
    item.addEventListener('click', function(e) {
        // Don't open modal if clicking the Order Now button
        if (e.target.closest('.order-button')) {
            return;
        }

        const clickedImage = e.target.closest('img');
        if (!clickedImage) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Get all images in this creation item
        const images = Array.from(this.querySelectorAll('img'));
        currentImageSet = images;
        currentImageIndex = images.indexOf(clickedImage);

        // Show the modal
        fullscreenModal.classList.add('is-visible');
        fullscreenImage.src = clickedImage.src;

        // Show price if available
        const price = this.getAttribute('data-price');
        if (price && modalPriceElement) {
            modalPriceElement.textContent = `Price: ${price}`;
            modalPriceElement.style.display = 'block';
        }

        // Show navigation if multiple images
        if (images.length > 1) {
            populatePreviews(images);
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
        } else {
            modalPreviewsContainer.style.display = 'none';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    });
});

// Separate click handler for feedback/review images
document.querySelectorAll('.review-image-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Stop all default behaviors and propagation
        e.preventDefault();
        e.stopPropagation();
        
        // Get image source
        const imgSrc = this.getAttribute('data-image') || this.querySelector('img').src;
        
        // Reset modal state
        fullscreenModal.style.transition = 'none';
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        modalPreviewsContainer.style.display = 'none';
        modalPriceElement.style.display = 'none';
        
        // Show image
        fullscreenImage.src = imgSrc;
        fullscreenModal.classList.add('is-visible');
        
        // Important: Stop event from triggering scroll handlers
        return false;
    });
});

// Function to populate the preview gallery
function populatePreviews(images) {
    modalPreviewsContainer.innerHTML = '';
    if (images.length > 1) {
        modalPreviewsContainer.style.display = 'flex';
        images.forEach((image, index) => {
            const previewDot = document.createElement('span');
            previewDot.classList.add('preview-dot');
            // Add 'active' class to the current image's preview dot
            if (index === currentImageIndex) {
                previewDot.classList.add('active');
            }
            previewDot.dataset.index = index;
            previewDot.addEventListener('click', () => {
                showModalImage(index);
            });
            modalPreviewsContainer.appendChild(previewDot);
        });
    } else {
        modalPreviewsContainer.style.display = 'none';
    }
}

// Add navigation arrows to the modal
const prevButton = document.createElement('button');
prevButton.className = 'modal-nav-button prev-button';
prevButton.innerHTML = '&#10094;';
prevButton.setAttribute('aria-label', 'Previous image');

const nextButton = document.createElement('button');
nextButton.className = 'modal-nav-button next-button';
nextButton.innerHTML = '&#10095;';
nextButton.setAttribute('aria-label', 'Next image');

fullscreenModal.appendChild(prevButton);
fullscreenModal.appendChild(nextButton);

// Add styles for navigation buttons
const navStyles = document.createElement('style');
navStyles.textContent = `
    .modal-nav-button {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.3);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: background-color 0.3s, transform 0.3s;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .modal-nav-button:hover {
        background: rgba(0, 0, 0, 0.5);
        transform: translateY(-50%) scale(1.05);
    }

    .prev-button {
        left: 15px;
    }

    .next-button {
        right: 15px;
    }

    .modal-nav-button:focus {
        outline: none;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
    }
`;
document.head.appendChild(navStyles);

// Add click event listeners for navigation
prevButton.addEventListener('click', () => {
    if (currentImageSet.length > 0) {
        const newIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
        showModalImage(newIndex);
    }
});

nextButton.addEventListener('click', () => {
    if (currentImageSet.length > 0) {
        const newIndex = (currentImageIndex + 1) % currentImageSet.length;
        showModalImage(newIndex);
    }
});

// Function to show a specific image in the main modal view
function showModalImage(index) {
    if (currentImageSet.length > 0) {
        index = (index + currentImageSet.length) % currentImageSet.length;
        currentImageIndex = index;
        fullscreenImage.src = currentImageSet[currentImageIndex].src;

        // Update preview dots
        const previews = modalPreviewsContainer.querySelectorAll('.preview-dot');
        previews.forEach((preview, idx) => {
            if (idx === currentImageIndex) {
                preview.classList.add('active');
            } else {
                preview.classList.remove('active');
            }
        });

        // Show/hide navigation buttons based on number of images
        if (currentImageSet.length > 1) {
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
    } else {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    }
}

// Function to close the modal - replace the existing closeModal function
function closeModal() {
    // Remove classes
    fullscreenModal.classList.remove('is-visible');
    
    // Reset content
    fullscreenImage.src = '';
    
    // Reset UI elements
    modalPriceElement.style.display = 'none';
    modalPreviewsContainer.style.display = 'none';
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    
    // Reset zoom
    zoom = 1;
    fullscreenImage.style.transform = 'scale(1)';
    
    // Reset image sets
    currentImageSet = [];
    currentImageIndex = -1;
}

// Add click event listener to close button
closeButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    stopSlideshow();
    closeModal();
});

// Add click event listener to modal background
fullscreenModal.addEventListener('click', function(e) {
    if (e.target === fullscreenModal) {
        closeModal();
    }
});

// Add keyboard event listener for Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fullscreenModal.classList.contains('is-visible')) {
        closeModal();
    }
});

// --- Creation Filtering Functionality ---
// This section allows filtering the creation items based on categories

// Get all filter buttons and all creation items
const filterButtons = document.querySelectorAll('.filter-button');
const creationItems = document.querySelectorAll('.creation-item'); // NOTE: Filtering is only applied to creation items

// Add event listeners to each filter button
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        creationItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (filterValue === 'all' || itemCategory === filterValue) {
                item.classList.remove('hidden');
                // Reset animation state for visible items
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
            } else {
                item.classList.add('hidden');
            }
        });
        // Re-observe elements that might become visible after filtering
        observeElementsToAnimate();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const allButton = document.querySelector('.filter-button[data-filter="all"]');
    if (allButton) {
        allButton.click();
    }
    observeElementsToAnimate(); // Start observing on load
});


// --- Intersection Observer for Fade-in Animations ---
// Improved intersection observer for animations
function observeElementsToAnimate() {
const observerOptions = {
    root: null,
        rootMargin: '50px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('fade-in');
                
                // Ensure the element stays visible after animation
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                // Only unobserve if it's not a creation item (for filtering)
                if (!element.classList.contains('creation-item')) {
                    observer.unobserve(element);
             }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Observe creation items with staggered delay
    document.querySelectorAll('.creation-item:not(.hidden)').forEach((item, index) => {
        // Add a small delay based on index for staggered effect
        setTimeout(() => {
            observer.observe(item);
        }, index * 100); // 100ms delay between each item
    });

    // Observe price items
    document.querySelectorAll('.price-item').forEach(item => {
        observer.observe(item);
    });
}

// Update filter functionality to handle animations
function updateFilter(filter) {
    const items = document.querySelectorAll('.creation-item');
    const buttons = document.querySelectorAll('.filter-button');
    
    buttons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter === filter);
    });

    items.forEach(item => {
        const shouldShow = filter === 'all' || item.dataset.category === filter;
        
        if (shouldShow) {
            item.classList.remove('hidden');
            // Reset animation state for newly visible items
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            // Re-observe the item
            setTimeout(() => {
                item.classList.add('fade-in');
            }, 50);
        } else {
            item.classList.add('hidden');
            item.classList.remove('fade-in');
        }
    });

    // Re-observe elements after filtering
    observeElementsToAnimate();
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const currentTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.classList.add(currentTheme);

    // Initialize filter
    const allButton = document.querySelector('.filter-button[data-filter="all"]');
    if (allButton) {
        allButton.click();
    }

    // Initialize animations
    observeElementsToAnimate();
    
    // Add filter button click handlers
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', () => {
            updateFilter(button.dataset.filter);
        });
    });

    // Initialize smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Don't handle scroll if it's a feedback image
            if (this.classList.contains('review-image-link')) {
                return;
            }

            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.fixed-top-bar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = targetPosition - headerHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn('Target element not found for ID (DOMContentLoaded):', targetId);
                }
            }
        });
    });

    const scrollTopLink = document.querySelector('.scroll-to-top');
    if (scrollTopLink) {
        scrollTopLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// --- Drag/Swipe Navigation for Fullscreen Modal ---
let startX = 0;
let isDragging = false;

// Touch events for mobile
fullscreenModal.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
});
fullscreenModal.addEventListener('touchmove', function(e) {
    // Prevent scrolling while swiping
    if (isDragging) e.preventDefault();
}, { passive: false });
fullscreenModal.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    if (Math.abs(diffX) > 50) {
        if (diffX < 0 && currentImageSet.length > 0) {
            // Swipe left: next (circular)
            const newIndex = (currentImageIndex + 1) % currentImageSet.length;
            showModalImage(newIndex);
        } else if (diffX > 0 && currentImageSet.length > 0) {
            // Swipe right: prev (circular)
            const newIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
            showModalImage(newIndex);
        }
    }
    isDragging = false;
});

// Mouse events for desktop
fullscreenModal.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return; // Only left mouse button
    startX = e.clientX;
    isDragging = true;
});
fullscreenModal.addEventListener('mousemove', function(e) {
    // Prevent unwanted selection while dragging
    if (isDragging) e.preventDefault();
});
fullscreenModal.addEventListener('mouseup', function(e) {
    if (!isDragging) return;
    const endX = e.clientX;
    const diffX = endX - startX;
    if (Math.abs(diffX) > 50) {
        if (diffX < 0 && currentImageSet.length > 0) {
            // Drag left: next (circular)
            const newIndex = (currentImageIndex + 1) % currentImageSet.length;
            showModalImage(newIndex);
        } else if (diffX > 0 && currentImageSet.length > 0) {
            // Drag right: prev (circular)
            const newIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
            showModalImage(newIndex);
        }
    }
    isDragging = false;
});

// --- Advanced Features for Fullscreen Modal ---

// 1. Keyboard Navigation & Focus Trap
fullscreenModal.setAttribute('tabindex', '-1');
fullscreenModal.setAttribute('aria-modal', 'true');
fullscreenModal.setAttribute('role', 'dialog');
closeButton.setAttribute('aria-label', 'Close modal');

function trapFocus(e) {
    if (!fullscreenModal.classList.contains('is-visible')) return;
    const focusable = fullscreenModal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }
}
document.addEventListener('keydown', function(e) {
    if (!fullscreenModal.classList.contains('is-visible')) return;
    if (e.key === 'ArrowLeft') {
        prevButton.click();
    } else if (e.key === 'ArrowRight') {
        nextButton.click();
    } else if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'Tab') {
        trapFocus(e);
    }
});

// Placeholder for the base function to open the modal
function openModal(clickedImage, item) {
    // This function will be populated with the core modal display logic later
    // console.log('openModal called with:', clickedImage, item); // Keep or remove console.log as needed

    const images = Array.from(item.querySelectorAll('img'));
    
    // Set the current image set and find the clicked image index
    currentImageSet = images; // Ensure currentImageSet is declared in a scope accessible here
    currentImageIndex = images.indexOf(clickedImage); // Ensure currentImageIndex is declared

    // Show the modal with the clicked image
    fullscreenImage.src = clickedImage.src;
    fullscreenModal.classList.add('is-visible');
    
    // Show price if available
    const price = item.getAttribute('data-price');
    if (modalPriceElement && price) {
        modalPriceElement.innerHTML = `<div class="price-highlight">Price: ${price}</div>`;
        modalPriceElement.style.display = 'block';
        modalPriceElement.style.visibility = 'visible';
    }
    
    // Show preview dots if multiple images
    if (images.length > 1) {
        populatePreviews(images); // Ensure populatePreviews is defined and accessible
        // Highlight the current image's preview dot
        const previews = modalPreviewsContainer.querySelectorAll('.preview-dot');
        previews.forEach((preview, idx) => {
            if (idx === currentImageIndex) {
                preview.classList.add('active');
            } else {
                preview.classList.remove('active');
            }
        });
        
        // Show navigation buttons
        prevButton.style.display = 'flex'; // Ensure prevButton is defined
        nextButton.style.display = 'flex'; // Ensure nextButton is defined
    } else {
        modalPreviewsContainer.style.display = 'none';
        modalPreviewsContainer.innerHTML = '';
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
    }
}

// 2. Animated Modal Open/Close
fullscreenModal.classList.add('modal-animated');
const originalOpenModal = openModal;
openModal = function(clickedImage) {
    fullscreenModal.classList.remove('modal-closing');
    originalOpenModal(clickedImage);
    setTimeout(() => fullscreenModal.classList.add('modal-opened'), 10);
};
const originalCloseModal = closeModal;
closeModal = function() {
    fullscreenModal.classList.remove('modal-opened');
    fullscreenModal.classList.add('modal-closing');
    setTimeout(() => {
        originalCloseModal();
        fullscreenModal.classList.remove('modal-closing');
    }, 300);
};

// 3. Auto-Play Slideshow
let slideshowInterval = null;
const playPauseBtn = document.createElement('button');
playPauseBtn.className = 'modal-play-pause';
playPauseBtn.setAttribute('aria-label', 'Play slideshow');
playPauseBtn.innerHTML = '▶️';
fullscreenModal.appendChild(playPauseBtn);
let isPlaying = false;
function startSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        nextButton.click();
    }, 2000);
    playPauseBtn.innerHTML = '⏸️';
    playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
    isPlaying = true;
}
function stopSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    playPauseBtn.innerHTML = '▶️';
    playPauseBtn.setAttribute('aria-label', 'Play slideshow');
    isPlaying = false;
}
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
});
fullscreenModal.addEventListener('click', stopSlideshow);

// 5. Image Zoom (scroll to zoom on desktop, pinch to zoom on mobile)
let zoom = 1;
fullscreenImage.style.transition = 'transform 0.2s cubic-bezier(0.4,0,0.2,1)';
fullscreenImage.addEventListener('wheel', function(e) {
    if (!fullscreenModal.classList.contains('is-visible')) return;
    e.preventDefault();
    zoom += e.deltaY < 0 ? 0.1 : -0.1;
    zoom = Math.max(1, Math.min(zoom, 3));
    fullscreenImage.style.transform = `scale(${zoom})`;
});
fullscreenImage.addEventListener('dblclick', function() {
    zoom = 1;
    fullscreenImage.style.transform = 'scale(1)';
});
// Pinch to zoom for mobile
gletouchstart = 0, gletouchdist = 0;
fullscreenImage.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
        gletouchstart = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        gletouchdist = zoom;
    }
});
fullscreenImage.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        zoom = Math.max(1, Math.min(gletouchdist * (dist / gletouchstart), 3));
        fullscreenImage.style.transform = `scale(${zoom})`;
    }
}, { passive: false });
fullscreenImage.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
        gletouchstart = 0;
        gletouchdist = zoom;
    }
});

// 6. Animated Dark/Light Mode Toggle (simple fade)
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.style.transition = 'background 0.5s, color 0.5s';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 600);
    });
}

// Add click event listener to close button
closeButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
});

// Add click event listener to modal background
fullscreenModal.addEventListener('click', function(e) {
    if (e.target === fullscreenModal) {
        closeModal();
    }
});

// Add keyboard event listener for Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fullscreenModal.classList.contains('is-visible')) {
        closeModal();
    }
});

// Add touch event listeners for closing the modal
let touchStartY = 0;
let touchStartX = 0;

fullscreenModal.addEventListener('touchstart', function(e) {
    if (e.target === fullscreenModal || e.target === fullscreenImage) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }
}, { passive: true });

fullscreenModal.addEventListener('touchmove', function(e) {
    if (e.target === fullscreenModal || e.target === fullscreenImage) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;
        
        // If swiping down more than 50px, close the modal
        if (deltaY > 50) {
            e.preventDefault();
            closeModal();
        }
    }
}, { passive: false });

fullscreenModal.addEventListener('touchend', function(e) {
    if (e.target === fullscreenModal) {
        closeModal();
    }
}, { passive: true });

// Ensure the modal is hidden on page load and state is reset
window.addEventListener('load', () => {
    closeModal(); // Use closeModal to ensure everything is reset on load
});
