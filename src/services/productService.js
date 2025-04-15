import api from './api';

export default {
    /**
     * Récupère tous les produits avec pagination
     */
    getAllProducts(page = 1, limit = 20, sortBy = 'cveCount', sortOrder = 'desc') {
        return api.get('/products', {
            params: {
                page,
                limit,
                sortBy,
                sortOrder
            }
        });
    },

    /**
     * Récupère un produit par son ID
     */
    getProductById(productId) {
        return api.get(`/products/${productId}`);
    },

    /**
     * Récupère un produit par son nom et son vendeur
     */
    getProductByNameAndVendor(productName, vendorId) {
        return api.get(`/products/vendor/${vendorId}/name/${productName}`);
    },

    /**
     * Recherche de produits par texte
     */
    searchProducts(searchTerm, page = 1, limit = 20) {
        return api.get('/products/search', {
            params: {
                q: searchTerm,
                page,
                limit
            }
        });
    },

    /**
     * Récupère les CVE pour un produit
     */
    getProductCVEs(productId, page = 1, limit = 20) {
        return api.get(`/products/${productId}/cves`, {
            params: {
                page,
                limit
            }
        });
    },

    /**
     * Récupère les versions d'un produit
     */
    getProductVersions(productId) {
        return api.get(`/products/${productId}/versions`);
    },

    /**
     * Récupère les statistiques des produits
     */
    getProductStats() {
        return api.get('/products/stats/summary');
    },

    /**
     * Récupère les statistiques des CVE pour un produit
     */
    getProductCVEStats(productId) {
        return api.get(`/products/${productId}/stats`);
    }
};