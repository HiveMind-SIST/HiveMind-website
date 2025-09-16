/**
 * blogs.js
 *
 * Fetches blog data from the API, handles rendering with images,
 * and uses Showdown.js to display Markdown content in the modal.
 */

let blogsData = [];

document.addEventListener('DOMContentLoaded', async function () {
    if (document.getElementById('blogsGrid')) {
        await fetchBlogs();
        const blogSearch = document.getElementById('blogSearch');
        if (blogSearch) {
            blogSearch.addEventListener('input', (e) => renderBlogs(e.target.value));
        }
    }
});

async function fetchBlogs() {
    try {
        const response = await fetch('/api/blogs');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        blogsData = await response.json();
        renderBlogs();
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        const container = document.getElementById('blogsGrid');
        if (container) {
            container.innerHTML = '<p class="error-message">Could not load blog posts. Please try again later.</p>';
        }
    }
}

function renderBlogs(searchTerm = '') {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredBlogs = blogsData.filter(blog =>
        blog.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
    );

    const container = document.getElementById('blogsGrid');
    if (!container) return;

    if (filteredBlogs.length === 0) {
        container.innerHTML = '<p>No blog posts found matching your search.</p>';
        return;
    }

    container.innerHTML = filteredBlogs.map(blog => {
        const imageHtml = blog.imageUrl
            ? `<img src="${blog.imageUrl}" alt="${blog.title}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<i class="fas fa-blog"></i>`;

        return `
            <div class="blog-card" onclick="openBlogModal('${blog.id}')">
                <div class="blog-image">${imageHtml}</div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${formatDate(blog.date)}</span>
                        <span class="blog-category">${blog.category}</span>
                    </div>
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.excerpt || ''}</p>
                </div>
            </div>
        `;
    }).join('');
}

function openBlogModal(blogId) {
    const blog = blogsData.find(b => b.id === blogId);
    if (!blog) return;

    const modalContent = document.getElementById('blogModalContent');
    if (!modalContent) return;

    // Use Showdown to convert Markdown to HTML
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(blog.content);

    const modalImageHtml = blog.imageUrl
        ? `<div class="modal-image-container"><img src="${blog.imageUrl}" alt="${blog.title}" style="max-width: 100%; max-height: 256px; object-fit: contain; border-radius: 8px; margin-bottom: 1rem;"></div>`
        : '';

    modalContent.innerHTML = `
        ${modalImageHtml}
        <div class="blog-meta" style="margin-bottom: 2rem;">
            <span class="blog-date">${formatDate(blog.date)}</span>
            <span class="blog-category">${blog.category}</span>
        </div>
        <div class="blog-post-content" style="color: var(--text-secondary); line-height: 1.8;">
            <h1>${blog.title}</h1>
            ${htmlContent}
        </div>
        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255, 215, 0, 0.2);">
            <p><strong>Author:</strong> ${blog.author}</p>
            <p><strong>Read Time:</strong> ${blog.readTime}</p>
            <div style="margin-top: 1rem;">
                ${(blog.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    const blogModal = document.getElementById('blogModal');
    if (blogModal) {
        blogModal.style.display = 'block';
    }
}
