# Medical PBL

耳鼻喉科的問題導向學習（PBL）平台：學生依科別完成臨床案例，並以前後測評估學習成效，作答紀錄供研究分析。

## Language

**Domain**:
科別，目前為 ear、nose、throat 三者之一；每個 Case 恰好屬於一個 Domain。對應資料庫的 `domain` 與 `domain_id`。
_Avoid_: Topic（舊稱）、科目、category

**Case**:
一個臨床案例，身分以其資料夾名稱為準（例如 `nose_epistaxis_hht`），同一個 Case 有中英兩個語言版本。
_Avoid_: 病例、scenario

**Step Case**:
以逐步作答形式進行的 Case，學生依序回答每一步的題目。
_Avoid_: nose case、phase flow case
