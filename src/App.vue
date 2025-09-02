<template>
  <!-- 顶部导航栏 -->
  <header class="app-header">
    <div>
      <img src="@/assets/logo.jpg" alt="Logo" class="logo">
    </div>
    
    <div class="nav-buttons">
      <router-link to="/" class="nav-btn" active-class="active" exact>
        <i class="fas fa-home"></i>  首页
      </router-link>
      <NearbyStores :isManager="isManager" />
      <button @click="handleQuestionnaireClick" class="nav-btn" :class="{ active: $route.path === '/questionnaire' }">
        <i class="fas fa-question"></i>  问卷
      </button>
      <router-link to="/shopment" class="nav-btn" active-class="active" v-if="!isManager" exact>
        <i class="fas fa-tasks"></i>  购物
      </router-link>
       <router-link to="/shop_manager" class="nav-btn" active-class="active" v-if="isManager" >
        <i class="fas fa-tasks"></i>  商品管理
      </router-link>
       <router-link to="/department" class="nav-btn" active-class="active" v-if="!isManager" exact>
          <i class="fas fa-chart-bar"></i>  预约
       </router-link>
       <router-link to="/schedule-management" class="nav-btn" active-class="active" v-if="isManager" >
          <i class="fas fa-chart-bar"></i>  预约管理
       </router-link>
      <router-link to="/forum" class="nav-btn" active-class="active" exact>
        <i class="fas fa-bullhorn"></i>论坛
      </router-link>
      <router-link to="/adaptpet" class="nav-btn" active-class="active" v-if="!isManager" exact>
        <i class="fas fa-cat"></i>  领养
      </router-link>
      <router-link   router-link to="/manage" class="nav-btn" active-class="active" v-if="isManager">
        <i class="fas fa-paw"></i>  管理
      </router-link>
      <router-link to="/introduction" class="nav-btn" active-class="active" exact>
        <i class="fas fa-info"></i>  概况
      </router-link>
    </div>
    
    <!-- 右侧用户区域 -->
    <div class="user-area">
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
            <span>{{ currentUser.avatar_url || currentUser.name.substring(0, 2).toUpperCase() }}</span>
          </div>
          <span class="user-name">{{ currentUser.name }}</span>
          <i v-if="isManager" class="admin-icon fas fa-crown" title="管理员"></i>
          <i class="arrow-down">▼</i>
        </div>

        <!-- 下拉菜单内容 -->
        <div class="dropdown-menu">
          <div class="dropdown-item" v-if="!isManager">
            <i class="icon">👤</i>
            <router-link to="/user-info" class="user-name-link">
              <span class="user-name">个人信息</span>
            </router-link>
          </div>
          <div class="dropdown-divider" v-if="!isManager"></div>
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
              <input type="checkbox" v-model="loginForm.isManager" />
              <span class="checkmark"></span>
              管理员登录
            </label>
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
              <option value="男">男</option>
              <option value="女">女</option>
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
              maxlength="20"
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
              <input 
                type="checkbox" 
                v-model="registerForm.isManager" 
                @change="handleManagerCheckChange"
              />
              <span class="checkmark"></span>
              注册为管理员账户
            </label>
            <div class="manager-notice">
              <i class="fas fa-info-circle"></i>
              管理员账户拥有系统管理权限，需要验证管理员密码
            </div>
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

  <!-- 管理员密码验证弹窗 -->
  <div v-if="showManagerVerifyModal" class="login-modal-overlay">
    <div class="login-modal-content manager-verify-modal">
      <div class="login-header">
        <h2>管理员身份验证</h2>
        <span class="close-btn" @click="closeManagerVerifyModal">&times;</span>
      </div>
      <div class="login-body">
        <div class="verify-notice">
          <i class="fas fa-shield-alt"></i>
          <p>请输入管理员验证密码以确认您的管理员身份</p>
        </div>
        <form @submit.prevent="handleManagerVerify">
          <div class="form-group">
            <label for="manager-password">管理员密码：</label>
            <input 
              type="password" 
              id="manager-password" 
              v-model="managerVerifyPassword" 
              placeholder="请输入管理员验证密码"
              required
              autofocus
            />
            <div v-if="managerVerifyError" class="error-text">{{ managerVerifyError }}</div>
          </div>
          <div class="form-group">
            <button type="submit" class="login-btn verify-btn">验证</button>
            <button type="button" class="cancel-btn" @click="cancelManagerVerify">取消</button>
          </div>
        </form>
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

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'
import NearbyStores from '@/components/NearbyStores.vue'

// Vue Router
const route = useRoute()
const router = useRouter()

// 登录状态
const isLoggedIn = ref(false)
const isManager = ref(false) // 管理员状态标识
const currentUser = ref({
name: '',
avatar_url: ''
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
remember: false,
isManager: false
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
agreeTerms: false,
isManager: false
})

// 注册表单验证错误
const registerErrors = ref({
username: '',
password: '',
confirmPassword: ''
})

