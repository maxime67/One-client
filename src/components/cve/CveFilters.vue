<template>
  <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
    <div class="p-5 border-b border-dark-500">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-white">Filters</h3>
        <button
            @click="resetFilters"
            class="text-sm text-primary-400 hover:text-primary-300"
        >
          Reset
        </button>
      </div>
    </div>

    <div class="p-5 space-y-5">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-400 mb-1">
          Search Term
        </label>
        <div class="relative">
          <input
              type="text"
              id="search"
              v-model="localFilters.search"
              @input="updateFilters"
              placeholder="Search CVEs by ID or description..."
              class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
          />
          <div class="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Severity -->
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">
          Severity
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
              v-for="option in severityOptions"
              :key="option.value"
              @click="toggleSeverity(option.value)"
              class="py-2 px-3 rounded-lg text-sm flex items-center justify-center transition"
              :class="[
              localFilters.severity === option.value
                ? `bg-${option.color}-500/20 text-${option.color}-300 border border-${option.color}-500/30`
                : 'bg-dark-700 text-gray-400 border border-dark-400 hover:border-primary-400 hover:text-white'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- CVSS Score Range -->
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">
          CVSS Score Range
        </label>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="minCvss" class="block text-xs text-gray-500 mb-1">Min</label>
            <input
                type="number"
                id="minCvss"
                v-model.number="localFilters.minCvss"
                @change="updateFilters"
                min="0"
                max="10"
                step="0.1"
                class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
            />
          </div>
          <div>
            <label for="maxCvss" class="block text-xs text-gray-500 mb-1">Max</label>
            <input
                type="number"
                id="maxCvss"
                v-model.number="localFilters.maxCvss"
                @change="updateFilters"
                min="0"
                max="10"
                step="0.1"
                class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
            />
          </div>
        </div>
      </div>

      <!-- Date Range -->
<!--      <div>-->
<!--        <label class="block text-sm font-medium text-gray-400 mb-1">-->
<!--          Published Date Range-->
<!--        </label>-->
<!--        <div class="grid grid-cols-2 gap-4">-->
<!--          <div>-->
<!--            <label for="startDate" class="block text-xs text-gray-500 mb-1">From</label>-->
<!--            <input-->
<!--                type="date"-->
<!--                id="startDate"-->
<!--                v-model="localFilters.startDate"-->
<!--                @change="updateFilters"-->
<!--                class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"-->
<!--            />-->
<!--          </div>-->
<!--          <div>-->
<!--            <label for="endDate" class="block text-xs text-gray-500 mb-1">To</label>-->
<!--            <input-->
<!--                type="date"-->
<!--                id="endDate"-->
<!--                v-model="localFilters.endDate"-->
<!--                @change="updateFilters"-->
<!--                class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <!-- Advanced Filters Toggle -->
      <div>
        <button
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="flex items-center text-sm text-primary-400 hover:text-primary-300"
        >
          <span>{{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters</span>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1 transition-transform duration-200"
              :class="showAdvancedFilters ? 'rotate-180' : ''"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Advanced Filters -->
      <div v-if="showAdvancedFilters" class="space-y-4 pt-2 border-t border-dark-500">
        <!-- Vendor -->
        <div>
          <label for="vendor" class="block text-sm font-medium text-gray-400 mb-1">
            Vendor
          </label>
          <input
              type="text"
              id="vendor"
              v-model="localFilters.vendor"
              @input="updateFilters"
              placeholder="Filter by vendor name..."
              class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
          />
        </div>

        <!-- Product -->
        <div>
          <label for="product" class="block text-sm font-medium text-gray-400 mb-1">
            Product
          </label>
          <input
              type="text"
              id="product"
              v-model="localFilters.product"
              @input="updateFilters"
              placeholder="Filter by product name..."
              class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
          />
        </div>

        <!-- CWE ID -->
        <div>
          <label for="cweId" class="block text-sm font-medium text-gray-400 mb-1">
            CWE ID
          </label>
          <input
              type="text"
              id="cweId"
              v-model="localFilters.cweId"
              @input="updateFilters"
              placeholder="e.g. CWE-79, CWE-89..."
              class="w-full bg-dark-700 border border-dark-400 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400"
          />
        </div>
      </div>

      <!-- Apply Filters Button -->
      <div class="pt-3">
        <button
            @click="applyFilters"
            class="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue';

export default {
  name: 'CveFilters',
  props: {
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:filters', 'apply'],
  setup(props, { emit }) {
    const localFilters = reactive({
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

    const showAdvancedFilters = ref(false);

    const severityOptions = [
      { label: 'All', value: '', color: 'gray' },
      { label: 'Critical', value: 'CRITICAL', color: 'danger' },
      { label: 'High', value: 'HIGH', color: 'warning' },
      { label: 'Medium', value: 'MEDIUM', color: 'orange' },
      { label: 'Low', value: 'LOW', color: 'success' }
    ];

    // Initialize local filters from props
    onMounted(() => {
      Object.keys(localFilters).forEach(key => {
        if (props.filters[key] !== undefined) {
          localFilters[key] = props.filters[key];
        }
      });

      // Check if advanced filters are being used
      const advancedKeys = ['vendor', 'product', 'cweId'];
      const hasAdvancedFilters = advancedKeys.some(key =>
          props.filters[key] !== undefined && props.filters[key] !== ''
      );

      if (hasAdvancedFilters) {
        showAdvancedFilters.value = true;
      }
    });

    // Watch for external filter changes
    watch(() => props.filters, (newFilters) => {
      Object.keys(localFilters).forEach(key => {
        if (newFilters[key] !== undefined) {
          localFilters[key] = newFilters[key];
        }
      });
    }, { deep: true });

    const updateFilters = () => {
      emit('update:filters', { ...localFilters });
    };

    const applyFilters = () => {
      emit('apply', { ...localFilters });
    };

    const toggleSeverity = (severity) => {
      localFilters.severity = localFilters.severity === severity ? '' : severity;
      updateFilters();
    };

    const resetFilters = () => {
      Object.keys(localFilters).forEach(key => {
        if (typeof localFilters[key] === 'string') {
          localFilters[key] = '';
        } else if (typeof localFilters[key] === 'number') {
          localFilters[key] = null;
        }
      });

      updateFilters();
      applyFilters();
    };

    return {
      localFilters,
      showAdvancedFilters,
      severityOptions,
      updateFilters,
      applyFilters,
      toggleSeverity,
      resetFilters
    };
  }
};
</script>