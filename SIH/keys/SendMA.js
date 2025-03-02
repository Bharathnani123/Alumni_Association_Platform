document.getElementById('sendMessageForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const message = document.getElementById('messageContent').value;
    const type = document.getElementById('messageType').value;
    const department = document.getElementById('department').value;
    const batch = document.getElementById('batch').value;
    const group = document.getElementById('group').value;
    const recipientEmail = document.getElementById('recipientEmail').value;

    

    try {
        const response = await fetch('/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                type,
                department,
                batch,
                group,
                recipientEmail
            })
        });

        const result = await response.json();
        if (result.success) {
            showSuccessMessage();
            clearForm();
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

function showSuccessMessage() {
    const successMessage = document.getElementById('messageSuccess');
    successMessage.classList.remove('hidden');
    
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);  // Hide message after 3 seconds
}

function clearForm() {
    document.getElementById('sendMessageForm').reset();
}
