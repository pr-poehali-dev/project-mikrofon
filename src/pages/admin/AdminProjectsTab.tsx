import { useRef, useState } from 'react'
import { apiUploadImage } from '@/lib/api'

interface Project {
  id: number; title: string; category: string; area: string
  style: string; price: string; duration: string; image: string; gallery: string[]; sort_order: number
}

interface AdminProjectsTabProps {
  projects: Project[]
  saving: boolean
  setSaving: (v: boolean) => void
  onSave: (project: Partial<Project>) => void
  onDelete: (id: number) => void
}

export default function AdminProjectsTab({ projects, saving, setSaving, onSave, onDelete }: AdminProjectsTabProps) {
  const [editProject, setEditProject] = useState<Partial<Project> | null>(null)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [uploadTarget, setUploadTarget] = useState<'project_main' | 'project_gallery' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !uploadTarget) return
    setSaving(true)
    try {
      const url = await apiUploadImage(file)
      if (uploadTarget === 'project_main') {
        setEditProject(prev => prev ? { ...prev, image: url } : prev)
      } else if (uploadTarget === 'project_gallery') {
        setEditProject(prev => prev ? { ...prev, gallery: [...(prev.gallery || []), url] } : prev)
      }
    } catch { alert('Ошибка загрузки фото') }
    setSaving(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Проекты</h2>
        <button onClick={() => setEditProject({ title: '', category: '', area: '', style: '', price: '', duration: '', image: '', gallery: [], sort_order: projects.length + 1 })}
          className="bg-foreground text-background px-5 py-2 text-sm hover:opacity-90 transition-opacity">+ Добавить</button>
      </div>

      {editProject && (
        <div className="border border-border p-6 space-y-4 bg-secondary/30">
          <h3 className="font-medium">{editProject.id ? 'Редактировать проект' : 'Новый проект'}</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'title', label: 'Название' }, { key: 'category', label: 'Категория' },
              { key: 'area', label: 'Площадь' }, { key: 'style', label: 'Стиль' },
              { key: 'price', label: 'Цена' }, { key: 'duration', label: 'Срок' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm text-muted-foreground mb-1">{label}</label>
                <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                  value={(editProject as Record<string, unknown>)[key] as string || ''}
                  onChange={e => setEditProject(p => p ? { ...p, [key]: e.target.value } : p)} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Главное фото</label>
            <div className="flex gap-3 items-start">
              {editProject.image && <img src={editProject.image} className="w-24 h-16 object-cover border border-border" />}
              <div className="flex flex-col gap-2">
                <button onClick={() => { setUploadTarget('project_main'); fileInputRef.current?.click() }}
                  className="border border-border px-4 py-1.5 text-sm hover:bg-secondary transition-colors">Загрузить фото</button>
                <input placeholder="или вставить URL" className="border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background w-80"
                  value={editProject.image || ''}
                  onChange={e => setEditProject(p => p ? { ...p, image: e.target.value } : p)} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Галерея (дополнительные фото)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(editProject.gallery || []).map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} className="w-20 h-14 object-cover border border-border" />
                  <button onClick={() => setEditProject(p => p ? { ...p, gallery: (p.gallery || []).filter((_, j) => j !== i) } : p)}
                    className="absolute -top-1 -right-1 bg-foreground text-background w-5 h-5 text-xs flex items-center justify-center hover:opacity-80">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setUploadTarget('project_gallery'); fileInputRef.current?.click() }}
                className="border border-border px-4 py-1.5 text-sm hover:bg-secondary transition-colors">+ Загрузить</button>
              <input placeholder="или вставить URL" className="border border-border px-3 py-1.5 text-sm focus:outline-none bg-background w-80"
                value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} />
              <button onClick={() => { if (newGalleryUrl) { setEditProject(p => p ? { ...p, gallery: [...(p.gallery || []), newGalleryUrl] } : p); setNewGalleryUrl('') } }}
                className="border border-border px-3 py-1.5 text-sm hover:bg-secondary">+</button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => { onSave(editProject); setEditProject(null) }} disabled={saving}
              className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={() => setEditProject(null)} className="border border-border px-6 py-2 text-sm hover:bg-secondary transition-colors">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="border border-border p-4 flex items-center gap-4">
            {p.image && <img src={p.image} className="w-20 h-14 object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.category} · {p.area} · {p.price}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditProject({ ...p })} className="border border-border px-4 py-1.5 text-sm hover:bg-secondary transition-colors">Изменить</button>
              <button onClick={() => onDelete(p.id)} className="border border-red-200 text-red-500 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
