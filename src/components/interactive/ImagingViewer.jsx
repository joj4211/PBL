import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ScanLine, X } from 'lucide-react';

const FINDINGS = [
  { id: 'nodule', cx: 72, cy: 42, r: 8,  label: '右肺上葉結節',    desc: '約1.8cm毛玻璃狀結節（GGO），邊緣不規則，高度懷疑惡性病灶。',         correct: true },
  { id: 'hilum',  cx: 55, cy: 55, r: 6,  label: '右肺門淋巴腫大',  desc: '右側肺門可見淋巴結腫大（>1cm），須排除縱膈淋巴結轉移。',            correct: true },
  { id: 'normal', cx: 30, cy: 45, r: 7,  label: '左肺正常區域',    desc: '左肺實質均勻，無明顯浸潤或結節，此區域無異常。',                     correct: false },
  { id: 'heart',  cx: 45, cy: 60, r: 10, label: '心臟陰影',        desc: '心臟大小正常（CTR < 0.5），無心肌病或心包積液跡象，此區域無異常。', correct: false },
];

const HINT_REGIONS = [
  { id: 'right-lung', cx: 68, cy: 50, rx: 22, ry: 28, label: '右肺' },
  { id: 'left-lung',  cx: 32, cy: 50, rx: 20, ry: 28, label: '左肺' },
];

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

