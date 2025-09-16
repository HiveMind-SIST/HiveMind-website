/**
 * addimage.js
 *
 * Handles the logic for the "Add New Image" form, including validation,
 * file upload, API submission, and user feedback.
 */
document.addEventListener('DOMContentLoaded', function () {

    const imageForm = document.getElementById('imageForm');
    if (!imageForm) return;

    // --- Element References ---
    const imageUploadArea = document.getElementById('imageUpload');
    const imageFileInput = document.getElementById('imageFile');
    const imageTitleInput = document.getElementById('imageTitle');
    const imageDescriptionInput = document.getElementById('imageDescription');
    const imageSectionSelect = document.getElementById('imageSection');
    const submitButton = imageForm.querySelector('button[type="submit"]');

    // --- Interactive File Upload ---
    if (imageUploadArea && imageFileInput) {
        imageUploadArea.addEventListener('click', () => {
            imageFileInput.click();
        });

        imageFileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const placeholder = imageUploadArea.querySelector('.upload-placeholder');
                const reader = new FileReader();
                reader.onload = function (e) {
                    placeholder.innerHTML = `<img src="${e.target.result}" alt="Image preview" style="width:100%; height:100%; object-fit:cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Form Submission Handler ---
    imageForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!validateForm()) {
            showToast('Please fill in all required fields and upload an image.', 'error');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

        const formData = new FormData();
        // These keys MUST match the parameters in your main.py create_gallery_item endpoint
        formData.append('caption', imageTitleInput.value.trim());
        formData.append('description', imageDescriptionInput.value.trim());
        formData.append('category', imageSectionSelect.value);
        formData.append('image', imageFileInput.files[0]);

        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'An unknown error occurred.');
            }

            showToast(result.message, 'success');
            setTimeout(() => {
                window.location.href = '/gallery';
            }, 2000);

        } catch (error) {
            console.error('Submission failed:', error);
            showToast(`Error: ${error.message}`, 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-plus"></i> Add Image';
        }
    });

    function validateForm() {
        return imageTitleInput.value.trim() &&
               imageDescriptionInput.value.trim() &&
               imageSectionSelect.value &&
               imageFileInput.files.length > 0;
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