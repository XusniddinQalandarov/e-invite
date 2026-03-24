export interface TextFieldConfig {
  left: number
  top: number
  width: number
  fontSize: number
  fontFamily: string
  fontWeight?: string
  fill: string
  textAlign?: 'left' | 'center' | 'right'
  originX?: 'left' | 'center' | 'right'
  originY?: 'top' | 'center' | 'bottom'
}

export type DecorativeElement =
  | {
      type: 'text'
      content: string
      left: number
      top: number
      fontSize: number
      fontFamily: string
      fill: string
      fontWeight?: string
    }
  | {
      type: 'line'
      left: number
      top: number
      width: number
      stroke: string
      strokeWidth?: number
    }

export interface TemplateConfig {
  id: string
  name: string
  label?: string          // badge shown on template card, e.g. "Mashhur", "Premium"
  price: number           // price in so'm
  priceLabel: string      // formatted display string
  style: 'floral' | 'islamic' | 'uzbek'
  backgroundUrl: string
  previewUrl: string
  textFields: {
    brideName: TextFieldConfig
    groomName: TextFieldConfig
    date: TextFieldConfig
    time: TextFieldConfig
    venue: TextFieldConfig
    address?: TextFieldConfig
  }
  photoArea?: {
    left: number
    top: number
    width: number
    height: number
    clipShape: 'circle' | 'rect'
  }
  decorativeElements?: DecorativeElement[]
}
