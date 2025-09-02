// doctorsData.js
export const departments = [
  {
    name: '眼科',
    subDepartments: [],
    description: '我们的眼科中心拥有最先进的诊断设备，专注于犬猫白内障、青光眼等眼部疾病的诊断和治疗。',
    doctors: [
      {
        id: 'eye-1',
        name: '张明',
        title: '主任医师、教授',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
        introduction: '中国农业大学兽医学博士，15年宠物眼科临床经验，擅长犬猫白内障手术、青光眼治疗，完成宠物眼科手术2000+例。',
        education: '中国农业大学兽医学博士',
        specialty: '犬猫白内障手术、青光眼治疗',
        achievements: '发表SCI论文10篇，获得国家宠物医疗科技进步奖',
        experience: '15年宠物眼科临床经验，完成手术2000+例',
        tags: ['眼科专家', '白内障手术', '青光眼治疗']
      },
      {
        id: 'eye-2',
        name: '李静',
        title: '副主任医师',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
        introduction: '南京农业大学兽医硕士，10年眼科临床经验，擅长角膜疾病诊断与治疗，发表SCI论文5篇。',
        education: '南京农业大学兽医硕士',
        specialty: '角膜疾病诊断与治疗',
        achievements: '发表SCI论文5篇',
        experience: '10年眼科临床经验',
        tags: ['角膜疾病', '学术研究', '副主任医师']
      },
      {
        id: 'eye-3',
        name: '陈宇光',
        title: '主治医师',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
        introduction: '北京农学院兽医硕士，8年宠物眼科经验，擅长眼底病筛查与泪道手术，完成手术900+例。',
        education: '北京农学院兽医硕士',
        specialty: '眼底病筛查、泪道手术',
        achievements: '参与国家级科研项目2项',
        experience: '8年宠物眼科临床经验',
        tags: ['眼底病', '泪道手术', '主治医师']
      },
      {
        id: 'eye-4',
        name: '黎洁',
        title: '住院医师',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
        introduction: '东北农业大学兽医硕士，6年眼科经验，专注于干眼症与角膜移植术后管理，发表核心期刊论文3篇。',
        education: '东北农业大学兽医硕士',
        specialty: '干眼症、角膜移植术后管理',
        achievements: '核心期刊论文3篇',
        experience: '6年宠物眼科临床经验',
        tags: ['干眼症', '角膜移植', '住院医师']
      },

    ]
  },
  {
    name: '内科',
    subDepartments: ['消化内科', '呼吸内科', '心血管内科'],
    description: '内科专家团队擅长诊断和治疗宠物的复杂内科疾病，提供个性化治疗方案。',
    doctors: [
      {
        id: 'internal-1',
        name: '刘伟',
        title: '主任医师、教授',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face',
        introduction: '中国农业大学兽医内科学博士，15年内科诊疗经验，擅长消化系统疾病、内分泌疾病诊治。',
        education: '中国农业大学兽医内科学博士',
        specialty: '消化系统疾病、内分泌疾病诊治',
        achievements: '擅长：内科和老年病。执业兽医师，从业25年，毕业于华南农业大学，现任中国兽医协会宠物诊疗分会理事、湖南省宠物诊疗行业协会副会长、娄底职业技术学院动物医学客座教授、湖南省武警消防特勤总队警犬基地专职医生。精通于内科、外科疾病和小宠及珍稀动物诊疗，曾多次治疗好各类疑难杂症，临床经验丰富。并秉着对宠物爱心，责任心为原则，深受广大宠物和宠主的爱戴。',
        experience: '15年内科诊疗经验',
        tags: ['内科专家', '消化系统', '内分泌']
      },
      {
        id: 'internal-2',
        name: '陈芳',
        title: '副主任医师',
        avatar:  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face',
        introduction: '南京农业大学兽医硕士，10年内科临床经验，擅长呼吸系统疾病治疗，发表核心期刊论文8篇。',
        education: '南京农业大学兽医硕士',
        specialty: '呼吸系统疾病治疗',
        achievements: '发表核心期刊论文8篇',
        experience: '10年内科临床经验',
        tags: ['呼吸内科', '学术研究', '副主任医师']
      },
      {
        id: 'internal-3',
        name: '周志强',
        title: '副主任医师',
        avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
        introduction: '中国农业大学兽医博士，12年内科经验，擅长肾病及电解质紊乱管理，主持省级课题1项。',
        education: '中国农业大学兽医博士',
        specialty: '肾病、电解质紊乱管理',
        achievements: '主持省级课题1项',
        experience: '12年内科临床经验',
        tags: ['肾病专家', '电解质紊乱', '副主任医师']
      },
      {
        id: 'internal-4',
        name: '王雪',
        title: '主治医师',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
        introduction: '华南农业大学兽医硕士，9年经验，专注于猫传染性腹膜炎早期诊疗，完成病例随访1000+例。',
        education: '华南农业大学兽医硕士',
        specialty: '猫传染性腹膜炎早期诊疗',
        achievements: '病例随访1000+例',
        experience: '9年内科临床经验',
        tags: ['猫传腹', '早期诊疗', '主治医师']
      },

    ]
  },
  {
    name: '外科',
    subDepartments: ['普通外科', '微创外科', '骨科'],
    description: '外科中心提供从常规手术到复杂肿瘤切除的全方位外科服务，包括微创手术。',
    doctors: [
      {
        id: 'surgery-1',
        name: '李建军',
        title: '主任医师、教授、博导',
        avatar:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        introduction: '执业兽医师，外科专家，18年宠物外科临床经验，擅长肿瘤切除、腹腔镜微创手术，发表学术论文20余篇。',
        education: '中国农业大学兽医学博士',
        specialty: '肿瘤切除、腹腔镜微创手术',
        achievements: '发表学术论文20余篇',
        experience: '骨科、外科手术。执业兽医师，从业13年，华南农业大学临床兽医硕士，现任广东科贸学院客座讲师，华南农业大学兽医学院校外指导老师，荣获"中国百家宠物医师"、"华南优秀青年兽医师"、"广州市动物诊疗行业协会优秀兽医师"等奖项。从初只是作为学业需要，在投入到学习和工作中，逐渐对宠物和宠物医生产生浓厚兴趣，成为他坚持和专注的终生事业。',
        tags: ['外科专家', '肿瘤切除', '微创手术']
      },
      {
        id: 'surgery-2',
        name: '赵一鸣',
        title: '主治医师',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
        introduction: '浙江大学兽医硕士，10年外科经验，擅长胸腔镜肺叶切除及复杂膈疝修补，完成手术1500+例。',
        education: '浙江大学兽医硕士',
        specialty: '胸腔镜肺叶切除、膈疝修补',
        achievements: '完成手术1500+例',
        experience: '10年外科临床经验',
        tags: ['胸腔镜', '膈疝', '主治医师']
      },
      {
        id: 'surgery-3',
        name: '孙琳',
        title: '住院医师',
        avatar:   'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop&crop=face',
        introduction: '扬州大学兽医硕士，6年外科经验，专注于软组织创伤修复及术后疼痛管理，参与编写教材1部。',
        education: '扬州大学兽医硕士',
        specialty: '软组织创伤修复、术后疼痛管理',
        achievements: '参编教材1部',
        experience: '6年外科临床经验',
        tags: ['创伤修复', '疼痛管理', '住院医师']
      },
    ]
  },
  {
    name: '肿瘤科',
    subDepartments: ['肿瘤内科', '肿瘤外科', '放射治疗科'],
    description: '专业治疗各类宠物肿瘤疾病，拥有先进的肿瘤诊断和治疗设备。',
    doctors: [
      {
        id: 'oncology-1',
        name: '王建国',
        title: '主任医师、教授',
        avatar:  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=200&h=200&fit=crop&crop=face',
        introduction: '美国康奈尔大学兽医肿瘤学博士，15年肿瘤科临床经验，擅长各类宠物肿瘤的诊断和治疗。',
        education: '美国康奈尔大学兽医肿瘤学博士',
        specialty: '宠物肿瘤诊断和治疗',
        achievements: '发表SCI论文12篇',
        experience: '15年肿瘤科临床经验',
        tags: ['肿瘤专家', '化疗', '靶向治疗']
      },
      {
        id: 'oncology-2',
        name: '林浩',
        title: '副主任医师',
        avatar:  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
        introduction: '日本麻布大学肿瘤学博士，12年肿瘤科经验，擅长犬猫淋巴瘤化疗方案个体化，主持GCP临床试验3项。',
        education: '日本麻布大学肿瘤学博士',
        specialty: '淋巴瘤个体化化疗',
        achievements: '主持GCP临床试验3项',
        experience: '12年肿瘤科临床经验',
        tags: ['淋巴瘤', 'GCP临床', '副主任医师']
      },
      {
        id: 'oncology-3',
        name: '张雪梅',
        title: '主治医师',
        avatar:  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
        introduction: '南京农业大学兽医硕士，8年肿瘤科经验，专注乳腺肿瘤早期筛查及靶向治疗，发表SCI论文6篇。',
        education: '南京农业大学兽医硕士',
        specialty: '乳腺肿瘤早期筛查、靶向治疗',
        achievements: '发表SCI论文6篇',
        experience: '8年肿瘤科临床经验',
        tags: ['乳腺肿瘤', '靶向治疗', '主治医师']
      },

    ]
  },
  {
    name: '皮肤科',
    subDepartments: ['过敏性皮肤病', '感染性皮肤病'],
    description: '专业治疗各类宠物皮肤病，拥有先进的过敏原检测系统和皮肤病治疗设备。',
    doctors: [
      {
        id: 'dermatology-1',
        name: '陈雨薇',
        title: '主任医师、教授',
        avatar:  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
        education: '南京农业大学兽医皮肤病学硕士',
        specialty: '过敏性皮炎、真菌感染治疗',
        achievements: '开发宠物皮肤护理方案10余种',
        experience: '12年宠物皮肤病临床经验',
        tags: ['皮肤专家', '过敏性皮炎', '真菌感染']
      },
      {
        id: 'dermatology-2',
        name: '郑浩',
        title: '主治医师',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        introduction: '华中农业大学兽医硕士，10年皮肤科经验，擅长马拉色菌皮炎及异位性皮炎综合管理，主编诊疗共识1部。',
        education: '华中农业大学兽医硕士',
        specialty: '马拉色菌皮炎、异位性皮炎',
        achievements: '主编诊疗共识1部',
        experience: '10年皮肤科临床经验',
        tags: ['马拉色菌皮炎', '异位性皮炎', '主治医师']
      },
      {
        id: 'dermatology-3',
        name: '林雅',
        title: '住院医师',
        avatar:  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        introduction: '四川农业大学兽医硕士，6年皮肤科经验，专注于宠物皮肤镜诊断与过敏原检测，完成病例5000+例。',
        education: '四川农业大学兽医硕士',
        specialty: '皮肤镜诊断、过敏原检测',
        achievements: '完成病例5000+例',
        experience: '6年皮肤科临床经验',
        tags: ['皮肤镜', '过敏原检测', '住院医师']
      },

    
    ]
  },
  {
    name: '影像科',
    subDepartments: ['超声诊断', '放射诊断', '核医学'],
    description: '配备专业的心脏超声和呼吸功能检测设备，专注于心肺系统疾病的诊疗。',
    doctors: [
      {
        id: 'imaging-1',
        name: '赵雪',
        title: '主任医师、教授',
        avatar:  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face',
        introduction: '中国农业大学兽医影像学博士，10年影像科临床经验，擅长各类影像诊断技术。',
        education: '中国农业大学兽医影像学博士',
        specialty: '影像诊断',
        achievements: '发表核心期刊论文6篇',
        experience: '10年影像科临床经验',
        tags: ['影像专家', '超声诊断', '放射诊断']
      },
      {
        id: 'imaging-2',
        name: '黄伟',
        title: '主治医师',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
        introduction: '中国农业大学兽医影像硕士，9年经验，擅长心脏彩超及CT血管造影，参与多中心研究2项。',
        education: '中国农业大学兽医影像硕士',
        specialty: '心脏彩超、CT血管造影',
        achievements: '参与多中心研究2项',
        experience: '9年影像科临床经验',
        tags: ['心脏彩超', 'CT造影', '主治医师']
      },
      {
        id: 'imaging-3',
        name: '陈浩',
        title: '住院医师',
        avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        introduction: '华南农业大学兽医硕士，5年影像科经验，专注MRI神经系统疾病诊断，发表核心期刊论文2篇。',
        education: '华南农业大学兽医硕士',
        specialty: 'MRI神经系统疾病诊断',
        achievements: '核心期刊论文2篇',
        experience: '5年影像科临床经验',
        tags: ['MRI', '神经系统', '住院医师']
      },

    ]
  },
  {
    name: '康复科',
    subDepartments: ['物理治疗', '运动康复'],
    description: '提供全面的宠物康复服务，包括物理治疗、运动康复等。',
    doctors: [
      {
        id: 'rehab-1',
        name: '林小洁',
        title: '主任医师、教授',
        avatar:  'https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=200&h=200&fit=crop&crop=face',
        introduction: '日本东京大学兽医康复医学进修，10年宠物康复科临床经验，擅长各类宠物康复治疗。',
        education: '日本东京大学兽医康复医学进修',
        specialty: '宠物康复治疗',
        achievements: '开发康复治疗方案5种',
        experience: '10年康复科临床经验',
        tags: ['康复专家', '物理治疗', '运动康复']
      },
      {
        id: 'rehab-2',
        name: '周思远',
        title: '主治医师',
        avatar:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        introduction: '日本麻布大学康复医学硕士，8年康复经验，擅长髋关节置换术后康复，设计康复器械2套。',
        education: '日本麻布大学康复医学硕士',
        specialty: '髋关节置换术后康复',
        achievements: '设计康复器械2套',
        experience: '8年康复科临床经验',
        tags: ['髋关节康复', '康复器械', '主治医师']
      },
      {
        id: 'rehab-3',
        name: '王悦',
        title: '住院医师',
        avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
        introduction: '南京农业大学兽医硕士，6年康复经验，专注猫后肢瘫痪水疗与激光理疗，完成康复病例1200+例。',
        education: '南京农业大学兽医硕士',
        specialty: '猫后肢瘫痪水疗、激光理疗',
        achievements: '完成康复病例1200+例',
        experience: '6年康复科临床经验',
        tags: ['水疗', '激光理疗', '住院医师']
      },
    ]
  },
  {
    name: '牙科',
    subDepartments: ['口腔外科', '牙齿矫正'],
    description: '提供全面的宠物口腔健康服务，包括牙齿清洁、矫正和牙周病治疗。',
    doctors: [
      {
        id: 'dental-1',
        name: '吴明',
        title: '副主任医师',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
        introduction: '中国农业大学兽医硕士，7年口腔科临床经验，擅长牙齿修复和口腔外科手术，完成手术800+例。',
        education: '中国农业大学兽医硕士',
        specialty: '牙齿修复和口腔外科手术',
        achievements: '发表核心期刊论文3篇',
        experience: '7年口腔科临床经验，完成手术800+例',
        tags: ['牙齿修复', '口腔外科', '副主任医师']
      },
      {
        id: 'dental-2',
        name: '刘畅',
        title: '主治医师',
        avatar:  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
        introduction: '中国农业大学兽医硕士，9年口腔科经验，擅长牙髓病显微根管治疗及复杂拔牙，完成手术1500+例。',
        education: '中国农业大学兽医硕士',
        specialty: '显微根管治疗、复杂拔牙',
        achievements: '完成手术1500+例',
        experience: '9年口腔科临床经验',
        tags: ['牙髓病', '显微根管', '主治医师']
      },
      {
        id: 'dental-3',
        name: '张龙',
        title: '住院医师',
        avatar:  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
        introduction: '沈阳农业大学兽医硕士，5年口腔科经验，专注幼宠牙齿畸形早期干预及洁牙，参与公益洁牙活动20场。',
        education: '沈阳农业大学兽医硕士',
        specialty: '幼宠牙齿畸形早期干预、洁牙',
        achievements: '公益洁牙活动20场',
        experience: '5年口腔科临床经验',
        tags: ['牙齿畸形', '公益洁牙', '住院医师']
      }
    ]
  }
];

// 科室描述映射
export const departmentDescriptions = departments.reduce((acc, dept) => {
  acc[dept.name] = dept.description;
  return acc;
}, {});

// 获取所有科室的图标
export const getDepartmentIcon = (name) => {
  const icons = {
    '眼科': 'fas fa-eye',
    '内科': 'fas fa-stethoscope',
    '外科': 'fas fa-scalpel',
    '肿瘤科': 'fas fa-dna',
    '皮肤科': 'fas fa-spa',
    '影像科': 'fas fa-x-ray',
    '康复科': 'fas fa-heartbeat',
    '牙科': 'fas fa-tooth'
  };
  return icons[name] || 'fas fa-user-md';
};