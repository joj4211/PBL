import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, CheckCircle } from 'lucide-react';

const CASE = '吳先生，68歲，被家人發現右側肢體無力及說話困難，送急診。病人有高血壓病史，長期服藥。以下是中風事件的各個關鍵時間點，請將事件卡片拖放至正確的時間軸位置。';

const EVENTS = [
  { id: 'symptom_onset', text: '症狀開始\n右側肢體無力＋失語', correctSlot: 0, color: 'red' },
  { id: 'family_notice', text: '家人發現\n呼叫120', correctSlot: 1, color: 'orange' },
  { id: 'ambulance',     text: '救護車到達\n生命徵象評估', correctSlot: 2, color: 'amber' },
  { id: 'er_arrival',    text: '到達急診\nGCS評估 + IV access', correctSlot: 3, color: 'yellow' },
  { id: 'ct_scan',       text: 'CT頭部掃描\n排除腦出血', correctSlot: 4, color: 'lime' },
  { id: 'tpa',           text: '靜脈注射tPA\n（發病<4.5小時）', correctSlot: 5, color: 'sage' },
];

const SLOTS = [
  { id: 0, time: '0 分鐘',   label: '發病時間',   hint: 'Time of onset' },
  { id: 1, time: '5 分鐘',   label: '發現時間',   hint: 'Discovery' },
  { id: 2, time: '15 分鐘',  label: '救護車到達', hint: 'EMS arrival' },
  { id: 3, time: '40 分鐘',  label: '急診評估',   hint: 'ED evaluation (Door time)' },
  { id: 4, time: '60 分鐘',  label: '影像檢查',   hint: 'Door-to-CT < 25 min' },
  { id: 5, time: '90 分鐘',  label: '治療介入',   hint: 'Door-to-needle < 60 min' },
];

const colorMap = {
  red:    { bg: 'bg-red-100',    border: 'border-red-300',    text: 'text-red-800'    },
  orange: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
  amber:  { bg: 'bg-amber-100',  border: 'border-amber-300',  text: 'text-amber-800'  },
  yellow: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
  lime:   { bg: 'bg-lime-100',   border: 'border-lime-300',   text: 'text-lime-800'   },
  sage:   { bg: 'bg-sage-100',   border: 'border-sage-300',   text: 'text-sage-800'   },
};

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

