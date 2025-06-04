<template>
  <header class="bg-dark-700 border-b border-primary-500/30 h-24 flex items-center px-6 shadow-md">
    <div class="flex items-center">
      <router-link to="/" class="flex items-center">
        <div class="text-primary-400 text-2xl font-semibold tracking-wider">
          <span class="text-white">
            <img src="../../../public/logo.png" class="h-24 w-96 object-contain">
          </span>
        </div>
      </router-link>
    </div>

    <div class="flex-1 mx-16">
      <div class="relative max-w-xl">
        <input
            type="text"
            placeholder="Search CVEs, vendors, products..."
            v-model="searchQuery"
            @input="handleSearch"
            @keyup.enter="performSearch"
            @focus="showSearchResults = true"
            @blur="hideSearchResultsDelayed"
            class="w-full bg-dark-600 border border-dark-400 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
        />
        <div class="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Search Results Dropdown -->
        <div v-if="showSearchResults && searchSuggestions.length > 0"
             class="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-400 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div class="p-2">
            <div v-if="searchSuggestions.cves && searchSuggestions.cves.length > 0" class="mb-3">
              <h3 class="text-xs font-medium text-primary-300 uppercase mb-1 px-2">CVEs</h3>
              <div v-for="cve in searchSuggestions.cves" :key="cve.cveId"
                   class="px-2 py-1.5 hover:bg-dark-600 rounded cursor-pointer"
                   @mousedown.prevent="goToDetails('cve', cve.cveId)">
                <div class="text-sm font-medium">{{ cve.cveId }}</div>
              </div>
            </div>

            <div v-if="searchSuggestions.vendors && searchSuggestions.vendors.length > 0" class="mb-3">
              <h3 class="text-xs font-medium text-primary-300 uppercase mb-1 px-2">Vendors</h3>
              <div v-for="vendor in searchSuggestions.vendors" :key="vendor._id"
                   class="px-2 py-1.5 hover:bg-dark-600 rounded cursor-pointer"
                   @mousedown.prevent="goToDetails('vendor', vendor._id)">
                <div class="text-sm font-medium">{{ vendor.name }}</div>
              </div>
            </div>

            <div v-if="searchSuggestions.products && searchSuggestions.products.length > 0">
              <h3 class="text-xs font-medium text-primary-300 uppercase mb-1 px-2">Products</h3>
              <div v-for="product in searchSuggestions.products" :key="product._id"
                   class="px-2 py-1.5 hover:bg-dark-600 rounded cursor-pointer"
                   @mousedown.prevent="goToDetails('product', product._id)">
                <div class="text-sm font-medium">{{ product.name }}</div>
                <div class="text-xs text-gray-400">{{ product.vendorName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <!-- GitHub Link -->
      <a href="https://github.com/maxime67" target="_blank" class="text-gray-400 hover:text-primary-400 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>
      <div
          v-if="!isAuthenticated"
          >
      <RouterLink to="login">
        <button class="p-6 text-gray-400 hover:text-primary-400 transition">Login</button>
      </RouterLink>
      <RouterLink to="register">
        <button class="text-gray-400 hover:text-primary-400 transition">Register</button>
      </RouterLink>
      </div>
    </div>
  </header>
</template>

<script>
import {ref, watch, nextTick, computed} from 'vue';
import { useRouter } from 'vue-router';
import searchService from '../../services/searchService';
import {AuthService} from "@/services/authService.js";

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const searchSuggestions = ref([]);
    const showSearchResults = ref(false);
    let searchTimeout = null;
    let hideTimeout = null;
    const isAuthenticated = computed(() => AuthService.getters.isAuthenticated.value)

    const handleSearch = () => {
      clearTimeout(searchTimeout);

      if (searchQuery.value.length < 2) {
        searchSuggestions.value = [];
        return;
      }

      searchTimeout = setTimeout(async () => {
        try {
          const { data } = await searchService.getSuggestions(searchQuery.value);
          searchSuggestions.value = data;
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
        }
      }, 300);
    };

    const performSearch = () => {
      if (searchQuery.value.trim().length > 0) {
        router.push({
          name: 'CveExplorer',
          query: { search: searchQuery.value }
        });
        showSearchResults.value = false;
      }
    };

    const goToDetails = (type, id) => {
      let route;
      switch (type) {
        case 'cve':
          route = { name: 'CveDetails', params: { id } };
          break;
        case 'vendor':
          route = { name: 'VendorDetails', params: { id } };
          break;
        case 'product':
          route = { name: 'ProductDetails', params: { id } };
          break;
      }

      if (route) {
        router.push(route);
        searchQuery.value = '';
        showSearchResults.value = false;
      }
    };

    const hideSearchResultsDelayed = () => {
      hideTimeout = setTimeout(() => {
        showSearchResults.value = false;
      }, 200);
    };

    // Clean up timers
    watch(() => router.currentRoute.value, () => {
      searchQuery.value = '';
      showSearchResults.value = false;
    });

    return {
      isAuthenticated,
      searchQuery,
      searchSuggestions,
      showSearchResults,
      handleSearch,
      performSearch,
      goToDetails,
      hideSearchResultsDelayed
    };
  }
};
</script>