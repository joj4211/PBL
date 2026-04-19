import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, TestTube, ChevronDown, ChevronRight } from 'lucide-react';

const CASE = '張女士，35歲，主訴長期疲倦、面色蒼白、頭暈3個月，近日症狀加劇。無出血病史，飲食正常。月經量偏多。';

const STAGES = [
  {
    title: '第一組：基本血液常規',
    labs: [
      { name: 'Hemoglobin (Hb)',  value: '7.2',  unit: 'g/dL',  ref: '12–16',  flag: '↓↓', abnormal: true },
      { name: 'MCV',              value: '68',   unit: 'fL',    ref: '80–100', flag: '↓',  abnormal: true },
      { name: 'MCH',              value: '22',   unit: 'pg',    ref: '27–33',  flag: '↓',  abnormal: true },
      { name: 'MCHC',             value: '30',   unit: 'g/dL',  ref: '32–36',  flag: '↓',  abnormal: true },
      { name: 'WBC',              value: '6.8',  unit: 'K/µL',  ref: '4–11',   flag: '',   abnormal: false },
      { name: 'Platelet',         value: '320',  unit: 'K/µL',  ref: '150–400',flag: '',   abnormal: false },
    ],
    question: '根據上述血液常規，這是什麼類型的貧血？',
    options: [
      { id: 'micro',  text: '小球性低色素貧血（Microcytic Hypochromic）', correct: true },
      { id: 'macro',  text: '大球性貧血（Macrocytic）',                   correct: false },
      { id: 'normo',  text: '正球性貧血（Normocytic）',                   correct: false },
    ],
    explain: '低 MCV、MCH、MCHC 提示小球性低色素貧血，最常見原因為缺鐵性貧血、地中海型貧血。',
  },
  {
    title: '第二組：鐵代謝檢查',
    labs: [
      { name: 'Serum Iron',        value: '28',  unit: 'µg/dL', ref: '60–170',  flag: '↓',  abnormal: true },
      { name: 'TIBC',              value: '490', unit: 'µg/dL', ref: '250–370', flag: '↑',  abnormal: true },
      { name: 'Transferrin Sat.',  value: '5.7', unit: '%',     ref: '20–50',   flag: '↓',  abnormal: true },
      { name: 'Ferritin',          value: '4',   unit: 'ng/mL', ref: '10–120',  flag: '↓↓', abnormal: true },
    ],
    question: '鐵代謝結果最符合哪一種貧血類型？',
    options: [
      { id: 'ida',    text: '缺鐵性貧血（Iron Deficiency Anemia）',    correct: true },
      { id: 'ana',    text: '慢性病貧血（Anemia of Chronic Disease）', correct: false },
      { id: 'thal',   text: '地中海型貧血（Thalassemia）',              correct: false },
    ],
    explain: 'Ferritin ↓↓ + TIBC ↑ + Transferrin Sat. ↓ 是缺鐵性貧血的典型組合。慢性病貧血的 Ferritin 通常正常或升高。',
  },
  {
    title: '第三組：補充確認檢查',
    labs: [
      { name: 'Reticulocyte Count', value: '1.2', unit: '%',     ref: '0.5–1.5',flag: '',   abnormal: false },
      { name: 'Hemoglobin A2',      value: '2.1', unit: '%',     ref: '<3.5',   flag: '',   abnormal: false },
      { name: 'Stool OB test',      value: '陰性', unit: '—',   ref: '陰性',   flag: '',   abnormal: false },
    ],
    question: '已排除地中海型貧血及消化道出血，此貧血的最可能原因是？',
    options: [
      { id: 'menstrual', text: '月經量過多導致慢性失血性缺鐵',      correct: true },
      { id: 'diet',      text: '飲食鐵攝取不足',                    correct: false },
      { id: 'malabs',    text: '鐵吸收障礙（如乳糜瀉）',            correct: false },
    ],
    explain: 'Hb A2 正常排除β地中海型貧血；大便潛血陰性排除消化道出血。月經量多（menorrhagia）是育齡女性缺鐵貧血的最常見原因。',
  },
  {
    title: '第四組：治療選擇',
    labs: [
      { name: '確診', value: '缺鐵性貧血（月經量過多所致）', unit: '', ref: '', flag: '', abnormal: false },
    ],
    question: '下列哪一個初步治療計畫最合適？',
    options: [
      { id: 'correct', text: '口服鐵劑補充（3–6個月）+ 婦科評估月經過多原因', correct: true },
      { id: 'b12',     text: '肌肉注射 Vitamin B12',                           correct: false },
      { id: 'transfusion', text: '立即輸血（2單位 pRBC）',                     correct: false },
    ],
    explain: 'Hb 7.2 g/dL、無急性症狀，無需緊急輸血。口服鐵劑（如 Ferrous sulfate 300mg tid）是首選，並應同步評估月經過多的根本原因（如子宮肌瘤、功能性子宮出血）。',
  },
];

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

