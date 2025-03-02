document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
});
/*document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.expand-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            content.classList.toggle('show');
        });
    });
});*/

//function for job postings
function ViewDetails() {
    window.location = "jobposting";
};

//Event Details
function EventDetails() {
    window.location = "/events/upcome";
};

//latest Updates
function LatestUpdate() {
    window.location = "/latestUpdate";
};
//display Acheivements
function DisplayAcheive() {
    window.location = "/displayAcheivements";
};


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
        console.log(result)
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
document.querySelector('#edit-profile-popup form').addEventListener('submit', function (event) {
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


document.addEventListener('DOMContentLoaded', () => {
    const createGroupLink = document.getElementById('createGroupLink');
    const createGroupForm = document.getElementById('createGroupForm');
    const closeCreateForm = document.getElementById('closeCreateForm');
    const groupForm = document.getElementById('groupForm');

    // Show Create Group Form
    createGroupLink.addEventListener('click', (e) => {
        e.preventDefault();
        createGroupForm.style.display = 'block';
    });

    // Close Create Group Form
    closeCreateForm.addEventListener('click', () => {
        createGroupForm.style.display = 'none';
    });

    // Create Group Form Submission
    groupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const groupName = document.getElementById('groupName').value;
        const groupPurpose = document.getElementById('groupPurpose').value;
        const targetAudience = document.getElementById('targetAudience').value;
        const groupImage = document.getElementById('groupImg').value;
        const email = document.getElementById('Email').value;

        const groupData = {
            groupName,
            groupPurpose,
            targetAudience,
            groupImage,
            email
        };

        // Send to backend
        await fetch('/create-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData)
        });

        alert('Group Created Successfully');
        createGroupForm.classList.add('hidden');
        groupForm.reset();
    });
});
//groups showing
document.addEventListener('DOMContentLoaded', () => {
    const showGroupsLink = document.getElementById('showGroupsLink');
    const groupsModal = document.getElementById('groupsModal');
    const closeGroupsList = document.getElementById('closeGroupsList');
    const groupsContainer = document.getElementById('groupsContainer');

    // Show groups modal
    showGroupsLink.addEventListener('click', async (e) => {
        e.preventDefault();
        groupsModal.style.display = 'flex';
        await loadGroups();
    });

    // Close the groups modal
    closeGroupsList.addEventListener('click', () => {
        groupsModal.style.display = 'none';
    });

    // Close the modal if clicking outside of the content
    window.addEventListener('click', (e) => {
        if (e.target === groupsModal) {
            groupsModal.style.display = 'none';
        }
    });

    // Load groups from backend and display them
    async function loadGroups() {
        groupsContainer.innerHTML = '';  // Clear previous groups
        const response = await fetch('/groups');
        const groups = await response.json();
    
        groups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'group';
            groupElement.innerHTML = `
                <div class="group-image-container">
                    <img src="${group.groupImage}" alt="Group Image" />
                </div>
                <div class="group-details-container">
                    <h3>${group.groupName}</h3>
                    <p>${group.groupPurpose}</p>
                    <p>Audience: ${group.targetAudience}</p>
                    <button class="join-btn" data-group-id="${group.groupName}">Join Group</button>
                </div>
            `;
            groupsContainer.appendChild(groupElement);
        });
    
        // Attach click event to each Join button and update initial button status
        document.querySelectorAll('.join-btn').forEach(btn => {
            const groupId = btn.getAttribute('data-group-id');
            
            // Check local storage and update button status on load
            updateJoinButton(btn, groupId);
    
            // Add click event for joining
            btn.addEventListener('click', async (e) => {
                // Check if already joined
                if (localStorage.getItem(`isJoined-${groupId}`) === 'true') {
                    alert('You are already joined in this group');
                    return;
                }
    
                // Post request to join the group
                const response = await fetch(`/join-group/${groupId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    alert('You have joined the group!');
                    localStorage.setItem(`isJoined-${groupId}`, 'true'); // Store join status for this group
                    updateJoinButton(e.target, groupId); // Update button immediately
                } else {
                    alert('Failed to join the group');
                }
            });
        });
    }
    });
    
    // Function to update button based on group join status
    function updateJoinButton(button, groupId) {
        if (localStorage.getItem(`isJoined-${groupId}`) === 'true') {
            button.classList.remove('join-btn');
            button.classList.add('already-joined-btn');
            button.textContent = 'Already Joined';
            button.onclick = () => alert('You are already joined in this group');
        } else {
            button.classList.add('join-btn');
            button.textContent = 'Join Group';
        }
    }
    
    // Load groups when the page loads
    window.onload = loadGroups;
//saerch functionality

function searchStudents() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    fetch(`/api/searchStudents?query=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }
            return response.json();
        })
        .then(data => {
            const resultsContainer = document.getElementById('resultsContainer');
            resultsContainer.innerHTML = ''; // Clear previous results

            if (data.members.length > 0) {
                data.members.forEach(member => {
                    const memberDiv = document.createElement('div');
                    memberDiv.className = 'member';
                    memberDiv.innerHTML = `
                        <img src="uploads/${member.img}" alt="${member.FullName}">
                        <strong>${member.FullName}</strong><br>
                        <span>Batch: ${member.batch}</span><br>
                        <span>Department: ${member.department}</span><br>
                        <span>Type: ${member.type}</span>
                        <span>Email: ${member.email}</span>
                        <span>PhoneNo: ${member.Phno}</span>
                    `;
                    resultsContainer.appendChild(memberDiv);
                });
            } else {
                resultsContainer.innerHTML = '<p>No members found.</p>';
            }

            // Show the modal
            document.getElementById('resultsModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching members:', error);
            alert('Failed to fetch results. Please try again.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('resultsModal').style.display = 'none';
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        const modal = document.getElementById('resultsModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

