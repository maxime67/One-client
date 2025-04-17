<template>
  <div>
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-white">Product Explorer</h1>
      <p class="text-gray-400 mt-1">Explore software products with known vulnerabilities</p>
    </header>

    <!-- Search and Sorting -->
    <div class="bg-dark-600 border border-primary-500/20 rounded-xl p-5 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <div class="relative">
            <input
                type="text"
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="Search products by name or vendor..."
                class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
            />
            <div class="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex items-center">
            <label for="sortBy" class="text-sm text-gray-400 mr-2 whitespace-nowrap">Sort by</label>
            <select
                id="sortBy"
                v-model="sortBy"
                @change="fetchProducts()"
                class="bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
            >
              <option value="cveCount">CVE Count</option>
              <option value="name">Name</option>
              <option value="lastSeen">Last Updated</option>
            </select>
          </div>

          <button
              @click="toggleSortOrder"
              class="bg-dark-700 border border-dark-400 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
              :title="sortOrder === 'desc' ? 'Descending' : 'Ascending'"
          >
            <svg v-if="sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!products.length" class="bg-dark-600 border border-primary-500/20 rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-medium text-white mb-2">No Products Found</h3>
      <p class="text-gray-400">Try adjusting your search query.</p>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
          v-for="product in products"
          :key="product._id"
          :to="{ name: 'ProductDetails', params: { id: product._id }}"
          class="bg-dark-600 border border-primary-500/20 rounded-xl p-5 transition duration-200 hover:shadow-glow-light"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xl font-semibold">
              {{ product.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-medium text-white">{{ product.name }}</h3>
            <router-link
                :to="{ name: 'VendorDetails', params: { id: product.vendor?._id || '' }}"
                class="text-sm text-primary-400 hover:text-primary-300 mt-1 inline-block"
                @click.stop
            >
              {{ product.vendorName }}
            </router-link>

            <div class="flex items-center text-sm text-gray-400 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(product.lastSeen) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-between">
          <div class="bg-danger-500/10 rounded-lg p-3 text-center flex-1 mr-3">
            <div class="text-danger-400 text-lg font-semibold">{{ product.cveCount || 0 }}</div>
            <div class="text-xs text-gray-400">CVEs</div>
          </div>

<!--          <div v-if="product.versions" class="bg-primary-500/10 rounded-lg p-3 text-center flex-1">-->
<!--            <div class="text-primary-400 text-lg font-semibold">{{ product.versions.length || 0 }}</div>-->
<!--            <div class="text-xs text-gray-400">Versions</div>-->
<!--          </div>-->
        </div>
      </router-link>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <div class="inline-flex shadow-sm rounded-md">
        <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 text-sm font-medium rounded-l-lg"
            :class="[
            currentPage === 1
              ? 'bg-dark-700 text-gray-500 cursor-not-allowed'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
          ]"
        >
          Previous
        </button>

        <template v-for="(page, index) in paginationRange" :key="index">
          <span
              v-if="page === '...'"
              class="px-4 py-2 bg-dark-700 text-gray-400 text-sm font-medium"
          >
            ...
          </span>
          <button
              v-else
              @click="goToPage(page)"
              class="px-4 py-2 text-sm font-medium"
              :class="[
              currentPage === page
                ? 'bg-primary-500/20 text-primary-300 border-t border-b border-primary-500/30'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 text-sm font-medium rounded-r-lg"
            :class="[
            currentPage === totalPages
              ? 'bg-dark-700 text-gray-500 cursor-not-allowed'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
          ]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';
import productService from '../services/productService';

export default {
  name: 'ProductExplorer',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const products = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalItems = ref(0);
    const searchQuery = ref('');
    const sortBy = ref('cveCount');
    const sortOrder = ref('desc');

    const syncQueryParams = () => {
      const query = route.query;

      if (query.search) searchQuery.value = query.search;
      if (query.sortBy) sortBy.value = query.sortBy;
      if (query.sortOrder) sortOrder.value = query.sortOrder;
      if (query.page) currentPage.value = parseInt(query.page);
      else currentPage.value = 1;
    };

    const updateQueryParams = () => {
      const query = {};

      if (searchQuery.value) query.search = searchQuery.value;
      if (sortBy.value !== 'cveCount') query.sortBy = sortBy.value;
      if (sortOrder.value !== 'desc') query.sortOrder = sortOrder.value;
      if (currentPage.value > 1) query.page = currentPage.value;

      router.replace({ query }).catch(() => {});
    };

    const fetchProducts = async () => {
      loading.value = true;

      try {
        let response;

        if (searchQuery.value) {
          response = await productService.searchProducts(
              searchQuery.value,
              currentPage.value,
              20
          );
        } else {
          response = await productService.getAllProducts(
              currentPage.value,
              20,
              sortBy.value,
              sortOrder.value
          );
        }

        products.value = response.data.products;
        totalPages.value = response.data.pagination.totalPages;
        totalItems.value = response.data.pagination.total;
      } catch (error) {
        console.error('Error fetching products:', error);
        products.value = [];
        totalPages.value = 1;
        totalItems.value = 0;
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown';
      try {
        return format(new Date(dateString), 'MMM d, yyyy');
      } catch (e) {
        return 'Unknown date';
      }
    };

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
      fetchProducts();
      updateQueryParams();
    };

    // Search handler with debounce
    let searchTimeout;
    const handleSearch = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchProducts();
        updateQueryParams();
      }, 300);
    };

    // Pagination handlers
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchProducts();
        updateQueryParams();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchProducts();
        updateQueryParams();
      }
    };

    const goToPage = (page) => {
      currentPage.value = page;
      fetchProducts();
      updateQueryParams();
    };

    // Calculate pagination display logic
    const paginationRange = computed(() => {
      const range = [];
      const maxVisiblePages = 7; // Adjust based on your preference

      if (totalPages.value <= maxVisiblePages) {
        // Show all pages if total pages is less than maxVisiblePages
        for (let i = 1; i <= totalPages.value; i++) {
          range.push(i);
        }
      } else {
        // Always show first and last page, and some pages around current page
        range.push(1);

        const leftSide = Math.floor(maxVisiblePages / 2);
        const rightSide = maxVisiblePages - leftSide - 1;

        // Calculate start and end of the visible range
        let start = currentPage.value - leftSide;
        let end = currentPage.value + rightSide;

        // Adjust if range exceeds boundaries
        if (start <= 1) {
          start = 2;
          end = start + maxVisiblePages - 3;
        }

        if (end >= totalPages.value) {
          end = totalPages.value - 1;
          start = Math.max(2, end - (maxVisiblePages - 3));
        }

        // Add ellipsis if needed
        if (start > 2) {
          range.push('...');
        }

        // Add pages in the middle
        for (let i = start; i <= end; i++) {
          range.push(i);
        }

        // Add ellipsis if needed
        if (end < totalPages.value - 1) {
          range.push('...');
        }

        // Add last page if not already included
        if (totalPages.value > 1) {
          range.push(totalPages.value);
        }
      }

      return range;
    });

    // Watch for route changes
    watch(() => route.query, () => {
      syncQueryParams();
      fetchProducts();
    }, { deep: true });

    // Initial setup
    onMounted(() => {
      syncQueryParams();
      fetchProducts();
    });

    return {
      products,
      loading,
      currentPage,
      totalPages,
      totalItems,
      searchQuery,
      sortBy,
      sortOrder,
      handleSearch,
      toggleSortOrder,
      prevPage,
      nextPage,
      goToPage,
      paginationRange,
      formatDate
    };
  }
};
</script>