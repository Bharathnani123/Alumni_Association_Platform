function toggleMenu() {
    var menuOptions = document.getElementById("menuOptions");
    if (menuOptions.style.display === "block") {
      menuOptions.style.display = "none";
    } else {
      menuOptions.style.display = "block";
    }
  }

async function searchBooks() {
    const query = document.getElementById('searchInput').value.trim();
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; // Clear previous search results

    if (query === '') {
        fetchSuggestions(); // Fetch and display suggestions
        searchResultsDiv.textContent = 'Please enter a search query.';
        return;
    }

    try {
        const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
        const books = await response.json();

        const suggestionsDiv = document.getElementById('suggestions1');
        suggestionsDiv.innerHTML = ''; // Clear suggestions

        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book'); // Add book class
            bookDiv.innerHTML = `
            <img src="${book.image}" alt="${book.Title}" style="max-width: 200px;">
            <h3>${book.Title}</h3>
            <p>Author: ${book.Author}</p>
            <p>Genre: ${book.Genre}</p>
            <p>Available: ${book.Available}</p>
            <button class="btn1" onclick="bookNow('${book.userId}')">Book Now</button>
            `;
            suggestionsDiv.appendChild(bookDiv);
        });
    } catch (error) {
        console.error('Error fetching search results:', error);
        searchResultsDiv.textContent = 'An error occurred while fetching search results.';
    }
}
 
  async function fetchSuggestions() {
    try {
        const response = await fetch('/suggestions1');
        const suggestions1 = await response.json();

        const suggestionsDiv = document.getElementById('suggestions1');
        suggestions1.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');
            bookDiv.innerHTML = `
                <img src="${book.image}" alt="${book.Title}" style="max-width: 200px;">
                <h3>${book.Title}</h3>
                <p>Author: ${book.Author}</p>
                <p>Genre: ${book.Genre}</p>
                <p>Available: ${book.Available}</p>
                <button class="btn1" onclick="bookNow('${book.userId}')">Book Now</button>
            `;
            suggestionsDiv.appendChild(bookDiv);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

async function bookNow(bookId) {
    try {
        const studentName = document.getElementById('display-name').textContent; // Get student name from login details
        const response = await fetch(`/books/${bookId}/lend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentName: studentName })
        });
        if (response.ok) {
            const successMessage = '<h1>Book added successfully</h1>';
            document.body.innerHTML = successMessage;
        } else {
            console.error("Failed to add book:", response.status);
        }
    } catch (error) {
        console.error('Error lending book', error);
        // Handle error or display error message
    }
}





fetchSuggestions();