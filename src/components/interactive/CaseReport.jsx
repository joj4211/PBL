import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, FileText, ChevronDown } from 'lucide-react';

const CASE_BRIEF = `陳女士，52歲，主訴發燒（38.8°C）、咳嗽帶黃痰、呼吸困難3天。聽診右下肺可聞及濕羅音（crackles）。
血液檢查：WBC 13,500/µL、CRP 85 mg/L。胸部X光：右下葉浸潤影（consolidation）。`;

const MODEL_ANSWERS = {
  diagnosis:     '社區型肺炎（Community-Acquired Pneumonia, CAP）',
  severity:      '中度（PORT/PSI Class III）',
  pathogen:      '肺炎鏈球菌（Streptococcus pneumoniae）為最常見病因',
  treatment:     'Amoxicillin-Clavulanate 口服 + Azithromycin（或單用 β-lactam，依嚴重度）',
  followup:      '治療後48–72小時評估臨床反應；出院後4–6週複查胸部X光確認浸潤吸收',
};

const DIAGNOSIS_OPTIONS = [
  '社區型肺炎（Community-Acquired Pneumonia, CAP）',
  '醫院型肺炎（Hospital-Acquired Pneumonia, HAP）',
  '肺結核（Pulmonary Tuberculosis）',
  '肺膿瘍（Lung Abscess）',
  '急性支氣管炎（Acute Bronchitis）',
];

const SEVERITY_OPTIONS = [
  '輕度（PORT/PSI Class I–II）',
  '中度（PORT/PSI Class III）',
  '重度（PORT/PSI Class IV–V）',
  '極重度（需ICU）',
];

const TREATMENT_OPTIONS = [
  'Amoxicillin-Clavulanate 口服 + Azithromycin（或單用 β-lactam，依嚴重度）',
  '廣效抗生素靜脈注射（Meropenem + Vancomycin）',
  '口服 Levofloxacin 單一療法（呼吸道喹諾酮）',
  'Oseltamivir 抗病毒治療',
  'Isoniazid + Rifampicin 抗結核治療',
];

const BG = { background: 'linear-gradient(135deg,#FAF7F0 0%,#FFFEF8 40%,#F0F5EC 100%)', minHeight: '100vh' };

function SelectField({ label, options, value, onChange, submitted, correctValue }) {
  const isCorrect = submitted && value === correctValue;
  const isWrong   = submitted && value && value !== correctValue;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-warm-700 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => !submitted && onChange(e.target.value)}
          disabled={submitted}
          className={`w-full appearance-none px-4 py-2.5 rounded-xl border-2 text-sm transition-all pr-8 bg-white/50 ${
            isCorrect ? 'border-sage-400 bg-sage-50/60' :
            isWrong   ? 'border-red-300 bg-red-50/40' :
            'border-warm-200 focus:border-sage-400 focus:outline-none'
          }`}>
          <option value="">— 請選擇 —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-warm-400 pointer-events-none" />
      </div>
      {isCorrect && <p className="text-xs text-sage-600 mt-1">✓ 正確</p>}
      {isWrong   && <p className="text-xs text-red-500 mt-1">✗ 正確答案：{correctValue}</p>}
    </div>
  );
}

