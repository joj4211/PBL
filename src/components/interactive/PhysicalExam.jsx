import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Hand } from 'lucide-react';

const REGIONS = [
  {
    id: 'ruq', label: 'RUQ\n右上腹', x: 55, y: 32, w: 38, h: 28,
    finding: '墨菲氏徵象陽性（Murphy\'s sign +），局部壓痛，輕度肌肉緊繃。',
    note: '提示膽囊炎可能性高',
  },
  {
    id: 'luq', label: 'LUQ\n左上腹', x: 7, y: 32, w: 38, h: 28,
    finding: '觸診無明顯壓痛，脾臟未觸及腫大。',
    note: '無特殊陽性發現',
  },
  {
    id: 'epi', label: '上腹部\nEpigastrium', x: 31, y: 10, w: 38, h: 24,
    finding: '輕度壓痛，無反彈痛，未觸及腫塊。',
    note: '須排除消化性潰瘍',
  },
  {
    id: 'umb', label: '臍部\nUmbilical', x: 31, y: 38, w: 38, h: 24,
    finding: '腸音正常（5次/分），無壓痛。',
    note: '腸道功能正常',
  },
  {
    id: 'rlq', label: 'RLQ\n右下腹', x: 55, y: 60, w: 38, h: 28,
    finding: 'McBurney 點輕度壓痛，Rebound tenderness（-），Rovsing\'s sign（-）。',
    note: '闌尾炎可能性低',
  },
  {
    id: 'llq', label: 'LLQ\n左下腹', x: 7, y: 60, w: 38, h: 28,
    finding: '觸診無明顯壓痛，無腫塊。',
    note: '無特殊陽性發現',
  },
];

const SPECIAL = [
  { id: 'murphy', label: 'Murphy\'s Sign', finding: '陽性：深吸氣時右上腹壓痛加劇，病人停止吸氣。高度提示急性膽囊炎。' },
  { id: 'rebound', label: 'Rebound Tenderness', finding: '陰性：放開壓力時無劇烈反彈痛，腹膜炎可能性低。' },
  { id: 'psoas', label: 'Psoas Sign', finding: '陰性：右大腿伸直抬高無疼痛。' },
];

const CORRECT_DX = '急性膽囊炎（Acute Cholecystitis）';

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

