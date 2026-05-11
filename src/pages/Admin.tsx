import { useState, useEffect, useRef } from 'react'
import {
  apiLogin, apiCheckToken, apiChangePassword, TOKEN_KEY,
  apiGetContent, apiSaveContent,
  apiGetProjects, apiSaveProject, apiDeleteProject,
  apiGetReviews, apiSaveReview, apiDeleteReview,
  apiUploadImage, apiGetLeads,
} from '@/lib/api'
import { invalidateContentCache } from '@/hooks/useSiteContent'

type Tab = 'content' | 'buttons' | 'blocks' | 'projects' | 'reviews' | 'leads' | 'settings'

interface Project {
  id: number; title: string; category: string; area: string
  style: string; price: string; duration: string; image: string; gallery: string[]; sort_order: number
}
interface Review {
  id: number; author: string; location: string; text: string; rating: number; sort_order: number
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '')
  const [authChecked, setAuthChecked] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' })
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('content')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  // Content
  const [content, setContent] = useState<Record<string, Record<string, string>>>({})

  // Projects
  const [projects, setProjects] = useState<Project[]>([])
  const [editProject, setEditProject] = useState<Partial<Project> | null>(null)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([])
  const [editReview, setEditReview] = useState<Partial<Review> | null>(null)

  // Leads
  const [leads, setLeads] = useState<{id: number; name: string; phone: string; contact_method: string; created_at: string}[]>([])

  // Settings
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')

  useEffect(() => {
    if (token) {
      apiCheckToken(token).then(r => {
        if (r.valid) { setAuthChecked(true); loadAll() }
        else { localStorage.removeItem(TOKEN_KEY); setToken(''); setAuthChecked(true) }
      })
    } else { setAuthChecked(true) }
  }, [])

  async function loadAll() {
    const [c, p, r, l] = await Promise.all([apiGetContent(), apiGetProjects(), apiGetReviews(), apiGetLeads()])
    setContent(c)
    setProjects(p)
    setReviews(r)
    setLeads(l.leads || [])
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    const res = await apiLogin(loginForm.username, loginForm.password)
    if (res.token) {
      localStorage.setItem(TOKEN_KEY, res.token)
      setToken(res.token)
      await loadAll()
    } else {
      setLoginError(res.error || 'Ошибка входа')
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
  }

  function showSaved() {
    setSavedMsg('Сохранено!')
    setTimeout(() => setSavedMsg(''), 2500)
  }

  async function saveContent() {
    setSaving(true)
    try {
      const res = await apiSaveContent(content)
      if (res?.ok) {
        invalidateContentCache()
        await loadAll()
        showSaved()
      } else {
        setSavedMsg('Ошибка: ' + (res?.error || 'не удалось сохранить'))
        setTimeout(() => setSavedMsg(''), 3000)
      }
    } catch {
      setSavedMsg('Ошибка сети')
      setTimeout(() => setSavedMsg(''), 3000)
    }
    setSaving(false)
  }

  function setContentField(section: string, key: string, value: string) {
    setContent(prev => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: value } }))
  }

  async function handleSaveProject() {
    if (!editProject) return
    setSaving(true)
    await apiSaveProject(editProject.id || null, editProject)
    const updated = await apiGetProjects()
    setProjects(updated)
    setEditProject(null)
    setSaving(false)
    showSaved()
  }

  async function handleDeleteProject(id: number) {
    if (!confirm('Удалить проект?')) return
    await apiDeleteProject(id)
    setProjects(p => p.filter(x => x.id !== id))
  }

  async function handleSaveReview() {
    if (!editReview) return
    setSaving(true)
    await apiSaveReview(editReview.id || null, editReview)
    const updated = await apiGetReviews()
    setReviews(updated)
    setEditReview(null)
    setSaving(false)
    showSaved()
  }

  async function handleDeleteReview(id: number) {
    if (!confirm('Удалить отзыв?')) return
    await apiDeleteReview(id)
    setReviews(r => r.filter(x => x.id !== id))
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== newPassword2) { alert('Пароли не совпадают'); return }
    if (newPassword.length < 6) { alert('Минимум 6 символов'); return }
    await apiChangePassword(newPassword)
    setNewPassword(''); setNewPassword2('')
    showSaved()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState<'project_main' | 'project_gallery' | null>(null)

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

  if (!authChecked) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Загрузка...</div>

  if (!token) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-medium mb-8 text-center">Вход в админку</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Логин</label>
            <input className="w-full border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
              value={loginForm.username} onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Пароль</label>
            <input type="password" className="w-full border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
              value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button type="submit" className="w-full bg-foreground text-background py-2.5 text-sm hover:opacity-90 transition-opacity">Войти</button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-6">Стандартный пароль: <span className="font-mono">admin</span></p>
      </div>
    </div>
  )

  const tabs: { id: Tab; label: string }[] = [
    { id: 'content', label: 'Основное' },
    { id: 'buttons', label: 'Кнопки' },
    { id: 'blocks', label: 'Блоки' },
    { id: 'projects', label: 'Проекты' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'leads', label: `Заявки${leads.length ? ` (${leads.length})` : ''}` },
    { id: 'settings', label: 'Настройки' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Сайт</a>
          <span className="text-lg font-medium">Админ-панель</span>
        </div>
        <div className="flex items-center gap-4">
          {savedMsg && <span className="text-sm text-green-600">{savedMsg}</span>}
          <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Выйти</button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 border-r border-border min-h-[calc(100vh-57px)] py-6 px-4 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${tab === t.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 max-w-4xl">

          {/* ТЕКСТЫ */}
          {tab === 'content' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Тексты сайта</h2>
                <button onClick={saveContent} disabled={saving}
                  className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>

              {[
                { section: 'hero', label: 'Главный экран', fields: [
                  { key: 'title', label: 'Заголовок', multiline: false },
                  { key: 'subtitle', label: 'Подзаголовок', multiline: true },
                  { key: 'cta_primary', label: 'Кнопка 1', multiline: false },
                  { key: 'cta_secondary', label: 'Кнопка 2', multiline: false },
                ]},
                { section: 'contacts', label: 'Контакты', fields: [
                  { key: 'phone', label: 'Телефон (отображение)', multiline: false },
                  { key: 'phone_href', label: 'Телефон (ссылка tel:)', multiline: false },
                  { key: 'whatsapp_href', label: 'Ссылка WhatsApp/MAX', multiline: false },
                  { key: 'telegram', label: 'Telegram', multiline: false },
                  { key: 'vk_href', label: 'Ссылка ВКонтакте', multiline: false },
                ]},
                { section: 'footer', label: 'Футер', fields: [
                  { key: 'company_name', label: 'Название компании', multiline: false },
                  { key: 'description', label: 'Описание', multiline: true },
                  { key: 'copyright', label: 'Копирайт', multiline: false },
                ]},
              ].map(({ section, label, fields }) => (
                <div key={section} className="border border-border p-6">
                  <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">{label}</h3>
                  <div className="space-y-4">
                    {fields.map(({ key, label: fl, multiline }) => (
                      <div key={key}>
                        <label className="block text-sm text-muted-foreground mb-1">{fl}</label>
                        {multiline ? (
                          <textarea rows={3} className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background resize-none"
                            value={content[section]?.[key] || ''}
                            onChange={e => setContentField(section, key, e.target.value)} />
                        ) : (
                          <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                            value={content[section]?.[key] || ''}
                            onChange={e => setContentField(section, key, e.target.value)} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* КНОПКИ */}
          {tab === 'buttons' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Кнопки сайта</h2>
                <button onClick={saveContent} disabled={saving}
                  className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
              {[
                { label: 'Шапка сайта', fields: [
                  { key: 'header_cta_text', label: 'Текст кнопки' },
                  { key: 'header_cta_href', label: 'Ссылка (tel:, https://, #якорь)' },
                ]},
                { label: 'Главный экран (Hero)', fields: [
                  { key: 'hero_primary_text', label: 'Кнопка 1 — текст' },
                  { key: 'hero_primary_href', label: 'Кнопка 1 — ссылка' },
                  { key: 'hero_secondary_text', label: 'Кнопка 2 — текст' },
                  { key: 'hero_secondary_href', label: 'Кнопка 2 — ссылка' },
                ]},
                { label: 'Блок призыва (внизу страницы)', fields: [
                  { key: 'cta_primary_text', label: 'Кнопка 1 — текст' },
                  { key: 'cta_primary_href', label: 'Кнопка 1 — ссылка' },
                  { key: 'cta_secondary_text', label: 'Кнопка 2 — текст' },
                  { key: 'cta_secondary_href', label: 'Кнопка 2 — ссылка' },
                ]},
              ].map(({ label, fields }) => (
                <div key={label} className="border border-border p-6">
                  <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">{label}</h3>
                  <div className="space-y-4">
                    {fields.map(({ key, label: fl }) => (
                      <div key={key}>
                        <label className="block text-sm text-muted-foreground mb-1">{fl}</label>
                        <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                          value={content['buttons']?.[key] || ''}
                          onChange={e => setContentField('buttons', key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* БЛОКИ */}
          {tab === 'blocks' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Блоки сайта</h2>
                <button onClick={saveContent} disabled={saving}
                  className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>

              {[
                { section: 'philosophy', label: 'Блок "Для кого мы работаем"', fields: [
                  { key: 'badge', label: 'Метка (маленький текст)' },
                  { key: 'title', label: 'Заголовок' },
                  { key: 'title_highlight', label: 'Выделенное слово' },
                  { key: 'subtitle', label: 'Подзаголовок', multiline: true },
                  { key: 'item_1_title', label: 'Пункт 1 — название' },
                  { key: 'item_1_desc', label: 'Пункт 1 — описание', multiline: true },
                  { key: 'item_2_title', label: 'Пункт 2 — название' },
                  { key: 'item_2_desc', label: 'Пункт 2 — описание', multiline: true },
                  { key: 'item_3_title', label: 'Пункт 3 — название' },
                  { key: 'item_3_desc', label: 'Пункт 3 — описание', multiline: true },
                  { key: 'item_4_title', label: 'Пункт 4 — название' },
                  { key: 'item_4_desc', label: 'Пункт 4 — описание', multiline: true },
                ]},
                { section: 'expertise', label: 'Блок "Услуги"', fields: [
                  { key: 'badge', label: 'Метка' },
                  { key: 'title_highlight', label: 'Выделенное слово' },
                  { key: 'title', label: 'Заголовок (продолжение)' },
                  { key: 'subtitle', label: 'Подзаголовок', multiline: true },
                  { key: 'item_1_title', label: 'Услуга 1 — название' },
                  { key: 'item_1_desc', label: 'Услуга 1 — описание', multiline: true },
                  { key: 'item_2_title', label: 'Услуга 2 — название' },
                  { key: 'item_2_desc', label: 'Услуга 2 — описание', multiline: true },
                  { key: 'item_3_title', label: 'Услуга 3 — название' },
                  { key: 'item_3_desc', label: 'Услуга 3 — описание', multiline: true },
                  { key: 'item_4_title', label: 'Услуга 4 — название' },
                  { key: 'item_4_desc', label: 'Услуга 4 — описание', multiline: true },
                  { key: 'item_5_title', label: 'Услуга 5 — название' },
                  { key: 'item_5_desc', label: 'Услуга 5 — описание', multiline: true },
                  { key: 'item_6_title', label: 'Услуга 6 — название' },
                  { key: 'item_6_desc', label: 'Услуга 6 — описание', multiline: true },
                ]},
                { section: 'packages', label: 'Блок "Пакеты"', fields: [
                  { key: 'title', label: 'Заголовок' },
                  { key: 'pkg1_name', label: 'Пакет 1 — название' },
                  { key: 'pkg1_tagline', label: 'Пакет 1 — подпись' },
                  { key: 'pkg1_desc', label: 'Пакет 1 — описание', multiline: true },
                  { key: 'pkg1_price', label: 'Пакет 1 — цена' },
                  { key: 'pkg2_name', label: 'Пакет 2 — название' },
                  { key: 'pkg2_tagline', label: 'Пакет 2 — подпись' },
                  { key: 'pkg2_desc', label: 'Пакет 2 — описание', multiline: true },
                  { key: 'pkg2_price', label: 'Пакет 2 — цена' },
                  { key: 'pkg3_name', label: 'Пакет 3 — название' },
                  { key: 'pkg3_tagline', label: 'Пакет 3 — подпись' },
                  { key: 'pkg3_desc', label: 'Пакет 3 — описание', multiline: true },
                  { key: 'pkg3_price', label: 'Пакет 3 — цена' },
                ]},
                { section: 'whyus', label: 'Блок "Почему выбирают нас"', fields: [
                  { key: 'title', label: 'Заголовок' },
                  { key: 'item_1_title', label: 'Пункт 1 — название' }, { key: 'item_1_desc', label: 'Пункт 1 — описание', multiline: true },
                  { key: 'item_2_title', label: 'Пункт 2 — название' }, { key: 'item_2_desc', label: 'Пункт 2 — описание', multiline: true },
                  { key: 'item_3_title', label: 'Пункт 3 — название' }, { key: 'item_3_desc', label: 'Пункт 3 — описание', multiline: true },
                  { key: 'item_4_title', label: 'Пункт 4 — название' }, { key: 'item_4_desc', label: 'Пункт 4 — описание', multiline: true },
                  { key: 'item_5_title', label: 'Пункт 5 — название' }, { key: 'item_5_desc', label: 'Пункт 5 — описание', multiline: true },
                  { key: 'item_6_title', label: 'Пункт 6 — название' }, { key: 'item_6_desc', label: 'Пункт 6 — описание', multiline: true },
                ]},
                { section: 'process', label: 'Блок "Процесс работы"', fields: [
                  { key: 'title', label: 'Заголовок' },
                  { key: 'step_1_title', label: 'Шаг 1 — название' }, { key: 'step_1_desc', label: 'Шаг 1 — описание', multiline: true },
                  { key: 'step_2_title', label: 'Шаг 2 — название' }, { key: 'step_2_desc', label: 'Шаг 2 — описание', multiline: true },
                  { key: 'step_3_title', label: 'Шаг 3 — название' }, { key: 'step_3_desc', label: 'Шаг 3 — описание', multiline: true },
                  { key: 'step_4_title', label: 'Шаг 4 — название' }, { key: 'step_4_desc', label: 'Шаг 4 — описание', multiline: true },
                  { key: 'step_5_title', label: 'Шаг 5 — название' }, { key: 'step_5_desc', label: 'Шаг 5 — описание', multiline: true },
                  { key: 'step_6_title', label: 'Шаг 6 — название' }, { key: 'step_6_desc', label: 'Шаг 6 — описание', multiline: true },
                  { key: 'step_7_title', label: 'Шаг 7 — название' }, { key: 'step_7_desc', label: 'Шаг 7 — описание', multiline: true },
                ]},
                { section: 'cta', label: 'Блок призыва к действию (внизу)', fields: [
                  { key: 'title', label: 'Заголовок', multiline: false },
                  { key: 'subtitle', label: 'Подзаголовок', multiline: true },
                ]},
              ].map(({ section, label, fields }) => (
                <div key={section} className="border border-border p-6">
                  <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">{label}</h3>
                  <div className="space-y-3">
                    {fields.map(({ key, label: fl, multiline }) => (
                      <div key={key}>
                        <label className="block text-sm text-muted-foreground mb-1">{fl}</label>
                        {multiline ? (
                          <textarea rows={2} className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background resize-none"
                            value={content[section]?.[key] || ''}
                            onChange={e => setContentField(section, key, e.target.value)} />
                        ) : (
                          <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                            value={content[section]?.[key] || ''}
                            onChange={e => setContentField(section, key, e.target.value)} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ПРОЕКТЫ */}
          {tab === 'projects' && (
            <div className="space-y-6">
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
                    <button onClick={handleSaveProject} disabled={saving}
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
                      <button onClick={() => handleDeleteProject(p.id)} className="border border-red-200 text-red-500 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors">Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ОТЗЫВЫ */}
          {tab === 'reviews' && (
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
                    <button onClick={handleSaveReview} disabled={saving}
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
                        <button onClick={() => handleDeleteReview(r.id)} className="border border-red-200 text-red-500 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors">Удалить</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ЗАЯВКИ */}
          {tab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Заявки с сайта</h2>
                <button onClick={loadAll} className="border border-border px-4 py-2 text-sm hover:bg-secondary transition-colors">Обновить</button>
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
          )}

          {/* НАСТРОЙКИ */}
          {tab === 'settings' && (
            <div className="space-y-8 max-w-md">
              <h2 className="text-xl font-medium">Настройки</h2>
              <div className="border border-border p-6">
                <h3 className="font-medium mb-4">Изменить пароль</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
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
          )}

        </main>
      </div>
    </div>
  )
}