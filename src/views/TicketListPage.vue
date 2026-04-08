<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
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

    <ion-content style="--background: #f2f2f2;">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Skeleton Loader -->
      <div v-if="loading">
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
      </div>

      <!-- Ticket List -->
      <div v-if="!loading && tickets.data && tickets.data.length > 0">
        <ion-card v-for="ticket in tickets.data" :key="ticket.id" class="ticket-card" @click="viewTicket(ticket)">
          <ion-card-header>
            <ion-card-title>
              <ion-icon :icon="documentText" style="vertical-align: middle; margin-right: 8px;" />
              <strong>{{ ticket.ticket_no }}</strong>
            </ion-card-title>
            <ion-chip :color="getStatusColor(ticket.status)" class="status-chip">
              <ion-label>{{ ticket.status }}</ion-label>
            </ion-chip>
          </ion-card-header>

          <ion-card-content class="ticket-summary-content">
            <div class="ticket-summary-row">
              <span class="summary-label">Machine:</span>
              <span class="summary-value">{{ ticket.machine.name }} ({{ ticket.machine.far_no }})</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Problem:</span>
              <span class="summary-value">{{ truncateText(ticket.problem_description, 40) }}</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Site:</span>
              <span class="summary-value">{{ ticket.site ? ticket.site.site_name : '-' }}</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Created:</span>
              <span class="summary-value">{{ formatDate(ticket.created_at) }}</span>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && (!tickets.data || tickets.data.length === 0)" class="empty-state">
        <ion-icon :icon="documentText" size="large"></ion-icon>
        <p>No tickets found</p>
        <ion-button fill="clear" @click="navigateToAddTicket">Create your first ticket</ion-button>
      </div>

      <!-- Pagination Footer -->
      <ion-footer v-if="tickets.data && tickets.data.length > 0 && !loading">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button shape="round" color="medium" :disabled="!tickets.prev_page_url"
              @click="changePage(tickets.current_page - 1)">
              <ion-icon :icon="chevronBack" slot="start"></ion-icon> Prev
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
              Next <ion-icon :icon="chevronForward" slot="end"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>

      <!-- Filter Modal with Collapsible Sections -->
      <ion-modal :is-open="filterModalOpen" @didDismiss="filterModalOpen = false">
        <ion-header>
          <ion-toolbar class="custom-toolbar">
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

      <!-- Ticket Detail Modal -->
      <ion-modal :is-open="viewModalOpen" @didDismiss="closeViewModal">
        <ion-header>
          <ion-toolbar class="custom-toolbar">
            <ion-title>Ticket Details</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeViewModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content v-if="selectedTicket">
          <ion-card-header>
            <ion-card-title>
              <ion-icon :icon="documentText" style="vertical-align: middle; margin-right: 8px;" color="primary" /> {{
                selectedTicket.ticket_no }}
            </ion-card-title>
            <ion-chip :color="getStatusColor(selectedTicket.status)" class="status-chip">
              <ion-label>{{ selectedTicket.status }}</ion-label>
            </ion-chip>
          </ion-card-header>
          <div class="card-divider1"></div>

          <ion-card-content class="ticket-summary-content">
            <div class="ticket-summary-row">
              <span class="summary-label">Machine:</span>
              <span class="summary-value">{{ selectedTicket.machine.name }} ({{ selectedTicket.machine.far_no }})</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Problem:</span>
              <span class="summary-value">{{ truncateText(selectedTicket.problem_description, 40) }}</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Site:</span>
              <span class="summary-value">{{ selectedTicket.site ? selectedTicket.site.site_name : '-' }}</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Created:</span>
              <span class="summary-value">{{ formatDate(selectedTicket.created_at) }}</span>
            </div>
          </ion-card-content>

          <div class="card-divider"
            v-if="selectedTicket.current_run_hour || selectedTicket.production_loss || selectedTicket.production_loss_amount">
          </div>

          <ion-list
            v-if="selectedTicket.current_run_hour || selectedTicket.production_loss || selectedTicket.production_loss_amount">
            <ion-item v-if="selectedTicket.current_run_hour">
              <ion-label>Current Run Hour</ion-label>
              <ion-text>{{ selectedTicket.current_run_hour }}</ion-text>
            </ion-item>
            <ion-item v-if="selectedTicket.production_loss">
              <ion-label>Production Loss</ion-label>
              <ion-text>{{ selectedTicket.production_loss }}</ion-text>
            </ion-item>
            <ion-item v-if="selectedTicket.production_loss_amount">
              <ion-label>Production Loss Amount</ion-label>
              <ion-text>{{ selectedTicket.production_loss_amount }}</ion-text>
            </ion-item>
          </ion-list>

          <div class="card-divider"></div>
          <!-- Stages -->
          <ion-card-header>
            <ion-card-title>
              <ion-icon :icon="list" style="vertical-align: middle; margin-right: 8px;" color="primary" /> Stages
            </ion-card-title>
          </ion-card-header>
          <ion-list v-if="selectedTicket.stages && selectedTicket.stages.length > 0"
            style="margin-left: 16px; margin-right: 16px;">
            <ion-item v-for="(stage, index) in selectedTicket.stages" :key="index" lines="none">
              <div slot="start"
                style="margin-right: 12px; background: #eee; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; color: #333;">
                {{ index + 1 }}
              </div>
              <ion-label style="display: flex; flex-direction: column; width: 100%;">
                <span style="font-size: 1rem; font-weight: bold;">{{ stage.stage_no }}</span>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
                  <span style="font-size: 0.8rem; color: #555;">{{ stage.description }}</span>
                  <span style="font-size: 0.75rem; color: #888; white-space: nowrap;">{{ formatDate(stage.stage_date)
                  }}</span>
                </div>
              </ion-label>
            </ion-item>
          </ion-list>

          <div class="card-divider"></div>

          <!-- Cost Details -->
          <ion-card-header>
            <ion-card-title>
              <ion-icon :icon="cashOutline" style="vertical-align: middle; margin-right: 8px;" color="primary" /> Cost
              Details
            </ion-card-title>
          </ion-card-header>
          <ion-list class="cost-details-list" style="margin-left: 16px; margin-right: 16px;">
            <ion-item lines="none">
              <ion-label>Estimated Material Cost</ion-label>
              <ion-text slot="end">{{ selectedTicket.estimated_material_cost || 0 }}</ion-text>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Estimated Service Cost</ion-label>
              <ion-text slot="end">{{ selectedTicket.estimated_service_cost || 0 }}</ion-text>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Actual Material Cost</ion-label>
              <ion-text slot="end">{{ selectedTicket.actual_material_cost || 0 }}</ion-text>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Actual Service Cost</ion-label>
              <ion-text slot="end">{{ selectedTicket.actual_service_cost || 0 }}</ion-text>
            </ion-item>
          </ion-list>

        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonLabel, IonMenuButton, IonButton, IonChip, IonIcon, IonModal, IonText, IonItem, IonRefresher, IonRefresherContent,
  IonFooter, IonSelect, IonSelectOption, IonDatetime, IonGrid, IonRow, IonCol, IonAccordion, IonAccordionGroup, IonSkeletonText
} from '@ionic/vue';
import { add, documentText, refresh, filter, list, cashOutline, chevronBack, chevronForward } from 'ionicons/icons';
import axios from 'axios';

