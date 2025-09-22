<!-- <template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <div class="login-container">
        <ion-card>
          <div class="logo-container">
            <img src="/src/assets/logo.png" alt="Company Logo" class="logo">
          </div>
          
          <ion-card-header>
            <ion-card-title class="ion-text-center">Royal Machine Maintenance</ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <ion-item class="ion-margin-bottom">
              <ion-label position="floating" class="ion-text-wrap">Username</ion-label>
              <ion-input 
                v-model="username" 
                type="text" 
                clear-input
                :class="{ 'ion-invalid': submitted && !username }"
              ></ion-input>
              <ion-note slot="error" v-if="submitted && !username">Username is required</ion-note>
            </ion-item>
            
            <ion-item class="ion-margin-bottom">
              <ion-label position="floating" class="ion-text-wrap">Password</ion-label>
              <ion-input 
                v-model="password" 
                type="password" 
                clear-input
                :class="{ 'ion-invalid': submitted && !password }"
              ></ion-input>
              <ion-note slot="error" v-if="submitted && !password">Password is required</ion-note>
            </ion-item>
            
            <ion-button 
              expand="block" 
              @click="login" 
              class="ion-margin-top"
              :disabled="isLoggingIn"
            >
              <ion-spinner v-if="isLoggingIn" name="crescent"></ion-spinner>
              <span v-else>Login</span>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonNote,
  IonSpinner, toastController
} from '@ionic/vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const submitted = ref(false);
const isLoggingIn = ref(false);

const login = async () => {
  submitted.value = true;
  
  if (!username.value || !password.value) {
    const toast = await toastController.create({
      message: 'Please enter both username and password',
      duration: 2000,
      position: 'top'
    });
    await toast.present();
    return;
  }

  isLoggingIn.value = true;
  
  // Simulate login process
  setTimeout(() => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username.value);
    isLoggingIn.value = false;
    router.push('/app/dashboard');
  }, 1000);
};
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 50px;
}

.logo-container {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}

.logo {
  width: 120px;
  height: auto;
  object-fit: contain;
}

/* Fixes for overlapping text */
ion-item {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
  --min-height: 68px;
}

ion-label[position="floating"] {
  margin-left: 0;
  margin-bottom: 4px;
  transform-origin: left center;
}

ion-input {
  --padding-start: 0 !important;
  --padding-end: 0 !important;
  margin-top: 8px;
}

/* Error message styling */
ion-note[slot="error"] {
  display: block;
  margin-top: 4px;
  color: var(--ion-color-danger);
  font-size: 0.875rem;
}

/* Button spacing */
ion-button {
  margin-top: 24px;
  --border-radius: 8px;
}

/* Card styling */
ion-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

ion-card-header {
  padding-bottom: 0;
}

ion-card-title {
  font-size: 1.5rem;
  font-weight: 600;
}
</style> -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <div class="login-container">
        <ion-card>
          <div class="logo-container">
            <img src="/src/assets/logo.png" alt="Company Logo" class="logo">
          </div>
          
          <ion-card-header>
            <ion-card-title class="ion-text-center">Royal Machine Maintenance</ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <ion-item class="ion-margin-bottom">
              <ion-label position="floating" class="ion-text-wrap">Username</ion-label>
              <ion-input 
                v-model="username" 
                type="text" 
                clear-input
                :class="{ 'ion-invalid': submitted && !username }"
              ></ion-input>
              <ion-note slot="error" v-if="submitted && !username">Username is required</ion-note>
            </ion-item>
            
            <ion-item class="ion-margin-bottom">
              <ion-label position="floating" class="ion-text-wrap">Password</ion-label>
              <ion-input 
                v-model="password" 
                type="password" 
                clear-input
                :class="{ 'ion-invalid': submitted && !password }"
              ></ion-input>
              <ion-note slot="error" v-if="submitted && !password">Password is required</ion-note>
            </ion-item>
            
            <ion-button 
              expand="block" 
              @click="login" 
              class="ion-margin-top"
              :disabled="isLoggingIn"
            >
              <ion-spinner v-if="isLoggingIn" name="crescent"></ion-spinner>
              <span v-else>Login</span>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonNote,
  IonSpinner, toastController
} from '@ionic/vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const submitted = ref(false);
const isLoggingIn = ref(false);

const login = async () => {
  submitted.value = true;
  
  if (!username.value || !password.value) {
    const toast = await toastController.create({
      message: 'Please enter both username and password',
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
    return;
  }

  isLoggingIn.value = true;

  try {
    // API call for login
    const response = await axios.post('https://dummymm.tech-trico.com/api/app-login', {
      email: username.value,
      password: password.value
    });

    if (response.data.status) {
      // Store user data & token
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // If API returns token:
      // localStorage.setItem('token', response.data.token);

      const toast = await toastController.create({
        message: 'Login successful',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();

      // Redirect to dashboard
      router.push('/app/dashboard');
    } else {
      const toast = await toastController.create({
        message: response.data.message || 'Invalid credentials',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  } catch (error) {
    const toast = await toastController.create({
      message: error.response?.data?.message || 'Something went wrong',
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  } finally {
    isLoggingIn.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 50px;
}

.logo-container {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}

.logo {
  width: 120px;
  height: auto;
  object-fit: contain;
}

/* Fix overlapping labels */
ion-item {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
  --min-height: 68px;
}

ion-label[position="floating"] {
  margin-left: 0;
  margin-bottom: 4px;
  transform-origin: left center;
}

ion-input {
  --padding-start: 0 !important;
  --padding-end: 0 !important;
  margin-top: 8px;
}

/* Error text styling */
ion-note[slot="error"] {
  display: block;
  margin-top: 4px;
  color: var(--ion-color-danger);
  font-size: 0.875rem;
}

/* Button styling */
ion-button {
  margin-top: 24px;
  --border-radius: 8px;
}

/* Card styling */
ion-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

ion-card-header {
  padding-bottom: 0;
}

ion-card-title {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
