import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
            title: 'Dashboard - CVE Explorer'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../components/auth/LoginForm.vue'),
        meta: {
            title: 'Login'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../components/auth/RegisterForm.vue'),
        meta: {
            title: 'Register'
        }
    },
    {
        path: '/cves',
        name: 'CveExplorer',
        component: () => import('../views/CveExplorer.vue'),
        meta: {
            title: 'CVE Explorer'
        }
    },
    {
        path: '/cves/:id',
        name: 'CveDetails',
        component: () => import('../views/CveDetails.vue'),
        props: true,
        meta: {
            title: 'CVE Details'
        }
    },
    {
        path: '/vendors',
        name: 'VendorExplorer',
        component: () => import('../views/VendorExplorer.vue'),
        meta: {
            title: 'Vendor Explorer'
        }
    },
    {
        path: '/vendors/:id',
        name: 'VendorDetails',
        component: () => import('../views/VendorDetails.vue'),
        props: true,
        meta: {
            title: 'Vendor Details'
        }
    },
    {
        path: '/products',
        name: 'ProductExplorer',
        component: () => import('../views/ProductExplorer.vue'),
        meta: {
            title: 'Product Explorer'
        }
    },
    {
        path: '/products/:id',
        name: 'ProductDetails',
        component: () => import('../views/ProductDetails.vue'),
        props: true,
        meta: {
            title: 'Product Details'
        }
    },
    {
        path: '/analysis',
        name: 'ProductAnalysis',
        component: () => import('../views/ProductAnalysis.vue'),
        meta: {
            title: 'Product Analysis'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
        meta: {
            title: 'Page Not Found'
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

router.beforeEach((to, from, next) => {
    // Update the document title
    document.title = to.meta.title || 'CVE Explorer';
    next();
});

export default router;