import beidou from '@/assets/deities/beidou.png'
import dongyue from '@/assets/deities/dongyue.png'
import fanli from '@/assets/deities/fanli.png'
import foxian from '@/assets/deities/foxian.png'
// 详情页专用 500×500 正方形大图（Figma 1138_3810 导出，已转 webp）。
import detailDongyue from '@/assets/deities/detail/dongyue.webp'
import detailDoumu from '@/assets/deities/detail/doumu.webp'
import detailFanli from '@/assets/deities/detail/fanli.webp'
import detailFoxian from '@/assets/deities/detail/foxian.webp'
import detailGuansheng from '@/assets/deities/detail/guansheng.webp'
import detailTaisui from '@/assets/deities/detail/taisui.webp'
import detailTudigong from '@/assets/deities/detail/tudigong.webp'
import detailWanglingguan from '@/assets/deities/detail/wanglingguan.webp'
import detailWenchang from '@/assets/deities/detail/wenchang.webp'
import detailZhaogongming from '@/assets/deities/detail/zhaogongming.webp'
import guansheng from '@/assets/deities/guansheng.png'
import kuixing from '@/assets/deities/kuixing.png'
import leizun from '@/assets/deities/leizun.png'
import sanguan from '@/assets/deities/sanguan.png'
import taisui from '@/assets/deities/taisui.png'
import tudigong from '@/assets/deities/tudigong.png'
import wanglingguan from '@/assets/deities/wanglingguan.png'
import wenchang from '@/assets/deities/wenchang.png'
import zhaogongming from '@/assets/deities/zhaogongming.png'

// 列表与详情共用稳定 id，语言切换不影响图片和路由。
export const deityImages = { beidou, taisui, sanguan, wenchang, kuixing, zhaogongming, wanglingguan, guansheng, dongyue, leizun, fanli, tudigong, foxian }

// 详情页大图：设计稿只提供 10 位神祇的正方形版本，其余（三官、雷祖）走卡片图或专属长图兜底。
export const deityDetailImages = {
  doumu: detailDoumu,
  guansheng: detailGuansheng,
  zhaogongming: detailZhaogongming,
  taisui: detailTaisui,
  wanglingguan: detailWanglingguan,
  wenchang: detailWenchang,
  tudigong: detailTudigong,
  fanli: detailFanli,
  dongyue: detailDongyue,
  foxian: detailFoxian,
}
