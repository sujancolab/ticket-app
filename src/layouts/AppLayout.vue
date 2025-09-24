<template>
   <ion-page>
    <ion-split-pane content-id="main-content">
      <!-- Sidebar Menu -->
      <ion-menu content-id="main-content">
        <ion-header>
          <ion-toolbar>
            <div class="logo-container">
              <img src="/src/assets/logo.png" alt="Company Logo" class="logo">
            </div>
            <ion-title>Menu</ion-title>
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
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
        
        <ion-footer>
          <ion-toolbar>
            <ion-button expand="block" @click="logout" color="danger">
              <ion-icon slot="start" :icon="logOut"></ion-icon>
              Logout
            </ion-button>
          </ion-toolbar>
        </ion-footer>
      </ion-menu>
      
      <!-- Main Content Area -->
      <ion-router-outlet id="main-content" />
    </ion-split-pane>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  IonApp,IonPage, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonFooter,
  IonButton, IonIcon, IonRouterOutlet
} from '@ionic/vue';
import { home, list, add, logOut } from 'ionicons/icons';

const router = useRouter();

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  router.push('/login');
};
</script>

<style scoped>
/* Grey background for sidebar */
ion-menu {
  --background: #f1f1f1;
  --min-width: 260px;
}

/* Header styling */
ion-toolbar {
  --background: #fff;
  border-bottom: 1px solid #ddd;
  --min-height: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-container {
  display: flex;
  justify-content: center;
  padding: 16px 16px 8px;
}

.logo {
  max-width: 80%;
  max-height: 80px;
  object-fit: contain;
}

ion-title {
  margin-top: 8px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

/* Menu Items */
ion-item {
  --background: #fff;
  --color: #333;
  --border-radius: 6px;
  margin: 6px 12px;
  transition: background 0.2s;
}

/* Hover and selected states */
ion-item:hover {
  --background: #7d6412;
  --color: #fafafa;
}

.selected {
  --background: #7d6412;
  --color: #f9f7f7;
  font-weight: 600;
}

/* Footer */
ion-footer ion-toolbar {
  --background: transparent;
  --border-width: 0;
}
</style>
