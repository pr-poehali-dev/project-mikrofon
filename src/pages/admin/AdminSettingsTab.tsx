import { useState } from 'react'
import { apiChangePassword } from '@/lib/api'

interface AdminSettingsTabProps {
  savedMsg: string
  onSaved: () => void
}

export default function AdminSettingsTab({ savedMsg, onSaved }: AdminSettingsTabProps) {
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== newPassword2) { alert('Пароли не совпадают'); return }
    if (newPassword.length < 6) { alert('Минимум 6 символов'); return }
    await apiChangePassword(newPassword)
    setNewPassword('')
    setNewPassword2('')
    onSaved()
  }

  const inp = "w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"

  return (
    <div className="space-y-8 max-w-md">
      <h2 className="text-xl font-medium">Настройки</h2>
      <div className="border border-border p-6">
        <h3 className="font-medium mb-4">Изменить пароль</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Новый пароль</label>
            <input type="password" className={inp} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Повторите пароль</label>
            <input type="password" className={inp} value={newPassword2} onChange={e => setNewPassword2(e.target.value)} />
          </div>
          <button type="submit" className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 transition-opacity">Сохранить пароль</button>
          {savedMsg && <p className="text-green-600 text-sm">{savedMsg}</p>}
        </form>
      </div>
    </div>
  )
}
