import { createApp } from 'vue'
import * as ElIcons from "@element-plus/icons-vue";
import App from './App.vue'
import router from './router';
import './style.css';
import { setupCalendar } from 'v-calendar'; // 使用新的 setupCalendar API
import 'v-calendar/dist/style.css'; // 确保使用正确的 CSS 路径

const app = createApp(App);

app.use(router).mount('#app');