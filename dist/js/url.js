class URL {
    constructor() {
        this.API_KEY = '9dde54d64fb07c0b85dd8050c65b95c7';
    }
        // FOR MOVIES
    getUrlForQueryMovieSearch(query, pageNumber = 1) {
        return `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&language=en-US&include_adult=false&query=${query}&page=${pageNumber}`
    }
    
    getUrlForDiscoveringMoviesByYear(year, pageNumber = 1) {
        return `https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&language=en-US&include_adult=false&primary_release_year=${year}&page=${pageNumber}&sort_by=popularity.desc`
    }
    
    getUrlForSimilarMovies(id, pageNumber = 1) {
        return `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${this.API_KEY}&language=en-US&include_adult=false&page=${pageNumber}`
    }
    
    getUrlForMovieDetails(id) {
        return `https://api.themoviedb.org/3/movie/${id}?api_key=${this.API_KEY}&language=en-US&page=1&include_adult=false&append_to_response=videos`
    }
    
    getUrlForMovieCast(id) {
        return `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.API_KEY}&language=en-US`
    }
    
    getUrlForDiscoveringMoviesByGenres(genreId, pageNumber = 1) {
        return `https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&language=en-US&page=${pageNumber}&with_genres=${genreId}&sort_by=popularity.desc`
    }
    
    getUrlForRecomendedMovies(pageNumber = 1) {
        return `https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&language=en-US&page=${pageNumber}&with_genres=${genreId}&sort_by=popularity.desc`
    }



        // For TV SHOWS

    getUrlForSimilarTvShows(id, pageNumber = 1) {
        return `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${this.API_KEY}&language=en-US&include_adult=false&page=${pageNumber}`
    }
    
    getUrlForDiscoveringTvShowsByGenres(genreId, pageNumber = 1) {
        return `https://api.themoviedb.org/3/discover/tv?api_key=${this.API_KEY}&language=en-US&page=${pageNumber}&with_genres=${genreId}&sort_by=popularity.desc`
    }

    getUrlForDiscoveringTvShowsByYear(year, pageNumber = 1) {
        return `https://api.themoviedb.org/3/discover/tv?api_key=${this.API_KEY}&language=en-US&include_adult=false&first_air_date_year=${year}&page=${pageNumber}&sort_by=popularity.desc`
    }

    getUrlForTvShowDetails(id) {
        return `https://api.themoviedb.org/3/tv/${id}?api_key=${this.API_KEY}&language=en-US&append_to_response=videos`
    }
    
    
    getUrlForTvShowCast(id) {
        return `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${this.API_KEY}&language=en-US`
    }
    
    getUrlForQueryMultiSearch(query, pageNumber = 1) {
        return `https://api.themoviedb.org/3/search/multi?api_key=${this.API_KEY}&language=en-US&include_adult=false&query=${query}&page=${pageNumber}`
    }
    
    getUrlForQueryTvShowsSearch(query, pageNumber = 1) {
        return `https://api.themoviedb.org/3/search/tv?api_key=${this.API_KEY}&language=en-US&include_adult=false&query=${query}&page=${pageNumber}`
    }
    
    getUrlForTrendingItems(timeWindow = 'day', mediaType ,pageNumber = 1) {
        return `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${this.API_KEY}&page=${pageNumber}`
    }
}

export const  urlCtrl = new URL();