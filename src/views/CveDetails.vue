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
      <h3 class="text-lg font-medium text-white mb-2">CVE Not Found</h3>
      <p class="text-gray-400 mb-6">The requested CVE could not be found.</p>
      <router-link to="/cves" class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition">
        Back to CVE Explorer
      </router-link>
    </div>

    <!-- CVE Details Content -->
    <div v-else>
      <!-- Header with ID and Basic Info -->
      <div class="bg-dark-600 border border-primary-500/20 rounded-xl p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <div class="flex items-center">
              <router-link
                  to="/cves"
                  class="text-primary-400 hover:text-primary-300 mr-2"
                  title="Back to CVE Explorer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </router-link>
              <h1 class="text-2xl font-mono font-bold text-white">{{ cve.cveId }}</h1>
              <span
                  v-if="cve.state"
                  class="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStateClass(cve.state)"
              >
                {{ cve.state }}
              </span>
            </div>
            <p class="text-gray-400 mt-1">
              Published: <span class="text-white">{{ formatDate(cve.publishedDate) }}</span>
              <span v-if="cve.lastModifiedDate">&nbsp;•&nbsp; Last Updated: <span class="text-white">{{ formatDate(cve.lastModifiedDate) }}</span></span>
            </p>
          </div>

          <div class="mt-4 lg:mt-0">
            <div class="flex flex-col items-start lg:items-end">
              <div v-if="cve.cvssScore" class="mb-2">
                <CveSeverityIndicator
                    :score="cve.cvssScore"
                    :show-text="true"
                    :show-score="true"
                />
              </div>

              <div class="text-sm text-gray-400">
                Assigned by: <span class="text-white">{{ cve.assigner || 'Unknown' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Description & References -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description Section -->
          <div class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">Description</h2>
            </div>
            <div class="p-5">
              <p class="text-gray-300 whitespace-pre-line">{{ cve.description }}</p>
            </div>
          </div>

          <!-- Problem Type / CWE Section -->
          <div v-if="cve.problemType && cve.problemType.length > 0" class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">Problem Types</h2>
            </div>
            <div class="p-5">
              <ul class="space-y-3">
                <li v-for="(problem, index) in cve.problemType" :key="index" class="flex items-start">
                  <div class="flex-shrink-0 h-5 w-5 text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <div v-if="problem.cweId" class="text-white font-medium">
                      <a :href="`https://cwe.mitre.org/data/definitions/${problem.cweId.replace('CWE-', '')}.html`" target="_blank" class="text-primary-400 hover:text-primary-300">
                        {{ problem.cweId }}
                      </a>
                    </div>
                    <div v-if="problem.description" class="text-gray-300">{{ problem.description }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- References Section -->
          <div v-if="cve.references && cve.references.length > 0" class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">References</h2>
            </div>
            <div class="p-5">
              <ul class="space-y-3">
                <li v-for="(reference, index) in cve.references" :key="index" class="flex items-start">
                  <div class="flex-shrink-0 h-5 w-5 text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <a
                        :href="reference.url"
                        target="_blank"
                        class="text-primary-400 hover:text-primary-300 break-all"
                    >
                      {{ reference.name || reference.url }}
                    </a>
                    <div v-if="reference.refsource" class="text-sm text-gray-400 mt-1">
                      Source: {{ reference.refsource }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column: Affected Products and Metrics -->
        <div class="space-y-6">
          <!-- CVSS Metrics -->
          <div v-if="cve.cvssScore" class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">CVSS Metrics</h2>
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between mb-4">
                <div class="text-gray-400">Score:</div>
                <div class="text-xl font-bold" :class="getCvssScoreClass(cve.cvssScore)">
                  {{ cve.cvssScore.toFixed(1) }}
                </div>
              </div>

              <div class="flex items-center justify-between mb-4">
                <div class="text-gray-400">Severity:</div>
                <div class="px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getSeverityBadgeClass(cve.severity)">
                  {{ cve.severity || getSeverityFromScore(cve.cvssScore) }}
                </div>
              </div>

              <div class="mt-4">
                <CveSeverityIndicator :score="cve.cvssScore" :show-text="false" :show-score="false" vertical />
              </div>
            </div>
          </div>

          <!-- Affected Products -->
          <div v-if="cve.affectedProducts && cve.affectedProducts.length > 0" class="bg-dark-600 border border-primary-500/20 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-dark-500">
              <h2 class="text-lg font-medium text-white">Affected Products</h2>
            </div>
            <div class="p-5 space-y-4">
              <div v-for="(product, index) in cve.affectedProducts" :key="index" class="border border-dark-500 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium text-white">{{ product.productName }}</div>
                    <div class="text-sm text-primary-400">
                      <router-link :to="{ name: 'VendorDetails', params: { id: product.vendor } }" class="hover:text-primary-300">
                        {{ product.vendorName }}
                      </router-link>
                    </div>
                  </div>
                </div>

                <div v-if="product.versions && product.versions.length > 0" class="mt-3">
                  <div class="text-sm text-gray-400 mb-2">Affected Versions:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                        v-for="(version, vIndex) in product.versions"
                        :key="vIndex"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="version.affected ? 'bg-danger-500/10 text-danger-300 border border-danger-500/30' : 'bg-success-500/10 text-success-300 border border-success-500/30'"
                    >
                      {{ version.version }}
                      <svg v-if="version.affected" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div class="mt-3">
                  <router-link
                      :to="{ name: 'ProductDetails', params: { id: product.product._id } }"
                      class="text-sm text-primary-400 hover:text-primary-300"
                  >
                    View Product Details →
                  </router-link>
                </div>
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
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import CveSeverityIndicator from '../components/cve/CveSeverityIndicator.vue';
import cveService from '../services/cveService';
import router from "@/router/index.js";

export default {
  name: 'CveDetails',
  components: {
    LoadingSpinner,
    CveSeverityIndicator
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const cve = ref({});
    const loading = ref(true);
    const error = ref(false);

    const fetchCVE = async () => {
      loading.value = true;
      error.value = false;

      try {
        const cveId = props.id || route.params.id;
        const { data } = await cveService.getCVEById(cveId);
        cve.value = data;
      } catch (err) {
        router.push("/login")
        console.error('Error fetching CVE details:', err);
        error.value = true;
      } finally {
        loading.value = false;
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

    const getStateClass = (state) => {
      const states = {
        'PUBLIC': 'bg-success-500/20 text-success-300 border border-success-500/30',
        'RESERVED': 'bg-warning-500/20 text-warning-300 border border-warning-500/30',
        'REJECTED': 'bg-danger-500/20 text-danger-300 border border-danger-500/30'
      };
      return states[state] || 'bg-dark-500 text-gray-300';
    };

    const getCvssScoreClass = (score) => {
      if (score >= 9.0) return 'text-danger-400';
      if (score >= 7.0) return 'text-warning-400';
      if (score >= 4.0) return 'text-orange-400';
      return 'text-success-400';
    };

    const getSeverityFromScore = (score) => {
      if (score >= 9.0) return 'CRITICAL';
      if (score >= 7.0) return 'HIGH';
      if (score >= 4.0) return 'MEDIUM';
      if (score > 0) return 'LOW';
      return 'NONE';
    };

    const getSeverityBadgeClass = (severity) => {
      const severityMap = {
        'CRITICAL': 'bg-danger-500/20 text-danger-300 border border-danger-500/30',
        'HIGH': 'bg-warning-500/20 text-warning-300 border border-warning-500/30',
        'MEDIUM': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
        'LOW': 'bg-success-500/20 text-success-300 border border-success-500/30',
        'NONE': 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
      };
      return severityMap[severity] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    };

    onMounted(() => {
      fetchCVE();
    });

    return {
      cve,
      loading,
      error,
      formatDate,
      getStateClass,
      getCvssScoreClass,
      getSeverityFromScore,
      getSeverityBadgeClass
    };
  }
};
</script>