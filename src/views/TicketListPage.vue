<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Ticket List</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openFilterModal">
            <ion-icon slot="icon-only" :icon="filter"></ion-icon>
          </ion-button>
          <ion-button @click="refreshTickets">
            <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Ticket List -->
      <ion-list v-if="!loading && tickets.data && tickets.data.length > 0">
        <ion-card v-for="ticket in tickets.data" :key="ticket.id" class="ticket-card" @click="viewTicket(ticket)">
          <ion-card-header>
            <ion-card-title><strong>{{ ticket.ticket_no }}</strong></ion-card-title>
            <ion-chip :color="getStatusColor(ticket.status)" class="status-chip">
              <ion-label>{{ ticket.status }}</ion-label>
            </ion-chip>
          </ion-card-header>

          <ion-card-content>
            <p><strong>Machine:</strong> {{ ticket.machine.name }} ({{ ticket.machine.far_no }})</p>
            <p><strong>Problem:</strong> {{ truncateText(ticket.problem_description, 50) }}</p>
            <p><strong>Site:</strong> {{ ticket.site ? ticket.site.site_name : '-' }}</p>
            <p><strong>Created:</strong> {{ formatDate(ticket.created_at) }}</p>
          </ion-card-content>
        </ion-card>
      </ion-list>

      <!-- Empty State -->
      <div v-if="!loading && (!tickets.data || tickets.data.length === 0)" class="empty-state">
        <ion-icon :icon="documentText" size="large"></ion-icon>
        <p>No tickets found</p>
        <ion-button fill="clear" @click="navigateToAddTicket">Create your first ticket</ion-button>
      </div>

      <!-- Ticket Detail Modal -->
      <ion-modal :is-open="viewModalOpen" @didDismiss="closeViewModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Ticket Details</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeViewModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" v-if="selectedTicket">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ selectedTicket.ticket_no }}</ion-card-title>
              <ion-chip :color="getStatusColor(selectedTicket.status)">
                <ion-label>{{ selectedTicket.status }}</ion-label>
              </ion-chip>
            </ion-card-header>
            <ion-card-content>
              <p><strong>Machine:</strong> {{ selectedTicket.machine.name }} ({{ selectedTicket.machine.far_no }})</p>
              <p><strong>Problem:</strong> {{ selectedTicket.problem_description }}</p>
              <p><strong>Site:</strong> {{ selectedTicket.site?.site_name || '-' }}</p>
              <p><strong>Created:</strong> {{ formatDate(selectedTicket.created_at) }}</p>
            </ion-card-content>
          </ion-card>

          <ion-list>
            <ion-item>
              <ion-label>Current Run Hour</ion-label>
              <ion-text>{{ selectedTicket.current_run_hour || '-' }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-label>Production Loss</ion-label>
              <ion-text>{{ selectedTicket.production_loss || '-' }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-label>Production Loss Amount</ion-label>
              <ion-text>{{ selectedTicket.production_loss_amount || '-' }}</ion-text>
            </ion-item>
          </ion-list>

          <!-- Stages -->
          <ion-card v-if="selectedTicket.stages && selectedTicket.stages.length > 0">
            <ion-card-header>
              <ion-card-title>Stages</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item v-for="(stage, index) in selectedTicket.stages" :key="index">
                  <ion-label>
                    <h3>Stage {{ stage.stage_no }}</h3>
                    <p>{{ stage.stage_date }} - {{ stage.description }}</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>

          <!-- Cost Details -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>Cost Details</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p><strong>Estimated Material Cost:</strong> {{ selectedTicket.estimated_material_cost || 0 }}</p>
              <p><strong>Estimated Service Cost:</strong> {{ selectedTicket.estimated_service_cost || 0 }}</p>
              <p><strong>Actual Material Cost:</strong> {{ selectedTicket.actual_material_cost || 0 }}</p>
              <p><strong>Actual Service Cost:</strong> {{ selectedTicket.actual_service_cost || 0 }}</p>
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonLabel, IonMenuButton, IonButton, IonChip, IonIcon, IonModal, IonText, IonItem
} from '@ionic/vue';
import { add, documentText, refresh, filter } from 'ionicons/icons';
import axios from 'axios';

interface Machine { id: number; far_no: string; name: string; }
interface Site { id: number; site_name: string; }
interface Ticket { id: number; ticket_no: string; status: string; problem_description: string; created_at: string; machine: Machine; site: Site; stages?: any[]; estimated_material_cost?: number; estimated_service_cost?: number; actual_material_cost?: number; actual_service_cost?: number; current_run_hour?: number; production_loss?: number; production_loss_amount?: number; }
interface TicketsResponse { current_page: number; data: Ticket[]; last_page: number; next_page_url: string | null; prev_page_url: string | null; }

const router = useRouter();
const loading = ref(true);
const tickets = ref<TicketsResponse>({} as TicketsResponse);
const viewModalOpen = ref(false);
const selectedTicket = ref<Ticket | null>(null);

onMounted(() => { loadTickets(); });

const api = axios.create({ baseURL: 'https://dummymm.tech-trico.com', timeout: 10000 });

const loadTickets = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/ticket-app");
    tickets.value = response.data.data;
  } catch {
    console.error("Failed to load tickets");
  } finally {
    loading.value = false;
  }
};

