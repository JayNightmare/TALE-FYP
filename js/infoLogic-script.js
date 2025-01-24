function initializeStars() {
    document.querySelectorAll('.feature-list-item').forEach((section) => {
        const visibleImage = section.querySelector('.feature-image[style="display: block;"]');

        if (visibleImage) {
            const targetImage = visibleImage.getAttribute('data-feature-image');
            const correspondingItem = section.querySelector(`.feature-list-item-description[data-image="${targetImage}"]`);
            if (correspondingItem) {
                const star = correspondingItem.querySelector('.star-icon');
                star.classList.remove('far'); // * Outlined star
                star.classList.add('fas');   // * Filled star
            }
        }
    });
}

function handleStarClick() {
    document.querySelectorAll('.feature-list-item').forEach((section) => {
        section.querySelectorAll('.feature-list-item-description').forEach((item) => {
            item.addEventListener('click', () => {
                section.querySelectorAll('.star-icon').forEach((icon) => {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                });

                const star = item.querySelector('.star-icon');
                star.classList.remove('far');
                star.classList.add('fas');

                const targetImage = item.getAttribute('data-image');
                section.querySelectorAll('.feature-image').forEach((img) => {
                    img.style.display = img.getAttribute('data-feature-image') === targetImage ? 'block' : 'none';
                });
            });
        });
    });
}

initializeStars();

handleStarClick();