interface Machine { id: number; far_no: string; name: string; }
interface Site { id: number; site_name: string; }
interface Ticket { id: number; ticket_no: string; status: string; problem_description: string; created_at: string; machine: Machine; site: Site; stages?: any[]; estimated_material_cost?: number; estimated_service_cost?: number; actual_material_cost?: number; actual_service_cost?: number; current_run_hour?: number; production_loss?: number; production_loss_amount?: number; }
interface TicketsResponse { current_page: number; data: Ticket[]; last_page: number; next_page_url: string | null; prev_page_url: string | null; }

const router = useRouter();
const loading = ref(true);
const tickets = ref<TicketsResponse>({} as TicketsResponse);
const viewModalOpen = ref(false);
const filterModalOpen = ref(false);
const selectedTicket = ref<Ticket | null>(null);
const search_machines = ref<Machine[]>([]);
const search_sites = ref<Site[]>([]);

const search = ref({
  page: 1,
  machine_id: "",
  site_id: "",
  ticket_type: "",
  ticket: "",
  date_from: "",
  date_to: "",
  status: ""
});

onMounted(() => {
  loadTickets();
  loadInitialData();
});

const api = axios.create({ baseURL: 'https://rmm.tech-trico.com', timeout: 10000 });

const loadTickets = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/ticket-app", { params: search.value });
    tickets.value = response.data.data;
  } catch {
    console.error("Failed to load tickets");
  } finally {
    loading.value = false;
  }
};