const viewTicket = (ticket: Ticket) => {
  selectedTicket.value = ticket;
  viewModalOpen.value = true;
};

const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedTicket.value = null;
};

const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
const truncateText = (text: string, maxLength: number) => text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
const getStatusColor = (status: string) => status.toLowerCase() === 'open' ? 'warning' : status.toLowerCase() === 'closed' ? 'success' : 'medium';
const refreshTickets = () => loadTickets();
const navigateToAddTicket = () => router.push('/ticket/add');
const openFilterModal = () => console.log("Open Filters");
</script>

<style scoped>
/* Page background with soft gradient */
ion-content {
  --background: linear-gradient(135deg, #f9f9f9, #eef2f3);
  padding: 12px 0;
}

/* Toolbar with slight shadow */
ion-toolbar {
  --background: #ffffff;
  border-bottom: 2px solid #7d6412;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Title */
ion-title {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.2rem;
}

/* Toolbar buttons */
ion-button {
  --color: #2c3e50;
  --background: transparent;
  --ripple-color: #7d6412;
  transition: all 0.3s ease;
}
ion-button:hover {
  --color: #7d6412;
  transform: scale(1.1);
}

/* Ticket card with glassmorphism effect */
.ticket-card {
  margin: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(241, 196, 15, 0.3);
  position: relative;
  cursor: pointer;
}
.ticket-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  border-color: #7d6412;
}

/* Card header & title */
ion-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 4px;
}
ion-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.3px;
}

/* Status chip with gradient colors */
.status-chip {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 14px;
  position: absolute;
  top: 12px;
  right: 12px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #7d6412, #f39c12);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Card content */
ion-card-content p {
  margin: 6px 0;
  font-size: 0.9rem;
  color: #34495e;
  line-height: 1.4;
}
ion-card-content strong {
  color: #2c3e50;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  color: #7f8c8d;
  gap: 12px;
}
.empty-state ion-icon {
  font-size: 60px;
  color: #bdc3c7;
  animation: pulseIcon 1.5s infinite ease-in-out;
}
@keyframes pulseIcon {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}

/* Modal with soft edges */
ion-modal {
  --width: 92%;
  --height: 88%;
  --border-radius: 16px;
  --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

/* Modal cards */
ion-modal ion-card {
  margin-bottom: 14px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  background: #fff;
}
ion-modal ion-card:hover {
  transform: translateY(-2px);
}

/* Modal header & title */
ion-modal ion-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 6px;
}
ion-modal ion-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
}

/* List items inside modal */
ion-list ion-item {
  --background: #f9fafb;
  margin-bottom: 8px;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #2c3e50;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: background 0.3s ease;
}
ion-list ion-item:hover {
  --background: #fff8e1;
}

/* Chips in modal */
ion-chip {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7d6412, #f39c12);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .ticket-card {
    margin: 10px;
    padding: 8px;
  }
  ion-card-content p {
    font-size: 0.85rem;
  }
  ion-card-title {
    font-size: 0.95rem;
  }
  .status-chip {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
}
</style>
