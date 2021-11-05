import { ui } from './ui.js';
import { dataCtrl } from './data.js';
import { uiMovies } from './uiMovies.js';
import { uiTv } from './uiTv.js';
import { urlCtrl } from './url.js';



document.addEventListener('DOMContentLoaded', init);

function init() {
    changeState('home');
    initEventListeners();
}


function initEventListeners() {

        // Mobile menu toggler
    ui.menuToggler.addEventListener('click', () => {
        ui.mainMenu.classList.toggle('show');
    })

        // Aside section toggler
    document.body.addEventListener('click', (e) => {
        if (e.target.parentElement.id === 'aside_section_toggler') {
            e.preventDefault();
            console.log(true)
            ui.toggleAsideSection();
        }
    })
        // Search form 
    ui.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = ui.searchInput.value;
        const whatToSearchFor = ui.searchOption.value;
        switch (whatToSearchFor.toLowerCase()) {
            case 'movies': {
                ui.clearMainContainer();
                dataCtrl.currentMediaType = 'movie';
                dataCtrl.currentPage = 1;
                getSearchedMovies(query, 1);
                break;
            }
            case 'tvshows': {
                dataCtrl.currentMediaType = 'tv';
                dataCtrl.currentPage = 1;
                getSearchedTvShows(query, 1);
                break;
            }
            case 'all': {
                dataCtrl.currentMediaType = 'all';
                dataCtrl.currentPage = 1;
                getSearchedMoviesAndTvShows(query, 1);
                break;
            }
        }

    })

        // Click event on each item for showing a modal with more details
    document.body.addEventListener('click', (e) => {
        const item = e.target.parentElement;
        const mediaType = item.getAttribute('data-media-type');
        const id = item.getAttribute('data-id');
        if (mediaType === 'movie') {
            ui.clearExistentMovieModal();
            setTimeout(() => {
                ui.disableScroll();
                getMovieDetails(id)
                getMovieCast(id);
                getSimilarMovies(id);
            }, 5)
            return;
        }
        if (mediaType === 'tv') {
            ui.clearExistentMovieModal();
            setTimeout(() => {
                ui.disableScroll();
                getTvShowDetails(id);
                getTvShowCast(id);
                getSimilarTvShows(id);
            }, 5)
        }
    })

        // Close detail modal btn
    document.body.addEventListener('click', (e) => {
        if (e.target.parentElement.id === 'close_details_modal_btn') {
            e.preventDefault();
            ui.activateScroll();
            document.querySelector('.details_about_item_modal').remove();
        }
    })

        // Show extra details
    document.body.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.parentElement.id === 'extra_details_toggler') {
            e.target.parentElement.parentElement.classList.toggle('active')
            e.target.parentElement.classList.toggle('rotate')
        }
    })

        // Seasons navigation
    document.body.addEventListener('click', (e) => {
        e.preventDefault()
        if (e.target.classList.contains('season_link')) {
            const id = parseInt(e.target.getAttribute('data-link-season'));
            uiTv.updateSeasonLinksClasses(id);
            uiTv.showSeasonContent(id);
        }
    })

        // Home btn
    ui.homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ui.hideMobileMenu();
        ui.updateMainLinksClasses(ui.homeBtn);
        changeState('home');
    })

        // Movies btn
    ui.moviesBtn.addEventListener('click', (e) => { 
        e.preventDefault();
        ui.hideMobileMenu();
        ui.updateMainLinksClasses(ui.moviesBtn);
        changeState('movies');
    })

        // Tv Shows btn
    ui.tvShowsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ui.hideMobileMenu();
        ui.updateMainLinksClasses(ui.tvShowsBtn);
        changeState('tvShows');
    })

    // Aside links for movies
    
        // Genres links
    document.body.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-link-movie-genre-id')) {
            e.preventDefault();
            const genreId = e.target.getAttribute('data-link-movie-genre-id');
            dataCtrl.currentMediaType = 'movie';
            dataCtrl.currentPage = 1;
            ui.clearMainContainer();
            ui.toggleAsideSection();
            getMoviesBasedOnGenre(genreId);
        }
    })
        // Year links
    document.body.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-link-movie-year')) {
            e.preventDefault();
            ui.toggleAsideSection();
            ui.clearMainContainer();
            dataCtrl.currentPage = 1;
            dataCtrl.currentMediaType = 'movie';
            const year = parseInt(e.target.getAttribute('data-link-movie-year'));
            getMoviesBasedOnYear(year);
        }

    })

    // Aside links for Tv Shows
        // Genres links
    document.body.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-link-tvShow-genre-id')) {
        e.preventDefault();
        const genreId = e.target.getAttribute('data-link-tvShow-genre-id');
        ui.clearMainContainer();
        ui.toggleAsideSection();
        dataCtrl.currentMediaType = 'tv';
        dataCtrl.currentPage = 1;
        getTvShowsBasedOnGenre(genreId);
    }    
    })

        // Year link
    document.body.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-link-tvShow-year')) {
            e.preventDefault();
            ui.toggleAsideSection();
            const year = parseInt(e.target.getAttribute('data-link-tvShow-year'));
            console.log(year)
            dataCtrl.currentMediaType = 'tv';
            dataCtrl.currentPage = 1;
            getTvShowBasedOnYear(year);
        }

    })

    // Change page buttons
        // Next page btn
    document.body.addEventListener('click', (e) => {
        if (e.target.parentElement.id === 'next_page_btn' && !(e.target.parentElement.hasAttribute('disabled'))) {
            e.preventDefault();
            const url = e.target.parentElement.getAttribute('data-url');
            const newUrl = newUrlForNextPage(url);
            changePage(newUrl);
        }
    })
        // Previous page btn
    document.body.addEventListener('click', (e) => {
        if (e.target.parentElement.id === 'previous_page_btn' && !(e.target.parentElement.hasAttribute('disabled'))) {
            e.preventDefault();
            const url = e.target.parentElement.getAttribute('data-url');
            const newUrl = newUrlForPreviousPage(url);
            changePage(newUrl);
        }
    })
    
}


