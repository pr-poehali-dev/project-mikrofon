import { useState, useRef } from "react"
import { X } from "lucide-react"

export function Hero() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", comment: "" })
  const [sent, setSent] = useState(false)
  const pressTime = useRef<number>(0)

  const handleMaxMouseDown = () => {
    pressTime.current = Date.now()
  }

  const handleMaxClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const elapsed = Date.now() - pressTime.current
    if (!e.isTrusted || elapsed < 80 || elapsed > 3000) return
    window.open("https://max.ru/id421714233013_bot", "_blank", "noopener,noreferrer")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/d69e0f91-34a7-406a-9237-6fcd5f4eff14.jpg"
          alt="Премиальный интерьер квартиры в Новосибирске"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-5xl">
        <p className="text-sm tracking-[0.35em] uppercase text-white/60 mb-6">Новосибирск · Меблировка под ключ</p>

        <h1 className="text-5xl font-medium text-balance text-center text-white mb-6 tracking-tight leading-[1.05] lg:text-7xl md:text-6xl">
          Меблировка квартир
          <br />
          <span className="text-stone-300">под ключ</span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Создаем полностью готовые пространства для жизни — от кухни до гардеробной. Дизайн, производство, доставка и установка под ключ.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => { setOpen(true); setSent(false) }}
            className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-stone-100 transition-colors duration-300"
          >
            Рассчитать проект
          </button>
          <a
            href="https://max.ru/id421714233013_bot"
            onMouseDown={handleMaxMouseDown}
            onClick={handleMaxClick}
            className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-white/10 transition-colors duration-300 cursor-pointer"
          >
            Получить концепцию в MAX
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            "Собственное производство",
            "Фиксированная стоимость",
            "Полная комплектация",
            "Эконом — Premium",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
              <span className="text-stone-300">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative bg-background w-full max-w-md p-8 md:p-10 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            {!sent ? (
              <>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Бесплатный расчёт</p>
                <h2 className="text-2xl font-medium tracking-tight mb-2">Рассчитать проект</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  Оставьте заявку — свяжемся в течение 30 минут, обсудим квартиру и назначим замер.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Ваше имя</label>
                    <input
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
                    <input
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
                    className="w-full bg-foreground text-primary-foreground py-4 text-sm tracking-widest uppercase font-medium hover:bg-foreground/90 transition-colors duration-300 mt-2"
                  >
                    Отправить заявку
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
      )}
    </section>
  )
}