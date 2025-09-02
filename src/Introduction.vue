<template>
  <div class="pet-hospital-page">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="header-content">
          <h1 class="hospital-title">德扬宠物医院</h1>
          <p class="hospital-slogan">专业呵护 · 爱心相伴 · 科技守护</p>
          <div class="title-decoration">
            <span class="decoration-dot dot-1"></span>
            <span class="decoration-dot dot-2"></span>
            <span class="decoration-dot dot-3"></span>
          </div>
        </div>
        
        <div class="intro-container">
          <div class="intro-image-wrapper">
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                 alt="医院外观" class="intro-image">
            <div class="intro-overlay"></div>
          </div>
          
          <div class="intro-content">
            <h2>医院简介</h2>
            <div class="intro-text">
              <p><i class="fas fa-heart icon-highlight"></i> 德扬宠物医院成立于2015年，是朝阳区规模最大、设备最先进的综合性宠物医疗机构。医院占地1500平方米，设有眼科、骨科、外科、皮肤科、内科、牙科、肿瘤科和康复科等专科中心。</p>
              <p><i class="fas fa-flask icon-highlight"></i> 我们拥有国际先进的诊疗设备，包括宠物专用CT、DR数字影像系统、全自动生化分析仪等，为宠物提供全方位的医疗健康服务。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 医院特色 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">我们的特色</h2>
        <div class="features-grid">
          <div class="feature-card" style="--card-color: #6c5ce7">
            <div class="feature-icon">
              <i class="fas fa-stethoscope"></i>
            </div>
            <h3>专业医疗团队</h3>
            <p>拥有10年以上临床经验的兽医专家团队，提供专业诊疗服务</p>
          </div>
          
          <div class="feature-card" style="--card-color: #00cec9">
            <div class="feature-icon">
              <i class="fas fa-microscope"></i>
            </div>
            <h3>先进医疗设备</h3>
            <p>引进国际先进诊疗设备，确保诊断准确率和治疗效果</p>
          </div>
          
          <div class="feature-card" style="--card-color: #fd79a8">
            <div class="feature-icon">
              <i class="fas fa-heartbeat"></i>
            </div>
            <h3>24小时急诊</h3>
            <p>全天候急诊服务，随时为您的宠物提供紧急医疗救助</p>
          </div>
          
          <div class="feature-card" style="--card-color: #fdcb6e">
            <div class="feature-icon">
              <i class="fas fa-home"></i>
            </div>
            <h3>舒适住院环境</h3>
            <p>温馨舒适的住院环境，专业的护理团队24小时看护</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 医院概况 -->
    <section class="hospital-overview">
      <div class="container">
        <div class="inner-nav">
          <ul>
            <li v-for="(item, index) in innerNavItems" 
                :key="index"
                :class="{ active: activeNav === item.id }"
                @click="scrollToSection(item.id)"
                :style="{ '--nav-color': ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e'][index] }">
              {{ item.text }}
            </li>
          </ul>
        </div>
        
        <div class="content-sections">
          <!-- 医师团队 -->
          <div id="leadership" class="content-section">
            <h2>医师团队</h2>
            <div class="leadership-content">
              <div class="doctor-layout">
                <div class="sidebar">
                  <ul>
                    <li 
                      v-for="(department, index) in departments" 
                      :key="department.name"
                      :class="{ active: activeDepartment === department.name }"
                      @click="selectDepartment(department.name)"
                      :style="{ '--dept-color': ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#00b894', '#e17055', '#d63031', '#0984e3'][index] }"
                    >
                      <span class="dept-icon" :class="getDepartmentIcon(department.name)"></span>
                      <span class="dept-name">{{ department.name }}</span>
                      <span class="doctor-count">{{ department.doctors.length }}</span>
                    </li>
                  </ul>
                </div>

                <div class="main-content">
                  <div class="department-header">
                    <h3>{{ activeDepartment }}</h3>
                    <p class="dept-description">{{ getDepartmentDescription(activeDepartment) }}</p>
                  </div>

                   <div class="doctor-list">
                    <div class="doctor-card" 
                        :class="{ chief: doctor.title.includes('主任') }"
                        v-for="(doctor, index) in filteredDoctors" 
                        :key="doctor.name"
                        :style="{ '--doctor-color': ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#00b894', '#e17055', '#d63031', '#0984e3'][index] }">
                      
                      <div class="doctor-card-content">
                        <!-- 医生头像区域 -->
                        <div class="doctor-avatar-container">
                          <div class="doctor-avatar" @click="openDoctorModal(doctor)">
                            <img :src="doctor.avatar || defaultAvatar" :alt="doctor.name">
                            <div class="avatar-overlay">
                              <i class="fas fa-eye"></i>
                            </div>
                            <div v-if="doctor.title.includes('主任')" class="chief-badge">
                              <i class="fas fa-crown"></i>
                            </div>
                          </div>
                          
                          <!-- 医生标签 -->
                          <div class="doctor-tags">
                            <span v-for="tag in doctor.tags" :key="tag" class="tag">{{ tag }}</span>
                          </div>
                        </div>
                        
                        <!-- 医生信息区域 -->
                        <div class="doctor-info">
                          <div class="info-header">
                            <h4>{{ doctor.name }}</h4>
                            <p class="title">{{ doctor.title }}</p>
                          </div>
                          
                          <div class="doctor-intro">
                            <p>{{ doctor.introduction || doctor.education }}</p>
                          </div>
                          
                          <div class="doctor-stats">
                            <!-- <div class="stat-item">
                              <i class="fas fa-award"></i>
                              <span>{{'10年+' }}经验</span>
                            </div> -->
                            <!-- <div class="stat-item">
                              <i class="fas fa-star"></i>
                              <span>4.9评分</span>
                            </div> -->
                          </div>
                          
                          <div class="doctor-action">
                            <button class="detail-btn" @click="openDoctorModal(doctor)">
                              <i class="fas fa-user-md"></i> 查看详情
                            </button> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 弹窗 -->
          <!-- 美化版医生详情弹窗 -->
          <transition name="modal-fade">
            <div
              v-if="selectedDoctor"
              class="doctor-modal"
              @click.self="closeModal"
            >
              <div class="modal-content">
                <!-- 顶部头像 + 姓名 -->
                <div class="modal-header">
                  <div class="avatar-wrapper">
                    <img :src="selectedDoctor.avatar" alt="avatar" />
                  </div>
                  <div class="header-info">
                    <h3 class="doctor-name">{{ selectedDoctor.name }}</h3>
                    <p class="doctor-title">{{ selectedDoctor.title }}</p>
                    <div class="tag-group">
                      <span
                        v-for="tag in selectedDoctor.tags"
                        :key="tag"
                        class="tag"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <button class="close-btn" @click="closeModal">
                    <i class="fas fa-times"></i>
                  </button>
                </div>

                <!-- 竖向排列的详细信息 -->
                <div class="modal-body">
                  <section class="info-section">
                    <h4 class="section-title">简介</h4>
                    <p class="intro">{{ selectedDoctor.introduction }}</p>
                  </section>

                  <section class="info-section">
                    <h4 class="section-title">专业领域</h4>
                    <p>{{ selectedDoctor.specialty }}</p>
                  </section>

                  <section class="info-section">
                    <h4 class="section-title">临床经验</h4>
                    <p>{{ selectedDoctor.experience }}</p>
                  </section>

                  <section class="info-section">
                    <h4 class="section-title">成就</h4>
                    <p>{{ selectedDoctor.achievements }}</p>
                  </section>

                  
                </div>
              </div>
            </div>
          </transition>
          <!-- 组织架构 -->
          <div id="structure" class="content-section">
            <h2>组织架构</h2>
            <div class="structure-content">
              <div class="org-chart">
                <div class="org-level">
                  <div class="org-node top-node">
                    <div class="node-content">
                      <h4>院长</h4>
                      <p>张明 教授</p>
                    </div>
                  </div>
                </div>
                
                <div class="org-connectors">
                  <div class="connector"></div>
                  <div class="connector"></div>
                  <div class="connector"></div>
                </div>
                
                <div class="org-level">
                  <div class="org-node" style="--node-color: #6c5ce7">
                    <div class="node-content">
                      <h4>医疗副院长</h4>
                      <p>李伟 教授</p>
                      <div class="node-sub">负责医疗业务管理</div>
                    </div>
                  </div>
                  
                  <div class="org-node" style="--node-color: #00cec9">
                    <div class="node-content">
                      <h4>行政副院长</h4>
                      <p>王芳 教授</p>
                      <div class="node-sub">负责行政管理</div>
                    </div>
                  </div>
                  
                  <div class="org-node" style="--node-color: #fdcb6e">
                    <div class="node-content">
                      <h4>后勤副院长</h4>
                      <p>赵强 教授</p>
                      <div class="node-sub">负责后勤保障</div>
                    </div>
                  </div>
                </div>
                
                <div class="org-connectors">
                  <div class="connector"></div>
                  <div class="connector"></div>
                  <div class="connector"></div>
                </div>
                
                <div class="org-level">
                  <!-- 医疗部门（两列网格） -->
                  <div class="org-subgroup medical-grid">
                    <h5>医疗部门</h5>
                    <div class="org-subnodes two-columns">
                      <div class="org-node sub-node" style="--node-color: #6c5ce7">
                        <div class="node-content"><h4>内科</h4><p>主任医师3名</p></div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #a29bfe">
                        <div class="node-content"><h4>外科</h4><p>主任医师3名</p></div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #00cec9">
                        <div class="node-content"><h4>眼科</h4><p>主任医师2名</p></div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #81ecec">
                        <div class="node-content"><h4>口腔科</h4><p>主任医师2名</p></div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #fd79a8">
                        <div class="node-content"><h4>肿瘤科</h4><p>主任医师2名</p></div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #fdcb6e">
                        <div class="node-content"><h4>皮肤科</h4><p>主任医师2名</p></div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #00b894">
                        <div class="node-content"><h4>影像科</h4><p>主任医师2名</p></div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #e17055">
                        <div class="node-content"><h4>康复科</h4><p>主任医师2名</p></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="org-subgroup">
                    <h5>行政部门</h5>
                    <div class="org-subnodes">
                      <div class="org-node sub-node" style="--node-color: #fd79a8">
                        <div class="node-content">
                          <h4>人力资源</h4>
                          <p>主管3名</p>
                        </div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #fab1a0">
                        <div class="node-content">
                          <h4>财务部</h4>
                          <p>主管2名</p>
                        </div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #ff7675">
                        <div class="node-content">
                          <h4>客户服务</h4>
                          <p>主管5名</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="org-subgroup">
                    <h5>后勤部门</h5>
                    <div class="org-subnodes">
                      <div class="org-node sub-node" style="--node-color: #fdcb6e">
                        <div class="node-content">
                          <h4>设备管理</h4>
                          <p>主管3名</p>
                        </div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #ffeaa7">
                        <div class="node-content">
                          <h4>后勤保障</h4>
                          <p>主管2名</p>
                        </div>
                      </div>
                      <div class="org-node sub-node" style="--node-color: #00b894">
                        <div class="node-content">
                          <h4>安全管理</h4>
                          <p>主管5名</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 医院文化 -->
          <div id="culture" class="content-section">
            <h2>医院文化</h2>
            <div class="culture-content">
              <div class="culture-cards">
                <div class="culture-card" style="--card-color: #6c5ce7">
                  <div class="culture-icon">
                    <i class="fas fa-heart"></i>
                  </div>
                  <h3>爱心</h3>
                  <p>我们视每只宠物为家人，用爱心和专业守护它们的健康</p>
                </div>
                
                <div class="culture-card" style="--card-color: #00cec9">
                  <div class="culture-icon">
                    <i class="fas fa-hand-holding-heart"></i>
                  </div>
                  <h3>责任</h3>
                  <p>对每一个生命负责，提供专业、可靠的医疗服务</p>
                </div>
                
                <div class="culture-card" style="--card-color: #fd79a8">
                  <div class="culture-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <h3>协作</h3>
                  <p>团队协作，多学科联合诊疗，提供最佳治疗方案</p>
                </div>
                
                <div class="culture-card" style="--card-color: #fdcb6e">
                  <div class="culture-icon">
                    <i class="fas fa-lightbulb"></i>
                  </div>
                  <h3>创新</h3>
                  <p>不断引进新技术，提升诊疗水平和服务质量</p>
                </div>
              </div>
              
              <div class="culture-quote">
                <div class="quote-content">
                  <i class="fas fa-quote-left"></i>
                  <p>我们的使命是成为宠物健康最值得信赖的守护者，用专业和爱心创造宠物与主人更美好的生活</p>
                  <div class="quote-author">
                    <div class="author-avatar">
                      <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face" alt="院长">
                    </div>
                    <div class="author-info">
                      <h4>张明</h4>
                      <p>德扬宠物医院院长</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 医院历史 - 整合美化版 -->
          <div id="history" class="content-section">
            <h2>医院历史</h2>
            <div class="history-content">
              <div class="timeline-container">
                <div class="timeline-item" v-for="(item, index) in historyItems" :key="index"
                    :style="{ '--timeline-color': ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#00b894', '#e17055', '#d63031'][index] }">
                  <div class="timeline-date">{{ item.year }}</div>
                  <div class="timeline-content">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 预约横幅 -->
    <section class="appointments-banner">
      <div class="container">
        <div class="banner-content">
          <h2>立即预约专业宠物诊疗服务</h2>
          <p>我们的专业团队随时准备为您的爱宠提供最好的医疗服务</p>
          <router-link to="/appointment" class="appointments-btn">
            <i class="fas fa-calendar-check"></i> 在线预约
          </router-link>
        </div>
      </div>
    </section>

    <!-- 底部信息 -->
    <footer class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-info">
            <h3><i class="fas fa-paw"></i> 德扬宠物医院</h3>
            <p>专业呵护 · 爱心相伴 · 科技守护</p>
            <br></br>
            <div class="contact-info">
              <p><i class="fas fa-map-marker-alt"></i> 北京市朝阳区西街路123号</p>
              <p><i class="fas fa-phone-alt"></i> 400-123-4567</p>
              
            </div>
          </div>
          
          <div class="footer-hours">
            <h4>营业时间</h4>
            <ul>
              <li><span>周一至周五</span> <span>8:30 - 20:00</span></li>
              <li><span>周六至周日</span> <span>9:00 - 18:00</span></li>
              <li><span>急诊服务</span> <span>24小时</span></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/forum">宠物论坛</a></li>
              <li><a href="/adaptpet">领养宠物</a></li>
              <li><a href="/questionnaire">问卷调查</a></li>
              <li><a href="/shopment">购物</a></li>
            </ul>
          </div>
          
          <!-- <div class="footer-social">
            <h4>关注我们</h4>
            <div class="social-icons">
              <a href="#" style="--social-color: #25d366"><i class="fab fa-weixin"></i></a>
              <a href="#" style="--social-color: #e1306c"><i class="fab fa-weibo"></i></a>
              <a href="#" style="--social-color: #12b7f5"><i class="fab fa-qq"></i></a>
              <a href="#" style="--social-color: #0077b5"><i class="fab fa-douban"></i></a>
            </div>
            <div class="qrcode">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aichong.com" alt="微信公众号">
              <p>扫码关注公众号</p>
            </div>
          </div> -->
        </div>
        
        <div class="footer-bottom">
          <p>© 2025 德扬宠物医院 版权所有 </p>
        </div>
      </div>
    </footer>
    
  </div>
