import { motion } from 'framer-motion';
import { ChevronLeft, MessageCircle, Hand, ScanLine, ListOrdered, TestTube, Workflow, Heart, Pill, Clock, FileText } from 'lucide-react';

const PAGES = [
  {
    id: 'history',
    title: '問診練習',
    subtitle: '選擇問診問題，觀察病人回應',
    icon: MessageCircle,
    tag: '內科',
    desc: '58歲男性胸痛案例，練習完整的病史詢問技巧，掌握AMI關鍵問診要素。',
    color: 'sage',
  },
  {
    id: 'physical',
    title: '身體檢查',
    subtitle: '點擊人體部位，獲取檢查發現',
    icon: Hand,
    tag: '急腹症',
    desc: '45歲女性腹痛案例，點擊腹部各區域及特殊手法，學習急性膽囊炎的診斷。',
    color: 'warm',
  },
  {
    id: 'imaging',
    title: '影像判讀',
    subtitle: '在CT示意圖上標記異常位置',
    icon: ScanLine,
    tag: '胸部CT',
    desc: '67歲男性長期吸菸，點擊CT影像中的異常區域，練習肺癌早期病灶判讀。',
    color: 'sage',
  },
  {
    id: 'differential',
    title: '鑑別診斷',
    subtitle: '拖拉排序，建立診斷清單',
    icon: ListOrdered,
    tag: '發燒',
    desc: '28歲男性高燒合併淋巴結腫大，拖拉排列鑑別診斷優先順序，訓練臨床推理。',
    color: 'warm',
  },
  {
    id: 'labs',
    title: '檢驗結果',
    subtitle: '逐步揭露數值，做出決策',
    icon: TestTube,
    tag: '貧血',
    desc: '35歲女性疲倦貧血，分階段揭露血液檢查，練習逐步推理缺鐵性貧血的診斷。',
    color: 'sage',
  },
  {
    id: 'treatment',
    title: '治療決策',
    subtitle: '互動流程圖，選擇治療路徑',
    icon: Workflow,
    tag: '高血壓危症',
    desc: '54歲男性高血壓急症，透過決策樹選擇正確的診斷分類、降壓目標與用藥。',
    color: 'warm',
  },
  {
    id: 'anatomy',
    title: '解剖標示',
    subtitle: '點選標籤到正確解剖位置',
    icon: Heart,
    tag: '心臟解剖',
    desc: '點選心臟解剖標籤並放置到示意圖中正確位置，強化心臟四腔及大血管記憶。',
    color: 'sage',
  },
  {
    id: 'drugs',
    title: '藥物選擇',
    subtitle: '勾選適合藥物，查看禁忌症',
    icon: Pill,
    tag: '腎功能不全',
    desc: '72歲CKD第3期患者，勾選適合藥物，即時顯示禁忌症警示，避免用藥錯誤。',
    color: 'warm',
  },
  {
    id: 'timeline',
    title: '症狀時間軸',
    subtitle: '將事件排列到正確時間點',
    icon: Clock,
    tag: '腦中風',
    desc: '68歲男性急性腦中風，將關鍵事件放置至正確時間點，學習中風黃金處置流程。',
    color: 'sage',
  },
  {
    id: 'report',
    title: '結案報告',
    subtitle: '填寫病例報告，對比標準答案',
    icon: FileText,
    tag: '肺炎',
    desc: '52歲女性社區型肺炎，完成診斷、嚴重度、治療及追蹤計畫的結案報告填寫。',
    color: 'warm',
  },
];

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function InteractiveGallery({ onSelectPage, onBack }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)' }}>
      {/* Ambient orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle,#B8D0A8,transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle,#DFC99E,transparent 70%)', animationDelay: '2s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <button onClick={onBack}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 transition-all">
              <ChevronLeft className="w-3 h-3" />返回功能維護
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-warm-900 font-serif">互動頁面目錄</h1>
            <p className="text-warm-500 mt-2">10 個獨立醫學情境，涵蓋問診、檢查、影像、決策等臨床技能。</p>
          </motion.div>

          <motion.div variants={fadeUp} className="w-16 h-0.5 bg-warm-200 mb-8" />

          {/* Grid */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAGES.map((page) => {
              const Icon = page.icon;
              const isSage = page.color === 'sage';
              return (
                <motion.button
                  key={page.id}
                  variants={fadeUp}
                  onClick={() => onSelectPage(page.id)}
                  className="glass-card p-5 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSage ? 'bg-sage-100' : 'bg-warm-100'}`}>
                      <Icon className={`w-5 h-5 ${isSage ? 'text-sage-500' : 'text-warm-500'}`} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      isSage
                        ? 'text-sage-600 bg-sage-50 border-sage-200'
                        : 'text-warm-600 bg-warm-100 border-warm-200'}`}>
                      {page.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-warm-900 text-base mb-0.5 group-hover:text-sage-700 transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-xs font-medium text-warm-500 mb-2">{page.subtitle}</p>
                  <p className="text-xs text-warm-400 leading-relaxed">{page.desc}</p>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
