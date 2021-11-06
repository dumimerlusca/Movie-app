import { UICtrl } from './ui.js';

class UIMovies extends UICtrl {
    constructor() {
        super();
        this.genres = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }];
    }

    showDetails(movie) {
        let videoId = '';
        if(movie.videos.results[0]) {
            videoId = movie.videos.results[0].key;
        }
        if (!movie.spoken_languages[0]) movie.spoken_languages[0] = {name: " "};
        const detailsModal = document.createElement('div');
        detailsModal.className = 'details_about_item_modal';
        detailsModal.innerHTML = `
        <div class="details_container">
            
            <div class="similar_movies">
                <h3>Similar movies</h3>
                <div class="similar_movies_cards_container">
                    
                </div>
            </div>

            <div class="main_details">
                <a id='close_details_modal_btn'><i class="fas fa-times"></i></a>
                <div class="title_flex">

                    <h3 class="item_title">${movie.title}</h3>
                    <div class="rating_div">
                        <i class="fas fa-star"></i>
                        <span>${movie.vote_average}</span>
                        <p>${movie.vote_count} Votes</p>
                    </div>
                </div>
                <p class="thin h4">${movie.tagline}</p>
                <p class="overview">${movie.overview}</p>   
                <div class="trailer">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" alt="No video" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>

            <div class="extra_details">
                <h3>Extra details</h3>
                <div class="img_container">
                    <img src="${this.IMG_ENDPOINT}${movie.backdrop_path}" alt="">
                </div>
                <div class="flex">
                    <ul>
                        <li>Status: ${movie.status}</li>
                        <li>Release_date: ${movie.release_date}</li>
                        <li>Budget: ${movie.budget}</li>
                    </ul>
                    <ul>
                        <li>Revenue: ${movie.revenue}</li>
                        <li>Runtime: ${movie.runtime}</li>
                        <li>Language: ${movie.spoken_languages[0].name}</li>
                    </ul>
                </div>
                <div class="cast">
                    <h3>Actors</h3>
                    <div class="actors">
                        
                    </div>
                </div>
            </div>

        </div>
        `;
        document.body.appendChild(detailsModal);
    }

    showCast(data) {
        const actorsContainer = document.querySelector('.actors');
        const actors = data.cast.slice(0, 5);
        actors.forEach(actor => {
            const actorEl = super.createActorElement(actor);
            actorsContainer.appendChild(actorEl)
        })
    }

    showSimilar(data) {
        const container = document.querySelector('.similar_movies_cards_container');
        const movies = data.results;
        movies.forEach(movie => {
            const movieEl = super.createMovieElement(movie, this.genres);
            container.appendChild(movieEl);
        })
    }

    showSearched(data) {
        const container = document.createElement('div');
        container.className = 'searched_items_container';
        this.mainContainer.insertAdjacentElement('afterbegin', container);
        const movies = data.results;
        movies.forEach(movie => {
            if (!movie.poster_path) return;
            const item = super.createMovieElement(movie, this.genres);
            container.appendChild(item);
        })
    }

    showTrending(data) {
        const trendingMoviesContainer = this.mainContainer.querySelector('.trending_movies');
        trendingMoviesContainer.innerHTML = `
        <div class="container">
            <h1 class="section_title">Trending Movies</h1>
            <div class="items_container">
                <div class="flex" id="trending_movies_container">

                </div>
            </div>
        </div>
        `;
        const movies = data.results;
        movies.forEach(movie => {
            const item = super.createMovieElement(movie, this.genres);
            trendingMoviesContainer.querySelector("#trending_movies_container").appendChild(item);
        })
    }

    showAction(data) {
        const actionMoviesContainer = this.mainContainer.querySelector('.action_movies');
        actionMoviesContainer.innerHTML = `
        <div class="container">
            <h1 class="section_title">Action movies</h1>
            <div class="items_container">
                <div class="flex" id="action_movies">

                </div>
            </div>
        </div>
        `;
        const movies = data.results;
        movies.forEach(movie => {
            const item = super.createMovieElement(movie, this.genres);
            actionMoviesContainer.querySelector("#action_movies").appendChild(item);
        })
    }

    showCrime(data) {
        const crimeMoviesContainer = this.mainContainer.querySelector('.crime_movies');
        crimeMoviesContainer.innerHTML = `
        <div class="container">
            <h1 class="section_title">Crime movies</h1>
            <div class="items_container">
                <div class="flex" id="crime_movies">

                </div>
            </div>
        </div>
        `;
        const movies = data.results;
        movies.forEach(movie => {
            const item = super.createMovieElement(movie, this.genres);
            crimeMoviesContainer.querySelector("#crime_movies").appendChild(item);
        })
    }

    showMovie(movie) {
        this.moviesContainer.appendChild(movie);
    }

    clearExistentMovies() {
        this.moviesContainer.innerHTML = '';
    }

    createAsideMenu() {
        if (document.querySelector('.aside_section')) return;
        const asideSection = document.createElement('aside');
        asideSection.className = 'aside_section';
        asideSection.innerHTML = `
            <button id="aside_section_toggler"><i class="fas fa-chevron-left fa-3x"></i></button>
            <h3>Search movies by:</h3>
            <nav id="aside_menu">
                <h4>Genres</h4>
                <ul class="genres_list">
                    <li><a href="#" data-link-movie-genre-id="28">Action</a></li>
                    <li><a href="#" data-link-movie-genre-id="80">Crime</a></li>
                    <li><a href="#" data-link-movie-genre-id="12">Adventure</a></li>
                    <li><a href="#" data-link-movie-genre-id="16">Animation</a></li>
                    <li><a href="#" data-link-movie-genre-id="35">Comedy</a></li>
                    <li><a href="#" data-link-movie-genre-id="18">Drama</a></li>
                    <li><a href="#" data-link-movie-genre-id="27">Horror</a></li>
                </ul>
                <h4 class="mt-2">Year</h4>
                <ul class="years_list">
                    <li><a href="#" data-link-movie-year="2000">2000</a></li>
                    <li><a href="#" data-link-movie-year="2001">2001</a></li>
                    <li><a href="#" data-link-movie-year="2002">2002</a></li>
                    <li><a href="#" data-link-movie-year="2003">2003</a></li>
                    <li><a href="#" data-link-movie-year="2004">2004</a></li>
                    <li><a href="#" data-link-movie-year="2005">2005</a></li>
                    <li><a href="#" data-link-movie-year="2006">2006</a></li>
                    <li><a href="#" data-link-movie-year="2007">2007</a></li>
                    <li><a href="#" data-link-movie-year="2008">2008</a></li>
                    <li><a href="#" data-link-movie-year="2009">2009</a></li>
                    <li><a href="#" data-link-movie-year="2010">2010</a></li>
                    <li><a href="#" data-link-movie-year="2011">2011</a></li>
                    <li><a href="#" data-link-movie-year="2012">2012</a></li>
                    <li><a href="#" data-link-movie-year="2013">2013</a></li>
                    <li><a href="#" data-link-movie-year="2014">2014</a></li>
                    <li><a href="#" data-link-movie-year="2015">2015</a></li>
                    <li><a href="#" data-link-movie-year="2016">2016</a></li>
                    <li><a href="#" data-link-movie-year="2017">2017</a></li>
                    <li><a href="#" data-link-movie-year="2018">2018</a></li>
                    <li><a href="#" data-link-movie-year="2019">2019</a></li>
                    <li><a href="#" data-link-movie-year="2020">2020</a></li>
                    <li><a href="#" data-link-movie-year="2021">2021</a></li>
                </ul>
            </nav>
        `;
        this.mainContainer.parentElement.appendChild(asideSection);
    }

}

export const uiMovies = new UIMovies();