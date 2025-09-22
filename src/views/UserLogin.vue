<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
              <div class="card">
                <div class="card-body">
                  <form @submit.prevent="login">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        id="email" 
                        v-model="credentials.email"
                        required
                      >
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label">Password</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        id="password" 
                        v-model="credentials.password"
                        required
                      >
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const credentials = ref({
    email: '',
    password: ''
  });
  
  const login = async () => {
    try {
      await authStore.login(credentials.value);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  </script>