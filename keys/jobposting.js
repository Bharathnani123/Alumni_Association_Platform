document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/jobs');
        const jobs = await response.json();

        const jobList = document.getElementById('jobList');
        const jobDetail = document.getElementById('jobDetail');

        // Get the current date
        const currentDate = new Date();

        // Filter out expired jobs and extract unique job titles
        const nonExpiredJobs = jobs.filter(job => new Date(job.lastDate) >= currentDate);
        console.log(nonExpiredJobs);
        const uniqueTitles = [...new Set(nonExpiredJobs.map(job => job.title))];


        // Create a list item for each unique title
        uniqueTitles.forEach((title) => {
            const listItem = document.createElement('li');
            listItem.textContent = title;
            listItem.addEventListener('click', () => showJobsWithTitle(title));
            jobList.appendChild(listItem);
        });

        // Function to display all jobs with the same title
        function showJobsWithTitle(title) {
            jobDetail.innerHTML = ''; // Clear existing details

            const jobsWithTitle = nonExpiredJobs.filter(job => job.title === title);

            jobsWithTitle.forEach(job => {
                const jobBox = document.createElement('div');
                jobBox.classList.add('job-box');

                jobBox.innerHTML = `
                    <img  src="${job.img}" alt="${job.title}">
                    <h3>${job.title}</h3>
                    <p><strong>Eligibility:</strong> ${job.eligibility}</p>
                    <p><strong>Package:</strong> ${job.package}</p>
                    <p><strong>Job Type:</strong> ${job.jobType}</p>
                    <p><strong>Last Date to Apply:</strong> ${new Date(job.lastDate).toLocaleDateString()}</p>
                    <p><strong>Posted By:</strong> ${job.postedBy}</p>
                    <p><strong>Registration Link:</strong> <a href="${job.registrationLink}" target="_blank">Apply Here</a></p>
                `;

                jobDetail.appendChild(jobBox);
            });
        }
    } catch (err) {
        console.error('Failed to fetch jobs:', err);
    }
});
