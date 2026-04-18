import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle, MessageCircle, AlertCircle } from 'lucide-react';

const QUESTIONS = [
  { id: 'onset',     text: '胸痛什麼時候開始的？',                          response: '大約兩小時前突然開始，在休息時發作。',                  key: true },
  { id: 'quality',   text: '可以描述胸痛的感覺嗎？（壓迫、刺痛、燒灼？）', response: '感覺像是有人坐在胸口，很沉重的壓迫感。',               key: true },
  { id: 'radiation', text: '疼痛有沒有延伸到其他地方？',                    response: '有，痛感延伸到左手臂和下巴。',                         key: true },
  { id: 'severity',  text: '以0至10分評估，疼痛強度是幾分？',               response: '大概8分，非常痛。',                                    key: true },
  { id: 'associated',text: '有沒有合併其他症狀？（冒汗、呼吸困難、噁心）', response: '有，我一直冒冷汗，有點喘，也稍微噁心。',               key: true },
  { id: 'pmhx',      text: '過去有沒有心臟病、高血壓或糖尿病的病史？',     response: '有高血壓10年了，有在服藥，但偶爾忘記吃。',             key: true },
  { id: 'meds',      text: '目前有在服用哪些藥物？',                        response: '有服用 Amlodipine 5mg，但有時忘記吃。',                key: false },
  { id: 'family',    text: '家族中有沒有心臟病史？',                        response: '我父親50多歲時心肌梗塞，後來過世了。',                  key: false },
  { id: 'social',    text: '有沒有抽菸、喝酒或使用其他物質？',              response: '有抽菸，抽了30年，每天一包。不太喝酒。',               key: false },
  { id: 'allergy',   text: '有沒有藥物過敏？',                              response: '對盤尼西林（Penicillin）過敏，之前吃過起疹子。',       key: false },
];

const KEY_IDS = QUESTIONS.filter(q => q.key).map(q => q.id);

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

export default function HistoryTaking({ onBack }) {
  const [asked, setAsked]       = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAsk = (q) => {
    if (!asked.some(a => a.id === q.id)) setAsked(p => [...p, q]);
  };

  const keyAsked  = asked.filter(q => q.key).length;
  const missedIds = KEY_IDS.filter(id => !asked.some(a => a.id === id));

  return (
    <div style={BG} className="relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle,#B8D0A8,transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle,#DFC99E,transparent 70%)', animationDelay: '2s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 transition-all">
            <ChevronLeft className="w-3 h-3" />返回目錄
          </button>
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-3 py-1 rounded-full">
            問診練習 · 內科
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">病史詢問 History Taking</h1>
        <p className="text-sm text-warm-500 mb-6">
          陳先生，58歲，男性，因胸痛至急診就醫。您是值班醫師，請選擇想詢問的問題，病人會依序回答。
        </p>

        {!submitted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Questions */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-sage-500" />選擇問診問題
              </h2>
              <div className="flex flex-col gap-2">
                {QUESTIONS.map(q => {
                  const isAsked = asked.some(a => a.id === q.id);
                  return (
                    <button key={q.id} onClick={() => handleAsk(q)} disabled={isAsked}
                      className={`text-left text-sm px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                        isAsked
                          ? 'border-sage-300 bg-sage-50/60 text-sage-700 cursor-default'
                          : 'border-warm-200 bg-white/30 hover:bg-white/60 hover:border-sage-300 text-warm-800'
                      }`}>
                      {isAsked && <CheckCircle className="w-3 h-3 inline mr-1.5 text-sage-500" />}
                      {q.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Responses */}
            <div className="flex flex-col gap-4">
              <div className="glass-card p-5 flex-1">
                <h2 className="text-sm font-semibold text-warm-700 mb-3">病人回答</h2>
                {asked.length === 0 ? (
                  <p className="text-xs text-warm-400 italic">點擊左側問題，病人會在此回應…</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                    <AnimatePresence>
                      {asked.map(q => (
                        <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                          <p className="text-warm-400 text-xs mb-0.5">你問：{q.text}</p>
                          <p className="text-warm-800 text-sm bg-white/50 rounded-lg px-3 py-2">{q.response}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {asked.length > 0 && (
                <button onClick={() => setSubmitted(true)}
                  className="py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
                  完成問診 → 查看評估
                </button>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-lg font-bold text-warm-900 mb-4">問診評估結果</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className={`text-3xl font-bold ${keyAsked >= 5 ? 'text-sage-600' : 'text-amber-600'}`}>
                {keyAsked} / {KEY_IDS.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-800">關鍵問題已詢問</p>
                <p className="text-xs text-warm-500">{keyAsked >= 5 ? '問診完整，掌握關鍵病史' : '尚有重要問題未詢問'}</p>
              </div>
            </div>

            {missedIds.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />遺漏的關鍵問題
                </p>
                {QUESTIONS.filter(q => missedIds.includes(q.id)).map(q => (
                  <div key={q.id} className="text-sm bg-amber-50/70 border border-amber-200 rounded-xl px-4 py-2.5 mb-2">
                    <p className="text-warm-700 font-medium">{q.text}</p>
                    <p className="text-warm-500 text-xs mt-0.5">答案：{q.response}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm bg-sage-50/60 border border-sage-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-sage-700 mb-1">臨床解析</p>
              <p className="text-warm-700 leading-relaxed">
                此病例高度懷疑<strong>急性心肌梗塞（AMI）</strong>。典型症狀包含胸部壓迫感、左手臂放射痛、冷汗、呼吸困難，
                合併多項危險因子（高血壓未規則服藥、長期吸菸、家族史）。應立即安排 12 導程心電圖及心肌酶
                （Troponin I/T）檢查，並啟動心導管室待命流程。
              </p>
            </div>
            <button onClick={() => { setAsked([]); setSubmitted(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
