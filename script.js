// fetch movie data
const API_URL = 'http://localhost:3000/films'; 

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
});

function fetchMovies() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      displayFirstMovie(data[0]);
      displayMovieList(data);
    })
    .catch(error => console.error('Error fetching movies:', error));
}

// display first movie
function displayFirstMovie(movie) {
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    
    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = `Runtime: ${movie.runtime} minutes`;
    showtime.textContent = `Showtime: ${movie.showtime}`;
    availableTickets.textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;
    
    // Update the buy ticket button event listener
    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.onclick = () => {
      if (movie.capacity - movie.tickets_sold > 0) {
        movie.tickets_sold++;
        availableTickets.textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;
        
        // Update the server with the new tickets sold count
        updateTicketsSold(movie.id, movie.tickets_sold);
      } else {
        alert('No more tickets available!');
      }
    };
}

// display movie list
function displayMovieList(movies) {
    const filmList = document.getElementById('films');
    filmList.innerHTML = ''; // Clear placeholder
    
    movies.forEach(movie => {
      const li = document.createElement('li');
      li.classList.add('film', 'item');
      li.textContent = movie.title;
      li.addEventListener('click', () => displayFirstMovie(movie));
      filmList.appendChild(li);
    });
}

// Function to update tickets sold on the server
function updateTicketsSold(movieId, ticketsSold) {
  fetch(`${API_URL}/${movieId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tickets_sold: ticketsSold }),
  })
  .then(response => response.json())
  .then(data => console.log('Updated tickets sold:', data))
  .catch(error => console.error('Error updating tickets:', error));
}