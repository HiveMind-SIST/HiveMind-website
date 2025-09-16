/**
 * addproject.js
 *
 * Handles all logic for the "Add New Project" form, including:
 * - Making the image upload area clickable.
 * - Form validation on submit.
 * - API submission with FormData.
 * - User feedback with toast notifications.
 */
document.addEventListener('DOMContentLoaded', function () {

    // --- Element References ---
    const projectForm = document.getElementById('projectForm');
    const projectImageUploadArea = document.getElementById('projectImageUpload');
    const projectImageInput = document.getElementById('projectImage');
    const projectTitleInput = document.getElementById('projectTitle');
    const techStackInput = document.getElementById('techStack');
    const projectDescriptionInput = document.getElementById('projectDescription');
    const linkedinLinkInput = document.getElementById('linkedinLink');
    const githubLinkInput = document.getElementById('githubLink');
    
    if (!projectForm) return; // Stop if the form doesn't exist

    const submitButton = projectForm.querySelector('button[type="submit"]');

    // --- Logic for Clickable Image Upload Area ---
    if (projectImageUploadArea && projectImageInput) {
        // When the visible upload area is clicked, trigger the hidden file input
        projectImageUploadArea.addEventListener('click', () => {
            projectImageInput.click();
        });

        // When a file is selected, update the display
        projectImageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const placeholder = projectImageUploadArea.querySelector('.upload-placeholder');
                // Use FileReader to show a preview of the selected image
                const reader = new FileReader();
                reader.onload = function (e) {
                    placeholder.innerHTML = `<img src="${e.target.result}" alt="Project image preview" style="width:100%; height:100%; object-fit:cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Logic for Form Submission ---
    projectForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Stop the default browser form submission

        // 1. Validate the form
        if (!validateForm()) {
            showToast('Please fill in all required fields and upload an image.', 'error');
            return;
        }

        // Disable the button to prevent multiple clicks
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

        // 2. Prepare the data using FormData for file upload
        const formData = new FormData();
        formData.append('projectTitle', projectTitleInput.value.trim());
        formData.append('techStack', techStackInput.value.trim());
        formData.append('projectDescription', projectDescriptionInput.value.trim());
        formData.append('linkedinLink', linkedinLinkInput.value.trim());
        formData.append('githubLink', githubLinkInput.value.trim());
        formData.append('projectImage', projectImageInput.files[0]);
        

        try {
            // 3. Send the data to the API endpoint
            const response = await fetch('/api/projects', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || 'An unknown error occurred.');
            }

            // 4. Handle a successful response
            showToast(result.message, 'success');
            setTimeout(() => {
                window.location.href = '/projects'; // Redirect after 2 seconds
            }, 2000);

        } catch (error) {
            // 5. Handle any errors during submission
            console.error('Submission failed:', error);
            showToast(`Error: ${error.message}`, 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-plus-circle"></i> Add Project';
        }
    });

    /**
     * Checks if all required form fields have values.
     * @returns {boolean} True if valid, false otherwise.
     */
    function validateForm() {
        if (!projectTitleInput.value.trim() || !techStackInput.value.trim() || !projectDescriptionInput.value.trim()) {
            return false;
        }
        if (projectImageInput.files.length === 0) {
            return false;
        }
        return true;
    }

    /**
     * Displays a temporary notification pop-up.
     * @param {string} message The message to display.
     * @param {string} type 'success' or 'error'.
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }
});