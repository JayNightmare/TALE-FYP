// Function to initialize stars based on visible images for each feature list item
function initializeStars() {
    // Loop through each feature-list-item
    document.querySelectorAll('.feature-list-item').forEach((section) => {
        // Find the visible image in this section
        const visibleImage = section.querySelector('.feature-image[style="display: block;"]');

        if (visibleImage) {
            const targetImage = visibleImage.getAttribute('data-feature-image');
            // Find the corresponding star in this section
            const correspondingItem = section.querySelector(`.feature-list-item-description[data-image="${targetImage}"]`);
            if (correspondingItem) {
                const star = correspondingItem.querySelector('.star-icon');
                star.classList.remove('far'); // Outlined star
                star.classList.add('fas');   // Filled star
            }
        }
    });
}

// Function to handle star toggling and image switching
function handleStarClick() {
    document.querySelectorAll('.feature-list-item').forEach((section) => {
        section.querySelectorAll('.feature-list-item-description').forEach((item) => {
            item.addEventListener('click', () => {
                // Reset all stars in the current section
                section.querySelectorAll('.star-icon').forEach((icon) => {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                });

                // Highlight the clicked star
                const star = item.querySelector('.star-icon');
                star.classList.remove('far');
                star.classList.add('fas');

                // Show the corresponding image and hide others in this section
                const targetImage = item.getAttribute('data-image');
                section.querySelectorAll('.feature-image').forEach((img) => {
                    img.style.display = img.getAttribute('data-feature-image') === targetImage ? 'block' : 'none';
                });
            });
        });
    });
}

// Initialize the stars on page load
initializeStars();

// Attach event listeners for star click
handleStarClick();
