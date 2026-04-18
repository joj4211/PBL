import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Workflow, RotateCcw } from 'lucide-react';

const CASE = '黃先生，54歲，急性高血壓危症（Hypertensive Emergency）。血壓 220/130 mmHg，頭痛劇烈，視乳頭水腫，輕度意識混亂。腎功能：Creatinine 1.8 mg/dL（升高）。無既往腦中風、心肌梗塞病史。';

const TREE = {
  id: 'root',
  question: '第一步：此病人為高血壓急症（Hypertensive Emergency）還是次急症（Urgency）？',
  hint: '關鍵：有無靶器官損害（TOD）',
  choices: [
    {
      id: 'emergency',
      label: '高血壓急症（Emergency）— 有靶器官損傷',
      correct: true,
      feedback: '正確！視乳頭水腫 + 意識改變 + 腎功能惡化 = 靶器官損害，為高血壓急症。',
      next: {
        id: 'route',
        question: '第二步：適當的降壓目標與速度？',
        hint: '急性降壓過快可能導致腦缺血',
        choices: [
          {
            id: 'slow',
            label: '第1小時內降低20–25%，之後緩慢達標',
            correct: true,
            feedback: '正確！過快降壓可能引發腦缺血或冠狀動脈缺血。目標：前1小時降低約20–25%，24–48小時漸進達到安全值。',
            next: {
              id: 'drug',
              question: '第三步：此案例（合併腎功能不全）首選靜脈降壓藥物？',
              hint: '考量腎功能及血腦屏障保護',
              choices: [
                {
                  id: 'nicardipine',
                  label: 'Nicardipine IV（鈣離子通道阻斷劑）',
                  correct: true,
                  feedback: '優秀！Nicardipine 是高血壓急症合併腦病變的首選之一，可精確調控，不影響腎血流。',
                  next: {
                    id: 'monitor',
                    question: '第四步：病人轉入ICU後的監測重點？',
                    hint: '多器官功能監測',
                    choices: [
                      {
                        id: 'full',
                        label: '連續血壓監測 + 神經學評估 + 每日腎功能/眼底追蹤',
                        correct: true,
                        feedback: '完整！ICU 應持續動脈線測壓，神經學評估排除高血壓腦病或腦出血，追蹤腎功能恢復。',
                        next: null,
                      },
                      {
                        id: 'bp_only',
                        label: '僅監測血壓，達標即可出院',
                        correct: false,
                        feedback: '不足。高血壓急症需監測多器官功能，且需查找並治療原發病因（如腎血管性高血壓）。',
                        next: null,
                      },
                    ],
                  },
                },
                {
                  id: 'nitroprusside',
                  label: 'Sodium Nitroprusside IV',
                  correct: false,
                  feedback: '謹慎使用。Nitroprusside 有氰化物毒性風險，且腎功能不全者代謝受限，目前建議不作首選。',
                  next: null,
                },
                {
                  id: 'oral',
                  label: '口服 Nifedipine（短效）舌下含服',
                  correct: false,
                  feedback: '錯誤！短效 Nifedipine 舌下吸收速度難以控制，可能導致血壓驟降，有腦缺血風險，已不建議。',
                  next: null,
                },
              ],
            },
          },
          {
            id: 'fast',
            label: '立即降至正常血壓（< 120/80 mmHg 在1小時內）',
            correct: false,
            feedback: '危險！過於積極的降壓會引起腦自動調節失調，增加腦缺血風險，尤其是有慢性高血壓的患者。',
            next: null,
          },
        ],
      },
    },
    {
      id: 'urgency',
      label: '高血壓次急症（Urgency）— 無靶器官損傷',
      correct: false,
      feedback: '評估不足！視乳頭水腫（高顱壓徵象）和意識改變是明確的靶器官損害，應歸類為高血壓急症。',
      next: null,
    },
  ],
};

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

function DecisionNode({ node, onComplete }) {
  const [selected, setSelected] = useState(null);
  const chosen = node.choices.find(c => c.id === selected);

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card p-5">
        <p className="text-sm font-semibold text-warm-800 mb-1">{node.question}</p>
        {node.hint && <p className="text-xs text-warm-400 italic mb-3">提示：{node.hint}</p>}
        <div className="flex flex-col gap-2">
          {node.choices.map(c => {
            const isSel = selected === c.id;
            return (
              <button key={c.id} onClick={() => !selected && setSelected(c.id)}
                disabled={!!selected}
                className={`text-left text-sm px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  !selected
                    ? 'border-warm-200 bg-white/30 hover:bg-white/60 hover:border-sage-300 text-warm-800'
                    : c.correct
                      ? 'border-sage-400 bg-sage-50/70 text-warm-800'
                      : isSel
                        ? 'border-red-300 bg-red-50/60 text-warm-800'
                        : 'border-warm-100 bg-white/10 text-warm-400 opacity-60'
                }`}>
                {selected && (c.correct ? '✓ ' : isSel ? '✗ ' : '')}{c.label}
              </button>
            );
          })}
        </div>

        {chosen && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-xs rounded-xl px-4 py-2.5 border ${
              chosen.correct ? 'bg-sage-50/60 border-sage-200 text-sage-700' : 'bg-red-50/60 border-red-200 text-red-700'}`}>
            {chosen.feedback}
          </motion.div>
        )}
      </div>

      {/* Continue if correct and has next */}
      {chosen && chosen.correct && chosen.next && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <DecisionNode node={chosen.next} onComplete={onComplete} />
        </motion.div>
      )}

      {/* End node */}
      {chosen && chosen.correct && !chosen.next && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={onComplete}
            className="w-full py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
            完成決策流程 → 查看總結
          </button>
        </motion.div>
      )}

      {/* Retry if wrong */}
      {chosen && !chosen.correct && (
        <button onClick={() => setSelected(null)}
          className="flex items-center justify-center gap-1 text-xs text-warm-500 hover:text-warm-700 underline">
          <RotateCcw className="w-3 h-3" />重新選擇
        </button>
      )}
    </div>
  );
}

export default function TreatmentDecision({ onBack }) {
  const [done,    setDone]    = useState(false);
  const [key,     setKey]     = useState(0);

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
            治療決策 · 高血壓危症
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">治療決策流程 Treatment Decision</h1>
        <p className="text-sm text-warm-600 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 mb-6 leading-relaxed">
          {CASE}
        </p>

        {!done ? (
          <DecisionNode key={key} node={TREE} onComplete={() => setDone(true)} />
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-lg font-bold text-warm-900 mb-3">🎉 決策流程完成！</h2>
            <div className="text-sm bg-sage-50/50 border border-sage-200 rounded-xl px-4 py-4 space-y-2">
              <p className="font-semibold text-sage-700">完整處置摘要</p>
              <p className="text-warm-700 leading-relaxed">
                <strong>診斷</strong>：高血壓急症合併高血壓腦病（Hypertensive Encephalopathy）<br />
                <strong>目標</strong>：前1小時降壓20–25%；24小時達 160/100；48–72小時漸進至目標值<br />
                <strong>藥物</strong>：Nicardipine IV 5–15 mg/hr 持續滴注，依血壓調整劑量<br />
                <strong>監測</strong>：動脈線連續血壓、每2小時神經學評估、每日 BUN/Cr/UA<br />
                <strong>後續</strong>：查找繼發性高血壓（腎血管性高血壓、原醛症），眼科追蹤視乳頭
              </p>
            </div>
            <button onClick={() => { setDone(false); setKey(k => k + 1); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
