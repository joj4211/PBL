import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Pill, AlertTriangle, CheckCircle } from 'lucide-react';

const CASE = '鄭先生，72歲，患有慢性腎臟病第3期（eGFR 35 mL/min）、高血壓、痛風病史。目前因糖尿病腎病變 + 高血壓就診，需要調整藥物治療。請勾選適合此病人的藥物。';

const DRUGS = [
  {
    id: 'acei',
    name: 'ACE 抑制劑（Enalapril）',
    category: '降壓藥',
    appropriate: true,
    reason: '✓ 適合：ACEI/ARB 在 CKD 合併蛋白尿患者中有腎臟保護作用，為第一線用藥（需監測 K+ 及 Cr）。',
    contraindication: null,
  },
  {
    id: 'metformin',
    name: 'Metformin',
    category: '糖尿病藥',
    appropriate: false,
    reason: '✗ 禁忌：eGFR < 30 應完全停用，eGFR 30–45 應謹慎並減量使用。此病人 eGFR 35，使用有乳酸酸中毒風險。',
    contraindication: 'eGFR < 45 謹慎，< 30 禁用',
  },
  {
    id: 'ccb',
    name: 'Amlodipine（鈣離子拮抗劑）',
    category: '降壓藥',
    appropriate: true,
    reason: '✓ 適合：CCB 不經腎代謝，在 CKD 患者安全，可合併 ACEI/ARB 使用。',
    contraindication: null,
  },
  {
    id: 'nsaid',
    name: 'Ibuprofen（NSAIDs）',
    category: '止痛藥',
    appropriate: false,
    reason: '✗ 禁忌：NSAIDs 會降低腎血流、抑制前列腺素，在 CKD 患者中可能導致急性腎損傷（AKI）。',
    contraindication: 'CKD 禁用',
  },
  {
    id: 'allopurinol',
    name: 'Allopurinol（降尿酸藥）',
    category: '痛風藥',
    appropriate: true,
    reason: '✓ 適合：CKD 患者痛風管理可使用 Allopurinol，需依 eGFR 調整劑量（eGFR 35 → 100mg/day）。',
    contraindication: null,
  },
  {
    id: 'febuxostat',
    name: 'Febuxostat（降尿酸藥）',
    category: '痛風藥',
    appropriate: true,
    reason: '✓ 適合：Febuxostat 主要由肝臟代謝，輕中度 CKD 患者相對安全，但需注意心血管風險。',
    contraindication: null,
  },
  {
    id: 'colchicine',
    name: 'Colchicine（急性痛風）',
    category: '痛風藥',
    appropriate: false,
    reason: '✗ 謹慎：Colchicine 在 CKD 患者中清除率下降，有神經肌肉毒性風險，需嚴格減量，通常避免用於 eGFR < 30。',
    contraindication: 'eGFR < 30 避免使用',
  },
  {
    id: 'furosemide',
    name: 'Furosemide（利尿劑）',
    category: '降壓/利尿藥',
    appropriate: true,
    reason: '✓ 適合：Loop diuretic 在 CKD 患者中仍有效，適用於合併水腫或高血壓，但需監測電解質。',
    contraindication: null,
  },
];

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

