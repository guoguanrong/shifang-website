// Figma 2767:1747 的汇总快照与重复示例行，不是真实流水。
// 126 条仅用于预览分页；接入接口时整体替换，不据此生成财务报告。
export const fundSummaryPreview = { donations: 8624300, expenditure: 5128600, transactions: 126, balance: 3495700 }

export const fundRecordsPreview = Array.from({ length: 126 }, (_, index) => ({
  id: `design-preview-${index + 1}`,
  date: '2026-02-14',
  time: '14:00:00',
  category: 'culture',
  titleKey: 'fundDetails.recordTitle',
  reference: 'ZC-2026-0821-02',
  amount: 24000,
}))

export const fundCategories = ['construction', 'culture', 'labor', 'ritual', 'equipment', 'administration']
export const fundMonths = Array.from({ length: 9 }, (_, index) => `2026-${String(index + 1).padStart(2, '0')}`)

export function filterFundRecords(records, { month = '', start = '', end = '', category = '' } = {}) {
  return records.filter(record => (!month || record.date.startsWith(month))
    && (!start || record.date >= start)
    && (!end || record.date <= end)
    && (!category || record.category === category))
}
