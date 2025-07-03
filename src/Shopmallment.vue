<template>
    <div id="app">
      <!-- 顶部导航栏 -->
      <header class="header">
        <div class="logo-area">
          <div class="logo">
            <i class="fas fa-paw"></i>
            <h1>爱宠健康商城</h1>
          </div>
          <div class="clinic-info">
            <p><i class="fas fa-map-marker-alt"></i> 北京市朝阳区宠物医疗中心</p>
            <p><i class="fas fa-clock"></i> 营业时间: 9:00-21:00</p>
          </div>
        </div>
        <button @click="tiaozhuan">跳转</button> 
        <nav class="main-nav">
          <button 
            @click="switchView('products')" 
            :class="{ active: currentView === 'products' }"
          >
            <i class="fas fa-shopping-bag"></i>
   商品列表
          </button>
          <button 
            @click="switchView('cart')" 
            :class="{ active: currentView === 'cart' }"
            class="cart-btn"
          >
            <i class="fas fa-shopping-cart"></i> 
            购物车 
  <span class="badge">{{ cartItemCount }}</span>
          </button>
          <button 
            @click="switchView('appointment')"
            :class="{ active: currentView === 'appointment' }"
          >
            <i class="fas fa-calendar-check"></i>
   预约复诊
          </button>
        </nav>
      </header>
  
      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 商品列表视图 -->
        <div v-if="currentView === 'products'" class="product-view">
          <!-- 横幅区域 - 左右布局 -->
          <div class="banner-with-search">
            <div class="banner-content">
              <!-- 左侧文本 -->
              <div class="banner-text">
                <h2>为您的爱宠提供专业医疗用品</h2>
                <p>处方药、营养品、宠物用品一站式购买</p>
              </div>
              
              <!-- 右侧搜索框 -->
              <div class="search-box">
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
          
          <!-- 搜索结果直接显示在搜索区域下方 -->
          <div v-if="searchQuery" class="search-results">
            
            
            <div v-if="searchedProducts.length > 0" class="products-grid">
              <div v-for="product in searchedProducts" :key="product.id" class="product-item">
                <div class="product-image" :style="{ backgroundImage: `url(${getPlaceholderImage(product)})` }"></div>
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <div class="tags">
                    <span v-if="product.prescription" class="prescription-tag">需处方</span>
                    <span v-if="product.hot" class="hot-tag">热卖</span>
                  </div>
                  <p class="description">{{ product.description }}</p>
                  <div class="price-area">
                    <p class="price">¥{{ product.price }}</p>
                    <button @click="addToCart(product)" class="add-btn">
                      <i class="fas fa-cart-plus"></i>
   加入购物车
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
                    <h3>{{ product.name }}</h3>
                    <div class="tags">
                      <span v-if="product.prescription" class="prescription-tag">需处方</span>
                      <span v-if="product.hot" class="hot-tag">热卖</span>
                    </div>
                    <p class="description">{{ product.description }}</p>
                    <div class="price-area">
                      <p class="price">¥{{ product.price }}</p>
                      <button @click="addToCart(product)" class="add-btn">
                        <i class="fas fa-cart-plus"></i>
   加入购物车
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
                    <h3>{{ product.name }}</h3>
                    <div class="tags">
                      <span v-if="product.prescription" class="prescription-tag">需处方</span>
                      <span v-if="product.hot" class="hot-tag">热卖</span>
                    </div>
                    <p class="description">{{ product.description }}</p>
                    <div class="price-area">
                      <p class="price">¥{{ product.price }}</p>
                      <button @click="addToCart(product)" class="add-btn">
                        <i class="fas fa-cart-plus"></i>
   加入购物车
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 购物车视图 -->
        <div v-if="currentView === 'cart'" class="cart-view">
          <div class="cart-container">
            <div class="cart-header">
              <h2><i class="fas fa-shopping-cart"></i> 我的购物车</h2>
              <button @click="switchView('products')" class="continue-btn">
                <i class="fas fa-arrow-left"></i> 继续购物
              </button>
            </div>
            
            <div v-if="cart.length === 0" class="empty-cart">
              <div class="empty-icon">
                <i class="fas fa-cart-arrow-down"></i>
              </div>
              <p>您的购物车还是空的</p>
              <p>快去挑选一些宠物用品吧！</p>
              <button @click="switchView('products')">浏览商品</button>
            </div>
            
            <div v-else class="cart-content">
              <div class="cart-items">
                <div v-for="item in cart" :key="item.id" class="cart-item">
                  <div class="item-image" :style="{ backgroundImage: `url(${getPlaceholderImage(item)})` }"></div>
                  <div class="item-details">
                    <h3>{{ item.name }}</h3>
                    <div class="item-meta">
                      <p class="price">¥{{ item.price }}/件</p>
                      <div class="tags">
                        <span v-if="item.prescription" class="prescription-tag">需处方</span>
                      </div>
                    </div>
                    <div class="item-actions">
                      <div class="quantity-control">
                        <button @click="updateQuantity({ id: item.id, quantity: item.quantity - 1 })">
                          <i class="fas fa-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          v-model.number="item.quantity"
                          @change="updateQuantity({ id: item.id, quantity: item.quantity })"
                        >
                        <button @click="updateQuantity({ id: item.id, quantity: item.quantity + 1 })">
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                      <button @click="removeItem(item.id)" class="remove-btn">
                        <i class="fas fa-trash"></i> 删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="cart-summary">
                <div class="summary-card">
                  <h3>订单摘要</h3>
                  <div class="summary-row">
                    <span>商品数量</span>
                    <span>{{ cartItemCount }} 件</span>
                  </div>
                  <div class="summary-row">
                    <span>商品总价</span>
                    <span>¥{{ cartTotal }}</span>
                  </div>
                  <div class="summary-row discount">
                    <span>优惠折扣</span>
                    <span>-¥{{ discountAmount }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>应付总额</span>
                    <span>¥{{ cartTotal - discountAmount }}</span>
                  </div>
                  
                  <div class="coupon-area">
                    <input type="text" placeholder="输入优惠码" v-model="couponCode">
                    <button @click="applyCoupon">应用</button>
                  </div>
                  
                  <button @click="switchView('checkout')" class="checkout-btn">
                    去结算 <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 结算视图 -->
        <div v-if="currentView === 'checkout'" class="checkout-view">
          <div class="checkout-container">
            <div class="checkout-header">
              <h2><i class="fas fa-cash-register"></i> 结算订单</h2>
              <button @click="switchView('cart')" class="back-btn">
                <i class="fas fa-arrow-left"></i> 返回购物车
              </button>
            </div>
            
            <div class="checkout-steps">
              <div class="step active">
                <div class="step-number">1</div>
                <div class="step-title">确认订单</div>
              </div>
              <div class="step active">
                <div class="step-number">2</div>
                <div class="step-title">支付方式</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-title">完成支付</div>
              </div>
            </div>
            
            <div class="checkout-content">
              <div class="order-section">
                <h3><i class="fas fa-clipboard-list"></i> 订单详情</h3>
                <div class="order-items">
                  <div v-for="item in cart" :key="item.id" class="order-item">
                    <div class="item-image" :style="{ backgroundImage: `url(${getPlaceholderImage(item)})` }"></div>
                    <div class="item-info">
                      <h4>{{ item.name }}</h4>
                      <p>¥{{ item.price }} × {{ item.quantity }}</p>
                    </div>
                    <div class="item-price">¥{{ item.price * item.quantity }}</div>
                  </div>
                </div>
                
                <div class="order-total">
                  <div class="total-row">
                    <span>商品总价:</span>
                    <span>¥{{ cartTotal }}</span>
                  </div>
                  <div class="total-row">
                    <span>优惠折扣:</span>
                    <span>-¥{{ discountAmount }}</span>
                  </div>
                  <div class="total-row grand-total">
                    <span>应付总额:</span>
                    <span>¥{{ cartTotal - discountAmount }}</span>
                  </div>
                </div>
              </div>
              
              <div class="payment-section">
                <h3><i class="fas fa-credit-card"></i> 选择支付方式</h3>
                <div class="payment-options">
                  <div 
                    v-for="method in paymentMethods" 
                    :key="method.id"
                    @click="selectedPayment = method.id"
                    :class="['payment-card', { selected: selectedPayment === method.id }]"
                  >
                    <div class="payment-icon">
                      <i :class="method.icon"></i>
                    </div>
                    <div class="payment-info">
                      <h4>{{ method.name }}</h4>
                      <p>{{ method.description }}</p>
                    </div>
                    <div class="payment-selector">
                      <div class="radio-selector" :class="{ selected: selectedPayment === method.id }">
                        <i class="fas fa-check"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="prescription-notice" v-if="hasPrescriptionItems">
                  <i class="fas fa-exclamation-circle"></i>
                  <p>您的订单包含处方药品，请确保您已获得兽医处方</p>
                </div>
                
                <button @click="submitPayment" class="pay-now-btn">
                  <i class="fas fa-lock"></i> 立即支付 ¥{{ cartTotal - discountAmount }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 预约视图 -->
        <div v-if="currentView === 'appointment'" class="appointment-view">
          <div class="appointment-container">
            <h2><i class="fas fa-calendar-check"></i> 预约复诊</h2>
            <div class="appointment-card">
              <div class="doctor-info">
                <div class="doctor-avatar">
                  <i class="fas fa-user-md"></i>
                </div>
                <div class="doctor-details">
                  <h3>张医生</h3>
                  <p>宠物内科专家</p>
                  <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>4.8 (256评价)</span>
                  </div>
                </div>
              </div>
              
              <div class="appointment-form">
                <div class="form-group">
                  <label><i class="fas fa-paw"></i> 宠物信息</label>
                  <input type="text" placeholder="宠物姓名">
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-calendar-day"></i> 预约日期</label>
                  <input type="date" placeholder="选择日期">
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-clock"></i> 预约时间</label>
                  <select>
                    <option>09:00 - 10:00</option>
                    <option>10:00 - 11:00</option>
                    <option>11:00 - 12:00</option>
                    <option>14:00 - 15:00</option>
                    <option>15:00 - 16:00</option>
                    <option>16:00 - 17:00</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-stethoscope"></i> 复诊原因</label>
                  <textarea placeholder="请描述宠物的症状或复诊原因"></textarea>
                </div>
                
                <button class="submit-appointment">
                  <i class="fas fa-calendar-check"></i> 提交预约
                </button>
              </div>
            </div>
            
            <div class="appointment-notice">
              <i class="fas fa-info-circle"></i>
              <p>预约复诊后可凭处方直接在线购买所需药品，享受会员折扣</p>
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
      
      <!-- 购物车浮动按钮 -->
      <div class="floating-cart" @click="switchView('cart')">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">{{ cartItemCount }}</span>
      </div>
      
      <!-- 通知消息 -->
      <transition name="slide-fade">
        <div v-if="showNotification" class="notification">
          <i class="fas fa-check-circle"></i> {{ notificationMessage }}
        </div>
      </transition>
    </div>
  </template>
<script>
  export default {
    data() {
      return {
        currentView: 'products',
        currentCategory: 'all',
        cart: [],
        couponCode: '',
        discountAmount: 0,
        selectedPayment: 'wechat',
        showNotification: false,
        notificationMessage: '',
        searchQuery: '', // 搜索查询词
        products: [
          // 药品/营养品
          { 
            id: 1, 
            name: '体内驱虫药', 
            price: 85, 
            category: 'medicine', 
            prescription: true, 
            description: '有效驱除宠物体内寄生虫，每月一次',
            hot: true
          },
          { 
            id: 2, 
            name: '体外驱虫滴剂', 
            price: 120, 
            category: 'medicine', 
            prescription: true, 
            description: '预防跳蚤、蜱虫等体外寄生虫',
            hot: true
          },
          { 
            id: 3, 
            name: '处方猫粮', 
            price: 280, 
            category: 'medicine', 
            prescription: true, 
            description: '针对泌尿系统问题设计的处方粮'
          },
          { 
            id: 4, 
            name: '宠物维生素', 
            price: 95, 
            category: 'medicine', 
            prescription: false, 
            description: '全面补充宠物所需维生素和矿物质'
          },
          { 
            id: 5, 
            name: '关节保健片', 
            price: 150, 
            category: 'medicine', 
            prescription: false, 
            description: '缓解关节疼痛，改善活动能力',
            hot: true
          },
          
          // 消耗品
          { 
            id: 6, 
            name: '吸水尿垫', 
            price: 45, 
            category: 'consumables', 
            prescription: false, 
            description: '超强吸收，防漏防渗透',
            hot: true
          },
          { 
            id: 7, 
            name: '豆腐猫砂', 
            price: 65, 
            category: 'consumables', 
            prescription: false, 
            description: '环保可冲马桶，结团迅速'
          },
          { 
            id: 8, 
            name: '宠物湿巾', 
            price: 25, 
            category: 'consumables', 
            prescription: false, 
            description: '温和清洁，不含酒精'
          },
          { 
            id: 9, 
            name: '宠物尿裤', 
            price: 38, 
            category: 'consumables', 
            prescription: false, 
            description: '防漏设计，舒适透气'
          },
          
          // 玩具零食
          { 
            id: 10, 
            name: '磨牙玩具', 
            price: 35, 
            category: 'toys', 
            prescription: false, 
            description: '帮助清洁牙齿，缓解焦虑',
            hot: true
          },
          { 
            id: 11, 
            name: '鸡肉零食', 
            price: 30, 
            category: 'toys', 
            prescription: false, 
            description: '高蛋白低脂肪，训练奖励'
          },
          { 
            id: 12, 
            name: '逗猫棒套装', 
            price: 50, 
            category: 'toys', 
            prescription: false, 
            description: '多种配件，激发猫咪捕猎本能'
          },
          { 
            id: 13, 
            name: '智能喂食器', 
            price: 350, 
            category: 'toys', 
            prescription: false, 
            description: '定时定量喂食，手机远程控制',
            hot: true
          }
        ],
        categories: [
          { value: 'all', label: '全部商品', icon: 'fas fa-box-open' },
          { value: 'medicine', label: '药品/营养品', icon: 'fas fa-pills' },
          { value: 'consumables', label: '消耗品', icon: 'fas fa-toilet-paper' },
          { value: 'toys', label: '玩具零食', icon: 'fas fa-baseball-ball' }
        ],
        paymentMethods: [
          { 
            id: 'wechat', 
            name: '微信支付', 
            icon: 'fab fa-weixin', 
            description: '推荐使用，支付即时到账' 
          },
          { 
            id: 'alipay', 
            name: '支付宝', 
            icon: 'fab fa-alipay', 
            description: '安全便捷的支付方式' 
          },
          { 
            id: 'card', 
            name: '银行卡支付', 
            icon: 'fas fa-credit-card', 
            description: '支持所有主流银行' 
          },
          { 
            id: 'cash', 
            name: '到店支付', 
            icon: 'fas fa-money-bill-wave', 
            description: '就诊时现场支付' 
          }
        ]
      }
    },
    computed: {
      cartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0)
      },
      filteredProducts() {
        if (this.currentCategory === 'all') return this.products
        return this.products.filter(p => p.category === this.currentCategory)
      },
      hotProducts() {
        return this.products.filter(p => p.hot)
      },
      cartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      hasPrescriptionItems() {
        return this.cart.some(item => item.prescription)
      },
      currentCategoryLabel() {
        const cat = this.categories.find(c => c.value === this.currentCategory)
        return cat ? cat.label : '所有商品'
      },
      currentCategoryIcon() {
        const cat = this.categories.find(c => c.value === this.currentCategory)
        return cat ? cat.icon : 'fas fa-box-open'
      },
      // 搜索过滤后的商品
      searchedProducts() {
        if (!this.searchQuery) return this.filteredProducts
        
        const query = this.searchQuery.toLowerCase().trim()
        return this.filteredProducts.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        )
      },
      tiaozhuan(){
        return this.$router.push({path:'/'})
      }
    },
    methods: {
      // 切换视图并滚动到顶部
      switchView(view) {
        this.currentView = view
        // 滚动到页面顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      
      addToCart(product) {
        const existing = this.cart.find(item => item.id === product.id)
        if (existing) {
          existing.quantity++
        } else {
          this.cart.push({ ...product, quantity: 1 })
        }
        
        this.showNotification = true
        this.notificationMessage = `已添加 ${product.name} 到购物车`
        
        setTimeout(() => {
          this.showNotification = false
        }, 2000)
      },
      updateQuantity({ id, quantity }) {
        if (quantity < 1) quantity = 1
        
        const item = this.cart.find(item => item.id === id)
        if (item) {
          item.quantity = quantity
        }
      },
      removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id)
      },
      selectCategory(category) {
        this.currentCategory = category;
        this.searchQuery = '';
        
        this.$nextTick(() => {
          const headerHeight = document.querySelector('.header').offsetHeight;
          let targetElement;
          let scrollOffset = 0;
          
          // if (category === 'all') {
          //   targetElement = document.getElementById('hot-section');
          //   // 滚动到热门推荐区域标题上方20px处
          //   scrollOffset = 70;
          // } else {
            targetElement = document.getElementById('category-products');
            // 滚动到分类商品区域标题上方20px处
            scrollOffset = 70;
          // }
          
          if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - scrollOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      },
      getPlaceholderImage(product) {
        const images = {
          medicine: 'https://images.unsplash.com/photo-1593369196682-6d8ec9ff3ae0?auto=format&fit=crop&w=300&q=80',
          consumables: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80',
          toys: 'https://images.unsplash.com/photo-1559131397-f94da358a7b2?auto=format&fit=crop&w=300&q=80'
        }
        return images[product.category] || 'https://via.placeholder.com/300'
      },
      applyCoupon() {
        if (this.couponCode.toUpperCase() === 'PET2023') {
          this.discountAmount = this.cartTotal * 0.1
          this.showNotification = true
          this.notificationMessage = '优惠码已应用，享受9折优惠！'
        } else {
          this.showNotification = true
          this.notificationMessage = '无效的优惠码'
        }
        
        setTimeout(() => {
          this.showNotification = false
        }, 2000)
      },
      submitPayment() {
        this.showNotification = true
        this.notificationMessage = '支付成功！订单正在处理中'
        
        setTimeout(() => {
          this.showNotification = false
          this.cart = []
          this.switchView('products')
        }, 2000)
      },
      // 执行搜索
      performSearch() {
        // 搜索功能已通过计算属性自动实现
      },
      // 清空搜索
      clearSearch() {
        this.searchQuery = ''
      }
    }
  }
