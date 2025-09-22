<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Dashboard</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="logout">Logout</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="container mt-3">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card text-white bg-primary">
                <div class="card-body">
                  <h5 class="card-title">Open Tickets</h5>
                  <p class="card-text display-4">{{ stats.open }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card text-white bg-warning">
                <div class="card-body">
                  <h5 class="card-title">In Progress</h5>
                  <p class="card-text display-4">{{ stats.inProgress }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card text-white bg-success">
                <div class="card-body">
                  <h5 class="card-title">Resolved</h5>
                  <p class="card-text display-4">{{ stats.resolved }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="d-flex justify-content-between mb-3">
            <h2>Tickets</h2>
            <ion-button router-link="/add-ticket" fill="solid">
              <ion-icon slot="start" :icon="add"></ion-icon>
              Add Ticket
            </ion-button>
          </div>
          
          <TicketList />
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/vue';
  import { add } from 'ionicons/icons';
  import TicketList from './TicketList.vue';
  import { useAuthStore } from '@/stores/auth';
  import { ref, onMounted } from 'vue';
  import { useTicketService } from '@/services/tickets';
  
  const authStore = useAuthStore();
  const ticketService = useTicketService();
  
  const stats = ref({
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  
  const logout = () => {
    authStore.logout();
  };
  
  onMounted(async () => {
    const statistics = await ticketService.getStatistics();
    stats.value = statistics;
  });
  </script>