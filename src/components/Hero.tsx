import { useState, useRef } from "react"
import { LeadModal } from "./LeadModal"

export function Hero() {
  const [open, setOpen] = useState(false)
  const pressTime = useRef<number>(0)
  const calcPressTime = useRef<number>(0)

  const recordPress = (ref: React.MutableRefObject<number>) => () => {
    ref.current = Date.now()
  }

  const handleMaxClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const elapsed = Date.now() - pressTime.current
    if (pressTime.current === 0 || elapsed > 5000) return
    pressTime.current = 0
    window.open("https://max.ru/id421714233013_bot", "_blank", "noopener,noreferrer")
  }

  const handleCalcClick = () => {
    const elapsed = Date.now() - calcPressTime.current
    if (calcPressTime.current === 0 || elapsed > 5000) return
    calcPressTime.current = 0
    setOpen(true)
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

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-5xl my-0 py-[66px]">
        <p className="tracking-[0.35em] uppercase text-white/60 my-0 py-5 text-xs text-center font-light">Новосибирск</p>

        <h1 className="sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight text-balance px-0 mx-0 text-left font-light my-[15px] text-4xl">Меблировка квартир под ключ в Новосибирске</h1>

        <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light my-9 py-0">Делаем меблировки по готовым дизайн проектам. Проектируем, изготавливаем и монтируем — от эконома до премиума.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onMouseDown={recordPress(calcPressTime)}
            onTouchStart={recordPress(calcPressTime)}
            onClick={handleCalcClick}
            className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-8 text-sm tracking-widest uppercase font-medium hover:bg-stone-100 transition-colors duration-300 my-0 py-5"
          >
            Рассчитать стоимость
          </button>

          <a
            href="https://max.ru/id421714233013_bot"
            onMouseDown={recordPress(pressTime)}
            onTouchStart={recordPress(pressTime)}
            onClick={handleMaxClick}
            className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-8 tracking-widest uppercase font-light hover:bg-white/10 transition-colors duration-300 text-sm rounded-full py-3.5"
          >
            Получить концепцию в MAX
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 my-0 py-0">
          {[
            "Собственное производство",
            "Фиксированная стоимость",
            "Полная комплектация",
            "Эконом — Premium",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-white/70 text-sm lg:text-lg">
              <span className="text-stone-300">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <LeadModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}