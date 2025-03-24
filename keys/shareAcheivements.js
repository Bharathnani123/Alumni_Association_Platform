document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('achievements-container');
    const form = document.getElementById('achievement-form');


    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const res = await fetch('/achievements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert('Achievement shared successfully!');
            form.reset();
        } else {
            alert('Error sharing achievement.');
        }
    });
});
