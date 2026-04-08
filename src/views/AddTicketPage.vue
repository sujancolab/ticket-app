<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-buttons slot="start">
          <ion-menu-button class="menu-btn"></ion-menu-button>
        </ion-buttons>
        <ion-title class="header-title">
          {{ form.id ? 'Update Ticket' : 'Create New Ticket' }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="resetForm">
            <ion-icon :icon="refreshOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="professional-content" style="--background: #f2f2f2; ">
      <div style="padding: 5px;">
        <form @submit.prevent="submitTicket" class="professional-form">
          <!-- Machine Configuration Section -->
          <ion-card class="form-section">
            <ion-card-header style="padding: 0px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ion-icon :icon="settingsOutline" color="primary" class="section-icon"></ion-icon>
                <h5 style="margin: 0; color: black;">Machine Configuration</h5>
              </div>
            </ion-card-header>
            <ion-card-content style="padding: 0px;">
              <div class="form-grid">
                <!-- Machine Site -->

                <!-- <label class="field-label">
                    Machine Site <span class="required-indicator">*</span>
                  </label> -->
                <ion-select v-model="form.site_id" interface="action-sheet" placeholder="Select Machine Site"
                  label="Machine Site *" labelPlacement="floating" @ionChange="onSiteChange"
                  :class="['border-bottom-select', { 'field-error': submitted && !form.site_id }]"
                  style="color: black;">
                  <ion-select-option v-for="site in sites" :key="site.id" :value="site.id">
                    {{ site.site_name }}
                  </ion-select-option>
                </ion-select>
                <div v-if="submitted && !form.site_id" class="error-message">
                  <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                  Site selection is required
                </div>


                <!-- Machine Category -->

                <!-- <label class="field-label">
                    Machine Category <span class="required-indicator">*</span>
                  </label> -->
                <ion-select v-model="form.category_id" interface="action-sheet" placeholder="Select Category"
                  label="Machine Category *" labelPlacement="floating" @ionChange="onCategoryChange"
                  :class="['border-bottom-select', { 'field-error': submitted && !form.category_id }]"
                  style="color: black;">
                  <ion-select-option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </ion-select-option>
                </ion-select>
                <div v-if="submitted && !form.category_id" class="error-message">
                  <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                  Category selection is required
                </div>


                <!-- Machine Sub Category -->

                <ion-select v-model="form.sub_category_id" interface="alert" placeholder="Select Sub Category"
                  label="Machine Sub Category *" labelPlacement="floating" @ionChange="onSubCategoryChange"
                  :class="['border-bottom-select', { 'field-error': submitted && !form.sub_category_id }]"
                  style="color: black;">
                  <ion-select-option v-for="subCategory in sub_categories" :key="subCategory.id"
                    :value="subCategory.id">
                    {{ subCategory.name }}
                  </ion-select-option>
                </ion-select>
                <div v-if="submitted && !form.sub_category_id" class="error-message">
                  <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                  Sub Category selection is required
                </div>


                <!-- Select Machine -->

                <ion-select v-model="form.machine_id" interface="alert" placeholder="Choose Machine"
                  @ionChange="onMachineChange" label="Select Machine *" labelPlacement="floating"
                  :class="['border-bottom-select', { 'field-error': submitted && !form.machine_id }]"
                  style="color: black;">
                  <ion-select-option v-for="machine in machines" :key="machine.id" :value="machine.id">
                    {{ getMachineLabel(machine) }}
                  </ion-select-option>
                </ion-select>
                <div v-if="submitted && !form.machine_id" class="error-message">
                  <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                  Machine selection is required
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Problem Details Section -->

          <ion-card class="form-section">
            <ion-card-header style="padding: 0px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ion-icon :icon="bugOutline" color="primary" class="section-icon"></ion-icon>
                <h5 style="margin: 0; color: black;">Problem Details</h5>
              </div>
            </ion-card-header>
            <ion-card-content style="padding: 0px;">

              <div class="form-grid">
                <!-- Problem Description -->
                <div class="form-field full-width">
                  <label class="field-label">Machine's Problem Description</label>
                  <ion-textarea v-model="form.problem_description"
                    placeholder="Describe the machine's problem in detail..." rows="4"
                    class="professional-textarea"></ion-textarea>
                </div>

                <!-- Complaint Nature -->
                <ion-select v-model="form.complaint_nature" interface="alert" placeholder="Select Nature"
                  label="Complaint Nature *" labelPlacement="floating"
                  :class="['border-bottom-select', { 'field-error': submitted && !form.complaint_nature }]">
                  <ion-select-option value="Major">Major Issue</ion-select-option>
                  <ion-select-option value="Minor">Minor Issue</ion-select-option>
                </ion-select>
                <div v-if="submitted && !form.complaint_nature" class="error-message">
                  <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                  Complaint nature is required
                </div>

                <!-- Ticket Type -->

                <ion-select v-model="form.ticket_type" interface="floating" placeholder="Select Type"
                  label="Ticket Type *" labelPlacement="floating"
                  :disabled="form.id != '' && form.ticket_type && pop_ticket && pop_ticket.status == 'Open'"
                  :class="['border-bottom-select', { 'field-error': submitted && !form.ticket_type }]">
                  <ion-select-option value="Periodic Maintenance">Periodic Maintenance</ion-select-option>
                  <ion-select-option value="Breakdown Maintenance">Breakdown Maintenance</ion-select-option>
                </ion-select>
                <div v-if="submitted && !form.ticket_type" class="error-message">
                  <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                  Ticket type is required
                </div>

                <!-- Status During Complaint -->
                <ion-select v-model="form.status_during_complaint" interface="floating" placeholder="Select Status"
                  label="Status During Complaint *" labelPlacement="floating"
                  :class="['border-bottom-select', { 'field-error': submitted && !form.status_during_complaint }]">
                  <ion-select-option value="Running">Running</ion-select-option>
                  <ion-select-option value="Running with problem">Running with problem</ion-select-option>
                  <ion-select-option value="Breakdown" v-if="form.ticket_type === 'Breakdown Maintenance'">
                    Breakdown
                  </ion-select-option>
                </ion-select>
                <div v-if="submitted && !form.status_during_complaint" class="error-message">
                  <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                  Status during complaint is required
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Maintenance Provider Section -->
          <ion-card class="form-section">
            <ion-card-header style="padding: 0px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ion-icon :icon="peopleOutline" color="primary" class="section-icon"></ion-icon>
                <h5 style="margin: 0; color: black;">Maintenance Provider</h5>
              </div>
            </ion-card-header>
            <ion-card-content style="padding: 0px;">

              <div class="form-grid">
                <!-- Maintenance Provider -->
                <div class="form-field">
                  <!-- <label class="field-label">
                    Maintenance Provider <span class="required-indicator">*</span>
                  </label> -->
                  <ion-segment color="primary" v-model="form.maintenance_provider"
                    @ionChange="onMaintenanceProviderChange" class="professional-segment">
                    <ion-segment-button value="vendor" color="primary">
                      <span style="display: flex; align-items: center; gap: 6px;">
                        <ion-icon :icon="businessOutline"></ion-icon>
                        <span>Vendor</span>
                      </span>
                    </ion-segment-button>
                    <ion-segment-button value="user" color="primary">
                      <span style="display: flex; align-items: center; gap: 6px;">
                        <ion-icon :icon="personOutline"></ion-icon>
                        <span>Internal User</span>
                      </span>
                    </ion-segment-button>
                  </ion-segment>
                </div>

                <!-- Vendor Selection -->
                <div v-if="form.maintenance_provider === 'vendor'">
                  <ion-select v-model="form.vendor_id" interface="action-sheet" multiple placeholder="Choose Vendors"
                    label="Select Vendor *" labelPlacement="floating"
                    :class="['border-bottom-select', { 'field-error': submitted && form.maintenance_provider === 'vendor' && !form.vendor_id.length }]">
                    <ion-select-option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </ion-select-option>
                  </ion-select>
                  <div v-if="submitted && form.maintenance_provider === 'vendor' && !form.vendor_id.length"
                    class="error-message">
                    <ion-icon :icon="alertCircleOutline" color="primary" class="error-icon"></ion-icon>
                    Vendor selection is required
                  </div>
                </div>

                <!-- User Selection -->
                <div v-if="form.maintenance_provider === 'user'">
                  <ion-select v-model="form.user_id" interface="action-sheet" placeholder="Choose User"
                    label="Select User *" labelPlacement="floating"
                    :class="['border-bottom-select', { 'field-error': submitted && form.maintenance_provider === 'user' && !form.user_id }]">
                    <ion-select-option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </ion-select-option>
                  </ion-select>
                  <div v-if="submitted && form.maintenance_provider === 'user' && !form.user_id" class="error-message">
                    <ion-icon :icon="alertCircleOutline" color="primary" class="error-icon"></ion-icon>
                    User selection is required
                  </div>
                </div>

                <!-- Service Type for Vendor -->
                <div class="form-field full-width" v-if="form.maintenance_provider === 'vendor'">
                  <label class="field-label">Service Type</label>
                  <ion-radio-group v-model="form.service_type" class="service-type-group" color="primary">
                    <div class="radio-option" style="justify-content: space-between;">
                      <div class="radio-content">
                        <ion-icon :icon="cardOutline" color="primary" class="radio-icon"
                          style="font-size: 24px;"></ion-icon>
                        <span>Paid Service</span>
                      </div>
                      <ion-radio value="Paid Service" :disabled="form.id != ''" class="professional-radio"></ion-radio>
                    </div>
                    <div class="radio-option" style="justify-content: space-between; margin-top: 10px;">
                      <div class="radio-content">
                        <ion-icon :icon="giftOutline" color="primary" class="radio-icon"
                          style="font-size: 24px;"></ion-icon>
                        <span>Free Service</span>
                      </div>
                      <ion-radio value="Free Service"
                        :disabled="form.id != '' || (selected_machine && (selected_machine.completed_free_service >= selected_machine.free_service_no))"
                        class="professional-radio"></ion-radio>
                    </div>
                  </ion-radio-group>
                </div>

                <!-- Free Service Number -->
                <div class="form-field" v-if="form.service_type === 'Free Service'">
                  <label class="field-label">Free Service Number</label>
                  <div class="service-number-display">
                    <ion-input v-model="form.free_service_no" readonly class="professional-input"></ion-input>
                    <span class="service-total">/ {{ selected_machine ? selected_machine.free_service_no : '' }}</span>
                  </div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Schedule & Timeline Section -->
          <ion-card class="form-section">
            <ion-card-header style="padding: 0px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ion-icon :icon="calendarOutline" color="primary" class="section-icon"></ion-icon>
                <h5 style="margin: 0; color: black;">Schedule & Timeline</h5>
              </div>
            </ion-card-header>
            <ion-card-content style="padding: 0px;">

              <div class="form-grid">
                <!-- Expected Date of Maintenance -->
                <div class="form-field">
                  <label class="field-label">
                    Expected Date of Maintenance <span class="required-indicator">*</span>
                  </label>
                  <ion-datetime v-model="form.likely_date" presentation="date" :min="new Date().toISOString()"
                    :disabled="form.id != '' && form.likely_date != '' && pop_ticket && pop_ticket.status == 'Open'"
                    class="professional-datetime"
                    :class="{ 'field-error': submitted && !form.likely_date }"></ion-datetime>
                  <div v-if="submitted && !form.likely_date" class="error-message">
                    <ion-icon :icon="alertCircleOutline" color="primary" class="error-icon"></ion-icon>
                    Expected date is required
                  </div>
                </div>

                <!-- Breakdown Date & Time -->
                <div class="form-field"
                  v-if="form.ticket_type === 'Breakdown Maintenance' && form.status_during_complaint === 'Breakdown'">
                  <label class="field-label">
                    Breakdown Date & Time <span class="required-indicator">*</span>
                  </label>
                  <ion-datetime v-model="form.actual_fault_date" presentation="date-time"
                    :max="new Date().toISOString()"
                    :disabled="form.id != '' && form.actual_fault_date != '' && pop_ticket && pop_ticket.status == 'Open'"
                    class="professional-datetime"
                    :class="{ 'field-error': submitted && !form.actual_fault_date }"></ion-datetime>
                  <div v-if="submitted && !form.actual_fault_date" class="error-message">
                    <ion-icon :icon="alertCircleOutline" color="primary" class="error-icon"></ion-icon>
                    Breakdown date is required
                  </div>
                </div>

                <!-- Revised Expected Date -->
                <div class="form-field" v-if="expired_likely_date && form.id">
                  <label class="field-label">Revised Expected Date</label>
                  <ion-datetime v-model="form.reversion_date" presentation="date" :min="new Date().toISOString()"
                    :disabled="form.id != '' && pop_ticket.reversion_date != '' && pop_ticket.reversion_date != 'null' && pop_ticket.reversion_date != null"
                    class="professional-datetime"></ion-datetime>
                </div>

                <!-- Reason for Date Revision -->
                <div class="form-field" v-if="expired_likely_date && form.id">
                  <label class="field-label">Reason for Date Revision</label>
                  <ion-input v-model="form.reversion_reason" placeholder="Enter revision reason..."
                    :disabled="form.id != '' && pop_ticket.reversion_date != '' && pop_ticket.reversion_date != 'null' && pop_ticket.reversion_date != null"
                    class="professional-input"></ion-input>
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Cost Estimation Section -->

          <ion-card class="form-section">
            <ion-card-header style="padding: 0px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ion-icon color="primary" :icon="calculatorOutline" class="section-icon"></ion-icon>
                <h5 style="margin: 0; color: black;">Cost Estimation</h5>
              </div>
            </ion-card-header>
            <ion-card-content style="padding: 0px;">

              <div class="form-grid">
                <ion-input v-model="form.estimated_material_cost" type="number" placeholder="0.00"
                  label="Estimated Material Cost" label-placement="floating" class="border-bottom-select"></ion-input>




                <div class="form-field">
                  <label class="field-label">Supporting Files</label>
                  <div class="file-upload-area">
                    <input type="file" @change="uploadMaterialCost" multiple ref="filematerial" class="file-input"
                      id="material-files" />
                    <label for="material-files" class="file-upload-label">
                      <ion-icon color="primary" :icon="cloudUploadOutline" class="upload-icon"></ion-icon>
                      <span>Upload Files</span>
                    </label>
                  </div>
                </div>

                <ion-input v-model="form.estimated_service_cost" type="number" placeholder="0.00"
                  label="Estimated Service Cost" label-placement="floating" class="border-bottom-select"></ion-input>

                <div class="form-field">
                  <label class="field-label">Supporting Files</label>
                  <div class="file-upload-area">
                    <input type="file" @change="uploadServiceCost" multiple ref="fileservice" class="file-input"
                      id="service-files" />
                    <label for="service-files" class="file-upload-label">
                      <ion-icon color="primary" :icon="cloudUploadOutline" class="upload-icon"></ion-icon>
                      <span>Upload Files</span>
                    </label>
                  </div>
                </div>


              </div>



            </ion-card-content>
          </ion-card>

          <!-- Stages Section (Edit Mode) -->
          <div class="form-section" v-if="form.id">
            <div class="section-header">
              <ion-icon color="primary" :icon="listOutline" class="section-icon"></ion-icon>
              <h2>Project Stages</h2>
              <ion-button @click="AddStage" fill="outline" size="small" class="add-stage-btn"
                :disabled="form.stages.length > 0 && !last_stage_index && !last_stage_date">
                <ion-icon color="primary" :icon="addOutline" slot="start"></ion-icon>
                Add Stage
              </ion-button>
            </div>

            <div class="stages-container">
              <div class="stages-header">
                <div class="stage-col">Stage</div>
                <div class="stage-col">Date</div>
                <div class="stage-col">Description</div>
                <div class="stage-col-action">Action</div>
              </div>

              <div v-for="(field, x) in form.stages" :key="'s' + x" class="stage-row">
                <div class="stage-col">
                  <ion-select v-model="field.stage_no" :disabled="x < form.stages.length - 1" interface="popover"
                    placeholder="Select stage" class="professional-select stage-select">
                    <ion-select-option v-for="(stg, index) in opn_stage" :key="index" :value="stg"
                      :disabled="index < last_stage_index">
                      {{ stg | camelCase }}
                    </ion-select-option>
                  </ion-select>
                </div>
                <div class="stage-col">
                  <ion-datetime v-model="field.stage_date" presentation="date" :min="last_stage_date"
                    :max="new Date().toISOString()" class="professional-datetime stage-datetime"></ion-datetime>
                </div>
                <div class="stage-col">
                  <ion-input v-model="field.description" placeholder="Enter Description"
                    class="professional-input stage-input"></ion-input>
                </div>
                <div class="stage-col-action">
                  <ion-button @click="form.stages.splice(x, 1)" v-if="form.stages.length == x + 1" fill="clear"
                    color="danger" size="small">
                    <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
                  </ion-button>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Problems Section (Edit Mode) -->
          <div class="form-section" v-if="form.id">
            <div class="section-header">
              <ion-icon :icon="addCircleOutline" class="section-icon"></ion-icon>
              <h2>Additional Problems</h2>
              <ion-button @click="AddProblem" fill="outline" size="small" class="add-problem-btn">
                <ion-icon :icon="addOutline" slot="start"></ion-icon>
                Add Problem
              </ion-button>
            </div>

            <div class="problems-container">
              <div class="problems-header">
                <div class="problem-col">Problem Description</div>
                <div class="problem-col">Material Cost</div>
                <div class="problem-col">Service Cost</div>
                <div class="problem-col-action">Action</div>
              </div>

              <div v-for="(field, x) in form.problems" :key="'ap' + x" class="problem-row">
                <div class="problem-col">
                  <ion-input v-model="field.problem" placeholder="Describe the problem..."
                    class="professional-input problem-input"></ion-input>
                </div>
                <div class="problem-col">
                  <ion-input v-model="field.estimated_material_cost" type="number" placeholder="0.00"
                    class="professional-input cost-input"></ion-input>
                </div>
                <div class="problem-col">
                  <ion-input v-model="field.estimated_service_cost" type="number" placeholder="0.00"
                    class="professional-input cost-input"></ion-input>
                </div>
                <div class="problem-col-action">
                  <ion-button @click="form.problems.splice(x, 1)" fill="clear" color="danger" size="small">
                    <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
                  </ion-button>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Actions -->
          <div class="form-actions">
            <ion-button expand="block" type="submit" :disabled="isSaving" size="large">
              <ion-spinner v-if="isSaving" name="crescent"></ion-spinner>
              <ion-icon v-else :icon="form.id ? saveOutline : addOutline" slot="start"></ion-icon>
              <span v-if="!isSaving">{{ form.id ? 'Update Ticket' : 'Create Ticket' }}</span>
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButton, IonMenuButton, IonSpinner, IonRadio, IonRadioGroup,
  IonDatetime, IonIcon, IonSegment, IonSegmentButton, toastController
} from '@ionic/vue';
import {
  ticketOutline as ticketIcon, refreshOutline, settingsOutline, bugOutline,
  peopleOutline, businessOutline, personOutline, calendarOutline,
  calculatorOutline, cubeOutline, constructOutline, cloudUploadOutline,
  listOutline, addOutline, addCircleOutline, trashOutline, saveOutline,
  alertCircleOutline, cardOutline, giftOutline
} from 'ionicons/icons';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummymm.tech-trico.com',
  timeout: 10000,
});

