const serverList = document.getElementById('serverList');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let scrollAmount = 0;

function scrollList(direction) {
    const scrollWidth = 300; // The width of one item
    const maxScroll = serverList.scrollWidth - serverList.clientWidth;

    if (direction === 'next') {
        scrollAmount += scrollWidth;
        if (scrollAmount > maxScroll) {
            scrollAmount = 0; // Reset to start
        }
    } else {
        scrollAmount -= scrollWidth;
        if (scrollAmount < 0) {
            scrollAmount = maxScroll; // Reset to end
        }
    }

    serverList.style.transform = `translateX(-${scrollAmount}px)`;
}

next.addEventListener('click', () => scrollList('next'));
prev.addEventListener('click', () => scrollList('prev'));

// Auto-scroll every 3 seconds
setInterval(() => scrollList('next'), 3000);