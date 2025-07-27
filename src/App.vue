<template>
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div>
        <img src="@/assets/logo.jpg" alt="Logo" class="logo">
      </div>
      
      <div class="nav-buttons">
        <router-link to="/" class="nav-btn" active-class="active" exact>
          <i class="fas fa-home"></i> 首页
        </router-link>
        <router-link to="/questionnaire" class="nav-btn" active-class="active">
          <i class="fas fa-question"></i> 问卷
        </router-link>
        <router-link to="/manage" class="nav-btn" active-class="active">
          <i class="fas fa-tasks"></i> 管理
        </router-link>
         <router-link to="/department" class="nav-btn" active-class="active">
            <i class="fas fa-chart-bar"></i> 预约
         </router-link>
        <router-link to="/forum" class="nav-btn" active-class="active" exact>
          <i class="fas fa-forum"></i>论坛
        </router-link>
        <router-link to="/introduction" class="nav-btn" active-class="active" exact>
          <i class="fas fa-info"></i>概况
        </router-link>
      </div>
      
      <!-- 右侧用户区域 -->
      <div class="user-area">
        <!-- 调试按钮 -->
        <button class="debug-btn" @click="showDebugPanel = !showDebugPanel" title="调试面板">
          🔧
        </button>
        
        <!-- 未登录时显示登录按钮 -->
        <div v-if="!isLoggedIn" class="login-btn-wrapper">
          <button class="login-btn-nav" @click="showLoginModal = true">
            <i class="fas fa-sign-in-alt"></i> 登录
          </button>
        </div>
        

        <!-- 已登录时显示用户下拉菜单 -->
        <div v-else class="user-dropdown">
          <div class="user-box">
            <div class="user-avatar-placeholder">
              <span>{{ currentUser.avatar }}</span>
            </div>
            <span class="user-name">{{ currentUser.name }}</span>
            <i class="arrow-down">▼</i>

          
          <!-- 下拉菜单内容 -->
          <div class="dropdown-menu">
            <div class="dropdown-item">
              <i class="icon">👤</i>
              <router-link to="/user-info" class="user-name-link">
                <span class="user-name">个人信息</span>
              </router-link>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" @click="handleLogout">
              <i class="icon">🚪</i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </div>
      
    </header>
    
    <!-- 路由视图容器 -->
    <div class="router-view-container">
      <router-view></router-view>
    </div>

    <!-- 登录弹窗 -->
    <div v-if="showLoginModal" class="login-modal-overlay">
      <div class="login-modal-content">
        <div class="login-header">
          <h2>用户登录</h2>
          <span class="close-btn" @click="closeLoginModal">&times;</span>
        </div>
        <div class="login-body">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">用户名：</label>
              <input 
                type="text" 
                id="username" 
                v-model="loginForm.username" 
                @input="loginErrorMsg = ''"
                placeholder="请输入用户名"
              />
            </div>
            <div class="form-group">
              <label for="password">密码：</label>
              <input 
                type="password" 
                id="password" 
                v-model="loginForm.password" 
                @input="loginErrorMsg = ''"
                placeholder="请输入密码"
              />
            </div>
            <div class="form-group remember-group">
              <label class="remember-label">
                <input type="checkbox" v-model="loginForm.remember" />
                <span class="checkmark"></span>
                记住密码
              </label>
            </div>
            <!-- 登录错误提示 -->
            <div v-if="loginErrorMsg" class="login-error-msg">
              {{ loginErrorMsg }}
            </div>
            <div class="form-group">
              <button type="submit" class="login-btn">登录</button>
            </div>
          </form>
          <div class="login-footer">
            <a href="#" class="register-link" @click.prevent="switchToRegister">注册新账号</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegisterModal" class="login-modal-overlay">
      <div class="login-modal-content">
        <div class="login-header">
          <h2>用户注册</h2>
          <span class="close-btn" @click="closeRegisterModal">&times;</span>
        </div>
        <div class="login-body">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="reg-username">用户名：</label>
              <input 
                type="text" 
                id="reg-username" 
                v-model="registerForm.username" 
                placeholder="请输入用户名（3-15个字符）"
                required
                minlength="3"
                maxlength="15"
              />
              <span v-if="registerErrors.username" class="error-text">{{ registerErrors.username }}</span>
            </div>
            <div class="form-group">
              <label for="reg-password">密码：</label>
              <input 
                type="password" 
                id="reg-password" 
                v-model="registerForm.password" 
                placeholder="请输入密码（至少6位）"
                required
                minlength="6"
              />
              <span v-if="registerErrors.password" class="error-text">{{ registerErrors.password }}</span>
            </div>
            <div class="form-group">
              <label for="reg-confirm-password">确认密码：</label>
              <input 
                type="password" 
                id="reg-confirm-password" 
                v-model="registerForm.confirmPassword" 
                placeholder="请再次输入密码"
                required
              />
              <span v-if="registerErrors.confirmPassword" class="error-text">{{ registerErrors.confirmPassword }}</span>
            </div>
            <div class="form-group">
              <label for="reg-gender">性别（可选）：</label>
              <select 
                id="reg-gender" 
                v-model="registerForm.gender"
                class="form-select"
              >
                <option value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div class="form-group">
              <label for="reg-phone">电话（可选）：</label>
              <input 
                type="tel" 
                id="reg-phone" 
                v-model="registerForm.phone" 
                placeholder="请输入手机号码"
                pattern="[0-9]{11}"
              />
            </div>
            <div class="form-group">
              <label for="reg-email">邮箱（可选）：</label>
              <input 
                type="email" 
                id="reg-email" 
                v-model="registerForm.email" 
                placeholder="请输入邮箱地址"
              />
            </div>
            <div class="form-group">
              <label for="reg-address">地址（可选）：</label>
              <textarea 
                id="reg-address" 
                v-model="registerForm.address" 
                placeholder="请输入详细地址"
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
            <div class="form-group remember-group">
              <label class="remember-label">
                <input type="checkbox" v-model="registerForm.agreeTerms" required />
                <span class="checkmark"></span>
                我同意<a href="#" class="terms-link" @click.prevent="showUserAgreement">用户协议</a>和<a href="#" class="terms-link" @click.prevent="showPrivacyPolicy">隐私政策</a>
              </label>
            </div>
            <div class="form-group">
              <button type="submit" class="login-btn" :disabled="!isRegisterFormValid">注册</button>
            </div>
          </form>
          <div class="login-footer">
            <span>已有账号？</span>
            <a href="#" class="register-link" @click.prevent="switchToLogin">立即登录</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户协议弹窗 -->
    <div v-if="showUserAgreementModal" class="login-modal-overlay">
      <div class="terms-modal-content">
        <div class="terms-header">
          <h2>用户协议</h2>
          <span class="close-btn" @click="closeUserAgreement">&times;</span>
        </div>
        <div class="terms-body">
          <div class="terms-content">
            <h3>1. 服务条款的接受</h3>
            <p>欢迎使用宠物医院管理系统！通过注册和使用本系统，您表示同意并接受以下用户协议的所有条款和条件。</p>
            
            <h3>2. 服务说明</h3>
            <p>本系统为宠物医院提供在线管理服务，包括但不限于：</p>
            <ul>
              <li>宠物信息管理</li>
              <li>预约挂号服务</li>
              <li>医疗记录查询</li>
              <li>在线咨询服务</li>
              <li>健康问卷填写</li>
            </ul>
            
            <h3>3. 用户账户</h3>
            <p>3.1 您有责任保护您的账户信息，包括用户名和密码的安全性。</p>
            <p>3.2 您不得将账户转让给他人使用。</p>
            <p>3.3 如发现账户被盗用，请立即联系我们。</p>
            
            <h3>4. 用户行为规范</h3>
            <p>使用本系统时，您同意：</p>
            <ul>
              <li>提供真实、准确的个人信息</li>
              <li>不发布违法、有害或不当内容</li>
              <li>尊重其他用户的权利</li>
              <li>遵守相关法律法规</li>
            </ul>
            
            <h3>5. 服务的变更和终止</h3>
            <p>我们保留随时修改、暂停或终止服务的权利，恕不另行通知。</p>
            
            <h3>6. 免责声明</h3>
            <p>本系统仅提供信息服务，不替代专业医疗建议。任何医疗决定应咨询专业兽医。</p>
            
            <h3>7. 联系我们</h3>
            <p>如有疑问，请联系我们：</p>
            <p>邮箱：support@pethospital.com</p>
            <p>电话：400-123-4567</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐私政策弹窗 -->
    <div v-if="showPrivacyPolicyModal" class="login-modal-overlay">
      <div class="terms-modal-content">
        <div class="terms-header">
          <h2>隐私政策</h2>
          <span class="close-btn" @click="closePrivacyPolicy">&times;</span>
        </div>
        <div class="terms-body">
          <div class="terms-content">
            <h3>1. 信息收集</h3>
            <p>我们可能收集以下类型的信息：</p>
            <ul>
              <li>个人身份信息（姓名、联系方式等）</li>
              <li>宠物信息（品种、年龄、健康状况等）</li>
              <li>使用数据（访问时间、功能使用情况等）</li>
              <li>设备信息（IP地址、浏览器类型等）</li>
            </ul>
            
            <h3>2. 信息使用</h3>
            <p>我们使用收集的信息用于：</p>
            <ul>
              <li>提供和改进服务</li>
              <li>处理预约和医疗记录</li>
              <li>发送服务通知</li>
              <li>客户服务支持</li>
              <li>系统安全维护</li>
            </ul>
            
            <h3>3. 信息共享</h3>
            <p>我们承诺：</p>
            <ul>
              <li>不会出售您的个人信息</li>
              <li>仅在必要时与合作医院共享相关信息</li>
              <li>在法律要求下可能披露信息</li>
              <li>采用匿名化处理进行数据分析</li>
            </ul>
            
            <h3>4. 信息安全</h3>
            <p>我们采取以下措施保护您的信息：</p>
            <ul>
              <li>数据加密传输和存储</li>
              <li>严格的访问控制</li>
              <li>定期安全审计</li>
              <li>员工隐私培训</li>
            </ul>
            
            <h3>5. 您的权利</h3>
            <p>您有权：</p>
            <ul>
              <li>查看和更新个人信息</li>
              <li>要求删除个人数据</li>
              <li>选择退出某些数据收集</li>
              <li>获得数据副本</li>
            </ul>
            
            <h3>6. Cookie使用</h3>
            <p>我们使用Cookie来改善用户体验，您可以通过浏览器设置管理Cookie。</p>
            
            <h3>7. 政策更新</h3>
            <p>我们可能会定期更新本隐私政策，重大变更会通过网站公告通知用户。</p>
            
            <h3>8. 联系我们</h3>
            <p>关于隐私问题，请联系：</p>
            <p>邮箱：privacy@pethospital.com</p>
            <p>电话：400-123-4567</p>
            <p>地址：北京市朝阳区宠物医院大厦</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 调试面板 -->
    <div v-if="showDebugPanel" class="debug-panel">
      <div class="debug-header">
        <h3>调试面板</h3>
        <button class="close-debug" @click="showDebugPanel = false">&times;</button>
      </div>
      <div class="debug-content">
        <div class="debug-section">
          <h4>已注册用户 ({{ getRegisteredUsers().length }})</h4>
          <div class="registered-users" v-if="getRegisteredUsers().length > 0">
            <div v-for="user in getRegisteredUsers()" :key="user.username" class="user-item">
              <strong>{{ user.username }}</strong> | 密码: {{ user.password }}
              <span v-if="user.gender"> | 性别: {{ user.gender }}</span>
              <span v-if="user.phone"> | 电话: {{ user.phone }}</span>
              <span v-if="user.email"> | 邮箱: {{ user.email }}</span>
              <br><small v-if="user.address">地址: {{ user.address }}</small>
            </div>
          </div>
          <p v-else class="no-users">暂无注册用户</p>
          <div class="debug-actions">
            <button class="debug-action-btn" @click="addTestUser">添加测试用户</button>
            <button class="clear-users-btn" @click="clearRegisteredUsers">清空所有用户</button>
          </div>
        </div>
        
        <div class="debug-section">
          <h4>API 配置</h4>
          <p><strong>Base URL:</strong> {{ API_BASE_URL }}</p>
          <p><strong>模拟模式:</strong> 启用 (本地 localStorage)</p>
          <p><strong>当前登录状态:</strong> {{ isLoggedIn ? '已登录' : '未登录' }}</p>
          <p v-if="isLoggedIn"><strong>当前用户:</strong> {{ currentUser.name }}</p>
        </div>
      </div>
    </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'

