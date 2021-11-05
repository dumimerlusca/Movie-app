
export class UICtrl {
    constructor() {
        this.mainContainer = document.querySelector('.main_container')
        this.searchBarToggler = document.getElementById('search_bar_toggler');
        this.searchBarContainer = document.querySelector('.search_bar_container');
        this.searchForm = document.querySelector('#search_form');
        this.searchInput = document.querySelector('#search_input')
        this.searchOption = document.querySelector('#search_option');
        this.searchedElementsContainer = document.querySelector('.movies_container');
        this.IMG_ENDPOINT = 'https://image.tmdb.org/t/p/w500/';
        this.mainMenuLinks = document.querySelectorAll('.main_nav a')

        this.mainMenu = document.querySelector('.main_nav');
        this.menuToggler = document.querySelector('#menu_toggler');
        this.homeBtn = document.querySelector('#home_btn')
        this.moviesBtn = document.querySelector('#movies_btn')
        this.tvShowsBtn = document.querySelector('#tvShows_btn')
    }

    createActorElement(actor) {
        const actorEl = document.createElement('div');
        actorEl.className = 'actor_card';
        actorEl.innerHTML = `
            <div class="img_container">
                <img src="${this.IMG_ENDPOINT}${actor.profile_path}" alt="">
            </div>
            <p class="actor_name">${actor.name}</p>
            <small>${actor.character}</small>
        `;
        return actorEl;
    }

    showSearchedAll(data, genresArrTvShows, genresArrMovies) {
        this.clearMainContainer();
        const container = document.createElement('div');
        container.className = 'searched_items_container';
        this.mainContainer.appendChild(container);
        const items = data.results;
        items.forEach(item => {
            if (!item.poster_path) return;
            if (item.media_type === 'movie') {
                const itemEl = this.createMovieElement(item, genresArrMovies);
                container.appendChild(itemEl);
                return;
            }
            if (item.media_type === 'tv') {
                const itemEl = this.createTvShowElement(item, genresArrTvShows);
                container.appendChild(itemEl);
            }
        })

    }

    createMovieElement(movie, genresArr) {
        const movieEl = document.createElement('div');
        movieEl.className = 'movie_card';
        movieEl.setAttribute('data-id', movie.id)
        movieEl.setAttribute('data-media-type', 'movie')
        const genresStr = this.createGenresList(genresArr, movie.genre_ids);
        const movieInner = `
            <div class="img_container">
                <img src="${this.IMG_ENDPOINT}${movie.poster_path}" alt="">
            </div>
            <div class="movie_details">
                <span class="movie_title">${movie.title}</span>
                <span class="rating">${parseFloat(movie.vote_average).toFixed(1)}</span>
            </div>
            <p class="genres">${genresStr}</p>
            <div class="overlay_for_click"></div>
        `;
        movieEl.innerHTML = movieInner;

        return movieEl;
    }

    createTvShowElement(tvShow, genresArr) {
        const tvShowEl = document.createElement('div');
        tvShowEl.className = 'movie_card';
        tvShowEl.setAttribute('data-id', tvShow.id)
        tvShowEl.setAttribute('data-media-type', 'tv')
        const genresStr = this.createGenresList(genresArr, tvShow.genre_ids);
        const tvShowInner = `
            <div class="img_container">
                <img src="${this.IMG_ENDPOINT}${tvShow.poster_path}" alt="">
            </div>
            <div class="movie_details">
                <span class="movie_title">${tvShow.name}</span>
                <span class="rating">${tvShow.vote_average}</span>
            </div>
            <p class="genres">${genresStr}</p>
            <div class="overlay_for_click"></div>
        `;
        tvShowEl.innerHTML = tvShowInner;

        return tvShowEl;
    }

    clearMainContainer() {
        this.clearSearchField();
        this.mainContainer.innerHTML = '';
    }

    clearSearchField() {
        this.searchInput.value = '';
    }

    createGenresList(genresArr, ids) {
        const arr = [];
        for (let id in ids) {
            genresArr.forEach(genre => {
                if (genre.id === ids[id]) {
                    arr.push(genre.name);
                }
            })
        }
        return arr.join(', ');
    }

    activateLink(index) {
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
        })
        this.menuLinks[index].classList.add('active');
    }
    disableScroll() {
        document.querySelector('html').style.overflow = 'hidden';
    }

    activateScroll() {
        document.querySelector('html').style.overflow = 'auto';
    }

    clearExistentMovieModal() {
        const modal = document.querySelector('.details_about_item_modal');
        if (modal) {
            modal.remove();
        }
    }

    updateMainLinksClasses(activeBtn) {
        this.mainMenuLinks.forEach(link => {
            link.classList.remove('active');
        })

        activeBtn.classList.add('active');
    }

    hideMobileMenu() {
        if (this.mainMenu.classList.contains('show')) {
            this.mainMenu.classList.remove('show');
        }
    }

    removeAsideSection() {
        if (!document.querySelector('.aside_section')) return;
        document.querySelector('.aside_section').remove();
    }

    toggleAsideSection() {
        if (document.querySelector('.aside_section')) {
            document.querySelector('.aside_section').classList.toggle('show');
        }
    }

    createChangePageButtons(url, currentPage, totalPages) {
        console.log('Create change page buttons')
        const changePageButtons = document.createElement('div');
        changePageButtons.className = 'change_page_flex';
        changePageButtons.innerHTML = `
        <div>
            <p>Previous page</p>
            <button id="previous_page_btn" data-url="${url}"><i class="fas fa-long-arrow-alt-left"></i></button>
        </div>
        <div class="pages_count">
            <span class="current_page">${currentPage}</span>
            <span>......</span>
            <span class="total_pages">${totalPages}</span>

        </div>
        <div>
            <p>Next page</p>
            <button id="next_page_btn" data-url="${url}"><i class="fas fa-long-arrow-alt-right"></i></button>
        </div>
        `;
        console.log('Current Page:',currentPage);
        console.log('Total pages:',totalPages);
        if (currentPage === 1) {
            changePageButtons.querySelector('#previous_page_btn').setAttribute('disabled', true);
            changePageButtons.querySelector('#previous_page_btn').classList.add('disabled');
        } else {
            changePageButtons.querySelector('#previous_page_btn').removeAttribute('disabled');
            changePageButtons.querySelector('#previous_page_btn').classList.remove('disabled');
        }

        if (currentPage === totalPages) {
            changePageButtons.querySelector('#next_page_btn').setAttribute('disabled', true);
            changePageButtons.querySelector('#next_page_btn').classList.add('disabled');
        } else {
            changePageButtons.querySelector('#next_page_btn').removeAttribute('disabled');
            changePageButtons.querySelector('#next_page_btn').classList.remove('disabled');
        }

        setTimeout(() => {
            this.mainContainer.insertAdjacentElement('beforeend',changePageButtons);
        }, 50)
    }
}


export const ui = new UICtrl();