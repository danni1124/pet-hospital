<template>
  <div class="main-container">
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
              <span class="notification-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
            </div>
            <!-- 通知下拉菜单 -->
            <div class="notification-dropdown" v-if="showNotificationDropdown">
              <div class="notification-header">
                <h3>领养申请通知</h3>
                <span class="close-dropdown" @click="showNotificationDropdown = false">
                  <i class="fas fa-times"></i>
                </span>
              </div>
              <div class="notification-list">
                <div 
                  v-for="application in applications" 
                  :key="application.applicationId" 
                  class="notification-item"
                  @click="viewApplication(application)"
                  @contextmenu.prevent="handleLongPress(application)"
                >
                  <div class="application-pet-info6">
                    <img :src="getPetImage(application.pet)" class="pet-thumbnail">
                  <div class="pet-info6">
                      <div class="pet-name6">{{application.pet.petName }}</div>
                      <div class="pet-status6">
                          <!-- 宠物类型标签 -->
                          <span  class="type-tag11" :class="getTypeClass(application.pet.type)">
                              {{ application.pet.type === 'dog' ? '狗狗' : '猫咪' }}
                          </span>
                      </div>
                  </div>
                    <div class="application-details">
                      
                      <div class="applicant-info">
                        <span class="application-time">{{ formatTime(application.time) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="application-status" :class="getStatusClass1(application.status)">
                    {{ getStatusText1(application.status) }}
                  </div>
                </div>
                <div class="empty-notification" v-if="applications.length === 0">
                  暂无领养申请
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
          <div class="search-box1">
              <div class="filter-group">
                  <label>宠物姓名：</label>
                  <input 
                      type="text" 
                      v-model="filters.petName" 
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
              <div class="filter-group1">
                  <label>宠物主人信息：</label>
                  <input 
                      type="text" 
                      v-model="filters.owner" 
                      placeholder="搜索宠物主人/领养人相关信息" 
                      class="search-input1"
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
              <div class="filter-group">
                  <label>宠物类别：</label>
                  <select v-model="filters.type" class="filter-select">
                      <option value="all">全部</option>
                      <option value="cat">猫咪</option>
                      <option value="dog">狗狗</option>
                  </select>
              </div>
              
              <!-- 操作按钮区域 -->
              <div class="action-buttons">
                  <button class="btn-primary6" @click="addNewPet" :disabled="loading">
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
      <div v-else class="pet-container6">
          <div 
              v-for="pet in filteredPets" 
              :key="pet.petId" 
              class="pet-card"
              :class="{
                  'for-adoption': pet.adoptionStatus === 'forAdoption',
                  'adopted': pet.adoptionStatus === 'adopted'
              }"
          >
              <!-- 宠物卡片内容 -->
              <div class="pet-header6">
                  <div class="pet-image6" :class="{ editing: pet.editing }" @click="onImageClick(pet)">
                      <img :src="getPetImage(pet)" 
                              alt="宠物图片" 
                              @error="handleImageError">
                      <input type="file" accept="image/*" 
                              @change="handleImageUpload($event, pet)" 
                              :ref="el => setFileInputRef(el, pet.petId)"
                              style="display: none;">
                  </div>

                  <div class="pet-info6">
                      <div v-if="!pet.editing" class="pet-name6">{{ pet.petName }}</div>
                      <input v-else v-model="pet.editingData.petName" class="edit-input6-pet-name6-input">
                      
                      <div class="pet-status6">
                          <span v-if="!pet.editing" class="status-tag6" :class="getStatusClass(pet.adoptionStatus)">
                              {{ getStatusText(pet.adoptionStatus) }}
                          </span>
                          <select v-else v-model="pet.editingData.adoptionStatus" class="edit-select1" @change="onStatusChange(pet)">
                              <option value="owned">有主人</option>
                              <option value="forAdoption">待领养</option>
                              <option value="adopted">已领养</option>
                          </select>
                          
                          <!-- 宠物类型标签 -->
                          <span v-if="!pet.editing" class="status-tag6" :class="getTypeClass(pet.type)">
                              {{ pet.type === 'dog' ? '狗狗' : '猫咪' }}
                          </span>
                          <select v-else v-model="pet.editingData.type" class="edit-select-type">
                              <option value="dog">狗狗</option>
                              <option value="cat">猫咪</option>
                          </select>
                      </div>
                      
                      <div class="pet-attributes-row">
                          <!-- 宠物性别 -->
                          <div class="pet-gender6-row">
                              <span v-if="!pet.editing" class="pet-gender6">
                                  <i :class="pet.gender === '公' ? 'fas fa-mars' : 'fas fa-venus'"></i> 
                                  {{ pet.gender }}
                              </span>
                              <div v-else class="gender-edit">
                                  <label>性别:</label>
                                  <select v-model="pet.editingData.gender" class="edit-select-gender">
                                      <option value="公">公</option>
                                      <option value="母">母</option>
                                  </select>
                              </div>
                          </div>
                          
                          <!-- 宠物年龄 -->
                          <div class="pet-age-row">
                              <span v-if="!pet.editing" class="pet-age">年龄: {{ pet.age }}岁</span>
                              <div v-else class="age-edit">
                                  <label>年龄:</label>
                                  <input v-model="pet.editingData.age" type="number" min="0" max="30" class="edit-input6-pet-age">
                                  <label>岁</label>
                              </div>
                          </div>
                          
                          <!-- 宠物重量 -->
                          <div class="pet-weight-row">
                              <span v-if="!pet.editing" class="pet-weight">重量: {{ pet.weight }}公斤</span>
                              <div v-else class="weight-edit">
                                  <label>重量:</label>
                                  <input v-model="pet.editingData.weight" type="number" min="0.1" max="100" step="0.1" class="edit-input6-pet-weight">
                                  <label>公斤</label>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="pet-details6">
                  <div class="detail-row6">
                      <span class="detail-label1">病症 :</span>
                      <span v-if="!pet.editing" class="detail-value">{{ pet.disease || '无' }}</span>
                      <input v-else v-model="pet.editingData.disease" class="edit-input6">
                  </div>
                  
                  <div class="owner-info">
                      <!-- 编辑状态下显示完整表单 -->
                      <div v-if="pet.editing">
                          <div v-if="pet.editingData.adoptionStatus !== 'forAdoption'">
                              <div class="detail-row1">
                                  <span class="detail-label2">姓名 :</span>
                                  <input v-model="pet.editingData.owner.ownerName" class="edit-input6">
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
                                  <input v-model="pet.editingData.owner.phone" class="edit-input6">
                              </div>
                              <div class="detail-row1">
                                  <span class="detail-label2">邮箱 :</span>
                                  <input v-model="pet.editingData.owner.email" class="edit-input6">
                              </div>
                          </div>
                          <!-- 编辑状态下显示描述编辑 -->
                          <div v-else>
                              <div class="detail-row1">
                                  <span class="detail-label2">描述 :</span>
                                  <textarea v-model="pet.editingData.description" class="edit-textarea" placeholder="输入宠物描述"></textarea>
                              </div>
                          </div>
                          <!-- PDF上传 -->
                          <!-- <div class="detail-row1">
                              <span class="detail-label2">病历PDF :</span>
                              <input type="file" accept=".pdf" @change="handlePdfUpload($event, pet)" class="edit-input6">
                              <span v-if="pet.editingData.pdfCase" class="pdf-name">{{ getPdfName(pet.editingData.pdfCase) }}</span>
                          </div> -->
                      </div>
                      
                      <!-- 查看状态下的显示 -->
                      <div v-else>
                          <div v-if="pet.adoptionStatus === 'owned'" >
                              <div class="detail-row6">
                                  <span class="detail-label">主人信息 :</span>
                                  <span class="detail-value">{{ pet.owner?.ownerName || '无' }}</span>
                              </div>
                              <div class="detail-row6">
                                  <span class="detail-label">性别 :</span>
                                  <span class="detail-value">{{ pet.owner?.gender || '无' }}</span>
                              </div>
                              <div class="detail-row6">
                                  <span class="detail-label">联系电话 :</span>
                                  <span class="detail-value">{{ pet.owner?.phone || '无' }}</span>
                              </div>
                              <div class="detail-row6">
                                  <span class="detail-label">邮箱 :</span>
                                  <span class="detail-value">{{ pet.owner?.email || '无' }}</span>
                              </div>
                          </div>
                          
                          <div v-else>
                              <div v-if="pet.adoptionStatus === 'adopted'">
                                  <div class="detail-row6">
                                      <span class="detail-label">领养人信息 :</span>
                                      <span class="detail-value">{{ pet.owner?.ownerName || '无' }}</span>
                                  </div>
                                  <div class="detail-row6">
                                      <span class="detail-label">性别 :</span>
                                      <span class="detail-value">{{ pet.owner?.gender || '无' }}</span>
                                  </div>
                                  <div class="detail-row6">
                                      <span class="detail-label">联系电话 :</span>
                                      <span class="detail-value">{{ pet.owner?.phone || '无' }}</span>
                                  </div>
                                  <div class="detail-row6">
                                      <span class="detail-label">邮箱 :</span>
                                      <span class="detail-value">{{ pet.owner?.email || '无' }}</span>
                                  </div>
                              </div>
                              <!-- 待领养状态下显示描述 -->
                              <div v-else class="pet-description">
                                  <h4>领养介绍</h4>
                                  <p>{{ pet.description || '暂无描述信息' }}</p>
                              </div>
                          </div>
                          <!-- PDF查看 -->
                          <!-- <div v-if="pet.pdfCase" class="detail-row6">
                              <span class="detail-label">病历PDF :</span>
                              <a :href="pet.pdfCase" target="_blank" class="detail-value">查看病历</a>
                          </div> -->
                      </div>
                  </div>
              </div>

              <div class="pet-actions">
                  <template v-if="!pet.editing">
                      <button class="action-btn1 edit" @click="startEditing(pet)" :disabled="loading">
                          <i class="fas fa-edit"></i> 修改
                      </button>
                      <button class="action-btn1 view" @click="viewPdf(pet.pdfCase)">
                          <i class="fas fa-eye"></i> 查看
                      </button>
                      <button class="action-btn1 delete" @click="deletePet(pet.petId)" :disabled="loading">
                          <i class="fas fa-trash"></i> 删除
                      </button>
                  </template>
                  
                  <template v-else>
                      <button class="action-btn1 save" @click="savePet(pet)" :disabled="loading">
                          <i class="fas fa-save"></i> 保存
                      </button>
                      <button class="action-btn1 cancel" @click="cancelEditing(pet)" :disabled="loading">
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
                      <div class="form-row6">
                          <div class="form-group1">
                              <label>宠物姓名：</label>
                              <input type="text" v-model="newPet.petName" placeholder="输入宠物姓名">
                          </div>
                          <div class="form-group1">
                              <label>病症：</label>
                              <input type="text" v-model="newPet.disease" placeholder="输入宠物病症">
                          </div>
                          
                      </div>
                      
                      <div class="form-row6">
                          <div class="form-group6">
                              <label>年龄：</label>
                              <input type="number" v-model.number="newPet.age" min="0" max="30" placeholder="0">
                          </div>
                          <div class="form-group6">
                              <label>重量（公斤）：</label>
                              <input type="number" v-model.number="newPet.weight" min="0.1" max="100" step="0.1" placeholder="0.0">
                          </div>
                      </div>
                      
                      <div class="form-row6">
                        <div class="form-group6">
                              <label>性别：</label>
                              <select v-model="newPet.gender" class="edit-select2">
                                  <option value="公">公</option>
                                  <option value="母">母</option>
                              </select>
                          </div>
                          <div class="form-group6">
                              <label>宠物类型：</label>
                              <select v-model="newPet.type" class="edit-select2">
                                  <option value="dog">狗狗</option>
                                  <option value="cat">猫咪</option>
                              </select>
                          </div>
                          
                      </div>
                      
                      <!-- PDF上传
                      <div class="form-row6">
                          <div class="form-group6 full-width">
                              <label>病历PDF：</label>
                              <input type="file" accept=".pdf" @change="handleNewPdfUpload" class="edit-input6">
                              <span v-if="newPet.pdfCase" class="pdf-name">{{ getPdfName(newPet.pdfCase) }}</span>
                          </div>
                      </div> -->
                      <div class="form-row6">
                          <div class="form-group6 full-width">
                              <label>宠物图片：</label>
                              <div class="upload-area" 
                                    :class="{ 'dragover': isDragOver }"
                                    @dragenter.prevent="handleDragEnter"
                                    @dragover.prevent="handleDragOver"
                                    @dragleave.prevent="handleDragLeave"
                                    @drop.prevent="handleImageDrop">
                                  <!-- <i class="fas fa-cloud-upload-alt"></i> -->
                                  <p style="margin-left: 18px;">拖放图片到这里或点击上传</p>
                                  <input type="file" accept="image/*" @change="handleNewImageUpload" ref="fileInput">
                              </div>
                              <img v-if="newPet.imageUrl" :src="newPet.imageUrl" class="image-preview">
                          </div>
                          <div class="form-group6 full-width">
                            <label>病历PDF：</label>
                            <div class="upload-area" 
                                @dragenter.prevent="handlePdfDragEnter"
                                @dragover.prevent="handlePdfDragOver"
                                @dragleave.prevent="handlePdfDragLeave"
                                @drop.prevent="handlePdfDrop">
                              <p style="margin-left: 18px;">拖放PDF文件到这里或点击上传</p>
                              <input type="file" accept=".pdf" @change="handleNewPdfUpload" ref="pdfInput">
                            </div>
                            <div v-if="newPet.pdfFile" class="pdf-info">
                              <p>已选择PDF: {{ newPet.pdfFile.name }}</p>
                            </div>
                          </div>
                      </div>
                      
                      <div class="form-row6">
                          <div class="form-group6">
                              <label>领养状态：</label>
                              <select v-model="newPet.adoptionStatus" @change="onNewPetStatusChange">
                                  <option value="forAdoption">待领养</option>
                                  <option value="owned">有主人</option>
                                  <option value="adopted">已领养</option>
                              </select>
                          </div>
                      </div>
                      <!-- 待领养状态显示描述输入框 -->
                      <div v-if="newPet.adoptionStatus === 'forAdoption'" class="form-row6">
                          <div class="form-group6 full-width">
                              <label>领养描述：</label>
                              <textarea v-model="newPet.description" placeholder="输入宠物描述，吸引潜在领养者" class="edit-textarea"></textarea>
                          </div>
                      </div>
                      
                      <!-- 主人信息 -->
                      <div v-if="newPet.adoptionStatus !== 'forAdoption'" class="owner-form">
                          <h3>主人信息</h3>
                          <div class="form-row6">
                              <div class="form-group1">
                                  <label>姓名：</label>
                                  <input type="text" v-model="newPet.owner.ownerName" placeholder="主人姓名" required>
                              </div>
                              <div class="form-group1">
                                  <label>性别：</label>
                                  <select v-model="newPet.owner.gender">
                                      <option value="男">男</option>
                                      <option value="女">女</option>
                                  </select>
                              </div>
                          </div>
                          <div class="form-row6">
                              <div class="form-group1">
                                  <label>电话：</label>
                                  <input type="text" v-model="newPet.owner.phone" placeholder="联系电话" required>
                              </div>
                              <div class="form-group1">
                                  <label>邮箱：</label>
                                  <input type="email" v-model="newPet.owner.email" placeholder="邮箱地址">
                              </div>
                          </div>
                      </div>
                      
                      <div class="form-actions">
                          <button class="btn-secondary" @click="importFromExcel">
                              <i class="fas fa-file-import"></i> 导入数据
                          </button>
                          <button class="btn-primary6" @click="addToBatchList">
                              <i class="fas fa-plus"></i> 添加到列表
                          </button>
                      </div>
                  </div>
                  
                  <!-- 批量添加列表 -->
                  <div class="batch-list-container6">
                      <h3>待添加宠物列表 ({{ batchPets.length }})</h3>
                      <div class="table-container6">
                          <table class="batch-table6">
                              <thead>
                                  <tr>
                                      <th style="width: 88px;text-align:left;">宠物姓名</th>
                                      <th style="width: 60px; text-align:left;">类型</th>
                                      <th style="width: 60px;text-align:left;">性别</th>
                                      <th style="width: 60px;text-align:left;">年龄</th>
                                      <th style="width: 78px;text-align:left;">重量</th>
                                      <th style="width: 75px;text-align:left;">状态</th>
                                      <th style="width: 125px;text-align:left;">病症</th>
                                      <th style="width: 185px;text-align:left;">主人/描述</th>
                                      <th style="text-align:center;">操作</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="(pet, index) in batchPets" :key="index">
                                      <td style="width: 58px;text-align:left;">{{ pet.petName }}</td>
                                      <td style="width: 30px;text-align:left;">{{ pet.type === 'dog' ? '狗狗' : '猫咪' }}</td>
                                      <td style="width: 30px;text-align:left;">{{ pet.gender }}</td>
                                      <td style="width: 30px;text-align:left;">{{ pet.age }}岁</td>
                                      <td style="width: 58px;text-align:left;">{{ pet.weight }}公斤</td>
                                      <td style="width: 45px;text-align:left;">{{ getStatusText(pet.adoptionStatus) }}</td>
                                      <td style="width: 90px;text-align:left;">{{ pet.disease || '无' }}</td>
                                      <td style="width: 150px;text-align:left;">
                                          <span v-if="pet.adoptionStatus !== 'forAdoption'">
                                              {{ pet.owner?.ownerName || '无' }}
                                          </span>
                                          <span v-else>{{ pet.description ? pet.description.substring(0, 15) + '...' : '无描述' }}</span>
                                      </td>
                                      <td style="text-align:center;">
                                          <button  style="background-color:rgb(52, 152, 217);color: aliceblue;"  @click="removeFromBatchList(index)">
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
                  <button class="btn-secondary" @click="closeBatchAddModal">
                      <i class="fas fa-times"></i> 取消
                  </button>
                  <button class="btn-primary6" @click="submitBatchPets" :disabled="batchPets.length === 0">
                      <i class="fas fa-save"></i> 提交 ({{ batchPets.length }})
                  </button>
              </div>
          </div>
      </div>
      <!-- PDF预览模态框 -->
      <div v-if="showPdfPreview" class="modal-overlay">
          <div class="modal-container">
              <div class="modal-header">
                  <h2>PDF预览</h2>
                  <button class="modal-close" @click="showPdfPreview = false">
                      <i class="fas fa-times"></i>
                  </button>
              </div>
              <div class="modal-body">
                  <div class="pdf-controls">
                      <button class="btn btn-primary6" @click="zoomPdf(0.8)">
                          <i class="fas fa-search-minus"></i> 缩小
                      </button>
                      <button class="btn btn-primary6" @click="zoomPdf(1.2)">
                          <i class="fas fa-search-plus"></i> 放大
                      </button>
                      <span class="scale-display">缩放: {{ (pdfScale * 100).toFixed(0) }}%</span>
                  </div>
                  <div class="pdf-viewer">
                      <canvas id="pdf-canvas"></canvas>
                  </div>
              </div>
          </div>
      </div>
      <!-- Toast 弹窗 -->
      <div v-if="toast.show" class="toast" :class="toast.type">
          <i :class="toast.icon"></i> {{ toast.message }}
      </div>
      <!-- 申请详情模态框 -->
      <div v-if="showApplicationDetail" class="modal-overlay">
        <div class="modal-container application-detail-modal">
          <div class="modal-header">
            <h2>领养申请详情</h2>
            <button class="modal-close" @click="closeApplicationDetail">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedApplication" class="application-detail-content">
              <!-- 宠物信息部分 -->
              <div class="detail-section">
                <h3>宠物信息</h3>
                <div class="pet-info6-display">
                  <img :src="getPetImage(selectedApplication.pet)" class="pet-detail-image">
                  <div class="pet-detail-info">
                    <div class="detail-item">
                      <span class="detail-label">姓名：</span>
                      <span class="detail-value">{{ selectedApplication.pet.petName }}</span>
                    </div>
                    
                    <div class="detail-item">
                      <span class="detail-label">年龄：</span>
                      <span class="detail-value">{{ selectedApplication.pet.age }}岁</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">性别：</span>
                      <span class="detail-value">{{ selectedApplication.pet.gender }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">重量：</span>
                      <span class="detail-value">{{ selectedApplication.pet.weight }}公斤</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">病症：</span>
                      <span class="detail-value">{{ selectedApplication.pet.disease|| '无' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">宠物描述：</span>
                      <span class="detail-value">{{ selectedApplication.pet.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 申请人信息部分 -->
              <div class="detail-section">
                <h3>申请人信息</h3>
                <div class="applicant-details">
                  <div class="detail-item">
                    <span class="detail-label">姓名：</span>
                    <span class="detail-value">{{ selectedApplication.username }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">电话：</span>
                    <span class="detail-value">{{ selectedApplication.phone || '未提供' }}</span>
                    <button class="contact-btn" @click="simulateCall(selectedApplication.phone)">
                      <i class="fas fa-phone"></i> 拨打
                    </button>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">邮箱：</span>
                    <span class="detail-value">{{ selectedApplication.email || '未提供' }}</span>
                  </div>
                  <div class="detail-item full-width">
                    <span class="detail-label">申请时间：</span>
                    <span class="detail-value">{{ formatTime(selectedApplication.time) }}</span>
                  </div>
                  <div class="detail-item full-width">
                    <span class="detail-label">家庭环境描述：</span>
                    <div class="environment-desc">
                      {{ selectedApplication.environment || '未提供环境描述' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 申请状态部分 -->
              <div class="detail-section">
                <h3>申请状态</h3>
                <div class="status-controls">
                  <div class="current-status">
                    当前状态：<span :class="['status-badge', selectedApplication.status]">
                      {{ getStatusText1(selectedApplication.status) }}
                    </span>
                  </div>
                  <div class="status-actions" v-if="!selectedApplication.status || selectedApplication.status === 'pending'">
                    <button class="btn approve" @click="updateApplicationStatus(selectedApplication, 'approved')">
                      <i class="fas fa-check"></i> 批准申请
                    </button>
                    <button class="btn reject" @click="updateApplicationStatus(selectedApplication, 'rejected')">
                      <i class="fas fa-times"></i> 拒绝申请
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary1" @click="closeApplicationDetail">
              关闭
            </button>
          </div>
        </div>
      </div>

      <!-- 电话模拟模态框 -->
      <div v-if="showCallModal" class="modal-overlay">
        <div class="modal-container call-modal">
          <div class="modal-header">
            <h2>正在呼叫</h2>
          </div>
          <div class="modal-body">
            <div class="call-content">
              <div class="call-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="call-info">
                <div class="call-name">{{ callingApplicant }}</div>
                <div class="call-number">{{ callingNumber }}</div>
                <div class="call-status">呼叫中...</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn end-call" @click="showCallModal = false">
              <i class="fas fa-phone-slash"></i> 结束通话
            </button>
          </div>
        </div>
      </div>

      <!-- 删除确认模态框 -->
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal-container delete-confirm-modal">
          <div class="modal-header">
            <h2>确认删除</h2>
          </div>
          <div class="modal-body">
            <p>确定要删除这条领养申请吗？此操作不可恢复。</p>
            <p class="delete-warning">申请来自: {{ deleteCandidate.username }} - 宠物: {{ deleteCandidate.pet.petName }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" style="width: 130px;padding-left: 38px;" @click="showDeleteConfirm = false">
              <i class="fas fa-times"></i>取消
            </button>
            <button class="btn danger" @click="confirmDeleteApplication">
              <i class="fas fa-trash"></i> 确认删除
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { API_BASE_URL } from '@/config/index';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
setup() {
    const apiBaseUrl = ref('http://47.113.205.34:8085');
    // 状态管理
    const loading = ref(false);
    const toast = ref({
        show: false,
        message: '',
        type: 'info',
        icon: ''
    });
    

    // 申请管理相关状态
    const showNotificationDropdown = ref(false);
    const applications = ref([]);
    const selectedApplication = ref(null);
    const showApplicationDetail = ref(false);
    const showCallModal = ref(false);
    const callingApplicant = ref('');
    const callingNumber = ref('');
    const showDeleteConfirm = ref(false);
    const deleteCandidate = ref(null);
    
    // 计算未读申请数量
    const unreadCount = computed(() => {
      return applications.value.filter(app => !app.read).length;
    });
    
    // 格式化时间
    const formatTime = (dateTime) => {
      console.log(dateTime)
      if (!dateTime) return '未知时间';
      const date = new Date(dateTime);
  
      // 确保显示完整的年月日时分秒
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
    };
    
    // 获取状态文本
    const getStatusText1 = (status) => {
      switch (status) {
        case 'approved': return '已批准';
        case 'rejected': return '已拒绝';
        case 'pending': return '待处理';
        default: return '待处理';
      }
    };
    
    // 获取状态类名
    const getStatusClass1 = (status) => {
      switch (status) {
        case 'approved': return 'approved';
        case 'rejected': return 'rejected';
        case 'pending': return 'pending';
        default: return 'pending';
      }
    };
    
    // 切换通知下拉菜单
    const toggleNotifications = () => {
      console.log("11")
      showNotificationDropdown.value = !showNotificationDropdown.value;
      if (showNotificationDropdown.value) {
        console.log("22")
        // 标记所有通知为已读
        applications.value.forEach(app => {
          app.read = true;
        });
      }
    };
    
    // 加载申请数据
    const loadApplications = async () => {
      try {
        loading.value = true;
        // 使用提供的接口获取申请信息
        const response = await axios.get(`${apiBaseUrl.value}/getApplications`);
        console.log(response);
        
        if (response.data.code === 200) {
          // 获取所有宠物信息
          const petsResponse = await axios.get(`${apiBaseUrl.value}/getPetsAndOwners`);
          console.log(petsResponse.data.data);
          if (petsResponse.data.code === 200) {
            // 创建宠物ID到宠物信息的映射
            const petsMap = {};
            petsResponse.data.data.forEach(pet => {
              petsMap[pet.pet.petId] = pet.pet;
            });
            
            // 将宠物信息添加到申请中
            applications.value = response.data.data.map(app => ({
              ...app,
              read: false,
              pet: petsMap[app.petId] || {
                petId: app.petId,
                petName: `宠物${app.petId}`,
                type: 'dog',
                age: 1,
                gender: '公',
                adoptionStatus: 'forAdoption',

              }
            }));
          } else {
            // 如果获取所有宠物失败，使用模拟数据
            applications.value = response.data.data.map(app => ({
              ...app,
              read: false,
              pet: {
                petId: app.petId,
                petName: `宠物${app.petId}`,
                type: Math.random() > 0.5 ? 'dog' : 'cat',
                age: Math.floor(Math.random() * 10) + 1,
                gender: Math.random() > 0.5 ? '公' : '母',
                adoptionStatus: 'forAdoption',
                image: Math.random() > 0.5 ? 
                  'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=80' : 
                  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
              }
            }));
          }
        } else {
          showToast('获取申请信息失败', 'error');
          // 使用模拟数据
          applications.value = [
            {
              applicationId: 1,
              petId: 1,
              userId: 1,
              username: '张三',
              phone: '13800138000',
              email: 'zhangsan@example.com',
              environment: '家有院子，适合宠物活动，有养宠经验',
              applicationTime: new Date().toISOString(),
              status: 'pending',
              read: false,
              pet: {
                petId: 1,
                petName: '小白',
                type: 'dog',
                age: 3,
                gender: '公',
                adoptionStatus: 'forAdoption',
                image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=80'
              }
            },
            {
              applicationId: 2,
              petId: 2,
              userId: 2,
              username: '李四',
              phone: '13900139000',
              email: 'lisi@example.com',
              environment: '公寓居住，但有充足时间陪伴宠物',
              applicationTime: new Date(Date.now() - 86400000).toISOString(),
              status: 'pending',
              read: false,
              pet: {
                petId: 2,
                petName: '喵喵',
                type: 'cat',
                age: 2,
                gender: '母',
                adoptionStatus: 'forAdoption',
                image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
              }
            }
          ];
        }
      } catch (error) {
        console.error('加载申请数据失败:', error);
        showToast('加载申请数据失败', 'error');
      } finally {
        loading.value = false;
      }
    };
    // 查看申请详情
    const viewApplication = (application) => {
      console.log(application)
      console.log(application.time)
      selectedApplication.value = application;
      showApplicationDetail.value = true;
      showNotificationDropdown.value = false;
    };
    
    // 关闭申请详情
    const closeApplicationDetail = () => {
      showApplicationDetail.value = false;
      selectedApplication.value = null;
    };
    
    // 模拟拨打电话
    const simulateCall = (phone) => {
      if (!phone) {
        showToast('该申请人未提供联系电话', 'error');
        return;
      }
      
      callingApplicant.value = selectedApplication.value.username;
      callingNumber.value = phone;
      showCallModal.value = true;
    };
    
    // 处理长按事件
    const handleLongPress = (application) => {
      console.log(application)
      deleteCandidate.value = application;
      showDeleteConfirm.value = true;
    };
    
    // 确认删除申请
    const confirmDeleteApplication = async () => {
      if (!deleteCandidate.value) return;
      
      try {
        console.log(deleteCandidate.value)
        loading.value = true;
        // 使用提供的接口删除申请
        const response = await axios.post(`${apiBaseUrl.value}/deleteApplication?applicationId=${deleteCandidate.value.applicationId}`);
        console.log(response);
        if (response.data.code === 200) {
          showToast('申请删除成功', 'success');
          // 从列表中移除
          applications.value = applications.value.filter(
            app => app.applicationId !== deleteCandidate.value.applicationId
          );
        } else {
          showToast('删除申请失败', 'error');
        }
      } catch (error) {
        console.error('删除申请失败:', error);
        showToast('删除申请失败', 'error');
      } finally {
        loading.value = false;
        showDeleteConfirm.value = false;
        deleteCandidate.value = null;
      }
    };
    
    // 更新申请状态
    const updateApplicationStatus = async (application, status) => {
      try {
        loading.value = true;
        // 这里应该调用更新申请状态的API
        // 由于接口文档中没有明确给出，这里使用模拟操作
        application.status = status;
        showToast(`申请已${status === 'approved' ? '批准' : '拒绝'}`, 'success');
        
        // 如果是批准申请，更新宠物状态为已领养
        if (status === 'approved') {
          // 这里应该调用更新宠物状态的API
          application.pet.adoptionStatus = 'adopted';
        }
      } catch (error) {
        console.error('更新申请状态失败:', error);
        showToast('更新申请状态失败', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    // 筛选条件
    const filters = ref({
        petName: '',
        disease: '',
        owner: '',
        status: 'all',
        ageRange: 'all',
        type: 'all',

    });

    // 宠物数据
    const pets = ref([]);
    
    // 批量添加相关状态
    const showBatchAddModal = ref(false);
    const batchPets = ref([]);
    const newPet = ref({
        petName: '',
        type: 'dog',
        age: 1,
        gender: '公',
        weight: 3.5,
        disease: '',
        image: null,
        adoptionStatus: 'forAdoption',
        description: '',
        pdfCase: null,
        owner: {
            ownerName: '',
            gender: '男',
            phone: '',
            email: ''
        }
    });

    const isDragOver = ref(false);
    const isPdfDragOver = ref(false);
    const showPdfPreview = ref(false);
    const pdfScale = ref(1.2);
    const pdfDocument = ref(null);
    const pdfPage = ref(null);
    const currentPdfUrl = ref('');
    const fileInput = ref(null);
    const pdfInput = ref(null);
    // 文件输入引用映射
    const fileInputRefs = ref({});
                
    // 设置文件输入引用
    const setFileInputRef = (el, petId) => {
        if (el) {
            fileInputRefs.value[petId] = el;
        } else {
            // 当元素被卸载时，删除对应的引用
            delete fileInputRefs.value[petId];
        }
    };

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
        }, 3000);
    };

// 图片拖拽上传处理
    const handleDragEnter = () => {
        isDragOver.value = true;
    };

    const handleDragOver = () => {
        isDragOver.value = true;
    };

    const handleDragLeave = () => {
        isDragOver.value = false;
    };

    const handleImageDrop = (e) => {
        isDragOver.value = false;
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    };

    
    const handleImageFile = (file) => {
        if (!file.type.startsWith('image/')) {
            showToast('请选择图片文件', 'error');
            return;
        }
        
        // 预览图片
        const reader = new FileReader();
        reader.onload = (e) => {
            newPet.value.imageUrl = e.target.result;
            newPet.value.imageFile = file;
        };
        reader.readAsDataURL(file);
    };

    const handleNewImageUpload = (event) => {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith('image/')) {
          showToast('请选择图片文件', 'error');
          return;
      }
      handleImageFile(file); // 这个函数已经实现了将图片预览设置到newPet.imageUrl和newPet.imageFile
    };

    // PDF拖拽上传处理
    const handlePdfDragEnter = () => {
        isPdfDragOver.value = true;
    };

    const handlePdfDragOver = () => {
        isPdfDragOver.value = true;
    };

    const handlePdfDragLeave = () => {
        isPdfDragOver.value = false;
    };

    const handlePdfDrop = (e) => {
        isPdfDragOver.value = false;
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handlePdfFile(files[0]);
        }
    };

    const handlePdfFile = (file) => {
        if (file.type !== 'application/pdf') {
            showToast('请选择PDF文件', 'error');
            return;
        }
        
        newPet.value.pdfFile = file;
    };

     // 上传图片到服务器
    const uploadImage = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      // 根据接口，可以添加isAvatar参数，默认为false
      // formData.append('isAvatar', false);
      
      try {
          const response = await axios.post(`${apiBaseUrl.value}/uploadImage`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          console.log(response);
          if (response.data.code === 200) {
              return response.data.data; // 返回图片路径
          } else {
              throw new Error(response.data.msg || '图片上传失败');
          }
      } catch (error) {
          console.error('图片上传失败:', error);
          throw new Error('图片上传失败');
      }
    };
    
    // 上传PDF到服务器
    const uploadPdf = async (file) => {
        const formData = new FormData();
        console.log(formData);
        console.log(file)
        formData.append('file', file);
        console.log(formData)
        try {
            const response = await axios.post(`${apiBaseUrl.value}/uploadPdf`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
            if (response.data.code === 200) {
                return response.data.data; // 返回PDF路径
            } else {
                throw new Error(response.data.msg || 'PDF上传失败');
            }
        } catch (error) {
            console.error('PDF上传失败:', error);
            throw new Error('PDF上传失败');
        }
    };

    // 获取宠物图片
    const getPetImage = (pet) => {
        if (pet.editing && pet.editingData.imagePreview) {
            return pet.editingData.imagePreview;
        }
        return getFullImageUrl(pet.image);
    };

    // 获取完整的图片URL
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';
        
        if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
            return imagePath;
        }
         return `${apiBaseUrl.value}${imagePath}`;
    };

    // 处理图片加载错误
    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';
    };

    
     
    // 点击图片处理
    const onImageClick = (pet) => {
        if (pet.editing) {
            console.log("点击图片，打开文件选择器");
            const fileInput = fileInputRefs.value[pet.petId];
            console.log("找到文件输入元素:", fileInput);
            if (fileInput) {
                fileInput.click();
            } else {
                console.error("未找到文件输入元素");
                showToast('无法找到文件输入元素', 'error');
            }
        }
    };
    
    // 处理图片上传
    const handleImageUpload = (event, pet) => {
     const file = event.target.files[0];
     if (!file || !file.type.startsWith('image/')) {
         showToast('请选择图片文件', 'error');
         return;
     }
     
     // 创建预览
     const reader = new FileReader();
     reader.onload = (e) => {
         pet.editingData.imagePreview = e.target.result;
         pet.editingData.newImageFile = file;
         showToast('图片已选择，保存后生效', 'success');
     };
     reader.readAsDataURL(file);
 };

    // 查看PDF
    const viewPdf = async (pdfPath) => {
      try {
        console.log(pdfPath);
        showToast('正在加载PDF...', 'loading');
        
        // 确保 PDF.js 已加载
        if (typeof pdfjsLib === 'undefined') {
          showToast('PDF库加载中，请稍候...', 'loading');
          // 等待一段时间让库加载
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF库加载失败，请刷新页面重试');
          }
        }
        
        // 获取完整的PDF URL
        let pdfUrl = pdfPath;
        if (!pdfPath.startsWith('http')) {
          pdfUrl = `${apiBaseUrl.value}${pdfPath}`;
        }
        
        currentPdfUrl.value = pdfUrl;
        showPdfPreview.value = true;
        
        // 设置 PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        
        // 加载PDF文档
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        pdfDocument.value = await loadingTask.promise;
        
        // 渲染第一页
        await renderPdfPage(1);
        
        showToast('PDF加载成功', 'success');
      } catch (error) {
        console.error('PDF加载失败:', error);
        showToast('PDF加载失败: ' + (error.message || '未知错误'), 'error');
      }
    };

    // 渲染PDF页面
    const renderPdfPage = async (pageNum) => {
        try {
            pdfPage.value = await pdfDocument.value.getPage(pageNum);
            
            const canvas = document.getElementById('pdf-canvas');
            const context = canvas.getContext('2d');
            
            const viewport = pdfPage.value.getViewport({ scale: pdfScale.value });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            await pdfPage.value.render(renderContext).promise;
        } catch (error) {
            console.error('PDF渲染失败:', error);
            showToast('PDF渲染失败', 'error');
        }
    };

    // PDF缩放
    const zoomPdf = async (factor) => {
        pdfScale.value *= factor;
        await renderPdfPage(pdfPage.value.pageNumber);
    };

    // 打开批量添加模态框
    const openBatchAddModal = () => {
        showBatchAddModal.value = true;
        batchPets.value = [];
        resetNewPetForm();
    };

    // 重置新宠物表单
    const resetNewPetForm = () => {
        newPet.value = {
            petName: '',
            type: 'dog',
            age: 1,
            gender: '公',
            weight: 3.5,
            disease: '',
            imageUrl: null,
            imageFile: null,
            pdfFile: null,
            adoptionStatus: 'forAdoption',
            description: '',
            owner: {
                ownerName: '',
                gender: '男',
                phone: '',
                email: ''
            }
        };
    };

    // 添加到批量列表
    const addToBatchList = async () => {
        try {
              // 验证必填字段
            if (!newPet.value.petName.trim()) {
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
                if (!newPet.value.owner.ownerName.trim() || !newPet.value.owner.phone.trim()) {
                    alert('请填写主人姓名和联系电话');
                    return;
                }
            }
            
            // 待领养宠物验证描述
            if (newPet.value.adoptionStatus === 'forAdoption' && !newPet.value.description.trim()) {
                alert('请填写宠物描述');
                return;
            }

            loading.value = true;
            showToast('正在上传文件...', 'loading');
            
            let imageUrl = null;
            let pdfUrl = null;
            
            // 上传图片
            if (newPet.value.imageFile) {
                imageUrl = await uploadImage(newPet.value.imageFile);
            }
            console.log(imageUrl)
            console.log(newPet.value.pdfFile)
            // 上传PDF
            if (newPet.value.pdfFile) {
                pdfUrl = await uploadPdf(newPet.value.pdfFile);
            }
            console.log(pdfUrl)
            // 创建宠物副本
            const petCopy = {
                ...newPet.value,
                image: imageUrl,
                pdfCase: pdfUrl
            };
            
            // 如果状态是待领养，清除主人信息
            if (petCopy.adoptionStatus === 'forAdoption') {
                petCopy.owner = null;
            } else {
                // 确保owner信息存在
                petCopy.owner = petCopy.owner || {
                    ownerName: '',
                    gender: '男',
                    phone: '',
                    email: ''
                };
            }
            
            // 添加到列表
            batchPets.value.push(petCopy);
            
            // 重置表单
            resetNewPetForm();
            
            showToast('宠物已添加到批量列表', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            loading.value = false;
        }
    };

    // 提交批量添加
    const submitBatchPets = async () => {
      try {
            loading.value = true;
            showToast('正在批量添加宠物...', 'loading');
            
            for (const pet of batchPets.value) {
              let imageUrl = null;
              let pdfUrl = null;
              
              // 上传图片
              if (pet.imageFile) {
                imageUrl = await uploadImage(pet.imageFile);
              }
              
              // 上传PDF
              if (pet.pdfFile) {
                pdfUrl = await uploadPdf(pet.pdfFile);
              }
              if (pet.adoptionStatus !== 'forAdoption' && pet.owner) {
                // 添加宠物和主人
                console.log("1111");
                const response = await axios.post(`${apiBaseUrl.value}/addPetAndOwner`, [{
                    pet: {
                      petName: pet.petName,
                      type: pet.type,
                      age: pet.age,
                      gender: pet.gender,
                      weight: pet.weight,
                      disease: pet.disease || '',
                      image: imageUrl || null,
                      adoptionStatus: pet.adoptionStatus,
                      description: pet.description || '',
                      pdfCase: pdfUrl || null
                    },
                    owner: pet.owner
                }]);
                    console.log(response);
                }
                else {
                    console.log("2222");
                    // 只添加宠物
                    const petData = {
                      petName: pet.petName,
                      type: pet.type,
                      age: pet.age,
                      gender: pet.gender,
                      weight: pet.weight,
                      disease: pet.disease || '',
                      image: imageUrl,
                      adoptionStatus: pet.adoptionStatus,
                      description: pet.description || '',
                      pdfCase: pdfUrl
                    };
                    console.log(pet);
                    const response = await axios.post(`${apiBaseUrl.value}/addPetList`, [petData]);
                    console.log(response);
                }
            }
            batchPets.value.forEach(pet => {
              pets.value.push({
                  ...pet,
                  editing: false,
                  editingData: {}
              });
        });
        
        // 关闭模态框
        closeBatchAddModal();
        
        showToast(`成功添加 ${batchPets.value.length} 只宠物`, 'success');
        } catch (err) {
        showToast('批量添加失败: ' + (err.message || '未知错误'), 'error');
        console.error('批量添加失败:', err);
        } finally {
            loading.value = false;
        }
    };


    // 加载宠物数据
    const loadPets = async () => {
        try {
            loading.value = true;
            showToast('正在加载宠物数据...', 'loading');
            const response = await axios.get(`${apiBaseUrl.value}/getPetsAndOwners`);
            console.log(response);
            if (response.data.code === 200) {
                // 转换数据结构，将owner信息合并到pet对象中
                pets.value = response.data.data.map(item => {
                    const pet = {...item.pet};
                    pet.owner = item.owner || null;
                    pet.editing = false;
                    pet.editingData = {};
                    return pet;
                });
                showToast('宠物数据加载成功', 'success');
            } else {
                showToast('获取宠物数据失败', 'error');
            }
        } catch (err) {
            showToast('加载宠物数据失败: ' + (err.message || '未知错误'), 'error');
            console.error('加载宠物数据失败:', err);
        } finally {
            loading.value = false;
        }
    };

    // 计算属性 - 筛选后的宠物列表
    const filteredPets = computed(() => {//computed是 Vue.js 中用于声明依赖于其他数据的计算属性的方式,根据其依赖的数据自动更新
        return pets.value.filter(pet => {//.value获得‘响应式’ref数组pets的值  //filter过滤器的使用
            // 搜索条件匹配，‘或者||’两者其中一个为真，则左边也为真
            const matchesName = !filters.value.petName || //过滤器中的宠物名字为空（！则为真），则匹配
              pet.petName.toLowerCase().includes(filters.value.petName.toLowerCase());//宠物的名字转小写，包含过滤器宠物名字转小写，则匹配
            
            const matchesDisease = !filters.value.disease || 
              (pet.disease && pet.disease.toLowerCase().includes(filters.value.disease.toLowerCase()));
            
            const matchesOwner = !filters.value.owner || 
              (pet.owner && pet.owner.ownerName && pet.owner.ownerName.toLowerCase().includes(filters.value.owner.toLowerCase()) )|| 
              (pet.owner && pet.owner.gender && pet.owner.gender.toLowerCase().includes(filters.value.owner.toLowerCase()))|| 
              (pet.owner && pet.owner.phone && pet.owner.phone.toLowerCase().includes(filters.value.owner.toLowerCase())) || 
              (pet.owner && pet.owner.email && pet.owner.email.toLowerCase().includes(filters.value.owner.toLowerCase()));
            
            // 领养状态匹配
            const matchesStatus = filters.value.status === 'all' || 
              pet.adoptionStatus === filters.value.status;
            
            // 年龄匹配
            let matchesAge = true;
            if (filters.value.ageRange !== 'all') {
                const [min, max] = filters.value.ageRange.split('-');//将年龄范围字符串按破折号分割成最小和最大年龄
                if (max) {//   如果max存在（即范围是一个区间，如'1-5'），则检查宠物的年龄是否在最小和最大年龄之间（包括边界）。
                    matchesAge = pet.age >= parseInt(min) && pet.age <= parseInt(max);
                } else {// 如果max不存在（即范围是开放式的，如'5+'），则检查宠物的年龄是否大于等于最小年龄。
                    matchesAge = pet.age >= parseInt(min);
                }
            }
            
            // 宠物类别匹配
            const matchesType = filters.value.type === 'all' || 
            pet.type === filters.value.type;

            return matchesName && matchesDisease && matchesOwner && matchesStatus && matchesAge && matchesType;
        });
    });

    // 开始编辑宠物信息
    const startEditing = (pet) => {
        pet.editing = true;
        // 深拷贝当前数据到编辑数据对象
        pet.editingData = {
            petId:pet.petId,
            petName: pet.petName,
            type: pet.type,
            age: pet.age,
            gender: pet.gender,
            weight: pet.weight,
            disease: pet.disease || '无',
            adoptionStatus: pet.adoptionStatus,
            description: pet.description || '',
            pdfCase: pet.pdfCase || null,
            owner: pet.owner ? {...pet.owner} : {
                ownerName: '',
                gender: '男',
                phone: '',
                email: ''
            },
            newImageFile: null,
            imagePreview: null,
            image: pet.image,
        };
    };
    // 保存编辑
    const savePet = async (pet) => {
        try {
            loading.value = true;
            showToast('正在保存宠物信息...', 'loading');
            
            const originalStatus = pet.adoptionStatus;
            const newStatus = pet.editingData.adoptionStatus;
            console.log(originalStatus);
            console.log(newStatus);
            let imagePath = pet.editingData.image;
            console.log(imagePath)
            if (pet.editingData.newImageFile) {
                pet.image = pet.editingData.imagePreview;
            }               

            // 如果有新图片，先上传图片
            if (pet.editingData.newImageFile) {
                imagePath = await uploadImage(pet.editingData.newImageFile);
            }
            console.log(imagePath)
            // 情况1: 从待领养变为有主人/已领养
            if (originalStatus === 'forAdoption' && 
                (newStatus === 'owned' || newStatus === 'adopted') && !pet.owner) {
                console.log("88");
                console.log(pet);
                // 1. 添加主人信息
                const addOwnerResponse = await axios.post(`${apiBaseUrl.value}/addOwner`, {
                    ownerName: pet.editingData.owner.ownerName,
                    gender:pet.editingData.owner.gender,
                    phone: pet.editingData.owner.phone,
                    email:pet.editingData.owner.email
                });
                console.log(addOwnerResponse.data.data);
                console.log(pet.petId);
                if (addOwnerResponse.data.code !== 200) {
                    throw new Error('添加主人信息失败');
                }
                
                const ownerId = addOwnerResponse.data.data;
                
                // 2. 关联宠物和主人
                const addPetOwnerResponse = await axios.post(`${apiBaseUrl.value}/addPetOwner`, {
                    petId: pet.petId,
                    ownerId: ownerId
                });
                
                if (addPetOwnerResponse.data.code !== 200) {
                    throw new Error('关联宠物和主人失败');
                }
                
                // 3. 更新宠物状态
                const updatePetResponse = await axios.post(`${apiBaseUrl.value}/updatePetAndOwner`, {
                    pet: {
                      petId: pet.petId,
                      petName: pet.editingData.petName,
                      type: pet.editingData.type,
                      age: pet.editingData.age,
                      gender: pet.editingData.gender,
                      weight: pet.editingData.weight,
                      disease: pet.editingData.disease || '无',
                      adoptionStatus: pet.editingData.adoptionStatus,
                      description: pet.editingData.description || '',
                      pdfCase: pet.editingData.pdfCase || null,
                      image : imagePath
                    },
                    owner: pet.editingData.owner
                });
                
                if (updatePetResponse.data.code !== 200) {
                    throw new Error('更新宠物状态失败');
                }
                console.log(pet);
                showToast('宠物信息更新成功', 'success');
            } 
            // 情况2: 其他情况直接调用/updatePetAndOwner
            else {
              console.log("99");
                const response = await axios.post(`${apiBaseUrl.value}/updatePetAndOwner`, {
                    pet: {
                      petId: pet.petId,
                      petName: pet.editingData.petName,
                      type: pet.editingData.type,
                      age: pet.editingData.age,
                      gender: pet.editingData.gender,
                      weight: pet.editingData.weight,
                      disease: pet.editingData.disease || '无',
                      adoptionStatus: pet.editingData.adoptionStatus,
                      description: pet.editingData.description || '',
                      pdfCase: pet.editingData.pdfCase || null,
                      image:imagePath
                    },
                    owner: pet.editingData.owner
                });
                
                if (response.data.code !== 200) {
                    throw new Error(response.data.msg || '更新失败');
                }
                
                showToast('宠物信息更新成功', 'success');
            }
            
            // 更新本地数据
            Object.assign(pet, {
                ...pet.editingData,
                editing: false,
            });
            
            // 重新加载数据以确保一致性
            await loadPets();
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
        console.log(id);
        try {
            loading.value = true;
            showToast('正在删除宠物记录...', 'loading');
            const response = await axios.post(`${apiBaseUrl.value}/deletePet?petId=${id}`);
            console.log(response);
            if (response.data.code === 200) {
                // 更新本地数据
                pets.value = pets.value.filter(pet => pet.petId !== id);
                showToast('宠物删除成功', 'success');
            } else {
                showToast('删除宠物失败: ' + (response.data.msg || '未知错误'), 'error');
            }
        } catch (err) {
            showToast('删除宠物失败: ' + (err.message || '未知错误'), 'error');
            console.error('删除宠物失败:', err);
        } finally {
            loading.value = false;
        }
    };

    // 关闭批量添加模态框
    const closeBatchAddModal = () => {
        showBatchAddModal.value = false;
    };


    // 从批量列表移除
    const removeFromBatchList = (index) => {
        batchPets.value.splice(index, 1);
    };

    // 添加新宠物（批量）
    const addNewPet = () => {
        openBatchAddModal();
    };

    // 重置筛选条件
    const resetFilters = () => {
        filters.value = {
            petName: '',
            disease: '',
            owner: '',
            status: 'all',
            ageRange: 'all',
            type:'all'
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
              (!pet.editingData.owner || !pet.editingData.owner.ownerName)) {
            pet.editingData.owner = {
                ownerName: '',
                gender: '男',
                phone: '',
                email: ''
            };
        }
    };

    // 新宠物状态变更处理
    const onNewPetStatusChange = () => {
        // 如果从待领养变为有主人/已领养，初始化主人信息
        if (newPet.value.adoptionStatus !== 'forAdoption' && 
              (!newPet.value.owner || !newPet.value.owner.ownerName)) {
            newPet.value.owner = {
                ownerName: '',
                gender: '男',
                phone: '',
                email: ''
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
                    '编号': pet.petId,
                    '宠物姓名': pet.petName,
                    '宠物类型': pet.type === 'dog' ? '狗狗' : '猫咪',
                    '宠物性别': pet.gender,
                    '宠物年龄': pet.age,
                    '宠物重量': pet.weight,
                    '宠物病症': pet.disease || '无',
                    '领养状态': getStatusText(pet.adoptionStatus),
                    '宠物描述': pet.description || '',
                    'PDF病历': pet.pdfCase || '无'
                };
                
                if (pet.owner) {
                    return {
                        ...baseInfo,
                        '主人姓名': pet.owner.ownerName,
                        '性别': pet.owner.gender,
                        '联系电话': pet.owner.phone,
                        '邮箱': pet.owner.email || '无'
                    };
                } else {
                    return {
                        ...baseInfo,
                        '主人姓名': '',
                        '性别': '',
                        '联系电话': '',
                        '邮箱': ''
                    };
                }
            });
            
            // 创建工作簿
            const wb = XLSX.utils.book_new();
            
            // 创建工作表
            const ws = XLSX.utils.json_to_sheet(excelData);
            
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

    // 处理新宠物的PDF上传
    const handleNewPdfUpload = async (event) => {
      const file = event.target.files[0];
      if (!file || file.type !== 'application/pdf') {
      showToast('请选择PDF文件', 'error');
      return;
      }

      // 直接保存文件对象到newPet，而不是尝试上传
      newPet.value.pdfFile = file;
      showToast('PDF文件已选择，将在提交时上传', 'success');
    };

    // 处理PDF上传
    const handlePdfUpload = async (event, pet) => {
        const file = event.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            showToast('请选择PDF文件', 'error');
            return;
        }
        
        try {
            loading.value = true;
            showToast('正在上传PDF...', 'loading');
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await axios.post(`${apiBaseUrl.value}/uploadPdf`, formData
            );
            console.log(response);
            if (response.data.code === 200) {
                pet.editingData.pdfCase = response.data.data;
                showToast('PDF上传成功', 'success');
            } else {
                showToast('PDF上传失败: ' + response.data.msg, 'error');
            }
        } catch (err) {
            showToast('PDF上传失败: ' + (err.message || '未知错误'), 'error');
            console.error('PDF上传失败:', err);
        } finally {
            loading.value = false;
        }
    };

    // 获取PDF文件名
    const getPdfName = (pdfUrl) => {
        if (!pdfUrl) return '';
        const parts = pdfUrl.split('/');
        return parts[parts.length - 1];
    };
    // 导入Excel功能
    const importFromExcel = () => {
      // 创建隐藏的文件输入元素
      //创建一个隐藏的文件选择输入框，只接受.xlsx和.xls格式的Excel文件
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx, .xls';
      fileInput.style.display = 'none';
      
      // 添加事件监听器
      fileInput.addEventListener('change', async (event) => {//给文件输入框添加change事件监听器，当用户选择文件后触发
        const file = event.target.files[0];//获取用户选择的第一个文件，
        if (!file) return;//如果没有选择文件则直接返回
        
        try {
          loading.value = true;
          showToast('正在导入数据...', 'loading');//开始尝试处理文件，显示加载状态和提示信息
          
          // 读取Excel文件
          const data = await readExcelFile(file);//调用readExcelFile函数异步读取Excel文件内容
          
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
          petName: row['宠物姓名'] || `未命名宠物${index + 1}`,
          type: petType,
          age: parseInt(row['宠物年龄']) || 1,
          gender: row['宠物性别'] || '公',
          weight: parseFloat(row['宠物重量']) || 3.5,
          disease: row['宠物病症'] || '',
          image: null,
          adoptionStatus: adoptionStatus,
          description: row['宠物描述'] || '',
          pdfCase:row['PDF病历']
        };
        
        // 如果有主人信息
        if (adoptionStatus !== 'forAdoption' && row['主人姓名']) {
          pet.owner = {
            ownerName: row['主人姓名'] || '',
            gender: row['性别'] || '男',
            phone: row['联系电话'] || '',
            email: row['邮箱'] || ''
          };
        } else {
          pet.owner = null;
        }
        
        return pet;
      });
    };
    // 初始化加载数据
    onMounted(() => {
        loadPets();
        loadApplications();
    // 设置PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        }
    });

    return {
      filters,
      unreadCount,
      pets,
      filteredPets,
      loading,
      toast,
      showBatchAddModal,
      batchPets,
      newPet,
      startEditing,
      savePet,
      cancelEditing,
      deletePet,
      addNewPet,
      resetFilters,
      getStatusText,
      getStatusText1,
      loadApplications,
      getStatusClass,
      getStatusClass1,
      simulateCall,
      handleLongPress,
      viewApplication,
      closeApplicationDetail,
      toggleNotifications,
      getTypeClass,
      openBatchAddModal,
      closeBatchAddModal,
      addToBatchList,
      removeFromBatchList,
      submitBatchPets,
      onStatusChange,
      confirmDeleteApplication,
      updateApplicationStatus,
      onNewPetStatusChange,
      exportToExcel,
      handlePdfUpload,
      handleNewPdfUpload,
      getPdfName,
      importFromExcel,
      isDragOver,
      isPdfDragOver,
      showPdfPreview,
      pdfScale,
      fileInput,
      pdfInput,
      getFullImageUrl,
      handleImageError,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleImageDrop,
      handleImageUpload,
      handlePdfDragEnter,
      handlePdfDragOver,
      handlePdfDragLeave,
      handlePdfDrop,
      handlePdfUpload,
      viewPdf,
      zoomPdf,
      openBatchAddModal,
      closeBatchAddModal: () => showBatchAddModal.value = false,
      addToBatchList,
      submitBatchPets,
      showToast,
      loadPets,
      onImageClick,
      getPetImage,
      setFileInputRef,
      handleNewImageUpload,
      formatTime,
      showApplicationDetail,
      showNotificationDropdown,
      applications,
      selectedApplication,
      showCallModal,
      callingApplicant,
      callingNumber,
      showDeleteConfirm,
      deleteCandidate,
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
  .pet-container6 {
    margin: 0 2%; /* 使用百分比边距 */
  }
}

@media (min-width: 1600px) {
  .filter-section, 
  .pet-container6 {
    margin: 0 5%; /* 在大屏幕上增加边距 */
  }
}
.filter-section {
  margin: 0 2% 20px; /* 左右2%边距 */
}

.pet-container6 {
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
  border-radius: 10px;
  padding: 15px;
  margin: 0 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.726);
}

.search-box1 {
  display: flex;
  flex-wrap: wrap;
  gap: 75px;
  margin-bottom: 10px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 150px;
  max-width: 250px;
  margin-left: 30px;

}

.filter-group label {
  font-weight: 500;
  margin-right: 10px;
  min-width: 80px;
  text-align: left;
}
.filter-group1 {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 150px;
  max-width: 400px;
  margin-left: 50px;

}

.filter-group1 label {
  font-weight: 500;
  margin-right: 10px;
  min-width: 90px;
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

.search-input1 {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}
.search-input1:focus {
  border-color: #3498db;
  outline: none;
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
  margin-right: 20px;
  margin-top: 0px;
}
.btn-primary6{
  color: white;
  background-color: #c93dec;
}

.btn-secondary{
  background-color: #3b98f6f2;
  color: white;
}
.btn-secondary1{
  background-color: #C93DEC;
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

.pet-container6 {
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

.pet-header6 {
  display: flex;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #eee;
  padding-top:5px;
}

.pet-image6 {
  width: 90px;
  height: 90px;
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

.pet-image6 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-info6 {
  flex: 1;
  height: 100px;
}

.pet-name6 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 2px;
  color: #2c3e50;
}

.pet-status6 {
  margin-bottom: 2px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-tag6 {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  height: 26px;
}

.status-tag6.owned {
  background: #3498db;
  color: white;
}

.status-tag6.for-adoption {
  background: #e74c3c;
  color: white;
}

.status-tag6.adopted {
  background: #27ae60;
  color: white;
}
.status-tag6.cat-type {
  background: #9b59b6;
  color: white;
}
.status-tag6.dog-type {
  background: #f39c12;
  color: white;
}
/* 新增：宠物类型标签样式 */
.type-tag11 {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}
.type-tag11 {
  display: inline-block;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 20px;
  margin-top: 6px;
}
.type-tag11.dog-type {
  background: #f39c12;
  color: white;
}

.type-tag11.cat-type {
  background: #9b59b6;
  color: white;
}
.type-tag11.dog-type {
  background: #f39c12;
  color: white;
}

.type-tag11.cat-type {
  background: #9b59b6;
  color: white;
}

.read-only-text {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-style: italic;
}

.weight-edit {
  display: flex;
  align-items: center;
  gap: 5px;
}
.age-edit {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 6px;

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

.pet-details6 {
  padding: 1px;
  flex: 1;
  padding-top: 10px;
}

.detail-row6 {
  display: flex;
  margin-bottom: 10px;
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
  min-width: 40px;
  color: #34495e;
  text-align: left;
}
.detail-label2 {
  font-weight: 600;
  min-width: 60px;
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
  height: 90px;
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

.edit-input6 {
  padding: 5px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15.5px;
  height:23.8px;
}
.edit-input6-pet-name6-input {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 2px;
  padding: 5px;
  width: 35%;
  height: 25px;
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
 
}
.edit-select1{
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 70px;
  height: 25px;
}
.edit-select-type {
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 70px;
  height: 25px;
}
.edit-textarea {
  width:235px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  height: 125px;
}
.edit-input6:focus, 
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

.action-btn1 {
  padding-top: 6px;
  padding-bottom: 8px;
  margin: 0 3px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100px;
}

.action-btn1:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn1.edit {
  background: #f39c12;
  color: white;
}

.action-btn1.edit:hover:not(:disabled) {
  background: #e67e22;
}

.action-btn1.view {
  background: #3498db;
  color: white;
}

.action-btn1.view:hover:not(:disabled) {
  background: #2980b9;
}

.action-btn1.delete {
  background: #e74c3c;
  color: white;
}

.action-btn1.delete:hover:not(:disabled) {
  background: #c0392b;
}

.action-btn1.save {
  background: #27ae60;
  color: white;
  width: 150px;
}

.action-btn1.save:hover:not(:disabled) {
  background: #219653;
  width: 150px;
}

.action-btn1.cancel {
  background: #7f8c8d;
  color: white;
  width: 150px;
}

.action-btn1.cancel:hover:not(:disabled) {
  background: #636e72;
  width: 150px;
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 90%;
  
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
  align-items: center;
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

.form-row6 {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 15px;
  width: 790px;
  padding-left: 10px;
  padding-right: 10px;
}

.form-group6 {
  flex: 1;
  min-width: 100px;
}

.form-group1 {
  flex: 1;
  min-width: 100px;
}
.form-group1 label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
  margin-left: 18px;
}

.form-group1 input{
  width: 280px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 5px;
  margin-left: 18px;
}
.form-group6 label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  margin-left: 18px;
  color: #2c3e50;
}
.form-group1 select{
  width: 285px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-left: 18px;
  height: 36px;
}

.form-group6 select{
  width: 280px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-left: 18px;
}

.form-group6 textarea {
  width: 750px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-left: 18px;
}

.form-group6 input {
  width: 280px;
  padding: 8px 12px;
  margin-left: 18px;
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
.batch-list-container6 {
  margin-top: 20px;
}

.batch-list-container6 h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.table-container6 {
  overflow-x: auto;

}

.batch-table6 {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.batch-table6 th {
  background-color: #3498db;
  color: white;
  text-align: left;
  padding: 10px 15px;
}

.batch-table6 td {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.batch-table6 tr:nth-child(even) {
  background-color: #f8f9fa;
}

.batch-table6 tr:hover {
  background-color: #e3f2fd;
}

@media (max-width: 768px) {
  .pet-container6 {
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
  
  .form-row6 {
    flex-direction: column;
    gap: 10px;
  }
  
  .batch-table6 {
    font-size: 0.8rem;
  }
  
  .batch-table6 th, 
  .batch-table6 td {
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
  margin-top: 0px;
  gap: 0px;
  height: 50px;
}

/* 调整每个属性行的样式 */
.pet-gender6-row, .pet-age-row, .pet-weight-row {
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
  width: 60px;
  height: 18px;
}

.gender-edit label, 
.age-edit label, 
.weight-edit label {
  white-space: nowrap;
  font-size: 0.9rem;
}

.pet-gender6 {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 10px;
}


/* 保持图标样式 */
.pet-gender6 i {
  font-size: 1.1rem;
}
.pet-gender6 i.fa-mars {
  color: #3498db;
}
.pet-gender6 i.fa-venus {
  color: #e84393;
}

.edit-input6-pet-age{
  width: 27px;
  height: 15px;
}
.edit-input6-pet-weight{
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

.pet-name1 {
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50;
}

.applicant-name {
  font-size: 1.25rem;
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

.pet-info6-display {
  display: flex;
  gap: 20px;
  align-items: center;
}

.pet-image6 {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #eee;
}

.pet-details6 {
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

.detail-row6 {
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
.btn-secondary{
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
.btn-primary6{
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
/* 这里包含所有CSS样式，由于字符限制，只展示关键部分 */
/* 完整样式请参考原始代码 */
.main-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1920px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f7fa;
}

.header {
    text-align: center;
    margin-bottom: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #3498db, #8e44ad);
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pet-container6 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.pet-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.filter-section {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pet-image6 {
    width: 103px;
    height: 103px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-top: 5px;
    cursor: pointer;
}

.pet-image6 img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pet-image6.editing::after {
    content: '更换图片';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 50%;
}

.pet-image6.editing:hover::after {
    opacity: 1;
}

.pet-image6 input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
}

.image-preview {
    max-width: 100%;
    max-height: 200px;
    margin-top: 10px;
    border-radius: 4px;
}
/* 通知区域样式 */
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

.notification-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  width: 400px;
  z-index: 1000;
  max-height: 500px;
  overflow-y: auto;
}

.notification-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.notification-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.close-dropdown {
  cursor: pointer;
  color: #7f8c8d;
  font-size: 1.2rem;
}

.notification-list {
  padding: 10px 0;
}

.notification-item {
  padding: 12px 15px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item:last-child {
  border-bottom: none;
}

.application-pet-info6 {
  display: flex;
  align-items: center;
  flex: 1;
}

.pet-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.application-details {
  flex: 1;
}

.pet-name1 {
  font-weight: 600;
  margin-bottom: 4px;
  color: #2c3e50;
  font-size: 1.35rem;
}

.applicant-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.application-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.application-status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.application-status.approved {
  background-color: #d4edda;
  color: #155724;
}

.application-status.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.empty-notification {
  padding: 30px;
  text-align: center;
  color: #7f8c8d;
}

/* 申请详情模态框样式 */
.application-detail-modal {
  max-width: 700px;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #3498db;
}

.pet-info6-display {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.pet-detail-image {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.pet-detail-info {
  flex: 1;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.detail-item.full-width {
  width: 100%;
}

.detail-label {
  font-weight: 600;
  min-width: 100px;
  color: #34495e;
}

.detail-value {
  color: #2c3e50;
  flex: 1;
}

.contact-btn {
  margin-left: 15px;
  padding: 5px 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.environment-desc {
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border-left: 3px solid #3498db;
  margin-top: 5px;
  line-height: 1.5;
}

.status-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-status {
  font-weight: 500;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.status-actions {
  display: flex;
  gap: 10px;
}

.btn.approve {
  background: #27ae60;
  color: white;
}

.btn.reject {
  background: #e74c3c;
  color: white;
}

/* 电话模态框样式 */
.call-modal {
  max-width: 350px;
  text-align: center;
}

.call-content {
  padding: 20px 0;
}

.call-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
}

.call-info {
  margin-bottom: 20px;
}

.call-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.call-number {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.call-status {
  color: #3498db;
  font-weight: 500;
}

.end-call {
  background: #e74c3c;
  color: white;
  width: 100%;
}

/* 删除确认模态框样式 */
.delete-confirm-modal {
  max-width: 450px;
}

.delete-warning {
  color: #e74c3c;
  font-weight: 500;
  margin-top: 10px;
}

.btn.danger {
  background: #e74c3c;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-dropdown {
    width: 300px;
    right: -50px;
  }
  
  .application-detail-modal {
    width: 95%;
  }
  
  .pet-info6-display {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .status-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .status-actions {
    width: 100%;
    justify-content: center;
  }
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
  
  .pet-info6-display {
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