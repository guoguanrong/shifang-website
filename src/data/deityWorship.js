export const deityGodNames = Object.freeze({
  doumu: '斗姆元君',
  beidou: '北斗九皇',
  taisui: '六十甲子太岁',
  sanguan: '三官大帝',
  wenchang: '文昌帝君',
  kuixing: '魁星帝君',
  zhaogongming: '玄坛赵元帅',
  wanglingguan: '王灵官',
  guansheng: '关圣帝君',
  dongyue: '东岳大帝',
  leizun: '九天应元雷声普化天尊',
  fanli: '文财神范蠡',
  tudigong: '福德正神',
  foxian: '狐仙',
})

export function getWorshipRecords(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.list || payload?.records || payload?.data?.list || []
}