function TextField({ label, placeholder, value, onChange, submitted, correctValue }) {
  const hasValue  = value.trim().length > 10;
  const isCorrect = submitted && hasValue;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-warm-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => !submitted && onChange(e.target.value)}
        disabled={submitted}
        placeholder={placeholder}
        rows={2}
        className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm resize-none transition-all bg-white/50 ${
          submitted
            ? hasValue ? 'border-sage-300 bg-sage-50/40' : 'border-amber-300 bg-amber-50/30'
            : 'border-warm-200 focus:border-sage-400 focus:outline-none'
        }`} />
      {submitted && (
        <div className={`text-xs mt-1 rounded-lg px-3 py-2 border ${
          hasValue ? 'text-sage-700 bg-sage-50/60 border-sage-200' : 'text-amber-700 bg-amber-50/60 border-amber-200'}`}>
          <strong>參考答案：</strong>{correctValue}
        </div>
      )}
    </div>
  );
}

export default function CaseReport({ onBack }) {
  const [form, setForm] = useState({
    diagnosis: '', severity: '', pathogen: '', treatment: '', followup: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const selectsCorrect =
    form.diagnosis === MODEL_ANSWERS.diagnosis &&
    form.severity  === MODEL_ANSWERS.severity  &&
    form.treatment === MODEL_ANSWERS.treatment;

  const canSubmit =
    form.diagnosis && form.severity && form.pathogen.length > 5 &&
    form.treatment && form.followup.length > 5;

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
            結案報告 · 肺炎
          </span>
        </div>

        <h1 className="text-2xl font-bold text-warm-900 font-serif mb-1">填寫結案報告 Case Report</h1>
        <p className="text-sm text-warm-600 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 mb-6 leading-relaxed whitespace-pre-line">
          {CASE_BRIEF}
        </p>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-sage-500" />
            <h2 className="text-base font-bold text-warm-800">病例結案報告</h2>
          </div>

          <SelectField
            label="1. 最終診斷"
            options={DIAGNOSIS_OPTIONS}
            value={form.diagnosis}
            onChange={v => update('diagnosis', v)}
            submitted={submitted}
            correctValue={MODEL_ANSWERS.diagnosis}
          />

          <SelectField
            label="2. 疾病嚴重度分級"
            options={SEVERITY_OPTIONS}
            value={form.severity}
            onChange={v => update('severity', v)}
            submitted={submitted}
            correctValue={MODEL_ANSWERS.severity}
          />

          <TextField
            label="3. 最可能的致病菌（自由輸入）"
            placeholder="請輸入最可能的致病微生物及理由…"
            value={form.pathogen}
            onChange={v => update('pathogen', v)}
            submitted={submitted}
            correctValue={MODEL_ANSWERS.pathogen}
          />

          <SelectField
            label="4. 建議治療方案"
            options={TREATMENT_OPTIONS}
            value={form.treatment}
            onChange={v => update('treatment', v)}
            submitted={submitted}
            correctValue={MODEL_ANSWERS.treatment}
          />

          <TextField
            label="5. 追蹤計畫（自由輸入）"
            placeholder="請描述治療後的追蹤計畫，包含評估時間點及項目…"
            value={form.followup}
            onChange={v => update('followup', v)}
            submitted={submitted}
            correctValue={MODEL_ANSWERS.followup}
          />

          {!submitted ? (
            <button
              onClick={() => canSubmit && setSubmitted(true)}
              disabled={!canSubmit}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
                canSubmit
                  ? 'bg-sage-500 text-white hover:bg-sage-600'
                  : 'bg-warm-200 text-warm-400 cursor-not-allowed'
              }`}>
              {canSubmit ? '送出報告 → 對比標準答案' : '請完成所有欄位'}
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-2 rounded-xl px-4 py-3 border text-sm ${
                selectsCorrect
                  ? 'bg-sage-50/60 border-sage-300 text-sage-700'
                  : 'bg-amber-50/60 border-amber-200 text-amber-700'
              }`}>
              <p className="font-semibold mb-1">
                {selectsCorrect ? '✓ 優秀！選擇題全部正確' : '部分選擇有出入，請參考標準答案'}
              </p>
              <p className="text-xs">
                社區型肺炎（CAP）是常見的感染性疾病。PORT/PSI 評分幫助分層嚴重度，
                輕中度患者可口服抗生素門診治療，重度患者需住院靜脈注射治療。
                治療後48–72小時應評估臨床改善情形。
              </p>
            </motion.div>
          )}

          {submitted && (
            <button onClick={() => { setForm({ diagnosis:'', severity:'', pathogen:'', treatment:'', followup:'' }); setSubmitted(false); }}
              className="mt-4 text-xs text-warm-500 hover:text-warm-700 underline">
              重新填寫
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
