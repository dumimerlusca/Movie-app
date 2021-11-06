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
    ui.searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = ui.searchInput.value;
        const whatToSearchFor = ui.searchOption.value;
        ui.clearMainContainer();
        switch (whatToSearchFor.toLowerCase()) {
            case 'movies': {
                dataCtrl.currentMediaType = 'movie';
                dataCtrl.currentPage = 1;
                const movies = await getSearchedMovies(query, 1);
                if (movies.results.length === 0) {
                    ui.showMessage('No results...');
                    return;
                }
                uiMovies.showSearched(movies);
                const url = urlCtrl.getUrlForQueryMovieSearch(query, 1);
                ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
                break;
            }
            case 'tvshows': {
                dataCtrl.currentMediaType = 'tv';
                dataCtrl.currentPage = 1;
                const tvShows = await getSearchedTvShows(query, 1);
                if (tvShows.results.length === 0) {
                    ui.showMessage('No results...');
                    return;
                }
                uiTv.showSearched(tvShows);
                const url = urlCtrl.getUrlForQueryTvShowsSearch(query, 1);
                ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
                break;
            }
            case 'all': {
                dataCtrl.currentMediaType = 'all';
                dataCtrl.currentPage = 1;
                const items = await getSearchedMoviesAndTvShows(query, 1);
                if (items.results.length === 0) {
                    ui.showMessage('No results...');
                    return;
                }
                ui.showSearchedAll(items, uiTv.genres, uiMovies.genres);
                const url = urlCtrl.getUrlForQueryMultiSearch(query, 1);
                ui.createChangePageButtons(url, dataCtrl.page, dataCtrl.totalPages)
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
            ui.clearExistentModal();
            ui.disableScroll();
            setTimeout(() => {
                createMovieDetailsModal(id);
            }, 5)
            return;
        }
        if (mediaType === 'tv') {
            ui.clearExistentModal();
            setTimeout(() => {
                ui.disableScroll();
                createTvShowDetailsModal(id);
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
    document.body.addEventListener('click', async (e) => {
        if (e.target.hasAttribute('data-link-movie-genre-id')) {
            e.preventDefault();
            ui.toggleAsideSection();
            ui.clearMainContainer();
            dataCtrl.currentPage = 1;
            dataCtrl.currentMediaType = 'movie';
            const genreId = e.target.getAttribute('data-link-movie-genre-id');
            const movies = await getMoviesBasedOnGenre(genreId, 1);
            uiMovies.showSearched(movies);
            const url = urlCtrl.getUrlForDiscoveringMoviesByGenres(genreId, dataCtrl.currentPage)
            ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
        }
    })
        // Year links
    document.body.addEventListener('click', async (e) => {
        if (e.target.hasAttribute('data-link-movie-year')) {
            e.preventDefault();
            ui.toggleAsideSection();
            ui.clearMainContainer();
            dataCtrl.currentPage = 1;
            dataCtrl.currentMediaType = 'movie';
            const year = parseInt(e.target.getAttribute('data-link-movie-year'));
            const movies = await getMoviesBasedOnYear(year, 1);
            uiMovies.showSearched(movies);
            const url = urlCtrl.getUrlForDiscoveringMoviesByYear(year);
            ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
        }

    })

    // Aside links for Tv Shows
        // Genres links
    document.body.addEventListener('click', async (e) => {
    if (e.target.hasAttribute('data-link-tvShow-genre-id')) {
        e.preventDefault();
        const genreId = e.target.getAttribute('data-link-tvShow-genre-id');
        ui.clearMainContainer();
        ui.toggleAsideSection();
        dataCtrl.currentMediaType = 'tv';
        dataCtrl.currentPage = 1;
        const tvShows = await getTvShowsBasedOnGenre(genreId, 1);
        uiTv.showSearched(tvShows);
        const url = urlCtrl.getUrlForDiscoveringTvShowsByGenres(genreId, 1);
        ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
    }    
    })

        // Year link
    document.body.addEventListener('click', async (e) => {
        if (e.target.hasAttribute('data-link-tvShow-year')) {
            e.preventDefault();
            ui.toggleAsideSection();
            const year = parseInt(e.target.getAttribute('data-link-tvShow-year'));
            console.log(year)
            dataCtrl.currentMediaType = 'tv';
            dataCtrl.currentPage = 1;
            const tvShows = await getTvShowsBasedOnYear(year, 1);
            uiTv.showSearched(tvShows);
            const url = urlCtrl.getUrlForDiscoveringTvShowsByYear(year, 1);
            ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
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


function getData(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.total_pages) {
                    dataCtrl.totalPages = data.total_pages;
                } else {
                    dataCtrl.totalPages = 1;
                }
                resolve(data);
            })
            .catch(err => reject(err))
    })
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

async function changePage(url) {
    ui.clearMainContainer();
    const data = await getData(url);
    switch (dataCtrl.currentMediaType) {
        case 'movie': {
            uiMovies.showSearched(data);
            break;
        }
        case 'tv': {
            uiTv.showSearched(data);
            break;
        }
        case 'all': {
            ui.showSearchedAll(data, uiTv.genresArrTvShows, uiMovies.genresArrMovies,);
            break;
        }
    }
    ui.createChangePageButtons(url, dataCtrl.currentPage, dataCtrl.totalPages);
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

async function changeStateToHome() {
    ui.clearMainContainer();
    ui.removeAsideSection();
    const html = `
        <div class="trending_movies"></div>
        <div class="trending_tvShows"></div>
        <div class="action_movies"></div>
    `;
    ui.mainContainer.insertAdjacentHTML('afterbegin', html);

    const trendingMovies = await getTrendingMovies(1);
    uiMovies.showTrending(trendingMovies);

    const trendingTvShows = await getTrendingTvShows(1);
    uiTv.showTrending(trendingTvShows);

    const actionMovies = await getMoviesBasedOnGenre(28,1);
    uiMovies.showAction(actionMovies)
}

async function changeStateToMovies() {
    ui.removeAsideSection();
    ui.clearMainContainer();
    const html = `
        <div class="trending_movies"></div>
        <div class="action_movies"></div>
        <div class="crime_movies"></div>
    `;
    ui.mainContainer.insertAdjacentHTML('afterbegin', html);
    const trendingMovies = await getTrendingMovies(1);
    uiMovies.showTrending(trendingMovies);

    const actionMovies = await getMoviesBasedOnGenre(28,1);
    uiMovies.showAction(actionMovies)

    const crimeMovies = await getMoviesBasedOnGenre(80,1);
    uiMovies.showCrime(crimeMovies);

    uiMovies.createAsideMenu();
}

async function changeStateToTvShows() {
    ui.removeAsideSection();
    ui.clearMainContainer();
    const html = `
        <div class="trending_tvShows"></div>
        <div class="drama_tvShows"></div>
        <div class="crime_tvShows"></div>
    `;
    ui.mainContainer.insertAdjacentHTML('afterbegin', html);

    const trendingTvShows = await getTrendingTvShows(1);
    uiTv.showTrending(trendingTvShows);

    const dramaTvShows = await getTvShowsBasedOnGenre(18, 1);
    uiTv.showDrama(dramaTvShows);
    
    const crimeTvShows = await getTvShowsBasedOnGenre(80, 1);
    uiTv.showCrime(crimeTvShows);

    uiTv.createAsideMenu();
}





   // GET STUFF FUNCTIONS

    // For movies
async function getMoviesBasedOnGenre(genreId, pageNr) {
    const url = urlCtrl.getUrlForDiscoveringMoviesByGenres(genreId, pageNr);
    const data = await getData(url);
    return data;
}

async function getMoviesBasedOnYear(year, pageNr) {
    const url = urlCtrl.getUrlForDiscoveringMoviesByYear(year, pageNr);
    const data = await getData(url);
    return data;
}

async function getTrendingMovies(pageNr) {
    const url = urlCtrl.getUrlForTrendingItems('week', 'movie', pageNr);
    const data = await getData(url);
    return data;
}


async function getSearchedMovies(query, pageNumber) {
    const url = urlCtrl.getUrlForQueryMovieSearch(query, pageNumber,)
    const data = await getData(url);
    return data;
}

async function getMovieCast(id) {
    const url = urlCtrl.getUrlForMovieCast(id);
    const data = await getData(url);
    return data;
}

async function getSimilarMovies(id) {
    const url = urlCtrl.getUrlForSimilarMovies(id, 1);
    const data = await getData(url);
    return data;
}

async function getMovieDetails(id) {
    const url = urlCtrl.getUrlForMovieDetails(id);
    const data = await getData(url);
    return data;
}

async function createMovieDetailsModal(id) {
    const movieDetails = await getMovieDetails(id);
    uiMovies.showDetails(movieDetails);

    const similarMovies = await getSimilarMovies(id);
    uiMovies.showSimilar(similarMovies);

    const movieCast = await getMovieCast(id);
    uiMovies.showCast(movieCast)
}


    // TV SHOWS
async function getTrendingTvShows() {
    const url = urlCtrl.getUrlForTrendingItems('week', 'tv', 1);
    const data = await getData(url);
    return data;
}

async function getTvShowsBasedOnGenre(genreId, pageNr) {
    const url = urlCtrl.getUrlForDiscoveringTvShowsByGenres(genreId, pageNr);
    const data = await getData(url);
    return data;
}

async function getTvShowsBasedOnYear(year, pageNr) {
    const url = urlCtrl.getUrlForDiscoveringTvShowsByYear(year, pageNr);
    const data = await getData(url);
    return data;
}


async function getSearchedTvShows(query, pageNumber) {
    const url = urlCtrl.getUrlForQueryTvShowsSearch(query, pageNumber);
    const data = await getData(url);
    return data;
}

async function getTvShowCast(id) {
    const url = urlCtrl.getUrlForTvShowCast(id);
    const data = await getData(url);
    return data;
}

async function getTvShowDetails(id) {
    const url = urlCtrl.getUrlForTvShowDetails(id);
    const data = await getData(url);
    return data;
}

async function getSimilarTvShows(id) {
    const url = urlCtrl.getUrlForSimilarTvShows(id, 1);
    const data = await getData(url);
    return data;
}

async function createTvShowDetailsModal(id) {
    const tvShowDetails = await getTvShowDetails(id);
    uiTv.showDetails(tvShowDetails);
    const similarTvShows = await getSimilarTvShows(id);
    uiTv.showSimilar(similarTvShows, dataCtrl.genresArrTvShows);
    const tvShowCast = await getTvShowCast(id);
    uiTv.showCast(tvShowCast);
}

    // BOTH
async function getSearchedMoviesAndTvShows(query, pageNumber) {
    const url = urlCtrl.getUrlForQueryMultiSearch(query, pageNumber);
    const data = await getData(url);
    return data;
}