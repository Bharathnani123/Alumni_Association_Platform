// Toggle form visibility
const fillFormButton = document.getElementById('fillFormButton');
const paymentFormContainer = document.getElementById('paymentFormContainer');

fillFormButton.addEventListener('click', () => {
    paymentFormContainer.classList.toggle('hidden');
});

// Handle form submission
const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(paymentForm);
    const response = await fetch('/api/payments', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Payment details submitted successfully!');
        paymentForm.reset();
        paymentFormContainer.classList.add('hidden');
    } else {
        alert('Failed to submit payment details. Please try again.');
    }
});
