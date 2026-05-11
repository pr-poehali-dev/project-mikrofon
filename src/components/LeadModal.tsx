import { useState } from "react"
import { X } from "lucide-react"
import { apiSubmitLead } from "@/lib/api"

interface LeadModalProps {
  open: boolean
  onClose: () => void
}

export function LeadModal({ open, onClose }: LeadModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", comment: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiSubmitLead(form.name, form.phone, form.comment)
    } catch (_) {
      // показываем успех даже при ошибке сети
    }
    setLoading(false)
    setSent(true)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setSent(false), 300)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-background w-full max-w-md p-8 md:p-10 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {!sent ? (
          <>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Предварительный расчет и консультация</p>
            <h2 className="text-2xl font-medium tracking-tight mb-2 text-[#00000000]">Рассчитать проект</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Оставьте заявку — свяжемся в течение 30 минут, обсудим квартиру и назначим замер.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Ваше имя</label>
                <input className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors text-[#000000]"
                  type="text"
                  required
                  placeholder="Иван"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Телефон</label>
                <input className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors text-[#000000]"
                  type="tel"
                  required
                  placeholder="+7 ___-___-__-__"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Способ связи</label>
                <div className="flex gap-2">
                  {["MAX", "Telegram"].map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setForm({ ...form, comment: channel })}
                      className={`flex-1 py-3 text-sm border transition-colors duration-200 ${
                        form.comment === channel
                          ? "bg-foreground text-primary-foreground border-foreground"
                          : "border-border text-foreground hover:border-foreground"
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-primary-foreground py-4 text-sm tracking-widest uppercase font-medium hover:bg-foreground/90 transition-colors duration-300 mt-2 disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Отправить заявку"}
              </button>
              <p className="text-muted-foreground text-xs text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-foreground flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground text-xl">✓</span>
            </div>
            <h2 className="text-2xl font-medium tracking-tight mb-3">Заявка отправлена</h2>
            <p className="text-muted-foreground leading-relaxed">
              Свяжемся с вами в течение 30 минут. Спасибо!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}