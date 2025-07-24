import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // 需要创建这个文件
import Manage from '@/Manage.vue';
import DepartmentSelection from '@/DepartmentSelection.vue'
import AppointmentView from '@/AppointmentView.vue'
import QuestionnaireView from '../QuestionnaireView.vue'
import Forum from '@/Forum.vue'
import Introduction from '@/Introduction.vue'
import UserInfoView from '@/UserInfoView.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component:Home // 路径要对得上
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
    component: QuestionnaireView,
    props: true 
  },
  {
    path: '/forum',
    name: 'Forum',
    component: Forum,
    props: true 
  },
  {
    path: '/introduction',
    name: 'Introduction',
    component: Introduction,
    props: true 
  },
  {
    path: '/user-info',
    name: 'UserInfoView',
    component: UserInfoView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;