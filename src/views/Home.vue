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
            <a href="javascript:;" class="news-link" @click="openNewsDetail(item)">
              <div class="news-content">{{ item.title }}</div>
              <div class="news-date">{{ item.date }}</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 新闻详情模态框 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedNews?.title }}</h3>
          <span class="modal-close" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <p class="modal-date">发布日期：{{ selectedNews?.date }}</p>
          <div class="modal-detail">
            {{ selectedNews?.detail }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeModal">关闭</button>
        </div>
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
    title: '我们是小黄和小白',
    description: '我们很听话，很乖巧，请给我们一个温暖的家吧'
  },
  {
    image: 'src/assets/dog_2.jpg',  // 请替换为实际图片路径
    title: '我是小美',
    description: '我很安静，很温柔，请给我一个家吧'
  },
  {
    image: 'src/assets/dog_3.jpg',  // 请替换为实际图片路径
    title: '我是淘淘',
    description: '我充满活力，喜欢玩耍，请带我回家吧'
  }
]);

// 新闻数据
const newsItems = ref([
  {
    title: '雀巢集团战略投资新瑞鹏，协同深耕中国宠物市场',
    date: '2024.12.24',
    detail: '近日，全球知名的宠物食品和宠物护理产品制造商雀巢普瑞纳宣布战略投资中国领先的宠物医疗集团新瑞鹏。此次合作将充分发挥雀巢在宠物营养领域的专业优势和新瑞鹏在宠物医疗服务方面的丰富经验，共同为中国宠物主人提供更全面、专业的宠物健康解决方案。双方将在宠物诊疗、宠物营养、宠物主人教育等领域展开深入合作，共同推动中国宠物市场的健康发展。'
  },
  {
    title: '数十名宠物医生入驻"好兽医阿闻互联网宠物医院"，助力养宠家庭做好防疫',
    date: '2024.03.16',
    detail: '随着宠物数量的增加和疫情的影响，互联网宠物医疗服务需求激增。近日，"好兽医阿闻互联网宠物医院"宣布有数十名专业宠物医生正式入驻平台，为广大宠物主人提供线上咨询、疾病诊断和用药指导等服务。这些医生均来自全国知名宠物医院，拥有丰富的临床经验。平台特别推出了"宠物防疫指南"专区，帮助宠物主人了解宠物疫苗接种知识，做好日常防护工作，确保爱宠健康成长。'
  },
  {
    title: '初心如磐 等行致远 | 禁赛集团多位医生荣获"了不起的宠物医生"奖',
    date: '2024.04.30',
    detail: '近日，由中国小动物保护协会举办的第三届"了不起的宠物医生"评选活动圆满落幕。禁赛集团多位医生凭借在兽医领域的突出贡献和专业技术，荣获此项殊荣。获奖医生包括在动物肿瘤治疗领域取得重大突破的张医生、在宠物骨科手术方面有独到造诣的李医生、以及专注于宠物皮肤病研究的王医生等。他们秉承"初心如磐，等行致远"的理念，以精湛的医术和高尚的医德，赢得了业界和宠物主人的广泛认可。'
  },
  {
    title: '专家赋能一线: 以工匠之心钻研，以仁爱之心呵护!',
    date: '2024.04.10',
    detail: '为提升基层宠物医疗服务水平，由中国农业大学兽医学院和全国宠物医师协会联合发起的"专家赋能一线"公益项目于上月启动。该项目邀请全国知名宠物医学专家定期前往基层宠物医院，开展技术指导和病例分析研讨。专家们强调，宠物医生不仅需要以工匠之心钻研医术，更要以仁爱之心呵护每一个生命。通过理论与实践相结合的方式，帮助基层医生更新知识结构，掌握先进诊疗技术，提高宠物疾病的诊断和治疗水平。'
  },
  {
  title: '全国首家宠物中医诊疗中心在北京正式成立',
  date: '2024.05.18',
  detail: '近日，全国首家专业宠物中医诊疗中心在北京朝阳区正式挂牌成立。该中心汇聚了20余名具有丰富经验的中兽医专家，将传统中医理论与现代宠物医疗相结合，提供针灸、推拿、中药调理等特色服务。中心负责人表示，中医在治疗宠物慢性病、老年病和术后康复等方面具有独特优势，未来还计划与多所高校合作开展宠物中医人才培养计划，推动这一特色医疗领域的发展。'
},
{
  title: '宠物智能穿戴设备市场迎来爆发式增长',
  date: '2024.06.22',
  detail: '据最新行业报告显示，2024年上半年中国宠物智能穿戴设备市场规模同比增长150%。以健康监测、定位追踪为主要功能的智能项圈、智能背心等产品受到宠物主人热捧。多家科技企业推出具有心率监测、体温检测、运动量分析等功能的新品，部分高端产品还能通过AI算法提前预警宠物健康异常。业内专家指出，智能养宠已成为新趋势，预计未来三年该市场规模将突破百亿元。'
},
{
  title: '第三届国际宠物营养创新论坛在上海举办',
  date: '2024.07.05',
  detail: '由世界宠物食品协会主办的第三届国际宠物营养创新论坛在上海国际会展中心隆重举行。来自30多个国家的500余位专家学者和企业代表参会，共同探讨宠物营养领域的最新研究成果。论坛重点讨论了功能性宠物食品开发、精准营养配方、可持续原料应用等议题。多家企业展示了针对宠物不同生命阶段、特殊健康状况的定制化营养解决方案，推动宠物食品行业向更科学、更精细化的方向发展。'
},
{
  title: '全国首个宠物医疗纠纷调解委员会成立',
  date: '2024.08.12',
  detail: '为解决日益增多的宠物医疗纠纷问题，中国兽医协会联合司法部门成立了全国首个专业宠物医疗纠纷调解委员会。该委员会由资深兽医专家、法律专家和动物福利工作者组成，将秉持公平公正原则，为宠物主人和医疗机构提供专业调解服务。同时，委员会还将制定宠物医疗纠纷处理指南，建立行业标准，规范诊疗行为，维护医患双方合法权益，促进宠物医疗行业健康有序发展。'
}
]);

