/**
 * gallery.js
 *
 * Fetches gallery data from the API and handles rendering,
 * category filtering, and modal interactions for the gallery page.
 */

let galleryData = [];

document.addEventListener('DOMContentLoaded', async function () {
    if (document.getElementById('galleryGrid')) {
        await fetchGallery();
        initializeGalleryTabs();
    }
});

async function fetchGallery() {
    try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        galleryData = await response.json();
        renderGallery();
    } catch (error) {
        console.error("Failed to fetch gallery items:", error);
        const container = document.getElementById('galleryGrid');
        if (container) {
            container.innerHTML = '<p class="error-message">Could not load the gallery. Please try again later.</p>';
        }
    }
}

function initializeGalleryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                tabButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderGallery(e.target.dataset.category);
            });
        });
    }
}

function renderGallery(category = 'all') {
    const filteredGallery = category === 'all'
        ? galleryData
        : galleryData.filter(item => item.category === category);

    const container = document.getElementById('galleryGrid');
    if (!container) return;

    if (filteredGallery.length === 0) {
        container.innerHTML = '<p>No items found in this category.</p>';
        return;
    }

    container.innerHTML = filteredGallery.map(item => {
        // **FIX**: Check for item.imageUrl and display it, otherwise show a fallback.
        const imageHtml = item.imageUrl
            ? `<img src="${item.imageUrl}" alt="${item.caption}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<i class="fas fa-image"></i>`;

        return `
            <div class="gallery-item" onclick="openGalleryModal('${item.id}')">
                <div class="gallery-image">${imageHtml}</div>
                <div class="gallery-caption">${item.caption}</div>
            </div>
        `;
    }).join('');
}

function openGalleryModal(galleryId) {
    const item = galleryData.find(g => g.id === galleryId);
    if (!item) return;

    const modalContent = document.getElementById('galleryModalContent');
    if (!modalContent) return;

    // **FIX**: Display the actual image in the modal as well.
    const modalImageHtml = item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.caption}" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; margin-bottom: 1rem;">`
        : `<div style="width: 100%; height: 400px; background: var(--gradient-dark); display: flex; align-items: center; justify-content: center; border-radius: var(--border-radius); margin-bottom: 2rem;">
               <i class="fas fa-image" style="font-size: 4rem; color: var(--primary-yellow);"></i>
           </div>`;

    modalContent.innerHTML = `
        <div style="text-align: center;">
            ${modalImageHtml}
            <h2>${item.caption}</h2>
            <p style="color: var(--text-secondary); margin-top: 1rem;">${item.description}</p>
        </div>
    `;

    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        galleryModal.style.display = 'block';
    }
}