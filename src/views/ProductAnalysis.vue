<template>
  <div>
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-white">Product Analysis</h1>
      <p class="text-gray-400 mt-1">Compare and analyze security vulnerabilities across products</p>
    </header>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Comparison Tool -->
      <div class="lg:col-span-2">
        <ProductComparison />
      </div>

      <!-- Right Column: Top Products by CVEs -->
      <div class="space-y-6">
        <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
          <div class="p-5 border-b border-dark-500 flex justify-between items-center">
            <h3 class="text-lg font-medium text-white">Top Vulnerable Products</h3>
            <router-link to="/products" class="text-sm text-primary-400 hover:text-primary-300">
              View All
            </router-link>
          </div>
          <div v-if="loading" class="p-5 flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
          <div v-else-if="topProducts.length === 0" class="p-5 text-center text-gray-400">
            No product data available.
          </div>
          <div v-else class="divide-y divide-dark-500">
            <router-link
                v-for="product in topProducts"
                :key="product._id"
                :to="{ name: 'ProductDetails', params: { id: product._id }}"
                class="block p-4 hover:bg-dark-500 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white font-medium">{{ product.name }}</div>
                  <div class="text-xs text-primary-400">{{ product.vendorName }}</div>
                </div>
                <div class="bg-danger-500/10 text-danger-400 px-2 py-1 rounded text-xs font-medium">
                  {{ product.cveCount || 0 }} CVEs
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Recently Affected Products -->
        <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
          <div class="p-5 border-b border-dark-500">
            <h3 class="text-lg font-medium text-white">Recently Affected Products</h3>
          </div>
          <div v-if="loading" class="p-5 flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
          <div v-else-if="recentProducts.length === 0" class="p-5 text-center text-gray-400">
            No product data available.
          </div>
          <div v-else class="divide-y divide-dark-500">
            <router-link
                v-for="product in recentProducts"
                :key="product._id"
                :to="{ name: 'ProductDetails', params: { id: product._id }}"
                class="block p-4 hover:bg-dark-500 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white font-medium">{{ product.name }}</div>
                  <div class="text-xs text-primary-400">{{ product.vendorName }}</div>
                </div>
                <div class="text-xs text-gray-400">
                  {{ formatDate(product.lastSeen) }}
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Top Vendors Card -->
        <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
          <div class="p-5 border-b border-dark-500 flex justify-between items-center">
            <h3 class="text-lg font-medium text-white">Top Vendors</h3>
            <router-link to="/vendors" class="text-sm text-primary-400 hover:text-primary-300">
              View All
            </router-link>
          </div>
          <div v-if="loadingVendors" class="p-5 flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
          <div v-else-if="topVendors.length === 0" class="p-5 text-center text-gray-400">
            No vendor data available.
          </div>
          <div v-else class="divide-y divide-dark-500">
            <router-link
                v-for="vendor in topVendors"
                :key="vendor._id"
                :to="{ name: 'VendorDetails', params: { id: vendor._id }}"
                class="block p-4 hover:bg-dark-500 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-secondary-500/20 flex items-center justify-center text-secondary-400 text-sm font-semibold">
                    {{ vendor.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-3 text-white font-medium">{{ vendor.name }}</div>
                </div>
                <div class="bg-danger-500/10 text-danger-400 px-2 py-1 rounded text-xs font-medium">
                  {{ vendor.cveCount || 0 }} CVEs
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import ProductComparison from './ProductComparison.vue';
import productService from '../services/productService';
import vendorService from '../services/vendorService';

export default {
  name: 'ProductAnalysis',
  components: {
    ProductComparison
  },
  setup() {
    const loading = ref(true);
    const loadingVendors = ref(true);
    const topProducts = ref([]);
    const recentProducts = ref([]);
    const topVendors = ref([]);

    const fetchTopProducts = async () => {
      loading.value = true;
      try {
        const { data } = await productService.getAllProducts(1, 5, 'cveCount', 'desc');
        topProducts.value = data.products;
      } catch (error) {
        console.error('Error fetching top products:', error);
        topProducts.value = [];
      } finally {
        loading.value = false;
      }
    };

    const fetchRecentProducts = async () => {
      try {
        const { data } = await productService.getAllProducts(1, 5, 'lastSeen', 'desc');
        recentProducts.value = data.products;
      } catch (error) {
        console.error('Error fetching recent products:', error);
        recentProducts.value = [];
      }
    };

    const fetchTopVendors = async () => {
      loadingVendors.value = true;
      try {
        const { data } = await vendorService.getAllVendors(1, 5, 'cveCount', 'desc');
        topVendors.value = data.vendors;
      } catch (error) {
        console.error('Error fetching top vendors:', error);
        topVendors.value = [];
      } finally {
        loadingVendors.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown';
      try {
        return format(new Date(dateString), 'MMM d, yyyy');
      } catch (e) {
        return 'Invalid date';
      }
    };

    onMounted(() => {
      fetchTopProducts();
      fetchRecentProducts();
      fetchTopVendors();
    });

    return {
      loading,
      loadingVendors,
      topProducts,
      recentProducts,
      topVendors,
      formatDate
    };
  }
};
</script>