// 登录状态
const isLoggedIn = ref(false)
const currentUser = ref({
  name: '',
  avatar: ''
})

// 登录弹窗状态
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showUserAgreementModal = ref(false)
const showPrivacyPolicyModal = ref(false)

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

// 登录错误信息
const loginErrorMsg = ref('')

// 注册表单数据
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  agreeTerms: false
})

// 注册表单验证错误
const registerErrors = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 关闭登录弹窗
const closeLoginModal = () => {
  showLoginModal.value = false
  loginErrorMsg.value = '' // 清空错误信息
  // 清空表单
  loginForm.value = {
    username: '',
    password: '',
    remember: false
  }
}

// 关闭注册弹窗
const closeRegisterModal = () => {
  showRegisterModal.value = false
  // 清空表单和错误信息
  registerForm.value = {
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    agreeTerms: false
  }
  registerErrors.value = {
    username: '',
    password: '',
    confirmPassword: ''
  }
}

// 弹窗切换
const switchToRegister = () => {
  closeLoginModal()
  showRegisterModal.value = true
}

const switchToLogin = () => {
  closeRegisterModal()
  loginErrorMsg.value = '' // 清空登录错误信息
  showLoginModal.value = true
}

// 显示用户协议
const showUserAgreement = () => {
  showUserAgreementModal.value = true
}

