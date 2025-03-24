// Ensure the script is loaded after Socket.io
const socket = io(); // Connect to Socket.io server

// Function to join a chat room
function joinChatRoom(studentId, alumniId) {
    socket.emit('joinRoom', { studentId, alumniId });
}

// Function to send a message
function sendMessage(alumniId, sender, text) {
    socket.emit('sendMessage', { alumniId, sender, text });
}

// Handle incoming messages
socket.on('receiveMessage', (message) => {
    const chatContent = document.getElementById('chatContent');
    chatContent.innerHTML += `<p><strong>${message.sender}:</strong> ${message.text}</p>`;
});
