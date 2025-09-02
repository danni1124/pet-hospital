<template>
  <div class="pet-adoption">
    <!-- 头部区域 -->
    <div class="header">
      <div class="header-content">
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
          placeholder="搜索宠物名称、品种或描述..."
          @keyup.enter="applyFilters"
        >
        <button class="search-btn" @click="applyFilters">
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

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>正在加载宠物信息...</p>
      </div>

      <!-- 宠物网格 -->
      <div v-else class="pet-grid">
        <div 
          v-for="pet in filteredPets" 
          :key="pet.petId" 
          class="pet-item"
        >
          <div class="pet-image">
            <img :src="getPetImage(pet)" :alt="pet.petName">
            <div class="pet-tag">{{ pet.type === 'dog' ? '狗狗' : '猫咪' }} · {{ pet.age }}岁</div>
          </div>
          <div class="pet-info">
            <h3 class="pet-name">{{ pet.petName }}</h3>
            <div class="pet-details">
              <div class="detail-item">
                <i class="fas" :class="pet.gender === '公' ? 'fa-mars' : 'fa-venus'"></i> 
                {{ pet.gender }}
              </div>
              <div class="detail-item">
                <i class="fas fa-weight"></i> {{ pet.weight }}公斤
              </div>
              <div class="detail-item1">
                <i class="fas fa-stethoscope"></i> {{ pet.disease || '健康' }}
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

    <!-- 领养申请模态框 -->
    <div class="modal-overlay" :class="{ active: showAdoptionModal }">
      <div class="modal-container" v-if="selectedPet">
        <div class="modal-header">
          <h2>领养申请表 - {{ selectedPet.petName }}</h2>
          <button class="modal-close" @click="closeAdoptionModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>您的姓名</label>
            <input type="text" v-model="adoptionForm.username" required>
          </div>
          <div class="form-group">
            <label>您的性别</label>
            <input type="gender" v-model="adoptionForm.gender" required>
          </div>
          <div class="form-group">
            <label>联系电话</label>
            <input type="tel" v-model="adoptionForm.phone" required>
          </div>
          <div class="form-group">
            <label>电子邮箱</label>
            <input type="email" v-model="adoptionForm.email">
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

    <!-- 申请成功提示 -->
    <div class="modal-overlay" :class="{ active: showSuccessModal }">
      <div class="modal-container success-modal">
        <div class="modal-header">
          <h2>申请提交成功！</h2>
          <button class="modal-close" @click="closeSuccessModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <p>感谢您提交领养申请，我们会尽快审核并与您联系。</p>
          <button class="confirm-btn" @click="closeSuccessModal">确定</button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-links">
        <a href="/introduction">关于我们</a>
        <a href="#" @click.prevent="openProcessModal">领养流程</a>
        <a href="#" @click.prevent="openContactModal">联系我们</a>
      </div>
      <p>德扬宠物医院 &copy; 2025 宠物领养中心</p>
      <p>领养代替购买，给生命一次机会</p>
    </div>
    <!-- 领养流程模态框 -->
    <div class="modal-overlay" :class="{ active: showProcessModal }">
      <div class="modal-container">
        <div class="modal-header">
          <h2>领养流程</h2>
          <button class="modal-close" @click="closeProcessModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="process-steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>提交申请</h3>
                <p>填写领养申请表，提供个人信息和家庭环境描述</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>审核评估</h3>
                <p>工作人员将在3个工作日内审核您的申请</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>家访考察</h3>
                <p>通过初步审核后，将安排工作人员上门家访</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>签订协议</h3>
                <p>家访通过后，双方签订领养协议</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">5</div>
              <div class="step-content">
                <h3>宠物交接</h3>
                <p>完成疫苗接种和绝育手术后，安排宠物交接</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系我们模态框 -->
    <div class="modal-overlay" :class="{ active: showContactModal }">
      <div class="modal-container">
        <div class="modal-header">
          <h2>联系我们</h2>
          <button class="modal-close" @click="closeContactModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h3>地址</h3>
                <p>北京市朝阳区西街路123号</p>
              </div>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <div>
                <h3>电话</h3>
                <p>400-123-4567</p>
              </div>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h3>邮箱</h3>
                <p>contact@deyangpet.com</p>
              </div>
            </div>
            <div class="contact-item">
              <i class="fas fa-clock"></i>
              <div>
                <h3>工作时间</h3>
                <p>周一至周五 8:30 - 20:00</p><p> 周六至周日 9:00 - 18:00</p>
                  <p>急诊服务 24小时</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { read } from 'xlsx';

