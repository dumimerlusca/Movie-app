import { UICtrl } from './ui.js';

class UITv extends UICtrl {
    constructor() {
        super();
    }
    
    showTvShowDetails(tvShow) {
        let videoId = '';
        if(tvShow.videos.results[0]) {
            videoId = tvShow.videos.results[0].key;
        }
        const detailsModal = document.createElement('div');
        detailsModal.className = 'details_about_item_modal';
        detailsModal.innerHTML = `
        <div class="details_container">
            
            <div class="similar_movies">
                <h3>Similar Tv Shows</h3>
                <div class="similar_movies_cards_container">
                    
                </div>
            </div>

            <div class="main_details">
                <a id='close_details_modal_btn'><i class="fas fa-times"></i></a>
                <div class="title_flex">

                    <h3 class="item_title">${tvShow.name}</h3>
                    <div class="rating_div">
                        <i class="fas fa-star"></i>
                        <span>${tvShow.vote_average}</span>
                        <p>${tvShow.vote_count} Votes</p>
                    </div>
                </div>
                <p class="thin h4">${tvShow.tagline}</p>
                <p class="overview">${tvShow.overview}</p>   
                <div class="trailer">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" alt="No video" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
                </div>

            </div>

            <div class="extra_details">
                <h3>Extra details</h3>
                <div class="img_container">
                    <img src="${this.IMG_ENDPOINT}${tvShow.backdrop_path}" alt="">
                </div>
                <div class="flex">
                    <ul>
                        <li>Status: ${tvShow.status}</li>
                        <li>Nr. of episodes: ${tvShow.number_of_episodes}</li>
                        <li>Nr. of seasons: ${tvShow.number_of_seasons}</li>
                    </ul>
                    <ul>
                        <li>First air data:: ${tvShow.first_air_date}</li>
                        <li>Spisode runtime: ${tvShow.episode_run_time}</li>
                        <li>Language: ${tvShow.spoken_languages[0].name}</li>
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
            // Append the seasons section
        const seasonsSection = this.createSeasonsSection(tvShow.seasons);
        detailsModal.querySelector('.main_details').appendChild(seasonsSection);

        document.body.appendChild(detailsModal);
    }

    showSimilarTvShows(data, genresArr) {
        const container = document.querySelector('.similar_movies_cards_container');
        if (!container) {
            setTimeout(() => {
                this.showSimilarTvShows(data, genresArr);
            }, 100)
        } else {
            const tvShows = data.results;
            tvShows.forEach(tvShow => {
                const tvShowEl = super.createTvShowElement(tvShow, genresArr);
                container.appendChild(tvShowEl);
            })
        }
    }

    showTvShowCast(data) {
        console.log('Tv show Cast: ', data)
        const actorsContainer = document.querySelector('.actors');
        console.log(actorsContainer);
        if (!actorsContainer) {
            setTimeout(() => {
                this.showTvShowCast(data);
            },100)
        } else {
            const actors = data.cast.slice(0, 5);
            console.log('Actors:', actors)
            actors.forEach(actor => {
                const actorEl = super.createActorElement(actor);
                actorsContainer.appendChild(actorEl)
            })
        }
    }

    showSearchedTvShows(data, genresArr) {
        this.clearMainContainer();
        const container = document.createElement('div');
        container.className = 'searched_items_container';
        this.mainContainer.appendChild(container);
        const tvShows = data.results;
        tvShows.forEach(tvShow => {
            if (!tvShow.poster_path) return;
            const item = super.createTvShowElement(tvShow, genresArr);
            container.appendChild(item);
        })

    }

    showTrendingTvShows(data, genresArr) {
        const trendingTvShows = this.mainContainer.querySelector('.trending_tvShows');
        trendingTvShows.innerHTML = `
            <div class="container">
                <h1 class="section_title">Trending Tv Shows</h1>
                <div class="items_container">
                    <div class="flex" id="trending_tvShows_container">
        
                    </div>
                </div>
            </div>
        `;
        const tvShows = data.results;
        tvShows.forEach(tvShow => {
            const item = super.createTvShowElement(tvShow, genresArr);
            trendingTvShows.querySelector("#trending_tvShows_container").appendChild(item);
        })
    }

    showDramaTvShows(data, genresArr) {
        const dramaTvShows = this.mainContainer.querySelector('.drama_tvShows');
        dramaTvShows.innerHTML = `
            <div class="container">
                <h1 class="section_title">Drama Tv Shows</h1>
                <div class="items_container">
                    <div class="flex" id="drama_tvShows_container">
        
                    </div>
                </div>
            </div>
        `;
        const tvShows = data.results;
        tvShows.forEach(tvShow => {
            const item = super.createTvShowElement(tvShow, genresArr);
            dramaTvShows.querySelector("#drama_tvShows_container").appendChild(item);
        })
    }

    showCrimeTvShows(data, genresArr) {
        const crimeTvShows = this.mainContainer.querySelector('.crime_tvShows');
        crimeTvShows.innerHTML = `
            <div class="container">
                <h1 class="section_title">Crime Tv Shows</h1>
                <div class="items_container">
                    <div class="flex" id="crime_tvShows_container">
        
                    </div>
                </div>
            </div>
        `;
        const tvShows = data.results;
        tvShows.forEach(tvShow => {
            const item = super.createTvShowElement(tvShow, genresArr);
            crimeTvShows.querySelector("#crime_tvShows_container").appendChild(item);
        })
    }

    createAsideMenuForTvShows() {
        if (document.querySelector('.aside_section')) return;
        const asideSection = document.createElement('aside');
        asideSection.className = 'aside_section';
        asideSection.innerHTML = `
            <button id="aside_section_toggler"><i class="fas fa-chevron-left fa-3x"></i></button>
            <h3>Search Tv Shows by:</h3>
            <nav id="aside_menu">
                <h4>Genres</h4>
                <ul class="genres_list">
                    <li><a href="#" data-link-tvShow-genre-id="10759">Action & Adventure</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="80">Crime</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="9648">Mistery</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="16">Animation</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="35">Comedy</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="18">Drama</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="10749">Romance</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="99">Documentary</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="10765">Sci-Fi & Fantasy</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="10768">War & Politics</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="10764">Reality</a></li>
                    <li><a href="#" data-link-tvShow-genre-id="37">Western</a></li>
                </ul>
                <h4 class="mt-2">Year</h4>
                <ul class="years_list">
                    <li><a href="#" data-link-tvShow-year="2000">2000</a></li>
                    <li><a href="#" data-link-tvShow-year="2001">2001</a></li>
                    <li><a href="#" data-link-tvShow-year="2002">2002</a></li>
                    <li><a href="#" data-link-tvShow-year="2003">2003</a></li>
                    <li><a href="#" data-link-tvShow-year="2004">2004</a></li>
                    <li><a href="#" data-link-tvShow-year="2005">2005</a></li>
                    <li><a href="#" data-link-tvShow-year="2006">2006</a></li>
                    <li><a href="#" data-link-tvShow-year="2007">2007</a></li>
                    <li><a href="#" data-link-tvShow-year="2008">2008</a></li>
                    <li><a href="#" data-link-tvShow-year="2009">2009</a></li>
                    <li><a href="#" data-link-tvShow-year="2010">2010</a></li>
                    <li><a href="#" data-link-tvShow-year="2011">2011</a></li>
                    <li><a href="#" data-link-tvShow-year="2012">2012</a></li>
                    <li><a href="#" data-link-tvShow-year="2013">2013</a></li>
                    <li><a href="#" data-link-tvShow-year="2014">2014</a></li>
                    <li><a href="#" data-link-tvShow-year="2015">2015</a></li>
                    <li><a href="#" data-link-tvShow-year="2016">2016</a></li>
                    <li><a href="#" data-link-tvShow-year="2017">2017</a></li>
                    <li><a href="#" data-link-tvShow-year="2018">2018</a></li>
                    <li><a href="#" data-link-tvShow-year="2019">2019</a></li>
                    <li><a href="#" data-link-tvShow-year="2020">2020</a></li>
                    <li><a href="#" data-link-tvShow-year="2021">2021</a></li>
                </ul>
            </nav>
        `;
        this.mainContainer.parentElement.appendChild(asideSection);
    }


    // Seasons details
    createSeasonsContainer() {
        const container = document.createElement('div');
        container.id = 'seasons_container';
        container.innerHTML = `
        <h3 class="text-center py-2">Seasons</h3>
        `;
        return container
    }

    createSeasonsNavbar(seasons) {
        const navbar = document.createElement('nav');
        navbar.id = 'seasons_nav';
        const ul = document.createElement('ul')

        seasons.forEach(season => {
            if (season.season_number === 0) return;
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" class="season_link" data-link-season="${season.id}">${season.name}</a></li>
            `;
            if (season.season_number === 1) {
                li.querySelector('a').classList.add('active')
            }

            ul.appendChild(li);
        })
        navbar.appendChild(ul);
        return navbar;
    }

    createSeasonContentContainer() {
        const container = document.createElement('div');
        container.className = 'seasons_content_container';

        return container;
    }

    createSeasonsContent(seasons) {
        const container = this.createSeasonContentContainer();
        seasons.forEach(season => {
            if (season.season_number === 0) return;
            const contentContainer = document.createElement('div');
            contentContainer.className = 'season_content';
            if (season.season_number === 1) { contentContainer.classList.add('active') };
            contentContainer.setAttribute('data-content-season', season.id);
            contentContainer.innerHTML = `
                <p class="season_overview">${season.overview}</p>
                <div class="season_details_flex">
                    <div class="img_container">
                        <img src="${this.IMG_ENDPOINT}${season.poster_path}" alt="">
                    </div>
                    <div class="season_info">
                        <ul>
                            <li>Air date: ${season.air_date}</li>
                            <li>Episode count: ${season.episode_count}</li>
                        </ul>
                    </div>
                </div>
            `;
            container.appendChild(contentContainer);
        })
        return container;
    }

    createSeasonsSection(seasons) {
        const container = this.createSeasonsContainer();
        const navbar = this.createSeasonsNavbar(seasons);
        const content = this.createSeasonsContent(seasons);
        container.appendChild(navbar);
        container.appendChild(content);
        return container;
    }

    updateSeasonLinksClasses(activeLinkId) {
        const links = document.querySelectorAll('.season_link');
        links.forEach(link => {
            const id = parseInt(link.getAttribute('data-link-season'))
            if (id === activeLinkId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        })
    }

    showSeasonContent(activeId) {
        const items = document.querySelectorAll('[data-content-season]');
        items.forEach(item => {
            const id = parseInt(item.getAttribute('data-content-season'));
            if (id === activeId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })
    }
}

export const uiTv = new UITv();