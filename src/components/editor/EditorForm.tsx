'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'
import type { Invitation } from '@/types/invitation'

export type InvitationFormData = Pick<
  Invitation,
  'brideName' | 'groomName' | 'weddingDate' | 'weddingTime' | 'venueName' | 'venueAddress' | 'mapUrl' | 'language'
> & { photoUrl?: string }

interface Props {
  initialData?: Partial<InvitationFormData>
  onDataChange: (data: InvitationFormData) => void
  onSave: (data: InvitationFormData) => Promise<void>
  onPurchase: () => void
  isSaving?: boolean
}

const DEFAULT_DATA: InvitationFormData = {
  brideName: '',
  groomName: '',
  weddingDate: '',
  weddingTime: '',
  venueName: '',
  venueAddress: '',
  mapUrl: '',
  language: 'uz',
  photoUrl: undefined,
}

export function EditorForm({ initialData, onDataChange, onSave, onPurchase, isSaving }: Props) {
  const { t } = useLanguage()
  const [data, setData] = useState<InvitationFormData>({ ...DEFAULT_DATA, ...initialData })
  const [photoError, setPhotoError] = useState<string>('')

  function update<K extends keyof InvitationFormData>(key: K, value: InvitationFormData[K]) {
    const next = { ...data, [key]: value }
    setData(next)
    onDataChange(next)
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 800 * 1024) {
      setPhotoError(t.editor.photoSizeError)
      return
    }
    setPhotoError('')
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      update('photoUrl', url)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await onSave(data)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        label={t.editor.groomName}
        value={data.groomName}
        onChange={e => update('groomName', e.target.value)}
        maxLength={80}
        placeholder="Jahongir"
        required
      />
      <Input
        label={t.editor.brideName}
        value={data.brideName}
        onChange={e => update('brideName', e.target.value)}
        maxLength={80}
        placeholder="Zulfiya"
        required
      />
      <Input
        label={t.editor.weddingDate}
        type="date"
        value={data.weddingDate}
        onChange={e => update('weddingDate', e.target.value)}
        required
      />
      <Input
        label={t.editor.weddingTime}
        type="time"
        value={data.weddingTime}
        onChange={e => update('weddingTime', e.target.value)}
        required
      />
      <Input
        label={t.editor.venueName}
        value={data.venueName}
        onChange={e => update('venueName', e.target.value)}
        maxLength={120}
        placeholder="Mirzo Banquet Hall"
        required
      />
      <Input
        label={t.editor.venueAddress}
        value={data.venueAddress ?? ''}
        onChange={e => update('venueAddress', e.target.value)}
        maxLength={200}
        placeholder="Toshkent sh., Mirzo Ulug'bek ko'chasi"
      />
      <Input
        label={t.editor.mapUrl}
        type="url"
        value={data.mapUrl ?? ''}
        onChange={e => update('mapUrl', e.target.value)}
        placeholder="https://maps.google.com/..."
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-body text-brand-text/60 tracking-wide">
          {t.editor.photo}
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="text-sm font-body text-brand-text/60 file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-gold/30 file:text-xs file:font-body file:bg-white/60 file:text-brand-text hover:file:bg-white/80 file:cursor-pointer"
        />
        {photoError && <p className="text-xs text-red-500 font-body">{photoError}</p>}
        {data.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt="Photo preview"
            className="mt-1 w-16 h-16 object-cover rounded border border-gold/20"
          />
        )}
      </div>

      <Select
        label={t.editor.language}
        value={data.language}
        onChange={e => update('language', e.target.value as Invitation['language'])}
        options={[
          { value: 'uz', label: "O'zbek" },
          { value: 'ru', label: 'Русский' },
          { value: 'en', label: 'English' },
        ]}
      />

      <div className="flex flex-col gap-2.5 pt-4 border-t border-gold/15 mt-2">
        <Button type="submit" variant="secondary" disabled={isSaving} className="w-full">
          {isSaving ? t.common.loading : t.editor.saveDraft}
        </Button>
        <Button type="button" variant="primary" onClick={onPurchase} className="w-full">
          {t.editor.purchase}
        </Button>
      </div>
    </form>
  )
}