const loadInitialData = async () => {
  try {
    const response = await api.get("/api/initial_ticket");
    search_machines.value = response.data.data.machines;
    search_sites.value = response.data.data.sites;
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
};

const getPageNumbers = computed(() => {
  const totalPages = tickets.value.last_page || 1;
  const currentPage = tickets.value.current_page || 1;
  const maxPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages, startPage + maxPages - 1);
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

const viewTicket = (ticket: Ticket) => {
  selectedTicket.value = ticket;
  console.log(ticket);
  viewModalOpen.value = true;
};

const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedTicket.value = null;
};

const openFilterModal = () => filterModalOpen.value = true;

const applyFilters = () => {
  search.value.page = 1;
  filterModalOpen.value = false;
  loadTickets();
};

const resetFilters = () => {
  search.value = {
    page: 1,
    machine_id: "",
    site_id: "",
    ticket_type: "",
    ticket: "",
    date_from: "",
    date_to: "",
    status: ""
  };
  filterModalOpen.value = false;
  loadTickets();
};

const changePage = (page: number) => {
  search.value.page = page;
  loadTickets();
};

const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
const truncateText = (text: string, maxLength: number) => text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
const getStatusColor = (status: string) => status.toLowerCase() === 'open' ? 'danger' : status.toLowerCase() === 'closed' ? 'success' : 'medium';
const refreshTickets = () => loadTickets();
const navigateToAddTicket = () => router.push('/ticket/add');
const handleRefresh = (event: CustomEvent) => {
  loadTickets();
  setTimeout(() => {
    if (event.target) {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }, 1000);
};
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

ion-modal {
  --width: 95%;
  --height: 90%;
  --border-radius: 12px;
  --box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

ion-list ion-item {
  --background: #f8f9fa;
  --color: var(--ion-color-dark);
  margin-bottom: 6px;
  border-radius: 8px;
}

.cost-details-list ion-item {
  --background: #ffffff;
  --color: #1f2937;
}

.cost-details-list ion-label,
.cost-details-list ion-text {
  color: #1f2937 !important;
}

.summary-label {
  color: #838383;
}

.summary-value {
  margin-left: 8px;
  color: var(--ion-color-dark);
}

.ticket-summary-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ticket-summary-row {
  display: flex;
  justify-content: space-between;
}

.ticket-summary-row p {
  margin: 0;
  font-size: 0.9rem;
}

.card-divider {
  height: 1px;
  background-color: #f1f1f1;
  margin: 0;
}

.custom-toolbar {
  --background: #7d6412;
  --color: #fff;
}

/* Pagination Styles */
.pagination-numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pagination-numbers ion-button {
  min-width: 36px;
  font-size: 0.9rem;
  --border-radius: 50%;
}

ion-footer ion-toolbar {
  --background: #ffffff;
  padding: 8px;
}

/* Filter accordion */
ion-accordion ion-item {
  --background: var(--ion-color-light);
}

ion-accordion-group {
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .ticket-card {
    margin: 10px;
  }

  .pagination-numbers {
    gap: 4px;
  }

  .pagination-numbers ion-button {
    min-width: 32px;
    font-size: 0.8rem;
  }
}
</style>
