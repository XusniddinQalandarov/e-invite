export interface Strings {
  nav: {
    templates: string
    dashboard: string
    createNew: string
  }
  hero: {
    headline: string
    subheadline: string
    cta: string
  }
  howItWorks: {
    title: string
    step1: { title: string; desc: string }
    step2: { title: string; desc: string }
    step3: { title: string; desc: string }
  }
  editor: {
    brideName: string
    groomName: string
    weddingDate: string
    weddingTime: string
    venueName: string
    venueAddress: string
    mapUrl: string
    photo: string
    language: string
    saveDraft: string
    purchase: string
    photoSizeError: string
  }
  checkout: {
    title: string
    price: string
    pay: string
    summary: string
  }
  invitation: {
    download: string
    copyLink: string
    linkCopied: string
    whatsapp: string
  }
  dashboard: {
    title: string
    empty: string
    createNew: string
    status: { draft: string; paid: string }
  }
  styles: {
    floral: string
    islamic: string
    uzbek: string
  }
  common: {
    customize: string
    loading: string
  }
}

export const uz: Strings = {
  nav: {
    templates: "Shablonlar",
    dashboard: "Taklifnomalarim",
    createNew: "Yangi yaratish",
  },
  hero: {
    headline: "Nikohingizni Ulashing",
    subheadline: "Chiroyli animatsiyali elektron taklifnomalar",
    cta: "Shablonni tanlash",
  },
  howItWorks: {
    title: "Qanday ishlaydi",
    step1: { title: "Tanlang", desc: "O'zingizga yoqqan shablonni tanlang" },
    step2: { title: "Moslashtiring", desc: "Ma'lumotlaringizni kiriting" },
    step3: { title: "Ulashing", desc: "Havolani do'stlaringizga yuboring" },
  },
  editor: {
    brideName: "Kelinchak ismi",
    groomName: "Kuyov ismi",
    weddingDate: "To'y sanasi",
    weddingTime: "To'y vaqti",
    venueName: "To'y joyi",
    venueAddress: "Manzil",
    mapUrl: "Xarita havolasi (Google Maps / Yandex Maps)",
    photo: "Juft surati (ixtiyoriy)",
    language: "Taklifnoma tili",
    saveDraft: "Qoralamani saqlash",
    purchase: "Sotib olish",
    photoSizeError: "Rasm 800 KB dan oshmasligi kerak",
  },
  checkout: {
    title: "To'lov",
    price: "150 000 so'm",
    pay: "Payme orqali to'lash",
    summary: "Taklifnoma ma'lumotlari",
  },
  invitation: {
    download: "Yuklab olish",
    copyLink: "Havolani nusxalash",
    linkCopied: "Nusxalandi!",
    whatsapp: "WhatsApp orqali ulashish",
  },
  dashboard: {
    title: "Mening taklifnomalarim",
    empty: "Hali taklifnoma yo'q",
    createNew: "Yangi yaratish",
    status: { draft: "Qoralama", paid: "To'langan" },
  },
  styles: {
    floral: "Gullar",
    islamic: "Islomiy",
    uzbek: "O'zbek milliy",
  },
  common: {
    customize: "Moslashtirish",
    loading: "Yuklanmoqda...",
  },
}
