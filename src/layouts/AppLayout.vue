<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <!-- Sidebar Menu -->
      <ion-menu content-id="main-content">
        <ion-header>
          <ion-toolbar color="" class="profile-toolbar">
            <div class="profile-container">
              <img :src="'/src/assets/default-profile.jpg'" alt="Profile" class="profile-image"
              width="35%"/>
            </div>
            <div class="profile-name">{{ username }}</div>
          </ion-toolbar>
        </ion-header>
        
        <ion-content>
          <ion-list>
            <ion-menu-toggle auto-hide="false">
              <ion-item 
                button 
                @click="navigateTo('Dashboard')" 
                :class="{ 'selected': $route.name === 'Dashboard' }"
              >
                <ion-icon slot="start" :icon="home"></ion-icon>
                <ion-label>Dashboard</ion-label>
              </ion-item>
              
              <ion-item 
                button 
                @click="navigateTo('Tickets')" 
                :class="{ 'selected': $route.name === 'Tickets' }"
              >
                <ion-icon slot="start" :icon="list"></ion-icon>
                <ion-label>Tickets</ion-label>
              </ion-item>
              
              <ion-item 
                button 
                @click="navigateTo('AddTicket')" 
                :class="{ 'selected': $route.name === 'AddTicket' }"
              >
                <ion-icon slot="start" :icon="add"></ion-icon>
                <ion-label>Add Ticket</ion-label>
              </ion-item>

              <ion-item 
                button 
                @click="logout"
                :class="{ 'selected': $route.name === 'AddTicket' }"
              >
                <ion-icon slot="start" :icon="logOut"></ion-icon>
                <ion-label>Logout</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      
      <!-- Main Content Area -->
      <ion-router-outlet id="main-content" />
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonFooter,
  IonButton, IonIcon, IonRouterOutlet
} from '@ionic/vue';
import { home, list, add, logOut } from 'ionicons/icons';
import { ref, onMounted } from 'vue';

const router = useRouter();

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  router.push('/login');
};

const username = ref('');

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  username.value = userData?.name || 'User';
});
</script>

<style scoped>
ion-header{
  box-shadow: none;
}
.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.1);
  --color: var(--ion-color-primary);
}

ion-menu::part(container) {
  border-right: 1px solid var(--ion-color-light-shade);
}

ion-footer ion-toolbar {
  --background: transparent;
  --border-width: 0;
}

.profile-name{
  text-align: center;
  font-weight: 600;
}

.profile-container{
  display: flex;
  justify-content: center;
  padding: 16px 16px 8px;
}

.profile-image{
  border: 2px solid var(--ion-color-light-shade);
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-container {
  /* display: flex;
  justify-content: center;
  padding: 16px 16px 8px; */
}

.logo {
  max-width: 50%;
  /* max-height: 80px; */
  object-fit: contain;
}

ion-toolbar {
  --min-height: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

ion-title {
  margin-top: 8px;
  font-size: 1.2rem;
}
</style>