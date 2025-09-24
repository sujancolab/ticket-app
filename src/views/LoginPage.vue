<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="light">
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
            <!-- Username -->
            <ion-item class="ion-margin-bottom">
              <ion-label position="floating">Username</ion-label>
              <ion-input 
                v-model="username" 
                type="text" 
                clear-input
                :class="{ 'ion-invalid': submitted && !username }"
              ></ion-input>
              <ion-note slot="error" v-if="submitted && !username">Username is required</ion-note>
            </ion-item>
            
            <!-- Password -->
            <ion-item class="ion-margin-bottom">
              <ion-label position="floating">Password</ion-label>
              <ion-input 
                v-model="password" 
                type="password" 
                clear-input
                :class="{ 'ion-invalid': submitted && !password }"
              ></ion-input>
              <ion-note slot="error" v-if="submitted && !password">Password is required</ion-note>
            </ion-item>
            
            <!-- Login Button -->
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
  IonSpinner, toastController,
  useIonRouter
} from '@ionic/vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const submitted = ref(false);
const isLoggingIn = ref(false);
const ionRouter = useIonRouter();
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
    // API login request
    const response = await axios.post('https://dummymm.tech-trico.com/api/app-login', {
      email: username.value,
      password: password.value
    });

    if (response.data.status) {
      // Store data in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const toast = await toastController.create({
        message: 'Login successful',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();

      // Redirect to dashboard
      // router.push('/app/dashboard');
      // router.replace('/app/dashboard');
      // router.replace({ path: '/app/dashboard', force: true });
      localStorage.setItem('reloadDashboard', 'true');
       ionRouter.navigate('/app/dashboard', 'root');

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
/* Background */
ion-content {
  --background: #f1f1f1; /* Light grey */
}

/* Container */
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 50px;
}

/* Logo */
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

/* Card */
ion-card {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

ion-card-header {
  padding-bottom: 0;
}

ion-card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #444;
}

/* Input items */
ion-item {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
  --min-height: 68px;
  --highlight-color-focused: #7d6412; /* Yellow */
  --highlight-color-valid: #7d6412;
  --highlight-color-invalid: #f44336;
}

ion-label[position="floating"] {
  margin-left: 0;
  margin-bottom: 4px;
  transform-origin: left center;
  color: #666;
}

ion-input {
  --padding-start: 0 !important;
  --padding-end: 0 !important;
  margin-top: 8px;
  color: #333;
}

/* Error text */
ion-note[slot="error"] {
  display: block;
  margin-top: 4px;
  color: #f44336;
  font-size: 0.875rem;
}

/* Buttons */
ion-button {
  margin-top: 24px;
  --border-radius: 8px;
  --background: #7d6412;
  --color: #f8f4f4;
  font-weight: 600;
}

ion-button:disabled {
  --background: #ccc;
  --color: #888;
}
</style>
