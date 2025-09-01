<template>
  <div class="home-container">
    <!-- 上半部分：轮播图和最新动态的整体 -->
    <div class="top-section">
      <!-- 左侧区域 - 轮播图 -->
      <div class="left-area">
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
      
      <!-- 右侧区域 - 最新动态 -->
      <div class="right-area">
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
    </div>

    <!-- 下半部分：养宠指南板块 -->
    <div class="bottom-section">
      <div class="pet-guide-container">
        <h3 class="pet-guide-title">
          <i class="fas fa-heart"></i>
          养宠指南
        </h3>
        <div class="guide-grid">
          <div 
            v-for="(guide, index) in petGuides" 
            :key="index"
            class="guide-card"
            @click="openGuideDetail(guide)"
          >
            <div class="guide-icon">
              <i :class="guide.icon"></i>
            </div>
            <h4 class="guide-title">{{ guide.title }}</h4>
            <p class="guide-description">{{ guide.description }}</p>
            <div class="guide-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
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

    <!-- 养宠指南详情模态框 -->
    <div v-if="showGuideModal" class="modal-overlay" @click="closeGuideModal">
      <div class="modal-content guide-modal" @click.stop>
        <div class="modal-header">
          <div class="guide-modal-title">
            <i :class="selectedGuide?.icon" class="guide-modal-icon"></i>
            <h3>{{ selectedGuide?.title }}</h3>
          </div>
          <span class="modal-close" @click="closeGuideModal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="guide-modal-detail" v-html="selectedGuide?.detail"></div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeGuideModal">关闭</button>
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
    image: 'src/assets/dog_1.jpg',
    title: '我们是小黄和小白',
    description: '我们很听话，很乖巧，请给我们一个温暖的家吧'
  },
  {
    image: 'src/assets/dog_2.jpg',
    title: '我是小美',
    description: '我很安静，很温柔，请给我一个家吧'
  },
  {
    image: 'src/assets/dog_3.jpg',
    title: '我是淘淘',
    description: '我充满活力，喜欢玩耍，请带我回家吧'
  }
]);

// 新闻数据
const newsItems = ref([
  {
    title: '雀巢集团战略投资新瑞鹏，协同深耕中国宠物市场',
    date: '2024.12.24',
    detail: '近日，全球知名的宠物食品和宠物护理产品制造商雀巢普瑞纳宣布战略投资中国领先的宠物医疗集团新瑞鹏。此次合作将充分发挥雀巢在宠物营养领域的专业优势和新瑞鹏在宠物医疗服务方面的丰富经验，共同为中国宠物主人提供更全面、专业的宠物健康解决方案。'
  },
  {
    title: '数十名宠物医生入驻"好兽医阿闻互联网宠物医院"，助力养宠家庭做好防疫',
    date: '2024.03.16',
    detail: '随着宠物数量的增加和疫情的影响，互联网宠物医疗服务需求激增。近日，"好兽医阿闻互联网宠物医院"宣布有数十名专业宠物医生正式入驻平台。'
  },
  {
    title: '初心如磐 等行致远 | 禁赛集团多位医生荣获"了不起的宠物医生"奖',
    date: '2024.04.30',
    detail: '近日，由中国小动物保护协会举办的第三届"了不起的宠物医生"评选活动圆满落幕。禁赛集团多位医生凭借在兽医领域的突出贡献和专业技术，荣获此项殊荣。'
  }
]);