// 关闭用户协议
const closeUserAgreement = () => {
  showUserAgreementModal.value = false
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  showPrivacyPolicyModal.value = true
}

// 关闭隐私政策
const closePrivacyPolicy = () => {
  showPrivacyPolicyModal.value = false
}

// 注册表单验证
const isRegisterFormValid = computed(() => {
  return registerForm.value.username.length >= 3 &&
         registerForm.value.password.length >= 6 &&
         registerForm.value.password === registerForm.value.confirmPassword &&
         registerForm.value.agreeTerms
})

// 处理登录
const handleLogin = async () => {
  // 清空之前的错误信息
  loginErrorMsg.value = ''
  
  // 获取按钮元素并保存原始状态
  const submitBtn = document.querySelector('.login-btn')
  const originalText = submitBtn ? submitBtn.textContent : '登录'
  
  try {
    // 基本验证
    if (!loginForm.value.username.trim()) {
      loginErrorMsg.value = '用户名不能为空'
      return
    }
    
    if (!loginForm.value.password.trim()) {
      loginErrorMsg.value = '密码不能为空'
      return
    }

    console.log('发送登录请求:', loginForm.value)
    
    // 显示加载状态
    if (submitBtn) {
      submitBtn.textContent = '登录中...'
      submitBtn.disabled = true
    }

    let response
    
    try {
      // 发送真实的登录请求（GET方式，参数通过URL传递）
      response = await axios.get(`${API_BASE_URL}/login`, {
        params: {
          username: loginForm.value.username,
          password: loginForm.value.password
        }
      })
      
      console.log('后端响应:', response.data)
      
    } catch (apiError) {
      console.log('真实API不可用，使用本地模拟:', apiError.message)
      
      // 如果真实接口失败，使用模拟数据
      response = await mockLogin(loginForm.value.username, loginForm.value.password)
      console.log('模拟响应:', response.data)
    }
    
    // 严格检查后端返回的code是否为200
    if (response.data && response.data.code === 200) {
      // 登录成功
      isLoggedIn.value = true
      currentUser.value = {
        name: loginForm.value.username,
        avatar: loginForm.value.username.substring(0, 2).toUpperCase()
      }
      
      // 记住密码功能
      if (loginForm.value.remember) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          username: loginForm.value.username,
          password: loginForm.value.password
        }))
      } else {
        localStorage.removeItem('rememberedUser')
      }
      
      alert('✅ ' + (response.data.msg || '登录成功！'))
      closeLoginModal()
    } else {
      // 登录失败 - 显示后端返回的错误信息
      const errorMsg = response.data?.msg || '登录失败，请检查用户名和密码'
      loginErrorMsg.value = errorMsg
      console.log('登录失败，后端返回:', response.data)
    }
    
  } catch (error) {
    console.error('登录过程出错:', error)
    loginErrorMsg.value = '网络连接失败，请稍后重试'
  } finally {
    // 恢复按钮状态
    if (submitBtn) {
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }
  }
}