</template>

<script>
import { departments} from '/src/doctorData.js';
export default {
  name: 'PetHospitalOverview',
  name: 'DoctorCards',
  props: {
    //filteredDoctors: Array,
    //defaultAvatar: String
  },
  data() {
    return {
      selectedDoctor: null,
      departments:departments, 
      innerNavItems: [
        { id: 'leadership', text: '医师团队' },
        { id: 'structure', text: '组织架构' },
        { id: 'culture', text: '医院文化' },
        { id: 'history', text: '医院历史' }
      ],
      activeNav: 'leadership',
      defaultAvatar: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
      activeDepartment: '眼科',
      departmentDescriptions: {
        '眼科': '拥有先进的眼科检查设备，可进行各种眼部疾病的诊断和治疗，包括白内障手术、青光眼治疗等。',
        '内科': '提供全面的内科疾病诊断和治疗服务，包括消化系统、呼吸系统、内分泌系统等疾病。',
        '外科': '提供各类外科手术治疗服务，包括软组织手术、骨科手术、肿瘤切除等。',
        '肿瘤科': '专业诊断和治疗各类宠物肿瘤疾病，提供化疗、放疗及综合治疗方案。',
        '皮肤科': '专业治疗各类宠物皮肤疾病，包括过敏、寄生虫感染、真菌感染等。',
        '影像科': '提供专业的影像诊断服务，包括X光、CT、MRI、超声波等影像学检查。',
        '康复科': '提供宠物术后康复、物理治疗和康复训练服务，帮助宠物恢复健康。',
        '牙科': '提供专业的口腔保健和治疗服务，包括牙齿清洁、拔牙、口腔肿瘤切除等。'
      },
      historyItems: [
        {
          year: '2015',
          title: '医院成立',
          description: '德扬宠物医院正式成立，初期设有3个科室，5名专业兽医'
        },
        {
          year: '2017',
          title: '扩大规模',
          description: '医院扩建至800平方米，新增骨科和眼科中心，引进先进医疗设备'
        },
        {
          year: '2019',
          title: '获得认证',
          description: '通过国际宠物医疗质量认证，成为本地区首家获得该认证的宠物医院'
        },
        {
          year: '2021',
          title: '再次扩建',
          description: '医院扩建至1500平方米，新增口腔科和神经外科中心'
        },
        {
          year: '2023',
          title: '数字化升级',
          description: '全面升级医疗系统，引入AI辅助诊断技术，提升诊疗效率'
        },
        {
          year: '2024',
          title: '新院区启用',
          description: '第二院区正式投入使用，提供更全面的宠物医疗服务'
        }
      ]
    }
  },
  computed: {
    filteredDoctors() {
      const dept = this.departments.find(d => d.name === this.activeDepartment);
      return dept ? dept.doctors : [];
    }
  },
  methods: {
    getDepartmentIcon(name) {
      const icons = {
        '眼科': 'fas fa-eye',
        '内科': 'fas fa-heartbeat',
        '外科': 'fas fa-cut',
        '肿瘤科': 'fas fa-dna',
        '皮肤科': 'fas fa-allergies',
        '影像科': 'fas fa-x-ray',
        '康复科': 'fas fa-walking',
        '牙科': 'fas fa-tooth'
      };
      return icons[name] || 'fas fa-stethoscope';
    },
    scrollToSection(sectionId) {
      this.activeNav = sectionId;
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    selectDepartment(name) {
      this.activeDepartment = name;
      const container = document.querySelector('.main-content');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    getDepartmentDescription(name) {
      return this.departmentDescriptions[name] || '';
    },
    openDoctorModal(doctor) {
      this.selectedDoctor = doctor;
    },
    closeModal() {
        this.selectedDoctor = null;
    },
    
  },
  mounted() {
    document.querySelector('.pet-hospital-page').style.opacity = '1';
  }
}
</script>

<style scoped>
/* 基础变量 */
:root {
  --primary-color: #6c5ce7;
  --primary-light: rgba(108, 92, 231, 0.1);
  --secondary-color: #00cec9;
  --accent-color: #fd79a8;
  --tertiary-color: #fdcb6e;
  --success-color: #00b894;
  --info-color: #0984e3;
  --warning-color: #e17055;
  --danger-color: #d63031;
  --light-bg: #f8f9fa;
  --dark-text: #2d3436;
  --light-text: #636e72;
  --border-radius: 16px;
  --box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  --gradient-primary: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  --gradient-secondary: linear-gradient(135deg, #00cec9 0%, #81ecec 100%);
  --gradient-accent: linear-gradient(135deg, #fd79a8 0%, #fab1a0 100%);
}

/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--dark-text);
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄区域 */
.hero-section {
  position: relative;
  min-height: 90vh;
  background: linear-gradient(rgba(255, 255, 255, 0.1)), 
              url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80') no-repeat center/cover;
  display: flex;
  align-items: center;
  padding: 120px 20px 60px;
  color: white;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.3) 0%, rgba(162, 155, 254, 0.2) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.header-content {
  text-align: center;
  animation: fadeInUp 1s ease;
}

.hospital-title {
  font-size: 4.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    0 2px 15px rgba(244, 245, 242, 0.5),
    0 4px 30px rgba(249, 241, 241, 0.4);
  letter-spacing: 2px;
  margin-top: 20px;
  background: linear-gradient(135deg, white 0%, #f8f9fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  padding: 0 20px;
}

.hospital-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 5px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 3px;
}

.hospital-slogan {
  font-size: 1.8rem;
  margin-top: 30px;
  opacity: 0.95;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  letter-spacing: 1px;
  font-weight: 300;
  font-style: italic;
}

.title-decoration {
  display: flex;
  justify-content: center;
  margin-top: 35px;
  gap: 20px;
}

.decoration-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  opacity: 0.9;
  animation: pulse 2s infinite ease-in-out;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.3s; }
.dot-3 { animation-delay: 0.6s; }

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.5); opacity: 1; }
}