export default {
  name: 'PetAdoption',
  setup() {
    const apiBaseUrl = ref('http://47.113.205.34:8085');
    
    return {
      apiBaseUrl
    };
  },
  data() {
    return {
       // ...原有数据...
      showProcessModal: false,
      showContactModal: false,
      loading: true,
      pets: [],
      searchQuery: '',
      activeFilter: 'all',
      showAdoptionModal: false,
      showSuccessModal: false,
      selectedPet: null,
      adoptionForm: {
        username: '',
        phone: '',
        gender:'',
        email: '',
        environment: ''
      },
      filterOptions: [
        { label: '全部宠物', value: 'all' },
        { label: '狗狗', value: 'dog' },
        { label: '猫咪', value: 'cat' },
        { label: '小型宠物', value: 'small' },
        { label: '大型宠物', value: 'large' },
        { label: '健康宠物', value: 'healthy' },
        { label: '幼年宠物', value: 'young' }
      ],
      currentUser: null
    };
  },
  computed: {
    filteredPets() {
      return this.pets.filter(pet => {
        // 只显示待领养的宠物
        if (pet.adoptionStatus !== '待领养') {
          return false;
        }
        
        // 搜索条件匹配 - 搜索名称、品种或描述
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearch = !this.searchQuery || 
          pet.petName.toLowerCase().includes(searchLower) ||
          (pet.breed && pet.breed.toLowerCase().includes(searchLower)) ||
          (pet.description && pet.description.toLowerCase().includes(searchLower));
        
        // 筛选条件匹配
        let matchesFilter = true;
        if (this.activeFilter !== 'all') {
          switch (this.activeFilter) {
            case 'dog':
              matchesFilter = pet.type === 'dog';
              break;
            case 'cat':
              matchesFilter = pet.type === 'cat';
              break;
            case 'small':
              matchesFilter = pet.weight < 5; // 小型宠物体重小于5公斤
              break;
            case 'large':
              matchesFilter = pet.weight >= 15; // 大型宠物体重大于等于15公斤
              break;
            case 'healthy':
              matchesFilter = !pet.disease || pet.disease === '' || pet.disease === '无' || pet.disease === '健康';
              break;
            case 'young':
              matchesFilter = pet.age < 2; // 幼年宠物年龄小于2岁
              break;
          }
        }
        
        return matchesSearch && matchesFilter;
      });
    }
  },
  mounted() {
    this.loadPets();
    this.loadCurrentUser();
  },
  methods: {
    async loadPets() {
      this.loading = true;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/getPetsAndOwners`);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data) {
          // 简化数据结构，只保留pet信息
          this.pets = response.data.data.map(item => item.pet);
          console.log('Processed pets:', this.pets);
        } else {
          console.error('Unexpected API response structure');
          // 使用模拟数据作为后备
          this.useMockData();
        }
      } catch (error) {
        console.error('加载宠物数据失败:', error);
        // 使用模拟数据作为后备
        this.useMockData();
      } finally {
        this.loading = false;
      }
    },
    
    useMockData() {
      this.pets = [
        {
          petId: 1,
          petName: '小白',
          age: 3,
          gender: '公',
          weight: 12,
          type: 'dog',
          breed: '拉布拉多',
          disease: '感冒已康复',
          adoptionStatus: '待领养',
          description: '温顺友好的拉布拉多，已绝育，喜欢和人玩耍，特别适合有孩子的家庭。',
          image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=80'
        },
        {
          petId: 2,
          petName: '喵喵',
          age: 2,
          gender: '母',
          weight: 4,
          type: 'cat',
          breed: '英国短毛猫',
          disease: '',
          adoptionStatus: '待领养',
          description: '活泼可爱的英国短毛猫，已接种疫苗，会用猫砂盆，喜欢被抚摸。',
          image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
        },
        {
          petId: 3,
          petName: '豆豆',
          age: 4,
          gender: '公',
          weight: 8,
          type: 'dog',
          breed: '边境牧羊犬',
          disease: '骨折恢复期',
          adoptionStatus: '待领养',
          description: '聪明忠诚的边境牧羊犬，已绝育，擅长接飞盘，需要充足的运动空间。',
          image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80'
        },
        {
          petId: 4,
          petName: '橘子',
          age: 1,
          gender: '公',
          weight: 3.5,
          type: 'cat',
          breed: '橘猫',
          disease: '',
          adoptionStatus: '待领养',
          description: '温顺的橘猫，已绝育，喜欢在阳光下打盹，能与其它宠物和睦相处。',
          image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80'
        }
      ];
    },
    
    async loadCurrentUser() {
      try {
        // 从本地存储获取用户ID或从登录状态获取
        const currentUserStr = localStorage.getItem('currentUser')
        if (!currentUserStr) {
          console.error('未找到登录用户信息')
          return
        }
        
        const currentUser = JSON.parse(currentUserStr)
        const userId = currentUser.userId
        
        if (!userId) {
          console.error('用户ID不存在，无法获取详细信息')
          // 使用localStorage中的基本信息作为降级方案
          userInfo.value = {
            userId: 'unknown',
            gender:'',
            username: currentUser.username || 'unknown',
            level: 1,
            phone: '',
            email: '',
            avatar_url: '',
            address: ''
          }
          return
        }
        
        console.log('获取用户详细信息，userId:', userId)
        const response = await axios.get(`${this.apiBaseUrl}/getUser`, {
        params: { userId: userId }
      })
        console.log('User response:', response);
        
        if (response.data && response.data.data) {
          this.currentUser = response.data.data;
          
          // 自动填充用户信息到申请表
          this.adoptionForm.username = this.currentUser.username || '';
          this.adoptionForm.phone = this.currentUser.phone || '';
          this.adoptionForm.email = this.currentUser.email || '';
          this.adoptionForm.gender = this.currentUser.gender || '';
        } else {
          // 模拟用户数据
          this.currentUser = {
            userId: 1,
            gender:'男',
            username: 'chen',
            phone: '13900139000',
            email: 'chen@example.com'
          };
          
          this.adoptionForm.username = this.currentUser.username;
          this.adoptionForm.phone = this.currentUser.phone;
          this.adoptionForm.email = this.currentUser.email;
          this.adoptionForm.gender = this.currentUser.gender ;
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        // 模拟用户数据
        this.currentUser = {
          userId: 1,
          username: 'chen',
          phone: '13900139000',
          email: 'chen@example.com'
        };
        
        this.adoptionForm.username = this.currentUser.username;
        this.adoptionForm.phone = this.currentUser.phone;
        this.adoptionForm.email = this.currentUser.email;
      }
    },
    
    getPetImage(pet) {
      if (!pet.image) return 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';
      // 检查是否是完整URL
      if (pet.image.startsWith('http')) return pet.image;
      return `${this.apiBaseUrl}${pet.image}`;
    },
    
    setActiveFilter(filter) {
      this.activeFilter = filter;
    },
    
    applyFilters() {
      // 筛选逻辑在计算属性中处理
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.activeFilter = 'all';
    },
    
    openAdoptionForm(pet) {
      this.selectedPet = pet;
      this.showAdoptionModal = true;
    },
    
    closeAdoptionModal() {
      this.showAdoptionModal = false;
      this.selectedPet = null;
    },
    
    async submitAdoption() {
      // 修复了访问adoptionForm属性的错误
      console.log("333")
      if (!this.adoptionForm.username || !this.adoptionForm.phone) {
        console.log("222")
        alert('请填写姓名和联系电话');
        return;
      }
      const now = new Date();
      const year = now.getFullYear();
      const month = ('0' + (now.getMonth() + 1)).slice(-2);
      const day = ('0' + now.getDate()).slice(-2);
      const hours = ('0' + now.getHours()).slice(-2);
      const minutes = ('0' + now.getMinutes()).slice(-2);
      const seconds = ('0' + now.getSeconds()).slice(-2);

      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      console.log(formattedTime);
      try {
        console.log("111")
        // 提交领养申请
        const applicationData = {
          read:'否',
          petId: this.selectedPet.petId,
          userId: this.currentUser.userId,
          username: this.adoptionForm.username,
          phone: this.adoptionForm.phone,
          email: this.adoptionForm.email,
          gender: this.adoptionForm.gender,
          environment: this.adoptionForm.environment,

        };
        console.log(applicationData)
        const response=await axios.post(`${this.apiBaseUrl}/addApplication`, applicationData);
        console.log(response)
        // 关闭申请模态框，显示成功提示
        this.closeAdoptionModal();
        this.showSuccessModal = true;
        
        // 重置表单
        this.adoptionForm.environment = '';
      } catch (error) {
        console.error('提交申请失败:', error);
        alert('提交申请失败，请稍后重试');
      }
    },
    
    closeSuccessModal() {
      this.showSuccessModal = false;
    },
    openProcessModal() {
      this.showProcessModal = true;
    },
    openContactModal() {
      this.showContactModal = true;
    },
    closeProcessModal() {
      this.showProcessModal = false;
    },
    closeContactModal() {
      this.showContactModal = false;
    },
  }
};
</script>

<style scoped>
.pet-adoption {
  max-width: 1350px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #3498db, #8e44ad);
  color: white;
  padding: 40px 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;
  height: 135px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.paw-icon {
  color: #ffd166;
  margin: 0 10px;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
}

.search-section {
  background: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-box {
  display: flex;
  max-width: 800px;
  margin: 0 auto 20px;
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
}

.search-btn {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0 35px;
  font-size: 1.1rem;
  cursor: pointer;
  height: 50px;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #27ae60;
}

.filter-options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-btn {
  background: #e9ecef;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active, .filter-btn:hover {
  background: #3498db;
  color: white;
}

.content-area {
  padding: 0 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
}

.results-count {
  color: #7f8c8d;
  font-size: 1rem;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin: 30px 0;
}

.loading-state i {
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 20px;
  display: block;
}

.loading-state p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 10px;
}

.pet-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.pet-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.pet-image {
  height: 200px;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.pet-item:hover .pet-image img {
  transform: scale(1.05);
}

.pet-tag {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: #3498db;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.pet-info {
  padding: 20px;
  height: 273px;
}

.pet-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2c3e50;
}

.pet-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.detail-item i {
  color: #3498db;
  width: 16px;
  text-align: center;
}

.detail-item1 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #7f8c8d;
  grid-column: 1 / -1;
}

.detail-item1 i {
  color: #3498db;
  width: 16px;
  text-align: center;
}
.pet-description {
  margin-bottom: 20px;
  color: #555;
  line-height: 1.5;
  font-size: 0.95rem;
  height: 40px;
}

.adopt-btn {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.adopt-btn:hover {
  background: #27ae60;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
  color: #7f8c8d;
  margin-bottom: 30px;
}

.reset-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-btn:hover {
  background: #2980b9;
}

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
  transition: opacity 0.3s;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: all;
}

.modal-container {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 550px;
  padding: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(20px);
  transition: transform 0.3s;
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
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #7f8c8d;
  cursor: pointer;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #e74c3c;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input, 
.form-group textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3498db;
  outline: none;
}

.submit-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 15px;
  width: 100%;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover {
  background: #2980b9;
}

.success-modal {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  color: #2ecc71;
  margin-bottom: 10px;
}

.success-modal p {
  font-size: 1.2rem;
  margin-bottom: 25px;
  color: #2c3e50;
}

.confirm-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.confirm-btn:hover {
  background: #2980b9;
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 25px;
  text-align: center;
  border-radius: 10px;
  margin-top: 40px;
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
.footer-links a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: var(--transition);
  display: block;
  padding: 5px 0;
}

.footer-links a:hover {
  color: var(--secondary-color);
}
.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #3498db;
}
/* 领养流程样式 */
.process-steps {
  padding: 20px;
}
 
.step-item {
  display: flex;
  margin-bottom: 25px;
  align-items: flex-start;
}
 
.step-number {
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 20px;
  flex-shrink: 0;
}
 
.step-content h3 {
  color: #2c3e50;
  margin-bottom: 8px;
}
 
.step-content p {
  color: #7f8c8d;
  line-height: 1.6;
}
 
/* 联系我们样式 */
.contact-info {
  padding: 20px;
}
 
.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
 
.contact-item i {
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 1.2rem;
}
 
.contact-item h3 {
  color: #2c3e50;
  margin-bottom: 5px;
}
 
.contact-item p {
  color: #7f8c8d;
  margin: 0;
}
@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .search-box {
    flex-direction: column;
    border-radius: 10px;
  }
  
  .search-input {
    padding: 15px;
  }
  
  .search-btn {
    padding: 15px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .pet-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 12px;
  }
}

</style>