<template>
  <div class="pet-management">
    <!-- 头部区域 -->
    <div class="header">
      <div class="header-content">
        <h1>宠物医院管理系统</h1>
        <div class="subtitle">宠物信息管理模块</div>
        <!-- 消息通知区域 -->
        <div class="notification-area">
          <div class="notification-icon" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息中心模态框 -->
    <div :class="['notification-modal', { active: showNotifications }]">
      <div class="modal-content">
        <div class="modal-header">
          <h2>领养申请通知</h2>
          <button class="modal-close" @click="toggleNotifications">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="notification-list">
          <div v-if="notifications.length === 0" class="empty-notifications">
            <i class="fas fa-bell-slash"></i>
            <p>暂无新的领养申请</p>
          </div>
          
          <div 
            v-for="(notification, index) in notifications" 
            :key="index" 
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="openApplication(notification)"
          >
            <div class="notification-header">
              <div class="pet-info">
                <div class="pet-name">{{ notification.petName }}</div>
                <div class="applicant-name">{{ notification.applicant.name }}</div>
              </div>
              <div class="notification-status">
                <span v-if="!notification.read" class="unread-dot"></span>
                <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
              </div>
            </div>
            <div class="notification-body">
              <div class="contact-info">
                <span><i class="fas fa-phone"></i> {{ notification.applicant.phone }}</span>
                <span><i class="fas fa-envelope"></i> {{ notification.applicant.email }}</span>
              </div>
              <button class="delete-btn" @click.stop="deleteNotification(index)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请详情模态框 -->
    <div :class="['application-modal', { active: showApplicationModal }]">
      <div class="modal-content">
        <div class="modal-header">
          <h2>领养申请详情</h2>
          <button class="modal-close" @click="closeApplicationModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div v-if="selectedApplication" class="application-details">
          <div class="section">
            <h3>宠物信息</h3>
            <div class="pet-info-display">
              <img :src="petImageForApplication" alt="宠物图片" class="pet-image">
              <div class="pet-details">
                <div class="detail-item"><strong>名称:</strong> {{ selectedApplication.petName }}</div>
                <div class="detail-item"><strong>类型:</strong> {{ selectedApplication.petType }}</div>
                <div class="detail-item"><strong>年龄:</strong> {{ selectedApplication.petAge }}岁</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>申请人信息</h3>
            <div class="applicant-details">
              <div class="detail-row">
                <span class="detail-label">姓名:</span>
                <span class="detail-value">{{ selectedApplication.applicant.name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">电话:</span>
                <span class="detail-value">{{ selectedApplication.applicant.phone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">邮箱:</span>
                <span class="detail-value">{{ selectedApplication.applicant.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">申请时间:</span>
                <span class="detail-value">{{ formatTime(selectedApplication.timestamp) }}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>家庭环境描述</h3>
            <div class="environment-desc">
              {{ selectedApplication.applicant.environment }}
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn contact" @click="contactApplicant">
              <i class="fas fa-phone"></i> 联系申请人
            </button>
            <button class="btn approve" @click="approveApplication">
              <i class="fas fa-check"></i> 批准申请
            </button>
          </div>
        </div>
      </div>
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
          <button class="btn-primary" @click="addNewPet" :disabled="loading">
            <i class="fas fa-plus"></i> 添加新宠物
          </button>
          <button class="btn-secondary" @click="exportToExcel" :disabled="loading">
            <i class="fas fa-download"></i> 导出数据
          </button>
        </div>
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
            <div v-if="!pet.editing" class="pet-name">{{ pet.name }}</div>
            <input v-else v-model="pet.editingData.name" class="edit-input-pet-name-input">
            
            <div class="pet-status">
              <span v-if="!pet.editing" class="status-tag" :class="getStatusClass(pet.adoptionStatus)">
                {{ getStatusText(pet.adoptionStatus) }}
              </span>
              <select v-else v-model="pet.editingData.adoptionStatus" class="edit-select1" @change="onStatusChange(pet)">
                <option value="owned">有主人</option>
                <option value="forAdoption">待领养</option>
                <option value="adopted">已领养</option>
              </select>
              
              <!-- 新增：宠物类型标签 -->
              <span v-if="!pet.editing" class="type-tag" :class="getTypeClass(pet.type)">
                {{ pet.type === 'dog' ? '狗狗' : '猫咪' }}
              </span>
              <select v-else v-model="pet.editingData.type" class="edit-select-type">
                <option value="dog">狗狗</option>
                <option value="cat">猫咪</option>
              </select>
            </div>
            
            <div class="pet-attributes-row">
              <!-- 宠物性别 -->
              <div class="pet-gender-row">
                <span v-if="!pet.editing" class="pet-gender">
                  <i :class="pet.gender === '男' ? 'fas fa-mars' : 'fas fa-venus'"></i> 
                  {{ pet.gender }}
                </span>
                <div v-else class="gender-edit">
                  <label>性别:</label>
                  <select v-model="pet.editingData.gender" class="edit-select-gender">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>
              
              <!-- 宠物年龄 -->
              <div class="pet-age-row">
                <span v-if="!pet.editing" class="pet-age">年龄: {{ pet.age }}岁</span>
                <div v-else class="age-edit">
                  <label>年龄:</label>
                  <input v-model="pet.editingData.age" type="number" min="0" max="30" class="edit-input-pet-age">
                  <label>岁</label>
                </div>
              </div>
              
              <!-- 宠物重量 -->
              <div class="pet-weight-row">
                <span v-if="!pet.editing" class="pet-weight">重量: {{ pet.weight }}公斤</span>
                <div v-else class="weight-edit">
                  <label>重量:</label>
                  <input v-model="pet.editingData.weight" type="number" min="0.1" max="100" step="0.1" class="edit-input-pet-weight">
                  <label>公斤</label>
                </div>
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
                <div class="detail-row1">
                  <span class="detail-label2">姓名 :</span>
                  <input v-model="pet.editingData.owner.name" class="edit-input">
                </div>
                <div class="detail-row1">
                  <span class="detail-label2">性别 :</span>
                  <select v-model="pet.editingData.owner.gender" class="edit-select">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div class="detail-row1">
                  <span class="detail-label2">电话 :</span>
                  <input v-model="pet.editingData.owner.phone" class="edit-input">
                </div>
                <div class="detail-row1">
                  <span class="detail-label2">地址 :</span>
                  <input v-model="pet.editingData.owner.address" class="edit-input">
                </div>
              </div>
              <!-- 编辑状态下显示描述编辑 -->
              <div v-else>
                <div class="detail-row1">
                  <span class="detail-label">描述 :</span>
                  <textarea v-model="pet.editingData.description" class="edit-textarea" placeholder="输入宠物描述"></textarea>
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
                <div v-if="pet.adoptionStatus === 'adopted'">
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
                <!-- 待领养状态下显示描述 -->
                <div v-else class="pet-description">
                  <h4>领养介绍</h4>
                  <p>{{ pet.description || '暂无描述信息' }}</p>
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
                <label>宠物类型：</label>
                <select v-model="newPet.type" class="edit-select2">
                  <option value="dog">狗狗</option>
                  <option value="cat">猫咪</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>年龄：</label>
                <input type="number" v-model.number="newPet.age" min="0" max="30" placeholder="0">
              </div>
              <div class="form-group">
                <label>性别：</label>
                <select v-model="newPet.gender" class="edit-select2">
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>重量（公斤）：</label>
                <input type="number" v-model.number="newPet.weight" min="0.1" max="100" step="0.1" placeholder="0.0">
              </div>
              <div class="form-group">
                <label>病症：</label>
                <input type="text" v-model="newPet.disease" placeholder="输入宠物病症">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>图片URL：</label>
                <input type="text" v-model="newPet.image" placeholder="输入图片URL">
              </div>
              <div class="form-group">
                <label>领养状态：</label>
                <select v-model="newPet.adoptionStatus" @change="onNewPetStatusChange">
                  <option value="forAdoption">待领养</option>
                  <option value="owned">有主人</option>
                  <option value="adopted">已领养</option>
                </select>
              </div>
            </div>
            
            <!-- 待领养状态显示描述输入框 -->
            <div v-if="newPet.adoptionStatus === 'forAdoption'" class="form-row">
              <div class="form-group full-width">
                <label>领养描述：</label>
                <textarea v-model="newPet.description" placeholder="输入宠物描述，吸引潜在领养者" class="edit-textarea"></textarea>
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
              <button class="btn secondary" @click="importFromExcel">
                <i class="fas fa-file-import"></i> 导入数据
              </button>
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
                    <th>类型</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>重量</th>
                    <th>病症</th>
                    <th>状态</th>
                    <th>主人/描述</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pet, index) in batchPets" :key="index">
                    <td>{{ pet.name }}</td>
                    <td>{{ pet.type === 'dog' ? '狗狗' : '猫咪' }}</td>
                    <td>{{ pet.gender }}</td>
                    <td>{{ pet.age }}岁</td>
                    <td>{{ pet.weight }}公斤</td>
                    <td>{{ pet.disease || '无' }}</td>
                    <td>{{ getStatusText(pet.adoptionStatus) }}</td>
                    <td>
                      <span v-if="pet.adoptionStatus !== 'forAdoption'">
                        {{ pet.owner?.name || '无' }}
                      </span>
                      <span v-else>{{ pet.description ? pet.description.substring(0, 15) + '...' : '无描述' }}</span>
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

    <!-- Toast 弹窗 -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      <i :class="toast.icon"></i> {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
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
            type: 'dog',
            age: 3,
            gender: '男',
            weight: 5.2,
            disease: '感冒，流鼻涕',
            image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=80',
            adoptionStatus: 'owned',
            owner: {
              name: '张先生',
              gender: '男',
              phone: '13800138000',
              address: '无'
            },
            description: ''
          },
          {
            id: 2,
            name: '喵喵',
            type: 'cat',
            age: 1,
            gender: '女',
            weight: 3.8,
            disease: '肠胃不适',
            image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
            adoptionStatus: 'forAdoption',
            owner: null,
            description: '温顺友好的布偶猫，已绝育，喜欢和人玩耍，特别适合有孩子的家庭。'
          },
          {
            id: 3,
            name: '旺财',
            type: 'dog',
            age: 5,
            gender: '男',
            weight: 12.5,
            disease: '皮肤病',
            image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
            adoptionStatus: 'adopted',
            owner: {
              name: '张先生',
              gender: '男',
              phone: '13800138000',
              address: '翻斗花园1号楼'
            },
            description: ''
          },
          {
            id: 4,
            name: '球球',
            type: 'cat',
            age: 2,
            gender: '女',
            weight: 4.1,
            disease: '耳螨',
            image: null,
            adoptionStatus: 'owned',
            owner: {
              name: '李女士',
              gender: '女',
              phone: '13900139000',
              address: '星星小区2单元'
            },
            description: ''
          },
          {
            id: 5,
            name: '豆豆',
            type: 'dog',
            age: 4,
            gender: '男',
            weight: 8.7,
            disease: '骨折恢复期',
            image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
            adoptionStatus: 'forAdoption',
            owner: null,
            description: '活泼可爱的金毛寻回犬，已接种疫苗，喜欢户外活动，需要一个有院子的家。'
          },
          {
            id: 6,
            name: '布丁',
            type: 'cat',
            age: 7,
            gender: '男',
            weight: 15.2,
            disease: '老年犬关节炎',
            image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
            adoptionStatus: 'owned',
            owner: {
              name: '王先生',
              gender: '男',
              phone: '13700137000',
              address: '阳光花园3栋'
            },
            description: ''
          }
        ]);
      }, 800);
    });
  },
   // 新增：获取领养申请
   async getAdoptionApplications() {
    return new Promise(resolve => {
      setTimeout(() => {
        // 从localStorage获取申请数据
        const storedApplications = localStorage.getItem('adoptionApplications');
        const applications = storedApplications ? JSON.parse(storedApplications) : [];
        resolve(applications);
      }, 300);
    });
  },
  // 新增：更新申请状态
  async updateApplicationStatus(id, status) {
    return new Promise(resolve => {
      setTimeout(() => {
        const storedApplications = localStorage.getItem('adoptionApplications');
        let applications = storedApplications ? JSON.parse(storedApplications) : [];
        
        applications = applications.map(app => {
          if (app.id === id) {
            return { ...app, status };
          }
          return app;
        });
        
        localStorage.setItem('adoptionApplications', JSON.stringify(applications));
        resolve({ success: true });
      }, 300);
    });
  },
  
  // 新增：删除申请
  async deleteApplication(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const storedApplications = localStorage.getItem('adoptionApplications');
        let applications = storedApplications ? JSON.parse(storedApplications) : [];
        
        applications = applications.filter(app => app.id !== id);
        localStorage.setItem('adoptionApplications', JSON.stringify(applications));
        resolve({ success: true });
      }, 300);
    });
  },
  
  // 新增：标记为已读
  async markAsRead(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const storedApplications = localStorage.getItem('adoptionApplications');
        let applications = storedApplications ? JSON.parse(storedApplications) : [];
        
        applications = applications.map(app => {
          if (app.id === id) {
            return { ...app, read: true };
          }
          return app;
        });
        
        localStorage.setItem('adoptionApplications', JSON.stringify(applications));
        resolve({ success: true });
      }, 300);
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
    const toast = ref({
      show: false,
      message: '',
      type: 'info',
      icon: ''
    });
    // 新增：通知相关状态
    const notifications = ref([]);
    const showNotifications = ref(false);
    const showApplicationModal = ref(false);
    const selectedApplication = ref(null);
    
    // 计算未读消息数量
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });
    
    // 显示Toast消息
    const showToast = (message, type = 'info') => {
      toast.value = {
        show: true,
        message,
        type,
        icon: type === 'success' ? 'fas fa-check-circle' : 
              type === 'error' ? 'fas fa-exclamation-circle' : 
              type === 'loading' ? 'fas fa-spinner fa-spin' : 'fas fa-info-circle'
      };
      
      setTimeout(() => {
        toast.value.show = false;
      }, 1000);
    };
    
    // 加载领养申请
    const loadApplications = async () => {
      try {
        const data = await petService.getAdoptionApplications();
        // 按时间倒序排列
        notifications.value = data.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
      } catch (err) {
        showToast('加载申请数据失败: ' + (err.message || '未知错误'), 'error');
        console.error('加载申请数据失败:', err);
      }
    };
    
    // 切换通知面板
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      // 打开时刷新申请数据
      if (showNotifications.value) {
        loadApplications();
      }
    };
    
    // 打开申请详情
    const openApplication = async (application) => {
      selectedApplication.value = application;
      showApplicationModal.value = true;
      
      // 标记为已读
      if (!application.read) {
        await petService.markAsRead(application.id);
        // 更新本地状态
        const index = notifications.value.findIndex(n => n.id === application.id);
        if (index !== -1) {
          notifications.value[index].read = true;
        }
      }
    };
    
    // 关闭申请详情
    const closeApplicationModal = () => {
      showApplicationModal.value = false;
      selectedApplication.value = null;
    };
    
    // 删除通知
    const deleteNotification = async (index) => {
      const application = notifications.value[index];
      if (confirm(`确定要删除 ${application.applicant.name} 的申请吗？`)) {
        try {
          await petService.deleteApplication(application.id);
          notifications.value.splice(index, 1);
          showToast('申请已删除', 'success');
        } catch (err) {
          showToast('删除申请失败: ' + (err.message || '未知错误'), 'error');
          console.error('删除申请失败:', err);
        }
      }
    };
    
    // 联系申请人
    const contactApplicant = () => {
      if (selectedApplication.value) {
        const phone = selectedApplication.value.applicant.phone;
        alert(`正在呼叫 ${phone}...`);
        // 实际应用中这里可以触发电话呼叫
      }
    };
    
    // 批准申请
    const approveApplication = async () => {
      if (selectedApplication.value) {
        try {
          await petService.updateApplicationStatus(
            selectedApplication.value.id, 
            'approved'
          );
          
          // 更新本地状态
          const index = notifications.value.findIndex(
            n => n.id === selectedApplication.value.id
          );
          
          if (index !== -1) {
            notifications.value[index].status = 'approved';
          }
          
          showToast('申请已批准', 'success');
          closeApplicationModal();
        } catch (err) {
          showToast('批准申请失败: ' + (err.message || '未知错误'), 'error');
          console.error('批准申请失败:', err);
        }
      }
    };
    
    // 格式化时间
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };
    
    // 获取宠物图片（用于申请详情）
    const petImageForApplication = computed(() => {
      if (!selectedApplication.value) return '';
      
      const petImages = {
        '小白': 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=80',
        '喵喵': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
        '豆豆': 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
        '橘子': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
        '小柴': 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
        '小雪': 'https://images.unsplash.com/photo-1592194996308-7b43878e84b6?auto=format&fit=crop&w=800&q=80'
      };
      
      return petImages[selectedApplication.value.petName] || 
             'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';
    });
    
    // 初始化加载数据
    onMounted(() => {
      loadPets();
      loadApplications();
      
      // 模拟实时接收新申请
      setInterval(loadApplications, 10000);
    });
    
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
      type: 'dog',
      age: 1,
      gender: '男',
      weight: 3.5,
      disease: '',
      image: null,
      adoptionStatus: 'forAdoption',
      owner: {
        name: '',
        gender: '男',
        phone: '',
        address: ''
      },
      description: ''
    });
    
    
    // 加载宠物数据
    const loadPets = async () => {
      try {
        loading.value = true;
        showToast('正在加载宠物数据...', 'loading');
        const data = await petService.getPets();
        pets.value = data.map(pet => ({
          ...pet,
          editing: false,
          editingData: {}
        }));
      } catch (err) {
        showToast('加载宠物数据失败: ' + (err.message || '未知错误'), 'error');
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
      return pet.image || 'https://via.placeholder.com/100?text=Pet+Image';
    };
    
    // 开始编辑宠物信息
    const startEditing = (pet) => {
      pet.editing = true;
      // 深拷贝当前数据到编辑数据对象
      pet.editingData = {
        name: pet.name,
        type: pet.type,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        disease: pet.disease,
        adoptionStatus: pet.adoptionStatus,
        description: pet.description || '',
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
        showToast('正在保存宠物信息...', 'loading');
        
        // 准备要保存的数据
        const saveData = {
          name: pet.editingData.name,
          type: pet.editingData.type,
          age: pet.editingData.age,
          gender: pet.editingData.gender,
          weight: pet.editingData.weight,
          disease: pet.editingData.disease,
          adoptionStatus: pet.editingData.adoptionStatus,
          description: pet.editingData.description || '',
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
        
        showToast('宠物信息更新成功', 'success');
      } catch (err) {
        showToast('保存宠物信息失败: ' + (err.message || '未知错误'), 'error');
        console.error('保存宠物信息失败:', err);
      } finally {
        loading.value = false;
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
        showToast('正在删除宠物记录...', 'loading');
        
        // 调用API删除宠物
        await petService.deletePet(id);
        
        // 更新本地数据
        pets.value = pets.value.filter(pet => pet.id !== id);
        
        showToast('宠物删除成功', 'success');
      } catch (err) {
        showToast('删除宠物失败: ' + (err.message || '未知错误'), 'error');
        console.error('删除宠物失败:', err);
      } finally {
        loading.value = false;
      }
    };
    
    // 查看宠物详情
    const viewPet = (pet) => {
      let details = `宠物详情: ${pet.name}\nID: ${pet.id}\n类型: ${pet.type === 'dog' ? '狗狗' : '猫咪'}\n性别: ${pet.gender}\n年龄: ${pet.age}岁\n重量: ${pet.weight}公斤\n状态: ${getStatusText(pet.adoptionStatus)}`;
      
      if (pet.adoptionStatus === 'forAdoption' && pet.description) {
        details += `\n\n领养介绍:\n${pet.description}`;
      }
      
      alert(details);
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
        type: 'dog',
        age: 1,
        gender: '男',
        weight: 3.5,
        disease: '',
        image: null,
        adoptionStatus: 'forAdoption',
        owner: {
          name: '',
          gender: '男',
          phone: '',
          address: ''
        },
        description: ''
      };
    };
    
    // 添加到批量列表
    const addToBatchList = () => {
      // 验证必填字段
      if (!newPet.value.name.trim()) {
        alert('请填写宠物姓名');
        return;
      }
      
      // 验证重量
      if (newPet.value.weight <= 0) {
        alert('重量必须大于0');
        return;
      }
      
      // 如果有主人/领养人，验证必填字段
      if (newPet.value.adoptionStatus !== 'forAdoption') {
        if (!newPet.value.owner.name.trim() || !newPet.value.owner.phone.trim()) {
          alert('请填写主人姓名和联系电话');
          return;
        }
      }
      
      // 待领养宠物验证描述
      if (newPet.value.adoptionStatus === 'forAdoption' && !newPet.value.description.trim()) {
        alert('请填写宠物描述');
        return;
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
      showToast('宠物已添加到批量列表', 'success');
    };
    
    // 从批量列表移除
    const removeFromBatchList = (index) => {
      batchPets.value.splice(index, 1);
    };
    
    // 提交批量添加
    const submitBatchPets = async () => {
      try {
        loading.value = true;
        showToast('正在批量添加宠物...', 'loading');
        
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
        
        showToast(`成功添加 ${newPets.length} 只宠物`, 'success');
      } catch (err) {
        showToast('批量添加失败: ' + (err.message || '未知错误'), 'error');
        console.error('批量添加失败:', err);
      } finally {
        loading.value = false;
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
    
    // 获取类型类名
    const getTypeClass = (type) => {
      switch (type) {
        case 'dog': return 'dog-type';
        case 'cat': return 'cat-type';
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
    
    // 导出功能
    const exportToExcel = () => {
      try {
        loading.value = true;
        showToast('正在导出数据...', 'loading');
        
        // 准备Excel数据
        const excelData = filteredPets.value.map(pet => {
          const baseInfo = {
            '编号': pet.id,
            '宠物姓名': pet.name,
            '宠物类型': pet.type === 'dog' ? '狗狗' : '猫咪',
            '宠物性别': pet.gender,
            '宠物年龄': pet.age,
            '宠物重量': pet.weight,
            '宠物病症': pet.disease || '无',
            '领养状态': getStatusText(pet.adoptionStatus),
            '宠物描述': pet.description || ''
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
            '编号', '宠物姓名', '宠物类型', '宠物性别', '宠物年龄', '宠物重量', 
            '宠物病症', '领养状态', '宠物描述', '主人姓名', '性别', '联系电话', '地址'
          ]
        });
        
        // 设置列宽
        const colWidths = [
          { wch: 8 },  // 编号
          { wch: 12 }, // 宠物姓名
          { wch: 8 },  // 宠物类型
          { wch: 8 },  // 宠物性别
          { wch: 8 },  // 宠物年龄
          { wch: 8 },  // 宠物重量
          { wch: 20 }, // 宠物病症
          { wch: 10 }, // 领养状态
          { wch: 30 }, // 宠物描述
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
        
        showToast('数据导出成功！文件已开始下载', 'success');
      } catch (err) {
        showToast('导出失败: ' + (err.message || '未知错误'), 'error');
        console.error('导出失败:', err);
      } finally {
        loading.value = false;
      }
    };
    
    // 导入Excel功能
    const importFromExcel = () => {
      // 创建隐藏的文件输入元素
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx, .xls';
      fileInput.style.display = 'none';
      
      // 添加事件监听器
      fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
          loading.value = true;
          showToast('正在导入数据...', 'loading');
          
          // 读取Excel文件
          const data = await readExcelFile(file);
          
          // 解析Excel数据
          const importedPets = parseExcelData(data);
          
          // 添加到待添加列表
          batchPets.value = [...batchPets.value, ...importedPets];
          
          showToast(`成功导入 ${importedPets.length} 条宠物数据`, 'success');
        } catch (err) {
          showToast('导入失败: ' + (err.message || '未知错误'), 'error');
          console.error('导入失败:', err);
        } finally {
          loading.value = false;
          // 清理文件输入
          document.body.removeChild(fileInput);
        }
      });
      
      // 触发文件选择
      document.body.appendChild(fileInput);
      fileInput.click();
    };
    
    // 读取Excel文件
    const readExcelFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 获取第一个工作表
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // 转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          } catch (err) {
            reject(err);
          }
        };
        
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    };
    
    // 解析Excel数据为宠物对象
    const parseExcelData = (excelData) => {
      return excelData.map((row, index) => {
        // 转换领养状态文本为状态值
        const statusMap = {
          '有主人': 'owned',
          '待领养': 'forAdoption',
          '已领养': 'adopted'
        };
        
        // 转换宠物类型文本为类型值
        const typeMap = {
          '狗狗': 'dog',
          '猫咪': 'cat'
        };
        
        const adoptionStatus = statusMap[row['领养状态']] || 'forAdoption';
        const petType = typeMap[row['宠物类型']] || 'dog';
        
        // 创建宠物对象
        const pet = {
          name: row['宠物姓名'] || `未命名宠物${index + 1}`,
          type: petType,
          age: parseInt(row['宠物年龄']) || 1,
          gender: row['宠物性别'] || '男',
          weight: parseFloat(row['宠物重量']) || 3.5,
          disease: row['宠物病症'] || '',
          image: null,
          adoptionStatus: adoptionStatus,
          description: row['宠物描述'] || ''
        };
        
        // 如果有主人信息
        if (adoptionStatus !== 'forAdoption' && row['主人姓名']) {
          pet.owner = {
            name: row['主人姓名'] || '',
            gender: row['性别'] || '男',
            phone: row['联系电话'] || '',
            address: row['地址'] || ''
          };
        } else {
          pet.owner = null;
        }
        
        return pet;
      });
    };
    
    return {
       // 新增状态
       notifications,
      showNotifications,
      showApplicationModal,
      selectedApplication,
      unreadCount,
      
      // 新增方法
      toggleNotifications,
      openApplication,
      closeApplicationModal,
      deleteNotification,
      contactApplicant,
      approveApplication,
      formatTime,
      petImageForApplication,
      filters,
      pets,
      filteredPets,
      loading,
      toast,
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
      getTypeClass,
      openBatchAddModal,
      closeBatchAddModal,
      addToBatchList,
      removeFromBatchList,
      submitBatchPets,
      onStatusChange,
      onNewPetStatusChange,
      exportToExcel,
      importFromExcel
    };
  }
};
</script>

