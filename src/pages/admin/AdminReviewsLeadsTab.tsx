import { useState } from 'react'

interface Review {
  id: number; author: string; location: string; text: string; rating: number; sort_order: number
}

interface Lead {
  id: number; name: string; phone: string; contact_method: string; created_at: string
}

interface AdminReviewsTabProps {
  tab: 'reviews' | 'leads' | 'settings'
  reviews: Review[]
  leads: Lead[]
  saving: boolean
  savedMsg: string
  onSaveReview: (review: Partial<Review>) => void
  onDeleteReview: (id: number) => void
  onRefreshLeads: () => void
  onChangePassword: (e: React.FormEvent, pw: string, pw2: string) => void
}

export default function AdminReviewsLeadsTab({
  tab, reviews, leads, saving, savedMsg,
  onSaveReview, onDeleteReview, onRefreshLeads, onChangePassword,
}: AdminReviewsTabProps) {
  const [editReview, setEditReview] = useState<Partial<Review> | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')

  if (tab === 'reviews') return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Отзывы</h2>
        <button onClick={() => setEditReview({ author: '', location: '', text: '', rating: 5, sort_order: reviews.length + 1 })}
          className="bg-foreground text-background px-5 py-2 text-sm hover:opacity-90 transition-opacity">+ Добавить</button>
      </div>

      {editReview && (
        <div className="border border-border p-6 space-y-4 bg-secondary/30">
          <h3 className="font-medium">{editReview.id ? 'Редактировать отзыв' : 'Новый отзыв'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Имя</label>
              <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                value={editReview.author || ''}
                onChange={e => setEditReview(r => r ? { ...r, author: e.target.value } : r)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">ЖК / Откуда</label>
              <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                value={editReview.location || ''}
                onChange={e => setEditReview(r => r ? { ...r, location: e.target.value } : r)} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Текст отзыва</label>
            <textarea rows={4} className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background resize-none"
              value={editReview.text || ''}
              onChange={e => setEditReview(r => r ? { ...r, text: e.target.value } : r)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { onSaveReview(editReview); setEditReview(null) }} disabled={saving}
              className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={() => setEditReview(null)} className="border border-border px-6 py-2 text-sm hover:bg-secondary transition-colors">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-sm">{r.author} <span className="text-muted-foreground font-normal">— {r.location}</span></p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.text}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditReview({ ...r })} className="border border-border px-4 py-1.5 text-sm hover:bg-secondary transition-colors">Изменить</button>
                <button onClick={() => onDeleteReview(r.id)} className="border border-red-200 text-red-500 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (tab === 'leads') return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Заявки с сайта</h2>
        <button onClick={onRefreshLeads} className="border border-border px-4 py-2 text-sm hover:bg-secondary transition-colors">Обновить</button>
      </div>
      {leads.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Заявок пока нет</p>
      ) : (
        <div className="space-y-3">
          {leads.map(lead => (
            <div key={lead.id} className="border border-border p-4 flex items-center gap-6">
              <div className="flex-1">
                <p className="font-medium text-sm">{lead.name}</p>
                <p className="text-sm text-muted-foreground">{lead.phone}{lead.contact_method ? ` · ${lead.contact_method}` : ''}</p>
              </div>
              <p className="text-xs text-muted-foreground flex-shrink-0">
                {new Date(lead.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8 max-w-md">
      <h2 className="text-xl font-medium">Настройки</h2>
      <div className="border border-border p-6">
        <h3 className="font-medium mb-4">Изменить пароль</h3>
        <form onSubmit={e => { onChangePassword(e, newPassword, newPassword2); setNewPassword(''); setNewPassword2('') }} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Новый пароль</label>
            <input type="password" className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
              value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Повторите пароль</label>
            <input type="password" className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
              value={newPassword2} onChange={e => setNewPassword2(e.target.value)} />
          </div>
          <button type="submit" className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 transition-opacity">Сохранить пароль</button>
          {savedMsg && <p className="text-green-600 text-sm">{savedMsg}</p>}
        </form>
      </div>
    </div>
  )
}
