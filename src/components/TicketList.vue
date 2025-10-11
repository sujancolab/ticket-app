<template>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.title }}</td>
            <td>
              <span :class="`badge bg-${getStatusClass(ticket.status)}`">
                {{ ticket.status }}
              </span>
            </td>
            <td>
              <span :class="`badge bg-${getPriorityClass(ticket.priority)}`">
                {{ ticket.priority }}
              </span>
            </td>
            <td>{{ formatDate(ticket.createdAt) }}</td>
            <td>
              <ion-button fill="clear" size="small" @click="viewTicket(ticket.id)">
                <ion-icon :icon="eye"></ion-icon>
              </ion-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { IonButton, IonIcon } from '@ionic/vue';
  import { eye } from 'ionicons/icons';
  import { ref, onMounted } from 'vue';
  import { useTicketService } from '@/services/tickets';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const ticketService = useTicketService();
  const tickets = ref([]);
  
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'primary';
      case 'in progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };
  
  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const viewTicket = (id: number) => {
    router.push(`/ticket/${id}`);
  };
  
  onMounted(async () => {
    tickets.value = await ticketService.getTickets();
  });
  </script>