// Swiper 配置
const modules = [Pagination, Navigation, Autoplay];

// 新闻详情弹窗相关
const showModal = ref(false);
const selectedNews = ref(null);
const openNewsDetail = (item) => {
  selectedNews.value = item;
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};
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
  font-size: 35px;
  margin-bottom: 20px;
  color: #1e88e5;
  font-weight: bold;
}

/* 轮播图样式 */
.carousel-container {
  margin-bottom: 30px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(30, 136, 229, 0.10), 0 1.5px 6px rgba(30, 136, 229, 0.08);
  width: 100%;
  height: 520px;
  min-height: 400px;
  max-height: 70vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mySwiper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  max-height: 100%;
  border-radius: 18px;
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
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-date {
  font-size: 12px;
  color: #999;
  text-align: right;
}

/* 美化后的模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #f8fafc 0%, #e3f0ff 100%);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(30, 136, 229, 0.18), 0 1.5px 6px rgba(30, 136, 229, 0.08);
  border: 1.5px solid #e3eafc;
  animation: modalFadeIn 0.35s cubic-bezier(.4,2,.6,1) both;
}

@keyframes modalFadeIn {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px 12px 28px;
  border-bottom: 1.5px solid #e3eafc;
  background: transparent;
}

.modal-header h3 {
  margin: 0;
  color: #1976d2;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
}

.modal-close {
  font-size: 28px;
  cursor: pointer;
  color: #b0b8c9;
  transition: color 0.2s;
  font-weight: bold;
}

.modal-close:hover {
  color: #1976d2;
}

.modal-body {
  padding: 24px 28px 18px 28px;
  overflow-y: auto;
  background: transparent;
}

.modal-date {
  font-size: 13px;
  color: #5c6b82;
  margin-bottom: 12px;
  font-style: italic;
}

.modal-detail {
  font-size: 15px;
  line-height: 1.8;
  color: #2d3a4b;
  text-align: justify;
  letter-spacing: 0.2px;
  padding: 6px 0 0 0;
}

.modal-footer {
  padding: 14px 28px 18px 28px;
  border-top: 1.5px solid #e3eafc;
  display: flex;
  justify-content: flex-end;
  background: transparent;
}

.modal-btn {
  padding: 8px 28px;
  background: linear-gradient(90deg, #42a5f5 0%, #1976d2 100%);
  color: #fff;
  border: none;
  border-radius: 22px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.08);
  transition: background 0.2s;
}

.modal-btn:hover {
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
}
</style>