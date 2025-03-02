document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const image = item.querySelector('.gallery-image');
        const description = item.querySelector('.description');

        image.addEventListener('click', () => {
            if (description.classList.contains('hidden')) {
                description.classList.remove('hidden');
                item.classList.add('show-description');
            } else {
                description.classList.add('hidden');
                item.classList.remove('show-description');
            }
        });
    });
});
