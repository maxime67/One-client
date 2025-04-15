<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center">
    <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden p-8 max-w-lg w-full text-center">
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/10 text-primary-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <h1 class="text-4xl font-bold text-white mb-4">404</h1>
      <h2 class="text-xl text-white mb-6">Page Not Found</h2>
      <p class="text-gray-400 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <router-link to="/" class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-400">
          Go to Dashboard
        </router-link>
        <button @click="goBack" class="px-4 py-2 bg-dark-500 hover:bg-dark-400 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-dark-400">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  setup() {
    const goBack = () => {
      window.history.length > 1
          ? window.history.go(-1)
          : window.location.href = '/';
    };

    return {
      goBack
    };
  }
};
</script>