/* 医院简介 */
.intro-container {
  position: relative;
  margin-top: 40px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  height: 400px;
}

.intro-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.intro-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.intro-container:hover .intro-image {
  transform: scale(1.05);
}

.intro-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(108, 92, 231, 0.2), rgba(108, 92, 231, 0.7));
}

.intro-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px;
  color: white;
  z-index: 2;
}

.intro-content h2 {
  color: white;
  font-size: 2.2rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.intro-text {
  max-width: 800px;
}

.intro-text p {
  color: white;
  line-height: 1.8;
  margin-bottom: 20px;
  position: relative;
  padding-left: 35px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.icon-highlight {
  color: var(--accent-color);
  margin-right: 10px;
  position: absolute;
  left: 0;
  font-size: 1.2rem;
  top: 3px;
  transition: var(--transition);
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
}

.intro-text p:hover .icon-highlight {
  transform: scale(1.2) rotate(10deg);
  color: white;
}

.read-more-btn {
  background: linear-gradient(90deg, var(--accent-color) 0%, #ff9fbe 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition);
  box-shadow: 0 5px 15px rgba(253, 121, 168, 0.4);
  font-weight: 600;
}

.read-more-btn:hover {
  background: linear-gradient(90deg, #ff9fbe 0%, var(--accent-color) 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(253, 121, 168, 0.6);
}

/* 特色区域 */
.features-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #eef1f9 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.features-section::before {
  content: '';
  position: absolute;
  top: -200px;
  left: -200px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(108, 92, 231, 0.1) 0%, transparent 70%);
}

.features-section::after {
  content: '';
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 206, 201, 0.1) 0%, transparent 70%);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: var(--dark-text);
  position: relative;
  z-index: 2;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  position: relative;
  z-index: 2;
}

