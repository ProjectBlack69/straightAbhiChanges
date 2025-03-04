document.addEventListener('DOMContentLoaded', function() {
    // Profile update form submission
    const profileForm = document.querySelector('.profile-page-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            formData.append('update_profile', true); // Explicitly add action

            fetch('/customer/profile/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    showModal('Success', data.message);
                } else {
                    console.error('Error:', data.message);
                    handleErrors(data.message, 'profile');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Password change form submission
    const passwordForm = document.querySelector('.profile-password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            formData.append('change_password', true); // Explicitly add action

            fetch('/customer/profile/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    showModal('Success', data.message);
                    closePasswordModal(); // Optionally close the modal
                } else {
                    console.error('Error:', data.message);
                    handleErrors(data.message, 'password');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

// Helper to display errors in a modal
function handleErrors(errors, formType) {
    let errorMsg = '';

    if (formType === 'profile') {
        if (errors.user_errors) {
            errorMsg += 'User Errors:\n' + formatErrorMessages(errors.user_errors);
        }
        if (errors.profile_errors) {
            errorMsg += '\nProfile Errors:\n' + formatErrorMessages(errors.profile_errors);
        }
    } else if (formType === 'password') {
        if (errors.password_errors) {
            errorMsg += 'Password Errors:\n' + formatErrorMessages(errors.password_errors);
        }
    }

    showModal('Error', errorMsg || 'An unknown error occurred.');
}

// Helper function to format error messages from JSON
function formatErrorMessages(errorObj) {
    let formattedErrors = '';
    for (let field in errorObj) {
        if (errorObj.hasOwnProperty(field)) {
            formattedErrors += `${field}: `;
            const errors = JSON.parse(errorObj[field]);
            errors.forEach(error => {
                formattedErrors += `${error.message}\n`;
            });
        }
    }
    return formattedErrors;
}

// Helper to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to open the profile password change modal
function openPasswordModal() {
    document.getElementById("profilePasswordModal").style.display = "block";
}

// Function to close the profile password change modal
function closePasswordModal() {
    document.getElementById("profilePasswordModal").style.display = "none";
}

// Event listener for closing modal when clicked outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById("profilePasswordModal");
    if (event.target === modal) {
        event.preventDefault(); // Prevent default behavior
        closePasswordModal();  // Your custom function to handle closing the modal
    }
};

document.querySelector('span.close').addEventListener('click', closePasswordModal);

function triggerFileInput() {
    document.getElementById('profilePictureInput').click();
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('profile_picture', file);

        fetch('/customer/update-profile-picture/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Update the displayed profile picture
                document.querySelector('.profile-picture img').src = data.url;

                // Show the success modal
                showModal('Updated Successfully', 'Your profile picture has been updated.', true);
            } else {
                showModal('Error', data.message, false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('Error', 'An unexpected error occurred. Please try again.', false);
        });
    }
}

// Function to show the modal with a reload option
function showModal(title, message, shouldReload) {
    const modal = document.getElementById("updateModal");
    const modalMessage = document.getElementById("modalMessage"); 
    const okButton = document.querySelector(".update-close-btn"); 

    modalMessage.innerHTML = `<strong style="font-size:30px; color:green;">${title}</strong><br>${message}`;
    modal.style.display = "block";

    // Close modal when "OK" is clicked
    okButton.onclick = function () {
        modal.style.display = "none";
            location.reload(); // Reloads after clicking the OK button
    };
}

// Close modal when clicking outside the modal content
window.onclick = function (event) {
    const modal = document.getElementById("updateModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