function getData(url, callback) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.total_pages) {
                dataCtrl.totalPages = data.total_pages;
            } else {
                dataCtrl.totalPages = 1;
            }
            callback(data)
        })
        .catch(err => console.log(err))
}

function newUrlForNextPage(url) {
    const regexp = /page=\d+/i;
    const currentPage = +regexp.exec(url)[0].split('=')[1];
    console.log('Current page', currentPage);
    dataCtrl.currentPage = currentPage + 1;
    const newUrl = url.replace(regexp, `page=${currentPage + 1}`);
    return newUrl;
}

function newUrlForPreviousPage(url) {
    const regexp = /page=\d+/i;
    const currentPage = +regexp.exec(url)[0].split('=')[1];
    console.log('Current page', currentPage);
    dataCtrl.currentPage = currentPage - 1;
    const newUrl = url.replace(regexp, `page=${currentPage - 1}`);
    return newUrl;
}

function changePage(url) {
    getData(url, (data) => {
        ui.clearMainContainer();
        switch (dataCtrl.currentMediaType) {
            case 'movie': {
                uiMovies.showSearchedMovies(data, dataCtrl.genresArrMovies);
                break;
            }
            case 'tv': {
                uiTv.showSearchedTvShows(data, dataCtrl.genresArrMovies);
                break;
            }
            case 'all': {
                ui.showSearchedAll(data, dataCtrl.genresArrTvShows,dataCtrl.genresArrMovies,);
                break;
            }
        }
        console.log('This is the callback', dataCtrl.totalPages)
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
       
    })
}


    // Change state functions
function changeState(state) {
    switch (state) {
        case 'home': {
            changeStateToHome();
            break;
        }
        case 'movies': {
            changeStateToMovies()
            break;
        }
        case 'tvShows': {
            changeStateToTvShows();
            break;
        }
    }
    

    
}

function changeStateToHome() {
    ui.clearMainContainer();
    ui.removeAsideSection();
    const html = `
        <div class="trending_movies"></div>
        <div class="trending_tvShows"></div>
        <div class="action_movies"></div>
    `;
    ui.mainContainer.insertAdjacentHTML('afterbegin', html);
    getTrendingMovies();
    getTrendingTvShows();
    getActionMovies();
}

function changeStateToMovies() {
    ui.removeAsideSection();
    ui.clearMainContainer();
    const html = `
        <div class="trending_movies"></div>
        <div class="action_movies"></div>
        <div class="crime_movies"></div>
    `;
    ui.mainContainer.insertAdjacentHTML('afterbegin', html);
    getTrendingMovies();
    getActionMovies();
    getCrimeMovies();
    uiMovies.createAsideMenuForMovies();
}

function changeStateToTvShows() {
    ui.removeAsideSection();
    ui.clearMainContainer();
    const html = `
        <div class="trending_tvShows"></div>
        <div class="drama_tvShows"></div>
        <div class="crime_tvShows"></div>
    `;
    ui.mainContainer.insertAdjacentHTML('afterbegin', html);
    getTrendingTvShows();
    getDramaTvShows();
    getCrimeTvShows();
    uiTv.createAsideMenuForTvShows();
}





   // GET STUFF FUNCTIONS

    // For movies
