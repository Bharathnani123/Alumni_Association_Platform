document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
});

//groups
document.getElementById('view-groups').addEventListener('click', fetchGroups);

async function fetchGroups() {
    const response = await fetch('/admin/groups');
    const groups = await response.json();
    displayGroups(groups);
    console.log(groups);
}

function displayGroups(groups) {
    const groupsContainer = document.getElementById('groupsContainer');
    groupsContainer.innerHTML = '';  // Clear previous groups

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
                <button class="join-btn" data-id="${group._id}">Edit</button>
                <button class="join-btn" data-id="${group._id}">Delete</button>
            </div>
        `;
        groupsContainer.appendChild(groupElement);
    });


    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => editGroup(button.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteGroup(button.dataset.id));
    });
}

async function editGroup(id) {
    const groupName = prompt("Enter new group name:");
    const groupPurpose = prompt("Enter new group purpose:");
    const targetAudience = prompt("Enter new target audience:");
    const groupImage = prompt("Enter new group image URL:");

    await fetch(`/admin/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName, groupPurpose, targetAudience, groupImage })
    });
    fetchGroups();
}

async function deleteGroup(id) {
    if (confirm("Are you sure you want to delete this group?")) {
        await fetch(`/admin/groups/${id}`, {
            method: 'DELETE'
        });
        fetchGroups();  // Refresh groups after deletion
    }
}

// Modal functionality
const modal = document.getElementById('groupsModal');
const span = document.getElementsByClassName('close')[0];

document.getElementById('view-groups').onclick = function () {
    modal.style.display = 'block';
}

span.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
//mentors
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
                    <p><strong>Areas of Guidance:</strong> ${mentor.areasOfGuidance}</p>
                    <button class="request-btn" onclick="requestMentorship('${mentor._id}')">Request Mentorship</button>
                    <button class="edit-btn" onclick="editMentor('${mentor._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteMentor('${mentor._id}')">Delete</button>
                `;

                mentorContainer.appendChild(mentorCard);
            });
        })
        .catch(error => console.error('Error fetching mentors:', error));
}

function closeMentorPopup() {
    document.getElementById('mentor-popup').style.display = 'none';
}

// Function to request mentorship
function requestMentorship(mentorId) {
    alert('Requesting mentorship from mentor with ID: ' + mentorId);
    // You can add additional logic to send a request
}

// Function to edit mentor details
function editMentor(mentorId) {
    const newName = prompt('Enter new mentor name:');
    const newEmail = prompt('Enter new mentor email:');
    const newDepartment = prompt('Enter new mentor department:');
    const newAreasOfGuidance = prompt('Enter new areas of guidance:');
    const newProfileImage = prompt('Enter new profile image URL:');

    fetch(`/api/mentors/${mentorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: newName,
            email: newEmail,
            department: newDepartment,
            areasOfGuidance: newAreasOfGuidance,
            profileImage: newProfileImage
        })
    })
    .then(() => openMentorPopup()) // Refresh mentor profiles after update
    .catch(error => console.error('Error editing mentor:', error));
}

// Function to delete mentor
function deleteMentor(mentorId) {
    if (confirm('Are you sure you want to delete this mentor?')) {
        fetch(`/api/mentors/${mentorId}`, {
            method: 'DELETE'
        })
        .then(() => openMentorPopup()) // Refresh mentor profiles after deletion
        .catch(error => console.error('Error deleting mentor:', error));
    }
}