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
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Skeleton Loader -->
      <ion-list v-if="loading">
        <ion-card v-for="n in 3" :key="n" class="ticket-card">
          <ion-card-header>
            <ion-skeleton-text animated style="width: 60%; height: 16px;"></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 80px; height: 20px; float:right;"></ion-skeleton-text>
          </ion-card-header>
          <ion-card-content>
            <ion-skeleton-text animated style="width: 90%;"></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 70%;"></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 50%;"></ion-skeleton-text>
          </ion-card-content>
        </ion-card>
      </ion-list>

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

          <ion-footer>
            <ion-toolbar>
              <ion-buttons slot="end">
                <ion-button color="primary" fill="outline" @click.stop="editTicket(ticket)"
                  v-if="ticket.status !== 'Closed'">
                  <ion-icon :icon="create"></ion-icon>
                </ion-button>
                <ion-button color="danger" fill="outline" @click.stop="closeTicket(ticket)"
                  v-if="ticket.status !== 'Closed'">
                  <ion-icon :icon="closeCircle"></ion-icon>
                </ion-button>
                <ion-button color="success" fill="outline" @click.stop="reopenTicket(ticket)"
                  v-if="ticket.status === 'Closed'">
                  <ion-icon :icon="refreshCircle"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-footer>
        </ion-card>
      </ion-list>

      <!-- Empty State -->
      <div v-if="!loading && (!tickets.data || tickets.data.length === 0)" class="empty-state">
        <ion-icon :icon="documentText" size="large"></ion-icon>
        <p>No tickets found</p>
        <ion-button fill="clear" @click="navigateToAddTicket">Create your first ticket</ion-button>
      </div>

      <!-- Modern Pagination -->
      <ion-footer v-if="tickets.data && tickets.data.length > 0">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button shape="round" color="medium" :disabled="!tickets.prev_page_url"
              @click="changePage(tickets.current_page - 1)">
              <ion-icon :icon="refresh" slot="start"></ion-icon> Prev
            </ion-button>
          </ion-buttons>

          <div class="pagination-numbers">
            <ion-button v-for="page in getPageNumbers" :key="page" shape="round" size="small"
              :fill="tickets.current_page === page ? 'solid' : 'outline'" color="primary" @click="changePage(page)">
              {{ page }}
            </ion-button>
          </div>

          <ion-buttons slot="end">
            <ion-button shape="round" color="medium" :disabled="!tickets.next_page_url"
              @click="changePage(tickets.current_page + 1)">
              Next <ion-icon :icon="refreshCircle" slot="end"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>

      <!-- Add Ticket FAB -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="navigateToAddTicket">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Filter Modal with Collapsible Sections -->
      <ion-modal :is-open="filterModalOpen" @didDismiss="filterModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Filter Tickets</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="filterModalOpen = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-accordion-group>
            <!-- Date Filters -->
            <ion-accordion value="dateFilters">
              <ion-item slot="header"><ion-label>Date Filters</ion-label></ion-item>
              <div class="ion-padding" slot="content">
                <ion-item>
                  <ion-label position="stacked">Date From</ion-label>
                  <ion-datetime v-model="search.date_from" presentation="date"></ion-datetime>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Date To</ion-label>
                  <ion-datetime v-model="search.date_to" presentation="date"></ion-datetime>
                </ion-item>
              </div>
            </ion-accordion>

            <!-- Machine / Site Filters -->
            <ion-accordion value="machineFilters">
              <ion-item slot="header"><ion-label>Machine / Site</ion-label></ion-item>
              <div class="ion-padding" slot="content">
                <ion-item>
                  <ion-label position="stacked">Machine</ion-label>
                  <ion-select v-model="search.machine_id" placeholder="Select machine">
                    <ion-select-option v-for="m in search_machines" :key="m.id" :value="m.id">{{ m.far_no }} - {{ m.name
                      }}</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Site</ion-label>
                  <ion-select v-model="search.site_id" placeholder="Select site">
                    <ion-select-option v-for="s in search_sites" :key="s.id" :value="s.id">{{ s.site_name
                      }}</ion-select-option>
                  </ion-select>
                </ion-item>
              </div>
            </ion-accordion>

            <!-- Status / Type Filters -->
            <ion-accordion value="statusFilters">
              <ion-item slot="header"><ion-label>Status / Type</ion-label></ion-item>
              <div class="ion-padding" slot="content">
                <ion-item>
                  <ion-label position="stacked">Status</ion-label>
                  <ion-select v-model="search.status" placeholder="Select status">
                    <ion-select-option value="Open">Open</ion-select-option>
                    <ion-select-option value="Closed">Closed</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Maintenance Type</ion-label>
                  <ion-select v-model="search.ticket_type" placeholder="Select type">
                    <ion-select-option value="Breakdown Maintenance">Breakdown Maintenance</ion-select-option>
                    <ion-select-option value="Periodic Maintenance">Periodic Maintenance</ion-select-option>
                  </ion-select>
                </ion-item>
              </div>
            </ion-accordion>
          </ion-accordion-group>

          <ion-grid class="ion-margin-top">
            <ion-row>
              <ion-col size="6">
                <ion-button expand="block" color="primary" @click="applyFilters">Apply</ion-button>
              </ion-col>
              <ion-col size="6">
                <ion-button expand="block" color="medium" @click="resetFilters">Reset</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonFab, IonFabButton, IonIcon, IonMenuButton, IonButton, IonChip, IonRefresher, IonRefresherContent, IonFooter, IonModal, IonSelect, IonSelectOption, IonInput, IonDatetime, IonGrid, IonRow, IonCol, IonAccordion, IonAccordionGroup, IonItem, IonSkeletonText, toastController, alertController
} from '@ionic/vue';
import { add, documentText, refresh, filter, create, closeCircle, refreshCircle } from 'ionicons/icons';
import axios from 'axios';

