class DataCtrl {
    constructor() {
        this.API_KEY = '9dde54d64fb07c0b85dd8050c65b95c7';
        this.IMG_ENDPOINT = 'https://image.tmdb.org/t/p/w500/';
        this.totalPages = 1;
        this.currentMediaType = 'movie';
        this.currentPage = 1;
    }

}

export const dataCtrl = new DataCtrl();
