<template>
  <div class="pet-management">
    <!-- 头部区域 -->
    <div class="header">
      <h1>宠物医院管理系统</h1>
      <div class="subtitle">宠物信息管理模块</div>
    </div>
  
      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <div class="search-box">
          <div class="filter-group">
            <label>宠物姓名：</label>
            <input 
              type="text" 
              v-model="filters.name" 
              placeholder="搜索宠物名称" 
              class="search-input"
            >
          </div>
          <div class="filter-group">
            <label>宠物病症：</label>
            <input 
              type="text" 
              v-model="filters.disease" 
              placeholder="搜索宠物病症" 
              class="search-input"
            >
          </div>
          <div class="filter-group">
            <label>主人姓名：</label>
            <input 
              type="text" 
              v-model="filters.owner" 
              placeholder="搜索主人姓名" 
              class="search-input"
            >
          </div>
        </div>
  
        <div class="filters">
          <div class="filter-group">
            <label>领养状态：</label>
            <select v-model="filters.status" class="filter-select">
              <option value="all">全部</option>
              <option value="owned">有主人</option>
              <option value="forAdoption">待领养</option>
              <option value="adopted">已领养</option>
            </select>
          </div>
  
          <div class="filter-group">
            <label>年龄范围：</label>
            <select v-model="filters.ageRange" class="filter-select">
              <option value="all">全部</option>
              <option value="0-2">0-2岁</option>
              <option value="3-5">3-5岁</option>
              <option value="6+">6岁及以上</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- 操作按钮区域 -->
      <div class="action-buttons">
        <button class="btn primary" @click="addNewPet" :disabled="loading">
          <i class="fas fa-plus"></i> 添加新宠物
        </button>
        <button class="btn secondary" :disabled="loading">
          <i class="fas fa-download"></i> 导出数据
        </button>
        
        <!-- 操作状态提示 -->
        <div class="operation-status">
          <span v-if="loading" class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i> 处理中...
          </span>
          <span v-if="error" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </span>
          <span v-if="success" class="success-message">
            <i class="fas fa-check-circle"></i> {{ success }}
          </span>
        </div>
      </div>
  
      <!-- 加载状态 -->
      <div v-if="loading && pets.length === 0" class="loading-state">
        <i class="fas fa-paw fa-spin"></i>
        <p>正在加载宠物数据...</p>
      </div>
  
      <!-- 宠物列表展示 -->
      <div v-else class="pet-container">
        <div 
          v-for="pet in filteredPets" 
          :key="pet.id" 
          class="pet-card"
          :class="{
            'for-adoption': pet.adoptionStatus === 'forAdoption',
            'adopted': pet.adoptionStatus === 'adopted'
          }"
        >
          <div class="pet-header">
            <div class="pet-image">
              <img :src="petImage(pet)" alt="宠物图片">
            </div>
            <div class="pet-info">
              <div class="pet-name">{{ pet.name }}</div>
              <div class="pet-status">
                <span class="status-tag" :class="getStatusClass(pet.adoptionStatus)">
                  {{ getStatusText(pet.adoptionStatus) }}
                </span>
              </div>
              <div class="pet-age">年龄: {{ pet.age }}岁</div>
            </div>
          </div>
  
          <div class="pet-details">
            <div class="detail-row">
              <span class="detail-label1">病症 :</span>
              <span v-if="!pet.editing" class="detail-value">{{ pet.disease || '无' }}</span>
              <input v-else v-model="pet.editingData.disease" class="edit-input">
            </div>
            <div class="owner-info">
              <div v-if="pet.adoptionStatus === 'owned'" >
                <div class="detail-row">
                  <span class="detail-label">主人信息 :</span>
                  <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.name || '无' }}</span>
                  <input v-else v-model="pet.editingData.owner.name" class="edit-input">
                </div>
                <div class="detail-row">
                  <span class="detail-label">性别 :</span>
                  <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.gender || '无' }}</span>
                  <select v-else v-model="pet.editingData.owner.gender" class="edit-select">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div class="detail-row">
                  <span class="detail-label">联系电话 :</span>
                  <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.phone || '无' }}</span>
                  <input v-else v-model="pet.editingData.owner.phone" class="edit-input">
                </div>
                <div class="detail-row">
                  <span class="detail-label">地址 :</span>
                  <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.address || '无' }}</span>
                  <input v-else v-model="pet.editingData.owner.address" class="edit-input">
                </div>
              </div>
              
              <div v-else>
                <div v-if="pet.adoptionStatus !== 'adopted'" class="no-owner">
                  此宠物等待领养
                </div>
                <div v-else>
                  <div class="detail-row">
                    <span class="detail-label">领养人信息 :</span>
                    <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.name || '无' }}</span>
                    <input v-else v-model="pet.editingData.owner.name" class="edit-input">
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">性别 :</span>
                    <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.gender || '无' }}</span>
                    <select v-else v-model="pet.editingData.owner.gender" class="edit-select">
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">联系电话 :</span>
                    <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.phone || '无' }}</span>
                    <input v-else v-model="pet.editingData.owner.phone" class="edit-input">
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">地址 :</span>
                    <span v-if="!pet.editing" class="detail-value">{{ pet.owner?.address || '无' }}</span>
                    <input v-else v-model="pet.editingData.owner.address" class="edit-input">
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="pet-actions">
            <template v-if="!pet.editing">
              <button class="action-btn edit" @click="startEditing(pet)" :disabled="loading">
                <i class="fas fa-edit"></i> 修改
              </button>
              <button class="action-btn view" @click="viewPet(pet)" :disabled="loading">
                <i class="fas fa-eye"></i> 查看
              </button>
              <button class="action-btn delete" @click="deletePet(pet.id)" :disabled="loading">
                <i class="fas fa-trash"></i> 删除
              </button>
            </template>
            
            <template v-else>
              <button class="action-btn save" @click="savePet(pet)" :disabled="loading">
                <i class="fas fa-save"></i> 保存
              </button>
              <button class="action-btn cancel" @click="cancelEditing(pet)" :disabled="loading">
                <i class="fas fa-times"></i> 取消
              </button>
              <button class="action-btn delete" @click="deletePet(pet.id)" :disabled="loading">
                <i class="fas fa-trash"></i> 删除
              </button>
            </template>
          </div>
        </div>
      </div>
  
      <!-- 空状态提示 -->
      <div v-if="!loading && filteredPets.length === 0" class="empty-state">
        <i class="fas fa-paw"></i>
        <p>没有找到符合条件的宠物</p>
        <button class="btn primary" @click="resetFilters">重置筛选条件</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  
  // 模拟API服务 - 实际开发中替换为真实API调用
  const petService = {
    // 获取宠物列表
    async getPets() {
      // 实际实现中替换为:
      // return axios.get('/api/pets');
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: '小白',
              age: 3,
              disease: '感冒，流鼻涕',
              image: null,
              adoptionStatus: 'owned',
              owner: {
                name: '张先生',
                gender: '男',
                phone: '13800138000',
                address: '无'
              }
            },
            {
              id: 2,
              name: '喵喵',
              age: 1,
              disease: '肠胃不适',
              image: null,
              adoptionStatus: 'forAdoption',
              owner: null
            },
            {
              id: 3,
              name: '旺财',
              age: 5,
              disease: '皮肤病',
              image: null,
              adoptionStatus: 'adopted',
              owner: {
                name: '张先生',
                gender: '男',
                phone: '13800138000',
                address: '翻斗花园1号楼'
              }
            },
            {
              id: 4,
              name: '球球',
              age: 2,
              disease: '耳螨',
              image: null,
              adoptionStatus: 'owned',
              owner: {
                name: '李女士',
                gender: '女',
                phone: '13900139000',
                address: '星星小区2单元'
              }
            },
            {
              id: 5,
              name: '豆豆',
              age: 4,
              disease: '骨折恢复期',
              image: null,
              adoptionStatus: 'forAdoption',
              owner: null
            },
            {
              id: 6,
              name: '布丁',
              age: 7,
              disease: '老年犬关节炎',
              image: null,
              adoptionStatus: 'owned',
              owner: {
                name: '王先生',
                gender: '男',
                phone: '13700137000',
                address: '阳光花园3栋'
              }
            }
          ]);
        }, 800);
      });
    },
    
    // 添加宠物
    async addPet(petData) {
      // 实际实现中替换为:
      // return axios.post('/api/pets', petData);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ...petData,
            id: Math.floor(Math.random() * 1000) + 100
          });
        }, 500);
      });
    },
    
    // 更新宠物
    async updatePet(petId, petData) {
      // 实际实现中替换为:
      // return axios.put(`/api/pets/${petId}`, petData);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(petData);
        }, 500);
      });
    },
    
    // 删除宠物
    async deletePet(petId) {
      // 实际实现中替换为:
      // return axios.delete(`/api/pets/${petId}`);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      });
    }
  };
  
  export default {
    setup() {
      // 状态管理
      const loading = ref(false);
      const error = ref(null);
      const success = ref(null);
      
      // 筛选条件
      const filters = ref({
        name: '',
        disease: '',
        owner: '',
        status: 'all',
        ageRange: 'all'
      });
      
      // 宠物数据
      const pets = ref([]);
      
      // 加载宠物数据
      const loadPets = async () => {
        try {
          loading.value = true;
          error.value = null;
          const data = await petService.getPets();
          pets.value = data.map(pet => ({
            ...pet,
            editing: false,
            editingData: {}
          }));
        } catch (err) {
          error.value = '加载宠物数据失败: ' + (err.message || '未知错误');
          console.error('加载宠物数据失败:', err);
        } finally {
          loading.value = false;
        }
      };
      
      // 计算属性 - 筛选后的宠物列表
      const filteredPets = computed(() => {
        return pets.value.filter(pet => {
          // 搜索条件匹配
          const matchesName = !filters.value.name || 
            pet.name.toLowerCase().includes(filters.value.name.toLowerCase());
          
          const matchesDisease = !filters.value.disease || 
            (pet.disease && pet.disease.toLowerCase().includes(filters.value.disease.toLowerCase()));
          
          const matchesOwner = !filters.value.owner || 
            (pet.owner && pet.owner.name.toLowerCase().includes(filters.value.owner.toLowerCase()));
          
          // 领养状态匹配
          const matchesStatus = filters.value.status === 'all' || 
            pet.adoptionStatus === filters.value.status;
          
          // 年龄匹配
          let matchesAge = true;
          if (filters.value.ageRange !== 'all') {
            const [min, max] = filters.value.ageRange.split('-');
            if (max) {
              matchesAge = pet.age >= parseInt(min) && pet.age <= parseInt(max);
            } else {
              matchesAge = pet.age >= parseInt(min);
            }
          }
          
          return matchesName && matchesDisease && matchesOwner && matchesStatus && matchesAge;
        });
      });
      
      // 获取宠物图片
      const petImage = (pet) => {
        return pet.image || 'https://via.placeholder.com/100';
      };
      
      // 开始编辑宠物信息
      const startEditing = (pet) => {
        pet.editing = true;
        // 深拷贝当前数据到编辑数据对象
        pet.editingData = {
          name: pet.name,
          age: pet.age,
          disease: pet.disease,
          adoptionStatus: pet.adoptionStatus,
          owner: pet.owner ? {...pet.owner} : null
        };
      };
      
      // 保存编辑
      const savePet = async (pet) => {
        try {
          loading.value = true;
          error.value = null;
          success.value = null;
          
          // 准备要保存的数据
          const saveData = {
            name: pet.editingData.name,
            age: pet.editingData.age,
            disease: pet.editingData.disease,
            adoptionStatus: pet.editingData.adoptionStatus,
            owner: pet.editingData.owner
          };
          
          // 调用API保存数据
          const updatedPet = await petService.updatePet(pet.id, saveData);
          
          // 更新本地数据
          Object.assign(pet, {
            ...updatedPet,
            editing: false,
            editingData: {}
          });
          
          success.value = '宠物信息更新成功';
        } catch (err) {
          error.value = '保存宠物信息失败: ' + (err.message || '未知错误');
          console.error('保存宠物信息失败:', err);
        } finally {
          loading.value = false;
          // 5秒后清除成功消息
          setTimeout(() => {
            success.value = null;
          }, 5000);
        }
      };
      
      // 取消编辑
      const cancelEditing = (pet) => {
        pet.editing = false;
        pet.editingData = {};
      };
      
      // 删除宠物
      const deletePet = async (id) => {
        if (!confirm('确定要删除这只宠物的记录吗？此操作不可恢复。')) return;
        
        try {
          loading.value = true;
          error.value = null;
          success.value = null;
          
          // 调用API删除宠物
          await petService.deletePet(id);
          
          // 更新本地数据
          pets.value = pets.value.filter(pet => pet.id !== id);
          
          success.value = '宠物删除成功';
        } catch (err) {
          error.value = '删除宠物失败: ' + (err.message || '未知错误');
          console.error('删除宠物失败:', err);
        } finally {
          loading.value = false;
          // 5秒后清除成功消息
          setTimeout(() => {
            success.value = null;
          }, 5000);
        }
      };
      
      // 查看宠物详情
      const viewPet = (pet) => {
        alert(`查看宠物详情: ${pet.name}\nID: ${pet.id}\n此功能将在后续版本实现`);
      };
      
      // 添加新宠物
      const addNewPet = async () => {
        try {
          loading.value = true;
          error.value = null;
          success.value = null;
          
          const newPetData = {
            name: '新宠物',
            age: 1,
            disease: '',
            image: null,
            adoptionStatus: 'forAdoption',
            owner: null
          };
          
          // 调用API添加宠物
          const newPet = await petService.addPet(newPetData);
          
          // 添加到本地列表
          pets.value.push({
            ...newPet,
            editing: true,
            editingData: {
              ...newPetData,
              owner: null
            }
          });
          
          success.value = '新宠物添加成功';
        } catch (err) {
          error.value = '添加宠物失败: ' + (err.message || '未知错误');
          console.error('添加宠物失败:', err);
        } finally {
          loading.value = false;
          // 5秒后清除成功消息
          setTimeout(() => {
            success.value = null;
          }, 5000);
        }
      };
      
      // 重置筛选条件
      const resetFilters = () => {
        filters.value = {
          name: '',
          disease: '',
          owner: '',
          status: 'all',
          ageRange: 'all'
        };
      };
      
      // 获取状态文本
      const getStatusText = (status) => {
        switch (status) {
          case 'owned': return '有主人';
          case 'forAdoption': return '待领养';
          case 'adopted': return '已领养';
          default: return '';
        }
      };
      
      // 获取状态类名
      const getStatusClass = (status) => {
        switch (status) {
          case 'owned': return 'owned';
          case 'forAdoption': return 'for-adoption';
          case 'adopted': return 'adopted';
          default: return '';
        }
      };
      
      // 初始化加载数据
      onMounted(loadPets);
      
      return {
        filters,
        pets,
        filteredPets,
        loading,
        error,
        success,
        petImage,
        startEditing,
        savePet,
        cancelEditing,
        deletePet,
        viewPet,
        addNewPet,
        resetFilters,
        getStatusText,
        getStatusClass
      };
    }
  };
  </script>
  
  <style scoped>
  .pet-management {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #3498db, #8e44ad);
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .header h1 {
    margin: 0;
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
  }
  
  .filter-section {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .search-box {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 250px;
  }
  
  .filter-group label {
    font-weight: 500;
    margin-right: 10px;
    min-width: 80px;
  }
  
  .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: white;
      font-size: 1rem;
    }
    
  .search-input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  .search-input:focus {
    border-color: #3498db;
    outline: none;
  }
  
  .filters {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .action-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    align-items: center;
  }
  
  .operation-status {
    margin-left: 20px;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 0.9rem;
  }
  
  .loading-indicator {
    color: #3498db;
  }
  
  .error-message {
    color: #e74c3c;
  }
  
  .success-message {
    color: #27ae60;
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn i {
    font-size: 0.9rem;
  }
  
  .btn.primary {
    background: #3498db;
    color: white;
  }
  
  .btn.primary:hover:not(:disabled) {
    background: #2980b9;
  }
  
  .btn.secondary {
    background: #e0e0e0;
    color: #333;
  }
  
  .btn.secondary:hover:not(:disabled) {
    background: #d0d0d0;
  }
  
  .loading-state {
    text-align: center;
    padding: 50px;
    color: #3498db;
  }
  
  .loading-state i {
    font-size: 3rem;
    margin-bottom: 20px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .pet-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    margin-top: 20px;
  }
  
  .pet-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    border-top: 4px solid #3c8ce7;
  }
  
  .pet-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  .pet-card.for-adoption {
    border-top: 4px solid #e74c3c;
  }
  
  .pet-card.adopted {
    border-top: 4px solid #27ae60;
  }
  
  .pet-header {
    display: flex;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-bottom: 1px solid #eee;
  }
  
  .pet-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .pet-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .pet-info {
    flex: 1;
  }
  
  .pet-name {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 5px;
    color: #2c3e50;
  }
  
  .pet-status {
    margin-bottom: 8px;
  }
  
  .status-tag {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .status-tag.owned {
    background: #3498db;
    color: white;
  }
  
  .status-tag.for-adoption {
    background: #e74c3c;
    color: white;
  }
  
  .status-tag.adopted {
    background: #27ae60;
    color: white;
  }
  
  .pet-age {
    font-size: 0.95rem;
    color: #7f8c8d;
  }
  
  .pet-details {
    padding: 20px;
    flex: 1;
  }
  
  .detail-row {
    display: flex;
    margin-bottom: 12px;
  }
  
  .detail-label1 {
    font-weight: 600;
    min-width: 50px;
    color: #34495e;
  }
  
  .detail-label {
    font-weight: 600;
    min-width: 110px;
    color: #34495e;
  }
  
  .detail-value {
    flex: 1;
    color: #2c3e50;
  }
  
  .owner-info {
    padding: 15px 0;
    border-top: 1px dashed #eee;
    font-style: normal;
    color: black;
  }
  
  .no-owner {
    text-align: center;
    padding: 15px 0;
    color: #7f8c8d;
    font-style: italic;
  }
  
  .edit-input, .edit-select {
    flex: 1;
    padding: 3px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
  }
  
  .edit-input:focus, .edit-select:focus {
    border-color: #3498db;
    outline: none;
  }
  
  .pet-actions {
    display: flex;
    border-top: 1px solid #eee;
    padding: 15px;
    background: #f8f9fa;
  }
  
  .action-btn {
    flex: 1;
    padding: 8px 10px;
    margin: 0 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.2s;
  }
  
  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .action-btn.edit {
    background: #f39c12;
    color: white;
  }
  
  .action-btn.edit:hover:not(:disabled) {
    background: #e67e22;
  }
  
  .action-btn.view {
    background: #3498db;
    color: white;
  }
  
  .action-btn.view:hover:not(:disabled) {
    background: #2980b9;
  }
  
  .action-btn.delete {
    background: #e74c3c;
    color: white;
  }
  
  .action-btn.delete:hover:not(:disabled) {
    background: #c0392b;
  }
  
  .action-btn.save {
    background: #27ae60;
    color: white;
  }
  
  .action-btn.save:hover:not(:disabled) {
    background: #219653;
  }
  
  .action-btn.cancel {
    background: #7f8c8d;
    color: white;
  }
  
  .action-btn.cancel:hover:not(:disabled) {
    background: #636e72;
  }
  
  .empty-state {
    text-align: center;
    padding: 50px 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .empty-state i {
    font-size: 4rem;
    color: #bdc3c7;
    margin-bottom: 20px;
  }
  
  .empty-state p {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 30px;
  }
  
  @media (max-width: 768px) {
    .pet-container {
      grid-template-columns: 1fr;
    }
    
    .filters {
      flex-direction: column;
      gap: 15px;
    }
    
    .filter-group {
      min-width: 100%;
    }
    
    .action-buttons {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .operation-status {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  </style>