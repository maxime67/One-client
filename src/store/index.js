import { createStore } from 'vuex';
import cveService from '../services/cveService';
import vendorService from '../services/vendorService';
import productService from '../services/productService';

export default createStore({
    state: {
        // Dashboard statistics
        stats: {
            cve: {},
            vendor: {},
            product: {}
        },

        // Recent data
        recentCves: [],

        // Application state
        loading: {
            dashboard: false,
            cveList: false,
            cveDetail: false
        },

        // Error state
        errors: {
            dashboard: null,
            cveList: null,
            cveDetail: null
        }
    },

    getters: {
        // Dashboard statistics
        cveStats: state => state.stats.cve,
        vendorStats: state => state.stats.vendor,
        productStats: state => state.stats.product,

        // Get recent CVEs
        recentCves: state => state.recentCves,

        // Loading states
        isDashboardLoading: state => state.loading.dashboard,
        isCveListLoading: state => state.loading.cveList,
        isCveDetailLoading: state => state.loading.cveDetail,

        // Error states
        dashboardError: state => state.errors.dashboard,
        cveListError: state => state.errors.cveList,
        cveDetailError: state => state.errors.cveDetail
    },

    mutations: {
        // Set dashboard statistics
        SET_CVE_STATS(state, stats) {
            state.stats.cve = stats;
        },
        SET_VENDOR_STATS(state, stats) {
            state.stats.vendor = stats;
        },
        SET_PRODUCT_STATS(state, stats) {
            state.stats.product = stats;
        },

        // Set recent CVEs
        SET_RECENT_CVES(state, cves) {
            state.recentCves = cves;
        },

        // Set loading states
        SET_DASHBOARD_LOADING(state, isLoading) {
            state.loading.dashboard = isLoading;
        },
        SET_CVE_LIST_LOADING(state, isLoading) {
            state.loading.cveList = isLoading;
        },
        SET_CVE_DETAIL_LOADING(state, isLoading) {
            state.loading.cveDetail = isLoading;
        },

        // Set error states
        SET_DASHBOARD_ERROR(state, error) {
            state.errors.dashboard = error;
        },
        SET_CVE_LIST_ERROR(state, error) {
            state.errors.cveList = error;
        },
        SET_CVE_DETAIL_ERROR(state, error) {
            state.errors.cveDetail = error;
        }
    },

    actions: {
        // Fetch dashboard statistics
        async fetchDashboardStats({ commit }) {
            commit('SET_DASHBOARD_LOADING', true);
            commit('SET_DASHBOARD_ERROR', null);

            try {
                const [cveStats, vendorStats, productStats] = await Promise.all([
                    cveService.getCVEStats(),
                    vendorService.getVendorStats(),
                    productService.getProductStats()
                ]);

                commit('SET_CVE_STATS', cveStats.data);
                commit('SET_VENDOR_STATS', vendorStats.data);
                commit('SET_PRODUCT_STATS', productStats.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                commit('SET_DASHBOARD_ERROR', 'Failed to load dashboard statistics');
            } finally {
                commit('SET_DASHBOARD_LOADING', false);
            }
        },

        // Fetch recent CVEs
        async fetchRecentCves({ commit }, limit = 5) {
            try {
                const { data } = await cveService.getAllCVEs(1, limit, 'publishedDate', 'desc');
                commit('SET_RECENT_CVES', data.cves);
            } catch (error) {
                console.error('Error fetching recent CVEs:', error);
                // We don't set an error state here as this is a secondary feature
            }
        }
    }
});