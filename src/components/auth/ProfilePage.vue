<template>
  <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div v-if="isLoading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="!user" class="text-center py-10">
      <h2 class="text-xl font-semibold text-gray-800">Vous n'êtes pas connecté</h2>
      <p class="mt-2 text-gray-600">Veuillez vous connecter pour accéder à votre profil</p>
      <div class="mt-6">
        <router-link to="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Se connecter
        </router-link>
      </div>
    </div>

    <div v-else>
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Profil</h3>
            <p class="mt-1 text-sm text-gray-600">
              Vos informations personnelles
            </p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <!-- Profil photo -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div class="mt-2 flex items-center">
                  <div class="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
                    {{ userInitials }}
                  </div>
                  <button type="button" class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Changer
                  </button>
                </div>
              </div>

              <!-- Informations de profil -->
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input type="text" name="username" id="username" v-model="userForm.username" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300">
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input type="email" name="email" id="email" v-model="userForm.email" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300">
                  </div>
                </div>
              </div>

              <!-- Mot de passe -->
              <div class="grid grid-cols-6 gap-6 border-t border-gray-200 pt-5 mt-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="current-password" class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input type="password" name="current-password" id="current-password" v-model="passwordForm.currentPassword" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300">
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="new-password" class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input type="password" name="new-password" id="new-password" v-model="passwordForm.newPassword" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300">
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input type="password" name="confirm-password" id="confirm-password" v-model="passwordForm.confirmPassword" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300">
                  </div>
                </div>
              </div>
            </div>

            <!-- Message d'erreur -->
            <div v-if="error" class="px-4 py-3 bg-red-50 text-red-700 border-t border-red-200">
              {{ error }}
            </div>

            <!-- Message de succès -->
            <div v-if="successMessage" class="px-4 py-3 bg-green-50 text-green-700 border-t border-green-200">
              {{ successMessage }}
            </div>

            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                  type="button"
                  @click="updateProfile"
                  :disabled="isUpdating"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section de préférences -->
      <div class="mt-10 md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Préférences</h3>
            <p class="mt-1 text-sm text-gray-600">
              Vos préférences pour la plateforme
            </p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <fieldset>
                <legend class="text-base font-medium text-gray-900">Notifications</legend>
                <div class="mt-4 space-y-4">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input id="email-notifications" name="email-notifications" type="checkbox" v-model="preferencesForm.emailNotifications" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="email-notifications" class="font-medium text-gray-700">Notifications par e-mail</label>
                      <p class="text-gray-500">Recevoir des notifications par e-mail pour les nouvelles CVE.</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input id="browser-notifications" name="browser-notifications" type="checkbox" v-model="preferencesForm.browserNotifications" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="browser-notifications" class="font-medium text-gray-700">Notifications du navigateur</label>
                      <p class="text-gray-500">Recevoir des notifications dans le navigateur.</p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                  type="button"
                  @click="updatePreferences"
                  :disabled="isUpdating"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Enregistrer les préférences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { AuthService } from '@/services/AuthService';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const isUpdating = ref(false);
const error = ref('');
const successMessage = ref('');

const user = computed(() => AuthService.getters.currentUser.value);
const userInitials = computed(() => {
  if (!user.value || !user.value.username) return '';
  return user.value.username.charAt(0).toUpperCase();
});

// Formulaires
const userForm = ref({
  username: '',
  email: ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const preferencesForm = ref({
  emailNotifications: false,
  browserNotifications: false
});

// Méthodes
const loadUserData = async () => {
  isLoading.value = true;
  try {
    const currentUser = await AuthService.fetchCurrentUser();
    if (currentUser) {
      userForm.value.username = currentUser.username || '';
      userForm.value.email = currentUser.email || '';

      // Charger les préférences si disponibles
      preferencesForm.value.emailNotifications = currentUser.preferences?.emailNotifications || false;
      preferencesForm.value.browserNotifications = currentUser.preferences?.browserNotifications || false;
    }
  } catch (err) {
    error.value = "Erreur lors du chargement de votre profil.";
    console.error('Error loading user profile:', err);
  } finally {
    isLoading.value = false;
  }
};

const updateProfile = async () => {
  try {
    error.value = '';
    successMessage.value = '';
    isUpdating.value = true;

    // Vérifier si les nouveaux mots de passe correspondent
    if (passwordForm.value.newPassword &&
        passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      error.value = "Les mots de passe ne correspondent pas.";
      return;
    }

    // Préparer les données à mettre à jour
    const userData = {
      username: userForm.value.username,
      email: userForm.value.email
    };

    if (passwordForm.value.currentPassword && passwordForm.value.newPassword) {
      userData.currentPassword = passwordForm.value.currentPassword;
      userData.newPassword = passwordForm.value.newPassword;
    }

    // Appel API pour mettre à jour le profil (à implémenter dans AuthService)
    // await AuthService.updateProfile(userData);

    // Simuler une mise à jour réussie
    await new Promise(resolve => setTimeout(resolve, 1000));

    successMessage.value = "Profil mis à jour avec succès";
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (err) {
    error.value = err.response?.data?.message || "Une erreur s'est produite lors de