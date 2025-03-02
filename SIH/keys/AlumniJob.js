document.getElementById('jobPostForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = new FormData(event.target);
    const jobData = {
        title: formData.get('title'),
        img: formData.get('img'),
        eligibility: formData.get('eligibility'),
        package: formData.get('package'),
        jobType: formData.get('jobType'),
        lastDate: formData.get('lastDate'),
        registrationLink: formData.get('registrationLink'),
        postedBy: formData.get('postedBy')
    };

    try {
        const response = await fetch('/api/jobs', { // Adjust the endpoint as needed
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });

        const result = await response.json();

        if (result.success) {
            alert('Job posted successfully!');
            // Optionally clear the form or redirect
            document.getElementById('jobPostForm').reset();
        } else {
            alert(`Error posting job: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
    }
});