.feature-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 30px;
  text-align: center;
  transition: var(--transition);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--card-color, var(--primary-color));
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--card-color, var(--primary-color)) 0%, rgba(255,255,255,0.2) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.feature-card h3 {
  margin: 15px 0;
  color: var(--dark-text);
  font-weight: 700;
}

.feature-card p {
  color: var(--light-text);
}

/* 医院概况 */
.hospital-overview {
  padding: 80px 0;
  background: linear-gradient(135deg, #eef1f9 0%, #f8f9fa 100%);
  position: relative;
}

.inner-nav {
  margin-bottom: 40px;
  border-radius: var(--border-radius);
  background: white;
  padding: 10px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.inner-nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
}

.inner-nav li {
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--light-text);
  position: relative;
  transition: all 0.3s ease;
  font-weight: 500;
}

.inner-nav li:hover {
  color: var(--nav-color, var(--primary-color));
}

.inner-nav li.active {
  color: var(--nav-color, var(--primary-color));
  font-weight: 600;
}

.inner-nav li.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--nav-color, var(--primary-color));
}

.content-sections {
  margin-top: 30px;
}

.content-section {
  margin-bottom: 60px;
  padding: 30px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--primary-color);
}

.content-section h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  font-size: 2rem;
}

/* 医师团队 */
.leadership-content {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.doctor-layout {
  display: flex;
  gap: 30px;
}

.sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar li {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 12px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.1);
}

