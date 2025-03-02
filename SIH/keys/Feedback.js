document.getElementById('feedbackForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        });

        const result = await response.json();
        console.log(result);
        if (result.success) {
            document.getElementById('form-message').textContent = result.message;
        } else {
            document.getElementById('form-message').textContent = 'Error submitting feedback1';
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        document.getElementById('form-message').textContent = 'Error submitting feedback';
    }
});
