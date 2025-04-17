import axios from 'axios';
import { ref } from 'vue';
import api from "@/services/api.js";

// État global pour l'authentification
const currentUser = ref(null);
const isAuthenticated = ref(false);
const authError = ref(null);

// Token storage management
const TOKEN_KEY = 'auth_token';

export const AuthService = {
    async login(email, password) {
        try {
            authError.value = null;
            const response = await api.post(`/auth/login`, {
                email,
                password
            });

            const { token, user } = response.data;
            this.setAuthToken(token);
            currentUser.value = user;
            isAuthenticated.value = true;

            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            authError.value = error.response?.data?.message || 'Échec de la connexion';
            return { success: false, error: authError.value };
        }
    },

    async register(username, email, password) {
        try {
            authError.value = null;
            const response = await api.post(`/auth/register`, {
                username,
                email,
                password
            });

            return { success: true, user: response.data.user };
        } catch (error) {
            console.error('Register error:', error);
            authError.value = error.response?.data?.message || 'Échec de l\'inscription';
            return { success: false, error: authError.value };
        }
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        currentUser.value = null;
        isAuthenticated.value = false;
    },

    async fetchCurrentUser() {
        try {
            if (this.getAuthToken()) {
                const response = await api.get(`/auth/profile`);
                currentUser.value = response.data;
                isAuthenticated.value = true;
                return currentUser.value;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // En cas d'erreur, on déconnecte l'utilisateur
            this.logout();
            return null;
        }
    },

    // Gestion du token JWT
    setAuthToken(token) {
        localStorage.setItem(TOKEN_KEY, token);

        // Configurer axios pour inclure le token dans les en-têtes de toutes les requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    getAuthToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // État réactif accessible
    getters: {
        currentUser,
        isAuthenticated,
        authError
    },

    // Initialisation lors du démarrage de l'application
    async initialize() {
        const token = this.getAuthToken();
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await this.fetchCurrentUser();
        }
    }
};

// Configuration d'un intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token expiré ou invalide
            AuthService.logout();
            // Ici, vous pourriez utiliser le routeur pour rediriger l'utilisateur
        }
        return Promise.reject(error);
    }
);