.sidebar li:hover {
  background: rgba(255,255,255,0.2);
  color: white;
  transform: translateX(5px);
}

.sidebar li.active {
  background: var(--dept-color, var(--primary-color));
  color: white;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.dept-icon {
  margin-right: 15px;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  color: white;
}

.dept-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doctor-count {
  background-color: rgba(255,255,255,0.2);
  color: white;
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 0.8rem;
  margin-left: 10px;
  font-weight: 500;
}

.sidebar li.active .doctor-count {
  background-color: rgba(0,0,0,0.2);
}

.main-content {
  flex: 1;
}

.department-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.department-header h3 {
  font-size: 1.8rem;
  color: var(--dark-text);
  margin-bottom: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.department-header h3::after {
  content: '';
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), transparent);
  margin-left: 15px;
}

.dept-description {
  color: var(--light-text);
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 25px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.doctor-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  padding: 20px 0;
}
.doctor-list::-webkit-scrollbar {
  width: 6px;
}

.doctor-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.doctor-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.doctor-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.doctor-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.doctor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.doctor-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--doctor-color, var(--primary-color)), #a29bfe);
  z-index: 1;
}


.doctor-card-content {
  display: flex;
  width: 100%;
  padding: 15px;
  position: relative;
  
}


.doctor-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  flex-shrink: 0;
}
.doctor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.doctor-card:hover .doctor-avatar {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(108, 92, 231, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.5rem;
}
.doctor-avatar:hover .avatar-overlay {
  opacity: 1;
}

.doctor-avatar:hover img {
  transform: scale(1.1);
}
.doctor-avatar::after {
  content: "";
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 24px;
  height: 24px;
  background-color: var(--accent-color);
  border-radius: 50%;
  border: 3px solid white;
  display: var(--badge-display, none);
}

.doctor-card.chief .doctor-avatar::after {
  --badge-display: block;
}
.doctor-card.chief {
  border: 2px solid #fdcb6e;
  box-shadow: 0 5px 20px rgba(253, 203, 110, 0.2);
}
.doctor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.doctor-info h4 {
  font-size: 1.1rem;
  color: var(--dark-text);
  margin: 0 0 5px 0;
  font-weight: 700;
}

.doctor-info .title {
  font-size: 0.85rem;
  color: var(--doctor-color, var(--primary-color));
  font-weight: 600;
  margin: 0 0 10px 0;
}

.doctor-intro {
  margin-bottom: 15px;
  flex-grow: 1;
}
.doctor-intro p {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  /* -webkit-line-clamp: 3; */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chief-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  border: 2px solid white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  z-index: 2;
}
.info-header {
  margin-bottom: 12px;
}

.info-header h4 {
  font-size: 1.2rem;
  color: var(--dark-text);
  margin: 0 0 5px 0;
  font-weight: 700;
}

.info-header .title {
  font-size: 0.9rem;
  color: var(--doctor-color, var(--primary-color));
  font-weight: 600;
  margin: 0;
}

.doctor-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  max-width: 100px;
}