interface Machine { id: number; far_no: string; name: string; }
interface Site { id: number; site_name: string; }
interface Ticket { id: number; ticket_no: string; status: string; problem_description: string; created_at: string; machine: Machine; site: Site; }
interface TicketsResponse { current_page: number; data: Ticket[]; last_page: number; next_page_url: string | null; prev_page_url: string | null; }

const router = useRouter();
const loading = ref(true);
const filterModalOpen = ref(false);
const tickets = ref<TicketsResponse>({} as TicketsResponse);
const search_machines = ref<Machine[]>([]);
const search_sites = ref<Site[]>([]);

const search = ref({ page: 1, machine_id: "", site_id: "", ticket_type: "", ticket: "", date_from: "", date_to: "", status: "" });

onMounted(() => { loadTickets(); loadInitialData(); });

const api = axios.create({ baseURL: 'https://rmm.tech-trico.com', timeout: 10000 });

const loadTickets = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/ticket-app", { params: search.value });
    tickets.value = response.data.data;
  } catch { showToast("Failed to load tickets", "danger"); }
  finally { loading.value = false; }
};

const loadInitialData = async () => {
  try { const response = await axios.get("/api/initial_ticket"); search_machines.value = response.data.data.machines; search_sites.value = response.data.data.sites; }
  catch { console.error("Error loading initial data"); }
};

const getPageNumbers = computed(() => {
  const totalPages = tickets.value.last_page || 1;
  const currentPage = tickets.value.current_page || 1;
  const maxPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages, startPage + maxPages - 1);
  if (endPage - startPage + 1 < maxPages) startPage = Math.max(1, endPage - maxPages + 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
const truncateText = (text: string, maxLength: number) => text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
const getStatusColor = (status: string) => status.toLowerCase() === 'open' ? 'danger' : status.toLowerCase() === 'closed' ? 'success' : 'medium';

const viewTicket = (ticket: Ticket) => router.push(`/ticket/view/${ticket.id}`);
const editTicket = (ticket: Ticket) => ticket.status !== 'Closed' && router.push(`/ticket/edit/${ticket.id}`);
const closeTicket = (ticket: Ticket) => ticket.status !== 'Closed' && router.push(`/ticket/close/${ticket.id}`);

const reopenTicket = async (ticket: Ticket) => {
  if (ticket.status === 'Closed') {
    const alert = await alertController.create({
      header: 'Reopen Ticket', message: 'Are you sure you want to reopen this ticket?',
      buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Reopen', handler: async () => { try { await axios.get(`/api/reopen_ticket/${ticket.id}`); showToast('Ticket reopened successfully', 'success'); loadTickets(); } catch { showToast('Failed to reopen ticket', 'danger'); } } }]
    }); await alert.present();
  }
};

const openFilterModal = () => filterModalOpen.value = true;
const applyFilters = () => { search.value.page = 1; filterModalOpen.value = false; loadTickets(); };
const resetFilters = () => { search.value = { page: 1, machine_id: "", site_id: "", ticket_type: "", ticket: "", date_from: "", date_to: "", status: "" }; filterModalOpen.value = false; loadTickets(); };
const changePage = (page: number) => { search.value.page = page; loadTickets(); };
const refreshTickets = () => loadTickets();
const handleRefresh = (event: CustomEvent) => { loadTickets(); setTimeout(() => (event.target as HTMLIonRefresherElement).complete(), 1000); };
const navigateToAddTicket = () => router.push('/ticket/add');

const showToast = async (message: string, color: string = 'primary') => { const toast = await toastController.create({ message, duration: 2000, color, position: 'top' }); await toast.present(); };
</script>

<style scoped>
.ticket-card {
  margin: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
}

.status-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.85rem;
}

ion-card-content p {
  margin: 4px 0;
  font-size: 0.9rem;
}

ion-footer ion-button {
  margin: 4px;
  border-radius: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--ion-color-medium-shade);
}

.pagination-numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.pagination-numbers ion-button {
  min-width: 36px;
  font-size: 0.9rem;
  --border-radius: 50%;
}

ion-skeleton-text {
  border-radius: 6px;
  margin: 6px 0;
}

ion-accordion ion-item {
  --background: var(--ion-color-light);
}

ion-accordion-group {
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}
</style>
