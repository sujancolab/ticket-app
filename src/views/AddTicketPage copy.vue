<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ form.id ? 'Update' : 'Add' }} Ticket</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="resetForm">Reset</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="ion-padding">
        <form @submit.prevent="submitTicket">
          <ion-card>
            <ion-card-content>
              <!-- Machine Site -->
              <ion-item class="input-item">
                <ion-label position="stacked">Machine Site  <span class="required">*</span></ion-label>
                
                <ion-select
                  v-model="form.site_id"
                  interface="action-sheet"
                  @ionChange="onSiteChange"
                >
                  <ion-select-option 
                    v-for="site in sites" 
                    :key="site.id" 
                    :value="site.id"
                  >
                    {{ site.site_name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.site_id">Site is required</ion-note>
              </ion-item>
  
              <!-- Machine Category -->
              <ion-item class="input-item">
                <ion-label position="stacked">Machine Category <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.category_id"
                  interface="action-sheet"
                  @ionChange="onCategoryChange"
                >
                  <ion-select-option 
                    v-for="category in categories" 
                    :key="category.id" 
                    :value="category.id"
                  >
                    {{ category.name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.category_id">Category is required</ion-note>
              </ion-item>
  
              <!-- Machine Sub Category -->
              <ion-item class="input-item">
                <ion-label position="stacked">Machine Sub Category <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.sub_category_id"
                  interface="action-sheet"
                  @ionChange="onSubCategoryChange"
                >
                  <ion-select-option 
                    v-for="subCategory in sub_categories" 
                    :key="subCategory.id" 
                    :value="subCategory.id"
                  >
                    {{ subCategory.name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.sub_category_id">Sub Category is required</ion-note>
              </ion-item>
  
              <!-- Select Machine -->
              <ion-item class="input-item">
                <ion-label position="stacked">Select Machine <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.machine_id"
                  interface="action-sheet"
                
                  @ionChange="onMachineChange"
                >
                  <ion-select-option 
                    v-for="machine in machines" 
                    :key="machine.id" 
                    :value="machine.id"
                  >
                    {{ getMachineLabel(machine) }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.machine_id">Machine is required</ion-note>
              </ion-item>
  
              <!-- Problem Description -->
              <ion-item class="input-item">
                <ion-label position="stacked">Machine's Problem Description</ion-label>
                <ion-input
                  v-model="form.problem_description"
                  type="text"
                  placeholder="Enter Machine's problem..."
                ></ion-input>
              </ion-item>
  
              <!-- Complaint Nature -->
              <ion-item class="input-item">
                <ion-label position="stacked">Complaint Nature <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.complaint_nature"
                  interface="action-sheet"
                >
                  <ion-select-option value="Major">Major</ion-select-option>
                  <ion-select-option value="Minor">Minor</ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.complaint_nature">Complaint Nature is required</ion-note>
              </ion-item>
  
              <!-- Maintenance Provider -->
              <ion-item class="input-item">
                <ion-label position="stacked">Maintenance Provider <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.maintenance_provider"
                  interface="action-sheet"
                  @ionChange="onMaintenanceProviderChange"
                >
                  <ion-select-option value="vendor">Vendor</ion-select-option>
                  <ion-select-option value="user">Internal User</ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.maintenance_provider">Maintenance Provider is required</ion-note>
              </ion-item>
  
              <!-- Vendor/User Selection -->
              <ion-item class="input-item" v-if="form.maintenance_provider === 'vendor'">
                <ion-label position="stacked">Select Vendor <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.vendor_id"
                  interface="action-sheet"
                  multiple
                >
                  <ion-select-option 
                    v-for="user in users" 
                    :key="user.id" 
                    :value="user.id"
                  >
                    {{ user.name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && form.maintenance_provider === 'vendor' && !form.vendor_id.length">
                  Vendor is required
                </ion-note>
              </ion-item>
  
              <ion-item class="input-item" v-if="form.maintenance_provider === 'user'">
                <ion-label position="stacked">Select User <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.user_id"
                  interface="action-sheet"
                >
                  <ion-select-option 
                    v-for="user in users" 
                    :key="user.id" 
                    :value="user.id"
                  >
                    {{ user.name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && form.maintenance_provider === 'user' && !form.user_id">
                  User is required
                </ion-note>
              </ion-item>
  
              <!-- Service Type (only for vendor) -->
              <ion-item class="input-item" v-if="form.maintenance_provider === 'vendor'">
                <ion-label>Service Type</ion-label>
                <ion-radio-group v-model="form.service_type">
                  <ion-row>
                    <ion-col size="6">
                      <ion-item lines="none">
                        <ion-radio value="Paid Service" :disabled="form.id != ''"></ion-radio>
                        <ion-label>Paid Service</ion-label>
                      </ion-item>
                    </ion-col>
                    <ion-col size="6">
                      <ion-item lines="none">
                        <ion-radio 
                          value="Free Service" 
                          :disabled="form.id != '' || (selected_machine && (selected_machine.completed_free_service >= selected_machine.free_service_no))"
                        ></ion-radio>
                        <ion-label>Free Service</ion-label>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                </ion-radio-group>
              </ion-item>
  
              <!-- Free Service Number (only for free service) -->
              <ion-item class="input-item" v-if="form.service_type === 'Free Service'">
                <ion-label position="stacked">Free Service Number</ion-label>
                <ion-input
                  v-model="form.free_service_no"
                  type="text"
                  readonly
                ></ion-input>
                <ion-note slot="helper">
                  / {{ selected_machine ? selected_machine.free_service_no : '' }}
                </ion-note>
              </ion-item>
  
              <!-- Ticket Type -->
              <ion-item class="input-item">
                <ion-label position="stacked">Ticket Type <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.ticket_type"
                  interface="action-sheet"
                  :disabled="form.id != '' && form.ticket_type && pop_ticket && pop_ticket.status == 'Open'"
                >
                  <ion-select-option value="Periodic Maintenance">Periodic Maintenance</ion-select-option>
                  <ion-select-option value="Breakdown Maintenance">Breakdown Maintenance</ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.ticket_type">Ticket Type is required</ion-note>
              </ion-item>
  
              <!-- Status During Complaint -->
              <ion-item class="input-item">
                <ion-label position="stacked">Status During Complaint <span class="required">*</span></ion-label>
                <ion-select
                  v-model="form.status_during_complaint"
                  interface="action-sheet"
                >
                  <ion-select-option value="Running">Running</ion-select-option>
                  <ion-select-option value="Running with problem">Running with problem</ion-select-option>
                  <ion-select-option 
                    value="Breakdown"
                    v-if="form.ticket_type === 'Breakdown Maintenance'"
                  >
                    Breakdown
                  </ion-select-option>
                </ion-select>
                <ion-note slot="error" v-if="submitted && !form.status_during_complaint">
                  Status During Complaint is required
                </ion-note>
              </ion-item>
  
              <!-- Expected Date of Maintenance -->
              <ion-item class="input-item">
                <ion-label position="stacked">Expected Date of Maintenance <span class="required">*</span></ion-label>
                <ion-datetime
                  v-model="form.likely_date"
                  presentation="date"
                  :min="new Date().toISOString()"
                  :disabled="form.id != '' && form.likely_date != '' && pop_ticket && pop_ticket.status == 'Open'"
                ></ion-datetime>
                <ion-note slot="error" v-if="submitted && !form.likely_date">
                  Expected Date is required
                </ion-note>
              </ion-item>
  
              <!-- Breakdown Date & Time -->
              <ion-item 
                class="input-item"
                v-if="form.ticket_type === 'Breakdown Maintenance' && form.status_during_complaint === 'Breakdown'"
              >
                <ion-label position="stacked">Breakdown Date & Time <span class="required">*</span></ion-label>
                <ion-datetime
                  v-model="form.actual_fault_date"
                  presentation="date-time"
                  :max="new Date().toISOString()"
                  :disabled="form.id != '' && form.actual_fault_date != '' && pop_ticket && pop_ticket.status == 'Open'"
                ></ion-datetime>
                <ion-note slot="error" v-if="submitted && !form.actual_fault_date">
                  Breakdown Date is required
                </ion-note>
              </ion-item>
  
              <!-- Revised Expected Date -->
              <ion-item 
                class="input-item"
                v-if="expired_likely_date && form.id"
              >
                <ion-label position="stacked">Revised Expected Date</ion-label>
                <ion-datetime
                  v-model="form.reversion_date"
                  presentation="date"
                  :min="new Date().toISOString()"
                  :disabled="form.id != '' && pop_ticket.reversion_date != '' && pop_ticket.reversion_date != 'null' && pop_ticket.reversion_date != null"
                ></ion-datetime>
              </ion-item>
  
              <!-- Reason for Date Revision -->
              <ion-item 
                class="input-item"
                v-if="expired_likely_date && form.id"
              >
                <ion-label position="stacked">Reason for Date Revision</ion-label>
                <ion-input
                  v-model="form.reversion_reason"
                  :disabled="form.id != '' && pop_ticket.reversion_date != '' && pop_ticket.reversion_date != 'null' && pop_ticket.reversion_date != null"
                ></ion-input>
              </ion-item>
  
              <!-- Estimated Cost Section -->
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Estimated Cost</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <!-- Estimated Material Cost -->
                  <ion-item class="input-item">
                    <ion-label position="stacked">Estimated Material Cost</ion-label>
                    <ion-input
                      v-model="form.estimated_material_cost"
                      type="number"
                    ></ion-input>
                  </ion-item>
  
                  <!-- Estimated Material Cost File -->
                  <ion-item class="input-item">
                    <ion-label position="stacked">Estimated Material Cost File</ion-label>
                    <input 
                      type="file" 
                      @change="uploadMaterialCost" 
                      multiple
                      ref="filematerial"
                    />
                  </ion-item>
  
                  <!-- Estimated Service Cost -->
                  <ion-item class="input-item">
                    <ion-label position="stacked">Estimated Service Cost</ion-label>
                    <ion-input
                      v-model="form.estimated_service_cost"
                      type="number"
                    ></ion-input>
                  </ion-item>
  
                  <!-- Estimated Service Cost File -->
                  <ion-item class="input-item">
                    <ion-label position="stacked">Estimated Service Cost File</ion-label>
                    <input 
                      type="file" 
                      @change="uploadServiceCost" 
                      multiple
                      ref="fileservice"
                    />
                  </ion-item>
                </ion-card-content>
              </ion-card>
  
              <!-- Stages Section (only when editing) -->
              <ion-card v-if="form.id">
                <ion-card-header>
                  <ion-card-title>Stage</ion-card-title>
                  <ion-button 
                    @click="AddStage" 
                    size="small"
                    :disabled="form.stages.length > 0 && !last_stage_index && !last_stage_date"
                  >
                    Add +
                  </ion-button>
                </ion-card-header>
                <ion-card-content>
                  <ion-grid>
                    <ion-row class="header-row">
                      <ion-col size="3"><strong>Stage</strong></ion-col>
                      <ion-col size="3"><strong>Date</strong></ion-col>
                      <ion-col size="5"><strong>Description</strong></ion-col>
                      <ion-col size="1"></ion-col>
                    </ion-row>
                    
                    <ion-row v-for="(field, x) in form.stages" :key="'s' + x" class="stage-row">
                      <ion-col size="3">
                        <ion-select
                          v-model="field.stage_no"
                          :disabled="x < form.stages.length - 1"
                        >
                          <ion-select-option value="" disabled>Select stage</ion-select-option>
                          <ion-select-option 
                            v-for="(stg, index) in opn_stage" 
                            :key="index" 
                            :value="stg"
                            :disabled="index < last_stage_index"
                          >
                            {{ stg | camelCase }}
                          </ion-select-option>
                        </ion-select>
                      </ion-col>
                      <ion-col size="3">
                        <ion-datetime
                          v-model="field.stage_date"
                          presentation="date"
                          :min="last_stage_date"
                          :max="new Date().toISOString()"
                        ></ion-datetime>
                      </ion-col>
                      <ion-col size="5">
                        <ion-input
                          v-model="field.description"
                          placeholder="Enter Description"
                        ></ion-input>
                      </ion-col>
                      <ion-col size="1">
                        <ion-button 
                          @click="form.stages.splice(x, 1)" 
                          v-if="form.stages.length == x + 1"
                          fill="clear"
                        >
                          <ion-icon :icon="closeCircle" slot="icon-only"></ion-icon>
                        </ion-button>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-card-content>
              </ion-card>
  
              <!-- Additional Problems Section (only when editing) -->
              <ion-card v-if="form.id">
                <ion-card-header>
                  <ion-card-title>Additional Problems</ion-card-title>
                  <ion-button @click="AddProblem" size="small">Add +</ion-button>
                </ion-card-header>
                <ion-card-content>
                  <ion-grid>
                    <ion-row class="header-row">
                      <ion-col size="5"><strong>Problem</strong></ion-col>
                      <ion-col size="3"><strong>Material Cost</strong></ion-col>
                      <ion-col size="3"><strong>Service Cost</strong></ion-col>
                      <ion-col size="1"></ion-col>
                    </ion-row>
                    
                    <ion-row v-for="(field, x) in form.problems" :key="'ap' + x" class="problem-row">
                      <ion-col size="5">
                        <ion-input
                          v-model="field.problem"
                          placeholder="Enter Machine's problem..."
                        ></ion-input>
                      </ion-col>
                      <ion-col size="3">
                        <ion-input
                          v-model="field.estimated_material_cost"
                          type="number"
                        ></ion-input>
                      </ion-col>
                      <ion-col size="3">
                        <ion-input
                          v-model="field.estimated_service_cost"
                          type="number"
                        ></ion-input>
                      </ion-col>
                      <ion-col size="1">
                        <ion-button 
                          @click="form.problems.splice(x, 1)" 
                          fill="clear"
                        >
                          <ion-icon :icon="closeCircle" slot="icon-only"></ion-icon>
                        </ion-button>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-card-content>
              </ion-card>
  
              <!-- Submit Button -->
              <ion-button 
                expand="block" 
                type="submit" 
                class="ion-margin-top"
                :disabled="isSaving"
              >
                <ion-spinner v-if="isSaving" name="crescent"></ion-spinner>
                <span v-else>Submit</span>
              </ion-button>
            </ion-card-content>
          </ion-card>
        </form>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted,watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea,
    IonSelect, IonSelectOption, IonButton, IonMenuButton, IonNote,
    IonSegment, IonSegmentButton, IonSpinner, IonRadio, IonRadioGroup,
    IonRow, IonCol, IonDatetime, IonCardHeader, IonCardTitle, IonGrid,
    IonIcon, toastController
  } from '@ionic/vue';
  import { closeCircle } from 'ionicons/icons';
  import axios from 'axios';
  const api = axios.create({
  baseURL: 'https://dummymm.tech-trico.com', // Replace with your API base URL
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
    
    api.get("api/user/list", {
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
    
    // Basic validation
    if (!form.value.site_id || !form.value.category_id || !form.value.sub_category_id || 
        !form.value.machine_id || !form.value.complaint_nature || !form.value.maintenance_provider ||
        !form.value.ticket_type || !form.value.status_during_complaint || !form.value.likely_date) {
      const toast = await toastController.create({
        message: 'Please fill in all required fields',
        duration: 2000,
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
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
      return;
    }
  
    if (form.value.maintenance_provider === 'user' && !form.value.user_id) {
      const toast = await toastController.create({
        message: 'Please select a user',
        duration: 2000,
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
        response = await api.put(`/api/ticket/${form.value.id}`, form.value);
      } else {
        // Create new ticket
        response = await api.post('/api/ticket', form.value);
      }
  
      if (response.data.success) {
        // Upload files if any
        if (MaterialCost.value || ServiceCost.value) {
          await upload_files(response.data.data.id);
        }
  
        const toast = await toastController.create({
          message: response.data.message,
          duration: 2000,
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
        duration: 2000,
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
    // Load initial data
    api.get("https://dummymm.tech-trico.com/api/get_pre_machine-app").then((res) => {
      categories.value = res.data.data.Category;
      sites.value = res.data.data.sites;
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
  .required {
    color: var(--ion-color-danger);
  }
  
  .input-item {
    --padding-start: 0;
    --inner-padding-end: 0;
    margin-bottom: 16px;
  }
  
  .input-item ion-label {
    transform-origin: left top;
    transition: transform 0.15s ease-in-out;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--ion-color-medium);
  }
  
  .input-item ion-input,
  .input-item ion-textarea,
  .input-item ion-select {
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 8px;
    --padding-bottom: 8px;
    background: var(--ion-color-light);
    border-radius: 8px;
    margin-top: 4px;
  }
  
  .input-item ion-textarea {
    min-height: 120px;
  }
  
  .header-row {
    font-weight: bold;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--ion-color-light);
    margin-bottom: 8px;
  }
  
  .stage-row,
  .problem-row {
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  ion-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  ion-card-title {
    font-size: 1.2rem;
  }
  
  ion-spinner {
    margin-right: 8px;
  }
  
  ion-button {
    --ion-color-primary: #3880ff;
    --ion-color-primary-contrast: #ffffff;
  }
  
  ion-card {
    margin: 0 0 16px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>