interface Ticket {
  id?: string;
  site_id: string;
  category_id: string;
  sub_category_id: string;
  machine_id: string;
  problem_description: string;
  complaint_nature: string;
  maintenance_provider: string;
  vendor_id: string[];
  user_id: string;
  service_type: string;
  free_service_no: string;
  ticket_type: string;
  status_during_complaint: string;
  likely_date: string;
  actual_fault_date: string;
  reversion_date: string;
  reversion_reason: string;
  estimated_material_cost: string;
  estimated_service_cost: string;
  stages: Array<{
    stage_no: string;
    stage_date: string;
    description: string;
  }>;
  problems: Array<{
    problem: string;
    estimated_material_cost: string;
    estimated_service_cost: string;
  }>;
}

const router = useRouter();
const route = useRoute();
const form = ref<Ticket>({
  site_id: '',
  category_id: '',
  sub_category_id: '',
  machine_id: '',
  problem_description: '',
  complaint_nature: 'Major',
  maintenance_provider: 'vendor',
  vendor_id: [],
  user_id: '',
  service_type: 'Paid Service',
  free_service_no: '',
  ticket_type: 'Periodic Maintenance',
  status_during_complaint: '',
  likely_date: '',
  actual_fault_date: '',
  reversion_date: '',
  reversion_reason: '',
  estimated_material_cost: '',
  estimated_service_cost: '',
  stages: [],
  problems: [],
});

