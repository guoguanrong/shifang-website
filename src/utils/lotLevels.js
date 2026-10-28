// 求签等级的统一映射：后端 level 1-6 ↔ 签枝图 ↔ 语言包 grades 键。
// 签面文字需与 bless-tests/stick-*.png 一致：b 上上、a 上吉、e 中吉、f 中平、c 下平、d 下下。
export const LOT_STICK_BY_LEVEL = { 1: 'b', 2: 'a', 3: 'e', 4: 'f', 5: 'c', 6: 'd' }

export const LOT_GRADE_BY_LEVEL = { 1: 'highest', 2: 'great', 3: 'good', 4: 'balanced', 5: 'lower', 6: 'lowest' }

// 反向映射供无接口数据时的静态签文回退使用（签图 → grades/readings 键）。
export const LOT_GRADE_BY_STICK = { a: 'great', b: 'highest', c: 'lower', d: 'lowest', e: 'good', f: 'balanced' }

export function lotStickForLevel(level) {
  return LOT_STICK_BY_LEVEL[Number(level)] || null
}

export function lotGradeKeyForLevel(level) {
  return LOT_GRADE_BY_LEVEL[Number(level)] || null
}
