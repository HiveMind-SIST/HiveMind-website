/**
 * addmember.js
 *
 * Handles logic for the "Add New Member" form, including file uploads,
 * validation, and API submission.
 */
document.addEventListener('DOMContentLoaded', function () {

    const memberForm = document.getElementById('memberForm');
    if (!memberForm) return;

    // --- Element References ---
    const fullNameInput = document.getElementById('fullName');
    const roleInput = document.getElementById('role');
    const linkedinInput = document.getElementById('linkedin');
    const githubInput = document.getElementById('github');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const profileImageInput = document.getElementById('profileImage');
    const resumeInput = document.getElementById('resume');
    const adminPrivilegesInput = document.getElementById('adminPrivileges');
    const submitButton = memberForm.querySelector('button[type="submit"]');

    /**
     * Helper to make file upload areas interactive.
     */
    function setupFileUpload(uploadAreaId, fileInputId) {
        const uploadArea = document.getElementById(uploadAreaId);
        const fileInput = document.getElementById(fileInputId);
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    const placeholder = uploadArea.querySelector('.upload-placeholder');
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            placeholder.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%; height:100%; object-fit:cover;">`;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        placeholder.innerHTML = `<i class="fas fa-file-check"></i><span>${file.name}</span>`;
                    }
                }
            });
        }
    }

    // Initialize both file upload areas
    setupFileUpload('profileUpload', 'profileImage');
    setupFileUpload('resumeUpload', 'resume');

    // --- Form Submission Handler ---
    memberForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!validateForm()) {
            showToast('Please fill in all required fields (*).', 'error');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

        const formData = new FormData();
        formData.append('fullName', fullNameInput.value.trim());
        formData.append('role', roleInput.value.trim());
        formData.append('linkedin', linkedinInput.value.trim());
        formData.append('github', githubInput.value.trim());
        formData.append('email', emailInput.value.trim());
        formData.append('password', passwordInput.value);
        formData.append('adminPrivileges', adminPrivilegesInput.checked);

        if (profileImageInput.files.length > 0) {
            formData.append('profileImage', profileImageInput.files[0]);
        }
        if (resumeInput.files.length > 0) {
            formData.append('resume', resumeInput.files[0]);
        }

        try {
            const response = await fetch('/api/members', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            // Check for the 409 status code specifically
            if (response.status === 409) {
                // Display a native browser alert for the 409 error
                alert(`Error: ${result.detail || 'User already exists.'}`);
                throw new Error('Form submission aborted due to conflict.');
            }

            if (!response.ok) {
                throw new Error(result.detail || 'An unknown error occurred.');
            }

            showToast(result.message, 'success');
            setTimeout(() => {
                window.location.href = '/members';
            }, 2000);

        } catch (error) {
            console.error('Submission failed:', error);
            // This toast will display for all other errors, not for 409
            if (error.message !== 'Form submission aborted due to conflict.') {
                showToast(`Error: ${error.message}`, 'error');
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-user-plus"></i> Add Member';
        }
    });

    function validateForm() {
        return fullNameInput.value.trim() && roleInput.value.trim() && emailInput.value.trim() && passwordInput.value;
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