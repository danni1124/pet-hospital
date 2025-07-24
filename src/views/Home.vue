<template>
  <div class="home-container">
    <!-- 左侧区域 - 占据2/3宽度 -->
    <div class="left-section">
      <!-- 领养标题 -->
      <h2 class="adoption-title">请领养我吧!</h2>
      
      <!-- 轮播图组件 -->
      <div class="carousel-container">
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          :loop="true"
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :navigation="true"
          class="mySwiper"
        >
          <swiper-slide v-for="(slide, index) in slides" :key="index">
            <img :src="slide.image" :alt="slide.title" class="carousel-img">
            <div class="carousel-caption">
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.description }}</p>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    
    <!-- 右侧区域 - 占据1/3宽度 -->
    <div class="right-section">
      <div class="news-container">
        <h3 class="news-title">最新动态</h3>
        <ul class="news-list">
          <li class="news-item" v-for="(item, index) in newsItems" :key="index">
            <a href="#" class="news-link">
              <div class="news-content">{{ item.title }}</div>
              <div class="news-date">{{ item.date }}</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// 导入 Swiper 样式
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// 轮播图数据
const slides = ref([
  {
    image: 'src/assets/dog_1.jpg',  // 请替换为实际图片路径
    title: '欢迎来到宠物医院',
    description: '为您的爱宠提供专业的医疗服务'
  },
  {
    image: 'src/assets/dog_2.jpg',  // 请替换为实际图片路径
    title: '专业团队',
    description: '经验丰富的兽医团队为您的宠物健康保驾护航'
  },
  {
    image: 'src/assets/dog_3.jpg',  // 请替换为实际图片路径
    title: '全面服务',
    description: '提供疫苗接种、健康检查、手术等全方位服务'
  }
]);

// 新闻数据
const newsItems = ref([
  {
    title: '雀巢集团战略投资新瑞鹏，协同深耕中国宠物市场',
    date: '2022.12.24'
  },
  {
    title: '数十名宠物医生入驻"好兽医阿闻互联网宠物医院"，助力养宠家庭做好防疫',
    date: '2022.03.16'
  },
  {
    title: '初心如磐 等行致远 | 禁赛集团多位医生荣获"了不起的宠物医生"奖',
    date: '2021.04.30'
  },
  {
    title: '专家赋能一线: 以工匠之心钻研，以仁爱之心呵护!',
    date: '2023.04.10'
  }
]);

// Swiper 配置
const modules = [Pagination, Navigation, Autoplay];
</script>


<style scoped>
.home-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 80px); /* 减去导航栏高度 */
  overflow: hidden;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* 固定背景，避免滚动 */
  min-height: 100vh; /* 确保容器至少占满整个视口高度 */
}

.left-section {
  flex: 2; /* 占比2 */
  padding: 20px;
  overflow-y: auto;
}

.right-section {
  flex: 1; /* 占比1 */
  padding: 20px;
  overflow-y: auto;
}

/* 领养标题样式 */
.adoption-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  color: #1e88e5;
  font-weight: bold;
}

/* 轮播图样式 */
.carousel-container {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mySwiper {
  width: 100%;
  height: 400px;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 15px;
}

.carousel-caption h3 {
  margin: 0;
  font-size: 24px;
}

.carousel-caption p {
  margin: 10px 0 0;
}

/* 新闻列表样式 */
.news-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.news-title {
  border-bottom: 2px solid #1e88e5;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 20px;
  color: #333;
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.news-item {
  border-bottom: 1px solid #eee;
}

.news-item:last-child {
  border-bottom: none;
}

.news-link {
  display: block;
  padding: 15px 0;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
}

.news-link:hover {
  background-color: #f5f5f5;
}

.news-content {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
}

.news-date {
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