export default function ImagingViewer({ onBack }) {
  const [markers,   setMarkers]   = useState([]);
  const [hovered,   setHovered]   = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClick = (e) => {
    if (submitted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width)  * 100;
    const py = ((e.clientY - rect.top)  / rect.height) * 100;
    const id  = `m${Date.now()}`;
    setMarkers(p => [...p, { id, cx: px, cy: py }]);
  };

  const removeMarker = (id) => setMarkers(p => p.filter(m => m.id !== id));

  const correctHit = (m) =>
    FINDINGS.filter(f => f.correct).some(f => Math.hypot(m.cx - f.cx, m.cy - f.cy) < f.r + 6);

  const hitFindings = submitted
    ? FINDINGS.filter(f => f.correct && markers.some(m => Math.hypot(m.cx - f.cx, m.cy - f.cy) < f.r + 6))
    : [];
  const missedFindings = submitted
    ? FINDINGS.filter(f => f.correct && !markers.some(m => Math.hypot(m.cx - f.cx, m.cy - f.cy) < f.r + 6))
    : [];
  const falsePositives = submitted
    ? markers.filter(m => !correctHit(m))
    : [];

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
            影像判讀 · 胸部 CT
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">胸部 CT 判讀 Imaging Interpretation</h1>
        <p className="text-sm text-warm-500 mb-2">
          李先生，67歲，慢性乾咳3個月、體重下降5公斤。以下為胸部 CT 橫切面示意圖（肺窗）。
        </p>
        <p className="text-xs text-warm-400 mb-6">
          點擊影像中<strong className="text-warm-600">疑似異常的位置</strong>以放置標記，可點擊標記右上角 ✕ 移除。完成後點擊「送出判讀」。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CT Image */}
          <div className="md:col-span-2">
            <div className="glass-card p-3 overflow-hidden">
              <div className="relative rounded-xl overflow-hidden cursor-crosshair select-none"
                style={{ background: '#1a1a2e', aspectRatio: '4/3' }}
                onClick={handleClick}>
                <svg viewBox="0 0 100 75" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Background gradient for CT feel */}
                  <defs>
                    <radialGradient id="ctBg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2a2a3e" />
                      <stop offset="100%" stopColor="#0a0a18" />
                    </radialGradient>
                  </defs>
                  <rect width="100" height="75" fill="url(#ctBg)" />

                  {/* Lung fields */}
                  <ellipse cx="32" cy="47" rx="20" ry="27" fill="#3a3a5e" opacity="0.8" />
                  <ellipse cx="68" cy="47" rx="22" ry="27" fill="#3a3a5e" opacity="0.8" />

                  {/* Lung texture lines */}
                  {[35,40,45,50,55].map(y => (
                    <line key={y} x1="14" y1={y} x2="50" y2={y} stroke="#4a4a7e" strokeWidth="0.3" opacity="0.5" />
                  ))}
                  {[35,40,45,50,55].map(y => (
                    <line key={y + 'r'} x1="50" y1={y} x2="88" y2={y} stroke="#4a4a7e" strokeWidth="0.3" opacity="0.5" />
                  ))}

                  {/* Mediastinum / heart */}
                  <ellipse cx="45" cy="55" rx="12" ry="10" fill="#5a4a3e" opacity="0.9" />

                  {/* Spine */}
                  <ellipse cx="50" cy="65" rx="5" ry="4" fill="#888" opacity="0.7" />

                  {/* Ribs */}
                  {[-20,-10,0,10,20].map((offset, i) => (
                    <path key={i} d={`M 12 ${40 + offset} Q 30 ${28 + offset} 50 ${32 + offset}`}
                      fill="none" stroke="#aaa" strokeWidth="0.8" opacity="0.4" />
                  ))}
                  {[-20,-10,0,10,20].map((offset, i) => (
                    <path key={'r' + i} d={`M 88 ${40 + offset} Q 70 ${28 + offset} 50 ${32 + offset}`}
                      fill="none" stroke="#aaa" strokeWidth="0.8" opacity="0.4" />
                  ))}

                  {/* Findings (visible even before submit as subtle outlines) */}
                  {!submitted && FINDINGS.map(f => (
                    <circle key={f.id} cx={f.cx} cy={f.cy * 0.75} r={f.r}
                      fill="transparent" stroke="transparent" />
                  ))}

                  {/* After submit: show correct answer circles */}
                  {submitted && FINDINGS.filter(f => f.correct).map(f => (
                    <circle key={f.id} cx={f.cx} cy={f.cy * 0.75} r={f.r + 2}
                      fill="none" stroke="#87AE73" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.9" />
                  ))}
                  {submitted && FINDINGS.filter(f => f.correct).map(f => (
                    <text key={f.id + 't'} x={f.cx} y={f.cy * 0.75 - f.r - 3}
                      fill="#87AE73" fontSize="4" textAnchor="middle">{f.label}</text>
                  ))}

                  {/* User markers */}
                  {markers.map(m => (
                    <g key={m.id}>
                      {submitted ? (
                        <circle cx={m.cx} cy={m.cy * 0.75} r="4"
                          fill={correctHit(m) ? '#87AE7360' : '#EF444460'}
                          stroke={correctHit(m) ? '#87AE73' : '#EF4444'}
                          strokeWidth="1.5" />
                      ) : (
                        <circle cx={m.cx} cy={m.cy * 0.75} r="4"
                          fill="#FFD70040" stroke="#FFD700" strokeWidth="1.5" />
                      )}
                      {/* Crosshair */}
                      <line x1={m.cx - 6} y1={m.cy * 0.75} x2={m.cx + 6} y2={m.cy * 0.75}
                        stroke={submitted ? (correctHit(m) ? '#87AE73' : '#EF4444') : '#FFD700'}
                        strokeWidth="0.8" />
                      <line x1={m.cx} y1={m.cy * 0.75 - 6} x2={m.cx} y2={m.cy * 0.75 + 6}
                        stroke={submitted ? (correctHit(m) ? '#87AE73' : '#EF4444') : '#FFD700'}
                        strokeWidth="0.8" />
                    </g>
                  ))}

                  {/* Scale bar */}
                  <line x1="5" y1="70" x2="15" y2="70" stroke="#fff" strokeWidth="0.8" />
                  <text x="10" y="73.5" fill="#fff" fontSize="3" textAnchor="middle">1cm</text>

                  {/* Labels */}
                  <text x="32" y="4" fill="#aaa" fontSize="4" textAnchor="middle">L</text>
                  <text x="68" y="4" fill="#aaa" fontSize="4" textAnchor="middle">R</text>
                </svg>
              </div>

              {/* Remove markers */}
              {markers.length > 0 && !submitted && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {markers.map((m, i) => (
                    <button key={m.id} onClick={() => removeMarker(m.id)}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-warm-200 bg-white/50 text-warm-600 hover:bg-red-50 hover:border-red-200 transition-all">
                      標記{i + 1}<X className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-warm-700 mb-2">操作說明</p>
              <ul className="text-xs text-warm-500 space-y-1.5">
                <li>• 點擊影像中疑似異常區域</li>
                <li>• 黃色十字為您放置的標記</li>
                <li>• 點擊「標記N」可刪除</li>
                <li>• 至少放置 1 個標記才能送出</li>
              </ul>
            </div>

            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-warm-700 mb-2">臨床資訊</p>
              <p className="text-xs text-warm-500 leading-relaxed">
                67歲男性，長期吸菸史（40包年）<br />
                慢性乾咳、體重減輕<br />
                無發燒、無咳血<br />
                血氧飽和度 96%
              </p>
            </div>

            {!submitted && markers.length > 0 && (
              <button onClick={() => setSubmitted(true)}
                className="py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition-all shadow-md">
                送出判讀
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-5">
            <h2 className="text-lg font-bold text-warm-900 mb-3">判讀回饋</h2>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-sage-50 border border-sage-200 rounded-xl py-3">
                <div className="text-2xl font-bold text-sage-600">{hitFindings.length}</div>
                <div className="text-xs text-warm-500">正確標記</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl py-3">
                <div className="text-2xl font-bold text-amber-600">{missedFindings.length}</div>
                <div className="text-xs text-warm-500">遺漏病灶</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl py-3">
                <div className="text-2xl font-bold text-red-500">{falsePositives.length}</div>
                <div className="text-xs text-warm-500">誤判區域</div>
              </div>
            </div>
            {FINDINGS.filter(f => f.correct).map(f => (
              <div key={f.id} className={`text-sm rounded-xl px-4 py-2.5 mb-2 border ${
                hitFindings.includes(f) ? 'bg-sage-50/70 border-sage-200' : 'bg-amber-50/70 border-amber-200'}`}>
                <p className="font-semibold text-warm-800">{hitFindings.includes(f) ? '✓' : '✗'} {f.label}</p>
                <p className="text-warm-500 text-xs mt-0.5">{f.desc}</p>
              </div>
            ))}
            <div className="text-sm bg-sage-50/50 border border-sage-200 rounded-xl px-4 py-3 mt-3">
              <p className="font-semibold text-sage-700 mb-1">臨床解析</p>
              <p className="text-warm-700 leading-relaxed">
                右肺上葉 GGO 結節合併右肺門淋巴結腫大，在長期吸菸老年患者中，
                高度懷疑<strong>肺腺癌（Adenocarcinoma）</strong>伴早期縱膈淋巴結轉移（N1/N2）。
                建議安排 PET-CT 分期及支氣管鏡/CT 導引切片確診。
              </p>
            </div>
            <button onClick={() => { setMarkers([]); setSubmitted(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新練習
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