.doctor-tags span {
  background: rgba(var(--doctor-rgb, 108, 92, 231), 0.1);
  color: var(--doctor-color, var(--primary-color));
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.doctor-action {
  margin-top: 10px;
  align-self: flex-end;
}

.detail-btn {
  background: linear-gradient(to right, var(--doctor-color, var(--primary-color)), rgba(var(--doctor-rgb, 108, 92, 231), 0.8));
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
/* 弹窗 */

.doctor-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 95%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: rgb(213, 209, 209);
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--primary-color);
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.doctor-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}

.doctor-info {
  text-align: center;
  width: 100%;
}

.doctor-info p {
  margin: 10px 0;
  font-size: 1rem;
}
.tag {
  background: rgba(var(--doctor-rgb, 108, 92, 231), 0.1);
  color: var(--doctor-color, var(--primary-color));
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

/* ===== 弹窗动效与美化 ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}



.modal-content {
  width: 95%;
  max-width: 600px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 顶部 */
.modal-header {
  display: flex;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  color: #fff;
  gap: 16px;

}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.header-info {
  flex: 1;
}

.doctor-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.doctor-title {
  margin: 0 0 8px;
  opacity: 0.9;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  .tag {
    background: rgba(#fff, 0.2);
    color: #fff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
  }
}



/* 主体 */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  text-align: center;
}

.info-section {
  margin-bottom: 20px;
  text-align: center; /* 确保标题和内容都居中 */
}

.info-section .section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #6c5ce7;
  margin-bottom: 8px;
  display: block; /* 确保是块级元素 */
  text-align: center;
}

.info-section p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  text-align: center;
  max-width: 500px;
  margin: 0 auto; /* 让段落本身居中 */
}






/* 组织架构 */
.structure-content {
  padding: 20px;
}

.org-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.org-level {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;
  gap: 40px;
}

.org-connectors {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;
}

.connector {
  width: 2px;
  height: 40px;
  background: var(--primary-color);
  position: relative;
}

