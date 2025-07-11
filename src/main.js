import { createApp } from 'vue'
import * as ElIcons from "@element-plus/icons-vue";
import App from './App.vue'
import router from './router';
import './style.css';

const app = createApp(App);

app.use(router).mount('#app');