// 管理员验证相关状态
const showManagerVerifyModal = ref(false)
const managerVerifyPassword = ref('')
const managerVerifyError = ref('')
const MANAGER_PASSWORD = '10086' // 管理员验证密码

// 关闭登录弹窗
const closeLoginModal = () => {
showLoginModal.value = false
loginErrorMsg.value = '' // 清空错误信息
// 清空表单
loginForm.value = {
  username: '',
  password: '',
  remember: false,
  isManager: false
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
  agreeTerms: false,
  isManager: false
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

// 管理员复选框变化处理
const handleManagerCheckChange = () => {
if (registerForm.value.isManager) {
  // 如果勾选了管理员，弹出验证弹窗
  showManagerVerifyModal.value = true
  managerVerifyPassword.value = ''
  managerVerifyError.value = ''
}
}

// 关闭管理员验证弹窗
const closeManagerVerifyModal = () => {
showManagerVerifyModal.value = false
managerVerifyPassword.value = ''
managerVerifyError.value = ''
// 如果取消验证，取消管理员选择
registerForm.value.isManager = false
}

// 处理管理员验证
const handleManagerVerify = () => {
if (managerVerifyPassword.value === MANAGER_PASSWORD) {
  // 验证成功
  showManagerVerifyModal.value = false
  managerVerifyPassword.value = ''
  managerVerifyError.value = ''
  alert('✅ 管理员身份验证成功！')
} else {
  // 验证失败
  managerVerifyError.value = '管理员密码错误，请重新输入'
  managerVerifyPassword.value = ''
}
}

// 取消管理员验证
const cancelManagerVerify = () => {
closeManagerVerifyModal()
}

// 注册表单验证
const isRegisterFormValid = computed(() => {
return registerForm.value.username.length >= 3 &&
       registerForm.value.password.length >= 6 &&
       registerForm.value.password === registerForm.value.confirmPassword &&
       registerForm.value.agreeTerms
})

// 检查用户是否已登录
const isUserLoggedIn = () => {
// 优先检查当前的登录状态
if (isLoggedIn.value) {
  return true
}

// 如果当前状态为未登录，再检查 localStorage 中的登录信息
const rememberedUser = localStorage.getItem('rememberedUser')
const currentUser = localStorage.getItem('currentUser')
return !!(rememberedUser || currentUser)
}

// 处理问卷按钮点击
const handleQuestionnaireClick = () => {
console.log('问卷按钮点击 - 当前登录状态:', isLoggedIn.value)
console.log('当前用户信息:', currentUser.value)

if (!isLoggedIn.value) {
  alert('请先登录后再访问问卷页面')
  showLoginModal.value = true
  return
}

// 如果已登录，正常跳转到问卷页面
console.log('用户已登录，跳转到问卷页面')
router.push('/questionnaire')
}

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
    // 根据是否是管理员选择不同的API接口
    if (loginForm.value.isManager) {
      // 管理员登录接口
      response = await axios.get(`${API_BASE_URL}/manager/login`, {
        params: {
          managerName: loginForm.value.username,
          password: loginForm.value.password
        }
      })
    } else {
      // 普通用户登录接口
      response = await axios.get(`${API_BASE_URL}/login`, {
        params: {
          username: loginForm.value.username,
          password: loginForm.value.password
        }
      })
    }
    
    console.log('后端响应:', response.data)
    
  } catch (apiError) {
    console.error('登录API调用失败:', apiError.message)
    console.error('完整错误信息:', apiError)
    loginErrorMsg.value = '网络连接失败，请检查网络或联系管理员'
    return
  }
  
  // 严格检查后端返回的code是否为200
  if (response.data && response.data.code === 200) {
    console.log('登录成功，后端返回数据结构:', response.data)
    console.log('用户数据部分:', response.data.user || response.data.data)
    
    // 登录成功
    isLoggedIn.value = true
    // 设置管理员状态
    isManager.value = loginForm.value.isManager
    
    // 处理后端返回的用户数据
    const userData = response.data.user || response.data.data || {}
    const username = userData.username || loginForm.value.username
    const userId = userData.userId || userData.user_id || userData.id
    
    currentUser.value = {
      name: username,
      avatar_url: userData.avatar_url || null,  // 使用数据库的avatar_url字段
      userId: userId
    }
    
    // 保存当前登录状态到localStorage（包含userId等信息）
    localStorage.setItem('currentUser', JSON.stringify({
      username: username,
      userId: userId,
      avatar_url: userData.avatar_url || null,
      loginTime: new Date().toISOString(),
      isManager: loginForm.value.isManager, // 保存管理员状态
      userData: userData  // 保存完整的用户数据
    }))
    
    // 记住密码功能（可选）
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

// 在函数开始时获取按钮元素和原始文本
const submitBtn = document.querySelector('button[type="submit"]')
const originalText = submitBtn ? submitBtn.textContent : '注册'

try {
  console.log('发送注册请求:', registerForm.value)
  
  // 显示加载状态
  if (submitBtn) {
    submitBtn.textContent = '注册中...'
    submitBtn.disabled = true
  }
  
  let response
  
  try {
    // 根据是否是管理员调用不同的接口
    if (registerForm.value.isManager) {
      // 管理员注册接口
      console.log('调用管理员注册接口')
      const managerData = {
        managerName: registerForm.value.username.trim(),  // 使用 managerName 匹配Manager类字段
        password: registerForm.value.password
      }
      console.log('发送管理员注册数据:', managerData)
  
      response = await axios.post(`${API_BASE_URL}/manager/register`, managerData)
    } else {
      // 普通用户注册接口
      console.log('调用普通用户注册接口')
      const registrationData = {
        username: registerForm.value.username.trim(),
        password: registerForm.value.password,
        gender: registerForm.value.gender || "女",  // 默认女，匹配数据库ENUM('女', '男')
        phone: registerForm.value.phone.trim() || "",
        email: registerForm.value.email.trim() || "",
        address: registerForm.value.address.trim() || "",
        avatar_url: null  // 头像URL，初始为null
      }
      console.log('发送普通用户注册数据:', registrationData)
      response = await axios.post(`${API_BASE_URL}/register`, registrationData)
    }
    
    console.log('后端响应:', response.data)
    
  } catch (apiError) {
    console.error('注册API调用失败:', apiError.message)
    alert('❌ 网络连接失败，请检查网络或联系管理员')
    return
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
  if (submitBtn) {
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}
}



// 处理登出
const handleLogout = () => {
isLoggedIn.value = false
isManager.value = false // 重置管理员状态
currentUser.value = { name: '', avatar_url: '' }

// 清除登录状态（但保留记住的密码，如果用户之前选择了记住密码）
localStorage.removeItem('currentUser')

alert('已退出登录')

// 自动跳转到首页
router.push('/')
}

// 页面加载时检查记住的密码
onMounted(() => {
console.log('=== 页面加载，检查登录状态 ===')

// 首先检查当前登录状态
const currentUserData = localStorage.getItem('currentUser')
if (currentUserData) {
  const user = JSON.parse(currentUserData)
  console.log('发现当前登录用户:', user.username)
  
  // 恢复登录状态
  isLoggedIn.value = true
  isManager.value = user.isManager || false // 恢复管理员状态
  currentUser.value = {
    name: user.username,
    avatar_url: user.avatar_url || null
  }
  
  console.log('已恢复当前登录状态:', isLoggedIn.value)
}

// 然后检查是否有记住的用户信息（用于填充登录表单）
const rememberedUser = localStorage.getItem('rememberedUser')
if (rememberedUser) {
  const user = JSON.parse(rememberedUser)
  console.log('发现记住的用户:', user.username)
  
  // 如果还没有登录状态，则恢复登录状态
  if (!isLoggedIn.value) {
    isLoggedIn.value = true
    currentUser.value = {
      name: user.username,
      avatar_url: null  // 记住的用户没有avatar_url信息，设为null
    }
  }
  
  // 恢复登录表单数据
  loginForm.value.username = user.username
  loginForm.value.password = user.password
  loginForm.value.remember = true
  
  console.log('已恢复记住的用户登录状态:', isLoggedIn.value)
}

if (!currentUserData && !rememberedUser) {
  console.log('未找到任何登录信息')
}

// 检查 URL 查询参数，如果有 showLogin=true 则自动弹出登录弹窗
if (route.query.showLogin === 'true') {
  showLoginModal.value = true
  // 清理 URL 参数，避免刷新页面时重复弹出
  router.replace({ query: {} })
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

    /* 为 button 类型的导航按钮添加特殊样式 */
    button.nav-btn {
      border: none;
      background: rgba(255, 255, 255, 0.1);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      font-family: inherit;
    }

    button.nav-btn i {
      margin-right: 4px;
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
    
    .admin-icon {
      color: #ffd700; /* 金色 */
      font-size: 14px;
      margin-right: 5px;
      margin-left: 3px;
      filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5));
      animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
      from {
        filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5));
      }
      to {
        filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));
      }
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

    /* 管理员提示信息样式 */
    .manager-notice {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
      margin-top: 8px;
      padding: 8px 12px;
      background: rgba(25, 118, 210, 0.05);
      border-radius: 6px;
      border-left: 3px solid #1976d2;
    }

    .manager-notice i {
      color: #1976d2;
    }

    /* 管理员验证弹窗样式 */
    .manager-verify-modal {
      max-width: 400px;
    }

    .verify-notice {
      text-align: center;
      margin-bottom: 20px;
      padding: 20px;
      background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
      border-radius: 12px;
      border: 2px solid #e3f2fd;
    }

    .verify-notice i {
      font-size: 32px;
      color: #1976d2;
      margin-bottom: 12px;
      display: block;
    }

    .verify-notice p {
      color: #333;
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
    }

    .verify-btn {
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      margin-right: 10px;
    }

    .cancel-btn {
      background: linear-gradient(135deg, #666 0%, #999 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: linear-gradient(135deg, #555 0%, #888 100%);
      transform: translateY(-1px);
    }

    .error-text {
      color: #f44336;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }

  </style>