</script>
  
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
  
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
  
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .logo h1 {
    font-size: 1.8rem;
    font-weight: 700;
  }
  
  .logo i {
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
  .main-content {
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
  
  .search-box {
    display: flex;
    max-width: 600px;
    margin: 0 auto;
    border-radius: var(--radius-sm);
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .search-box input {
    flex: 1;
    padding: 15px 20px;
    border: none;
    font-size: 1.1rem;
  }
  
  .search-box .clear-btn {
    background: var(--light-gray);
    color: var(--gray);
    padding: 0 15px;
    border: none;
    cursor: pointer;
  }
  
  .search-box .clear-btn:hover {
    background: #dcdcdc;
  }
  
  .search-box button:last-child {
    background: var(--accent);
    color: white;
    border: none;
    padding: 0 25px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: var(--transition);
  }
  
  .search-box button:last-child:hover {
    background: var(--accent-dark);
  }
  
  /* 商品分类 */
  .category-section {
    position: sticky;
    top: 120px;
    z-index: 50;
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--radius);
    padding: 15px 20px;
    margin: 20px 0;
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
  .cart-view, .checkout-view, .appointment-view {
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
  
  .empty-icon {
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
  
  .coupon-area {
    display: flex;
    margin: 20px 0;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  
  .coupon-area input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid var(--border);
    font-size: 1rem;
  }
  
  .coupon-area button {
    background: var(--secondary);
    color: white;
    border: none;
    padding: 0 20px;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .coupon-area button:hover {
    background: var(--secondary-dark);
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
  
  /* 预约页面样式 */
  .appointment-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .appointment-container h2 {
    text-align: center;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    color: var(--dark);
  }
  
  .appointment-card {
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 30px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 30px;
    border: 1px solid rgba(66, 185, 131, 0.1);
  }
  
  .doctor-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .doctor-avatar {
    width: 120px;
    height: 120px;
    background: rgba(66, 185, 131, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 20px;
  }
  
  .doctor-details {
    text-align: center;
  }
  
  .doctor-details h3 {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }
  
  .doctor-details p {
    color: var(--gray);
    margin-bottom: 15px;
  }
  
  .rating {
    color: #ffc107;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  
  .rating span {
    color: var(--gray);
    font-size: 0.9rem;
    margin-left: 8px;
  }
  
  .appointment-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--secondary-dark);
  }
  
  .form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    font-family: inherit;
    transition: var(--transition);
  }
  
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
  }
  
  .form-group textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .submit-appointment {
    background: linear-gradient(to right, var(--primary), var(--secondary));
    color: white;
    border: none;
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
    margin-top: 10px;
    box-shadow: 0 4px 10px rgba(66, 185, 131, 0.3);
  }
  
  .submit-appointment:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(66, 185, 131, 0.4);
  }
  
  .appointment-notice {
    background: rgba(0, 114, 188, 0.08);
    border-radius: var(--radius);
    padding: 20px;
    margin-top: 30px;
    display: flex;
    gap: 15px;
    align-items: center;
    border: 1px solid rgba(0, 114, 188, 0.2);
  }
  
  .appointment-notice i {
    color: var(--secondary);
    font-size: 1.5rem;
  }
  
  .appointment-notice p {
    color: var(--secondary-dark);
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
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border);
  }
  
  .results-header h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5rem;
    color: var(--dark);
  }
  
  .search-query {
    color: var(--primary);
    font-weight: bold;
  }
  
  .clear-search-btn {
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
  
  .clear-search-btn:hover {
    background: #d8d8d8;
  }
  
  .results-header p {
    color: var(--gray);
    font-size: 0.95rem;
    margin-top: 5px;
  }
  
  /* 响应式调整 */
  @media (max-width: 992px) {
    .cart-content, .checkout-content {
      grid-template-columns: 1fr;
    }
    
    .appointment-card {
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
      padding: 15px;
    }
    
    .search-box {
      flex-direction: column;
    }
    
    .search-box input {
      width: 100%;
    }
    
    .search-box button:last-child {
      width: 100%;
      padding: 12px;
    }
  }
</style>