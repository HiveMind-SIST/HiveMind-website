/**
 * members.js
 *
 * Fetches member data from the API and handles rendering and
 * searching for the team members page.
 * Note: `getInitials` helper is in common.js
 */

// This global variable will hold the member data after it's fetched from the API.
let membersData = [];

document.addEventListener('DOMContentLoaded', async function () {
    // This function runs once the entire HTML page is loaded.
    if (document.getElementById('membersGrid')) {
        // 1. Fetch the member data from the server.
        await fetchMembers();

        // 2. Once data is fetched, set up the search bar functionality.
        const memberSearch = document.getElementById('memberSearch');
        if (memberSearch) {
            memberSearch.addEventListener('input', (e) => renderMembers(e.target.value));
        }
    }
});

/**
 * Fetches member data from the /api/members endpoint.
 */
async function fetchMembers() {
    try {
        const response = await fetch('/api/members');
        if (!response.ok) {
            // If the server response is not successful
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        membersData = await response.json(); // Store the fetched data.
        renderMembers(); // 3. Display the initial list of members.
    } catch (error) {
        console.error("Failed to fetch members:", error);
        const container = document.getElementById('membersGrid');
        if (container) {
            // Display a user-friendly error message.
            container.innerHTML = '<p class="error-message">Could not load team members. Please try again later.</p>';
        }
    }
}

/**
 * Renders the member cards into the membersGrid div.
 * It filters the members based on the search term.
 * @param {string} [searchTerm=''] - The text from the search input.
 */
function renderMembers(searchTerm = '') {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredMembers = membersData.filter(member =>
        member.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.role.toLowerCase().includes(lowerCaseSearchTerm) ||
        (member.skills && member.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchTerm)))
    );

    const container = document.getElementById('membersGrid');
    if (!container) return;

    if (filteredMembers.length === 0) {
        container.innerHTML = '<p>No members found matching your search.</p>';
        return;
    }

    container.innerHTML = filteredMembers.map(member => {
        const photoHtml = member.photoUrl
            ? `<img src="${member.photoUrl}" alt="${member.name}" class="member-photo-img" style="max-width: 128px; max-height: 128px; object-fit: cover;">`
            : `<div class="member-photo">${getInitials(member.name)}</div>`;


        return `
            <div class="member-card">
                ${photoHtml}
                <h3 class="member-name">${member.name}</h3>
                <p class="member-role">${member.role}</p>
                <div class="member-links">
                    <a href="${member.linkedin}" class="member-link" title="LinkedIn" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="${member.github}" class="member-link" title="GitHub" target="_blank"><i class="fab fa-github"></i></a>
                    <a href="${member.resumeUrl}" class="member-link" title="Resume" target="_blank"><i class="fas fa-file-pdf"></i></a>
                </div>
            </div>
        `;
    }).join('');
}