export default function DrugSelection({ onBack }) {
  const [selected,  setSelected]  = useState(new Set());
  const [hovered,   setHovered]   = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => {
    if (submitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const correctSelected   = DRUGS.filter(d => d.appropriate  &&  selected.has(d.id));
  const incorrectSelected = DRUGS.filter(d => !d.appropriate &&  selected.has(d.id));
  const missed            = DRUGS.filter(d => d.appropriate  && !selected.has(d.id));

  const score = correctSelected.length - incorrectSelected.length;
  const maxScore = DRUGS.filter(d => d.appropriate).length;

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
            藥物選擇 · 腎功能不全
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">藥物選擇 Drug Selection</h1>
        <p className="text-sm text-warm-600 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 mb-6 leading-relaxed">
          {CASE}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Drug list */}
          <div className="md:col-span-2 glass-card p-5">
            <h2 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-sage-500" />勾選適合此病人的藥物
            </h2>
            <div className="flex flex-col gap-2">
              {DRUGS.map(drug => {
                const isSel = selected.has(drug.id);
                const showResult = submitted;
                const isCorrectChoice = drug.appropriate && isSel;
                const isWrongChoice   = !drug.appropriate && isSel;
                const isMissed        = drug.appropriate && !isSel;

                return (
                  <div key={drug.id}
                    onMouseEnter={() => setHovered(drug.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => toggle(drug.id)}
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      showResult
                        ? isCorrectChoice
                          ? 'border-sage-400 bg-sage-50/70'
                          : isWrongChoice
                            ? 'border-red-300 bg-red-50/60'
                            : isMissed
                              ? 'border-amber-300 bg-amber-50/40'
                              : 'border-warm-200 bg-white/20 opacity-60'
                        : isSel
                          ? 'border-sage-400 bg-sage-50/60'
                          : 'border-warm-200 bg-white/30 hover:bg-white/60 hover:border-sage-300'
                    }`}>
                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      isSel ? 'border-sage-500 bg-sage-500' : 'border-warm-300 bg-white/60'}`}>
                      {isSel && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-warm-800">{drug.name}</p>
                        <span className="text-xs text-warm-400 bg-warm-100 border border-warm-200 px-1.5 py-0.5 rounded-full">
                          {drug.category}
                        </span>
                      </div>
                      {drug.contraindication && (
                        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />{drug.contraindication}
                        </p>
                      )}
                    </div>
                    {showResult && (
                      <span className="text-xs font-bold shrink-0">
                        {isCorrectChoice ? '✓' : isWrongChoice ? '✗' : isMissed ? '漏選' : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-warm-700 mb-2">病人資料摘要</p>
              <ul className="text-xs text-warm-500 space-y-1">
                <li>• CKD Stage 3（eGFR 35）</li>
                <li>• 高血壓 + 蛋白尿</li>
                <li>• 糖尿病腎病變</li>
                <li>• 痛風病史</li>
                <li>• 年齡 72 歲</li>
              </ul>
            </div>

            {/* Hover info */}
            <AnimatePresence>
              {hovered && !submitted && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="glass-card p-4">
                  <p className="text-xs font-semibold text-warm-600 mb-1">
                    {DRUGS.find(d => d.id === hovered)?.name}
                  </p>
                  {DRUGS.find(d => d.id === hovered)?.contraindication ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {DRUGS.find(d => d.id === hovered)?.contraindication}
                    </p>
                  ) : (
                    <p className="text-xs text-sage-600">無主要禁忌症紀錄</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {selected.size > 0 && !submitted && (
              <button onClick={() => setSubmitted(true)}
                className="py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
                送出選擇
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-5">
            <h2 className="text-lg font-bold text-warm-900 mb-3">藥物選擇評估</h2>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-sage-50 border border-sage-200 rounded-xl py-2">
                <div className="text-xl font-bold text-sage-600">{correctSelected.length}</div>
                <div className="text-xs text-warm-500">正確選擇</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl py-2">
                <div className="text-xl font-bold text-red-500">{incorrectSelected.length}</div>
                <div className="text-xs text-warm-500">錯誤選擇</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl py-2">
                <div className="text-xl font-bold text-amber-600">{missed.length}</div>
                <div className="text-xs text-warm-500">遺漏</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {[...incorrectSelected, ...missed, ...correctSelected].map(drug => (
                <div key={drug.id} className={`text-xs rounded-xl px-4 py-2.5 border ${
                  selected.has(drug.id) && drug.appropriate ? 'bg-sage-50 border-sage-200' :
                  selected.has(drug.id) && !drug.appropriate ? 'bg-red-50/70 border-red-200' :
                  'bg-amber-50/60 border-amber-200'}`}>
                  <p className="font-semibold text-warm-800">{drug.name}</p>
                  <p className="text-warm-500 mt-0.5">{drug.reason}</p>
                </div>
              ))}
            </div>

            <button onClick={() => { setSelected(new Set()); setSubmitted(false); }}
              className="text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
