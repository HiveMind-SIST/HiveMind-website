/**
 * common.js
 *
 * Contains shared JavaScript functionality for the entire site, including:
 * - Navigation menu (hamburger, smooth scroll, active link highlighting)
 * - Navbar hide/show effect on scroll
 * - Generic modal closing logic
 * - Helper functions (formatDate, getInitials)
 * - Authentication (Login/Logout button swapping)
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize sitewide features
    initializeNavigation();
    initializeNavbarHiding();
    initializeModalCloseButtons();
    updateAuthButton(); // <-- ADD THIS LINE to run the new function
});

/**
 * Sets up navigation, including the hamburger menu, smooth scrolling,
 * and active link highlighting.
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });

    // Highlight active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

/**
 * Adds a scroll listener to hide the navbar when scrolling down
 * and show it when scrolling up.
 */
function initializeNavbarHiding() {
    let lastScrollTop = 0;
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    let hideTimeout;

    window.addEventListener("scroll", function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Scrolling down
        if (scrollTop > lastScrollTop) {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                navbar.classList.add("nav-hidden");
            }, 300); // Delay before hiding
        }
        // Scrolling up
        else {
            clearTimeout(hideTimeout);
            navbar.classList.remove("nav-hidden");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

/**
 * Initializes the closing functionality for all modals.
 * Modals can be closed by clicking the close button or clicking outside the content area.
 */
function initializeModalCloseButtons() {
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
}

/**
 * Hides all currently visible modals.
 */
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}


// === Helper Functions ===

/**
 * Generates initials from a full name.
 * @param {string} name - The full name (e.g., "Alex Johnson").
 * @returns {string} The uppercase initials (e.g., "AJ").
 */
function getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

/**
 * Formats a date string into a more readable format.
 * @param {string} dateStr - A date string (e.g., "2024-01-15").
 * @returns {string} The formatted date (e.g., "Jan 15, 2024").
 */
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}


// === NEW: Authentication Logic ===

/**
 * Checks the user's session and updates the navbar to show
 * either a "Login" or "Logout" button.
 */
async function updateAuthButton() {
    const authSection = document.querySelector('.auth-section');
    const token = localStorage.getItem('accessToken');

    if (!token || !authSection) {
        // No token found, so the default "Login" button is correct.
        return;
    }

    try {
        // Verify the token with the server
        const response = await fetch('/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // User is logged in: Swap the button
            authSection.innerHTML = `
                <button id="logoutBtn" class="login-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            `;
            // Attach event listener to the new logout button
            document.getElementById('logoutBtn').addEventListener('click', logout);
        } else {
            // Token is invalid or expired, so clean up
            localStorage.removeItem('accessToken');
        }
    } catch (error) {
        console.error('Error verifying user session:', error);
    }
}

/**
 * Logs the user out by clearing the token from storage,
 * calling the server to clear the cookie, and redirecting.
 */
async function logout() {
    localStorage.removeItem('accessToken');

    try {
        await fetch('/logout', { method: 'POST' });
    } catch (error) {
        console.error("Failed to call logout endpoint:", error);
    }

    alert('You have been logged out.');
    window.location.href = '/login';
}