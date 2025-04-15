<template>
  <div>
    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center py-10">
      <LoadingSpinner />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-dark-600 border border-danger-500/20 rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-danger-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="text-lg font-medium text-white mb-2">Vendor Not Found</h3>
      <p class="text-gray-400 mb-6">The requested vendor could not be found.</p>
      <router-link to="/vendors" class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition">
        Back to Vendor Explorer
      </router-link>
    </div>

    <!-- Vendor Details Content -->
    <div v-else>
      <!-- Header with Name and Basic Info -->
      <div class="bg-dark-600 border border-primary-500/20 rounded-xl p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <div class="flex items-center">
              <router-link
                  to="/vendors"
                  class="text-primary-400 hover:text-primary-300 mr-2"
                  title="Back to Vendor Explorer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </router-link>
              <h1 class="text-2xl font-bold text-white">{{ vendor.name }}</h1>
            </div>
            <p class="text-gray-400 mt-1">
              First seen: <span class="text-white">{{ formatDate(vendor.firstSeen) }}</span>
              <span v-if="vendor.lastSeen">&nbsp;•&nbsp; Last updated: <span class="text-white">{{ formatDate(vendor.lastSeen) }}</span></span>
            </p>
          </div>

          <div class="mt-4 lg:mt-0 flex flex-col items-start lg:items-end">
            <div class="flex space-x-4">
              <div class="bg-primary-500/10 px-4 py-2 rounded-lg border border-primary-500/30">
                <div class="text-sm text-gray-400">CVEs</div>
                <div class="text-xl font-bold text-white">{{ vendor.cveCount || 0 }}</div>
              </div>
              <div class="bg-secondary-500/10 px-4 py-2 rounded-lg border border-secondary-500/30">
                <div class="text-sm text-gray-400">Products</div>
                <div class="text-xl font-bold text-white">{{ vendor.productCount || 0 }}</div>
              </div>
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
              <SeverityDistribution :data="stats.severityDistribution" />
              <div class="mt-4 text-center text-sm text-gray-400">
                Average CVSS Score: <span class="text-white font-medium">{{ stats.avgCvssScore }}</span>
              </div>
            </div>
          </div>

          <!-- CVE Timeline -->
          <div v-if="stats && stats.cveTimeline" class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">CVE Timeline (Last 12 Months)</h2>
            </div>
            <div class="p-5 h-80">
              <canvas ref="timelineChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Right Column: Products List -->
        <div class="space-y-6">
          <!-- Products List -->
          <div class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white">Products</h2>
              <button
                  v-if="products.length > displayLimit && !showAllProducts"
                  @click="showAllProducts = true"
                  class="text-sm text-primary-400 hover:text-primary-300"
              >
                Show All ({{ products.length }})
              </button>
              <button
                  v-else-if="products.length > displayLimit && showAllProducts"
                  @click="showAllProducts = false"
                  class="text-sm text-primary-400 hover:text-primary-300"
              >
                Show Less
              </button>
            </div>
            <div v-if="productsLoading" class="p-5 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
            <div v-else-if="products.length === 0" class="p-5 text-center text-gray-400">
              No products found for this vendor.
            </div>
            <div v-else class="divide-y divide-dark-500">
              <router-link
                  v-for="product in displayedProducts"
                  :key="product._id"
                  :to="{ name: 'ProductDetails', params: { id: product._id }}"
                  class="block p-4 hover:bg-dark-500 transition-colors"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-medium text-white">{{ product.name }}</div>
                    <div class="text-xs text-gray-400 mt-1">
                      <span v-if="product.versions && product.versions.length">
                        {{ product.versions.length }} versions
                      </span>
                      <span v-if="product.lastSeen"> • Last updated: {{ formatDate(product.lastSeen) }}</span>
                    </div>
                  </div>
                  <div class="bg-danger-500/10 text-danger-400 px-2.5 py-1 rounded text-xs font-medium">
                    {{ product.cveCount || 0 }} CVEs
                  </div>
                </div>
              </router-link>
            </div>
            <div v-if="totalPages > 1" class="p-4 border-t border-dark-500 flex justify-center">
              <button
                  @click="loadMoreProducts"
                  class="px-4 py-1 text-sm text-primary-400 hover:text-primary-300 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 transition"
                  :disabled="productsLoading || currentProductPage >= totalPages"
                  :class="{'opacity-50 cursor-not-allowed': productsLoading || currentProductPage >= totalPages}"
              >
                {{ productsLoading ? 'Loading...' : 'Load More Products' }}
              </button>
            </div>
          </div>

          <!-- Recent CVEs -->
          <div class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">Recent CVEs</h2>
            </div>
            <div v-if="cvesLoading" class="p-5 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
            <div v-else-if="cves.length === 0" class="p-5 text-center text-gray-400">
              No CVEs found for this vendor.
            </div>
            <div v-else class="divide-y divide-dark-500">
              <router-link
                  v-for="cve in cves.slice(0, 5)"
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
                  </div>
                </div>
              </router-link>
            </div>
            <div v-if="cves.length > 5" class="p-4 border-t border-dark-500 text-center">
              <router-link
                  :to="{ name: 'CveExplorer', query: { vendor: vendor.name } }"
                  class="text-sm text-primary-400 hover:text-primary-300"
              >
                View all {{ vendor.cveCount }} CVEs →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import Chart from 'chart.js/auto';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import SeverityDistribution from '../components/dashboard/SeverityDistribution.vue';