.connector::before {
  content: '';
  position: absolute;
  top: 0;
  left: -8px;
  width: 18px;
  height: 2px;
  background: var(--primary-color);
}

.org-node {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-width: 200px;
  text-align: center;
  position: relative;
  transition: var(--transition);
  border-top: 4px solid var(--node-color, var(--primary-color));
}

.org-node:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.top-node {
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  color: white;
  padding: 30px 40px;
  border-top: none;
}

.top-node h4 {
  font-size: 1.5rem;
}

.node-content h4 {
  margin-bottom: 10px;
  color: var(--dark-text);
  font-weight: 700;
}

.top-node .node-content h4,
.top-node .node-content p {
  color: white;
}

.node-sub {
  font-size: 0.9rem;
  color: var(--light-text);
  margin-top: 10px;
  font-style: italic;
}

.org-subgroup {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.org-subgroup h5 {
  margin-bottom: 15px;
  color: var(--primary-color);
  font-weight: 600;
  background: #f8f9fa;
  padding: 8px 20px;
  border-radius: 20px;
  display: inline-block;
}

.org-subnodes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.sub-node {
  min-width: 180px;
  background: white;
  border-top: 4px solid var(--node-color, var(--secondary-color));
}

/* 医院文化 */
.culture-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.culture-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.culture-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--card-color, var(--primary-color));
}

.culture-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.culture-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--card-color, var(--primary-color)) 0%, rgba(255,255,255,0.2) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.culture-card h3 {
  margin-bottom: 15px;
  color: var(--dark-text);
  font-weight: 700;
}

.culture-quote {
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  border-radius: var(--border-radius);
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(108, 92, 231, 0.3);
}

.quote-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.quote-content i {
  font-size: 3rem;
  opacity: 0.2;
  position: absolute;
  top: -20px;
  left: -20px;
  color: white;
}

.quote-content p {
  font-size: 1.4rem;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 30px;
  position: relative;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.quote-author {
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  border: 3px solid rgba(255,255,255,0.3);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

/* 医院历史 - 整合美化版 */
.history-content {
  padding: 20px;
}

.timeline-container {
  background: white;
  border-radius: var(--border-radius);
  padding: 30px;
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); */
  position: relative;
  height: 1500px;
}

.timeline-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #6c5ce7, #00cec9, #fd79a8, #fdcb6e, #00b894, #e17055, #d63031);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
  width: 50%;
  clear: both;
}

.timeline-item:nth-child(odd) {
  float: left;
  padding-right: 30px;
  text-align: right;
}

.timeline-item:nth-child(even) {
  float: right;
  padding-left: 30px;
  text-align: left;
}

.timeline-date {
  background: var(--timeline-color, var(--primary-color));
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  font-size: 1.1rem;
  position: relative;
  z-index: 2;
}

.timeline-content {
  background: linear-gradient(135deg, white 0%, #f8f9fa 100%);
  border-radius: var(--border-radius);
  padding: 25px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  border-left: 4px solid var(--timeline-color, var(--primary-color));
  transition: all 0.4s ease;
  z-index: 2;
}

.timeline-item:nth-child(odd) .timeline-content {
  border-left: none;
  border-right: 4px solid var(--timeline-color, var(--primary-color));
}

.timeline-content::before {
  content: '';
  position: absolute;
  top: 20px;
  width: 25px;
  height: 25px;
  background: var(--timeline-color, var(--primary-color));
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 0 0 3px var(--timeline-color, var(--primary-color));
  z-index: 3;
}

.timeline-item:nth-child(odd) .timeline-content::before {
  right: -45px;
}

.timeline-item:nth-child(even) .timeline-content::before {
  left: -45px;
}

.timeline-content h3 {
  color: var(--timeline-color, var(--primary-color));
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 1.4rem;
}

.timeline-content p {
  color: var(--dark-text);
  line-height: 1.7;
}

.timeline-item:hover .timeline-content {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.timeline-item:hover .timeline-date {
  transform: scale(1.05);
}

/* 预约横幅 */
/* 预约横幅 */
.appointments-banner {
  background: linear-gradient(90deg, #6c5ce7 0%, #00cec9 50%, #fd79a8 100%);
  padding: 60px 0;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.appointments-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(30deg);
}

.banner-content {
   display: flex;
  flex-direction: column; /* 从上到下排列 */
  align-items: center;    /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  gap: 5px;              /* 元素间距 */
  position: relative;
  z-index: 2;
}

.banner-content h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.banner-content p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.appointments-btn {
  background: rgb(22, 21, 21);
  color: var(--primary-color);
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition);
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
}

.appointments-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  transition: 0.5s;
}

.appointments-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.appointments-btn:hover::before {
  left: 100%;
}

/* 底部信息 */
.main-footer {
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  color: white;
  padding: 60px 0 0;
  position: relative;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 0px;
  position: relative;
  z-index: 2;
}

.footer-info h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  color: white;
}

.footer-info h3 i {
  margin-right: 10px;
  color: var(--accent-color);
}

.footer-info p {
  color: rgba(255,255,255,0.8);
}