export default function CaseTimeline({ onBack }) {
  const [selected,  setSelected]  = useState(null);
  const [placements,setPlacments] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const placedInSlot   = (slotId)  => EVENTS.find(e => placements[e.id] === slotId);
  const eventPlacement = (eventId) => placements[eventId];
  const isPlaced       = (eventId) => placements[eventId] !== undefined;
  const unplaced       = EVENTS.filter(e => !isPlaced(e.id));

  const handleEventClick = (eventId) => {
    if (submitted) return;
    setSelected(prev => prev === eventId ? null : eventId);
  };

  const handleSlotClick = (slotId) => {
    if (submitted || !selected) return;
    setPlacments(prev => {
      const next = { ...prev };
      // Remove from current slot if event was placed somewhere
      Object.keys(next).forEach(k => { if (next[k] === slotId) delete next[k]; });
      // Place selected event in this slot
      next[selected] = slotId;
      return next;
    });
    setSelected(null);
  };

  const removeFromSlot = (eventId) => {
    if (submitted) return;
    setPlacments(prev => { const n = { ...prev }; delete n[eventId]; return n; });
  };

  const isCorrect  = (eventId) => placements[eventId] === EVENTS.find(e => e.id === eventId)?.correctSlot;
  const scoreCount = EVENTS.filter(e => isCorrect(e.id)).length;
  const allPlaced  = unplaced.length === 0;

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
            症狀時間軸 · 腦中風
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">中風事件時間軸 Stroke Timeline</h1>
        <p className="text-sm text-warm-600 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 mb-6 leading-relaxed">
          {CASE}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Timeline */}
          <div className="md:col-span-2 glass-card p-5">
            <h2 className="text-sm font-semibold text-warm-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sage-500" />時間軸（點擊空格放置事件）
            </h2>
            <div className="relative">
              {/* Timeline bar */}
              <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-warm-200" />
              <div className="flex flex-col gap-3">
                {SLOTS.map(slot => {
                  const placedEvent = placedInSlot(slot.id);
                  const correct = submitted && placedEvent && isCorrect(placedEvent.id);
                  const wrong   = submitted && placedEvent && !isCorrect(placedEvent.id);
                  const colors  = placedEvent ? colorMap[placedEvent.color] : null;

                  return (
                    <div key={slot.id} className="flex items-center gap-3">
                      {/* Time label */}
                      <div className="w-12 text-right shrink-0">
                        <p className="text-xs font-bold text-warm-600">{slot.time}</p>
                      </div>
                      {/* Node */}
                      <div className={`w-3 h-3 rounded-full border-2 shrink-0 z-10 ${
                        placedEvent ? 'bg-sage-400 border-sage-500' : 'bg-white border-warm-300'}`} />
                      {/* Slot */}
                      <div
                        onClick={() => !placedEvent && handleSlotClick(slot.id)}
                        className={`flex-1 min-h-14 rounded-xl border-2 px-3 py-2 transition-all duration-200 ${
                          placedEvent
                            ? `${colors.bg} ${colors.border} cursor-default`
                            : selected
                              ? 'border-sage-400 bg-sage-50/40 cursor-pointer hover:bg-sage-50/60'
                              : 'border-warm-200 bg-white/20'
                        } ${submitted && correct ? 'border-sage-500' : ''} ${submitted && wrong ? 'border-red-300' : ''}`}>
                        {placedEvent ? (
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={`text-xs font-semibold ${colors.text} whitespace-pre-line leading-tight`}>
                                {placedEvent.text}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {submitted && (
                                <span className="text-xs font-bold">{correct ? '✓' : '✗'}</span>
                              )}
                              {!submitted && (
                                <button onClick={(e) => { e.stopPropagation(); removeFromSlot(placedEvent.id); }}
                                  className="text-xs text-warm-400 hover:text-red-400 transition-colors">
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-semibold text-warm-500">{slot.label}</p>
                            <p className="text-xs text-warm-300">{slot.hint}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Events panel */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-4">
              <h2 className="text-sm font-semibold text-warm-700 mb-3">事件卡片</h2>
              {unplaced.length === 0 ? (
                <p className="text-xs text-sage-600">✓ 所有事件已放置！</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {unplaced.map(event => {
                    const colors = colorMap[event.color];
                    const isSel  = selected === event.id;
                    return (
                      <button key={event.id} onClick={() => handleEventClick(event.id)}
                        className={`text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-all duration-200 whitespace-pre-line leading-tight ${
                          isSel
                            ? `${colors.border} ${colors.bg} shadow-md ring-2 ring-sage-400`
                            : `${colors.border} ${colors.bg} hover:shadow-sm cursor-pointer`
                        } ${colors.text}`}>
                        {event.text}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selected && (
              <p className="text-xs text-sage-600 text-center animate-pulse">
                ← 點擊時間軸上的空格放置
              </p>
            )}

            {allPlaced && !submitted && (
              <button onClick={() => setSubmitted(true)}
                className="py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
                送出時間軸
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-5">
            <h2 className="text-lg font-bold text-warm-900 mb-3">時間軸評估</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-3xl font-bold ${scoreCount >= 5 ? 'text-sage-600' : scoreCount >= 3 ? 'text-amber-600' : 'text-red-500'}`}>
                {scoreCount} / {EVENTS.length}
              </div>
              <p className="text-sm text-warm-600">{scoreCount === 6 ? '完美！中風時間軸掌握清楚' : '繼續複習中風處置流程'}</p>
            </div>
            <div className="text-sm bg-sage-50/50 border border-sage-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-sage-700 mb-2">中風黃金時間（Time is Brain）</p>
              <p className="text-warm-700 leading-relaxed text-xs">
                • <strong>Door-to-CT</strong>：急診到完成 CT 頭部 ≤ 25 分鐘<br />
                • <strong>Door-to-Needle</strong>：急診到給予靜脈 tPA ≤ 60 分鐘<br />
                • <strong>tPA 適應症</strong>：缺血性中風發病 ≤ 4.5 小時，排除出血及禁忌症<br />
                • <strong>取栓適應症</strong>：大血管阻塞（LVO）發病 ≤ 24 小時，神經科評估後考慮機械取栓
              </p>
            </div>
            <button onClick={() => { setPlacments({}); setSelected(null); setSubmitted(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
