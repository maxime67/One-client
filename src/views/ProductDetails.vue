<template>
  <div>
    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center py-10">
      <LoadingSpinner/>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-dark-600 border border-danger-500/20 rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-danger-500 mb-4" fill="none"
           viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <h3 class="text-lg font-medium text-white mb-2">Product Not Found</h3>
      <p class="text-gray-400 mb-6">The requested product could not be found.</p>
      <router-link to="/products"
                   class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition">
        Back to Product Explorer
      </router-link>
    </div>

    <!-- Product Details Content -->
    <div v-else>
      <!-- Header with Name and Basic Info -->
      <div class="bg-dark-600 border border-primary-500/20 rounded-xl p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <div class="flex items-center">
              <router-link
                  to="/products"
                  class="text-primary-400 hover:text-primary-300 mr-2"
                  title="Back to Product Explorer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </router-link>
              <h1 class="text-2xl font-bold text-white">{{ product.name }}</h1>
            </div>
            <router-link
                :to="{ name: 'VendorDetails', params: { id: product.vendor?._id || '' }}"
                class="text-primary-400 hover:text-primary-300 mt-1 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              {{ product.vendorName }}
            </router-link>
          </div>

          <div class="mt-4 lg:mt-0 flex flex-col items-start lg:items-end">
            <div class="flex space-x-4">
              <div class="bg-danger-500/10 px-4 py-2 rounded-lg border border-danger-500/30">
                <div class="text-sm text-gray-400">CVEs</div>
                <div class="text-xl font-bold text-white">{{ product.cveCount || 0 }}</div>
              </div>
            </div>
            <div class="text-sm text-gray-400 mt-2">
              Last Updated: <span class="text-white">{{ formatDate(product.lastSeen) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Severity Distribution & Timeline -->
        <div class="space-y-6 lg:col-span-2">
          <!-- CVE Severity Distribution -->
          <div v-if="stats" class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">CVE Severity Distribution</h2>
            </div>
            <div class="p-5">
              <SeverityDistribution :data="stats.severityDistribution"/>
              <div class="mt-4 text-center text-sm text-gray-400">
                Average CVSS Score: <span class="text-white font-medium">{{ stats.avgCvssScore }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: CVE List -->
        <div class="space-y-6">
          <!-- CVE List -->
          <div class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white">CVEs</h2>
              <router-link
                  :to="{ name: 'CveExplorer', query: { product: product.name, vendor: product.vendorName } }"
                  class="text-sm text-primary-400 hover:text-primary-300"
              >
                View All
              </router-link>
            </div>
            <div v-if="cvesLoading" class="p-5 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
            <div v-else-if="cves.length === 0" class="p-5 text-center text-gray-400">
              No CVEs found for this product.
            </div>
            <div v-else class="divide-y divide-dark-500">
              <router-link
                  v-for="cve in cves"
                  :key="cve.cveId"
                  :to="{ name: 'CveDetails', params: { id: cve.cveId }}"
                  class="block p-4 hover:bg-dark-500 transition-colors"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div
                        class="w-3 h-3 rounded-full"
                        :class="getSeverityClass(cve.severity)"
                    ></div>
                  </div>
                  <div class="ml-3">
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <div class="text-primary-400 font-mono font-medium">{{ cve.cveId }}</div>
                      <div class="text-sm text-gray-400 mt-1 sm:mt-0">
                        {{ formatDate(cve.publishedDate) }}
                      </div>
                    </div>
                    <p class="mt-1 text-sm text-gray-300 line-clamp-2">
                      {{ cve.description }}
                    </p>
                    <div v-if="cve.cvssScore" class="mt-2">
                      <CveSeverityIndicator :score="cve.cvssScore" :show-text="true" :show-score="true"/>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
            <div v-if="cves.length > 0" class="p-4 border-t border-dark-500 flex justify-center">
              <button
                  @click="loadMoreCVEs"
                  class="px-4 py-1 text-sm text-primary-400 hover:text-primary-300 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 transition"
                  :disabled="cvesLoading || currentCVEPage >= totalCVEPages"
                  :class="{'opacity-50 cursor-not-allowed': cvesLoading || currentCVEPage >= totalCVEPages}"
              >
                {{ cvesLoading ? 'Loading...' : 'Load More CVEs' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'; // Import onBeforeUnmount and watch
import {useRoute} from 'vue-router';
import {format} from 'date-fns';
import Chart from 'chart.js/auto';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import SeverityDistribution from '../components/dashboard/SeverityDistribution.vue';
import CveSeverityIndicator from '../components/cve/CveSeverityIndicator.vue';
import productService from '../services/productService';
import cveService from '../services/cveService';

export default {
  name: 'ProductDetails',
  components: {
    LoadingSpinner,
    SeverityDistribution,
    CveSeverityIndicator,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const product = ref({});
    const stats = ref(null);
    const productVersions = ref(null);
    const loading = ref(true);
    const error = ref(false);
    const timelineChart = ref(null);
    const canvasRef = ref(null); // Ref for the canvas element

    // CVEs state
    const cves = ref([]);
    const cvesLoading = ref(false);
    const currentCVEPage = ref(1);
    const totalCVEPages = ref(1);
    console.log(stats)

    const fetchProduct = async (productId) => {
      loading.value = true;
      error.value = false;

      try {
        const {data} = await productService.getProductById(productId);
        product.value = data;

        // Fetch product stats
        const statsResponse = await productService.getProductCVEStats(productId);
        stats.value = statsResponse.data;

        // Fetch product versions
        const versionsResponse = await productService.getProductVersions(productId);
        productVersions.value = versionsResponse.data;


        // Fetch product CVEs
        fetchProductCVEs(productId);
      } catch (err) {
        console.error('Error fetching product details:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    const fetchProductCVEs = async (productId) => {
      cvesLoading.value = true;
      try {
        const {data} = await productService.getProductCVEs(
            productId,
            currentCVEPage.value,
            5
        );

        if (currentCVEPage.value === 1) {
          cves.value = data.cves;
        } else {
          cves.value = [...cves.value, ...data.cves];
        }

        totalCVEPages.value = data.pagination.totalPages;
      } catch (err) {
        console.error('Error fetching product CVEs:', err);
      } finally {
        cvesLoading.value = false;
      }
    };

    const loadMoreCVEs = () => {
      if (currentCVEPage.value < totalCVEPages.value) {
        currentCVEPage.value++;
        const productId = props.id || route.params.id;
        fetchProductCVEs(productId);
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown';
      try {
        return format(new Date(dateString), 'MMM d, yyyy'); // Ensure year is included
      } catch (e) {
        return 'Invalid date';
      }
    };

    const getSeverityClass = (severity) => {
      switch (severity) {
        case 'CRITICAL':
          return 'bg-danger-500';
        case 'HIGH':
          return 'bg-warning-500';
        case 'MEDIUM':
          return 'bg-orange-500';
        case 'LOW':
          return 'bg-success-500';
        default:
          return 'bg-gray-500';
      }
    };

    onMounted(() => {
      const productId = props.id || route.params.id;
      fetchProduct(productId);
    });

    // Watch for changes in the route params (if the component is reused for different products)
    watch(
        () => route.params.id,
        (newId) => {
          if (newId) {
            // Destroy the old chart before fetching data for the new product
            currentCVEPage.value = 1; // Reset CVE pagination
            cves.value = [];
            fetchProduct(newId);
          }
        }
    );

    return {
      product,
      productVersions,
      stats,
      loading,
      error,
      cves,
      cvesLoading,
      currentCVEPage,
      totalCVEPages,
      formatDate,
      getSeverityClass,
      loadMoreCVEs,
    };
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>