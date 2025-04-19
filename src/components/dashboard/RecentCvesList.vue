<template>
  <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
    <div class="flex items-center justify-between p-5 border-b border-dark-500">
      <h3 class="text-lg font-medium text-white">Recent CVEs</h3>
      <router-link to="/cves" class="text-sm text-primary-400 hover:text-primary-300">
        View all →
      </router-link>
    </div>

    <div class="p-5" v-if="loading">
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    </div>

    <div v-else-if="cves.length === 0" class="p-5 text-center text-gray-400">
      No CVE data available.
    </div>

    <div v-else>
      <div class="divide-y divide-dark-500">
        <div
            v-for="cve in cves"
            :key="cve.cveId"
            class="p-4 hover:bg-dark-500 transition duration-150"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <div
                  class="w-3 h-3 rounded-full"
                  :class="getSeverityClass(cve.severity)"
              ></div>
            </div>
            <div class="ml-3 flex-1">
              <div class="flex flex-col sm:flex-row sm:justify-between">
                <router-link
                    :to="{ name: 'CveDetails', params: { id: cve.cveId }}"
                    class="text-primary-400 hover:text-primary-300 font-mono font-medium"
                >
                  {{ cve.cveId }}
                </router-link>
                <div class="text-sm text-gray-400 mt-1 sm:mt-0">
                  {{ formatDate(cve.publishedDate) }}
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-300 line-clamp-2">
                {{ cve.description }}
              </p>
              <div class="mt-2 flex flex-wrap gap-12">
                <div v-if="cve.cvssScore" class="flex items-center">
                  <CveSeverityIndicator :score="cve.cvssScore" :show-text="false" />
                </div>

                <div v-if="cve.affectedProducts && cve.affectedProducts.length > 0" class="text-xs text-gray-400">
                  {{ cve.affectedProducts.length }} affected product{{ cve.affectedProducts.length !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-dark-500 flex justify-center">
        <button
            @click="loadMore"
            class="px-4 py-1 text-sm text-primary-400 hover:text-primary-300 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 transition"
            :disabled="!hasMoreToLoad"
            :class="{'opacity-50 cursor-not-allowed': !hasMoreToLoad}"
        >
          {{ hasMoreToLoad ? 'Load More' : 'No More CVEs' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import cveService from '../../services/cveService';
import CveSeverityIndicator from '../cve/CveSeverityIndicator.vue';

export default {
  name: 'RecentCvesList',
  components: {
    CveSeverityIndicator
  },
  props: {
    limit: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const cves = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const totalPages = ref(1);

    const hasMoreToLoad = computed(() => {
      return currentPage.value < totalPages.value;
    });

    const fetchCVEs = async (page = 1, append = false) => {
      loading.value = true;
      try {
        const { data } = await cveService.getAllCVEs(page, props.limit, 'publishedDate', 'desc');

        if (append) {
          cves.value = [...cves.value, ...data.cves];
        } else {
          cves.value = data.cves;
        }

        totalPages.value = data.pagination.totalPages;
      } catch (error) {
        console.error('Error fetching CVEs:', error);
      } finally {
        loading.value = false;
      }
    };

    const loadMore = async () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        await fetchCVEs(currentPage.value, true);
      }
    };

    const formatDate = (dateString) => {
      try {
        return format(new Date(dateString), 'MMM d, yyyy');
      } catch (e) {
        return 'Unknown date';
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

    const getScoreTextClass = (score) => {
      if (score >= 9.0) return 'text-danger-400';
      if (score >= 7.0) return 'text-warning-400';
      if (score >= 4.0) return 'text-orange-400';
      return 'text-success-400';
    };

    onMounted(() => {
      fetchCVEs();
    });

    return {
      cves,
      loading,
      hasMoreToLoad,
      loadMore,
      formatDate,
      getSeverityClass,
      getScoreTextClass
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