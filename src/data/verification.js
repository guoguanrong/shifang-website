import idIcon from '@/assets/verification/id-card.svg'
import passportIcon from '@/assets/verification/passport.svg'
import licenseIcon from '@/assets/verification/license.svg'
import idFront from '@/assets/verification/id-front.svg'
import idBack from '@/assets/verification/id-back.svg'
import passportFront from '@/assets/verification/passport-front.png'
import passportBack from '@/assets/verification/passport-back.png'
import licenseFront from '@/assets/verification/license-front.png'
import licenseBack from '@/assets/verification/license-back.png'
import eventsBenefit from '@/assets/verification/benefit-events.png'
import certificateBenefit from '@/assets/verification/benefit-certificate.png'
import serviceBenefit from '@/assets/verification/benefit-service.png'
import seatsBenefit from '@/assets/verification/benefit-seats.png'

// 仅维护证件类型和设计素材，界面文案统一从语言包读取。
export const verificationMethods = [
  { id: 'id', icon: idIcon, photos: [idFront, idBack] },
  { id: 'passport', icon: passportIcon, photos: [passportFront, passportBack] },
  { id: 'license', icon: licenseIcon, photos: [licenseFront, licenseBack] },
]

export const verificationBenefits = [
  { id: 'events', icon: eventsBenefit },
  { id: 'certificate', icon: certificateBenefit },
  { id: 'service', icon: serviceBenefit },
  { id: 'seats', icon: seatsBenefit },
]
