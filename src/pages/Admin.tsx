import { useState, useEffect } from 'react'
import {
  apiLogin, apiCheckToken, apiChangePassword, TOKEN_KEY,
  apiGetContent, apiSaveContent,
  apiGetProjects, apiSaveProject, apiDeleteProject,
  apiGetReviews, apiSaveReview, apiDeleteReview,
  apiGetLeads,
} from '@/lib/api'
import { invalidateContentCache } from '@/hooks/useSiteContent'
import AdminContentTab from './admin/AdminContentTab'
import AdminProjectsTab from './admin/AdminProjectsTab'
import AdminReviewsLeadsTab from './admin/AdminReviewsLeadsTab'

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

  const [content, setContent] = useState<Record<string, Record<string, string>>>({})
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [leads, setLeads] = useState<{id: number; name: string; phone: string; contact_method: string; created_at: string}[]>([])

  useEffect(() => {
    if (token) {
      apiCheckToken(token).then(r => {
        if (r.valid) { setAuthChecked(true); loadAll() }
        else { localStorage.removeItem(TOKEN_KEY); setToken(''); setAuthChecked(true) }
      }).catch(() => { setAuthChecked(true) })
    } else { setAuthChecked(true) }
  }, [])

  async function loadAll() {
    try {
      const [c, p, r, l] = await Promise.all([apiGetContent(), apiGetProjects(), apiGetReviews(), apiGetLeads()])
      setContent(c || {})
      setProjects(Array.isArray(p) ? p : [])
      setReviews(Array.isArray(r) ? r : [])
      setLeads(l?.leads || [])
    } catch { /* данные недоступны, но в админку всё равно пускаем */ }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    const res = await apiLogin(loginForm.username, loginForm.password)
    if (res.token) {
      localStorage.setItem(TOKEN_KEY, res.token)
      setToken(res.token)
      loadAll() // не await — не блокируем вход
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

  async function handleSaveProject(editProject: Partial<Project>) {
    setSaving(true)
    await apiSaveProject(editProject.id || null, editProject)
    const updated = await apiGetProjects()
    setProjects(updated)
    setSaving(false)
    showSaved()
  }

  async function handleDeleteProject(id: number) {
    if (!confirm('Удалить проект?')) return
    await apiDeleteProject(id)
    setProjects(p => p.filter(x => x.id !== id))
  }

  async function handleSaveReview(editReview: Partial<Review>) {
    setSaving(true)
    await apiSaveReview(editReview.id || null, editReview)
    const updated = await apiGetReviews()
    setReviews(updated)
    setSaving(false)
    showSaved()
  }

  async function handleDeleteReview(id: number) {
    if (!confirm('Удалить отзыв?')) return
    await apiDeleteReview(id)
    setReviews(r => r.filter(x => x.id !== id))
  }

  async function handleChangePassword(e: React.FormEvent, newPassword: string, newPassword2: string) {
    e.preventDefault()
    if (newPassword !== newPassword2) { alert('Пароли не совпадают'); return }
    if (newPassword.length < 6) { alert('Минимум 6 символов'); return }
    await apiChangePassword(newPassword)
    showSaved()
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
          {(tab === 'content' || tab === 'buttons' || tab === 'blocks') && (
            <AdminContentTab
              tab={tab}
              content={content}
              saving={saving}
              onSave={saveContent}
              onFieldChange={setContentField}
            />
          )}

          {tab === 'projects' && (
            <AdminProjectsTab
              projects={projects}
              saving={saving}
              setSaving={setSaving}
              onSave={handleSaveProject}
              onDelete={handleDeleteProject}
            />
          )}

          {(tab === 'reviews' || tab === 'leads' || tab === 'settings') && (
            <AdminReviewsLeadsTab
              tab={tab}
              reviews={reviews}
              leads={leads}
              saving={saving}
              savedMsg={savedMsg}
              onSaveReview={handleSaveReview}
              onDeleteReview={handleDeleteReview}
              onRefreshLeads={loadAll}
              onChangePassword={handleChangePassword}
            />
          )}
        </main>
      </div>
    </div>
  )
}