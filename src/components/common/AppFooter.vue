<template>
  <footer class="bg-dark-700 border-t border-primary-500/20 py-4 px-6 text-center text-gray-400 text-sm">
    <div class="max-w-7xl mx-auto">
      <p>
        CVE Explorer | Data provided by <a href="https://cve.mitre.org/" target="_blank" class="text-primary-400 hover:text-primary-300">CVE.org</a>
      </p>
      <p class="mt-1">
        <span class="text-xs">&copy; {{ currentYear }}</span>
      </p>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'AppFooter',
  setup() {
    const currentYear = ref(new Date().getFullYear());

    return {
      currentYear
    };
  }
};
</script>