// 模拟登录请求
const mockLogin = async (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从 localStorage 获取已注册用户
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      
      console.log('=== 模拟登录调试信息 ===')
      console.log('尝试登录用户:', username)
      console.log('localStorage 中的用户数据:', registeredUsers)
      
      // 查找匹配的用户
      const user = registeredUsers.find(u => u.username === username && u.password === password)
      
      if (user) {
        console.log('找到匹配用户，登录成功')
        resolve({
          data: {
            msg: "登录成功",
            code: 200
          }
        })
      } else {
        console.log('未找到匹配用户，登录失败')
        resolve({
          data: {
            msg: "用户名或密码错误",
            code: 400
          }
        })
      }
    }, 500) // 模拟网络延迟
  })
}

// 处理注册
const handleRegister = async () => {
  // 重置错误信息
  registerErrors.value = {
    username: '',
    password: '',
    confirmPassword: ''
  }
  
  let hasErrors = false
  
  // 验证用户名
  if (registerForm.value.username.length < 3) {
    registerErrors.value.username = '用户名至少需要3个字符'
    hasErrors = true
  }
  
  // 验证密码
  if (registerForm.value.password.length < 6) {
    registerErrors.value.password = '密码至少需要6个字符'
    hasErrors = true
  }
  
  // 验证确认密码
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = '两次输入的密码不一致'
    hasErrors = true
  }
  
  if (hasErrors) {
    return
  }
  
  try {
    console.log('发送注册请求:', registerForm.value)
    
    // 显示加载状态
    const submitBtn = document.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = '注册中...'
    submitBtn.disabled = true
    
    let response
    
    try {
      // 发送真实的注册请求（POST方式，根据图片显示的数据格式）
      response = await axios.post(`${API_BASE_URL}/register`, {
        username: registerForm.value.username,
        password: registerForm.value.password,
        gender: registerForm.value.gender || "女",  // 根据图片中的数据
        phone: registerForm.value.phone || "",
        email: registerForm.value.email || "",
        address: registerForm.value.address || "",
        avatar_url: null  // 根据图片中显示的字段
      })
      
      console.log('后端响应:', response.data)
      
    } catch (apiError) {
      console.log('真实API不可用，使用本地模拟:', apiError.message)
      
      // 如果真实接口失败，使用模拟数据
      response = await mockRegister(registerForm.value)
      console.log('模拟响应:', response.data)
    }
    
    // 严格检查后端返回的code是否为200
    if (response.data && response.data.code === 200) {
      // 注册成功
      alert('✅ ' + (response.data.msg || '注册成功！'))
      
      // 保存用户名和密码，切换到登录弹窗时自动填入
      const savedUsername = registerForm.value.username
      const savedPassword = registerForm.value.password
      
      // 切换到登录弹窗
      closeRegisterModal()
      showLoginModal.value = true
      
      // 自动填入刚注册的用户名和密码
      loginForm.value.username = savedUsername
      loginForm.value.password = savedPassword
      
    } else {
      // 注册失败 - 显示后端返回的错误信息
      const errorMsg = response.data?.msg || '注册失败，请重试'
      alert('❌ ' + errorMsg)
      console.log('注册失败，后端返回:', response.data)
    }
    
  } catch (error) {
    console.error('注册过程出错:', error)
    alert('❌ 网络连接失败，请稍后重试')
  } finally {
    // 恢复按钮状态
    const submitBtn = document.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }
  }
}

