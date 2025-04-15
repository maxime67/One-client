import api from './api';

export default {
    /**
     * Recherche globale sur tous les modèles
     */
    globalSearch(searchTerm, page = 1, limit = 20) {
        return api.get('/search', {
            params: {
                q: searchTerm,
                page,
                limit
            }
        });
    },

    /**
     * Recherche avancée avec filtres multiples
     */
    advancedSearch(filters, page = 1, limit = 20) {
        return api.post('/search/advanced', filters, {
            params: {
                page,
                limit
            }
        });
    },

    /**
     * Suggère des termes pour l'autocomplétion
     */
    getSuggestions(prefix, type = 'all', limit = 10) {
        return api.get('/search/suggestions', {
            params: {
                prefix,
                type,
                limit
            }
        });
    }
};