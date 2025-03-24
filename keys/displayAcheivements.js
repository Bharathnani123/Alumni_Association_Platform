document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('achievements-container');

    // Fetch achievements from the backend
    const res = await fetch('/achievements');
    const achievements = await res.json();

    achievements.forEach(achievement => {
        const achievementDiv = document.createElement('div');
        achievementDiv.classList.add('achievement-summary');

        achievementDiv.innerHTML = `
            <img src="${achievement.image}" alt="Achievement Image" class="achievement-image">
            <h3 class="achievement-title">${achievement.title}</h3>
            <p class="alumni-name">By: ${achievement.alumniName}, Batch of ${achievement.batchYear}</p>
            <p class="brief-summary">${achievement.briefSummary}</p>
            <button class="view-more">View More</button>

            <div class="achievement-details" style="display: none;">
                <p><strong>Full Details:</strong> ${achievement.fullDetails}</p>
                <p><strong>Skills Highlighted:</strong> ${achievement.skillsHighlighted}</p>
                <p><strong>Awards:</strong> ${achievement.awards}</p>
                <p><strong>Challenges:</strong> ${achievement.challenges}</p>
                <p><strong>Future Goals:</strong> ${achievement.futureGoals}</p>
                <p><strong>Tags:</strong> ${achievement.tags.join(', ')}</p>

                <!-- Like Button -->
                <div class="like-section">
                    <button class="like-btn">❤️ Like (<span class="like-count">${achievement.likes}</span>)</button>
                </div>

                <!-- Comment Section -->
                <div class="comment-section">
                    <h4>Comments</h4>
                    <div class="comments">
                        ${achievement.comments.map(comment => `
                            <p><strong>${comment.alumniName}:</strong> ${comment.comment}</p>
                        `).join('')}
                    </div>
                    <input type="text" class="comment-input" placeholder="Add a comment">
                    <button class="comment-btn">Post Comment</button>
                </div>

                <!-- Tag Alumni Section -->
                <div class="tag-section">
                    <input type="text" class="tag-input" placeholder="Tag Alumni">
                    <button class="tag-btn">Tag</button>
                </div>
            </div>
        `;

        container.appendChild(achievementDiv);

        // Expand/Collapse Details
        const viewMoreBtn = achievementDiv.querySelector('.view-more');
        const detailsDiv = achievementDiv.querySelector('.achievement-details');

        viewMoreBtn.addEventListener('click', () => {
            detailsDiv.style.display = detailsDiv.style.display === 'block' ? 'none' : 'block';
        });

        // Like Button Functionality
        const likeBtn = achievementDiv.querySelector('.like-btn');
        const likeCount = achievementDiv.querySelector('.like-count');

        likeBtn.addEventListener('click', async () => {
            const res = await fetch(`/achievements/${achievement._id}/like`, { method: 'POST' });
            const data = await res.json();
            likeCount.textContent = data.likes;
        });

        // Comment Functionality
        const commentBtn = achievementDiv.querySelector('.comment-btn');
        const commentInput = achievementDiv.querySelector('.comment-input');
        const commentsDiv = achievementDiv.querySelector('.comments');

        commentBtn.addEventListener('click', async () => {
            const commentText = commentInput.value;
            if (!commentText) return;

            const commentData = {
                alumniName: "Current Alumni", // Fetch this from logged-in user
                comment: commentText,
            };

            const res = await fetch(`/achievements/${achievement._id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });
            
            const updatedComments = await res.json();

            commentsDiv.innerHTML = updatedComments.map(comment => `
                <p><strong>${comment.alumniName}:</strong> ${comment.comment}</p>
            `).join('');

            commentInput.value = ''; // Clear input
        });

        // Tag Alumni Functionality
        const tagBtn = achievementDiv.querySelector('.tag-btn');
        const tagInput = achievementDiv.querySelector('.tag-input');
        const tagsDiv = achievementDiv.querySelector('.achievement-details p:nth-of-type(6)'); // Target tags paragraph

        tagBtn.addEventListener('click', async () => {
            const tagsText = tagInput.value;
            if (!tagsText) return;

            const tagData = {
                tags: tagsText.split(',').map(tag => tag.trim()), // Split tags by commas
            };

            const res = await fetch(`/achievements/${achievement._id}/tag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tagData),
            });

            const updatedTags = await res.json();
            tagsDiv.innerHTML = `<strong>Tags:</strong> ${updatedTags.join(', ')}`;
            tagInput.value = ''; // Clear input
        });
    });
});
