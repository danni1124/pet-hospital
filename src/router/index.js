import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // 需要创建这个文件
import Manage from '@/Manage.vue';
import DepartmentSelection from '@/DepartmentSelection.vue'
import AppointmentView from '@/AppointmentView.vue'
import QuestionnaireView from '../QuestionnaireView.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage
  },
  {
    path: '/department',
    name: 'DepartmentSelection',
    component: DepartmentSelection
  },
  {
    path: '/appointment',
    name: 'AppointmentView',
    component: AppointmentView,
    props: true
  },
  {
    path: '/questionnaire',
    name: 'QuestionnaireView',
    component: QuestionnaireView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;