import vendorService from '../services/vendorService';
import cveService from '../services/cveService';

export default {
  name: 'VendorDetails',
  components: {
    LoadingSpinner,
    SeverityDistribution
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const vendor = ref({});
    const stats = ref(null);
    const loading = ref(true);
    const error = ref(false);
    const timelineChart = ref(null);

    // Products state
    const products = ref([]);
    const productsLoading = ref(false);
    const currentProductPage = ref(1);
    const totalPages = ref(1);
    const displayLimit = ref(5);
    const showAllProducts = ref(false);

    // CVEs state
    const cves = ref([]);
    const cvesLoading = ref(false);

    const displayedProducts = computed(() => {
      if (showAllProducts.value) {
        return products.value;
      } else {
        return products.value.slice(0, displayLimit.value);
      }
    });

    const fetchVendor = async () => {
      loading.value = true;
      error.value = false;

      try {
        const vendorId = props.id || route.params.id;
        const { data } = await vendorService.getVendorById(vendorId);
        vendor.value = data;

        // Fetch stats for this vendor
        const statsResponse = await vendorService.getVendorCVEStats(vendorId);
        stats.value = statsResponse.data;

        // Initialize chart when stats are available
        if (stats.value && stats.value.cveTimeline) {
          initTimelineChart();
        }

        // Fetch vendor products and CVEs
        fetchVendorProducts();
        fetchVendorCVEs();
      } catch (err) {
        console.error('Error fetching vendor details:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    const fetchVendorProducts = async () => {
      productsLoading.value = true;
      try {
        const vendorId = props.id || route.params.id;
        const { data } = await vendorService.getVendorProducts(vendorId, currentProductPage.value, 10);

        if (currentProductPage.value === 1) {
          products.value = data.products;
        } else {
          products.value = [...products.value, ...data.products];
        }

        totalPages.value = data.pagination.totalPages;
      } catch (err) {
        console.error('Error fetching vendor products:', err);
      } finally {
        productsLoading.value = false;
      }
    };

    const loadMoreProducts = () => {
      if (currentProductPage.value < totalPages.value) {
        currentProductPage.value++;
        fetchVendorProducts();
      }
    };

    const fetchVendorCVEs = async () => {
      cvesLoading.value = true;
      try {
        const vendorId = props.id || route.params.id;
        const { data } = await cveService.getCVEsByVendor(vendorId, 1, 5);
        cves.value = data.cves;
      } catch (err) {
        console.error('Error fetching vendor CVEs:', err);
      } finally {
        cvesLoading.value = false;
      }
    };

    const initTimelineChart = () => {
      if (!stats.value || !stats.value.cveTimeline) return;

      setTimeout(() => {
        const ctx = document.querySelector('canvas').getContext('2d');

        const timelineData = stats.value.cveTimeline;
        const labels = timelineData.map(item => item.month);
        const data = timelineData.map(item => item.count);

        timelineChart.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'CVEs per Month',
              data: data,
              backgroundColor: 'rgba(55, 195, 209, 0.6)',
              borderColor: 'rgba(55, 195, 209, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#CCD0DB'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 20, 75, 0.9)',
                padding: 12
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                  color: '#99A1B7'
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                  color: '#99A1B7'
                }
              }
            }
          }
        });
      }, 100);
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown';
      try {
        return format(new Date(dateString), 'MMM d, yyyy');
      } catch (e) {
        return 'Invalid date';
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

    onMounted(() => {
      fetchVendor();
    });

    return {
      vendor,
      stats,
      loading,
      error,
      products,
      productsLoading,
      cves,
      cvesLoading,
      displayedProducts,
      displayLimit,
      showAllProducts,
      totalPages,
      currentProductPage,
      formatDate,
      getSeverityClass,
      loadMoreProducts
    };
  }
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