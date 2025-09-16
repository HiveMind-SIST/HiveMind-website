/**
 * home.js
 *
 * Contains logic specific to the home page, primarily for animating
 * the statistics counters when they scroll into view.
 */

document.addEventListener('DOMContentLoaded', function () {
    animateStats();
});

/**
 * Sets up an IntersectionObserver to trigger the counter animation
 * when the stats section becomes visible.
 */
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(el => observer.observe(el));
}

/**
 * Animates a single number from 0 to the target value.
 * @param {HTMLElement} element - The element whose text content will be updated.
 * @param {number} target - The final number to count up to.
 */
function animateCounter(element, target) {
    const duration = 500; // duration in milliseconds
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);

        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target; // Ensure it ends exactly on target
        }
    }
    requestAnimationFrame(update);
}