const submitted = ref(false);
const isSaving = ref(false);
const expired_likely_date = ref(false);
const pop_ticket = ref<any>(null);
const selected_machine = ref<any>(null);
const selecting_from = ref('site');

// Data lists
const sites = ref<any[]>([]);
const categories = ref<any[]>([]);
const sub_categories = ref<any[]>([]);
const users = ref<any[]>([]);
const machines = ref<any[]>([]);
const opn_stage = ref([
  'Vendor Exploration & RFQ Initiated',
  'Vendor created',
  'Vendor Assigned',
  'Sent for Approval',
  'Approval Receipt',
  'Order issued',
  'Payment under process',
  'Payment Done',
  'Logistics under process',
  'Materials despatched',
  'Material received at site',
  'Maintainace under progress',
  'Job Completed'
]);
const last_stage_index = ref(0);
const last_stage_date = ref('');

// File uploads
const MaterialCost = ref<FileList | null>(null);
const ServiceCost = ref<FileList | null>(null);

// Methods
const getMachineLabel = (machine: any) => {
  return `${machine.far_no || ''} - ${machine.name} - ${machine.machine_model?.name || 'null'} - ${machine.machine_sr_no}`;
};

const onSiteChange = () => {
  if (selecting_from.value === 'site') {
    get_machine();
  }
};

