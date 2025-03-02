document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
});
function openMentorPopup() {
    document.getElementById('mentor-popup').style.display = 'block';
    
    // Fetch mentor profiles from the server
    fetch('/api/mentors')
        .then(response => response.json())
        .then(data => {
            const mentorContainer = document.getElementById('mentor-container');
            mentorContainer.innerHTML = ''; // Clear any existing content

            data.forEach(mentor => {
                // Create mentor profile cards
                const mentorCard = document.createElement('div');
                mentorCard.classList.add('mentor-card');
                
                mentorCard.innerHTML = `
                    <img src="${mentor.profileImage}" alt="${mentor.name}" class="mentor-image">
                    <h3>${mentor.name}</h3>
                    <p><strong>Email:</strong> ${mentor.email}</p>
                    <p><strong>Department:</strong> ${mentor.department}</p>
                    <p><strong>areasOfGuidance:</strong> ${mentor.areasOfGuidance}</p>
                    <button class="request-btn" onclick="requestMentorship('${mentor._id}')">Request Mentorship</button>
                `;
                
                mentorContainer.appendChild(mentorCard);
            });
        })
        .catch(error => console.error('Error fetching mentors:', error));
}

// Function to close the pop-up
function closeMentorPopup() {
    document.getElementById('mentor-popup').style.display = 'none';
}
//Profile
document.addEventListener('DOMContentLoaded', () => {
    const profileLink = document.getElementById('profile-link');
    const profilePopup = document.getElementById('profile-popup');
    const editButton = document.getElementById('edit-button');
    const editProfilePopup = document.getElementById('edit-profile-popup');
    const closeButtons = document.querySelectorAll('.close');

    // Show profile popup
    profileLink.addEventListener('click', () => {
        profilePopup.style.display = 'block';
    });

    // Show edit profile popup
    editButton.addEventListener('click', () => {
        profilePopup.style.display = 'none';
        editProfilePopup.style.display = 'block';
    });

    // Close popups
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            profilePopup.style.display = 'none';
            editProfilePopup.style.display = 'none';
        });
    });

    // Close popup when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === profilePopup || event.target === editProfilePopup) {
            profilePopup.style.display = 'none';
            editProfilePopup.style.display = 'none';
        }
    });
});

async function EditProfile(profileData) {
    try {
        const response = await fetch('/profile/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        const result = await response.json();
        if (result.success) {
            // Update the profile details on the page
            document.getElementById('displayName').innerHTML = `<p><strong>Name:</strong>${result.profile.FullName}</p>`;
            document.getElementById('displayBatchYear').innerHTML = `<p><strong>Batch Year:</strong> ${result.profile.batch}</p>`;
            document.getElementById('displayDepartment').innerHTML = `<p><strong>department:</strong> ${result.profile.department}</p>`;

            // Show the success message
            alert(result.message);
        } else {
            // Show an alert for failure with the error message
            alert(`Error updating profile1: ${result.message}`);
        }
    } catch (error) {
        // Handle any errors that occurred during fetch
        console.error('Error:', error);
        alert('An unexpected error occurred.');
    }
}
// Handle form submission
document.querySelector('#edit-profile-popup form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = new FormData(event.target);
    const profileData = {
        name: formData.get('name'),
        email: formData.get('email'),
        batchYear: formData.get('batchYear'),
        department: formData.get('department')
    };

    // Call EditProfile function with the collected data
    EditProfile(profileData);
});

// Toggle notifications and mark them as read
function toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    dropdown.classList.toggle('hidden');

    if (!dropdown.classList.contains('hidden')) {
        // If dropdown is shown, mark notifications as read
        markNotificationsAsRead();
    }
}

// Fetch and mark notifications as read
async function markNotificationsAsRead() {
    try {
        const response = await fetch('/notifications/markAsRead', {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Failed to mark notifications as read');
        }

        // After marking notifications as read, reset unread count
        updateUnreadCount(0);
    } catch (error) {
        console.error('Error marking notifications as read:', error);
    }
}

// Load notifications (modify to handle unread count)
async function loadNotifications() {
    try {
        const response = await fetch('/notifications');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
        }

        const data = await response.json();

        if (data.success) {
            displayNotifications(data.notifications);
            // Count and display unread notifications
            const unreadCount = data.notifications.filter(n => !n.read).length;
            updateUnreadCount(unreadCount);
        } else {
            console.error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Display notifications in the dropdown
function displayNotifications(notifications) {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = '';  // Clear previous notifications

    notifications.forEach(notification => {
        const listItem = document.createElement('li');
        listItem.classList.add('notification-item');
        listItem.innerHTML = `
            <p><strong>${notification.sender}</strong></p>
            <p>${notification.message}</p>
            <p><small>${new Date(notification.timestamp).toLocaleString()}</small></p>
        `;
        notificationList.appendChild(listItem);
    });
}

// Update unread count on the notification icon
function updateUnreadCount(count) {
    const notificationIcon = document.querySelector('.notification-icon');
    const unreadBadge = document.createElement('span');
    unreadBadge.classList.add('unread-count');
    
    // If count > 0, display unread badge
    if (count > 0) {
        unreadBadge.textContent = count;
        notificationIcon.appendChild(unreadBadge);
    } else {
        // If no unread messages, remove the badge
        const existingBadge = document.querySelector('.unread-count');
        if (existingBadge) {
            existingBadge.remove();
        }
    }
}

// Call loadNotifications on page load
window.onload = () => loadNotifications();


