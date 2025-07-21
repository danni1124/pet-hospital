<template>
  <div class="pet-adoption-app">
    <!-- 头部区域 -->
    <div class="header">
      <div class="header-content">
        <div class="clinic-name">爱宠动物医院</div>
        <h1>找到你的<span class="paw-icon"><i class="fas fa-paw"></i></span>新伙伴</h1>
        <p>我们为可爱的宠物寻找温暖的家，领养代替购买，给流浪动物一个机会</p>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          v-model="searchQuery"
          placeholder="搜索宠物名称或品种..."
          @input="applyFilters"
        >
        <button class="search-btn">
          <i class="fas fa-search"></i> 搜索
        </button>
      </div>
      <div class="filter-options">
        <button 
          v-for="(option, index) in filterOptions" 
          :key="index"
          class="filter-btn"
          :class="{ active: activeFilter === option.value }"
          @click="setActiveFilter(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div class="section-header">
        <h2 class="section-title">可领养宠物</h2>
        <div class="results-count">显示 {{ filteredPets.length }} 个结果</div>
      </div>

      <!-- 宠物网格 -->
      <div class="pet-grid">
        <div 
          v-for="pet in filteredPets" 
          :key="pet.id" 
          class="pet-item"
        >
          <div class="pet-image">
            <img :src="petImage(pet)" :alt="pet.name">
            <div class="heart-icon" @click="toggleFavorite(pet.id)">
              <i :class="isFavorite(pet.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
            </div>
            <div class="pet-tag">{{ pet.type }} · {{ pet.age }}岁</div>
          </div>
          <div class="pet-info">
            <h3 class="pet-name">{{ pet.name }}</h3>
            <div class="pet-details">
              <div class="detail-item">
                <i class="fas" :class="pet.gender === '男' ? 'fa-mars' : 'fa-venus'"></i> 
                {{ pet.gender }}
              </div>
              <div class="detail-item">
                <i class="fas fa-weight"></i> {{ pet.weight }}公斤
              </div>
              <div class="detail-item">
                <i class="fas fa-stethoscope"></i> {{ pet.disease || '健康' }}
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar"></i> 收留{{ pet.daysInShelter || '30' }}天
              </div>
            </div>
            <p class="pet-description">{{ pet.description || '性格温顺亲人，喜欢与人互动，适合家庭领养。' }}</p>
            <button class="adopt-btn" @click="openAdoptionForm(pet)">
              <i class="fas fa-heart"></i> 申请领养
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="!loading && filteredPets.length === 0" class="empty-state">
        <i class="fas fa-paw"></i>
        <p>没有找到符合条件的宠物</p>
        <button class="reset-btn" @click="resetFilters">重置筛选条件</button>
      </div>
    </div>

    <!-- 修复后的领养申请模态框 -->
    <div :class="['modal-overlay', { active: showAdoptionModal }]">
      <div class="modal-container" v-if="selectedPet">
        <div class="modal-header">
          <h2>领养申请表 - {{ selectedPet.name }}</h2>
          <button class="modal-close" @click="closeAdoptionModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>您的姓名</label>
            <input type="text" v-model="adoptionForm.name" required>
          </div>
          <div class="form-group">
            <label>联系电话</label>
            <input type="tel" v-model="adoptionForm.phone" required>
          </div>
          <div class="form-group">
            <label>电子邮箱</label>
            <input type="email" v-model="adoptionForm.email" required>
          </div>
          <div class="form-group">
            <label>家庭环境描述</label>
            <textarea v-model="adoptionForm.environment" placeholder="请描述您的家庭环境（是否有院子、其他宠物等）..."></textarea>
          </div>
          <button class="submit-btn" @click="submitAdoption">
            <i class="fas fa-paper-plane"></i> 提交申请
          </button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-links">
        <a href="#" class="footer-link">关于我们</a>
        <a href="#" class="footer-link">领养流程</a>
        <a href="#" class="footer-link">联系我们</a>
      </div>
      <p>爱宠动物医院 &copy; 2023 宠物领养中心</p>
      <p>领养代替购买，给生命一次机会</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    // 状态管理
    const loading = ref(true);
    const pets = ref([]);
    const searchQuery = ref('');
    const activeFilter = ref('all');
    const showAdoptionModal = ref(false);
    const selectedPet = ref(null); // 初始化为 null
    const favoritePets = ref(new Set());
    
    // 领养申请表数据
    const adoptionForm = ref({
      name: '',
      phone: '',
      email: '',
      environment: ''
    });
    
    // 筛选选项
    const filterOptions = ref([
      { label: '全部宠物', value: 'all' },
      { label: '狗狗', value: 'dog' },
      { label: '猫咪', value: 'cat' },
      { label: '小型宠物', value: 'small' },
      { label: '健康宠物', value: 'healthy' },
      { label: '幼年宠物', value: 'young' }
    ]);
    
    // 模拟宠物数据
    const loadPets = () => {
      loading.value = true;
      setTimeout(() => {
        pets.value = [
          {
            id: 1,
            name: '小白',
            age: 3,
            disease: '感冒康复',
            type: '狗狗',
            gender: '男',
            weight: 25,
            description: '温顺友好的拉布拉多，已绝育，喜欢和人玩耍，特别适合有孩子的家庭。',
            daysInShelter: 45
          },
          {
            id: 2,
            name: '喵喵',
            age: 1,
            disease: '肠胃调理中',
            type: '猫咪',
            gender: '女',
            weight: 3.5,
            description: '活泼可爱的英国短毛猫，已接种疫苗，会用猫砂盆，喜欢被抚摸。',
            daysInShelter: 30
          },
          {
            id: 3,
            name: '豆豆',
            age: 4,
            disease: '骨折恢复期',
            type: '狗狗',
            gender: '男',
            weight: 12,
            description: '聪明忠诚的边境牧羊犬，已绝育，擅长接飞盘，需要充足的运动空间。',
            daysInShelter: 60
          },
          {
            id: 4,
            name: '橘子',
            age: 1,
            disease: '',
            type: '猫咪',
            gender: '男',
            weight: 4.2,
            description: '温顺的橘猫，已绝育，喜欢在阳光下打盹，能与其它宠物和睦相处。',
            daysInShelter: 25
          },
          {
            id: 5,
            name: '小柴',
            age: 2,
            disease: '',
            type: '狗狗',
            gender: '女',
            weight: 9,
            description: '活泼可爱的柴犬，已接种疫苗，喜欢户外活动，需要定期梳理毛发。',
            daysInShelter: 40
          },
          {
            id: 6,
            name: '小雪',
            age: 1,
            disease: '',
            type: '猫咪',
            gender: '女',
            weight: 3.8,
            description: '优雅的布偶猫，性格温顺亲人，喜欢被抱，已绝育并接种疫苗。',
            daysInShelter: 35
          }
        ];
        loading.value = false;
      }, 800);
    };
    
    // 获取宠物图片
    const petImage = (pet) => {
      const petImages = {
        1: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=80',
        2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
        3: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
        4: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
        5: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
        6: 'https://images.unsplash.com/photo-1592194996308-7b43878e84b6?auto=format&fit=crop&w=800&q=80'
      };
      return petImages[pet.id] || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';
    };
    
    // 设置活动筛选
    const setActiveFilter = (filter) => {
      activeFilter.value = filter;
    };
    
    // 应用筛选
    const applyFilters = () => {
      // 搜索和筛选逻辑在计算属性中处理
    };
    
    // 重置筛选
    const resetFilters = () => {
      searchQuery.value = '';
      activeFilter.value = 'all';
    };
    
    // 打开领养表单
    const openAdoptionForm = (pet) => {
      selectedPet.value = pet; // 设置选中的宠物
      showAdoptionModal.value = true;
    };
    
    // 关闭领养表单
    const closeAdoptionModal = () => {
      showAdoptionModal.value = false;
      selectedPet.value = null; // 重置选中的宠物
      // 重置表单
      adoptionForm.value = {
        name: '',
        phone: '',
        email: '',
        environment: ''
      };
    };
    
    const submitAdoption = () => {
      if (!adoptionForm.value.name || !adoptionForm.value.phone) {
        alert('请填写姓名和联系电话');
        return;
      }
      
      if (!selectedPet.value) {
        alert('未选择宠物');
        return;
      }
      
      // 创建申请对象
      const application = {
        id: Date.now() + Math.floor(Math.random() * 1000), // 唯一ID
        petId: selectedPet.value.id,
        petName: selectedPet.value.name,
        petType: selectedPet.value.type,
        petAge: selectedPet.value.age,
        timestamp: new Date().toISOString(), // 申请时间
        applicant: {
          name: adoptionForm.value.name,
          phone: adoptionForm.value.phone,
          email: adoptionForm.value.email,
          environment: adoptionForm.value.environment
        }
      };
      
      // 获取现有申请或初始化数组
      const storedApplications = localStorage.getItem('adoptionApplications');
      const applications = storedApplications 
        ? JSON.parse(storedApplications) 
        : [];
      
      // 添加新申请
      applications.push(application);
      
      // 保存到本地存储
      localStorage.setItem(
        'adoptionApplications', 
        JSON.stringify(applications)
      );
      
      alert(`领养申请已提交！我们将尽快联系您关于领养${selectedPet.value.name}的事宜。`);
      closeAdoptionModal();
    };
    
    // 收藏宠物
    const toggleFavorite = (petId) => {
      if (favoritePets.value.has(petId)) {
        favoritePets.value.delete(petId);
      } else {
        favoritePets.value.add(petId);
      }
    };
    
    // 检查是否已收藏
    const isFavorite = (petId) => {
      return favoritePets.value.has(petId);
    };
    
    // 计算属性 - 筛选后的宠物列表
    const filteredPets = computed(() => {
      return pets.value.filter(pet => {
        // 搜索条件匹配
        const matchesSearch = !searchQuery.value || 
          pet.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (pet.type && pet.type.toLowerCase().includes(searchQuery.value.toLowerCase()));
        
        // 筛选条件匹配
        let matchesFilter = true;
        if (activeFilter.value !== 'all') {
          switch (activeFilter.value) {
            case 'dog':
              matchesFilter = pet.type === '狗狗';
              break;
            case 'cat':
              matchesFilter = pet.type === '猫咪';
              break;
            case 'small':
              matchesFilter = pet.weight < 5; // 假设小型宠物体重小于5公斤
              break;
            case 'healthy':
              matchesFilter = !pet.disease || pet.disease === '';
              break;
            case 'young':
              matchesFilter = pet.age <= 2;
              break;
          }
        }
        
        return matchesSearch && matchesFilter;
      });
    });
    
    // 初始化加载数据
    onMounted(loadPets);
    // 提交领养申请（新增本地存储功能）
    
    return {
      loading,
      pets,
      filteredPets,
      searchQuery,
      activeFilter,
      filterOptions,
      showAdoptionModal,
      selectedPet,
      adoptionForm,
      petImage,
      setActiveFilter,
      applyFilters,
      resetFilters,
      openAdoptionForm,
      closeAdoptionModal,
      submitAdoption,
      toggleFavorite,
      isFavorite
    };
  }
}
</script>

