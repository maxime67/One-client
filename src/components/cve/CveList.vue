<template>
  <div>
    <!-- Sorting and View Options -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 bg-dark-600 p-4 rounded-lg border border-primary-500/20">
      <div class="mb-3 sm:mb-0">
        <p class="text-gray-400 text-sm">
          {{ totalItems }} results found
        </p>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Sort By -->
        <div class="flex items-center">
          <label for="sortBy" class="text-sm text-gray-400 mr-2">Sort by</label>
          <select
              id="sortBy"
              v-model="sortBy"
              @change="handleSortChange"
              class="bg-dark-700 border border-dark-400 text-white rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
          >
            <option value="publishedDate">Published Date</option>
            <option value="cvssScore">CVSS Score</option>
            <option value="cveId">CVE ID</option>
          </select>
        </div>

        <!-- Sort Order -->
        <button
            @click="toggleSortOrder"
            class="bg-dark-700 border border-dark-400 text-white rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
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

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="cves.length === 0" class="bg-dark-600 border border-primary-500/20 rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-medium text-white mb-2">No CVEs Found</h3>
      <p class="text-gray-400">Try adjusting your filters or search criteria.</p>
    </div>

    <!-- CVE Items -->
    <div v-else class="space-y-4">
      <div
          v-for="cve in cves"
          :key="cve.cveId"
          class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-glow-light"
      >
        <div class="p-5">
          <div class="flex flex-col md:flex-row md:items-start">
            <!-- CVE ID and Details -->
            <div class="flex-1">
              <div class="flex items-center">
                <router-link
                    :to="{ name: 'CveDetails', params: { id: cve.cveId }}"
                    class="text-primary-400 hover:text-primary-300 font-mono text-lg font-medium"
                >
                  {{ cve.cveId }}
                </router-link>

                <!-- Published Date Badge -->
                <span class="ml-3 text-xs text-gray-400" v-if="cve.publishedDate">
                  {{ formatDate(cve.publishedDate) }}
                </span>
              </div>

              <!-- Description -->
              <p class="mt-2 text-gray-300 line-clamp-2">
                {{ cve.description }}
              </p>

              <!-- CWE IDs -->
              <div class="mt-3 flex flex-wrap gap-2" v-if="cve.problemType && cve.problemType.length > 0">
                <span
                    v-for="(problem, index) in cve.problemType"
                    :key="index"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-500/10 text-secondary-300 border border-secondary-500/30"
                >
                  {{ problem.cweId }}
                </span>
              </div>

              <!-- Affected Products/Vendors Preview -->
              <div class="mt-3 flex flex-wrap" v-if="cve.affectedProducts && cve.affectedProducts.length > 0">
                <div class="text-xs text-gray-400 mr-2">Affects:</div>
                <div class="flex flex-wrap gap-2">
                  <div
                      v-for="(product, index) in cve.affectedProducts.slice(0, 3)"
                      :key="index"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-500 text-gray-300"
                  >
                    {{ product.vendorName }}: {{ product.productName }}
                  </div>
                  <div
                      v-if="cve.affectedProducts.length > 3"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-500 text-gray-300"
                  >
                    +{{ cve.affectedProducts.length - 3 }} more
                  </div>
                </div>
              </div>
            </div>

            <!-- CVSS Score and Severity -->
            <div class="mt-4 md:mt-0 md:ml-6 md:w-48 flex flex-col items-start md:items-end">
              <div v-if="cve.cvssScore" class="mb-2">
                <CveSeverityIndicator
                    :score="cve.cvssScore"
                    :show-text="true"
                    :show-score="true"
                />
              </div>

              <div>
                <router-link
                    :to="{ name: 'CveDetails', params: { id: cve.cveId }}"
                    class="inline-flex items-center px-3 py-1.5 border border-primary-500/30 rounded-lg text-sm font-medium bg-primary-500/10 text-primary-300 hover:bg-primary-500/20 transition"
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import { ref, computed, watch } from 'vue';
import { format } from 'date-fns';
import CveSeverityIndicator from './CveSeverityIndicator.vue';

export default {
  name: 'CveList',
  components: {
    CveSeverityIndicator
  },
  props: {
    cves: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    },
    totalItems: {
      type: Number,
      default: 0
    },
    sortOptions: {
      type: Object,
      default: () => ({
        sortBy: 'publishedDate',
        sortOrder: 'desc'
      })
    }
  },
  emits: ['page-change', 'sort-change'],
  setup(props, { emit }) {
    const sortBy = ref(props.sortOptions.sortBy || 'publishedDate');
    const sortOrder = ref(props.sortOptions.sortOrder || 'desc');

    // Watch for external sort changes
    watch(() => props.sortOptions, (newOptions) => {
      if (newOptions.sortBy) sortBy.value = newOptions.sortBy;
      if (newOptions.sortOrder) sortOrder.value = newOptions.sortOrder;
    }, { deep: true });

    const formatDate = (dateString) => {
      try {
        return format(new Date(dateString), 'MMM d, yyyy');
      } catch (e) {
        return 'Unknown date';
      }
    };

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
      emit('sort-change', { sortBy: sortBy.value, sortOrder: sortOrder.value });
    };

    const handleSortChange = () => {
      emit('sort-change', { sortBy: sortBy.value, sortOrder: sortOrder.value });
    };

    const prevPage = () => {
      if (props.currentPage > 1) {
        emit('page-change', props.currentPage - 1);
      }
    };

    const nextPage = () => {
      if (props.currentPage < props.totalPages) {
        emit('page-change', props.currentPage + 1);
      }
    };

    const goToPage = (page) => {
      emit('page-change', page);
    };

    // Calculate pagination display logic
    const paginationRange = computed(() => {
      const range = [];
      const maxVisiblePages = 7; // Adjust based on your preference

      if (props.totalPages <= maxVisiblePages) {
        // Show all pages if total pages is less than maxVisiblePages
        for (let i = 1; i <= props.totalPages; i++) {
          range.push(i);
        }
      } else {
        // Always show first and last page, and some pages around current page
        range.push(1);

        const leftSide = Math.floor(maxVisiblePages / 2);
        const rightSide = maxVisiblePages - leftSide - 1;

        // Calculate start and end of the visible range
        let start = props.currentPage - leftSide;
        let end = props.currentPage + rightSide;

        // Adjust if range exceeds boundaries
        if (start <= 1) {
          start = 2;
          end = start + maxVisiblePages - 3;
        }

        if (end >= props.totalPages) {
          end = props.totalPages - 1;
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
        if (end < props.totalPages - 1) {
          range.push('...');
        }

        // Add last page if not already included
        if (props.totalPages > 1) {
          range.push(props.totalPages);
        }
      }

      return range;
    });

    return {
      sortBy,
      sortOrder,
      formatDate,
      toggleSortOrder,
      handleSortChange,
      prevPage,
      nextPage,
      goToPage,
      paginationRange
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