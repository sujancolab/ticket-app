<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
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
        <ion-card
          v-for="ticket in tickets.data"
          :key="ticket.id"
          class="ticket-card"
          @click="viewTicket(ticket)"
        >
          <ion-card-header>
            <ion-card-title>
              <ion-icon
                :icon="documentText"
                style="vertical-align: middle; margin-right: 8px;"
              />
              <strong>{{ ticket.ticket_no }}</strong>
            </ion-card-title>
            <ion-chip :color="getStatusColor(ticket.status)" class="status-chip">
              <ion-label>{{ ticket.status }}</ion-label>
            </ion-chip>
          </ion-card-header>

          <ion-card-content class="ticket-summary-content">
            <div class="ticket-summary-row">
              <span class="summary-label">Machine:</span>
              <span class="summary-value"
                >{{ ticket.machine.name }} ({{ ticket.machine.far_no }})</span
              >
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Problem:</span>
              <span class="summary-value">{{
                truncateText(ticket.problem_description, 40)
              }}</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Site:</span>
              <span class="summary-value">{{
                ticket.site ? ticket.site.site_name : "-"
              }}</span>
            </div>
            <div class="ticket-summary-row">
              <span class="summary-label">Created:</span>
              <span class="summary-value">{{ formatDate(ticket.created_at) }}</span>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-list>

      <!-- Empty State -->
      <div
        v-if="!loading && (!tickets.data || tickets.data.length === 0)"
        class="empty-state"
      >
        <ion-icon :icon="documentText" size="large"></ion-icon>
        <p>No tickets found</p>
        <ion-button fill="clear" @click="navigateToAddTicket"
          >Create your first ticket</ion-button
        >
      </div>

      <!-- Pagination -->
      <ion-footer v-if="tickets.data && tickets.data.length > 0">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button
              shape="round"
              color="light"
              :disabled="!tickets.prev_page_url"
              @click="changePage(tickets.current_page - 1)"
            >
              Prev
            </ion-button>
          </ion-buttons>

          <div class="pagination-numbers">
            <ion-button
              v-for="page in getPageNumbers"
              :key="page"
              shape="round"
              size="small"
              :fill="tickets.current_page === page ? 'solid' : 'outline'"
              color="primary"
              @click="changePage(page)"
            >
              {{ page }}
            </ion-button>
          </div>

          <ion-buttons slot="end">
            <ion-button
              shape="round"
              color="light"
              :disabled="!tickets.next_page_url"
              @click="changePage(tickets.current_page + 1)"
            >
              Next
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>

      <!-- Filter Modal -->
      <ion-modal :is-open="filterModalOpen" @didDismiss="filterModalOpen = false">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Filter Tickets</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="filterModalOpen = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-accordion-group>
            <ion-accordion value="dateFilters">
              <ion-item slot="header"><ion-label>Date Filters</ion-label></ion-item>
              <div class="ion-padding" slot="content">
                <ion-item>
                  <ion-label position="stacked">Date From</ion-label>
                  <ion-datetime v-model="search.date_from" presentation="date" />
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Date To</ion-label>
                  <ion-datetime v-model="search.date_to" presentation="date" />
                </ion-item>
              </div>
            </ion-accordion>

            <ion-accordion value="machineFilters">
              <ion-item slot="header"
                ><ion-label>Machine / Site</ion-label></ion-item
              >
              <div class="ion-padding" slot="content">
                <ion-item>
                  <ion-label position="stacked">Machine</ion-label>
                  <ion-select v-model="search.machine_id" placeholder="Select machine">
                    <ion-select-option
                      v-for="m in search_machines"
                      :key="m.id"
                      :value="m.id"
                      >{{ m.far_no }} - {{ m.name }}</ion-select-option
                    >
                  </ion-select>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Site</ion-label>
                  <ion-select v-model="search.site_id" placeholder="Select site">
                    <ion-select-option
                      v-for="s in search_sites"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.site_name }}</ion-select-option
                    >
                  </ion-select>
                </ion-item>
              </div>
            </ion-accordion>

            <ion-accordion value="statusFilters">
              <ion-item slot="header"
                ><ion-label>Status / Type</ion-label></ion-item
              >
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
                  <ion-select
                    v-model="search.ticket_type"
                    placeholder="Select type"
                  >
                    <ion-select-option value="Breakdown Maintenance"
                      >Breakdown Maintenance</ion-select-option
                    >
                    <ion-select-option value="Periodic Maintenance"
                      >Periodic Maintenance</ion-select-option
                    >
                  </ion-select>
                </ion-item>
              </div>
            </ion-accordion>
          </ion-accordion-group>

          <ion-grid class="ion-margin-top">
            <ion-row>
              <ion-col size="6">
                <ion-button expand="block" color="primary" @click="applyFilters"
                  >Apply</ion-button
                >
              </ion-col>
              <ion-col size="6">
                <ion-button expand="block" color="medium" @click="resetFilters"
                  >Reset</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
      </ion-modal>

      <!-- Ticket Detail Modal -->
      <ion-modal :is-open="viewModalOpen" @didDismiss="closeViewModal">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Ticket Details</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeViewModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content v-if="selectedTicket">
          <ion-card-header>
            <ion-card-title>
              <ion-icon
                :icon="documentText"
                style="vertical-align: middle; margin-right: 8px;"
                color="primary"
              />
              {{ selectedTicket.ticket_no }}
            </ion-card-title>
            <ion-chip
              :color="getStatusColor(selectedTicket.status)"
              class="status-chip"
            >
              <ion-label>{{ selectedTicket.status }}</ion-label>
            </ion-chip>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Machine:</strong> {{ selectedTicket.machine.name }}</p>
            <p><strong>Problem:</strong> {{ selectedTicket.problem_description }}</p>
            <p><strong>Site:</strong> {{ selectedTicket.site?.site_name || '-' }}</p>
            <p><strong>Created:</strong> {{ formatDate(selectedTicket.created_at) }}</p>
          </ion-card-content>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton,
  IonButton, IonIcon, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonChip, IonLabel, IonModal, IonSelect, IonSelectOption, IonItem, IonDatetime,
  IonGrid, IonRow, IonCol, IonAccordion, IonAccordionGroup, toastController
} from "@ionic/vue";
import { documentText, refresh, filter } from "ionicons/icons";
import axios from "axios";

