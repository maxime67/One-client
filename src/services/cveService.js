import api from './api';

export default {
    /**
     * Récupère tous les CVE avec pagination
     */
    getAllCVEs(page = 1, limit = 20, sortBy = 'publishedDate', sortOrder = 'desc') {
        return api.get('/cves', {
            params: {
                page,
                limit,
                sortBy,
                sortOrder
            }
        });
    },

    /**
     * Récupère un CVE par son ID
     */
    getCVEById(cveId) {
        return api.get(`/cves/${cveId}`);
    },

    /**
     * Récupère les CVE par niveau de sévérité
     */
    getCVEsBySeverity(severity, page = 1, limit = 20) {
        return api.get(`/cves/severity/${severity}`, {
            params: {
                page,
                limit
            }
        });
    },

    /**
     * Récupère les CVE pour un produit spécifique
     */
    getCVEsByProduct(productId, page = 1, limit = 20) {
        return api.get(`/cves/product/${productId}`, {
            params: {
                page,
                limit
            }
        });
    },

    /**
     * Récupère les CVE pour un vendeur spécifique
     */
    getCVEsByVendor(vendorId, page = 1, limit = 20) {
        return api.get(`/cves/vendor/${vendorId}`, {
            params: {
                page,
                limit
            }
        });
    },

    /**
     * Recherche de CVE par texte
     */
    searchCVEs(searchTerm, page = 1, limit = 20) {
        return api.get('/cves/search', {
            params: {
                q: searchTerm,
                page,
                limit
            }
        });
    },

    /**
     * Obtient les statistiques générales des CVE
     */
    getCVEStats() {
        return api.get('/cves/stats/summary');
    },

};