document.getElementById('checkForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const rollNo = document.getElementById('rollNo').value;
    const fullName = document.getElementById('fullName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;

    const response = await fetch('/check-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rollNo, fullName, dateOfBirth })
    });

    const message = await response.text();
    document.getElementById('message').innerText = message;

    if (response.ok) {
        window.location = "Register"; // Redirect to registration page
    }
});