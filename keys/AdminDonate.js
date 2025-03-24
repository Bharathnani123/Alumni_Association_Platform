async function fetchDonations() {
    const response = await fetch('/api/donations');
    const data = await response.json();
    const donationsTable = document.querySelector('#donationsTable tbody');
    donationsTable.innerHTML = ''; // Clear existing rows

    let totalAmount = 0;

    data.donations.forEach(donation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donation.name}</td>
            <td>${donation.email}</td>
            <td>$${donation.amount.toFixed(2)}</td>
            <td><img src="uploads/${donation.screenshot}" alt="Screenshot" width="200" /></td>
            <td><button onclick="deleteDonation('${donation._id}')">Delete</button></td>
        `;
        donationsTable.appendChild(row);
        totalAmount += donation.amount;
    });

    document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
}

async function deleteDonation(id) {
    const response = await fetch(`/api/donations/${id}`, { method: 'DELETE' });

    if (response.ok) {
        alert('Donation deleted successfully');
        fetchDonations(); // Refresh the donation list
    } else {
        alert('Failed to delete donation');
    }
}

// Fetch donations when the page loads
window.onload = fetchDonations;
