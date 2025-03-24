document.addEventListener('DOMContentLoaded', () => {
    const storyType = document.getElementById('storyType');
    const galleryForm = document.getElementById('galleryForm');
    const profilesForm = document.getElementById('profilesForm');
    const interviewsForm = document.getElementById('interviewsForm');

    storyType.addEventListener('change', () => {
        const selectedType = storyType.value;
        galleryForm.classList.add('hidden');
        profilesForm.classList.add('hidden');
        interviewsForm.classList.add('hidden');

        if (selectedType === 'gallery') {
            galleryForm.classList.remove('hidden');
        } else if (selectedType === 'profiles') {
            profilesForm.classList.remove('hidden');
        } else if (selectedType === 'interviews') {
            interviewsForm.classList.remove('hidden');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('successStoryForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Get form data
        const formData = new FormData(form);
        const storyType = formData.get('storyType');


        const data = {
            storyType: storyType
        };
        

        if (storyType === 'gallery') {
            data.galleryTitle = formData.get('galleryTitle');
            data.galleryImage = formData.get('galleryImage');
        } else if (storyType === 'profiles') {
            data.profilePhoto=formData.get('profilePhoto');
            data.fullName = formData.get('fullName');
            data.batch = formData.get('batch');
            data.achievement = formData.get('achievement');
            data.description = formData.get('description');
            data.location = formData.get('location');
            data.contact = formData.get('contact');
        } else if (storyType === 'interviews') {
            data.interviewTitle = formData.get('interviewTitle');
            data.interviewDate = formData.get('interviewDate');
            data.interviewVideo = formData.get('interviewVideo');
            data.interviewSummary = formData.get('interviewSummary');
        }
        console.log(data)

        try {
            const response = await fetch('/admin/post-success-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Success story posted successfully!');
                form.reset(); // Reset the form fields
            } else {
                alert(`Error: ${result.msg}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while posting the success story.');
        }
    });
});
