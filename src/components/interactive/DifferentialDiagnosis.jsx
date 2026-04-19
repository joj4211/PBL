import { useState } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { ChevronLeft, GripVertical, ArrowUpDown } from 'lucide-react';

const CASE_INFO = `林先生，28歲，持續高燒（39.5°C）4天，合併頸部淋巴結腫大、咽喉炎、脾臟腫大、
疲倦感明顯。血液檢查：白血球計數正常偏高，淋巴球比例上升，可見非典型淋巴球（atypical lymphocytes）。`;

const DIFFERENTIALS = [
  { id: 'mono',    label: '傳染性單核球增多症',  en: 'Infectious Mononucleosis (EBV)',  rank: 1,
    explain: '最符合：高燒、咽喉炎、頸部淋巴腫、脾腫大、非典型淋巴球，EBV感染典型表現。' },
  { id: 'strep',   label: '鏈球菌性咽喉炎',      en: 'Streptococcal Pharyngitis',        rank: 2,
    explain: '咽喉炎、發燒可符合，但無法解釋脾腫大及非典型淋巴球。' },
  { id: 'cmv',     label: 'CMV 感染',            en: 'CMV Mononucleosis',                rank: 3,
    explain: '可造成類似單核球增多症表現，但咽喉炎通常較輕微。' },
  { id: 'lymphoma',label: '淋巴瘤',              en: 'Lymphoma',                         rank: 4,
    explain: '需排除，但淋巴瘤通常無急性感染症狀，發展較緩慢。' },
  { id: 'hiv',     label: '急性 HIV 感染',       en: 'Acute HIV Infection',              rank: 5,
    explain: '可造成急性反轉錄病毒症候群，但需詳問危險因子。' },
  { id: 'toxo',    label: '弓形蟲感染',          en: 'Toxoplasmosis',                    rank: 6,
    explain: '可造成淋巴結腫大，但高燒及咽喉炎較少見。' },
];

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

function DraggableItem({ item, submitted, correctRank, currentIndex }) {
  const controls = useDragControls();
  const isCorrect = submitted && currentIndex + 1 === item.rank;

  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/40 backdrop-blur-sm ${
        submitted
          ? isCorrect
            ? 'border-sage-400 bg-sage-50/60'
            : 'border-red-200 bg-red-50/40'
          : 'border-warm-200 hover:border-sage-300 hover:bg-white/60 cursor-grab'
      }`}>
      <div onPointerDown={(e) => !submitted && controls.start(e)}
        className={`touch-none ${submitted ? 'opacity-30' : 'cursor-grab active:cursor-grabbing'}`}>
        <GripVertical className="w-4 h-4 text-warm-400" />
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        submitted
          ? isCorrect ? 'bg-sage-500 text-white' : 'bg-red-400 text-white'
          : 'bg-warm-100 text-warm-600'
      }`}>
        {currentIndex + 1}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-warm-800">{item.label}</p>
        <p className="text-xs text-warm-400">{item.en}</p>
      </div>
      {submitted && !isCorrect && (
        <span className="text-xs text-warm-400 shrink-0">正確：第{item.rank}位</span>
      )}
    </Reorder.Item>
  );
}

export default function DifferentialDiagnosis({ onBack }) {
  const [items,     setItems]     = useState(DIFFERENTIALS);
  const [submitted, setSubmitted] = useState(false);

  const score = items.filter((item, idx) => idx + 1 === item.rank).length;

  const shuffle = () => {
    setItems(p => [...p].sort(() => Math.random() - 0.5));
    setSubmitted(false);
  };

  return (
    <div style={BG} className="relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle,#B8D0A8,transparent 70%)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 transition-all">
            <ChevronLeft className="w-3 h-3" />返回目錄
          </button>
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-3 py-1 rounded-full">
            鑑別診斷 · 發燒
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">鑑別診斷排序 Differential Diagnosis</h1>
        <p className="text-sm text-warm-600 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 mb-6 whitespace-pre-line leading-relaxed">
          {CASE_INFO}
        </p>

        <div className="glass-card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-warm-700 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-sage-500" />
              拖拉排序：由最可能到最不可能
            </h2>
            {!submitted && (
              <button onClick={shuffle}
                className="text-xs text-warm-400 hover:text-warm-600 underline">
                亂序重置
              </button>
            )}
          </div>

          <Reorder.Group axis="y" values={items} onReorder={setItems}
            className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <DraggableItem
                key={item.id}
                item={item}
                submitted={submitted}
                correctRank={item.rank}
                currentIndex={idx}
              />
            ))}
          </Reorder.Group>
        </div>

        {!submitted && (
          <button onClick={() => setSubmitted(true)}
            className="w-full py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
            送出排序 → 查看解析
          </button>
        )}

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-3xl font-bold ${score >= 4 ? 'text-sage-600' : score >= 2 ? 'text-amber-600' : 'text-red-500'}`}>
                {score} / {DIFFERENTIALS.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-800">排序正確</p>
                <p className="text-xs text-warm-500">
                  {score >= 5 ? '優秀！鑑別診斷思路清晰' : score >= 3 ? '不錯，繼續加強臨床推理' : '可多加複習此類案例'}
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-warm-700 mb-3">各診斷解析：</p>
            {DIFFERENTIALS.sort((a, b) => a.rank - b.rank).map(item => (
              <div key={item.id} className="text-sm bg-white/50 border border-warm-200 rounded-xl px-4 py-2.5 mb-2">
                <p className="font-semibold text-warm-800">第{item.rank}位：{item.label}</p>
                <p className="text-warm-500 text-xs mt-0.5">{item.explain}</p>
              </div>
            ))}

            <div className="text-sm bg-sage-50/50 border border-sage-200 rounded-xl px-4 py-3 mt-3">
              <p className="font-semibold text-sage-700 mb-1">建議處置</p>
              <p className="text-warm-700 leading-relaxed">
                安排 EBV 血清學（Monospot test + VCA IgM/IgG），注意脾腫大患者應避免激烈運動（防脾破裂）。
                若 EBV 陰性，考慮 CMV PCR 及 HIV 篩檢。
              </p>
            </div>
            <button onClick={() => { setItems([...DIFFERENTIALS].sort(() => Math.random() - 0.5)); setSubmitted(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