// 养宠指南数据
const petGuides = ref([
  {
    icon: 'fas fa-utensils',
    title: '科学喂养',
    description: '了解宠物营养需求，制定合理饮食计划',
    detail: `
      <h4>幼犬/幼猫喂养要点：</h4>
      <ul>
        <li>2-3个月：每日4-5餐，少食多餐</li>
        <li>3-6个月：每日3-4餐，逐渐增加分量</li>
        <li>6个月以上：每日2-3餐，成年后可改为2餐</li>
      </ul>
      
      <h4>营养搭配建议：</h4>
      <ul>
        <li>优质蛋白质占25-30%（肉类、鱼类）</li>
        <li>碳水化合物占40-50%（米饭、燕麦）</li>
        <li>脂肪占10-15%（鱼油、植物油）</li>
        <li>纤维素和维生素（蔬菜、水果适量）</li>
      </ul>
      
      <h4>禁忌食物：</h4>
      <p>巧克力、洋葱、葡萄、咖啡、酒精等对宠物有毒，严禁喂食。</p>
    `
  },
  {
    icon: 'fas fa-heartbeat',
    title: '健康监护',
    description: '定期体检，及时发现和预防疾病',
    detail: `
      <h4>日常健康检查：</h4>
      <ul>
        <li>观察食欲和精神状态</li>
        <li>检查眼鼻是否有异常分泌物</li>
        <li>触摸身体是否有肿块或疼痛</li>
        <li>观察排便是否正常</li>
      </ul>
      
      <h4>疫苗接种计划：</h4>
      <ul>
        <li>犬类：6-8周首次疫苗，之后每3-4周加强一次</li>
        <li>猫类：8-10周首次疫苗，间隔3-4周再次接种</li>
        <li>成年后每年定期接种疫苗</li>
      </ul>
      
      <h4>体检频率：</h4>
      <p>幼宠每月一次，成年宠物每半年一次，老年宠物每季度一次。</p>
    `
  },
  {
    icon: 'fas fa-graduation-cap',
    title: '行为训练',
    description: '培养良好习惯，提升宠物素质',
    detail: `
      <h4>基础训练项目：</h4>
      <ul>
        <li>大小便训练：固定地点，及时清理</li>
        <li>基本指令：坐下、握手、等待、过来</li>
        <li>社交训练：与人和其他动物友好相处</li>
        <li>独处能力：避免分离焦虑</li>
      </ul>
      
      <h4>训练原则：</h4>
      <ul>
        <li>正面强化：奖励好行为，忽略坏行为</li>
        <li>一致性：家庭成员保持一致的训练方法</li>
        <li>耐心：重复练习，循序渐进</li>
        <li>适时：选择宠物注意力集中的时候训练</li>
      </ul>
      
      <h4>常见问题解决：</h4>
      <p>乱咬东西、过度吠叫、攻击行为等都可以通过正确的训练方法改善。</p>
    `
  },
  {
    icon: 'fas fa-cut',
    title: '日常护理',
    description: '保持宠物清洁，预防皮肤疾病',
    detail: `
      <h4>清洁护理：</h4>
      <ul>
        <li>洗澡频率：犬类1-2周一次，猫类较少需要洗澡</li>
        <li>梳毛：长毛宠物每日梳理，短毛宠物每周2-3次</li>
        <li>指甲修剪：每2-3周修剪一次</li>
        <li>耳朵清洁：每周检查并清洁耳道</li>
      </ul>
      
      <h4>口腔护理：</h4>
      <ul>
        <li>定期刷牙或使用洁牙骨</li>
        <li>检查牙龈是否红肿</li>
        <li>及时清除牙垢</li>
      </ul>
      
      <h4>皮肤护理：</h4>
      <p>保持干燥清洁，定期检查是否有跳蚤、螨虫等寄生虫。</p>
    `
  },
  {
    icon: 'fas fa-running',
    title: '运动锻炼',
    description: '合理运动，保持宠物身心健康',
    detail: `
      <h4>运动需求：</h4>
      <ul>
        <li>小型犬：每日20-30分钟轻度运动</li>
        <li>中型犬：每日30-60分钟中等强度运动</li>
        <li>大型犬：每日60-90分钟运动</li>
        <li>猫类：室内游戏和攀爬活动</li>
      </ul>
      
      <h4>运动方式：</h4>
      <ul>
        <li>散步：最基本的运动方式</li>
        <li>跑步：适合活跃的中大型犬</li>
        <li>游戏：玩具互动，增进感情</li>
        <li>游泳：全身运动，关节负担小</li>
      </ul>
      
      <h4>注意事项：</h4>
      <p>避免剧烈运动后立即进食，注意天气变化，老年宠物适当减少运动强度。</p>
    `
  },
  {
    icon: 'fas fa-shield-alt',
    title: '安全防护',
    description: '创建安全环境，防范意外伤害',
    detail: `
      <h4>居家安全：</h4>
      <ul>
        <li>收好危险物品：清洁剂、药品、小物件</li>
        <li>安装防护栏：阳台、楼梯等危险区域</li>
        <li>检查电线：防止宠物咬电线</li>
        <li>植物安全：移除有毒植物</li>
      </ul>
      
      <h4>外出安全：</h4>
      <ul>
        <li>使用牵引绳，避免走失</li>
        <li>携带身份标识牌</li>
        <li>避开车流密集区域</li>
        <li>注意其他动物</li>
      </ul>
      
      <h4>紧急处理：</h4>
      <p>备好宠物急救包，学习基本急救知识，记住附近宠物医院联系方式。</p>
    `
  }
]);

