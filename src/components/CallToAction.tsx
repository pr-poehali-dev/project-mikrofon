import { useState, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { LeadModal } from "./LeadModal"
import { useSiteContent } from "@/hooks/useSiteContent"

export function CallToAction() {
  const { get } = useSiteContent()
  const [open, setOpen] = useState(false)
  const pressTime = useRef<number>(0)

  const recordPress = () => { pressTime.current = Date.now() }

  const handleClick = () => {
    const elapsed = Date.now() - pressTime.current
    if (pressTime.current === 0 || elapsed > 5000) return
    pressTime.current = 0
    setOpen(true)
  }

  return (
    <section id="contact" className="py-32 md:py-40 bg-foreground text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/0c99552f-be17-4b7a-955c-84ea311c3bad.jpg"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-foreground/50 text-sm tracking-[0.3em] uppercase mb-8">Начать проект</p>

          <h2 className="text-3xl md:text-4xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-8 text-balance">
            {get('cta','title','Заезжайте в полностью готовую квартиру')}
          </h2>

          <p className="text-primary-foreground/60 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            {get('cta','subtitle','Оставьте заявку — мы свяжемся в течение 30 минут, ответим на вопросы и назначим бесплатный замер.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onMouseDown={recordPress}
              onTouchStart={recordPress}
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-3 bg-primary-foreground text-foreground px-8 py-4 text-sm tracking-wide hover:bg-primary-foreground/90 transition-colors duration-300 group"
            >
              {get('buttons','cta_primary_text','Получить расчет проекта')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={get('buttons','cta_secondary_href','https://max.ru/id421714233013_bot')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 px-8 py-4 text-sm tracking-wide hover:bg-primary-foreground/10 transition-colors duration-300"
            >{get('buttons','cta_secondary_text','Написать в MAX')}</a>
          </div>

          <p className="text-primary-foreground/30 text-sm mt-8">
            Бесплатная консультация · Выезд на замер · Без обязательств
          </p>
        </div>
      </div>

      <LeadModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}