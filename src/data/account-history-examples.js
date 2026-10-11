import orderAvatar from '@/assets/account-pages/order-avatar.webp'
import eventAvatar from '@/assets/account-pages/event-avatar.webp'

// 设计稿中的展示记录，不与用户会话、支付结果或真实活动登记关联。
export const accountHistoryExamples = {
  orders: Array.from({ length: 11 }, (_, index) => ({
    id: `L-EXAMPLE-${String(index + 1).padStart(5, '0')}`,
    avatar: orderAvatar, title: 'accountPages.examples.brightLamp',
    status: 'paid', date: '2026-08-01T10:30:00', amount: 88,
  })),
  events: ['zhongyuan', 'beidou', 'xiayuan', 'solstice', 'private', 'zhongyuan', 'beidou', 'xiayuan', 'private'].map((type, index) => ({
    id: `SHF-EXAMPLE-${String(index + 1).padStart(4, '0')}`,
    avatar: eventAvatar, title: `accountPages.history.events.${type}.title`, type,
    status: type === 'private' ? 'reserved' : 'registered', date: '2026-08-27T09:00:00',
    location: type === 'private' ? 'altar' : 'hall', phone: '138****5521',
  })),
}
