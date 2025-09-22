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
        <h2> {{ username }}</h2>
        
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="6">
              <ion-card @click="navigateToTickets" class="dashboard-card">
                <ion-card-header>
                  <ion-card-title>Tickets</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  View all tickets
                </ion-card-content>
              </ion-card>
            </ion-col>
            
            <ion-col size="12" size-md="6">
              <ion-card @click="navigateToAddTicket" class="dashboard-card">
                <ion-card-header>
                  <ion-card-title>Add Ticket</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  Create a new ticket
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
    username.value = JSON.parse(localStorage.getItem('user')).name ?? 'User';
  });
  
  const navigateToTickets = () => {
    router.push({ name: 'Tickets' });
  };
  
  const navigateToAddTicket = () => {
    router.push({ name: 'AddTicket' });
  };
  </script>
  
  <style scoped>
  .dashboard-card {
    height: 100%;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .dashboard-card:hover {
    transform: scale(1.02);
  }
  </style>