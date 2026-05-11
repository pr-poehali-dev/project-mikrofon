import { useState } from 'react'

interface Review {
  id: number; author: string; location: string; text: string; rating: number; sort_order: number
}

interface AdminReviewsTabProps {
  reviews: Review[]
  saving: boolean
  onSave: (review: Partial<Review>) => void
  onDelete: (id: number) => void
}

export default function AdminReviewsTab({ reviews, saving, onSave, onDelete }: AdminReviewsTabProps) {
  const [editReview, setEditReview] = useState<Partial<Review> | null>(null)

  const inp = "w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"

  return (
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
              <input className={inp}
                value={editReview.author || ''}
                onChange={e => setEditReview(r => r ? { ...r, author: e.target.value } : r)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">ЖК / Откуда</label>
              <input className={inp}
                value={editReview.location || ''}
                onChange={e => setEditReview(r => r ? { ...r, location: e.target.value } : r)} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Текст отзыва</label>
            <textarea rows={4} className={inp + " resize-none"}
              value={editReview.text || ''}
              onChange={e => setEditReview(r => r ? { ...r, text: e.target.value } : r)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { onSave(editReview); setEditReview(null) }} disabled={saving}
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
                <button onClick={() => onDelete(r.id)} className="border border-red-200 text-red-500 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