// Swiper 配置
const modules = [Pagination, Navigation, Autoplay];

// 弹窗相关
const showModal = ref(false);
const selectedNews = ref(null);
const showGuideModal = ref(false);
const selectedGuide = ref(null);

const openNewsDetail = (item) => {
  selectedNews.value = item;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const openGuideDetail = (guide) => {
  selectedGuide.value = guide;
  showGuideModal.value = true;
};

const closeGuideModal = () => {
  showGuideModal.value = false;
};
</script>

<style scoped>
.home-container {
  width: 100%;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 上半部分：轮播图和最新动态的整体 */
.top-section {
  display: flex;
  gap: 20px;
  height: 70vh;
}

.left-area {
  flex: 2;
  overflow-y: auto;
}

.right-area {
  flex: 1;
  overflow-y: auto;
}

/* 下半部分：养宠指南板块 */
.bottom-section {
  width: 100%;
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
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(30, 136, 229, 0.10);
  height: 480px;
  background: #fff;
}

.mySwiper {
  width: 100%;
  height: 100%;
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

/* 养宠指南样式 */
.pet-guide-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(30, 136, 229, 0.10);
}

.pet-guide-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  color: #1e88e5;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pet-guide-title i {
  font-size: 26px;
  color: #ff6b6b;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.guide-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e3f0ff 100%);
  border-radius: 16px;
  padding: 25px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e3eafc;
  position: relative;
  overflow: hidden;
}

.guide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(30, 136, 229, 0.15);
  border-color: #1e88e5;
}

.guide-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #1e88e5, #42a5f5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-icon i {
  font-size: 28px;
  color: white;
}

.guide-title {
  font-size: 18px;
  font-weight: bold;
  color: #1976d2;
  margin: 0 0 10px 0;
}

.guide-description {
  font-size: 14px;
  color: #5c6b82;
  line-height: 1.5;
  margin: 0 0 15px 0;
}

.guide-arrow {
  position: absolute;
  bottom: 15px;
  right: 20px;
  width: 30px;
  height: 30px;
  background: #1e88e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(10px);
}

.guide-card:hover .guide-arrow {
  opacity: 1;
  transform: translateX(0);
}

.guide-arrow i {
  font-size: 14px;
  color: white;
}

/* 新闻列表样式 */
.news-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  height: 100%;
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

/* 模态框样式 */
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
  box-shadow: 0 8px 32px rgba(30, 136, 229, 0.18);
  animation: modalFadeIn 0.35s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  border-bottom: 1px solid #e3eafc;
}

.modal-header h3 {
  margin: 0;
  color: #1976d2;
  font-size: 22px;
  font-weight: 700;
}

.modal-close {
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #1976d2;
}

.modal-body {
  padding: 24px 28px;
  overflow-y: auto;
}

.modal-date {
  font-size: 13px;
  color: #5c6b82;
  margin-bottom: 12px;
}

.modal-detail {
  font-size: 15px;
  line-height: 1.8;
  color: #2d3a4b;
}

.modal-footer {
  padding: 14px 28px;
  border-top: 1px solid #e3eafc;
  display: flex;
  justify-content: flex-end;
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
  transition: background 0.2s;
}

.modal-btn:hover {
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
}

/* 养宠指南模态框样式 */
.guide-modal {
  max-width: 800px;
}

.guide-modal-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.guide-modal-icon {
  font-size: 24px;
  color: #1e88e5;
}

.guide-modal-detail {
  font-size: 15px;
  line-height: 1.8;
  color: #2d3a4b;
}

.guide-modal-detail h4 {
  color: #1976d2;
  font-size: 16px;
  margin: 20px 0 10px 0;
  font-weight: 600;
}

.guide-modal-detail ul {
  margin: 10px 0;
  padding-left: 20px;
}

.guide-modal-detail li {
  margin: 8px 0;
  color: #4a5568;
}

.guide-modal-detail p {
  margin: 15px 0;
  color: #4a5568;
  background: #f7fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #1e88e5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-section {
    flex-direction: column;
    height: auto;
  }
  
  .left-area,
  .right-area {
    flex: none;
  }
  
  .guide-grid {
    grid-template-columns: 1fr;
  }
  
  .adoption-title {
    font-size: 28px;
  }
  
  .carousel-container {
    height: 300px;
  }
}
</style>