function getMoviesBasedOnGenre(genreId) {
    const url = urlCtrl.getUrlForDiscoveringMoviesByGenres(genreId, 1);
    getData(url, (data) => {
        uiMovies.showSearchedMovies(data, dataCtrl.genresArrMovies);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    })
}

function getMoviesBasedOnYear(year) {
    const url = urlCtrl.getUrlForDiscoveringMoviesByYear(year, 1);
    getData(url, (data) => {
        uiMovies.showSearchedMovies(data, dataCtrl.genresArrMovies);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    })
}

function getTrendingMovies() {
    const url = urlCtrl.getUrlForTrendingItems('week', 'movie', 1);
    getData(url, (data) => {
        uiMovies.showTrendingMovies(data, dataCtrl.genresArrMovies);
    })
}

function getActionMovies() {
    const url = urlCtrl.getUrlForDiscoveringMoviesByGenres(28)
    getData(url, (data) => {
        uiMovies.showActionMovies(data, dataCtrl.genresArrMovies)
    });
}

function getCrimeMovies() {
    const url = urlCtrl.getUrlForDiscoveringMoviesByGenres(80)
    getData(url, (data) => {
        uiMovies.showCrimeMovies(data, dataCtrl.genresArrMovies);
    });
}

function getSearchedMovies(query, pageNumber) {
    const url = urlCtrl.getUrlForQueryMovieSearch(query, pageNumber,)
    getData(url, (data) => {
        uiMovies.showSearchedMovies(data, dataCtrl.genresArrMovies);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    })
}

function getMovieCast(id) {
    const url = urlCtrl.getUrlForMovieCast(id);
    getData(url, (data) => {
        uiMovies.showMovieCast(data);
    });
}

function getSimilarMovies(id) {
    const url = urlCtrl.getUrlForSimilarMovies(id, 1);
    getData(url, (data) => {
        uiMovies.showSimilarMovies(data, dataCtrl.genresArrMovies)
    });
}

function getMovieDetails(id) {
    const url = urlCtrl.getUrlForMovieDetails(id);
    getData(url, (data) => {
        uiMovies.showMovieDetails(data)
    })
}

    // TV SHOWS
function getTrendingTvShows() {
    const url = urlCtrl.getUrlForTrendingItems('week', 'tv', 1);
    getData(url, (data) => {
        uiTv.showTrendingTvShows(data, dataCtrl.genresArrTvShows);
    })
}

function getTvShowsBasedOnGenre(genreId, pageNr) {
    const url = urlCtrl.getUrlForDiscoveringTvShowsByGenres(genreId, pageNr);
    getData(url, (data) => {
        uiTv.showSearchedTvShows(data, dataCtrl.genresArrTvShows);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    })
}

function getTvShowBasedOnYear(year) {
    const url = urlCtrl.getUrlForDiscoveringTvShowsByYear(year, 1);
    getData(url, (data) => {
        uiTv.showSearchedTvShows(data, dataCtrl.genresArrTvShows);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    })
}

function getDramaTvShows() {
    const url = urlCtrl.getUrlForDiscoveringTvShowsByGenres('18', 1);
    getData(url, (data) => {
        uiTv.showDramaTvShows(data, dataCtrl.genresArrTvShows);
    })
}

function getCrimeTvShows() {
    const url = urlCtrl.getUrlForDiscoveringTvShowsByGenres('80', 1);
    getData(url, (data) => {
        uiTv.showCrimeTvShows(data, dataCtrl.genresArrTvShows);
    })
}

function getSearchedTvShows(query, pageNumber) {
    const url = urlCtrl.getUrlForQueryTvShowsSearch(query, pageNumber,)
    getData(url, (data) => {
        uiTv.showSearchedTvShows(data, dataCtrl.genresArrTvShows);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    })
}

function getTvShowCast(id) {
    const url = urlCtrl.getUrlForTvShowCast(id);
    getData(url, (data) => {
        uiTv.showTvShowCast(data);
    });
}

function getTvShowDetails(id) {
    const url = urlCtrl.getUrlForTvShowDetails(id);
    getData(url, (data) => {
        uiTv.showTvShowDetails(data);
    });
}

function getSimilarTvShows(id) {
    const url = urlCtrl.getUrlForSimilarTvShows(id, 1);
    getData(url, (data) => {
        uiTv.showSimilarTvShows(data, dataCtrl.genresArrTvShows)
    });
}
    // BOTH
function getSearchedMoviesAndTvShows(query, pageNumber) {
    const url = urlCtrl.getUrlForQueryMultiSearch(query, pageNumber);
    getData(url, (data) => {
        ui.showSearchedAll(data, dataCtrl.genresArrTvShows, dataCtrl.genresArrMovies);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    })
}