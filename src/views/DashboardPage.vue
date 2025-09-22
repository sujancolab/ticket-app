<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2 class="username-text">{{ username }}</h2>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card @click="navigateToTickets" class="dashboard-card">
              <ion-card-header>
                <ion-card-title>Tickets</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>View all tickets and manage them efficiently.</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card @click="navigateToAddTicket" class="dashboard-card">
              <ion-card-header>
                <ion-card-title>Add Ticket</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>Create a new ticket in just a few clicks.</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonMenuButton, IonButtons
} from '@ionic/vue';

const router = useRouter();
const username = ref('');

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  username.value = userData?.name || 'User';
});

const navigateToTickets = () => {
  router.push({ name: 'Tickets' });
};

const navigateToAddTicket = () => {
  router.push({ name: 'AddTicket' });
};
</script>

<style scoped>
/* Grey background for the page */
ion-content {
  --background: #f1f1f1;
}

/* Username text */
.username-text {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

/* Dashboard cards */
.dashboard-card {
  cursor: pointer;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background: #fff;
  overflow: hidden;
  border-top: 4px solid #f7c600; /* Yellow accent */
}

.dashboard-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Card title */
ion-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Card text */
ion-card-content p {
  font-size: 0.95rem;
  color: #555;
  margin: 0;
  line-height: 1.4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-card {
    margin-bottom: 20px;
  }
}
</style>
