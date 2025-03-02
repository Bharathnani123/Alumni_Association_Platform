// latestUpdates.js
document.getElementById('latestUpdatesForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const updateTitle = document.getElementById('updateTitle').value;
    const updateDescription = document.getElementById('updateDescription').value;
    const updateDate = document.getElementById('updateDate').value;

    try {
        const response = await fetch('/post-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: updateTitle,
                description: updateDescription,
                date: updateDate
            })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('updateSuccess').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('updateSuccess').classList.add('hidden');
            }, 3000);
        } else {
            alert('Error posting update.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