const onCategoryChange = () => {
  api.get(`api/category-app/${form.value.category_id}`).then((res) => {
    sub_categories.value = res.data.data;
  });
  if (selecting_from.value === 'site') {
    get_machine();
  }
};

const onSubCategoryChange = () => {
  selecting_from.value = 'site';
  if (selecting_from.value === 'site') {
    get_machine();
  }
};

const onMachineChange = () => {
  selected_machine.value = machines.value.find(x => x.id === form.value.machine_id);
  check_free_service();
  fetch_site_category(form.value.machine_id);
};

const onMaintenanceProviderChange = () => {
  if (form.value.maintenance_provider !== 'vendor') {
    form.value.service_type = 'Paid Service';
  }
  if (form.value.maintenance_provider === 'vendor' && form.value.maintenance_provider === 'user') {
    form.value.user_id = '';
  }
  if (form.value.maintenance_provider === 'user' && form.value.maintenance_provider === 'vendor') {
    form.value.vendor_id = [];
  }

  api.get("api/ticket-user/list", {
    params: {
      type: form.value.maintenance_provider
    }
  }).then(response => {
    users.value = response.data.data;
  }).catch(() => console.warn('Oh. Something went wrong'));
};

const AddStage = () => {
  form.value.stages.push({
    stage_no: '',
    stage_date: '',
    description: '',
  });
};

