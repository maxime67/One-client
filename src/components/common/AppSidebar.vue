<template>
  <aside class="w-64 bg-dark-700 border-r border-primary-500/20 py-6 px-4 hidden md:block">
    <nav class="space-y-6">
      <div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Main Navigation
        </h3>
        <ul class="space-y-1">
          <li v-for="item in mainNavItems" :key="item.name">
            <router-link
                :to="item.to"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
                :class="[
                isActive(item.to)
                  ? 'text-white bg-primary-500/20 shadow-glow-light'
                  : 'text-gray-300 hover:text-white hover:bg-dark-600'
              ]"
            >
              <span class="mr-3" v-html="item.icon"></span>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Quick Filters
        </h3>
        <ul class="space-y-1">
          <li v-for="item in filterNavItems" :key="item.name">
            <router-link
                :to="item.to"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
                :class="[
                isActive(item.to)
                  ? 'text-white bg-primary-500/20 shadow-glow-light'
                  : 'text-gray-300 hover:text-white hover:bg-dark-600'
              ]"
            >
              <span class="mr-3" v-html="item.icon"></span>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Recent Activity
        </h3>
        <div class="rounded-lg bg-dark-600 p-3">
          <div class="text-sm font-medium text-gray-300 mb-2">Latest CVE Updates</div>
          <div class="space-y-2">
            <router-link
                v-for="cve in recentCVEs"
                :key="cve.id"
                :to="{ name: 'CveDetails', params: { id: cve.id }}"
                class="block px-2 py-1.5 text-xs rounded hover:bg-dark-500 text-gray-300 hover:text-white truncate"
            >
              {{ cve.id }}
              <span
                  class="inline-block ml-1 w-2 h-2 rounded-full"
                  :class="getSeverityClass(cve.severity)"
              ></span>
            </router-link>
          </div>
          <router-link
              to="/cves"
              class="text-xs text-primary-400 hover:text-primary-300 mt-2 inline-block"
          >
            View all →
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import cveService from '../../services/cveService';

export default {
  name: 'AppSidebar',
  setup() {
    const route = useRoute();
    const recentCVEs = ref([]);

    const mainNavItems = [
      {
        name: 'Dashboard',
        to: '/',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
      },
      {
        name: 'CVE Explorer',
        to: '/cves',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>'
      },
      {
        name: 'Vendors',
        to: '/vendors',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
      },
      {
        name: 'Products',
        to: '/products',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>'
      },
      {
        name: 'Product Analysis',
        to: '/analysis',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
      }
    ];

    const filterNavItems = [
      {
        name: 'Critical Severity',
        to: { path: '/cves', query: { severity: 'CRITICAL' } },
        icon: '<span class="w-4 h-4 rounded-full bg-danger-500 flex items-center justify-center"><span class="w-2 h-2 bg-white rounded-full"></span></span>'
      },
      {
        name: 'High Severity',
        to: { path: '/cves', query: { severity: 'HIGH' } },
        icon: '<span class="w-4 h-4 rounded-full bg-warning-500 flex items-center justify-center"><span class="w-2 h-2 bg-white rounded-full"></span></span>'
      },
      {
        name: 'Recent CVEs',
        to: { path: '/cves', query: { sortBy: 'publishedDate', sortOrder: 'desc' } },
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
      }
    ];

    const isActive = (to) => {
      if (typeof to === 'string') {
        return route.path === to;
      } else {
        // For objects with query parameters, check both path and query params
        return route.path === to.path &&
            JSON.stringify(route.query) === JSON.stringify(to.query);
      }
    };

    const getSeverityClass = (severity) => {
      switch(severity) {
        case 'CRITICAL': return 'bg-danger-500';
        case 'HIGH': return 'bg-warning-500';
        case 'MEDIUM': return 'bg-orange-500';
        case 'LOW': return 'bg-success-500';
        default: return 'bg-gray-500';
      }
    };

    onMounted(async () => {
      try {
        const { data } = await cveService.getAllCVEs(1, 5, 'publishedDate', 'desc');
        recentCVEs.value = data.cves.map(cve => ({
          id: cve.cveId,
          severity: cve.severity || 'UNKNOWN'
        }));
      } catch (error) {
        console.error('Error fetching recent CVEs:', error);
        recentCVEs.value = [];
      }
    });

    return {
      mainNavItems,
      filterNavItems,
      recentCVEs,
      isActive,
      getSeverityClass
    };
  }
};
</script>