export default function PhysicalExamInteractive({ onBack }) {
  const [examined,  setExamined]  = useState([]);
  const [activeId,  setActiveId]  = useState(null);
  const [specials,  setSpecials]  = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleRegion = (r) => {
    setActiveId(r.id);
    if (!examined.some(e => e.id === r.id)) setExamined(p => [...p, r]);
  };

  const handleSpecial = (s) => {
    if (!specials.some(e => e.id === s.id)) setSpecials(p => [...p, s]);
  };

  const active = [...REGIONS, ...SPECIAL.map(s => ({ id: s.id, finding: s.finding }))].find(r => r.id === activeId);
  const allDone = examined.length >= 4;

  return (
    <div style={BG} className="relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle,#B8D0A8,transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 transition-all">
            <ChevronLeft className="w-3 h-3" />返回目錄
          </button>
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-3 py-1 rounded-full">
            身體檢查 · 急腹症
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">腹部身體檢查 Physical Examination</h1>
        <p className="text-sm text-warm-500 mb-6">
          王女士，45歲，急性腹痛12小時。請點擊腹部各區域進行觸診，並選擇特殊檢查手法。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Body diagram */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
              <Hand className="w-4 h-4 text-sage-500" />點擊腹部區域觸診
            </h2>
            <div className="relative mx-auto" style={{ width: '100%', maxWidth: 280 }}>
              {/* Body outline */}
              <svg viewBox="0 0 100 110" className="w-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}>
                {/* Torso */}
                <ellipse cx="50" cy="60" rx="42" ry="50" fill="#FFF8F0" stroke="#DFC99E" strokeWidth="1.5" />
                {/* Head */}
                <ellipse cx="50" cy="12" rx="16" ry="14" fill="#FFF8F0" stroke="#DFC99E" strokeWidth="1.5" />
                {/* Dividing lines */}
                <line x1="50" y1="28" x2="50" y2="96" stroke="#DFC99E" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="10" y1="58" x2="90" y2="58" stroke="#DFC99E" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="10" y1="38" x2="90" y2="38" stroke="#DFC99E" strokeWidth="0.8" strokeDasharray="2,2" />
                {/* Navel */}
                <circle cx="50" cy="58" r="2" fill="#DFC99E" />
                {/* Clickable regions */}
                {REGIONS.map(r => (
                  <rect key={r.id}
                    x={r.x} y={r.y + 20} width={r.w} height={r.h}
                    rx="4"
                    fill={examined.some(e => e.id === r.id) ? '#87AE7330' : 'transparent'}
                    stroke={activeId === r.id ? '#5E8847' : examined.some(e => e.id === r.id) ? '#87AE73' : 'transparent'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all"
                    onClick={() => handleRegion(r)}
                  />
                ))}
              </svg>
              {/* Region labels overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {REGIONS.map(r => (
                  <div key={r.id + '-lbl'}
                    className="absolute text-center"
                    style={{
                      left: `${r.x}%`, top: `${(r.y + 20) / 110 * 100 + 1}%`,
                      width: `${r.w}%`,
                    }}>
                    <span className={`text-[9px] leading-tight whitespace-pre-line font-medium pointer-events-none ${
                      examined.some(e => e.id === r.id) ? 'text-sage-700' : 'text-warm-400'}`}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special tests */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-warm-600 mb-2">特殊檢查手法</p>
              <div className="flex flex-wrap gap-2">
                {SPECIAL.map(s => (
                  <button key={s.id} onClick={() => { handleSpecial(s); setActiveId(s.id); }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      specials.some(e => e.id === s.id)
                        ? 'border-sage-300 bg-sage-50 text-sage-700'
                        : 'border-warm-200 bg-white/40 text-warm-600 hover:border-sage-300'
                    }`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Findings panel */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-5 flex-1">
              <h2 className="text-sm font-semibold text-warm-700 mb-3">檢查發現</h2>
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.div key={activeId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-warm-800 text-sm leading-relaxed">{active.finding}</p>
                    {'note' in active && (
                      <p className="text-sage-600 text-xs mt-2 italic">{active.note}</p>
                    )}
                  </motion.div>
                ) : (
                  <p className="text-xs text-warm-400 italic">點擊腹部區域或特殊手法，發現將顯示於此…</p>
                )}
              </AnimatePresence>
            </div>

            {/* Examined list */}
            {examined.length > 0 && (
              <div className="glass-card p-4">
                <p className="text-xs font-semibold text-warm-600 mb-2">已完成檢查</p>
                <div className="flex flex-wrap gap-1">
                  {examined.map(r => (
                    <span key={r.id} className="text-xs bg-sage-50 border border-sage-200 text-sage-700 px-2 py-0.5 rounded-full">
                      {r.label?.replace('\n', ' ')}
                    </span>
                  ))}
                  {specials.map(s => (
                    <span key={s.id} className="text-xs bg-warm-100 border border-warm-200 text-warm-700 px-2 py-0.5 rounded-full">
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {allDone && !submitted && (
              <button onClick={() => setSubmitted(true)}
                className="py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
                完成檢查 → 查看診斷解析
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-5">
            <h2 className="text-lg font-bold text-warm-900 mb-2">診斷解析</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sage-700 font-semibold text-sm bg-sage-50 border border-sage-200 px-3 py-1 rounded-full">
                最可能診斷：{CORRECT_DX}
              </span>
            </div>
            <div className="text-sm text-warm-700 bg-sage-50/50 border border-sage-200 rounded-xl px-4 py-3 leading-relaxed">
              <p className="font-semibold text-sage-700 mb-1">臨床解析</p>
              Murphy's sign 陽性是急性膽囊炎的經典體徵。右上腹局部壓痛合併肌肉緊繃、體溫上升，
              符合急性膽囊炎典型表現。應安排腹部超音波確認膽囊壁增厚及膽石，
              抽血查 WBC、CRP、LFT，並考慮外科會診。
            </div>
            <button onClick={() => { setExamined([]); setSpecials([]); setActiveId(null); setSubmitted(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
