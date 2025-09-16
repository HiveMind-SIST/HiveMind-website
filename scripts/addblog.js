/**
 * addblog.js
 *
 * Handles the logic for the "Add New Blog" form, including validation,
 * file upload, API submission, and user feedback.
 */
document.addEventListener('DOMContentLoaded', function () {

    const blogForm = document.getElementById('blogForm');
    if (!blogForm) return;

    // --- Element References ---
    const blogImageUpload = document.getElementById('blogImageUpload');
    const blogImageInput = document.getElementById('blogImage');
    const blogDateInput = document.getElementById('blogDate');
    const blogDomainInput = document.getElementById('blogDomain');
    const blogTitleInput = document.getElementById('blogTitle');
    const blogDescriptionInput = document.getElementById('blogDescription');
    const blogAuthorInput = document.getElementById('blogAuthor');
    const blogReadTimeInput = document.getElementById('blogReadTime');
    const blogTechStackInput = document.getElementById('blogTechStack');
    const submitButton = blogForm.querySelector('button[type="submit"]');

    // --- Interactive File Upload ---
    if (blogImageUpload && blogImageInput) {
        blogImageUpload.addEventListener('click', () => {
            blogImageInput.click();
        });

        blogImageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const placeholder = blogImageUpload.querySelector('.upload-placeholder');
                const reader = new FileReader();
                reader.onload = function (e) {
                    placeholder.innerHTML = `<img src="${e.target.result}" alt="Blog image preview" style="width:100%; height:100%; object-fit:cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Form Submission Handler ---
    blogForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!validateForm()) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

        const formData = new FormData();
        // These keys MUST match the parameters in your main.py create_blog endpoint
        formData.append('title', blogTitleInput.value.trim());
        formData.append('date', blogDateInput.value);
        formData.append('category', blogDomainInput.value.trim());
        formData.append('author', blogAuthorInput.value.trim());
        formData.append('readTime', blogReadTimeInput.value);
        formData.append('tags', blogTechStackInput.value.trim());
        // For now, the brief description is used as the main content.
        // You can replace this with a rich text editor's content later.
        formData.append('content', blogDescriptionInput.value.trim());
        
        if (blogImageInput.files.length > 0) {
            formData.append('image', blogImageInput.files[0]);
        }

        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'An unknown error occurred.');
            }

            showToast(result.message, 'success');
            setTimeout(() => {
                window.location.href = '/blogs';
            }, 2000);

        } catch (error) {
            console.error('Submission failed:', error);
            showToast(`Error: ${error.message}`, 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-plus-circle"></i> Add Blog Post';
        }
    });

    function validateForm() {
        return blogDateInput.value &&
               blogDomainInput.value.trim() &&
               blogTitleInput.value.trim() &&
               blogDescriptionInput.value.trim() &&
               blogAuthorInput.value.trim() &&
               blogReadTimeInput.value &&
               blogTechStackInput.value.trim();
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 500);
        }, 3000);
    }
});
