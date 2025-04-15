<template>
  <div>
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <p class="text-gray-400 mt-1">Overview of CVE metrics and recent activity</p>
    </header>

    <div v-if="loading">
      <LoadingSpinner />
    </div>

    <div v-else>
      <!-- Key Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatisticsCard
            title="Total CVEs"
            :value="formatNumber(stats.cve.total || 0)"
            subtitle="Tracked vulnerabilities"
            color="primary"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </template>
        </StatisticsCard>

        <StatisticsCard
            title="Critical Vulnerabilities"
            :value="formatNumber(stats.cve.bySeverity?.CRITICAL || 0)"
            subtitle="High-risk security issues"
            color="danger"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </template>
        </StatisticsCard>

        <StatisticsCard
            title="Total Vendors"
            :value="formatNumber(stats.vendor.total || 0)"
            subtitle="Tracked organizations"
            color="secondary"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </template>
        </StatisticsCard>

        <StatisticsCard
            title="Total Products"
            :value="formatNumber(stats.product.total || 0)"
            subtitle="Affected software & systems"
            color="warning"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </template>
        </StatisticsCard>
      </div>

      <!-- Charts & Data Section -->
      <div class="w-full mb-6">
        <SeverityDistribution :data="stats.cve.bySeverity || {}" />
<!--        <TimelineChart />-->
      </div>

      <!-- Recent Data Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent CVEs -->
        <div class="lg:col-span-2">
          <RecentCvesList :limit="5" />
        </div>

        <!-- Top Vendors & Products -->
        <div class="space-y-6">
          <!-- Top Vendors -->
          <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
            <div class="flex items-center justify-between p-5 border-b border-dark-500">
              <h3 class="text-lg font-medium text-white">Top Vendors</h3>
              <router-link to="/vendors" class="text-sm text-primary-400 hover:text-primary-300">
                View all →
              </router-link>
            </div>

            <div v-if="stats.vendor.topByCVE?.length" class="divide-y divide-dark-500">
              <router-link
                  v-for="vendor in stats.vendor.topByCVE.slice(0, 5)"
                  :key="vendor._id"
                  :to="{ name: 'VendorDetails', params: { id: vendor._id }}"
                  class="flex items-center justify-between p-4 hover:bg-dark-500 transition duration-150"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-secondary-500/20 flex items-center justify-center text-secondary-400">
                      {{ vendor.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-white">{{ vendor.name }}</div>
                    <div class="text-xs text-gray-400">{{ vendor.productCount || 0 }} products</div>
                  </div>
                </div>
                <div class="bg-danger-500/10 text-danger-400 px-2 py-1 rounded text-xs font-medium">
                  {{ vendor.cveCount || 0 }} CVEs
                </div>
              </router-link>
            </div>

            <div v-else class="p-5 text-center text-gray-400">
              No vendor data available.
            </div>
          </div>

          <!-- Top Products -->
          <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
            <div class="flex items-center justify-between p-5 border-b border-dark-500">
              <h3 class="text-lg font-medium text-white">Top Products</h3>
              <router-link to="/products" class="text-sm text-primary-400 hover:text-primary-300">
                View all →
              </router-link>
            </div>

            <div v-if="stats.product.topByCVE?.length" class="divide-y divide-dark-500">
              <router-link
                  v-for="product in stats.product.topByCVE.slice(0, 5)"
                  :key="product._id"
                  :to="{ name: 'ProductDetails', params: { id: product._id }}"
                  class="flex items-center justify-between p-4 hover:bg-dark-500 transition duration-150"
              >
                <div>
                  <div class="text-sm font-medium text-white">{{ product.name }}</div>
                  <div class="text-xs text-gray-400">{{ product.vendorName }}</div>
                </div>
                <div class="bg-danger-500/10 text-danger-400 px-2 py-1 rounded text-xs font-medium">
                  {{ product.cveCount || 0 }} CVEs
                </div>
              </router-link>
            </div>

            <div v-else class="p-5 text-center text-gray-400">
              No product data available.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import StatisticsCard from '../components/dashboard/StatisticsCard.vue';
import SeverityDistribution from '../components/dashboard/SeverityDistribution.vue';
// import TimelineChart from '../components/dashboard/TimelineChart.vue';
import RecentCvesList from '../components/dashboard/RecentCvesList.vue';
import cveService from '../services/cveService';
import vendorService from '../services/vendorService';
import productService from '../services/productService';

export default {
  name: 'Dashboard',
  components: {
    LoadingSpinner,
    StatisticsCard,
    SeverityDistribution,
    // TimelineChart,
    RecentCvesList
  },
  setup() {
    const loading = ref(true);
    const stats = ref({
      cve: {},
      vendor: {},
      product: {}
    });

    const fetchAllStats = async () => {
      loading.value = true;
      try {
        const [cveStats, vendorStats, productStats] = await Promise.all([
          cveService.getCVEStats(),
          vendorService.getVendorStats(),
          productService.getProductStats()
        ]);

        stats.value = {
          cve: cveStats.data,
          vendor: vendorStats.data,
          product: productStats.data
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        loading.value = false;
      }
    };

    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num);
    };

    onMounted(() => {
      fetchAllStats();
    });

    return {
      loading,
      stats,
      formatNumber
    };
  }
};
</script>