const loading = ref(true);
const filterModalOpen = ref(false);
const viewModalOpen = ref(false);
const tickets = ref<any>({});
const selectedTicket = ref<any>(null);
const search_machines = ref<any[]>([]);
const search_sites = ref<any[]>([]);

const search = ref({
  page: 1,
  machine_id: "",
  site_id: "",
  ticket_type: "",
  ticket: "",
  date_from: "",
  date_to: "",
  status: "",
});

onMounted(() => {
  loadTickets();
  loadInitialData();
});

const api = axios.create({
  baseURL: "https://dummymm.tech-trico.com",
  timeout: 10000,
});

const loadTickets = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/ticket-app", { params: search.value });
    tickets.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadInitialData = async () => {
  try {
    const response = await axios.get("/api/initial_ticket");
    search_machines.value = response.data.data.machines;
    search_sites.value = response.data.data.sites;
  } catch (error) {
    console.error(error);
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

const formatDate = (dateString: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

const truncateText = (text: string, maxLength: number) =>
  text?.length > maxLength ? text.substring(0, maxLength) + "..." : text;

const getStatusColor = (status: string) =>
  status.toLowerCase() === "open"
    ? "warning"
    : status.toLowerCase() === "closed"
    ? "success"
    : "medium";

const openFilterModal = () => (filterModalOpen.value = true);
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
    status: "",
  };
  filterModalOpen.value = false;
  loadTickets();
};
const changePage = (page: number) => {
  search.value.page = page;
  loadTickets();
};

const viewTicket = (ticket: any) => {
  selectedTicket.value = ticket;
  viewModalOpen.value = true;
};
const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedTicket.value = null;
};
const refreshTickets = () => loadTickets();

const navigateToAddTicket = () => {
  window.location.href = "/app/add-ticket";
};
</script>
