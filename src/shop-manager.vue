<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo-area">
        <div class="logo_qian">
          <i class="fas fa-paw"></i>
          <h1>爱宠健康商城</h1>
        </div>
        <div class="clinic-info">
          <p><i class="fas fa-map-marker-alt"></i> 北京市朝阳区宠物医疗中心</p>
          <p><i class="fas fa-clock"></i> 营业时间: 9:00-21:00</p>
        </div>
      </div>
      <nav class="main-nav">
        <button 
          @click="switchView('products')" 
          :class="{ active: currentView === 'products' }"
        >
          <i class="fas fa-shopping-bag"></i>
          商品列表
        </button>
        <button 
          @click="switchView('add-product')" 
          :class="{ active: currentView === 'add-product' }"
        >
          <i class="fas fa-plus-circle"></i>
          商品管理
        </button>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="main-content_qian">
      <!-- 商品列表视图 -->
      <div v-if="currentView === 'products'" class="product-view">
        <!-- 横幅区域 - 左右布局 -->
        <div class="banner-with-search">
          <div class="banner-content">
            <!-- 左侧文本 -->
            <div class="banner-text">
              <h2>为您的爱宠提供专业医疗用品</h2>
              <p>营养品、宠物用品一站式购买</p>
            </div>
            
            <!-- 右侧搜索框 -->
            <div class="search-box_qian">
              <input 
                type="text" 
                placeholder="搜索商品名称或描述..." 
                v-model="searchQuery"
                @keyup.enter="performSearch"
              >
              <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
                <i class="fas fa-times"></i>
              </button>
              <button @click="performSearch">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 商品分类 - 固定在顶部 -->
        <div class="category-container">
          <div class="category-section">
            <div class="category-buttons">
              <button 
                v-for="category in categories" 
                :key="category.value"
                @click="selectCategory(category.value)"
                :class="['category-btn', { active: currentCategory === category.value }]"
              >
                <i :class="category.icon"></i>
                {{ category.label }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>正在加载商品...</p>
        </div>
        
        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button @click="fetchProducts">重试</button>
        </div>
        
        <!-- 搜索结果直接显示在搜索区域下方 -->
        <div v-if="searchQuery" class="search-results">
          <div class="results-header">
            <h3>搜索"<span class="search-query">{{ searchQuery }}</span>"的结果</h3>
            <button @click="clearSearch" class="clear-search-btn_qian">
              <i class="fas fa-times"></i> 清除搜索
            </button>
          </div>
          
          <div v-if="searchedProducts.length > 0" class="products-grid">
            <div v-for="product in searchedProducts" :key="product.id" class="product-item">
              <div class="product-image" :style="{ backgroundImage: `url(${getPlaceholderImage(product)})` }"></div>
              <div class="product-info">
                <div class="title-tags">
                    <h3 class="product-title">{{ product.name }}</h3>
                    <span v-if="isHotProduct(product)" class="hot-tag">热卖</span>
                    <span v-if="product.stock < 5" class="low-stock-tag">低库存</span>
                  </div>
                 <!-- 添加库存数量显示 -->
                <div class="stock-info">
                  <span>库存: </span>
                  <span :class="{ 'low-stock': product.stock < 5 }">{{ product.stock }}</span>
                  <span v-if="product.stock < 5" class="stock-warning"> (库存不足)</span>
                </div>
                <p class="description">{{ product.description }}</p>
                <div class="price-area">
                  <p class="price">¥{{ product.price }}</p>
                </div>
                <!-- 添加操作按钮区域 -->
                <div class="action-area">
                <button @click="editProduct(product)" class="edit-btn">
                    <i class="fas fa-edit"></i> 修改
                </button>
                <button @click="deleteProduct(product)" class="delete-btn">
                    <i class="fas fa-trash"></i> 删除
                </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="no-results">
            <i class="fas fa-search"></i>
            <p>没有找到匹配的商品</p>
            <button @click="clearSearch">查看全部商品</button>
          </div>
        </div>
        
        <!-- 没有搜索时显示常规内容 -->
        <div v-else>
          <!-- 热门推荐 -->
          <div id="hot-section" class="hot-section">
            <h3 class="section-title">热门推荐 <i class="fas fa-fire" style="color: #ff6b6b;"></i></h3>
            <div class="products-grid">
              <div v-for="product in hotProducts" :key="product.id" class="product-item">
                <div class="product-image" :style="{ backgroundImage: `url(${getPlaceholderImage(product)})` }"></div>
                <div class="product-info">
                  <div class="title-tags">
                    <h3 class="product-title">{{ product.name }}</h3>
                    <span v-if="isHotProduct(product)" class="hot-tag">热卖</span>
                     <!-- 添加库存显示 -->
                    <span v-if="product.stock < 5" class="low-stock-tag">低库存</span>
                  </div>
                   <!-- 添加库存数量显示 -->
                  <div class="stock-info">
                    <span>库存: </span>
                    <span :class="{ 'low-stock': product.stock < 5 }">{{ product.stock }}</span>
                    <span v-if="product.stock < 5" class="stock-warning"> (库存不足)</span>
                  </div>
                  <p class="description">{{ product.description }}</p>
                  <div class="price-area">
                    <p class="price">¥{{ product.price }}</p>
                  </div>
                  <!-- 添加操作按钮区域 -->
                <div class="action-area">
                <button @click="editProduct(product)" class="edit-btn">
                    <i class="fas fa-edit"></i> 修改
                </button>
                <button @click="deleteProduct(product)" class="delete-btn">
                    <i class="fas fa-trash"></i> 删除
                </button>
                </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 当前分类商品 -->
          <div id="category-products" class="category-products">
            <h3 class="section-title">{{ currentCategoryLabel }} <i :class="currentCategoryIcon"></i></h3>
            <div class="products-grid">
              <div v-for="product in filteredProducts" :key="product.id" class="product-item">
                <div class="product-image" :style="{ backgroundImage: `url(${getPlaceholderImage(product)})` }"></div>
                <div class="product-info">
                  <div class="title-tags">
                    <h3 class="product-title">{{ product.name }}</h3>
                    <span v-if="isHotProduct(product)" class="hot-tag">热卖</span>
                    <!-- 添加库存显示 -->
                    <span v-if="product.stock < 5" class="low-stock-tag">低库存</span>
                  </div>
                  <!-- 添加库存数量显示 -->
                  <div class="stock-info">
                    <span>库存: </span>
                    <span :class="{ 'low-stock': product.stock < 5 }">{{ product.stock }}</span>
                    <span v-if="product.stock < 5" class="stock-warning"> (库存不足)</span>
                  </div>
                  <p class="description">{{ product.description }}</p>
                  <div class="price-area">
                    <p class="price">¥{{ product.price }}</p>
                  </div>
                  <!-- 在商品项的价格区域下方添加操作按钮 -->
                    <div class="action-area">
                    <button @click="editProduct(product)" class="edit-btn">
                        <i class="fas fa-edit"></i> 修改
                    </button>
                    <button @click="deleteProduct(product)" class="delete-btn">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 添加商品视图 -->
      <div v-if="currentView === 'add-product'" class="add-product-view">
        <div class="add-product-container">
          <h2>
            <i class="fas" :class="isEditing ? 'fa-edit' : 'fa-plus-circle'"></i> 
            {{ isEditing ? '编辑商品' : '添加新商品' }}
          </h2>
          <div class="form-container_qian">
            <form @submit.prevent="submitProductForm" class="product-form">
              <div class="form-row">
                <div class="form-group_qian">
                  <label for="name">商品名称 *</label>
                  <input
                    type="text"
                    id="name"
                    v-model="newProduct.name"
                    required
                    placeholder="输入商品名称"
                  >
                </div>

                <div class="form-group_qian">
                  <label for="price">价格 (¥) *</label>
                  <input
                    type="number"
                    id="price"
                    v-model.number="newProduct.price"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                  >
                </div>
              </div>

              <div class="form-group_qian">
                <label for="description">商品描述 *</label>
                <textarea
                  id="description"
                  v-model="newProduct.description"
                  required
                  rows="3"
                  placeholder="输入商品详细描述"
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group_qian">
                  <label for="category">商品分类 *</label>
                  <select id="category" v-model="newProduct.category" required>
                    <option value="" disabled>选择分类</option>
                    <option value="medicine">药品/营养品</option>
                    <option value="consumables">消耗品</option>
                    <option value="toys">玩具零食</option>
                  </select>
                </div>

                <div class="form-group_qian">
                  <label for="stock">库存数量 *</label>
                  <input
                    type="number"
                    id="stock"
                    v-model.number="newProduct.stock"
                    min="0"
                    required
                    placeholder="0"
                  >
                </div>
              </div>

              <!-- 修改这里：将图片URL输入改为本地上传 -->
              <div class="form-group_qian full-width">
                <label>商品图片上传</label>
                <div class="upload-area_qian" @click="triggerUpload" :class="{ 'has-image': newProduct.imageUrl }">
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref="fileInput" 
                    @change="uploadProductImage"
                    class="file-input"
                  >
                  <div v-if="!newProduct.imageUrl" class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>点击上传商品图片</p>
                  </div>
                 <div v-else class="image-preview_qian">
                    <img :src="getFullImageUrl(newProduct.imageUrl)" alt="预览">
                    <button @click.stop="removeProductImage" class="remove-image-btn_qian">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group_qian checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="newProduct.isHot">
                  <span class="checkmark"></span>
                  标记为热卖商品
                </label>
              </div>

              <div class="form-actions_qian">
                <button type="button" @click="resetProductForm" class="btn-secondary">
                  <i class="fas fa-redo"></i> {{ isEditing ? '取消编辑' : '重置' }}
                </button>
                <button type="submit" :disabled="addingProduct" class="btn-primary">
                  <i class="fas" :class="isEditing ? 'fa-save' : 'fa-plus'"></i>
                  <i class="fas fa-spinner fa-spin" v-if="addingProduct"></i>
                  {{ addingProduct ? (isEditing ? '修改中...' : '添加中...') : (isEditing ? '修改商品' : '添加商品') }}
                </button>
              </div>
            </form>
          </div>

          <div v-if="productMessage" :class="['message', productMessageType]">
            <i :class="productMessageIcon"></i>
            <span>{{ productMessage }}</span>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 底部信息 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>爱宠健康商城</h3>
          <p>为您的宠物提供专业的医疗用品和健康解决方案</p>
          <div class="social-icons">
            <i class="fab fa-weixin"></i>
            <i class="fab fa-weibo"></i>
            <i class="fab fa-qq"></i>
          </div>
        </div>
        
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul>
            <li><i class="fas fa-chevron-right"></i> 商品分类</li>
            <li><i class="fas fa-chevron-right"></i> 促销活动</li>
            <li><i class="fas fa-chevron-right"></i> 会员中心</li>
            <li><i class="fas fa-chevron-right"></i> 宠物健康知识</li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>联系我们</h4>
          <ul>
            <li><i class="fas fa-phone"></i> 400-123-4567</li>
            <li><i class="fas fa-envelope"></i> contact@pet-hospital.com</li>
            <li><i class="fas fa-map-marker-alt"></i> 北京市朝阳区宠物医疗中心</li>
          </ul>
        </div>
      </div>
      
      <div class="copyright">
        © 2023 爱宠健康商城 版权所有 | 京ICP备12345678号
      </div>
    </footer>
    
    <!-- 通知消息 -->
    <transition name="slide-fade">
      <div v-if="showNotification" class="notification">
        <i class="fas fa-check-circle"></i> {{ notificationMessage }}
      </div>
    </transition>

    <!-- 低库存警告模态框 -->
    <div v-if="showLowStockWarning" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>库存警告</h3>
          <button @click="showLowStockWarning = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>以下商品库存不足，请及时补货：</p>
          <ul>
            <li v-for="product in lowStockProducts" :key="product.id">
              {{ product.name }} - 当前库存: {{ product.stock }}
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button @click="showLowStockWarning = false" class="confirm-btn">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from '@/config/index';
import axios from 'axios';
import { ref, onMounted, nextTick } from 'vue';

export default {
  setup() {
    const currentUserId = ref(null);
    const currentUsername = ref('');

     onMounted(() => { 
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUserId.value = user.userId || 1;
      currentUsername.value = user.username || '游客';
      
    });

    return {
      currentUserId,
      currentUsername
    };

  },
  data() {
    return {
      showLowStockWarning: false, // 控制低库存警告模态框显示
      lowStockProducts: [], // 存储低库存商品
      isEditing: false,
      currentView: 'products',
      currentCategory: 'all',
      showNotification: false,
      notificationMessage: '',
      searchQuery: '',
      loading: false,
      error: '',
      products: [],
      categories: [
        { value: 'all', label: '全部商品', icon: 'fas fa-box-open' },
        { value: 'medicine', label: '药品/营养品', icon: 'fas fa-pills' },
        { value: 'consumables', label: '消耗品', icon: 'fas fa-toilet-paper' },
        { value: 'toys', label: '玩具零食', icon: 'fas fa-baseball-ball' }
      ],

      // 新增商品相关数据
      newProduct: {
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        isHot: false,
        stock: 0
      },
      addingProduct: false,
      productMessage: '',
      productMessageType: '',
      productMessageIcon: ''
    }
  },
  computed: {
    filteredProducts() {
      if (this.currentCategory === 'all') return this.products
      return this.products.filter(p => p.category === this.currentCategory)
    },
    hotProducts() {
      return this.products.filter(p => p.hot==='是')
    },
    currentCategoryLabel() {
      const cat = this.categories.find(c => c.value === this.currentCategory)
      return cat ? cat.label : '所有商品'
    },
    currentCategoryIcon() {
      const cat = this.categories.find(c => c.value === this.currentCategory)
      return cat ? cat.icon : 'fas fa-box-open'
    },
    searchedProducts() {
      if (!this.searchQuery) return this.filteredProducts
      
      const query = this.searchQuery.toLowerCase().trim()
      return this.filteredProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      )
    },
    
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    // 添加图片上传相关方法
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    // 修复热卖标签判断逻辑
    isHotProduct(product) {
        return product.hot === '是';
    },
    
    async uploadProductImage(e) {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('isAvatar', true);

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/uploadImage`,
          formData,
          { 
            headers: { 
              'Content-Type': 'multipart/form-data'
            } 
          }
        );

        if (data.code === 200) {
         // 确保返回的是完整URL
          let imageUrl = data.data;
          if (!imageUrl.startsWith('http')) {
            imageUrl = `${API_BASE_URL}${imageUrl}`;
          }
          this.newProduct.imageUrl = imageUrl;
          console.log("商品图片上传成功", imageUrl);
        } else {
          console.error('上传失败:', data.msg);
          alert('图片上传失败: ' + data.msg);
        }
      } catch (err) {
        console.error('上传图片失败:', err);
        alert('图片上传失败，请检查网络连接');
      }
    },

    removeProductImage() {
      this.newProduct.imageUrl = '';
    },
    
    getFullImageUrl(url) {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return `${API_BASE_URL}${url}`;
    },

     // 检查低库存商品
    checkLowStock(products) {
      this.lowStockProducts = products.filter(product => product.stock < 5);
      
      // 如果有低库存商品，显示警告
      if (this.lowStockProducts.length > 0 && !this.showLowStockWarning) {
        // 延迟显示，避免界面加载时立即弹出
        setTimeout(() => {
          this.showLowStockWarning = true;
        }, 2000);
      }
    },
    // 更新商品库存
    async updateProductStock(productId, newStock) {
      try {
        // 首先获取商品的完整信息
        const product = this.products.find(p => p.productId === productId);
        if (!product) {
          console.error('未找到商品');
          return false;
        }
        
        // 更新库存信息
        const updatedProduct = {
          ...product,
          stock: newStock
        };
        
        // 调用更新接口
        const response = await axios.post(`${API_BASE_URL}/updateProduct`, updatedProduct);
        
        if (response.data.code === 200) {
          // 更新本地商品列表中的库存
          const index = this.products.findIndex(p => p.productId === productId);
          if (index !== -1) {
            this.products[index].stock = newStock;
          }
          return true;
        } else {
          console.error('更新库存失败:', response.data.msg);
          return false;
        }
      } catch (error) {
        console.error('更新库存失败:', error);
        return false;
      }
    },
    
    // 编辑商品
    editProduct(product) {
      // 切换到添加商品视图
      this.switchView('add-product');
      // 填充表单数据
      this.newProduct = {
        productId: product.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        isHot: product.hot === '是',
        stock: product.stock || 0
      };
      // 设置编辑模式标志
      this.isEditing = true;
    },

// 删除商品
deleteProduct(product) {
  if (confirm(`确定要删除【${product.name}】吗？此操作无法撤销！`)) {
    axios.post(`${API_BASE_URL}/deleteProduct`, null, {
      params: { productId: product.productId }
    })
    .then(res => {
      if (res.data.code === 200) {
        // 从商品列表中移除
        this.products = this.products.filter(p => p.productId !== product.productId);
        this.showNotification = true;
        this.notificationMessage = '商品已删除';
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
      } else {
        alert('删除失败: ' + res.data.msg);
      }
    })
    .catch(error => {
      console.error('删除商品失败:', error);
      alert('删除商品失败，请检查网络连接');
    });
  }
},
    // API请求方法
    fetchProducts() {
      this.loading = true;
      this.error = '';
        axios.get(`${API_BASE_URL}/getAllProducts`)
        .then((res) => {
          this.products = res.data.data;
          console.log("全部数据",res);
        })
        .catch((error) => {
          console.error('获取商品失败:', error);
          this.error = '获取商品列表失败，请稍后重试';
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // 修改提交表单的方法
 submitProductForm() {
    this.addingProduct = true;
    this.productMessage = '';
    
    const productData = {
      name: this.newProduct.name,
      description: this.newProduct.description,
      price: this.newProduct.price,
      category: this.newProduct.category,
      imageUrl: this.newProduct.imageUrl || this.getDefaultProductImage(),
      hot: this.newProduct.isHot ? '是' : '否',
      stock: this.newProduct.stock
    };
    
    // 如果是编辑模式，添加productId并使用更新API
    let url = `${API_BASE_URL}/addProduct`;
    let successMessage = '商品添加成功!';
    
    if (this.isEditing) {
      productData.productId = this.newProduct.productId;
      url = `${API_BASE_URL}/updateProduct`;
      successMessage = '商品更新成功!';
    }
    
    axios.post(url, productData)
      .then((res) => {
        this.showProductMessage(successMessage, 'success');
        this.resetProductForm();
        
        // 刷新商品列表
        this.fetchProducts();
        
        // 2秒后自动切换回商品列表
        setTimeout(() => {
          this.switchView('products');
        }, 2000);
      })
      .catch((error) => {
        console.error('操作失败:', error);
        const errorMsg = error.response?.data?.message || error.message;
        this.showProductMessage(`操作失败: ${errorMsg}`, 'error');
      })
      .finally(() => {
        this.addingProduct = false;
      });
  },
  
    
    resetProductForm() {
      this.newProduct = {
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        isHot: false,
        stock: 0
      };
      this.productMessage = '';
      this.isEditing = false;
    },
    
    getDefaultProductImage() {
      // 根据分类返回默认图片
      const defaultImages = {
        medicine: 'https://images.unsplash.com/photo-1593369196682-6d8ec9ff3ae0?auto=format&fit=crop&w=300&q=80',
        consumables: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80',
        toys: 'https://images.unsplash.com/photo-1559131397-f94da358a7b2?auto=format&fit=crop&w=300&q=80'
      };
      
      return defaultImages[this.newProduct.category] || 'https://via.placeholder.com/300';
    },
    
    showProductMessage(text, type) {
      this.productMessage = text;
      this.productMessageType = type;
      this.productMessageIcon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
      
      // 5秒后自动清除消息
      setTimeout(() => {
        this.productMessage = '';
      }, 5000);
    },

    selectCategory(category) {
      console.log('选择分类:', category);
      this.currentCategory = category;
      
      // 如果是"全部"分类，获取所有商品
      if (category === 'all') {
        this.fetchProducts();
        // 滚动到热门推荐区域
        this.$nextTick(() => {
          this.scrollToElement('#hot-section');
        });
        return;
      }
      
      // 否则调用分类API获取特定分类的商品
      this.loading = true;
      this.error = '';
      
      // 使用axios发送请求获取分类商品
      axios.get(`${API_BASE_URL}/getProductsByCategory`, {
        params: {
          category: category
        }
      })
      .then((res) => {
        // 假设返回数据结构与/products相同
        console.log('获取分类商品成功:', res.data)
        this.products = res.data.data;
        
        // 数据加载完成后滚动到对应区域
        this.$nextTick(() => {
          this.scrollToElement('#category-products');
        });
      })
      .catch((error) => {
        console.error('获取分类商品失败:', error);
        this.error = '获取分类商品失败，请稍后重试';
      })
      .finally(() => {
        this.loading = false;
      });
    },

    // 新增的滚动方法
    scrollToElement(selector) {
      const element = document.querySelector(selector);
      if (!element) return;
      
      // 获取元素位置
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      
      // 获取导航栏和分类容器的高度
      const header = document.querySelector('.header');
      const categoryContainer = document.querySelector('.category-container');
      
      const headerHeight = header ? header.offsetHeight : 0;
      const categoryContainerHeight = categoryContainer ? categoryContainer.offsetHeight : 0;
      
      // 计算滚动位置（元素顶部减去导航栏和分类容器的高度，再加上一些额外间距）
      const offsetPosition = absoluteElementTop - headerHeight - categoryContainerHeight - 70;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    },
    getPlaceholderImage(product) {
      if (product.imageUrl) {
        return product.imageUrl;
      }
      const images = {
        medicine: 'https://images.unsplash.com/photo-1593369196682-6d8ec9ff3ae0?auto=format&fit=crop&w=300&q=80',
        consumables: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80',
        toys: 'https://images.unsplash.com/photo-1559131397-f94da358a7b2?auto=format&fit=crop&w=300&q=80'
      }
      return images[product.category] || 'https://via.placeholder.com/300'
    },
    
    // 在methods中添加
    performSearch() {
      // 强制重新计算搜索结果的显示
      this.$nextTick(() => {
        // 确保搜索结果区域显示
        if (this.searchQuery.trim()) {
          // 如果有搜索词，滚动到搜索结果区域
          const searchResults = document.querySelector('.search-results');
          if (searchResults) {
            searchResults.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    },
    
    clearSearch() {
      this.searchQuery = ''
    },
    
    switchView(view) {
      if (view !== 'add-product') {
      this.isEditing = false;
      this.resetProductForm();
    }
      this.searchQuery = '';
      this.currentView = view;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  watch: {
     // 监听商品列表变化，检查低库存情况
    products: {
      handler(newProducts) {
        this.checkLowStock(newProducts);
      },
      deep: true
    },
  },
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

/* 添加上传区域样式 */
.upload-area_qian {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
}

.upload-area_qian:hover {
  border-color: #42b983;
}

.upload-area_qian.has-image {
  border-style: solid;
  padding: 0;
}

.file-input {
  display: none;
}

.upload-placeholder {
  color: #999;
}

.upload-placeholder i {
  font-size: 2rem;
  margin-bottom: 10px;
}

.upload-area_qian .image-preview_qian {
  position: relative;
}

.upload-area_qian .image-preview_qian img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
}

.remove-image-btn_qian {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: #ff6b6b;
}

.full-width {
  width: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #42b983;
  --primary-dark: #359c70;
  --primary-light: #6bc9a1;
  --secondary: #0072bc;
  --secondary-dark: #005a94;
  --accent: #ff6b6b;
  --accent-dark: #e55a5a;
  --light: #f8f9fa;
  --dark: #2c3e50;
  --gray: #6c757d;
  --light-gray: #e9ecef;
  --border: #dee2e6;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 6px 16px rgba(0, 0, 0, 0.12);
  --radius: 12px;
  --radius-sm: 8px;
  --transition: all 0.3s ease;
}

body {
  font-family: 'Noto Sans SC', sans-serif;
  background-color: #f5f9f7;
  color: var(--dark);
  line-height: 1.6;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
}

.logo_qian {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo_qian h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.logo_qian i {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clinic-info {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
}

.clinic-info i {
  margin-right: 5px;
}
/* 新添加的样式 */
.title-tags {
  display: inline-block; /* 改为行内块 */
  margin-bottom: 5px;
  line-height: 1.2;
}

.title-tags h3 {
  margin-bottom: 0;
  flex: 1;
  font-size: 1.1rem;
}

.tags {
  margin-left: auto;
}
.product-title {
  display: inline; /* 改为行内元素 */
  margin: 0;
  font-size: 1.1rem;
  padding-right: 4px; /* 用内边距替代间距 */
  vertical-align: middle; /* 确保垂直对齐 */
}
.hot-tag {
   background: var(--accent);
  color: white;
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: 30px;
  display: inline; /* 标签也改为行内元素 */
  vertical-align: middle; /* 确保垂直对齐 */
  line-height: 1.4;
  position: relative;
  top: -1px; /* 微调垂直位置 */
}
/* 添加分类容器的固定样式 */
.category-container {
  position: sticky;
  top: 140px; /* 调整这个值，使其等于header的高度 */
  z-index: 50;
  margin: 20px 0;
}

.main-nav {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  padding: 0 5%;
}

.main-nav button {
  background: none;
  border: none;
  color: white;
  padding: 15px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-nav button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-nav button.active {
  background: rgba(255, 255, 255, 0.25);
}

.main-nav button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: white;
}

.cart-btn {
  position: relative;
}

.badge {
  background: var(--accent);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

/* 主内容区 */
.main-content_qian {
  flex: 1;
  padding: 20px 5%;
}

/* 合并的横幅和搜索框 */
.banner-with-search {
  background: linear-gradient(rgba(66, 185, 131, 0.85), rgba(0, 114, 188, 0.85)), 
              url('https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  border-radius: var(--radius);
  padding: 30px 40px;
  margin-bottom: 20px;
  color: white;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.banner-text {
  flex: 1;
  max-width: 50%;
  text-align: left;
}

.banner-text h2 {
  font-size: 2.2rem;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.banner-text p {
  font-size: 1.1rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.search-box_qian {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.search-box_qian input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  font-size: 1.1rem;
}

.search-box_qian .clear-btn {
  background: var(--light-gray);
  color: var(--gray);
  padding: 0 15px;
  border: none;
  cursor: pointer;
}

.search-box_qian .clear-btn:hover {
  background: #dcdcdc;
}

.search-box_qian button:last-child {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0 25px;
  cursor: pointer;
  transition: var(--transition);
}

.search-box_qian button:last-child:hover {
  background: var(--accent-dark);
}

/* 分类容器固定在顶部 */
.category-container {
  position: sticky;
  top: 140px; /* 调整这个值，使其等于header的高度 */
  z-index: 50;
  margin: 20px 0;
}

/* 商品分类 */
.category-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius);
  padding: 15px 20px;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--dark);
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--primary);
  border-radius: 3px;
}

.category-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.category-btn {
  background: white;
  border: 2px solid var(--light-gray);
  border-radius: 50px;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  box-shadow: var(--shadow);
}

.category-btn:hover, .category-btn.active {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  color: white;
  border-color: transparent;
  transform: translateY(-3px);
}

.category-btn i {
  font-size: 1.2rem;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.product-item {
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(66, 185, 131, 0.1);
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(66, 185, 131, 0.3);
}

.product-image {
  height: 180px;
  background-size: cover;
  background-position: center;
}

.product-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-info h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--dark);
}

.description {
  color: var(--gray);
  font-size: 0.9rem;
  margin-bottom: 15px;
  flex: 1;
}

.price-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
}

.add-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  font-weight: 500;
}

.add-btn:hover {
  background: var(--primary-dark);
  transform: scale(1.05);
}

.tags {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.prescription-tag {
  background: var(--secondary);
  color: white;
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 30px;
}

.hot-tag {
  background: var(--accent);
  color: white;
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 30px;
}

/* 无搜索结果提示 */
.no-results {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin: 30px 0;
}

.no-results i {
  font-size: 3rem;
  color: var(--light-gray);
  margin-bottom: 20px;
}

.no-results p {
  margin-bottom: 20px;
  color: var(--gray);
}

.no-results button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.no-results button:hover {
  background: var(--primary-dark);
}

/* 购物车样式 */
.cart-view, .checkout-view {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.cart-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  color: var(--dark);
}

.continue-btn {
  background: var(--light-gray);
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.continue-btn:hover {
  background: #d8d8d8;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.empty-icon_qian {
  font-size: 4rem;
  color: var(--light-gray);
  margin-bottom: 20px;
}

.empty-cart p {
  margin-bottom: 10px;
  color: var(--gray);
}

.empty-cart button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: var(--transition);
}

.empty-cart button:hover {
  background: var(--primary-dark);
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}

.cart-items {
  background: white;
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.cart-item {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-sm);
  background-size: cover;
  background-position: center;
  margin-right: 20px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.item-meta .price {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary);
}

.item-actions {
  display: flex;
  justify-content: space-between;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.quantity-control button {
  background: var(--light);
  border: none;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: var(--transition);
}

.quantity-control button:hover {
  background: var(--primary-light);
  color: white;
}

.quantity-control input {
  width: 50px;
  height: 36px;
  border: none;
  text-align: center;
  font-size: 1rem;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

.remove-btn {
  background: #f8f9fa;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray);
  transition: var(--transition);
}

.remove-btn:hover {
  background: #f1f3f5;
  color: var(--accent);
}

.cart-summary {
  background: white;
  border-radius: var(--radius);
  padding: 25px;
  box-shadow: var(--shadow);
  align-self: flex-start;
  position: sticky;
  top: 100px;
  border: 2px solid var(--primary-light);
}

.summary-card h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border);
  color: var(--dark);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.summary-row.discount {
  color: var(--accent);
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.2rem;
  border-top: 1px solid var(--border);
  margin-top: 10px;
  padding-top: 15px;
  color: var(--secondary);
}


.checkout-btn {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  color: white;
  border: none;
  width: 100%;
  padding: 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.3);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(66, 185, 131, 0.4);
}

/* 结算页面样式 */
.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.checkout-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  color: var(--dark);
}

.back-btn {
  background: var(--light-gray);
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.back-btn:hover {
  background: #d8d8d8;
}

.checkout-steps {
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto 40px;
  position: relative;
}

.checkout-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 3px;
  background: var(--light-gray);
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--light-gray);
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 10px;
  transition: var(--transition);
}

.step-title {
  color: var(--gray);
  font-weight: 500;
  transition: var(--transition);
}

.step.active .step-number {
  background: var(--primary);
  color: white;
}

.step.active .step-title {
  color: var(--dark);
  font-weight: 600;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.order-section, .payment-section {
  background: white;
  border-radius: var(--radius);
  padding: 25px;
  box-shadow: var(--shadow);
}

.order-section h3, .payment-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border);
  color: var(--dark);
}

.order-items {
  margin-bottom: 25px;
}

.order-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);
  align-items: center;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item .item-image {
  width: 70px;
  height: 70px;
  border-radius: var(--radius-sm);
  margin-right: 15px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 1rem;
  margin-bottom: 5px;
}

.item-info p {
  font-size: 0.9rem;
  color: var(--gray);
}

.item-price {
  font-weight: 600;
  color: var(--primary);
}

.order-total {
  background: #f8f9fa;
  border-radius: var(--radius-sm);
  padding: 15px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.grand-total {
  font-weight: 700;
  font-size: 1.1rem;
  border-top: 1px solid var(--border);
  margin-top: 5px;
  padding-top: 12px;
  color: var(--secondary);
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.payment-card {
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-sm);
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: var(--transition);
}

.payment-card:hover {
  border-color: var(--primary);
}

.payment-card.selected {
  border-color: var(--primary);
  background: rgba(66, 185, 131, 0.05);
}

.payment-icon {
  width: 50px;
  height: 50px;
  background: rgba(66, 185, 131, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.payment-icon i {
  font-size: 1.8rem;
  color: var(--primary);
}

.payment-info {
  flex: 1;
}

.payment-info h4 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.payment-info p {
  font-size: 0.9rem;
  color: var(--gray);
}

.payment-selector {
  width: 24px;
  height: 24px;
  border: 2px solid var(--light-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-selector {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.radio-selector.selected {
  opacity: 1;
}

.radio-selector i {
  color: white;
  font-size: 0.7rem;
}

.prescription-notice {
  background: rgba(0, 114, 188, 0.08);
  border: 1px solid var(--secondary);
  border-radius: var(--radius-sm);
  padding: 15px;
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.prescription-notice i {
  color: var(--secondary);
  font-size: 1.2rem;
}

.prescription-notice p {
  color: var(--secondary-dark);
}

.pay-now-btn {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  color: white;
  border: none;
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
}

.pay-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.4);
}

/* 浮动购物车 */
.floating-cart {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 999;
  transition: var(--transition);
}

.floating-cart:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent);
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

/* 通知 */
.notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(-50%) translateY(30px);
  opacity: 0;
}

/* 页脚样式 */
.footer {
  background: var(--dark);
  color: white;
  padding: 50px 5% 20px;
  margin-top: 50px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: white;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #f8f9fa;
}

.footer-section p {
  color: #adb5bd;
  margin-bottom: 20px;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icons i {
  font-size: 1.5rem;
  color: #adb5bd;
  transition: var(--transition);
}

.social-icons i:hover {
  color: var(--primary);
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #adb5bd;
  transition: var(--transition);
  cursor: pointer;
}

.footer-section ul li:hover {
  color: var(--primary);
}

.footer-section ul li i {
  font-size: 0.8rem;
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #495057;
  color: #6c757d;
  font-size: 0.9rem;
}

/* 搜索结果区域样式 */
.search-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border);
}

.results-header h3 {
  font-size: 1.3rem;
  color: var(--dark);
  display: flex;
  align-items: center;
}

.search-query {
  color: var(--primary);
  font-weight: bold;
  margin: 0 5px;
}

.clear-search-btn_qian {
  background: var(--light-gray);
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 5px;
}

.clear-search-btn_qian:hover {
  background: #d8d8d8;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .cart-content, .checkout-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .logo-area {
    flex-direction: column;
    gap: 15px;
  }
  
  .clinic-info {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  
  .main-nav {
    flex-wrap: wrap;
  }
  
  .banner-with-search {
    padding: 20px;
  }
  
  .banner-text h2 {
    font-size: 1.8rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .category-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .category-btn {
    padding: 10px 20px;
  }

  .category-container {
    top: 160px; /* 移动端调整顶部位置 */
  }
}

@media (max-width: 576px) {
  .main-nav button {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 150px;
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .checkout-steps {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .checkout-steps::before {
    display: none;
  }
  
  .step {
    flex-direction: row;
    gap: 15px;
    align-items: center;
  }
  
  .step-number {
    margin-bottom: 0;
  }
  
  .banner-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .banner-text {
    max-width: 100%;
    text-align: center;
  }
  
  .search-box_qian {
    width: 100%;
  }

  .category-container {
    top: 180px; /* 小屏幕调整顶部位置 */
  }
}







/* 新增商品视图样式 */
.add-product-view {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.add-product-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 25px;
  margin-top: 20px;
}

.add-product-container h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.form-container_qian {
  margin-bottom: 20px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group_qian {
  flex: 1;
}

.form-group_qian {
  display: flex;
  flex-direction: column;
}

.form-group_qian label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.form-group_qian input,
.form-group_qian select,
.form-group_qian textarea {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group_qian input:focus,
.form-group_qian select:focus,
.form-group_qian textarea:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.3s;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background-color: #42b983;
  border-color: #42b983;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.image-preview_qian {
  margin-top: 10px;
  text-align: center;
}

.image-preview_qian img {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.image-preview_qian p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.form-actions_qian {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-primary, .btn-secondary {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #42b983, #0072bc);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

.message {
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.message.success {
  background: #e9f9ee;
  color: #2ecc71;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #fdecea;
  color: #e74c3c;
  border: 1px solid #f5c6cb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .form-actions_qian {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
.coupon-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.coupon-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.coupon-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.coupon-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  padding: 5px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.coupon-modal-body {
  padding: 0;
  flex: 1;
  overflow-y: auto;
}

.coupon-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 0 24px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 0.95rem;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #42b983;
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #42b983;
  border-radius: 3px 3px 0 0;
}

.coupon-loading, .no-coupons {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.coupon-loading i {
  font-size: 2rem;
  margin-bottom: 15px;
  display: block;
  color: #42b983;
}

.no-coupons i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
  opacity: 0.5;
}

.coupons-container {
  padding: 16px 24px;
}

.coupon-card {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s;
  background: white;
}

.coupon-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.coupon-card.selected {
  border-color: #42b983;
  box-shadow: 0 4px 16px rgba(66, 185, 131, 0.2);
}

.coupon-card.unavailable {
  opacity: 0.7;
}

.coupon-left {
  background: linear-gradient(135deg, #42b983, #359c70);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  position: relative;
  overflow: hidden;
}

.coupon-card.unavailable .coupon-left {
  background: linear-gradient(135deg, #bdc3c7, #95a5a6);
}

.coupon-left::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: -5px;
  width: 10px;
  background: white;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}

.coupon-value {
  text-align: center;
}

.coupon-value span:first-child {
  font-size: 1.8rem;
  font-weight: 700;
  display: block;
  line-height: 1;
}

.off-text {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.coupon-content {
  padding: 16px;
  flex: 1;
}

.coupon-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.coupon-desc {
  margin: 0 0 6px 0;
  font-size: 0.9rem;
  color: #666;
}

.coupon-validity {
  margin: 0;
  font-size: 0.8rem;
  color: #999;
}

.coupon-actions {
  padding: 16px;
  display: flex;
  align-items: center;
}

.apply-coupon-btn {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.apply-coupon-btn:hover {
  background: #359c70;
  transform: translateY(-1px);
}

.apply-coupon-btn.applied {
  background: #95a5a6;
}

.not-applicable {
  color: #999;
  font-size: 0.85rem;
}

.coupon-modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  text-align: right;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 优惠券选择按钮样式 */
.coupon-select-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
  margin: 10px 0;
  width:100%;
  justify-content: center;
}

.coupon-select-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(106, 17,rgba(136, 203, 99, 1).4);
  background: linear-gradient(135deg, #5a0db9 0%, #1c67e3 100%);
}

.coupon-select-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(106, 17, 203, 0.3);
}

/* 已选优惠券显示样式 */
.selected-coupon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 10px 0;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.selected-coupon span {
  font-weight: 600;
}

.remove-coupon-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-coupon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}



/* 响应式设计 */
@media (max-width: 576px) {
  .coupon-modal-overlay {
    padding: 10px;
  }
  
  .coupon-modal {
    border-radius: 12px;
  }
  
  .coupon-modal-header {
    padding: 16px;
  }
  
  .coupon-tabs {
    padding: 0 16px;
  }
  
  .coupons-container {
    padding: 12px 16px;
  }
  
  .coupon-card {
    flex-direction: column;
  }
  
  .coupon-left {
    min-width: auto;
    padding: 12px;
  }
  
  .coupon-left::before {
    display: none;
  }
  
  .coupon-content {
    padding: 12px;
  }
  
  .coupon-actions {
    padding: 12px;
    justify-content: center;
    border-top: 1px dashed #eee;
  }
}
.action-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.edit-btn {
  background: #ffc107;
  color: #000;
}

.edit-btn:hover {
  background: #e0a800;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}


/* 添加库存相关样式 */
.stock-info {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #666;
}

.low-stock {
  color: #e74c3c;
  font-weight: bold;
}

.stock-warning {
  color: #e74c3c;
  font-size: 0.8rem;
}

.low-stock-tag {
  background: #e74c3c;
  color: white;
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: 30px;
  display: inline;
  vertical-align: middle;
  line-height: 1.4;
  margin-left: 5px;
}

.disabled-btn {
  background: #ccc !important;
  cursor: not-allowed !important;
}

.disabled-btn:hover {
  transform: none !important;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #e74c3c;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.modal-body ul {
  list-style: none;
  padding: 0;
  margin: 15px 0 0 0;
}

.modal-body li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.modal-body li:last-child {
  border-bottom: none;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.confirm-btn {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  cursor: pointer;
  font-size: 1rem;
}

.confirm-btn:hover {
  background: #359c70;
}
</style>