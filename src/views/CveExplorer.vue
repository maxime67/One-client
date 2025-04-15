<template>
  <div>
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-white">CVE Explorer</h1>
      <p class="text-gray-400 mt-1">Explore and search through the CVE database</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Filters Sidebar -->
      <div class="md:col-span-1">
        <CveFilters
            :filters="filters"
            @update:filters="updateFilters"
            @apply="applyFilters"
        />
      </div>

      <!-- CVE List -->
      <div class="md:col-span-2 lg:col-span-3">
        <CveList
            :cves="cves"
            :loading="loading"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalItems"
            :sort-options="{ sortBy, sortOrder }"
            @page-change="handlePageChange"
            @sort-change="handleSortChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CveFilters from '../components/cve/CveFilters.vue';
import CveList from '../components/cve/CveList.vue';
import cveService from '../services/cveService';
import searchService from '../services/searchService';

export default {
  name: 'CveExplorer',
  components: {
    CveFilters,
    CveList
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const cves = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalItems = ref(0);
    const sortBy = ref('publishedDate');
    const sortOrder = ref('desc');

    // Filter state
    const filters = reactive({
      search: '',
      severity: '',
      minCvss: null,
      maxCvss: null,
      startDate: '',
      endDate: '',
      vendor: '',
      product: '',
      cweId: ''
    });

    // Fetch initial data
    const fetchData = async () => {
      loading.value = true;

      try {
        // Determine if we should use search, advanced search, or regular CVE fetch
        let response;

        if (hasActiveFilters() || filters.search) {
          // Use advanced search or text search
          if (hasAdvancedFilters()) {
            // Build advanced search filter object
            const searchFilters = {};

            if (filters.search) searchFilters.description = filters.search;
            if (filters.severity) searchFilters.severity = filters.severity;
            if (filters.minCvss) searchFilters.minCvss = filters.minCvss;
            if (filters.maxCvss) searchFilters.maxCvss = filters.maxCvss;
            if (filters.startDate) searchFilters.startDate = filters.startDate;
            if (filters.endDate) searchFilters.endDate = filters.endDate;
            if (filters.vendor) searchFilters.vendor = filters.vendor;
            if (filters.product) searchFilters.product = filters.product;
            if (filters.cweId) searchFilters.cweId = filters.cweId;

            response = await searchService.advancedSearch(
                searchFilters,
                currentPage.value,
                20
            );
          } else if (filters.search) {
            // Simple text search
            response = await cveService.searchCVEs(
                filters.search,
                currentPage.value,
                20
            );
          } else if (filters.severity) {
            // Severity filter only
            response = await cveService.getCVEsBySeverity(
                filters.severity,
                currentPage.value,
                20
            );
          }
        } else {
          // Regular CVE fetch
          response = await cveService.getAllCVEs(
              currentPage.value,
              20,
              sortBy.value,
              sortOrder.value
          );
        }

        cves.value = response.data.cves;
        totalPages.value = response.data.pagination.totalPages;
        totalItems.value = response.data.pagination.total;
      } catch (error) {
        console.error('Error fetching CVEs:', error);
        cves.value = [];
        totalPages.value = 1;
        totalItems.value = 0;
      } finally {
        loading.value = false;
      }
    };

    // Check if any filter is active
    const hasActiveFilters = () => {
      return Object.keys(filters).some(key => {
        const value = filters[key];
        return (
            (typeof value === 'string' && value !== '') ||
            (typeof value === 'number' && value !== null)
        );
      });
    };

    // Check if advanced filters are being used
    const hasAdvancedFilters = () => {
      return (
          filters.severity ||
          filters.minCvss !== null ||
          filters.maxCvss !== null ||
          filters.startDate ||
          filters.endDate ||
          filters.vendor ||
          filters.product ||
          filters.cweId
      );
    };

    // Handle URL query parameters
    const syncFiltersWithQuery = () => {
      const query = route.query;

      // Reset all filters
      Object.keys(filters).forEach(key => {
        if (typeof filters[key] === 'string') {
          filters[key] = '';
        } else if (typeof filters[key] === 'number') {
          filters[key] = null;
        }
      });

      // Apply query params to filters
      if (query.search) filters.search = query.search;
      if (query.severity) filters.severity = query.severity;
      if (query.minCvss) filters.minCvss = parseFloat(query.minCvss);
      if (query.maxCvss) filters.maxCvss = parseFloat(query.maxCvss);
      if (query.startDate) filters.startDate = query.startDate;
      if (query.endDate) filters.endDate = query.endDate;
      if (query.vendor) filters.vendor = query.vendor;
      if (query.product) filters.product = query.product;
      if (query.cweId) filters.cweId = query.cweId;

      // Apply sorting
      if (query.sortBy) sortBy.value = query.sortBy;
      if (query.sortOrder) sortOrder.value = query.sortOrder;

      // Apply pagination
      if (query.page) currentPage.value = parseInt(query.page);
      else currentPage.value = 1;
    };

    // Update URL with current filters and pagination
    const updateQueryParams = () => {
      const query = {};

      // Add active filters to query
      if (filters.search) query.search = filters.search;
      if (filters.severity) query.severity = filters.severity;
      if (filters.minCvss !== null) query.minCvss = filters.minCvss;
      if (filters.maxCvss !== null) query.maxCvss = filters.maxCvss;
      if (filters.startDate) query.startDate = filters.startDate;
      if (filters.endDate) query.endDate = filters.endDate;
      if (filters.vendor) query.vendor = filters.vendor;
      if (filters.product) query.product = filters.product;
      if (filters.cweId) query.cweId = filters.cweId;

      // Add sorting and pagination
      if (sortBy.value !== 'publishedDate') query.sortBy = sortBy.value;
      if (sortOrder.value !== 'desc') query.sortOrder = sortOrder.value;
      if (currentPage.value > 1) query.page = currentPage.value;

      // Update URL without reload
      router.replace({ query }).catch(() => {});
    };

    // Filter handlers
    const updateFilters = (newFilters) => {
      Object.assign(filters, newFilters);
    };

    const applyFilters = () => {
      currentPage.value = 1; // Reset to first page
      updateQueryParams();
      fetchData();
    };

    // Pagination handler
    const handlePageChange = (page) => {
      currentPage.value = page;
      updateQueryParams();
      fetchData();

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Sorting handler
    const handleSortChange = ({ sortBy: newSortBy, sortOrder: newSortOrder }) => {
      sortBy.value = newSortBy;
      sortOrder.value = newSortOrder;
      updateQueryParams();
      fetchData();
    };

    // Watch for route changes (e.g., from sidebar navigation)
    watch(() => route.query, () => {
      syncFiltersWithQuery();
      fetchData();
    }, { deep: true });

    // Initial setup
    onMounted(() => {
      syncFiltersWithQuery();
      fetchData();
    });

    return {
      cves,
      loading,
      filters,
      currentPage,
      totalPages,
      totalItems,
      sortBy,
      sortOrder,
      updateFilters,
      applyFilters,
      handlePageChange,
      handleSortChange
    };
  }
};
</script>