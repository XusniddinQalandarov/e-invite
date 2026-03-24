export interface Invitation {
  id: string
  templateId: string
  brideName: string
  groomName: string
  weddingDate: string
  weddingTime: string
  venueName: string
  venueAddress?: string
  photoUrl?: string
  language: 'uz' | 'ru' | 'en'
  status: 'draft' | 'paid'
  paymentId?: string
  canvasJson?: string
  createdAt: string
  updatedAt: string
}

export interface InvitationCanvasHandle {
  exportPNG: () => string
}
