import ExcelJS from 'exceljs';

function numberToColumnName(index) {
  let dividend = index;
  let columnName = '';

  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
}

function toCellValue(value) {
  if (value == null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
}

function buildColumns(rows = []) {
  const keySet = new Set();

  rows.forEach((row) => {
    if (!row || typeof row !== 'object') return;
    Object.keys(row).forEach((key) => keySet.add(key));
  });

  return Array.from(keySet).map((key) => ({
    header: key,
    key,
    width: Math.min(Math.max(key.length + 4, 14), 40),
  }));
}

function styleSheet(worksheet, columns) {
  worksheet.columns = columns;
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  if (columns.length > 0) {
    worksheet.autoFilter = {
      from: 'A1',
      to: `${numberToColumnName(columns.length)}1`,
    };
  }

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '5E8847' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
}

function addRows(worksheet, rows = [], columns = []) {
  rows.forEach((row) => {
    const nextRow = {};
    columns.forEach((column) => {
      nextRow[column.key] = toCellValue(row?.[column.key]);
    });
    worksheet.addRow(nextRow);
  });
}

function addRawSheet(workbook, sheetName, rows) {
  const worksheet = workbook.addWorksheet(sheetName);
  const columns = buildColumns(rows);

  styleSheet(worksheet, columns);
  addRows(worksheet, rows, columns);
}

function downloadBuffer(buffer, fileName) {
  const blob = new Blob(
    [buffer],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function createStatisticsWorkbook({
  appUsers = [],
  caseAttempts = [],
  domainAssessments = [],
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Codex';
  workbook.created = new Date();
  workbook.modified = new Date();

  addRawSheet(workbook, 'app_users', appUsers);
  addRawSheet(workbook, 'case_attempts', caseAttempts);
  addRawSheet(workbook, 'domain_assessments', domainAssessments);

  return workbook.xlsx.writeBuffer();
}

export async function downloadStatisticsWorkbook(data) {
  const buffer = await createStatisticsWorkbook(data);
  const fileName = `pbl-raw-export-${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`;
  downloadBuffer(buffer, fileName);
  return fileName;
}
