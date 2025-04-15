<template>
  <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
    <div class="p-5 border-b border-dark-500">
      <h3 class="text-lg font-medium text-white">Product Comparison</h3>
    </div>

    <div class="p-5">
      <!-- Product Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Product 1</label>
          <div class="relative">
            <input
                type="text"
                v-model="searchTerm1"
                @input="searchProducts(1)"
                @focus="showDropdown1 = true"
                @blur="hideDropdown1"
                placeholder="Search for a product..."
                class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
            />
            <div class="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Product 1 Search Results Dropdown -->
            <div v-if="showDropdown1 && searchResults1.length > 0" class="absolute z-10 mt-1 w-full bg-dark-700 border border-dark-400 rounded-md shadow-lg max-h-60 overflow-auto">
              <div
                  v-for="product in searchResults1"
                  :key="product._id"
                  class="p-2 hover:bg-dark-500 cursor-pointer"
                  @mousedown="selectProduct(product, 1)"
              >
                <div class="text-white">{{ product.name }}</div>
                <div class="text-xs text-gray-400">{{ product.vendorName }}</div>
              </div>
            </div>
          </div>

          <!-- Selected Product 1 Info -->
          <div v-if="selectedProduct1" class="mt-2">
            <div class="bg-dark-700 p-3 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-white font-medium">{{ selectedProduct1.name }}</div>
                  <div class="text-xs text-primary-400">{{ selectedProduct1.vendorName }}</div>
                </div>
                <div class="bg-danger-500/10 px-2 py-1 rounded text-xs text-danger-400">
                  {{ selectedProduct1.cveCount || 0 }} CVEs
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Product 2</label>
          <div class="relative">
            <input
                type="text"
                v-model="searchTerm2"
                @input="searchProducts(2)"
                @focus="showDropdown2 = true"
                @blur="hideDropdown2"
                placeholder="Search for a product..."
                class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
            />
            <div class="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Product 2 Search Results Dropdown -->
            <div v-if="showDropdown2 && searchResults2.length > 0" class="absolute z-10 mt-1 w-full bg-dark-700 border border-dark-400 rounded-md shadow-lg max-h-60 overflow-auto">
              <div
                  v-for="product in searchResults2"
                  :key="product._id"
                  class="p-2 hover:bg-dark-500 cursor-pointer"
                  @mousedown="selectProduct(product, 2)"
              >
                <div class="text-white">{{ product.name }}</div>
                <div class="text-xs text-gray-400">{{ product.vendorName }}</div>
              </div>
            </div>
          </div>

          <!-- Selected Product 2 Info -->
          <div v-if="selectedProduct2" class="mt-2">
            <div class="bg-dark-700 p-3 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-white font-medium">{{ selectedProduct2.name }}</div>
                  <div class="text-xs text-primary-400">{{ selectedProduct2.vendorName }}</div>
                </div>
                <div class="bg-danger-500/10 px-2 py-1 rounded text-xs text-danger-400">
                  {{ selectedProduct2.cveCount || 0 }} CVEs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compare Button -->
      <div class="flex justify-center">
        <button
            @click="compareProducts"
            :disabled="!selectedProduct1 || !selectedProduct2 || loading"
            class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Comparing...
          </span>
          <span v-else>Compare Products</span>
        </button>
      </div>

      <!-- Comparison Results -->
      <div v-if="comparisonResults" class="mt-8">
        <h4 class="text-white font-medium mb-4">Comparison Results</h4>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-dark-700 p-4 rounded-lg">
            <div class="text-center">
              <div class="text-lg font-bold text-white">{{ selectedProduct1.name }}</div>
              <div class="text-xs text-primary-400 mb-4">{{ selectedProduct1.vendorName }}</div>

              <div class="flex justify-between mt-2">
                <div class="text-center">
                  <div class="text-sm text-gray-400">CVEs</div>
                  <div class="text-xl font-bold text-danger-400">{{ selectedProduct1.cveCount || 0 }}</div>
                </div>
                <div class="text-center">
                  <div class="text-sm text-gray-400">Avg CVSS</div>
                  <div class="text-xl font-bold" :class="getScoreColorClass(comparisonResults.product1.avgCvssScore)">
                    {{ comparisonResults.product1.avgCvssScore }}
                  </div>
                </div>
              </div>

              <!-- Severity Distribution for Product 1 -->
              <div class="mt-4">
                <div class="text-sm text-gray-400 mb-2 text-left">Severity Distribution</div>
                <div class="grid grid-cols-4 gap-2">
                  <div v-for="(type, index) in severityTypes" :key="index" class="text-center">
                    <div class="text-xl font-bold" :class="getSeverityTextClass(type)">
                      {{ comparisonResults.product1.severityDistribution[type] || 0 }}
                    </div>
                    <div class="text-xs text-gray-400">{{ type }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-dark-700 p-4 rounded-lg">
            <div class="text-center">
              <div class="text-lg font-bold text-white">{{ selectedProduct2.name }}</div>
              <div class="text-xs text-primary-400 mb-4">{{ selectedProduct2.vendorName }}</div>

              <div class="flex justify-between mt-2">
                <div class="text-center">
                  <div class="text-sm text-gray-400">CVEs</div>
                  <div class="text-xl font-bold text-danger-400">{{ selectedProduct2.cveCount || 0 }}</div>
                </div>
                <div class="text-center">
                  <div class="text-sm text-gray-400">Avg CVSS</div>
                  <div class="text-xl font-bold" :class="getScoreColorClass(comparisonResults.product2.avgCvssScore)">
                    {{ comparisonResults.product2.avgCvssScore }}
                  </div>
                </div>
              </div>

              <!-- Severity Distribution for Product 2 -->
              <div class="mt-4">
                <div class="text-sm text-gray-400 mb-2 text-left">Severity Distribution</div>
                <div class="grid grid-cols-4 gap-2">
                  <div v-for="(type, index) in severityTypes" :key="index" class="text-center">
                    <div class="text-xl font-bold" :class="getSeverityTextClass(type)">
                      {{ comparisonResults.product2.severityDistribution[type] || 0 }}
                    </div>
                    <div class="text-xs text-gray-400">{{ type }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Chart -->
        <div class="bg-dark-700 p-4 rounded-lg mt-6">
          <div class="text-sm text-gray-400 mb-4">Monthly CVE Trends</div>
          <div class="h-64">
            <canvas ref="comparisonChart"></canvas>
          </div>
        </div>

        <!-- Common Vulnerabilities -->
        <div class="bg-dark-700 p-4 rounded-lg mt-6">
          <div class="text-sm text-gray-400 mb-4">Common Vulnerabilities</div>

          <div v-if="comparisonResults.commonVulnerabilities.length === 0" class="text-center text-gray-400 py-4">
            No common vulnerabilities found between these products
          </div>

          <div v-else class="divide-y divide-dark-500">
            <div v-for="cve in comparisonResults.commonVulnerabilities" :key="cve.cveId" class="py-3">
              <router-link :to="{ name: 'CveDetails', params: { id: cve.cveId }}" class="text-primary-400 font-mono font-medium hover:text-primary-300">
                {{ cve.cveId }}
              </router-link>
              <p class="text-sm text-gray-300 mt-1">{{ cve.description }}</p>
              <div class="mt-2 flex items-center">
                <div
                    class="w-2 h-2 rounded-full mr-2"
                    :class="getSeverityBgClass(cve.severity || getSeverityFromScore(cve.cvssScore))"
                ></div>
                <span class="text-xs" :class="getSeverityTextClass(cve.severity || getSeverityFromScore(cve.cvssScore))">
                  {{ cve.severity || getSeverityFromScore(cve.cvssScore) }}
                </span>
                <span class="text-xs text-gray-400 ml-3" v-if="cve.cvssScore">
                  CVSS: {{ cve.cvssScore }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import productService from '../services/productService.js';

export default {
  name: 'ProductComparison',
  setup() {
    const searchTerm1 = ref('');
    const searchTerm2 = ref('');
    const searchResults1 = ref([]);
    const searchResults2 = ref([]);
    const showDropdown1 = ref(false);
    const showDropdown2 = ref(false);
    const selectedProduct1 = ref(null);
    const selectedProduct2 = ref(null);
    const loading = ref(false);
    const comparisonResults = ref(null);
    const comparisonChart = ref(null);

    const severityTypes = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

    let searchTimeout1 = null;
    let searchTimeout2 = null;
    let chart = null;

    const searchProducts = (productNum) => {
      const searchTerm = productNum === 1 ? searchTerm1.value : searchTerm2.value;

      if (searchTerm.length < 2) {
        if (productNum === 1) searchResults1.value = [];
        else searchResults2.value = [];
        return;
      }

      // Clear existing timeout
      if (productNum === 1) {
        clearTimeout(searchTimeout1);
      } else {
        clearTimeout(searchTimeout2);
      }

      // Set new timeout for debounce
      const timeout = setTimeout(async () => {
        try {
          const { data } = await productService.searchProducts(searchTerm, 1, 10);

          if (productNum === 1) {
            searchResults1.value = data.products;
          } else {
            searchResults2.value = data.products;
          }
        } catch (error) {
          console.error('Error searching products:', error);
          if (productNum === 1) searchResults1.value = [];
          else searchResults2.value = [];
        }
      }, 300);

      if (productNum === 1) {
        searchTimeout1 = timeout;
      } else {
        searchTimeout2 = timeout;
      }
    };

    const selectProduct = (product, productNum) => {
      if (productNum === 1) {
        selectedProduct1.value = product;
        searchTerm1.value = product.name;
      } else {
        selectedProduct2.value = product;
        searchTerm2.value = product.name;
      }

      // Reset comparison results when selection changes
      comparisonResults.value = null;
      if (chart) {
        chart.destroy();
        chart = null;
      }
    };

    const hideDropdown1 = () => {
      setTimeout(() => {
        showDropdown1.value = false;
      }, 200);
    };

    const hideDropdown2 = () => {
      setTimeout(() => {
        showDropdown2.value = false;
      }, 200);
    };

    const compareProducts = async () => {
      if (!selectedProduct1.value || !selectedProduct2.value) return;

      loading.value = true;

      try {
        // Fetch stats for both products
        const [stats1, stats2] = await Promise.all([
          productService.getProductCVEStats(selectedProduct1.value._id),
          productService.getProductCVEStats(selectedProduct2.value._id)
        ]);

        // Fetch CVEs for both products to find common vulnerabilities
        const [cves1, cves2] = await Promise.all([
          productService.getProductCVEs(selectedProduct1.value._id, 1, 100),
          productService.getProductCVEs(selectedProduct2.value._id, 1, 100)
        ]);

        // Process data
        const product1Data = stats1.data;
        const product2Data = stats2.data;

        // Find common vulnerabilities
        const product1CVEs = cves1.data.cves;
        const product2CVEs = cves2.data.cves;

        const cveMap = new Map();
        product1CVEs.forEach(cve => {
          cveMap.set(cve.cveId, cve);
        });

        const commonVulnerabilities = product2CVEs.filter(cve => cveMap.has(cve.cveId));

        // Create comparison result
        comparisonResults.value = {
          product1: product1Data,
          product2: product2Data,
          commonVulnerabilities
        };

        // Initialize chart
        initComparisonChart();
      } catch (error) {
        console.error('Error comparing products:', error);
      } finally {
        loading.value = false;
      }
    };

    const initComparisonChart = () => {
      if (!comparisonResults.value) return;

      // Destroy existing chart if it exists
      if (chart) {
        chart.destroy();
      }

      setTimeout(() => {
        const ctx = document.querySelector('canvas').getContext('2d');

        // Process timeline data
        const product1Timeline = comparisonResults.value.product1.cveTimeline || [];
        const product2Timeline = comparisonResults.value.product2.cveTimeline || [];

        // Combine months from both timelines
        const allMonths = [...new Set([
          ...product1Timeline.map(item => item.month),
          ...product2Timeline.map(item => item.month)
        ])].sort();

        // Create maps for easy lookup
        const product1Map = new Map(product1Timeline.map(item => [item.month, item.count]));
        const product2Map = new Map(product2Timeline.map(item => [item.month, item.count]));

        // Prepare chart data
        const chartData = allMonths.map(month => ({
          month,
          [selectedProduct1.value.name]: product1Map.get(month) || 0,
          [selectedProduct2.value.name]: product2Map.get(month) || 0
        }));

        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData.map(item => item.month),
            datasets: [
              {
                label: selectedProduct1.value.name,
                data: chartData.map(item => item[selectedProduct1.value.name]),
                backgroundColor: 'rgba(55, 195, 209, 0.2)',
                borderColor: 'rgba(55, 195, 209, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 4
              },
              {
                label: selectedProduct2.value.name,
                data: chartData.map(item => item[selectedProduct2.value.name]),
                backgroundColor: 'rgba(145, 126, 255, 0.2)',
                borderColor: 'rgba(145, 126, 255, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
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
                },
                title: {
                  display: true,
                  text: 'Number of CVEs',
                  color: '#CCD0DB'
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

    const getScoreColorClass = (score) => {
      if (!score) return 'text-gray-400';

      const numScore = parseFloat(score);
      if (numScore >= 9.0) return 'text-danger-400';
      if (numScore >= 7.0) return 'text-warning-400';
      if (numScore >= 4.0) return 'text-orange-400';
      return 'text-success-400';
    };

    const getSeverityTextClass = (severity) => {
      switch(severity) {
        case 'CRITICAL': return 'text-danger-400';
        case 'HIGH': return 'text-warning-400';
        case 'MEDIUM': return 'text-orange-400';
        case 'LOW': return 'text-success-400';
        default: return 'text-gray-400';
      }
    };

    const getSeverityBgClass = (severity) => {
      switch(severity) {
        case 'CRITICAL': return 'bg-danger-500';
        case 'HIGH': return 'bg-warning-500';
        case 'MEDIUM': return 'bg-orange-500';
        case 'LOW': return 'bg-success-500';
        default: return 'bg-gray-500';
      }
    };

    const getSeverityFromScore = (score) => {
      if (!score) return 'UNKNOWN';

      const numScore = parseFloat(score);
      if (numScore >= 9.0) return 'CRITICAL';
      if (numScore >= 7.0) return 'HIGH';
      if (numScore >= 4.0) return 'MEDIUM';
      if (numScore > 0) return 'LOW';
      return 'NONE';
    };

    return {
      searchTerm1,
      searchTerm2,
      searchResults1,
      searchResults2,
      showDropdown1,
      showDropdown2,
      selectedProduct1,
      selectedProduct2,
      loading,
      comparisonResults,
      comparisonChart,
      severityTypes,
      searchProducts,
      selectProduct,
      hideDropdown1,
      hideDropdown2,
      compareProducts,
      getScoreColorClass,
      getSeverityTextClass,
      getSeverityBgClass,
      getSeverityFromScore
    };
  }
};
</script>