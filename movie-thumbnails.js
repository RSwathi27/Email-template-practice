/**
 * Movie Thumbnails Feature - Copyright Compliant Implementation
 * Uses The Movie Database (TMDB) API for legitimate movie poster access
 */

class MovieThumbnails {
    constructor() {
        // TMDB API configuration
        this.TMDB_BASE_URL = 'https://api.themoviedb.org/3';
        this.TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
        // Note: In production, API key should be in environment variables
        this.API_KEY = 'demo'; // Placeholder - would need real API key
        
        this.movieContainer = null;
        this.movies = [];
    }

    /**
     * Initialize the movie thumbnails section
     */
    init() {
        this.createMovieSection();
        this.loadSampleMovies();
    }

    /**
     * Create the HTML structure for the movie section
     */
    createMovieSection() {
        const toolsSection = document.querySelector('.container');
        if (!toolsSection) return;

        // Create movie section HTML
        const movieSection = document.createElement('div');
        movieSection.className = 'movie-container';
        movieSection.innerHTML = `
            <div class="movie-header">
                <h3>Favorite Movies</h3>
                <div class="movie-input-section">
                    <input type="text" id="movieInput" placeholder="Enter movie title..." />
                    <button id="addMovieBtn" class="btn">Add Movie</button>
                </div>
            </div>
            <div class="movie-grid" id="movieGrid">
                <div class="loading">Loading sample movies...</div>
            </div>
            <div class="tmdb-attribution">
                <small>Movie data provided by <a href="https://www.themoviedb.org/" target="_blank">The Movie Database (TMDB)</a></small>
            </div>
        `;

        // Insert after tools section
        toolsSection.parentNode.insertBefore(movieSection, toolsSection.nextSibling);
        
        this.movieContainer = document.getElementById('movieGrid');
        this.setupEventListeners();
    }

    /**
     * Set up event listeners for movie input
     */
    setupEventListeners() {
        const addBtn = document.getElementById('addMovieBtn');
        const input = document.getElementById('movieInput');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.addMovie());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addMovie();
                }
            });
        }
    }

    /**
     * Load sample movies for demonstration
     */
    loadSampleMovies() {
        const sampleMovies = [
            'The Matrix',
            'Inception',
            'The Godfather',
            'Pulp Fiction'
        ];

        // For demo purposes, use placeholder images
        this.displayMoviesWithPlaceholders(sampleMovies);
    }

    /**
     * Display movies with placeholder images (for demo without API key)
     */
    displayMoviesWithPlaceholders(movieTitles) {
        if (!this.movieContainer) return;

        this.movieContainer.innerHTML = '';

        movieTitles.forEach((title, index) => {
            const movieItem = document.createElement('div');
            movieItem.className = 'movie-item';
            
            // Create placeholder image with movie title
            const placeholderColor = this.getPlaceholderColor(index);
            movieItem.innerHTML = `
                <div class="movie-poster placeholder-poster" style="background-color: ${placeholderColor};">
                    <div class="movie-title-overlay">${title}</div>
                </div>
                <div class="movie-info">
                    <h4>${title}</h4>
                    <p>Sample Movie</p>
                </div>
            `;

            this.movieContainer.appendChild(movieItem);
        });
    }

    /**
     * Get a placeholder color based on index
     */
    getPlaceholderColor(index) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
        return colors[index % colors.length];
    }

    /**
     * Add a new movie (placeholder implementation)
     */
    addMovie() {
        const input = document.getElementById('movieInput');
        if (!input || !input.value.trim()) return;

        const movieTitle = input.value.trim();
        
        // For demo, just add as placeholder
        this.addMovieWithPlaceholder(movieTitle);
        
        input.value = '';
    }

    /**
     * Add movie with placeholder image
     */
    addMovieWithPlaceholder(title) {
        if (!this.movieContainer) return;

        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item new-movie';
        
        const randomColor = this.getPlaceholderColor(Math.floor(Math.random() * 6));
        movieItem.innerHTML = `
            <div class="movie-poster placeholder-poster" style="background-color: ${randomColor};">
                <div class="movie-title-overlay">${title}</div>
            </div>
            <div class="movie-info">
                <h4>${title}</h4>
                <p>User Added</p>
            </div>
        `;

        this.movieContainer.appendChild(movieItem);

        // Add animation
        setTimeout(() => {
            movieItem.classList.add('visible');
        }, 100);
    }

    /**
     * Search for movie using TMDB API (would require real API key)
     */
    async searchMovie(title) {
        try {
            // Note: This would work with a real TMDB API key
            const response = await fetch(
                `${this.TMDB_BASE_URL}/search/movie?api_key=${this.API_KEY}&query=${encodeURIComponent(title)}`
            );
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            return data.results[0]; // Return first result
        } catch (error) {
            console.log('TMDB API not available (demo mode):', error.message);
            return null;
        }
    }

    /**
     * Create movie item with real TMDB data
     */
    createMovieItem(movieData) {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        
        const posterUrl = movieData.poster_path 
            ? `${this.TMDB_IMAGE_BASE_URL}${movieData.poster_path}`
            : null;

        if (posterUrl) {
            movieItem.innerHTML = `
                <div class="movie-poster">
                    <img src="${posterUrl}" alt="${movieData.title}" loading="lazy" />
                </div>
                <div class="movie-info">
                    <h4>${movieData.title}</h4>
                    <p>${movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'Unknown'}</p>
                </div>
            `;
        } else {
            // Fallback to placeholder if no poster available
            const randomColor = this.getPlaceholderColor(Math.floor(Math.random() * 6));
            movieItem.innerHTML = `
                <div class="movie-poster placeholder-poster" style="background-color: ${randomColor};">
                    <div class="movie-title-overlay">${movieData.title}</div>
                </div>
                <div class="movie-info">
                    <h4>${movieData.title}</h4>
                    <p>${movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'Unknown'}</p>
                </div>
            `;
        }

        return movieItem;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const movieThumbnails = new MovieThumbnails();
    movieThumbnails.init();
});