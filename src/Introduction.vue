<template>
  <div class="pet-hospital-page">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
         <div class="header-content">
            <h1 class="hospital-title">爱宠宠物医院</h1>
            <p class="hospital-slogan">专业呵护 · 爱心相伴 · 科技守护</p>
            <div class="title-decoration">
              <span class="decoration-dot dot-1"></span>
              <span class="decoration-dot dot-2"></span>
              <span class="decoration-dot dot-3"></span>
            </div>
          </div>
        
        <div class="intro-container">
          <div class="intro-image-wrapper">
            <img src="/src/assets/cat.jpg"
                 alt="医院外观" class="intro-image">
            <div class="intro-overlay"></div>
          </div>
          
          <div class="intro-content">
            <h2>医院简介</h2>
            <div class="intro-text">
              <p><i class="fas fa-heart icon-highlight"></i> 爱宠宠物医院成立于2015年，是XX地区规模最大、设备最先进的综合性宠物医疗机构。医院占地1500平方米，设有眼科、骨科、外科、皮肤科、内科、心肺科、口腔科和神经外科等专科中心。</p>
              <p><i class="fas fa-flask icon-highlight"></i> 我们拥有国际先进的诊疗设备，包括宠物专用CT、DR数字影像系统、全自动生化分析仪等，为宠物提供全方位的医疗健康服务。</p>
              <button class="read-more-btn" @click="showFullIntro = true">
                查看更多 <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="hospital-overview">
      <div class="inner-nav">
        <ul>
          <li v-for="(item, index) in innerNavItems" 
              :key="index"
              :class="{ active: activeNav === item.id }"
              @click="scrollToSection(item.id)">
            {{ item.text }}
          </li>
        </ul>
      </div>
      
      <div class="content-sections">
        <div id="leadership" class="content-section">
          <h2>医师团队</h2>
          <div class="leadership-content">
            <div class="doctor-layout">
              <div class="sidebar">
                <ul>
                  <li 
                    v-for="department in departments" 
                    :key="department.name"
                    :class="{ active: activeDepartment === department.name }"
                    @click="selectDepartment(department.name)"
                  >
                    <span class="dept-icon" :class="getDepartmentIcon(department.name)"></span>
                    <span class="dept-name">{{ department.name }}</span>
                    <span class="doctor-count">{{ department.doctors.length }}</span>
                  </li>
                </ul>
              </div>

              <div class="main-content">
                <div class="department-header">
                  <h3>{{ activeDepartment }} <span v-if="activeSubDepartment" class="sub-dept">- {{ activeSubDepartment }}</span></h3>
                  <p class="dept-description">{{ getDepartmentDescription(activeDepartment) }}</p>
                  
                  <div class="sub-departments" v-if="currentSubDepartments.length">
                    <span 
                      v-for="sub in currentSubDepartments" 
                      :key="sub"
                      :class="{ active: activeSubDepartment === sub }"
                      @click="selectSubDepartment(sub)"
                    >
                      {{ sub }}
                    </span>
                  </div>
                </div>

                <div class="doctor-list">
                  <div class="doctor-card" :class="{ chief: doctor.title.includes('主任') }"
                      v-for="doctor in filteredDoctors" 
                      :key="doctor.name">
                    <div class="doctor-card-content">
                      <div class="doctor-avatar">
                        <img :src="doctor.avatar || defaultAvatar" :alt="doctor.name">
                      </div>
                      <div class="doctor-info">
                        <h4>{{ doctor.name }} <span class="title">{{ doctor.title }}</span></h4>
                        <p class="doctor-intro">{{ doctor.introduction || doctor.education }}</p>
                        <div class="doctor-tags" v-if="doctor.tags">
                          <span v-for="tag in doctor.tags" :key="tag">{{ tag }}</span>
                        </div>
                        <div class="doctor-action">
                          <button 
                            class="detail-btn"
                            @click="openDoctorModal(doctor)">
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
        
        <div id="structure" class="content-section">
          <h2>组织架构</h2>
          <div class="structure-content">
            <!-- 组织架构内容 -->
          </div>
        </div>
        
        <div id="culture" class="content-section">
          <h2>医院文化</h2>
          <div class="culture-content">
            <!-- 医院文化内容 -->
          </div>
        </div>
        
        <div id="history" class="content-section">
          <h2>医院历史</h2>
          <div class="history-content">
            <!-- 医院历史内容 -->
          </div>
        </div>
      </div>
    </section>

    <!-- 医生详情弹窗 -->
    <div class="doctor-modal" v-if="selectedDoctor" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-header">
          <div class="modal-avatar">
            <img :src="selectedDoctor.avatar || defaultAvatar" :alt="selectedDoctor.name">
          </div>
          <div class="modal-title">
            <h3>{{ selectedDoctor.name }}</h3>
            <p class="doctor-title">{{ selectedDoctor.title }}</p>
            <div class="doctor-tags">
              <span v-for="tag in selectedDoctor.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div class="doctor-section">
            <h4><i class="fas fa-graduation-cap"></i> 教育背景</h4>
            <p>{{ selectedDoctor.education || '暂无教育背景信息' }}</p>
          </div>
          <div class="doctor-section">
            <h4><i class="fas fa-briefcase"></i> 专业领域</h4>
            <p>{{ selectedDoctor.specialty || selectedDoctor.introduction || '暂无专业领域信息' }}</p>
          </div>
          <div class="doctor-section">
            <h4><i class="fas fa-award"></i> 学术成就</h4>
            <p>{{ selectedDoctor.achievements || '暂无学术成就信息' }}</p>
          </div>
          <div class="doctor-section">
            <h4><i class="fas fa-user-md"></i> 临床经验</h4>
            <p>{{ selectedDoctor.experience || selectedDoctor.introduction || '暂无临床经验信息' }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="appointment-btn" @click="makeAppointment">
            <i class="fas fa-calendar-check"></i> 预约挂号
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PetHospitalOverview',
  data() {
    return {
      showFullIntro: false,
      selectedDoctor: null,
      innerNavItems: [
        { id: 'leadership', text: '医师团队' },
        { id: 'structure', text: '组织架构' },
        { id: 'culture', text: '医院文化' },
        { id: 'history', text: '医院历史' }
      ],
      activeNav: 'intro',
      defaultAvatar: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
      activeDepartment: '眼科',
      activeSubDepartment: '',
      departmentDescriptions: {
        '眼科': '我们的眼科中心拥有最先进的诊断设备，专注于犬猫白内障、青光眼等眼部疾病的诊断和治疗。',
        '骨科': '骨科团队精通各类骨折修复、关节置换和脊椎手术，采用国际先进的骨科技术。',
        '外科': '外科中心提供从常规手术到复杂肿瘤切除的全方位外科服务，包括微创手术。',
        '皮肤科': '专业治疗各类宠物皮肤病，拥有先进的过敏原检测系统和皮肤病治疗设备。',
        '内科': '内科专家团队擅长诊断和治疗宠物的复杂内科疾病，提供个性化治疗方案。',
        '心肺科': '配备专业的心脏超声和呼吸功能检测设备，专注于心肺系统疾病的诊疗。',
        '口腔科': '提供全面的宠物口腔健康服务，包括牙齿清洁、矫正和牙周病治疗。',
        '神经外科': '拥有专业的神经外科团队和先进设备，治疗各类神经系统疾病和创伤。'
      },
      departments: [
        {
          name: '眼科',
          subDepartments: [],
          doctors: [
            {
              id: '1',
              name: '张明',
              title: '主任医师、教授',
              avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医学博士，15年宠物眼科临床经验，擅长犬猫白内障手术、青光眼治疗，完成宠物眼科手术2000+例。',
              education: '中国农业大学兽医学博士',
              specialty: '犬猫白内障手术、青光眼治疗',
              achievements: '发表SCI论文10篇，获得国家宠物医疗科技进步奖',
              experience: '15年宠物眼科临床经验，完成手术2000+例',
              tags: ['眼科专家', '白内障手术', '青光眼治疗']
            },
            {
              id: '2',
              name: '李静',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '南京农业大学兽医硕士，10年眼科临床经验，擅长角膜疾病诊断与治疗，发表SCI论文5篇。',
              education: '南京农业大学兽医硕士',
              specialty: '角膜疾病诊断与治疗',
              achievements: '发表SCI论文5篇',
              experience: '10年眼科临床经验',
              tags: ['角膜疾病', '学术研究', '副主任医师']
            }
          ]
        },
        {
          name: '骨科',
          subDepartments: ['骨科一病区', '骨科二病区'],
          doctors: [
            {
              id: '3',
              name: '王强',
              title: '主任医师、教授、博导',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '台湾大学兽医骨科博士，12年骨科临床经验，擅长骨折内固定、髋关节置换术，持有国际兽医骨科协会认证。',
              education: '台湾大学兽医骨科博士',
              specialty: '骨折内固定、髋关节置换术',
              achievements: '国际兽医骨科协会认证专家',
              experience: '12年骨科临床经验',
              tags: ['骨科专家', '髋关节置换', '国际认证']
            },
            {
              id: '4',
              name: '赵雪',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医硕士，8年骨科临床经验，擅长关节镜微创手术，完成手术1000+例。',
              education: '中国农业大学兽医硕士',
              specialty: '关节镜微创手术',
              achievements: '发表核心期刊论文3篇',
              experience: '8年骨科临床经验，完成手术1000+例',
              tags: ['微创手术', '关节镜', '副主任医师']
            }
          ]
        },
        {
          name: '内科',
          subDepartments: ['消化内科', '呼吸内科'],
          doctors: [
            {
              id: '5',
              name: '刘伟',
              title: '主任医师、教授',
              avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医内科学博士，15年内科诊疗经验，擅长消化系统疾病、内分泌疾病诊治。',
              education: '中国农业大学兽医内科学博士',
              specialty: '消化系统疾病、内分泌疾病诊治',
              achievements: '发表SCI论文8篇',
              experience: '15年内科诊疗经验',
              tags: ['内科专家', '消化系统', '内分泌']
            },
            {
              id: '6',
              name: '陈芳',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '南京农业大学兽医硕士，10年内科临床经验，擅长呼吸系统疾病治疗，发表核心期刊论文8篇。',
              education: '南京农业大学兽医硕士',
              specialty: '呼吸系统疾病治疗',
              achievements: '发表核心期刊论文8篇',
              experience: '10年内科临床经验',
              tags: ['呼吸内科', '学术研究', '副主任医师']
            }
          ]
        },
        {
          name: '外科',
          subDepartments: ['普通外科', '微创外科'],
          doctors: [
            {
              id: '7',
              name: '李建军',
              title: '主任医师、教授、博导',
              avatar: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '执业兽医师，外科专家，18年宠物外科临床经验，擅长肿瘤切除、腹腔镜微创手术，发表学术论文20余篇。',
              education: '中国农业大学兽医学博士',
              specialty: '肿瘤切除、腹腔镜微创手术',
              achievements: '发表学术论文20余篇',
              experience: '18年宠物外科临床经验',
              tags: ['外科专家', '肿瘤切除', '微创手术']
            },
            {
              id: '8',
              name: '王丽',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医硕士，9年外科临床经验，擅长软组织手术和创伤修复，完成手术1500+例。',
              education: '中国农业大学兽医硕士',
              specialty: '软组织手术和创伤修复',
              achievements: '发表核心期刊论文5篇',
              experience: '9年外科临床经验，完成手术1500+例',
              tags: ['创伤修复', '软组织手术', '副主任医师']
            }
          ]
        },
        {
          name: '皮肤科',
          subDepartments: [],
          doctors: [
            {
              id: '9',
              name: '陈雨薇',
              title: '主任医师、教授',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '南京农业大学兽医皮肤病学硕士，12年宠物皮肤病临床经验，擅长过敏性皮炎、真菌感染治疗，开发宠物皮肤护理方案10余种。',
              education: '南京农业大学兽医皮肤病学硕士',
              specialty: '过敏性皮炎、真菌感染治疗',
              achievements: '开发宠物皮肤护理方案10余种',
              experience: '12年宠物皮肤病临床经验',
              tags: ['皮肤专家', '过敏性皮炎', '真菌感染']
            },
            {
              id: '10',
              name: '张华',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医博士，8年皮肤病临床经验，擅长免疫性皮肤病诊断与治疗，发表SCI论文3篇。',
              education: '中国农业大学兽医博士',
              specialty: '免疫性皮肤病诊断与治疗',
              achievements: '发表SCI论文3篇',
              experience: '8年皮肤病临床经验',
              tags: ['免疫性皮肤病', '学术研究', '副主任医师']
            }
          ]
        },
        {
          name: '口腔科',
          subDepartments: [],
          doctors: [
            {
              id: '11',
              name: '林小洁',
              title: '主任医师、教授',
              avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '日本东京大学兽医口腔医学进修，10年宠物口腔科临床经验，擅长牙周治疗、牙齿矫正，宠物口腔健康护理专家。',
              education: '日本东京大学兽医口腔医学进修',
              specialty: '牙周治疗、牙齿矫正',
              achievements: '宠物口腔健康护理专家',
              experience: '10年宠物口腔科临床经验',
              tags: ['口腔专家', '牙齿矫正', '牙周治疗']
            },
            {
              id: '12',
              name: '吴明',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医硕士，7年口腔科临床经验，擅长牙齿修复和口腔外科手术，完成手术800+例。',
              education: '中国农业大学兽医硕士',
              specialty: '牙齿修复和口腔外科手术',
              achievements: '发表核心期刊论文3篇',
              experience: '7年口腔科临床经验，完成手术800+例',
              tags: ['牙齿修复', '口腔外科', '副主任医师']
            }
          ]
        },
        {
          name: '神经外科',
          subDepartments: [],
          doctors: [
            {
              id: '13',
              name: '黄志强',
              title: '主任医师、教授、博导',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '德国汉诺威兽医大学神经外科博士后，15年宠物神经外科临床经验，擅长脊椎手术、脑部肿瘤切除，国内首批宠物神经外科专家。',
              education: '德国汉诺威兽医大学神经外科博士后',
              specialty: '脊椎手术、脑部肿瘤切除',
              achievements: '国内首批宠物神经外科专家',
              experience: '15年宠物神经外科临床经验',
              tags: ['神经外科专家', '脊椎手术', '脑部肿瘤']
            },
            {
              id: '14',
              name: '周敏',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医博士，8年神经外科临床经验，擅长神经系统疾病诊断与微创治疗，发表核心期刊论文5篇。',
              education: '中国农业大学兽医博士',
              specialty: '神经系统疾病诊断与微创治疗',
              achievements: '发表核心期刊论文5篇',
              experience: '8年神经外科临床经验',
              tags: ['神经系统疾病', '微创治疗', '副主任医师']
            }
          ]
        },
        {
          name: '心肺科',
          subDepartments: [],
          doctors: [
            {
              id: '15',
              name: '赵雪',
              title: '主任医师、教授、博导',
              avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '美国康奈尔大学兽医心脏学访问学者，14年宠物心肺科临床经验，擅长心脏病诊断治疗、胸腔手术，完成宠物心脏手术500+例。',
              education: '美国康奈尔大学兽医心脏学访问学者',
              specialty: '心脏病诊断治疗、胸腔手术',
              achievements: '完成宠物心脏手术500+例',
              experience: '14年宠物心肺科临床经验',
              tags: ['心肺专家', '心脏病治疗', '胸腔手术']
            },
            {
              id: '16',
              name: '郑阳',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '中国农业大学兽医硕士，9年心肺科临床经验，擅长呼吸系统疾病诊断与治疗，发表SCI论文2篇。',
              education: '中国农业大学兽医硕士',
              specialty: '呼吸系统疾病诊断与治疗',
              achievements: '发表SCI论文2篇',
              experience: '9年心肺科临床经验',
              tags: ['呼吸系统', '学术研究', '副主任医师']
            }
          ]
        },
        {
          name: '急诊科',
          subDepartments: [],
          doctors: [
            {
              id: '17',
              name: '孙强',
              title: '主任医师、教授',
              avatar: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '20年急诊临床经验，擅长各类宠物急危重症抢救，宠物急诊医学学科带头人，发表急诊医学相关论文15篇。',
              education: '中国农业大学兽医学博士',
              specialty: '各类宠物急危重症抢救',
              achievements: '发表急诊医学相关论文15篇',
              experience: '20年急诊临床经验',
              tags: ['急诊专家', '危重症抢救', '学科带头人']
            },
            {
              id: '18',
              name: '李娜',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '10年急诊临床经验，擅长中毒、创伤等急诊处理，完成急诊病例3000+例，急诊医学培训讲师。',
              education: '中国农业大学兽医硕士',
              specialty: '中毒、创伤等急诊处理',
              achievements: '急诊医学培训讲师',
              experience: '10年急诊临床经验，完成急诊病例3000+例',
              tags: ['中毒处理', '创伤急救', '副主任医师']
            }
          ]
        },
        {
          name: '老年病科',
          subDepartments: [],
          doctors: [
            {
              id: '19',
              name: '王建国',
              title: '主任医师、教授',
              avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '18年老年宠物疾病诊疗经验，擅长老年宠物慢性病管理和临终关怀，老年宠物健康管理专家。',
              education: '中国农业大学兽医学博士',
              specialty: '老年宠物慢性病管理和临终关怀',
              achievements: '老年宠物健康管理专家',
              experience: '18年老年宠物疾病诊疗经验',
              tags: ['老年病专家', '慢性病管理', '临终关怀']
            },
            {
              id: '20',
              name: '刘芳',
              title: '副主任医师',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
              introduction: '12年老年病临床经验，擅长老年宠物营养管理和关节保健，发表老年宠物护理相关论文5篇。',
              education: '中国农业大学兽医硕士',
              specialty: '老年宠物营养管理和关节保健',
              achievements: '发表老年宠物护理相关论文5篇',
              experience: '12年老年病临床经验',
              tags: ['营养管理', '关节保健', '副主任医师']
            }
          ]
        }
      ]
    }
  },
  computed: {
    currentSubDepartments() {
      const dept = this.departments.find(d => d.name === this.activeDepartment);
      return dept ? dept.subDepartments : [];
    },
    filteredDoctors() {
      let doctors = [];
      const dept = this.departments.find(d => d.name === this.activeDepartment);
      if (dept) {
        doctors = dept.doctors;
        if (this.activeSubDepartment) {
          // 实际项目中可以根据子科室筛选医生
        }
      }
      return doctors;
    }
  },
  methods: {
    openDoctorModal(doctor) {
      this.selectedDoctor = doctor;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.selectedDoctor = null;
      document.body.style.overflow = '';
    },
    makeAppointment() {
      alert(`即将预约 ${this.selectedDoctor.name} 医生`);
      this.closeModal();
    },
    scrollToDoctor(doctorId) {
      const element = document.getElementById(`doctor-${doctorId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
      this.activeSubDepartment = '';
    },
    selectSubDepartment(name) {
      this.activeSubDepartment = name === this.activeSubDepartment ? '' : name;
    },
    getDepartmentIcon(name) {
      const icons = {
        '眼科': 'fas fa-eye',
        '骨科': 'fas fa-bone',
        '外科': 'fas fa-scalpel',
        '皮肤科': 'fas fa-spa',
        '内科': 'fas fa-stethoscope',
        '心肺科': 'fas fa-heartbeat',
        '口腔科': 'fas fa-tooth',
        '神经外科': 'fas fa-brain'
      };
      return icons[name] || 'fas fa-user-md';
    },
    getDepartmentDescription(name) {
      return this.departmentDescriptions[name] || '';
    }
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
.pet-hospital-page {
  opacity: 0;
  transition: opacity 0.8s ease;
  background-color: #fdfdfd;
}

/* 英雄区域 */
.hero-section {
  position: relative;
  min-height: 90vh;
  background: linear-gradient(rgba(0, 0, 0, 0.3)), 
              url('../assets/cat.jpg') no-repeat center/cover;
  display: flex;
  align-items: center;
  padding: 60px 20px;
  color: white;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-content {
  text-align: center;
  animation: fadeInUp 1s ease;
}

.hospital-title {
  font-size: 4rem;
  font-weight: 700;
  color: white;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
  margin-top: 20px;
}

.hospital-slogan {
  font-size: 1.5rem;
  margin-bottom: 0;
  opacity: 0.9;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.title-decoration {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  gap: 15px;
}

.decoration-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  opacity: 0.7;
  animation: pulse 2s infinite ease-in-out;
}

.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.3s; }
.dot-3 { animation-delay: 0.6s; }

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
}

/* 医院简介 */
.intro-container {
  position: relative;
  margin-top: 40px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
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
}

.intro-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
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
}

.intro-text p:hover .icon-highlight {
  transform: scale(1.2);
  color: var(--secondary-color);
}

.read-more-btn {
  background: var(--secondary-color);
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
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.read-more-btn:hover {
  background: #00b8a9;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

/* 医院概况 */
.hospital-overview {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.inner-nav {
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
}

.inner-nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.inner-nav li {
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--light-text);
  position: relative;
  transition: all 0.3s ease;
}

.inner-nav li:hover {
  color: var(--primary-color);
}

.inner-nav li.active {
  color: var(--primary-color);
  font-weight: 600;
}

.inner-nav li.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary-color);
}

.content-sections {
  margin-top: 30px;
}

.content-section {
  margin-bottom: 60px;
  padding: 30px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.content-section h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

/* 医师团队 */
.leadership-content {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

.doctor-layout {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 280px;
  background: white;
  padding: 25px;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  border: 1px solid rgba(0,0,0,0.05);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 16px 20px;
  cursor: pointer;
  border-radius: 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: var(--dark-text);
  border: 1px solid rgba(0,0,0,0.05);
}

.sidebar li:hover {
  background-color: rgba(108, 92, 231, 0.05);
  color: var(--primary-color);
  transform: translateX(5px);
}

.sidebar li.active {
  background-color: rgba(108, 92, 231, 0.1);
  color: var(--primary-color);
  font-weight: 600;
  border-left: 3px solid var(--primary-color);
}

.dept-icon {
  margin-right: 15px;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  color: var(--primary-color);
}

.dept-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doctor-count {
  background-color: rgba(108, 92, 231, 0.1);
  color: var(--primary-color);
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 0.8rem;
  margin-left: 10px;
  font-weight: 500;
}

.sidebar li.active .doctor-count {
  background-color: var(--primary-color);
  color: white;
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
  font-weight: 600;
}

.sub-dept {
  color: var(--secondary-color);
  font-weight: 500;
  margin-left: 8px;
  font-size: 1.2rem;
}

.dept-description {
  color: var(--light-text);
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 25px;
}

.sub-departments {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.sub-departments span {
  padding: 8px 16px;
  background-color: #f5f7fa;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
}

.sub-departments span:hover {
  background-color: #e2e8f0;
}

.sub-departments span.active {
  background-color: var(--secondary-color);
  color: white;
  box-shadow: 0 3px 10px rgba(0, 206, 201, 0.2);
}

.doctor-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 25px;
}

.doctor-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
}

.doctor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.doctor-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
}

.doctor-card-content {
  display: flex;
  padding: 20px;
}

.doctor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  flex-shrink: 0;
  border: 3px solid white;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  position: relative;
  transition: all 0.3s ease;
}

.doctor-card:hover .doctor-avatar {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
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

.doctor-info {
  flex: 1;
}

.doctor-info h4 {
  font-size: 1.3rem;
  color: var(--dark-text);
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.doctor-info .title {
  font-size: 0.9rem;
  color: var(--light-text);
  font-weight: normal;
  margin-left: 8px;
}

.doctor-intro {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  margin: 10px 0;
}

.doctor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.doctor-tags span {
  background: rgba(108, 92, 231, 0.1);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.doctor-action {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
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
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
}

/* 医生详情弹窗 */
.doctor-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--light-text);
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  color: var(--danger-color);
  transform: rotate(90deg);
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 30px;
  flex-shrink: 0;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-title {
  flex: 1;
}

.modal-title h3 {
  font-size: 1.8rem;
  color: var(--dark-text);
  margin: 0 0 5px 0;
}

.doctor-title {
  color: var(--primary-color);
  font-size: 1.1rem;
  margin: 0 0 15px 0;
}

.modal-body {
  padding: 30px;
}

.doctor-section {
  margin-bottom: 25px;
}

.doctor-section h4 {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
}

.doctor-section h4 i {
  margin-right: 10px;
}

.doctor-section p {
  color: var(--dark-text);
  line-height: 1.8;
  margin: 0;
  padding-left: 30px;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
}

.appointment-btn {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.appointment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
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
  
  .hospital-title {
    font-size: 3.5rem;
  }
  
  .intro-container {
    height: 250px;
  }

  .modal-header {
    flex-direction: column;
    text-align: center;
  }

  .modal-avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .hospital-title {
    font-size: 2.8rem;
  }
  
  .hospital-slogan {
    font-size: 1.2rem;
  }
  
  .doctor-list {
    grid-template-columns: 1fr;
  }
  
  .doctor-card-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
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

  .modal-content {
    max-height: 80vh;
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

  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-avatar {
    width: 100px;
    height: 100px;
  }

  .doctor-section h4 {
    font-size: 1.1rem;
  }

  .doctor-section p {
    padding-left: 20px;
    font-size: 0.95rem;
  }
}
</style>