.contact-info p {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.8);
}

.contact-info i {
  margin-right: 10px;
  width: 20px;
  color: var(--secondary-color);
}

.footer-hours h4,
.footer-links h4,
.footer-social h4 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
  color: white;
  padding-left: 150px;
 
}

.footer-hours h4::after,
.footer-links h4::after,
.footer-social h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--secondary-color);
}

.footer-hours ul {
  list-style: none;
}

.footer-hours li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
  margin-left: 150px;
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
  padding-left: 5px;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  transition: var(--transition);
}

.social-icons a:hover {
  background: var(--social-color, var(--secondary-color));
  transform: translateY(-5px);
}

.qrcode {
  text-align: center;
  margin-top: 20px;
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 10px;
}

.qrcode img {
  width: 150px;
  height: 150px;
  background: white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.qrcode p {
  color: rgba(255,255,255,0.8);
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 20px 0;
  text-align: center;
  color: rgba(255,255,255,0.6);
  position: relative;
  z-index: 2;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .doctor-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .doctor-card {
    height: 160px;
  }
  
  .doctor-avatar {
    width: 70px;
    height: 70px;
  }
  
  .hospital-title {
    font-size: 3.5rem;
  }
  
  .intro-container {
    height: 250px;
  }
}

@media (max-width: 1024px) {
  .doctor-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    margin-bottom: 30px;
    position: static;
  }
  
  .sidebar ul {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .sidebar li {
    white-space: nowrap;
    margin-bottom: 0;
    padding: 15px 25px;
    min-width: 160px;
  }
  
  .doctor-list {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  .timeline-container::before {
    left: 30px;
  }
  
  .timeline-item {
    width: 100%;
    padding-left: 70px;
    padding-right: 0;
    text-align: left;
    float: none !important;
  }
  
  .timeline-item:nth-child(odd) .timeline-content::before,
  .timeline-item:nth-child(even) .timeline-content::before {
    left: 20px;
  }
}

@media (max-width: 768px) {
  .hospital-title {
    font-size: 2.8rem;
  }
  
  .hospital-slogan {
    font-size: 1.2rem;
  }
  
  .doctor-card-content {
  display: flex;
  padding: 20px;
  position: relative;
}
  
  .doctor-avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .doctor-tags {
    justify-content: center;
  }
  
  .doctor-action {
    justify-content: center;
  }
  
  .intro-container {
    height: 350px;
  }
  
  .intro-content {
    padding: 25px;
  }
  
  .intro-content h2 {
    font-size: 1.8rem;
  }
  
  .hero-section {
    padding: 60px 20px;
    min-height:50vh;
  }
  
  .inner-nav ul {
    flex-wrap: wrap;
  }
  
  .inner-nav li {
    padding: 10px 15px;
    font-size: 1rem;
  }
  
  .content-section {
    padding: 20px;
  }

  .doctor-list {
    grid-template-columns: 1fr;
  }
  
  .doctor-card {
    height: auto;
  }
}

@media (max-width: 480px) {
  .hospital-title {
    font-size: 2.2rem;
  }
  
  .hospital-slogan {
    font-size: 1rem;
  }
  
  .intro-content {
    padding: 20px;
  }
  
  .intro-content p {
    padding-left: 30px;
  }
  
  .icon-highlight {
    font-size: 1.1rem;
  }
  
  .content-section {
    padding: 20px;
  }
  
  .doctor-card-content {
    padding: 15px;
  }
  
  .doctor-avatar {
    width: 80px;
    height: 80px;
  }
  
  .sidebar li {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
  
  .intro-container {
    height: 300px;
  }
  
  .intro-text p {
    padding-left: 30px;
    font-size: 0.95rem;
  }
  
  .read-more-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .timeline-date {
    padding: 8px 16px;
    font-size: 1rem;
  }
  
  .timeline-content {
    padding: 20px;
  }
}
/* 医疗部门两列网格 */
.two-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
}
.doctor-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #777;
}

.stat-item i {
  color: var(--doctor-color, var(--primary-color));
  font-size: 0.7rem;
}

.doctor-action {
  display: flex;
  gap: 10px;
}

.detail-btn{
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

.detail-btn {
  background: linear-gradient(to right, var(--doctor-color, var(--primary-color)), rgba(var(--doctor-rgb, 108, 92, 231), 0.8));
  color: white;
  border: none;
  flex: 2;
}



.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}



/* 响应式设计 */
@media (max-width: 768px) {
  .doctor-list {
    grid-template-columns: 1fr;
  }
  
  .doctor-card-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .doctor-avatar-container {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .doctor-tags {
    max-width: 100%;
    justify-content: center;
  }
  
  .doctor-stats {
    justify-content: center;
  }
  
  .doctor-action {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .doctor-card-content {
    padding: 15px;
  }
  
  .doctor-avatar {
    width: 85px;
    height: 85px;
  }
  
  .doctor-action {
    flex-direction: column;
    width: 100%;
  }
  
  .detail-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>