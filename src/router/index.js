import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // 需要创建这个文件
import Manage from '@/Manage.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;