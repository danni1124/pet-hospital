<template>
  <div class="questionnaire-bg">
    
    <!-- 答题须知弹窗 -->
    <div v-if="showNotice" class="notice-modal">
      <div class="notice-content">
        <h2>答题须知</h2>
        <div class="notice-scroll" ref="noticeScroll" @scroll="handleScroll">
          <ul>
            <li v-for="(item, idx) in noticeList" :key="idx">{{ item }}</li>
          </ul>
        </div>
        <transition name="fade">
          <button
            v-if="canStart"
            class="start-btn"
            @click="showNotice = false"
          >
            开始作答
          </button>
        </transition>
      </div>
    </div>

    <!-- 答题结果弹窗 -->
    <div v-if="showResult" class="notice-modal">
      <div class="notice-content">
        <h2>答题结果</h2>
        <div v-if="score === 100">
          <p style="font-size:1.2em;color:#2a5298;font-weight:bold;">恭喜你全部答对，送给你一张优惠券！</p>
          <div style="margin:20px 0;">
            <span style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#4facfe,#00f2fe);color:#fff;border-radius:16px;font-size:1.2em;font-weight:bold;">🐾 宠物体检优惠券 🐾</span>
          </div>
        </div>
        <div v-else>
          <p style="font-size:1.1em;color:#e57373;font-weight:bold;">你的得分：{{ score }} 分</p>
 
          <p style="margin-top:10px;color:#2a5298;">请继续努力！</p>
        </div>
        <button class="start-btn" style="position:static;margin:20px auto 0 auto;display:block;" @click="closeAndNavigate">
          {{ score === 100 ? '领取' : '关闭' }}
        </button>
      </div>
    </div>

    <h1>Questionnaire</h1>
    <form @submit.prevent="submitForm" class="questionnaire-form">
      <div
        v-for="(question, qIdx) in questions"
        :key="qIdx"
        class="question-block"
      >
        <label class="question-title">{{ qIdx + 1 }}. {{ question.text }}</label>
        <div class="options">
          <label
            v-for="(option, oIdx) in question.options"
            :key="oIdx"
            class="option-label"
          >
            <input
              :type="question.multiple ? 'checkbox' : 'radio'"
              :name="'q' + qIdx"
              :value="option.value"
              v-model="userAnswers[qIdx]"
              :multiple="question.multiple"
            />
            {{ option.value }}. {{ option.text }}
          </label>
        </div>
      </div>
      <button type="submit" class="submit-btn">提交</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNotice: true,
      canStart: false,
      showResult: false,
      score: 0,
      wrongQuestions: [],
      noticeList: [
        "1. 本问卷旨在收集您和您宠物的真实信息，以便我们为您提供更优质的医疗服务，请您认真填写每一项内容。",
        "2. 请确保填写的宠物信息（如品种、年龄、健康状况等）准确无误，便于医生做出科学判断。",
        "3. 所有问卷数据仅用于本院医疗服务改进和学术研究，严格保密，不会泄露您的个人隐私。",
        "4. 如遇到不清楚的问题，可咨询现场工作人员或拨打前台电话获得帮助。",
        "5. 请勿随意中断或关闭页面，避免数据丢失。如遇网络异常，请及时联系工作人员。",
        "6. 问卷提交后将无法修改，请在提交前仔细核对所有填写内容。",
        "7. 若您的宠物有特殊病史、过敏史或正在服药，请在相关问题中详细说明。",
        "8. 本问卷仅限宠物主人本人填写，请勿代他人作答，以保证数据的真实性。",
        "9. 问卷填写时间约为5-10分钟，请合理安排时间，确保填写完整。",
        "10. 感谢您的配合与支持，您的宝贵意见将帮助我们不断提升服务质量！"
      ],
      questions: [
        {
          text: "狗狗健康的体温范围是多少？",
          options: [
            { value: "A", text: "35-36°C" },
            { value: "B", text: "37-38°C" },
            { value: "C", text: "38-39°C" },
            { value: "D", text: "40-41°C" }
          ],
          answer: ["C"],
          multiple: false
        },
        {
          text: "猫咪常见的疫苗有哪些？",
          options: [
            { value: "A", text: "猫三联" },
            { value: "B", text: "狂犬疫苗" },
            { value: "C", text: "犬瘟热疫苗" },
            { value: "D", text: "猫白血病疫苗" }
          ],
          answer: ["A", "B", "D"],
          multiple: true
        },
        {
          text: "以下哪项不是狗狗常见的寄生虫？",
          options: [
            { value: "A", text: "蛔虫" },
            { value: "B", text: "绦虫" },
            { value: "C", text: "跳蚤" },
            { value: "D", text: "蚂蚁" }
          ],
          answer: ["D"],
          multiple: false
        },
        {
          text: "猫咪出现哪些症状时应及时就医？",
          options: [
            { value: "A", text: "持续呕吐" },
            { value: "B", text: "精神萎靡" },
            { value: "C", text: "食欲减退" },
            { value: "D", text: "以上都是" }
          ],
          answer: ["D"],
          multiple: false
        },
        {
          text: "狗狗驱虫的常见方式有哪些？",
          options: [
            { value: "A", text: "口服药物" },
            { value: "B", text: "外用滴剂" },
            { value: "C", text: "注射疫苗" },
            { value: "D", text: "喷雾剂" }
          ],
          answer: ["A", "B", "D"],
          multiple: true
        },
        {
          text: "猫咪适合吃以下哪类食物？",
          options: [
            { value: "A", text: "巧克力" },
            { value: "B", text: "洋葱" },
            { value: "C", text: "猫粮" },
            { value: "D", text: "葡萄" }
          ],
          answer: ["C"],
          multiple: false
        },
        {
          text: "狗狗洗澡的最佳频率是？",
          options: [
            { value: "A", text: "每天一次" },
            { value: "B", text: "每周一次" },
            { value: "C", text: "每月一次" },
            { value: "D", text: "每年一次" }
          ],
          answer: ["B"],
          multiple: false
        },
        {
          text: "猫咪打喷嚏的常见原因有哪些？",
          options: [
            { value: "A", text: "感冒" },
            { value: "B", text: "过敏" },
            { value: "C", text: "异物刺激" },
            { value: "D", text: "以上都是" }
          ],
          answer: ["D"],
          multiple: false
        },
        {
          text: "狗狗不能吃以下哪种食物？",
          options: [
            { value: "A", text: "鸡肉" },
            { value: "B", text: "葡萄" },
            { value: "C", text: "胡萝卜" },
            { value: "D", text: "南瓜" }
          ],
          answer: ["B"],
          multiple: false
        },
        {
          text: "猫咪日常护理包括哪些？",
          options: [
            { value: "A", text: "定期梳毛" },
            { value: "B", text: "清理猫砂盆" },
            { value: "C", text: "定期驱虫" },
            { value: "D", text: "以上都是" }
          ],
          answer: ["D"],
          multiple: false
        }
      ],
      userAnswers: []
    };
  },
  methods: {
    submitForm() {
      // 双重保险：在提交前再次检查登录状态
      if (!this.isUserLoggedIn()) {
        alert('登录状态已过期，请重新登录');
        this.$router.push('/?showLogin=true');
        return;
      }
      
      // 计算分数
      let score = 0;
      let wrongQuestions = [];
      for (let i = 0; i < this.questions.length; i++) {
        const q = this.questions[i];
        // 统一为数组
        let ans = this.userAnswers[i];
        if (!Array.isArray(ans)) ans = ans ? [ans] : [];
        // 排序后比较
        const userAns = [...ans].sort();
        const rightAns = [...q.answer].sort();
        const isRight =
          userAns.length === rightAns.length &&
          userAns.every((v, idx) => v === rightAns[idx]);
        if (isRight) {
          score += 10;
        } else {
          wrongQuestions.push(i);
        }
      }
      this.score = score;
      this.wrongQuestions = wrongQuestions;
      this.showResult = true;
    },
    handleScroll() {
      const el = this.$refs.noticeScroll;
      if (el) {
        // 只有滚动到底部时才显示按钮，否则隐藏
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
          this.canStart = true;
        } else {
          this.canStart = false;
        }
      }
    },
    closeAndNavigate() {
      if (this.score === 100) {
        // 显示领取成功提示
        alert('领取成功，请在个人中心查看');
        
        // 延迟1秒后跳转到首页
        setTimeout(() => {
          this.showResult = false;
          this.$router.push('/');
        }, 1000);
      } else {
        // 直接关闭并跳转
        this.showResult = false;
        this.$router.push('/');
      }
    },
    // 检查用户是否已登录
    isUserLoggedIn() {
      console.log('=== 问卷页面检查登录状态 ===')
      
      // 检查localStorage中的登录信息
      const rememberedUser = localStorage.getItem('rememberedUser');
      const currentUser = localStorage.getItem('currentUser');
      
      console.log('rememberedUser:', rememberedUser)
      console.log('currentUser:', currentUser)
      
      // 只要有任意一种登录信息就认为已登录
      const isLoggedIn = !!(rememberedUser || currentUser)
      console.log('最终登录状态判断:', isLoggedIn)
      
      return isLoggedIn
    }
  },
  mounted() {
    // 不在页面加载时强制检查登录状态，让用户可以查看问卷内容
    // 只在提交时才检查登录状态
    
    this.canStart = false;
    // 初始化userAnswers为每题空数组（多选）或空字符串（单选）
    this.userAnswers = this.questions.map(q => (q.multiple ? [] : ""));
  }
};
</script>