<!-- 样式部分保持不变 -->

<style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #3498db;
      --primary-dark: #2980b9;
      --secondary: #2ecc71;
      --secondary-dark: #27ae60;
      --accent: #e74c3c;
      --light: #f8f9fa;
      --dark: #2c3e50;
      --gray: #7f8c8d;
      --light-gray: #ecf0f1;
      --border-radius: 10px;
      --box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
      --transition: all 0.3s ease;
    }

    body {
      font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%);
      color: var(--dark);
      line-height: 1.6;
      padding: 20px;
      min-height: 100vh;
    }

    .pet-adoption-app {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--box-shadow);
    }

    /* 头部区域 */
    .header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 40px 30px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: "";
      position: absolute;
      top: -50px;
      right: -50px;
      width: 250px;
      height: 250px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .clinic-name {
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 10px;
      opacity: 0.9;
    }

    .header h1 {
      font-size: 2.8rem;
      margin-bottom: 15px;
      font-weight: 700;
    }

    .header p {
      font-size: 1.2rem;
      max-width: 700px;
      margin: 0 auto 25px;
      opacity: 0.9;
    }

    .paw-icon {
      color: #ffd166;
      margin: 0 10px;
      font-size: 1.8rem;
      display: inline-block;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }

    /* 搜索区域 */
    .search-section {
      background: white;
      border-radius: var(--border-radius);
      padding: 25px;
      margin: -20px auto 30px;
      max-width: 1000px;
      box-shadow: var(--box-shadow);
      position: relative;
      z-index: 10;
    }

    .search-box {
      display: flex;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      border-radius: 50px;
      overflow: hidden;
    }

    .search-input {
      flex: 1;
      padding: 15px 25px;
      border: none;
      font-size: 1.1rem;
      background: #f8f9ff;
      outline: none;
      color: var(--dark);
    }

    .search-btn {
      background: var(--secondary);
      color: white;
      border: none;
      padding: 0 35px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .search-btn:hover {
      background: var(--secondary-dark);
    }

    .filter-options {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 20px;
    }

    .filter-btn {
      background: var(--light-gray);
      border: none;
      padding: 10px 20px;
      border-radius: 30px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: var(--transition);
      color: var(--dark);
    }

    .filter-btn.active, .filter-btn:hover {
      background: var(--primary);
      color: white;
    }

    /* 内容区域 */
    .content-area {
      padding: 0 30px 40px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--light-gray);
    }

    .section-title {
      font-size: 1.8rem;
      color: var(--dark);
      font-weight: 600;
    }

    .results-count {
      color: var(--gray);
      font-size: 1rem;
    }

    /* 宠物网格布局 */
    .pet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .pet-item {
      background: white;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--box-shadow);
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      border: 1px solid var(--light-gray);
    }

    .pet-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
    }

    .pet-image {
      height: 220px;
      width: 100%;
      overflow: hidden;
      position: relative;
    }

    .pet-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .pet-item:hover .pet-image img {
      transform: scale(1.05);
    }

    .heart-icon {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #ff6b6b;
      font-size: 1.5rem;
      cursor: pointer;
      transition: var(--transition);
      z-index: 10;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .heart-icon:hover {
      transform: scale(1.15);
    }

    .pet-tag {
      position: absolute;
      bottom: 15px;
      left: 15px;
      background: var(--primary);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .pet-info {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .pet-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--dark);
    }

    .pet-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 15px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      color: var(--gray);
    }

    .detail-item i {
      color: var(--primary);
      width: 20px;
      text-align: center;
    }

    .pet-description {
      margin-bottom: 20px;
      color: var(--dark);
      font-size: 0.95rem;
      line-height: 1.5;
      flex: 1;
    }

    .adopt-btn {
      background: var(--secondary);
      color: white;
      border: none;
      padding: 12px;
      width: 100%;
      border-radius: 8px;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .adopt-btn:hover {
      background: var(--secondary-dark);
      transform: translateY(-2px);
    }

    /* 空状态 */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      margin: 30px 0;
    }

    .empty-state i {
      font-size: 4rem;
      color: #bdc3c7;
      margin-bottom: 20px;
      display: block;
    }

    .empty-state p {
      font-size: 1.3rem;
      color: var(--gray);
      margin-bottom: 30px;
    }

    .reset-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 30px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .reset-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    /* 领养表单模态框 */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: var(--transition);
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: all;
    }

    .modal-container {
      background: white;
      border-radius: var(--border-radius);
      width: 90%;
      max-width: 500px;
      padding: 30px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      transform: translateY(20px);
      transition: var(--transition);
    }

    .modal-overlay.active .modal-container {
      transform: translateY(0);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .modal-header h2 {
      font-size: 1.8rem;
      color: var(--dark);
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--gray);
      cursor: pointer;
      transition: var(--transition);
    }

    .modal-close:hover {
      color: var(--accent);
    }

    .modal-body {
      padding: 10px 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--dark);
    }

    .form-group input, 
    .form-group textarea {
      width: 100%;
      padding: 14px;
      border: 1px solid var(--light-gray);
      border-radius: 8px;
      font-size: 1rem;
      transition: var(--transition);
      color: var(--dark);
      background: white;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }

    .submit-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 15px;
      width: 100%;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .submit-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    /* 页脚 */
    .footer {
      background: var(--dark);
      color: white;
      padding: 25px 30px;
      text-align: center;
    }

    .footer p {
      margin: 5px 0;
      color: #ecf0f1;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 25px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .footer-link {
      color: #bdc3c7;
      text-decoration: none;
      transition: var(--transition);
    }

    .footer-link:hover {
      color: var(--primary);
    }

    /* 响应式设计 */
    @media (max-width: 992px) {
      .header h1 {
        font-size: 2.3rem;
      }
      
      .header p {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 768px) {
      .pet-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
      
      .search-box {
        flex-direction: column;
        border-radius: var(--border-radius);
      }
      
      .search-input {
        padding: 15px;
      }
      
      .search-btn {
        padding: 15px;
      }
    }

    @media (max-width: 576px) {
      .header {
        padding: 30px 20px;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .section-title {
        font-size: 1.5rem;
      }
      
      .footer-links {
        flex-direction: column;
        gap: 12px;
      }
    }
  </style>