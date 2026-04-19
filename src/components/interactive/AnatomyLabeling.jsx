import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Tag } from 'lucide-react';

const LABELS = [
  { id: 'ra',  text: '右心房 Right Atrium',   x: 64, y: 34, matchId: 'ra'  },
  { id: 'rv',  text: '右心室 Right Ventricle', x: 62, y: 60, matchId: 'rv'  },
  { id: 'la',  text: '左心房 Left Atrium',     x: 34, y: 34, matchId: 'la'  },
  { id: 'lv',  text: '左心室 Left Ventricle',  x: 28, y: 60, matchId: 'lv'  },
  { id: 'ao',  text: '主動脈 Aorta',           x: 35, y: 14, matchId: 'ao'  },
  { id: 'pa',  text: '肺動脈 Pulmonary Artery',x: 55, y: 14, matchId: 'pa'  },
];

const HOTSPOTS = [
  { id: 'ra', cx: 65, cy: 35, r: 10, label: '?' },
  { id: 'rv', cx: 63, cy: 60, r: 10, label: '?' },
  { id: 'la', cx: 36, cy: 36, r: 10, label: '?' },
  { id: 'lv', cx: 30, cy: 62, r: 11, label: '?' },
  { id: 'ao', cx: 37, cy: 16, r:  8, label: '?' },
  { id: 'pa', cx: 55, cy: 17, r:  8, label: '?' },
];

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