const AddProblem = () => {
  form.value.problems.push({
    problem: '',
    estimated_material_cost: '',
    estimated_service_cost: '',
  });
};

const uploadMaterialCost = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    MaterialCost.value = target.files;
  }
};

const uploadServiceCost = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    ServiceCost.value = target.files;
  }
};

const check_free_service = async () => {
  if (selected_machine.value) {
    if (selected_machine.value.completed_free_service >= selected_machine.value.free_service_no) {
      form.value.service_type = 'Paid Service';
      form.value.free_service_no = '';
    } else {
      form.value.free_service_no = (selected_machine.value.completed_free_service + 1).toString();
    }
  }
};

const get_machine = async () => {
  if (form.value.id === '') {
    form.value.machine_id = '';
  }

  api.get("/api/ticket_machine-app", {
    params: {
      site_id: form.value.site_id,
      category_id: form.value.category_id,
      sub_category_id: form.value.sub_category_id,
      id: form.value.id
    }
  }).then(response => {
    machines.value = response.data.data;
  }).catch(() => console.warn('Oh. Something went wrong'));
};

const fetch_site_category = async (machine_id: string) => {
  if (machine_id) {
    selecting_from.value = "machine";
    api.get("/api/machine-app", {
      params: {
        machine_id: machine_id
      }
    }).then(response => {
      if (response.data && response.data.data) {
        const current_site = response.data.data.data[0].current_site;
        form.value.site_id = current_site.id;
        form.value.category_id = response.data.data.data[0].category_id;

        setTimeout(() => {
          form.value.sub_category_id = response.data.data.data[0].sub_category_id;
        }, 1000);
      }
    }).catch(() => console.warn('Oh. Something went wrong'));
  }
};

