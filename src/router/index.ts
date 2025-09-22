import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import TicketListPage from '@/views/TicketListPage.vue';
import AddTicketPage from '@/views/AddTicketPage.vue';

// Update the routes array to include a layout with sidebar
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/app',
    component: () => import('@/layouts/AppLayout.vue'), // New layout component
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: TicketListPage
      },
      {
        path: 'add-ticket',
        name: 'AddTicket',
        component: AddTicketPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    if (isAuthenticated && to.path === '/login') {
      next('/app/dashboard');
    } else {
      next();
    }
  }
});

export default router