export default function AnatomyLabeling({ onBack }) {
  const [selected,  setSelected]  = useState(null);
  const [placed,    setPlaced]    = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleLabel = (labelId) => {
    if (submitted) return;
    setSelected(prev => prev === labelId ? null : labelId);
  };

  const handleHotspot = (hotspotId) => {
    if (submitted || !selected) return;
    setPlaced(prev => {
      const next = { ...prev };
      // Remove any previous placement of the selected label
      Object.keys(next).forEach(k => { if (next[k] === selected) delete next[k]; });
      next[hotspotId] = selected;
      return next;
    });
    setSelected(null);
  };

  const placedLabel = (hotspotId) => LABELS.find(l => l.id === placed[hotspotId]);
  const isCorrect   = (hotspotId) => placed[hotspotId] === hotspotId;

  const score = HOTSPOTS.filter(h => isCorrect(h.id)).length;
  const allPlaced = Object.keys(placed).length === HOTSPOTS.length;
  const usedIds = new Set(Object.values(placed));

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
            解剖標示 · 心臟
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">心臟解剖標示 Anatomy Labeling</h1>
        <p className="text-sm text-warm-500 mb-6">
          點選右側標籤卡（出現藍框）後，再點擊心臟示意圖中對應的「?」區域完成標示。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Heart SVG */}
          <div className="md:col-span-2 glass-card p-5">
            <div className="relative mx-auto" style={{ maxWidth: 380 }}>
              <svg viewBox="0 0 100 90" className="w-full">
                <defs>
                  <radialGradient id="heartGrad" cx="45%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#FFF5F5" />
                    <stop offset="100%" stopColor="#FFEAEA" />
                  </radialGradient>
                </defs>

                {/* Heart body */}
                <path d="M 50 80 C 15 65 5 40 15 25 C 22 14 35 14 42 22 C 46 26 50 30 50 30 C 50 30 54 26 58 22 C 65 14 78 14 85 25 C 95 40 85 65 50 80 Z"
                  fill="url(#heartGrad)" stroke="#DFC99E" strokeWidth="1.2" />

                {/* Septum line */}
                <line x1="50" y1="28" x2="50" y2="74" stroke="#DFC99E" strokeWidth="0.8" strokeDasharray="2,2" />

                {/* AV line */}
                <line x1="20" y1="46" x2="80" y2="46" stroke="#DFC99E" strokeWidth="0.8" strokeDasharray="2,2" />

                {/* Great vessels - Aorta */}
                <path d="M 38 22 Q 32 8 40 4 Q 48 0 45 10 L 42 22 Z"
                  fill="#FFDAD4" stroke="#CEB07A" strokeWidth="0.8" />
                <text x="37" y="9" fontSize="4" fill="#9A7A4A" textAnchor="middle">Ao</text>

                {/* Pulmonary artery */}
                <path d="M 58 22 Q 62 8 60 4 Q 58 0 55 8 L 56 22 Z"
                  fill="#D4E8FF" stroke="#8AA8C8" strokeWidth="0.8" />
                <text x="63" y="9" fontSize="4" fill="#5A78A8" textAnchor="middle">PA</text>

                {/* Hotspot circles */}
                {HOTSPOTS.map(h => {
                  const lbl = placedLabel(h.id);
                  const correct = submitted && isCorrect(h.id);
                  const wrong   = submitted && placed[h.id] && !isCorrect(h.id);
                  return (
                    <g key={h.id}
                      onClick={() => handleHotspot(h.id)}
                      className={selected ? 'cursor-pointer' : 'cursor-default'}>
                      <circle cx={h.cx} cy={h.cy} r={h.r}
                        fill={
                          lbl
                            ? submitted ? (correct ? '#87AE7340' : '#EF444430') : '#87AE7325'
                            : selected ? '#FFD70025' : 'rgba(255,255,255,0.15)'
                        }
                        stroke={
                          lbl
                            ? submitted ? (correct ? '#87AE73' : '#EF4444') : '#87AE73'
                            : selected ? '#FFD700' : '#DFC99E'
                        }
                        strokeWidth="1.2"
                        strokeDasharray={lbl ? '' : '2,2'} />
                      <text x={h.cx} y={h.cy + 1.5} fontSize="3.5" fill={lbl ? '#3A5529' : '#9A7A4A'}
                        textAnchor="middle" dominantBaseline="middle">
                        {lbl ? lbl.id.toUpperCase() : '?'}
                      </text>
                    </g>
                  );
                })}

                {/* Labels */}
                <text x="26" y="32" fontSize="4" fill="#B89660" textAnchor="middle">LA</text>
                <text x="74" y="32" fontSize="4" fill="#B89660" textAnchor="middle">RA</text>
                <text x="26" y="62" fontSize="4" fill="#B89660" textAnchor="middle">LV</text>
                <text x="74" y="62" fontSize="4" fill="#B89660" textAnchor="middle">RV</text>
              </svg>
            </div>
          </div>

          {/* Labels panel */}
          <div className="flex flex-col gap-3">
            <div className="glass-card p-4">
              <h2 className="text-sm font-semibold text-warm-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-sage-500" />選擇標籤
              </h2>
              <div className="flex flex-col gap-2">
                {LABELS.map(l => {
                  const isUsed = usedIds.has(l.id);
                  const isSel  = selected === l.id;
                  return (
                    <button key={l.id} onClick={() => !isUsed && handleLabel(l.id)}
                      disabled={isUsed && !isSel}
                      className={`text-left text-xs px-3 py-2 rounded-xl border-2 transition-all duration-200 ${
                        isSel
                          ? 'border-sage-500 bg-sage-100/60 text-sage-800 shadow-md'
                          : isUsed
                            ? 'border-warm-100 bg-white/10 text-warm-300 opacity-50 cursor-not-allowed'
                            : 'border-warm-200 bg-white/30 hover:bg-white/60 hover:border-sage-300 text-warm-700 cursor-pointer'
                      }`}>
                      {l.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {selected && (
              <p className="text-xs text-sage-600 text-center animate-pulse">
                ← 點擊心臟上的「?」放置標籤
              </p>
            )}

            {allPlaced && !submitted && (
              <button onClick={() => setSubmitted(true)}
                className="py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
                送出標示
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-5">
            <h2 className="text-lg font-bold text-warm-900 mb-3">標示結果</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-3xl font-bold ${score >= 5 ? 'text-sage-600' : score >= 3 ? 'text-amber-600' : 'text-red-500'}`}>
                {score} / {HOTSPOTS.length}
              </div>
              <p className="text-sm text-warm-600">
                {score === 6 ? '完美！心臟解剖掌握清楚' : score >= 4 ? '不錯！複習一下錯誤部分' : '繼續加強心臟解剖'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {HOTSPOTS.map(h => (
                <div key={h.id} className={`text-xs rounded-xl px-3 py-2 border ${
                  isCorrect(h.id) ? 'bg-sage-50 border-sage-200' : 'bg-red-50/60 border-red-200'}`}>
                  <span className="font-semibold">{isCorrect(h.id) ? '✓' : '✗'} </span>
                  {LABELS.find(l => l.id === h.id)?.text}
                  {!isCorrect(h.id) && placed[h.id] && (
                    <span className="text-red-500"> (你標：{LABELS.find(l => l.id === placed[h.id])?.text.split(' ')[0]})</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm bg-sage-50/50 border border-sage-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-sage-700 mb-1">記憶口訣</p>
              <p className="text-warm-700 leading-relaxed">
                左心系統（LA→LV→Ao）：接受肺靜脈回流，泵出氧合血至全身。<br />
                右心系統（RA→RV→PA）：接受體靜脈回流，泵出去氧血至肺臟。<br />
                瓣膜：二尖瓣（LA/LV間）、三尖瓣（RA/RV間）、主動脈瓣、肺動脈瓣。
              </p>
            </div>
            <button onClick={() => { setPlaced({}); setSelected(null); setSubmitted(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
