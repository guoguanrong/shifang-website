import lampPhoto from '@/assets/account-pages/lamp-photo.webp'
import deityPhoto from '@/assets/account-pages/deity-photo.webp'
import lampAvatar from '@/assets/account-pages/lamp-avatar.webp'
import medicineAvatar from '@/assets/account-pages/medicine-avatar.webp'
import donationAvatar from '@/assets/account-pages/donation-avatar.webp'
import tileAvatar from '@/assets/account-pages/tile-avatar.webp'
import doumuAvatar from '@/assets/account-pages/doumu-avatar.webp'
import wenchangAvatar from '@/assets/account-pages/wenchang-avatar.webp'
import guanshengAvatar from '@/assets/account-pages/guansheng-avatar.webp'

// Figma 页面示例，独立于用户会话，不作为真实订单、统计或支付结果。
export const accountRecordExamples = {
  lamps: [0, 1, 2, 3].map(index => ({
    id: `L-EXAMPLE-${String(index + 1).padStart(5, '0')}`,
    title: index === 2 ? 'medicineLamp' : 'brightLamp',
    avatar: index === 2 ? medicineAvatar : lampAvatar,
    photo: index === 2 ? null : lampPhoto,
    status: index === 2 ? 'pending' : 'active',
    wish: index === 2 ? 'healthWish' : 'brightWish',
    date: '2026-08-01T10:30:00', birth: '1995-11-08', devotee: 'sampleDevotee',
  })),
  donations: Array.from({ length: 9 }, (_, index) => ({
    id: `D-EXAMPLE-${String(index + 1).padStart(5, '0')}`,
    title: index === 1 ? 'tiles' : 'doumuHall',
    avatar: index === 1 ? tileAvatar : donationAvatar,
    type: index === 1 ? 'goods' : 'money', status: 'completed', amount: 1000,
    wish: 'brightWish', date: '2026-08-01T10:30:00', birth: '1995-11-08', devotee: 'sampleDevotee',
    email: index % 3 === 0 ? 'example@example.invalid' : null,
  })),
  deities: [0, 1, 2, 3].map(index => ({
    id: `S-EXAMPLE-${String(index + 1).padStart(5, '0')}`,
    title: index === 0 ? 'doumu' : index === 2 ? 'guansheng' : 'wenchang',
    avatar: index === 0 ? doumuAvatar : index === 2 ? guanshengAvatar : wenchangAvatar,
    photo: index === 2 ? null : deityPhoto,
    status: index === 2 ? 'pending' : 'active', amount: index === 2 ? 18 : 180,
    plan: index === 2 ? 'monthly' : 'yearly', wish: index === 0 ? 'familyWish' : index === 2 ? 'careerWish' : 'studyWish',
    date: '2026-08-01T10:30:00', devotee: 'sampleDevotee',
  })),
}