export default function LabResults({ onBack }) {
  const [stage,     setStage]     = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [revealed,  setRevealed]  = useState([false, false, false, false]);
  const [finished,  setFinished]  = useState(false);

  const current = STAGES[stage];
  const selected = answers[stage];
  const answered = selected !== undefined;
  const isCorrect = answered && current.options.find(o => o.id === selected)?.correct;

  const revealNext = () => {
    setRevealed(p => { const n = [...p]; n[stage] = true; return n; });
  };

  const handleSelect = (id) => {
    if (!answers[stage]) setAnswers(p => ({ ...p, [stage]: id }));
  };

  const handleNext = () => {
    if (stage < STAGES.length - 1) setStage(s => s + 1);
    else setFinished(true);
  };

  const correctCount = Object.entries(answers).filter(([idx, ans]) =>
    STAGES[+idx].options.find(o => o.id === ans)?.correct
  ).length;

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
            檢驗結果 · 貧血
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">逐步揭露檢驗 Lab Results</h1>
        <p className="text-sm text-warm-600 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 mb-6 leading-relaxed">
          {CASE}
        </p>

        {/* Progress */}
        <div className="flex gap-2 mb-5">
          {STAGES.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
              i < stage ? 'bg-sage-400' : i === stage ? 'bg-sage-500' : 'bg-warm-200'}`} />
          ))}
        </div>

        {!finished ? (
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              {/* Lab table */}
              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-sage-500" />{current.title}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-warm-400 border-b border-warm-200">
                        <th className="text-left py-1.5 pr-4">項目</th>
                        <th className="text-right py-1.5 pr-4">數值</th>
                        <th className="text-right py-1.5 pr-4">單位</th>
                        <th className="text-right py-1.5">參考值</th>
                      </tr>
                    </thead>
                    <tbody>
                      {current.labs.map((lab, i) => (
                        <tr key={i} className={`border-b border-warm-100 ${lab.abnormal ? 'bg-red-50/30' : ''}`}>
                          <td className="py-2 pr-4 text-warm-700 font-medium">{lab.name}</td>
                          <td className={`py-2 pr-4 text-right font-bold ${lab.abnormal ? 'text-red-500' : 'text-warm-800'}`}>
                            {lab.value} <span className="text-xs">{lab.flag}</span>
                          </td>
                          <td className="py-2 pr-4 text-right text-warm-400 text-xs">{lab.unit}</td>
                          <td className="py-2 text-right text-warm-400 text-xs">{lab.ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Question */}
              <div className="glass-card p-5">
                <p className="text-sm font-semibold text-warm-800 mb-3">{current.question}</p>
                <div className="flex flex-col gap-2">
                  {current.options.map(opt => {
                    const isSel = selected === opt.id;
                    const showResult = answered;
                    return (
                      <button key={opt.id} onClick={() => handleSelect(opt.id)}
                        disabled={answered}
                        className={`text-left text-sm px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          !showResult
                            ? isSel
                              ? 'border-sage-400 bg-sage-50/60'
                              : 'border-warm-200 bg-white/30 hover:bg-white/60 hover:border-sage-300'
                            : opt.correct
                              ? 'border-sage-400 bg-sage-50/70'
                              : isSel
                                ? 'border-red-300 bg-red-50/60'
                                : 'border-warm-200 bg-white/20 opacity-50'
                        }`}>
                        {showResult && (opt.correct ? '✓ ' : isSel ? '✗ ' : '')}{opt.text}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 text-xs rounded-xl px-4 py-2.5 border ${
                      isCorrect ? 'bg-sage-50/60 border-sage-200 text-sage-700' : 'bg-amber-50/60 border-amber-200 text-amber-700'}`}>
                    {isCorrect ? '✓ 回答正確！' : '✗ 答案不正確。'} {current.explain}
                  </motion.div>
                )}

                {answered && (
                  <button onClick={handleNext}
                    className="mt-3 w-full py-2.5 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all flex items-center justify-center gap-1">
                    {stage < STAGES.length - 1 ? '下一組檢查' : '完成案例'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-lg font-bold text-warm-900 mb-4">案例完成！</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className={`text-3xl font-bold ${correctCount >= 3 ? 'text-sage-600' : 'text-amber-600'}`}>
                {correctCount} / {STAGES.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-800">答題正確率</p>
                <p className="text-xs text-warm-500">{correctCount === 4 ? '完美！邏輯縝密' : '繼續加強臨床推理'}</p>
              </div>
            </div>
            <div className="text-sm bg-sage-50/50 border border-sage-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-sage-700 mb-1">最終診斷與治療摘要</p>
              <p className="text-warm-700 leading-relaxed">
                <strong>診斷</strong>：缺鐵性貧血（月經量過多所致）<br />
                <strong>治療</strong>：口服鐵劑 Ferrous sulfate 300mg tid × 3–6個月，
                視 Ferritin 恢復情況調整。同步婦科評估子宮異常出血原因（功能性子宮出血 vs 器質性病因）。<br />
                <strong>監測</strong>：治療後2週 Reticulocyte 應上升（治療反應），3個月後複查 CBC 及 Ferritin。
              </p>
            </div>
            <button onClick={() => { setStage(0); setAnswers({}); setRevealed([false,false,false,false]); setFinished(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
