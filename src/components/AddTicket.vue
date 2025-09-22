<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/dashboard"></ion-back-button>
          </ion-buttons>
          <ion-title>Add Ticket</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <form @submit.prevent="submitTicket">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="title" 
                    v-model="ticket.title"
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea 
                    class="form-control" 
                    id="description" 
                    rows="5"
                    v-model="ticket.description"
                    required
                  ></textarea>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="priority" class="form-label">Priority</label>
                    <select 
                      class="form-select" 
                      id="priority" 
                      v-model="ticket.priority"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="category" class="form-label">Category</label>
                    <select 
                      class="form-select" 
                      id="category" 
                      v-model="ticket.category"
                      required
                    >
                      <option value="Technical">Technical</option>
                      <option value="Billing">Billing</option>
                      <option value="Sales">Sales</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Submit Ticket</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTicketService } from '@/services/tickets';
  
  const router = useRouter();
  const ticketService = useTicketService();
  
  const ticket = ref({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Technical',
    status: 'Open'
  });
  
  const submitTicket = async () => {
    try {
      await ticketService.createTicket(ticket.value);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };
  </script>