<style scoped>

.questionnaire-bg {
  min-height: 100vh; /* 确保至少占满整个视口高度 */
  width: 100%; /* 确保宽度完整 */
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0; /* 移除可能的外边距 */
  padding: 0; /* 确保没有内边距导致滚动 */
  box-sizing: border-box;
  background: linear-gradient(135deg, #e0f7fa 0%, #f8fafc 60%, #fce4ec 100%);
  background-attachment: fixed;
  background-size: cover;
  background-image: url(./assets/Wenjuan.jpg);  
  
}
.questionnaire-bg::before, .questionnaire-bg::after {
  content: "";
  position: fixed;
  z-index: 0;
  width: 160px;
  height: 160px;
  pointer-events: none;
  opacity: 0.18;
  background-repeat: no-repeat;
  background-size: contain;
}
.questionnaire-bg::before {
  left: 2vw;
  top: 2vw;
  background-image: url('data:image/svg+xml;utf8,<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="40" cy="60" rx="24" ry="18" fill="%23bdbdbd"/><ellipse cx="28" cy="38" rx="7" ry="10" fill="%2390caf9"/><ellipse cx="52" cy="38" rx="7" ry="10" fill="%23a5d6a7"/><ellipse cx="22" cy="60" rx="6" ry="8" fill="%23ffb74d"/><ellipse cx="58" cy="60" rx="6" ry="8" fill="%23ba68c8"/><ellipse cx="120" cy="40" rx="22" ry="16" fill="%23ffb74d"/><ellipse cx="108" cy="22" rx="6" ry="8" fill="%23bdbdbd"/><ellipse cx="132" cy="22" rx="6" ry="8" fill="%2390caf9"/><ellipse cx="102" cy="40" rx="5" ry="7" fill="%23a5d6a7"/><ellipse cx="138" cy="40" rx="5" ry="7" fill="%23ba68c8"/></g></svg>');
}
.questionnaire-bg::after {
  right: 2vw;
  bottom: 2vw;
  background-image: url('data:image/svg+xml;utf8,<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="120" cy="100" rx="24" ry="18" fill="%23ffb74d"/><ellipse cx="108" cy="78" rx="7" ry="10" fill="%23bdbdbd"/><ellipse cx="132" cy="78" rx="7" ry="10" fill="%2390caf9"/><ellipse cx="102" cy="100" rx="6" ry="8" fill="%23a5d6a7"/><ellipse cx="138" cy="100" rx="6" ry="8" fill="%23ba68c8"/><ellipse cx="40" cy="120" rx="22" ry="16" fill="%23bdbdbd"/><ellipse cx="28" cy="102" rx="6" ry="8" fill="%23ffb74d"/><ellipse cx="52" cy="102" rx="6" ry="8" fill="%2390caf9"/><ellipse cx="22" cy="120" rx="5" ry="7" fill="%23a5d6a7"/><ellipse cx="58" cy="120" rx="5" ry="7" fill="%23ba68c8"/></g></svg>');
}

h1 {
  font-size: 2em;
  margin-bottom: 1em;
  text-align: center;
  color: #2a5298;
  letter-spacing: 2px;
}
.questionnaire-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box; /* 修复为border-box */
  margin-bottom: 40px;
  margin-left: auto;      /* 中心对齐 */
  margin-right: auto;     /* 中心对齐 */
  max-width: 800px;       /* 适当宽度 */
  width: 92%;            /* 占页面宽度的92% */
  background: rgba(255, 255, 255, 0.596);
  backdrop-filter: blur(5px); 
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(200, 209, 223, 0.698);
  padding: 40px 32px 32px 32px;
  position: relative;
  z-index: 1;
}
.question-block {
  background: transparent; /* 完全透明背景 */
  border-radius: 10px;
  padding: 22px 22px 12px 22px;
  box-shadow: none; /* 移除阴影 */
  margin-bottom: 0;
  text-align: left;
  border: 1px solid rgba(253, 253, 253, 0.861); /* 极低透明度的边框 */
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.question-title {
  font-weight: bold;
  color: #2a5298;
  margin-bottom: 12px;
  display: block;
  font-size: 1.1em;
  padding-left: 10px;  /* 添加左侧内边距 */
  border-left: 4px solid #4facfe;  /* 添加左侧装饰 */
  text-align: left; /* 确保文本左对齐 */
  width: 100%; /* 确保宽度占满容器 */
  box-sizing: border-box; /* 确保padding不会影响宽度 */
}
.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 修改为左对齐 */
  gap: 16px;               /* 水平间距 */
  row-gap: 14px;          /* 垂直间距 */
  margin-top: 12px;
  padding-left: 10px; 
}
.option-label {
  flex: 0 0 calc(50% - 16px); /* 修改为固定宽度占比，确保每行两个 */
  max-width: calc(50% - 16px); /* 保持最大宽度限制 */
  min-width: 180px;          /* 保留最小宽度 */
  box-sizing: border-box;    /* 确保padding不影响总宽度 */
  /* 其他样式保持不变 */
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1em;
  background: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(30,60,114,0.06);
  cursor: pointer;
  user-select: none;
  margin-bottom: 0;
  transition: transform 0.2s ease;
}
.option-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30,60,114,0.12);
}
input[type="checkbox"], input[type="radio"] {
  accent-color: #2a5298;
  width: 18px;
  height: 18px;
}
.submit-btn {
  margin-top: 32px;
  padding: 14px 48px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  border: none;
  border-radius: 28px;
  font-size: 1.15em;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(30, 60, 114, 0.13);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  outline: none;
  letter-spacing: 2px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.submit-btn:hover {
  background: linear-gradient(90deg, #2a5298 0%, #4facfe 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px rgba(30, 60, 114, 0.18);
}

/* 答题须知弹窗样式 */
.notice-modal {
  position: fixed;
  z-index: 2000;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.notice-content {
  background: #fff;
  border-radius: 12px;
  padding: 30px 30px 30px 30px;
  max-width: 660px;
  width: 90vw;
  box-shadow: 0 15px 32px rgba(30, 60, 114, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center; /* 修改为居中对齐 */
  position: relative;
  text-align: center;
}
.notice-content h2 {
  margin-bottom: 18px;
  text-align: center;
  font-size: 1.6em;
  color: #305aa2;
  letter-spacing: 2px;
}
.notice-scroll {
  max-height: 260px;
  overflow-y: auto;
  margin-bottom: 32px;
  padding-right: 8px;
  border: 1px solid #d9e1ea;
  border-radius: 6px;
  background: #f8fafc;
}
.notice-scroll ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.notice-scroll li {
  text-align: left;
  padding: 12px 0 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1em;
  color: #303133;
  padding-left: 0.5em;
}
.notice-scroll li:last-child {
  border-bottom: none;
}
.start-btn {
  position: absolute;
  right: 28px;
  bottom: 14px;
  padding: 10px 17px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: #f7f7f7;
  border: none;
  border-radius: 24px;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(30, 60, 114, 0.13);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  outline: none;
  letter-spacing: 2px;
}
.start-btn:hover {
  background: linear-gradient(90deg, #2a5298 0%, #4facfe 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px rgba(30, 60, 114, 0.18);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>