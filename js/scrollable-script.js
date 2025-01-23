// ! Scrollable server list



// //

// ! Nav Options - Scroll to section

document.querySelectorAll('.tale-nav-list li').forEach((item) => {
    item.addEventListener('click', () => {
        const targetSelector = item.getAttribute('data-target');
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});

// //
