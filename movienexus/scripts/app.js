// movienexus/scripts/app.js

// API Key and DOM Elements
const API_KEY = "53bf08ae"; // OMDB API key
const searchInput = document.getElementById("movie-search"); // Search input element
const searchButton = document.getElementById("search-button"); // Search button element
const resultsSection = document.getElementById("results-section"); // Section where search results will be displayed
const sortSelect = document.getElementById("sortMovies"); // Sort select element
const spinner = document.getElementById("loading-spinner"); // Loading spinner element

// Global Variables and Constants
let currentMovies = []; // Stores the current search results for watchlist functionality

// Movie Search Functionality
function handleSearch() {
  const query = searchInput.value.trim();
  if (query !== "") {
    fetchMovies(query);
  }
}

// Click event for search button
searchButton.addEventListener("click", handleSearch);

// Enter key event for search input
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission if inside a form
    handleSearch();
  }
});

// Fetch Movies from the OMDB API
async function fetchMovies(query) {
  // Show loading spinner
  spinner.classList.remove("hidden");
  searchButton.disabled = true; // Disable search button while loading
  resultsSection.innerHTML = ""; // Clear previous results

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.Response === "True") {
      sortSelect.value = ""; // Resets sort select to default
      displayResults(data.Search);
    } else {
      resultsSection.innerHTML = `<p>No results found.</p>`;
    }
  } catch (error) {
    resultsSection.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    console.error("Fetch error:", error);
  } finally {
    // Hide loading spinner
    spinner.classList.add("hidden");
    searchButton.disabled = false; // Re-enable search button
  }
}

// Display Movie Results Function
function displayResults(movies) {
  currentMovies = movies; // Store globally for watchlist functionality

  console.log(currentMovies[0]); // Added this line to confirm the API is working & returning data correctly

  resultsSection.innerHTML = movies
    .map(
      (movie) => `
      <div class="movie-card">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'assets/images/placeholder.jpg'}" alt="${movie.Title}" />
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <button class="add-to-watchlist" data-id="${movie.imdbID}">Add to Watchlist</button>
      </div>
    `
    )
    .join("");

  // Sorting Movies by year functionality
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;

    if (!value) return;

    let sortedMovies = [...currentMovies];

    if (value === "newest") {
      sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
    } else if (value === "oldest") {
      sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
    }

    displayResults(sortedMovies);
  });

  // Event listeners to "Add to Watchlist" buttons
  document.querySelectorAll(".add-to-watchlist").forEach(button => {
    button.addEventListener("click", () => {
      const imdbID = button.dataset.id;
      const movie = movies.find(m => m.imdbID === imdbID);
      addToWatchList(movie);
    });
  });
}

// Add Movie to Watchlist Function
function addToWatchList(movie) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  // Avoid ducplicates
  if (watchlist.some(m => m.imdbID === movie.imdbID)) return;

  watchlist.push(movie);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));

  alert(`${movie.Title} added to watchlist!`);
}

// Light/Dark Theme Toggle with SVG Icon
const toggleButton = document.getElementById('theme-toggle');
const icon = document.getElementById('theme-icon');
const body = document.body;

const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0012 17a7 7 0 009-4.21z"></path>
</svg>`;

const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>`;

// Function to update theme and icon
function updateTheme(theme) {
  body.className = theme;
  localStorage.setItem('theme', theme);
  icon.innerHTML = theme === 'dark-theme' ? moonIcon : sunIcon;
}

// Initial theme setup
const savedTheme = localStorage.getItem('theme') || 'light-theme';
updateTheme(savedTheme);

// Toggle theme on button click
toggleButton.addEventListener('click', () => {
  const currentTheme = body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
  const newTheme = currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';

  // Update theme icon (sun or moon)
  updateTheme(newTheme);

  // Glow animation
  icon.classList.add('glow');

  // Remove glow after animation ends
  setTimeout(() => {
    icon.classList.remove('glow');
  }, 500); // Duration of the CSS glow animation
});