// 模拟注册请求
const mockRegister = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从 localStorage 获取已注册用户
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      
      console.log('=== 模拟注册调试信息 ===')
      console.log('注册用户数据:', userData)
      console.log('当前 localStorage 中的用户:', registeredUsers)
      
      // 检查用户名是否已存在
      const existingUser = registeredUsers.find(u => u.username === userData.username)
      
      if (existingUser) {
        console.log('注册失败 - 用户名已存在')
        resolve({
          data: {
            msg: "用户名已存在",
            code: 400
          }
        })
      } else {
        // 添加新用户 - 按照后端数据格式
        const newUser = {
          username: userData.username,
          password: userData.password,
          gender: userData.gender || "女",
          phone: userData.phone || "",
          email: userData.email || "",
          address: userData.address || "",
          avatar_url: null,
          registeredAt: new Date().toISOString()
        }
        
        registeredUsers.push(newUser)
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
        
        console.log('注册成功 - 新用户:', newUser)
        console.log('更新后的 localStorage:', JSON.parse(localStorage.getItem('registeredUsers')))
        
        resolve({
          data: {
            msg: "添加用户成功",
            code: 200
          }
        })
      }
    }, 500) // 模拟网络延迟
  })
}

// 处理登出
const handleLogout = () => {
  isLoggedIn.value = false
  currentUser.value = { name: '', avatar: '' }
  alert('已退出登录')
}

// 调试面板状态
const showDebugPanel = ref(false)

// 获取已注册用户（用于调试）
const getRegisteredUsers = () => {
  return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
}

// 清空已注册用户（用于调试）
const clearRegisteredUsers = () => {
  localStorage.removeItem('registeredUsers')
  localStorage.removeItem('rememberedUser')
  alert('已清空所有注册用户和记住的密码')
}

// 添加测试用户（用于调试）
const addTestUser = () => {
  const testUser = {
    username: 'hmm',
    password: '999999',
    gender: '女',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    address: '北京市海淀区中关村大街1号',
    avatar_url: null,
    registeredAt: new Date().toISOString()
  }
  
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  
  // 检查是否已存在
  const exists = registeredUsers.find(u => u.username === testUser.username)
  if (exists) {
    alert('测试用户已存在')
    return
  }
  
  registeredUsers.push(testUser)
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
  alert('✅ 测试用户已添加\n用户名: hmm\n密码: 999999')
}

// 页面加载时检查记住的密码
onMounted(() => {
  const rememberedUser = localStorage.getItem('rememberedUser')
  if (rememberedUser) {
    const user = JSON.parse(rememberedUser)
    loginForm.value.username = user.username
    loginForm.value.password = user.password
    loginForm.value.remember = true
  }
})
</script>

