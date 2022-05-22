/*
 * MARKDOWN BLOG: GLOBAL VARIABLES, FUNCTIONS, and CLASSES
 */

function showElement(el, displayType) {
    if (typeof displayType == 'undefined') {
        displayType = 'block';
    }
    this.element.style.display = displayType;
}

function hideElement(el) {
    el.style.display = 'none';
}

class APIClient {
    constructor() {
        // Caching the API Base URL
        this._API_BASE_URL = this._getApiBaseUrl();
        this._API_ARTICLES_URL = `${_API_BASE_URL}/articles`;

        // BIND
        this.getArticlesListing.bind(this);
        this.getArticle.bind(this);
        this.createArticle.bind(this);
        this.updateArticle.bind(this);
        // this.xx.bind(this);
        // this.xx.bind(this);

        this._getApiBaseUrl.bind(this);
        this._getArticleIdUrl.bind(this);
        this._processErrDataAxiosResponse.bind(this);
    }

    getArticlesListing() {
        return this._processErrDataAxiosResponse(axios.get(this._API_ARTICLES_URL));
    }
    
    getArticle(articleId) {
        return this._processErrDataAxiosResponse();
        // return new Promise((accept, reject) => {
        //     axios.get(this._getArticleIdUrl(articleId))
        //         .then(res => accept(res.data))
        //         .catch(err => reject(err));
        // })
    }

    createArticle(articleData) {
        // Only keeping these fields in case more are submitted
        const { author, title, markdownContent } = articleData;
        articleData = { author, title, markdownContent };
        return this._processErrDataAxiosResponse(axios.post(this._API_ARTICLES_URL, articleData));
        // return new Promise((accept, reject) => {
        //     axios.post(this._API_ARTICLES_URL, articleData)
        //         .then(res => accept(res.data))
        //         .catch(err => reject(err));
        // });
    }

    updateArticle(articleId, articleData) {
        // Only keeping these fields in case more are submitted
        const { author, title, markdownContent } = articleData;
        articleData = { author, title, markdownContent };
        return this._processErrDataAxiosResponse(axios.put(this._getArticleIdUrl(articleId), articleData));
        // return new Promise((accept, reject) => {
        //     axios.put(this._getArticleIdUrl(articleId), articleData)
        //         .then(res => accept(res.data))
        //         .catch(err => reject(err));
        // })
    }

    // "private"
    _getApiBaseUrl() {
        let apiBase = '';
        if (window.location.hostname == 'localhost') {
            apiBase = 'http://localhost:8081';
        } else {
            // TODO: Can set your prod URL here
            apiBase = 'http://xyz';
        }
        apiBase = `${apiBase}/api`;
        return apiBase;
    }

    _getArticleIdUrl(articleId) {
        return `${this._API_ARTICLES_URL}/${articleId}`
    }

    _processErrDataAxiosResponse(axiosPromise) {
        return new Promise((accept, reject) => {
            axiosPromise
                .then(res => {
                    const { data, err } = res.data;
                    if (err) {
                        return reject(err);
                    }
                    accept(data);
                })
                .catch(err => reject(err));
        })
    }
}