const submitTicket = async () => {
  submitted.value = true;
  form.value.login_user_id = JSON.parse(localStorage.getItem('user')).id;

  // Basic validation
  if (!form.value.site_id || !form.value.category_id || !form.value.sub_category_id ||
    !form.value.machine_id || !form.value.complaint_nature || !form.value.maintenance_provider ||
    !form.value.ticket_type || !form.value.status_during_complaint || !form.value.likely_date) {
    const toast = await toastController.create({
      message: 'Please fill in all required fields',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
    return;
  }

  // Additional validation based on maintenance provider
  if (form.value.maintenance_provider === 'vendor' && !form.value.vendor_id.length) {
    const toast = await toastController.create({
      message: 'Please select at least one vendor',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
    return;
  }

  if (form.value.maintenance_provider === 'user' && !form.value.user_id) {
    const toast = await toastController.create({
      message: 'Please select a user',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
    return;
  }

  isSaving.value = true;

  try {
    let response;
    if (form.value.id) {
      // Update existing ticket
      response = await api.put(`/api/ticket-save/${form.value.id}`, form.value);
    } else {
      // Create new ticket
      response = await api.post('/api/ticket-save', form.value);
    }

    if (response.data.success) {
      // Upload files if any
      if (MaterialCost.value || ServiceCost.value) {
        await upload_files(response.data.data.id);
      }

      const toast = await toastController.create({
        message: response.data.message,
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      await toast.present();

      router.push({ name: 'Tickets' });
    }
  } catch (err) {
    console.error(err);
    const toast = await toastController.create({
      message: 'An error occurred while saving the ticket',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  } finally {
    isSaving.value = false;
  }
};

const upload_files = async (id: string) => {
  if (MaterialCost.value) {
    for (const file of Array.from(MaterialCost.value)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('file_type', 'Estimated Material');
      fd.append('ticket_id', id);
      await api.post('api/ticket/files', fd);
    }
  }

  if (ServiceCost.value) {
    for (const file of Array.from(ServiceCost.value)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('file_type', 'Estimated Service');
      fd.append('ticket_id', id);
      await api.post('api/ticket/files', fd);
    }
  }
};

const resetForm = () => {
  form.value = {
    site_id: '',
    category_id: '',
    sub_category_id: '',
    machine_id: '',
    problem_description: '',
    complaint_nature: 'Major',
    maintenance_provider: 'vendor',
    vendor_id: [],
    user_id: '',
    service_type: 'Paid Service',
    free_service_no: '',
    ticket_type: 'Periodic Maintenance',
    status_during_complaint: '',
    likely_date: '',
    actual_fault_date: '',
    reversion_date: '',
    reversion_reason: '',
    estimated_material_cost: '',
    estimated_service_cost: '',
    stages: [],
    problems: [],
  };
  submitted.value = false;
};

// Initialize form data
onMounted(() => {
  resetForm();

  selected_machine.value = null;
  pop_ticket.value = null;
  expired_likely_date.value = false;
  machines.value = [];
  sub_categories.value = [];
  users.value = [];


  // Load initial data
  api.get("https://dummymm.tech-trico.com/api/get_pre_machine-app").then((res) => {
    categories.value = res.data.data.Category;
    sites.value = res.data.data.sites;

    onMaintenanceProviderChange();
  });

  if (!route.params.id) {
    api.get("/api/initial_ticket").then(response => {
      users.value = response.data.data.vendors;
      machines.value = response.data.data.machines;
    }).catch(() => console.warn('Oh. Something went wrong'));
  } else {
    // Load existing ticket data
    form.value.id = route.params.id as string;
    api.get("api/ticket/" + route.params.id)
      .then((res) => {
        const ticket = res.data.data;
        pop_ticket.value = ticket;
        form.value = {
          ...form.value,
          ...ticket,
          likely_date: ticket.likely_date ? new Date(ticket.likely_date).toISOString() : '',
          actual_fault_date: ticket.actual_ticket_open_datetime ? new Date(ticket.actual_ticket_open_datetime).toISOString() : '',
          vendor_id: ticket.allocated_vendors.map((g: any) => g.id),
        };

        if (ticket.stages && ticket.stages.length > 0) {
          form.value.stages = ticket.stages;
        }
      })
      .catch(() => {
        router.push({ name: 'Tickets' });
      });
  }

  // Watch for changes in likely_date
  watch(() => form.value.likely_date, (newVal) => {
    if (newVal) {
      const specific_date = new Date(newVal);
      const current_date = new Date();
      expired_likely_date.value = current_date.getTime() > specific_date.getTime();
    } else {
      expired_likely_date.value = false;
    }
  });

  // Watch for changes in stages
  watch(() => form.value.stages, (newVal) => {
    if (newVal && newVal.length > 0) {
      const la = newVal[newVal.length - 1];
      if (la.stage_no) {
        last_stage_index.value = opn_stage.value.indexOf(la.stage_no);
      }
      if (la.stage_date && la.stage_date !== '0000-00-00') {
        last_stage_date.value = new Date(la.stage_date).toISOString();
      }
    } else {
      last_stage_index.value = 0;
      if (pop_ticket.value && pop_ticket.value.created_at) {
        last_stage_date.value = new Date(pop_ticket.value.created_at).toISOString();
      } else {
        last_stage_date.value = new Date().toISOString();
      }
    }
  }, { deep: true });
});

// Filters
const camelCase = (value: string) => {
  if (!value) return '';
  return value.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};
</script>

<style scoped>
/* Clean Professional Styling */
* {
  box-sizing: border-box;
}

/* Header Styles */
.professional-header {
  --background: #ffffff;
}

.header-toolbar {
  --background: #ffffff;
  --color: #1f2937;
  padding: 8px 16px;
  height: 60px;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 18px;
}

.title-icon {
  color: #3b82f6;
  font-size: 20px;
}

.reset-btn {
  --color: #6b7280;
  --border-color: #d1d5db;
  font-size: 14px;
}

/* Content Layout */
.professional-content {
  --background: #f8fafc;
}

.form-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.professional-form {
  display: flex;
  flex-direction: column;
}

/* Form Sections */
.form-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.section-icon {
  color: #3b82f6;
  font-size: 20px;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

/* Labels */
.field-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  margin-bottom: 4px;
}

.required-indicator {
  color: #dc2626;
}

/* Input Styles - Simplified */
.professional-input,
.professional-select,
.professional-textarea,
.professional-datetime {
  background: #ffffff !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  padding: 10px 12px !important;
  font-size: 14px !important;
  color: #1f2937 !important;
}

.professional-input:focus,
.professional-select:focus,
.professional-textarea:focus,
.professional-datetime:focus {
  border-color: #3b82f6 !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

.field-error {
  border-color: #dc2626 !important;
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}

.error-icon {
  font-size: 14px;
}

/* Segment Control */
.professional-segment {
  background: #f3f4f6 !important;
  border-radius: 6px !important;
  overflow: hidden;
}

.professional-segment ion-segment-button {
  --color: #6b7280;
  --color-checked: #ffffff;
  --background: transparent;
  --background-checked: #3b82f6;
  /* border-radius: 4px; */
  font-weight: 500;
}

/* Radio Buttons */
.service-type-group {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  flex: 1;
  cursor: pointer;
}

.radio-option:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #374151;
}

.radio-icon {
  color: #3b82f6;
  font-size: 16px;
}

/* Service Number */
.service-number-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.service-total {
  font-weight: 500;
  color: #6b7280;
  font-size: 14px;
}

/* Cost Cards */
.cost-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.cost-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.cost-card h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.cost-icon {
  color: #3b82f6;
  font-size: 18px;
}

.cost-input {
  background: #ffffff !important;
}

/* File Upload */
.file-input {
  display: none;
  /* border-bottom: 1px solid #d1d5db; */
}

.file-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #ffffff;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.file-upload-label:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f0f9ff;
}

.upload-icon {
  font-size: 16px;
}

/* Tables */
.stages-container,
.problems-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.stages-header,
.problems-header {
  background: #f3f4f6;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  display: grid;
  border-bottom: 1px solid #e5e7eb;
}

.stages-header {
  grid-template-columns: 2fr 1fr 2fr 80px;
}

.problems-header {
  grid-template-columns: 2fr 1fr 1fr 80px;
}

.stage-row,
.problem-row {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  display: grid;
  align-items: center;
  gap: 16px;
}

.stage-row {
  grid-template-columns: 2fr 1fr 2fr 80px;
}

.problem-row {
  grid-template-columns: 2fr 1fr 1fr 80px;
}

.stage-row:last-child,
.problem-row:last-child {
  border-bottom: none;
}

.stage-select,
.stage-input,
.stage-datetime,
.problem-input {
  background: #ffffff !important;
  border: 1px solid #d1d5db !important;
  border-radius: 4px !important;
  padding: 8px 10px !important;
  font-size: 13px !important;
}

/* Buttons */
.add-stage-btn,
.add-problem-btn {
  --color: #3b82f6;
  --border-color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
}

.submit-btn {
  background: #3b82f6 !important;
  color: #ffffff !important;
  border-radius: 8px !important;
  padding: 16px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  margin-top: 20px !important;
  height: 56px !important;
}

.submit-btn:hover {
  background: #2563eb !important;
}

.submit-spinner {
  margin-right: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-container {
    padding: 16px;
  }

  .form-section {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .cost-grid {
    grid-template-columns: 1fr;
  }

  .service-type-group {
    flex-direction: column;
    gap: 12px;
  }

  .stages-header,
  .stage-row,
  .problems-header,
  .problem-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .stages-header,
  .problems-header {
    text-align: center;
  }
}

/* Ionic overrides for better visibility */
ion-item {
  --background: transparent;
  --border-color: transparent;
  --inner-border-width: 0;
  --min-height: auto;
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-select,
ion-input,
ion-textarea,
ion-datetime {
  --background: #ffffff;
  --color: #1f2937;
  --placeholder-color: #9ca3af;
}

/* Clean up any ionic defaults that might interfere */
.form-field ion-select,
.form-field ion-input,
.form-field ion-textarea,
.form-field ion-datetime {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 10px;
  --padding-bottom: 10px;
}

.form-field ion-select:hover,
.form-field ion-input:hover,
.form-field ion-textarea:hover,
.form-field ion-datetime:hover {
  border-color: #9ca3af;
}

.form-field ion-select.ion-focused,
.form-field ion-input.ion-focused,
.form-field ion-textarea.ion-focused,
.form-field ion-datetime.ion-focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.label-text-wrapper {
  color: black !important;
}

.border-bottom-select {
  border-bottom: 1px solid #d1d5db !important;
  color: #374151;
  font-weight: 500;
}



ion-select::part(placeholder),
ion-select::part(text) {
  white-space: normal;
}

.action-sheet-group.sc-ion-action-sheet-md,
.alert-radio-group.sc-ion-alert-md,
.alert-checkbox-group.sc-ion-alert-md {
  max-height: 250px !important;
  /* adjust as needed */
  overflow-y: auto !important;
}

.custom-toolbar {
  --background: #7d6412;
  /* custom color */
  --color: #fff;
  /* text color */
}
</style>