<style>

      /* 顶部导航栏样式 */
      /* 所有页面的导航栏基本样式 */
      .app-header {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 80px;
        background: white;
        border-bottom: 1px solid #e5e5e5;
      }

      .logo {
        width: 150px;
        height: 79px;
        display: flex;
      }

      .nav-buttons {
        display: flex;;
        gap: 15px;
      }

      .nav-list {
        display: flex;
        list-style-type: none;
        gap: 30px;
      }

      .nav-btn {
        position: relative; /* 为了使用 ::before 定位 */
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.1);
        color: black;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        align-items: center;
        text-align: center;
        cursor: pointer;
        overflow: hidden; /* 防止伪元素溢出 */
        z-index: 1; /* 确保内容在背景之上 */
      }
      
      /* 背景颜色从左到右展开的效果 */
      .nav-btn::before {
        content: ''; /* 创建伪元素 */
        position: absolute;
        top: 0;
        left: 0;
        width: 0; /* 初始宽度为 0 */
        height: 100%;
        background-color: rgba(220, 230, 255, 0.9); /* 展开时的背景色 */
        transition: width 0.3s ease; /* 设置动画效果，控制宽度变化 */
        z-index: -1; /* 确保背景在内容下方 */
      }
      
      /* 鼠标悬停时的效果 */
      .nav-btn:hover::before {
        width: 100%; /* 悬停时背景扩展到与按钮等宽 */
        background-color: rgba(235, 240, 255, 0.8); /* 悬停时的背景色，比点击时稍浅 */
      }
      
      /* 点击时的效果 */
      .nav-btn:active::before {
        width: 100%; /* 点击时背景扩展到与按钮等宽 */
        background-color: rgba(220, 230, 255, 0.9); /* 点击时的背景色，更深 */
      }

      /* 当前页面按钮高亮效果 */
      .nav-btn.active::before {
        width: 100%; /* 当前页面按钮背景始终展开 */
        background-color: rgba(235, 240, 255, 0.8); /* 使用悬停时的背景色 */
      }

      /* 用户区域样式 */
      .user-area {
        margin-left: auto; /* 确保用户区域靠右 */
      }

      /* 登录按钮样式 */
      .login-btn-wrapper {
        display: flex;
        align-items: center;
      }

      .login-btn-nav {
        padding: 12px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        position: relative;
        overflow: hidden;
      }

      .login-btn-nav::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }

      .login-btn-nav:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .login-btn-nav:hover::before {
        left: 100%;
      }

      .login-btn-nav:active {
        transform: translateY(0);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

            /* 用户下拉菜单样式 */
      .user-dropdown {
        position: relative;
        margin-left: auto; /* 确保用户框靠右 */
        cursor: pointer;
      }
      
      .user-box {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        background-color: rgba(235, 240, 255, 0.5);
        transition: background-color 0.3s;
      }
      
      .user-box:hover {
        background-color: rgba(220, 230, 255, 0.8);
      }
      
      .user-avatar-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #1e88e5;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        margin-right: 8px;
      }
      
      .user-name {
        font-size: 14px;
        font-weight: 500;
        margin-right: 5px;
      }
      
      .arrow-down {
        font-size: 10px;
        color: #666;
      }
      
      /* 下拉菜单样式 */
      .dropdown-menu {
        position: absolute;
        top: calc(100% + 5px);
        right: 0; /* 右对齐 */
        width: 200px;
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 8px 0;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1001;
      }
      
      /* 鼠标悬停时显示下拉菜单 */
      .user-dropdown:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .dropdown-item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        transition: background-color 0.3s;
        position: relative;
      }
      
      .dropdown-item:hover {
        background-color: #f5f7fa;
      }
      
      .dropdown-item .icon {
        margin-right: 10px;
        font-size: 16px;
      }
      
      .notification-badge {
        position: absolute;
        right: 15px;
        background-color: #f44336;
        color: white;
        font-size: 12px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .dropdown-divider {
        height: 1px;
        background-color: #eeeeee;
        margin: 5px 0;
      }
      
      /* 调整app-header的布局 */
      .app-header {
        justify-content: space-between; /* 修改布局，使内容分布在两端 */
        padding: 0 20px; /* 添加左右内边距 */
        box-sizing: border-box;
      }

      .router-view-container {
        margin-top: 1px; /* 调整为合适的间距 */
      }
     
      .user-name-link {
        color: inherit;      /* 保持颜色 */
        text-decoration: none;
      }

      .dropdown-item {
        cursor: pointer;
      }

      /* 登录弹窗样式 */
      .login-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(30, 42, 60, 0.8) 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.4s ease;
        backdrop-filter: blur(8px);
      }

      @keyframes fadeIn {
        from { 
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        to { 
          opacity: 1;
          backdrop-filter: blur(8px);
        }
      }

      .login-modal-content {
        background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e3f0ff 100%);
        border-radius: 24px;
        width: 420px;
        max-width: 90vw;
        max-height: 85vh;
        box-shadow: 
          0 25px 50px rgba(30, 136, 229, 0.15), 
          0 10px 30px rgba(30, 136, 229, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .login-modal-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
        background-size: 200% 100%;
        animation: shimmer 2s linear infinite;
      }

      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      @keyframes slideUp {
        from { 
          opacity: 0; 
          transform: translateY(50px) scale(0.9) rotateX(10deg); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1) rotateX(0deg); 
        }
      }

      .login-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32px 32px 20px 32px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      }

      .login-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .login-header h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .close-btn {
        font-size: 32px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
        line-height: 1;
        position: relative;
        z-index: 1;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
      }

      .close-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg) scale(1.1);
      }

      .login-body {
        padding: 40px 32px 32px 32px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }

      /* 登录弹窗滚动条样式 */
      .login-body::-webkit-scrollbar {
        width: 8px;
      }

      .login-body::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        margin: 8px 0;
      }

      .login-body::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .login-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }

      .login-body::-webkit-scrollbar-thumb:active {
        background: linear-gradient(135deg, #4c51bf 0%, #553c9a 100%);
      }

      .form-group {
        margin-bottom: 24px;
        position: relative;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #4a5568;
        font-size: 14px;
        transition: color 0.3s ease;
      }

      .form-group input[type="text"],
      .form-group input[type="password"],
      .form-group input[type="email"],
      .form-group input[type="tel"] {
        width: 100%;
        padding: 16px 20px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        position: relative;
      }

      .form-group input[type="text"]:focus,
      .form-group input[type="password"]:focus,
      .form-group input[type="email"]:focus,
      .form-group input[type="tel"]:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 
          0 0 0 4px rgba(102, 126, 234, 0.1),
          0 4px 12px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 1);
      }

      /* 下拉选择框样式 */
      .form-select {
        width: 100%;
        padding: 16px 20px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23667eea' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
        background-repeat: no-repeat;
        background-position: right 20px center;
        background-size: 12px;
      }

      .form-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 
          0 0 0 4px rgba(102, 126, 234, 0.1),
          0 4px 12px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 1);
      }

      .form-select option {
        padding: 12px;
        background: white;
        color: #2d3748;
      }

      /* 文本域样式 */
      .form-textarea {
        width: 100%;
        padding: 16px 20px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
        line-height: 1.5;
      }

      .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 
          0 0 0 4px rgba(102, 126, 234, 0.1),
          0 4px 12px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 1);
      }

      .form-textarea::placeholder {
        color: #a0aec0;
        opacity: 1;
      }

      .form-group input[type="text"]:focus + label,
      .form-group input[type="password"]:focus + label {
        color: #667eea;
      }

      .remember-group {
        display: flex;
        align-items: center;
        margin-bottom: 32px;
      }

      .remember-label {
        display: flex !important;
        align-items: center;
        cursor: pointer;
        margin-bottom: 0 !important;
        font-weight: 500 !important;
        color: #4a5568 !important;
      }

      .remember-label input[type="checkbox"] {
        display: none;
      }

      .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #cbd5e0;
        border-radius: 6px;
        margin-right: 12px;
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(255, 255, 255, 0.9);
      }

      .remember-label input[type="checkbox"]:checked + .checkmark {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        transform: scale(1.1);
      }

      .remember-label input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 14px;
        font-weight: bold;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      .login-btn {
        width: 100%;
        padding: 18px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        letter-spacing: 1px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }

      .login-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }

      .login-btn:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
      }

      .login-btn:hover::before {
        left: 100%;
      }

      .login-btn:active {
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }

      /* 登录错误提示样式 */
      .login-error-msg {
        background: #fee;
        color: #d63384;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 500;
        border: 1px solid #f5c6cb;
        text-align: center;
        animation: shake 0.5s ease-in-out;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .login-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 32px;
        gap: 16px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }

      .forgot-password,
      .register-link {
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        padding: 8px 12px;
        border-radius: 8px;
        position: relative;
      }

      .forgot-password::before,
      .register-link::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        transition: all 0.3s ease;
        transform: translateX(-50%);
      }

      .forgot-password:hover,
      .register-link:hover {
        color: #5a67d8;
        background: rgba(102, 126, 234, 0.05);
        transform: translateY(-1px);
      }

      .forgot-password:hover::before,
      .register-link:hover::before {
        width: 100%;
      }

      .separator {
        color: #cbd5e0;
        font-size: 14px;
        margin: 0 8px;
      }

      /* 注册相关样式 */
      .error-text {
        color: #e53e3e;
        font-size: 12px;
        margin-top: 6px;
        display: block;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .terms-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .terms-link:hover {
        color: #5a67d8;
        text-decoration: underline;
      }

      .login-btn:disabled {
        background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 4px 15px rgba(160, 174, 192, 0.2);
      }

      .login-btn:disabled::before {
        display: none;
      }

      .login-btn:disabled:hover {
        background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
        transform: none;
        box-shadow: 0 4px 15px rgba(160, 174, 192, 0.2);
      }

      /* 响应式设计 */
      @media (max-width: 480px) {
        .login-modal-content {
          width: 95%;
          margin: 20px auto;
          max-height: 90vh;
        }

        .login-header {
          padding: 24px 20px 16px 20px;
        }

        .login-header h2 {
          font-size: 20px;
        }

        .login-body {
          padding: 24px 20px;
        }

        .form-group input,
        .form-select,
        .form-textarea {
          padding: 12px 16px;
          font-size: 14px;
        }

        .form-select {
          background-position: right 16px center;
          background-size: 10px;
        }

        .login-btn {
          padding: 14px 20px;
          font-size: 14px;
        }

        /* 移动端滚动条调整 */
        .login-body::-webkit-scrollbar {
          width: 6px;
        }
      }

      /* 用户协议和隐私政策弹窗样式 */
      .terms-modal-content {
        background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e3f0ff 100%);
        border-radius: 24px;
        width: 600px;
        max-width: 90vw;
        max-height: 80vh;
        box-shadow: 
          0 25px 50px rgba(30, 136, 229, 0.15), 
          0 10px 30px rgba(30, 136, 229, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .terms-modal-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
        background-size: 200% 100%;
        animation: shimmer 2s linear infinite;
      }

      .terms-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32px 32px 20px 32px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      }

      .terms-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
      }

      .terms-header h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .terms-body {
        flex: 1;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
      }

      .terms-content {
        padding: 32px;
        line-height: 1.6;
        color: #2d3748;
      }

      .terms-content h3 {
        color: #667eea;
        font-size: 18px;
        font-weight: 600;
        margin: 24px 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 2px solid rgba(102, 126, 234, 0.1);
      }

      .terms-content h3:first-child {
        margin-top: 0;
      }

      .terms-content p {
        margin: 12px 0;
        font-size: 14px;
        text-align: justify;
      }

      .terms-content ul {
        margin: 12px 0;
        padding-left: 20px;
      }

      .terms-content li {
        margin: 8px 0;
        font-size: 14px;
        list-style-type: disc;
      }

      .terms-content ul li::marker {
        color: #667eea;
      }

      /* 自定义滚动条 */
      .terms-body::-webkit-scrollbar {
        width: 8px;
      }

      .terms-body::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }

      .terms-body::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
      }

      .terms-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
      }

      /* 响应式调整 */
      @media (max-width: 768px) {
        .terms-modal-content {
          width: 95%;
          max-height: 85vh;
        }

        .terms-header {
          padding: 24px 20px 16px 20px;
        }

        .terms-header h2 {
          font-size: 20px;
        }

        .terms-content {
          padding: 24px 20px;
        }

        .terms-content h3 {
          font-size: 16px;
        }

        .terms-content p,
        .terms-content li {
          font-size: 13px;
        }
      }

      /* 调试面板样式 */
      .debug-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
      }

      .debug-btn:hover {
        background: #ff5252;
        transform: scale(1.1);
      }

      .debug-panel {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 999;
        overflow: hidden;
      }

      .debug-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .debug-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .close-debug {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .debug-content {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }

      .debug-section {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
      }

      .debug-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .debug-section h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #333;
      }

      .registered-users {
        max-height: 150px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
      }

      .user-item {
        padding: 4px 8px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 12px;
        color: #666;
      }

      .user-item:last-child {
        border-bottom: none;
      }

      .no-users {
        color: #999;
        font-style: italic;
        font-size: 12px;
        margin: 8px 0;
      }

      .clear-users-btn {
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.3s ease;
        margin-left: 8px;
      }

      .clear-users-btn:hover {
        background: #ff5252;
      }

      .debug-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .debug-action-btn {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.3s ease;
      }

      .debug-action-btn:hover {
        background: #45a049;
      }

      .user-item {
        padding: 6px 8px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 11px;
        color: #666;
        line-height: 1.4;
      }

      .user-item small {
        color: #999;
        font-size: 10px;
      }
    </style>
