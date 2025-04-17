<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
      </div>

      <!-- Alert message for errors -->
      <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {{ error }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Nom d'utilisateur</label>
            <input
                id="username"
                name="username"
                type="text"
                required
                v-model="username"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nom d'utilisateur"
            />
          </div>
          <div>
            <label for="email-address" class="sr-only">Adresse e-mail</label>
            <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse e-mail"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
            />
          </div>
          <div>
            <label for="password-confirm" class="sr-only">Confirmer le mot de passe</label>
            <input
                id="password-confirm"
                name="password-confirm"
                type="password"
                autocomplete="new-password"
                required
                v-model="passwordConfirm"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div>
          <button
              type="submit"
              :disabled="isLoading || password !== passwordConfirm"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Loading spinner -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            S'inscrire
          </button>
        </div>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Déjà inscrit?
            <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
              Se connecter
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/AuthService';

const router = useRouter();

// State
const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const isLoading = ref(false);
const error = ref('');
const passwordsMatch = ref(true);

// Watch pour vérifier que les mots de passe correspondent
watch([password, passwordConfirm], ([newPassword, newPasswordConfirm]) => {
  if (newPasswordConfirm && newPassword !== newPasswordConfirm) {
    error.value = 'Les mots de passe ne correspondent pas';
    passwordsMatch.value = false;
  } else {
    error.value = '';
    passwordsMatch.value = true;
  }
});

// Methods
const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  try {
    isLoading.value = true;
    error.value = '';

    const { success, error: registerError } = await AuthService.register(
        username.value,
        email.value,
        password.value
    );

    if (success) {
      // Redirection vers la page de connexion après inscription réussie
      router.push('/login');
    } else {
      error.value = registerError || 'Échec de l\'inscription. Veuillez réessayer.';
    }
  } catch (err) {
    console.error('Register error:', err);
    error.value = 'Une erreur est survenue. Veuillez réessayer plus tard.';
  } finally {
    isLoading.value = false;
  }
};
</script>