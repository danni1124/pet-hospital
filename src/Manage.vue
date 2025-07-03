<template>
  <div class="main-container">
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
        
        <!-- 操作按钮区域 -->
        <div class="action-buttons">
          <button class="btn primary" @click="addNewPet" :disabled="loading">
            <i class="fas fa-plus"></i> 添加新宠物
          </button>
          <button class="btn secondary" @click="exportToExcel" :disabled="loading">
            <i class="fas fa-download"></i> 导出数据
          </button>
        </div>
      </div>
    </div>

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
            <div v-if="!pet.editing" class="pet-name">{{ pet.name }}</div>
            <input v-else v-model="pet.editingData.name" class="edit-input pet-name-input">
            
            <div class="pet-status">
              <span v-if="!pet.editing" class="status-tag" :class="getStatusClass(pet.adoptionStatus)">
                {{ getStatusText(pet.adoptionStatus) }}
              </span>
              <select v-else v-model="pet.editingData.adoptionStatus" class="edit-select" @change="onStatusChange(pet)">
                <option value="owned">有主人</option>
                <option value="forAdoption">待领养</option>
                <option value="adopted">已领养</option>
              </select>
            </div>
            
            <div class="pet-age-row">
              <span v-if="!pet.editing" class="pet-age">年龄: {{ pet.age }}岁</span>
              <div v-else class="age-edit">
                <label>年龄:</label>
                <input v-model="pet.editingData.age" type="number" min="0" max="30" class="edit-input age-input">
                <span>岁</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pet-details">
          <div class="detail-row">
            <span class="detail-label1">病症 :</span>
            <span v-if="!pet.editing" class="detail-value">{{ pet.disease || '无' }}</span>
            <input v-else v-model="pet.editingData.disease" class="edit-input">
          </div>
          
          <div class="owner-info">
            <!-- 编辑状态下显示完整表单 -->
            <div v-if="pet.editing">
              <div v-if="pet.editingData.adoptionStatus !== 'forAdoption'">
                <div class="detail-row">
                  <span class="detail-label">姓名 :</span>
                  <input v-model="pet.editingData.owner.name" class="edit-input">
                </div>
                <div class="detail-row">
                  <span class="detail-label">性别 :</span>
                  <select v-model="pet.editingData.owner.gender" class="edit-select">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div class="detail-row">
                  <span class="detail-label">电话 :</span>
                  <input v-model="pet.editingData.owner.phone" class="edit-input">
                </div>
                <div class="detail-row">
                  <span class="detail-label">地址 :</span>
                  <input v-model="pet.editingData.owner.address" class="edit-input">
                </div>
              </div>
            </div>
            
            <!-- 查看状态下的显示 -->
            <div v-else>
              <div v-if="pet.adoptionStatus === 'owned'" >
                <div class="detail-row">
                  <span class="detail-label">主人信息 :</span>
                  <span class="detail-value">{{ pet.owner?.name || '无' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">性别 :</span>
                  <span class="detail-value">{{ pet.owner?.gender || '无' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">联系电话 :</span>
                  <span class="detail-value">{{ pet.owner?.phone || '无' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">地址 :</span>
                  <span class="detail-value">{{ pet.owner?.address || '无' }}</span>
                </div>
              </div>
              
              <div v-else>
                <div v-if="pet.adoptionStatus !== 'adopted'" class="no-owner">
                  此宠物等待领养
                </div>
                <div v-else>
                  <div class="detail-row">
                    <span class="detail-label">领养人信息 :</span>
                    <span class="detail-value">{{ pet.owner?.name || '无' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">性别 :</span>
                    <span class="detail-value">{{ pet.owner?.gender || '无' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">联系电话 :</span>
                    <span class="detail-value">{{ pet.owner?.phone || '无' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">地址 :</span>
                    <span class="detail-value">{{ pet.owner?.address || '无' }}</span>
                  </div>
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

    <!-- 批量添加宠物模态框 -->
    <div v-if="showBatchAddModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>批量添加宠物</h2>
          <button class="modal-close" @click="closeBatchAddModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="add-form">
            <div class="form-row">
              <div class="form-group">
                <label>宠物姓名：</label>
                <input type="text" v-model="newPet.name" placeholder="输入宠物姓名">
              </div>
              <div class="form-group">
                <label>年龄：</label>
                <input type="number" v-model.number="newPet.age" min="0" max="30" placeholder="0">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>病症：</label>
                <input type="text" v-model="newPet.disease" placeholder="输入宠物病症">
              </div>
              <div class="form-group">
                <label>图片URL：</label>
                <input type="text" v-model="newPet.image" placeholder="输入图片URL">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>领养状态：</label>
                <select v-model="newPet.adoptionStatus" @change="onNewPetStatusChange">
                  <option value="forAdoption">待领养</option>
                  <option value="owned">有主人</option>
                  <option value="adopted">已领养</option>
                </select>
              </div>
            </div>
            
            <!-- 主人信息 -->
            <div v-if="newPet.adoptionStatus !== 'forAdoption'" class="owner-form">
              <h3>主人信息</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>姓名：</label>
                  <input type="text" v-model="newPet.owner.name" placeholder="主人姓名" required>
                </div>
                <div class="form-group">
                  <label>性别：</label>
                  <select v-model="newPet.owner.gender">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>电话：</label>
                  <input type="text" v-model="newPet.owner.phone" placeholder="联系电话" required>
                </div>
                <div class="form-group">
                  <label>地址：</label>
                  <input type="text" v-model="newPet.owner.address" placeholder="地址（可选）">
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn primary" @click="addToBatchList">
                <i class="fas fa-plus"></i> 添加到列表
              </button>
            </div>
          </div>
          
          <!-- 批量添加列表 -->
          <div class="batch-list-container">
            <h3>待添加宠物列表 ({{ batchPets.length }})</h3>
            <div class="table-container">
              <table class="batch-table">
                <thead>
                  <tr>
                    <th>宠物姓名</th>
                    <th>年龄</th>
                    <th>病症</th>
                    <th>状态</th>
                    <th>主人</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pet, index) in batchPets" :key="index">
                    <td>{{ pet.name }}</td>
                    <td>{{ pet.age }}岁</td>
                    <td>{{ pet.disease || '无' }}</td>
                    <td>{{ getStatusText(pet.adoptionStatus) }}</td>
                    <td>
                      <span v-if="pet.adoptionStatus !== 'forAdoption'">
                        {{ pet.owner?.name || '无' }}
                      </span>
                      <span v-else>无</span>
                    </td>
                    <td>
                      <button class="action-btn delete" @click="removeFromBatchList(index)">
                        <i class="fas fa-trash"></i> 移除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeBatchAddModal">
            <i class="fas fa-times"></i> 取消
          </button>
          <button class="btn primary" @click="submitBatchPets" :disabled="batchPets.length === 0">
            <i class="fas fa-save"></i> 提交 ({{ batchPets.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
// 导入SheetJS库
import * as XLSX from 'xlsx';

// 模拟API服务
const petService = {
  async getPets() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: '小白',
            age: 3,
            disease: '感冒，流鼻涕',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
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
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            adoptionStatus: 'forAdoption',
            owner: null
          },
          {
            id: 3,
            name: '旺财',
            age: 5,
            disease: '皮肤病',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
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
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
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
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            adoptionStatus: 'forAdoption',
            owner: null
          },
          {
            id: 6,
            name: '布丁',
            age: 7,
            disease: '老年犬关节炎',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
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
  
  async addPet(petData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...petData,
          id: Math.floor(Math.random() * 1000) + 100
        });
      }, 500);
    });
  },
  
  async updatePet(petId, petData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(petData);
      }, 500);
    });
  },
  
  async deletePet(petId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  },
  
  async batchAddPets(petsData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(petsData.map(pet => ({
          ...pet,
          id: Math.floor(Math.random() * 1000) + 100
        })));
      }, 800);
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
    
    // 批量添加相关状态
    const showBatchAddModal = ref(false);
    const batchPets = ref([]);
    const newPet = ref({
      name: '',
      age: 1,
      disease: '',
      image: null,
      adoptionStatus: 'forAdoption',
      owner: {
        name: '',
        gender: '男',
        phone: '',
        address: ''
      }
    });
    
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
      return pet.image;
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
        owner: pet.owner ? {...pet.owner} : {
          name: '',
          gender: '男',
          phone: '',
          address: ''
        }
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
          owner: pet.editingData.adoptionStatus !== 'forAdoption' 
            ? pet.editingData.owner 
            : null
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
      alert(`查看宠物详情: ${pet.name}\nID: ${pet.id}\n年龄: ${pet.age}岁\n状态: ${getStatusText(pet.adoptionStatus)}`);
    };
    
    // 打开批量添加模态框
    const openBatchAddModal = () => {
      showBatchAddModal.value = true;
      batchPets.value = [];
      resetNewPetForm();
    };
    
    // 关闭批量添加模态框
    const closeBatchAddModal = () => {
      showBatchAddModal.value = false;
    };
    
    // 重置新宠物表单
    const resetNewPetForm = () => {
      newPet.value = {
        name: '',
        age: 1,
        disease: '',
        image: null,
        adoptionStatus: 'forAdoption',
        owner: {
          name: '',
          gender: '男',
          phone: '',
          address: ''
        }
      };
    };
    
    // 添加到批量列表
    const addToBatchList = () => {
      // 验证必填字段
      if (!newPet.value.name.trim()) {
        alert('请填写宠物姓名');
        return;
      }
      
      // 如果有主人/领养人，验证必填字段
      if (newPet.value.adoptionStatus !== 'forAdoption') {
        if (!newPet.value.owner.name.trim() || !newPet.value.owner.phone.trim()) {
          alert('请填写主人姓名和联系电话');
          return;
        }
      }
      
      // 创建宠物副本
      const petCopy = JSON.parse(JSON.stringify(newPet.value));
      
      // 如果状态是待领养，清除主人信息
      if (petCopy.adoptionStatus === 'forAdoption') {
        petCopy.owner = null;
      }
      
      // 添加到列表
      batchPets.value.push(petCopy);
      
      // 重置表单
      resetNewPetForm();
      
      // 显示成功消息
      success.value = '宠物已添加到批量列表';
      setTimeout(() => { success.value = null; }, 3000);
    };
    
    // 从批量列表移除
    const removeFromBatchList = (index) => {
      batchPets.value.splice(index, 1);
    };
    
    // 提交批量添加
    const submitBatchPets = async () => {
      try {
        loading.value = true;
        error.value = null;
        success.value = null;
        
        // 调用API批量添加
        const newPets = await petService.batchAddPets(batchPets.value);
        
        // 添加到主列表
        newPets.forEach(pet => {
          pets.value.push({
            ...pet,
            editing: false,
            editingData: {}
          });
        });
        
        // 关闭模态框
        closeBatchAddModal();
        
        success.value = `成功添加 ${newPets.length} 只宠物`;
      } catch (err) {
        error.value = '批量添加失败: ' + (err.message || '未知错误');
        console.error('批量添加失败:', err);
      } finally {
        loading.value = false;
        // 5秒后清除成功消息
        setTimeout(() => {
          success.value = null;
        }, 5000);
      }
    };
    
    // 添加新宠物（批量）
    const addNewPet = () => {
      openBatchAddModal();
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
    
    // 编辑状态下状态变更处理
    const onStatusChange = (pet) => {
      // 如果从待领养变为有主人/已领养，初始化主人信息
      if (pet.editingData.adoptionStatus !== 'forAdoption' && 
          (!pet.editingData.owner || !pet.editingData.owner.name)) {
        pet.editingData.owner = {
          name: '',
          gender: '男',
          phone: '',
          address: ''
        };
      }
    };
    
    // 新宠物状态变更处理
    const onNewPetStatusChange = () => {
      // 如果从待领养变为有主人/已领养，初始化主人信息
      if (newPet.value.adoptionStatus !== 'forAdoption' && 
          (!newPet.value.owner || !newPet.value.owner.name)) {
        newPet.value.owner = {
          name: '',
          gender: '男',
          phone: '',
          address: ''
        };
      }
    };
    
    // 初始化加载数据
    onMounted(loadPets);
    // 新增导出功能
    const exportToExcel = () => {
      try {
        loading.value = true;
        
        // 准备Excel数据
        const excelData = filteredPets.value.map(pet => {
          const baseInfo = {
            '编号': pet.id,
            '宠物姓名': pet.name,
            '宠物年龄': pet.age,
            '宠物病症': pet.disease || '无',
            '领养状态': getStatusText(pet.adoptionStatus)
          };
          
          if (pet.owner) {
            return {
              ...baseInfo,
              '主人姓名': pet.owner.name,
              '性别': pet.owner.gender,
              '联系电话': pet.owner.phone,
              '地址': pet.owner.address || '无'
            };
          } else {
            return {
              ...baseInfo,
              '主人姓名': '',
              '性别': '',
              '联系电话': '',
              '地址': ''
            };
          }
        });
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(excelData, {
          header: [
            '编号', '宠物姓名', '宠物年龄', '宠物病症', '领养状态', 
            '主人姓名', '性别', '联系电话', '地址'
          ]
        });
        
        // 设置列宽
        const colWidths = [
          { wch: 8 },  // 编号
          { wch: 12 }, // 宠物姓名
          { wch: 8 },  // 宠物年龄
          { wch: 20 }, // 宠物病症
          { wch: 10 }, // 领养状态
          { wch: 12 }, // 主人姓名
          { wch: 6 },  // 性别
          { wch: 15 }, // 联系电话
          { wch: 25 }  // 地址
        ];
        ws['!cols'] = colWidths;
        
        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '宠物数据');
        
        // 生成Excel文件并下载
        const date = new Date();
        const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        XLSX.writeFile(wb, `宠物医院数据_${dateStr}.xlsx`);
        
        success.value = '数据导出成功！文件已开始下载';
      } catch (err) {
        error.value = '导出失败: ' + (err.message || '未知错误');
        console.error('导出失败:', err);
      } finally {
        loading.value = false;
        setTimeout(() => success.value = null, 5000);
      }
    };
    
    return {
      filters,
      pets,
      filteredPets,
      loading,
      error,
      success,
      showBatchAddModal,
      batchPets,
      newPet,
      petImage,
      startEditing,
      savePet,
      cancelEditing,
      deletePet,
      viewPet,
      addNewPet,
      resetFilters,
      getStatusText,
      getStatusClass,
      openBatchAddModal,
      closeBatchAddModal,
      addToBatchList,
      removeFromBatchList,
      submitBatchPets,
      onStatusChange,
      onNewPetStatusChange,
      exportToExcel // 添加导出方法
    };
  }
};
</script>

<style scoped>
.pet-management {
  width: 100%;
  max-width: 1920px;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}
@media (min-width: 1200px) {
  .filter-section, 
  .pet-container {
    margin: 0 2%; /* 使用百分比边距 */
  }
}

@media (min-width: 1600px) {
  .filter-section, 
  .pet-container {
    margin: 0 5%; /* 在大屏幕上增加边距 */
  }
}
.filter-section {
  margin: 0 2% 20px; /* 左右2%边距 */
}

.pet-container {
  margin: 0 2%; /* 左右2%边距 */
}

.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #3498db, #8e44ad);
  color: white;
  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 2.2rem;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.filter-section {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin: 0 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
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
  text-align: left;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  font-size: 1rem;
  flex: 1;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
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
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.operation-status {
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  margin: 10px 0;
  text-align: center;
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
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
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
  gap: 20px;
  margin: 0 10px;
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
  padding: 15px;
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
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
}

.pet-name-input {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 5px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
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

.pet-age-row {
  margin-top: 5px;
}

.age-edit {
  display: flex;
  align-items: center;
  gap: 5px;
}

.age-edit label {
  font-size: 0.95rem;
  color: #7f8c8d;
}

.age-input {
  width: 50px;
  padding: 5px;
}

.pet-details {
  padding: 15px;
  flex: 1;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.detail-label1 {
  font-weight: 600;
  min-width: 50px;
  color: #34495e;
  text-align: left;
}

.detail-label {
  font-weight: 600;
  min-width: 100px;
  color: #34495e;
  text-align: left;
}

.detail-value {
  flex: 1;
  color: #2c3e50;
  text-align: left;
}

.owner-info {
  padding: 15px 0 0;
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
  padding: 5px 8px;
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
  padding: 12px;
  background: #f8f9fa;
}

.action-btn {
  flex: 1;
  padding: 6px 8px;
  margin: 0 3px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin: 0 10px;
}

.empty-state i {
  font-size: 3.5rem;
  color: #bdc3c7;
  margin-bottom: 15px;
}

.empty-state p {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 20px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #3498db, #8e44ad);
  color: white;
  border-radius: 10px 10px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: #f8f9fa;
  border-radius: 0 0 10px 10px;
}

/* 批量添加表单样式 */
.add-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input, 
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.owner-form {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #eee;
}

.owner-form h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #3498db;
}

.form-actions {
  margin-top: 15px;
  text-align: center;
}

/* 批量列表样式 */
.batch-list-container {
  margin-top: 20px;
}

.batch-list-container h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.table-container {
  overflow-x: auto;
}

.batch-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.batch-table th {
  background-color: #3498db;
  color: white;
  text-align: left;
  padding: 10px 15px;
}

.batch-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.batch-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.batch-table tr:hover {
  background-color: #e3f2fd;
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
    margin-left: 0;
    justify-content: flex-end;
  }
  
  .modal-container {
    width: 95%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .form-group {
    min-width: 100%;
  }
  
  .batch-table {
    font-size: 0.8rem;
  }
  
  .batch-table th, 
  .batch-table td {
    padding: 8px 10px;
  }
}
</style>