<style scoped>
.pet-management {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
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
  border-radius: 10px;
  padding: 15px;
  margin: 0 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.726);
}

.search-box {
  display: flex;
  flex-wrap: wrap;
  gap: 75px;
  margin-bottom: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 150px;
  max-width: 250px;
  margin-left: 50px;

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
  max-width: 150px;
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
  gap: 70px;
  margin-left: auto;
  margin-right: 130px;
}
.btn-primary{
  color: white;
  background-color: #c93dec;
}

.btn-secondary{
  background-color: #3b98f6f2;
  color: white;
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

.pet-status {
  margin-bottom: 5px;
  display: flex;
  gap: 8px;
  align-items: center;
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

/* 新增：宠物类型标签样式 */
.type-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-tag.dog-type {
  background: #f39c12;
  color: white;
}

.type-tag.cat-type {
  background: #9b59b6;
  color: white;
}

.read-only-text {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-style: italic;
}


.age-edit, .weight-edit {
  display: flex;
  align-items: center;
  gap: 5px;
}

.age-edit label, .weight-edit label {
  font-size: 0.95rem;
  color: #7f8c8d;
}

.age-input, .weight-input {
  width: 50px;
  padding: 5px;
  height: 25px;
}

.pet-details {
  padding: 15px;
  flex: 1;
  
}

.detail-row {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}
.detail-row1 {
  display: flex;
  margin-bottom: 6px;
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
.detail-label2 {
  font-weight: 600;
  min-width: 80px;
  color: #34495e;
  text-align: left;
  margin-left: 10px;
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

/* 宠物描述样式 */
.pet-description {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  
}

.pet-description h4 {
  margin-top: 0;
  margin-bottom: 8px;
  color: #e74c3c;
}

.pet-description p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}

.no-owner {
  text-align: center;
  padding: 15px 0;
  color: #7f8c8d;
  font-style: italic;
}

.edit-input {
  padding: 5px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15.5px;
  height: 25px;
}
.edit-input-pet-name-input {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 2px;
  padding: 5px;
  width: 35%;
  height: 28px;
  box-sizing: border-box;
  border: 1px solid #ddd;
}
.edit-select{
  
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  height: 28px;
  width: 45px;
}
.edit-select2{
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  height: 35px;
  width: 45px;
}
.edit-select1{
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 70px;
  height: 28px;
}
.edit-select-type {
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 70px;
  height: 28px;
}
.edit-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
}
.edit-input:focus, 
.edit-select:focus,
.edit-textarea:focus {
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

/* Toast 弹窗样式 */
.toast {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 25px;
  border-radius: 5px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: toastSlideIn 0.3s ease-out, toastFadeOut 0.3s ease-in 0.7s forwards;
}

.toast i {
  font-size: 1.2rem;
}

.toast.success {
  background: #27ae60;
}

.toast.error {
  background: #e74c3c;
}

.toast.loading {
  background: #3498db;
}

@keyframes toastSlideIn {
  0% {
    top: 0;
    opacity: 0;
  }
  100% {
    top: 30px;
    opacity: 1;
  }
}

@keyframes toastFadeOut {
  0% {
    top: 30px;
    opacity: 1;
  }
  100% {
    top: 0;
    opacity: 0;
  }
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

.form-group.full-width {
  flex: 100%;
  min-width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input, 
.form-group select,
.form-group textarea {
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
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
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
  
  .toast {
    width: 90%;
    max-width: 400px;
    font-size: 0.9rem;
    padding: 10px 15px;
  }
}

.pet-attributes-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
  gap: 10px;
}

/* 调整每个属性行的样式 */
.pet-gender-row, .pet-age-row, .pet-weight-row {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #7f8c8d;
  margin-right: 10px;
}

/* 编辑状态下的样式调整 */
.gender-edit, .age-edit, .weight-edit {
  display: flex;
  align-items: center;
}

.gender-edit label, 
.age-edit label, 
.weight-edit label {
  white-space: nowrap;
  font-size: 0.9rem;
}

.pet-gender {
  display: flex;
  align-items: center;
  gap: 5px;
}


/* 保持图标样式 */
.pet-gender i {
  font-size: 1.1rem;
}
.pet-gender i.fa-mars {
  color: #3498db;
}
.pet-gender i.fa-venus {
  color: #e84393;
}

.edit-input-pet-age{
  width: 27px;
}
.edit-input-pet-weight{
  width: 45px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.notification-area {
  position: relative;
}

.notification-icon {
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  position: relative;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.notification-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
}

/* 通知模态框样式 */
.notification-modal {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
  transform: translateY(-20px);
  visibility: hidden;
  transition: all 0.3s ease;
  overflow: hidden;
}

.notification-modal.active {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}

.modal-header {
  padding: 15px 20px;
  background: linear-gradient(135deg, #3498db, #8e44ad);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.notification-list {
  max-height: 60vh;
  overflow-y: auto;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pet-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50;
}

.applicant-name {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.notification-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background-color: #3498db;
  border-radius: 50%;
}

.notification-time {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.notification-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.9rem;
}

.contact-info span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.contact-info i {
  width: 16px;
  text-align: center;
}

.delete-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px;
}

.delete-btn:hover {
  color: #c0392b;
}

.empty-notifications {
  padding: 30px;
  text-align: center;
  color: #7f8c8d;
}

.empty-notifications i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #bdc3c7;
}

/* 申请详情模态框样式 */
.application-modal {
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

.application-modal.active {
  opacity: 1;
  pointer-events: all;
}

.application-modal .modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(20px);
  transition: transform 0.3s;
}

.application-modal.active .modal-content {
  transform: translateY(0);
}

.application-details {
  padding: 20px;
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #3498db;
}

.pet-info-display {
  display: flex;
  gap: 20px;
  align-items: center;
}

.pet-image {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #eee;
}

.pet-details {
  flex: 1;
}

.detail-item {
  margin-bottom: 8px;
}

.applicant-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-row {
  display: flex;
  margin-left: 10px;
}

.detail-label {
  font-weight: bold;
  min-width: 100px;
  color: #34495e;
}

.detail-value {
  color: #2c3e50;
}

.environment-desc {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #3498db;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn.contact {
  background-color: #3498db;
  color: white;
}

.btn.contact:hover {
  background-color: #2980b9;
}

.btn.approve {
  background-color: #2ecc71;
  color: white;
}

.btn.approve:hover {
  background-color: #27ae60;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-modal {
    width: 90%;
    right: 5%;
  }
  
  .applicant-details {
    grid-template-columns: 1fr;
  }
  
  .pet-info-display {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>