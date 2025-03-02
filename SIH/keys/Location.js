// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India by default

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch existing alumni locations
async function loadAlumniLocations() {
    try {
        const response = await fetch('/api/alumni-locations');
        const data = await response.json();
        data.forEach(alumni => {
            L.marker([alumni.latitude, alumni.longitude])
                .addTo(map)
                .bindPopup(`<b>${alumni.name}</b><br>${alumni.location}`);
        });
    } catch (error) {
        console.error('Error fetching alumni locations:', error);
    }
}

loadAlumniLocations();

// Handle form submission
document.getElementById('locationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('alumniName').value;
    const location = document.getElementById('alumniLocation').value;
    const [latitude, longitude] = await getCoordinates(location);

    // Add marker for current user
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<b>${name}</b><br>${location}`)
        .openPopup();

    // Send location to server
    try {
        await fetch('/api/add-alumni-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, location, latitude, longitude })
        });
        alert('Location marked successfully!');
    } catch (error) {
        console.error('Error marking location:', error);
    }
});

// Function to get coordinates from location name
async function getCoordinates(location) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`);
    const data = await response.json();
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}
