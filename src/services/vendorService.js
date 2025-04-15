import api from './api';

export default {
    /**
     * Récupère tous les vendeurs avec pagination
     */
    getAllVendors(page = 1, limit = 20, sortBy = 'cveCount', sortOrder = 'desc') {
        return api.get('/vendors', {
            params: {
                page,
                limit,
                sortBy,
                sortOrder
            }
        });
    },

    /**
     * Récupère un vendeur par son ID
     */
    getVendorById(vendorId) {
        return api.get(`/vendors/${vendorId}`);
    },

    /**
     * Récupère un vendeur par son nom
     */
    getVendorByName(name) {
        return api.get(`/vendors/name/${name}`);
    },

    /**
     * Recherche de vendeurs par texte
     */
    searchVendors(searchTerm, page = 1, limit = 20) {
        return api.get('/vendors/search', {
            params: {
                q: searchTerm,
                page,
                limit
            }
        });
    },

    /**
     * Récupère les produits d'un vendeur
     */
    getVendorProducts(vendorId, page = 1, limit = 20) {
        return api.get(`/vendors/${vendorId}/products`, {
            params: {
                page,
                limit
            }
        });
    },

    /**
     * Récupère les statistiques des vendeurs
     */
    getVendorStats() {
        return api.get('/vendors/stats/summary');
    },

    /**
     * Récupère les statistiques des CVE pour un vendeur
     */
    getVendorCVEStats(vendorId) {
        return api.get(`/vendors/${vendorId}/stats`);
    }
};