import { useEffect, useRef, useState } from "react"
import { useSiteContent } from "@/hooks/useSiteContent"

const steps = [
  {
    number: "01",
    title: "Консультация",
    description: "Обсуждаем ваш проект, пожелания и бюджет. Бесплатно, без обязательств.",
  },
  {
    number: "02",
    title: "Замер",
    description: "Выезжаем на объект, снимаем точные размеры всех помещений.",
  },
  {
    number: "03",
    title: "Дизайн-концепция",
    description: "Создаем реалистичные 3D-визуализации каждой комнаты. Вы видите результат до старта.",
  },
  {
    number: "04",
    title: "Расчет стоимости",
    description: "Фиксируем полную смету без скрытых доплат. Цена не меняется в процессе.",
  },
  {
    number: "05",
    title: "Производство",
    description: "Изготавливаем мебель на собственном производстве под точные размеры вашей квартиры.",
  },
  {
    number: "06",
    title: "Доставка и монтаж",
    description: "Привозим, собираем и устанавливаем всё «под ключ» в согласованные сроки.",
  },
  {
    number: "07",
    title: "Сдача квартиры",
    description: "Принимаете готовую квартиру. Заезжаете. Живёте.",
  },
]

export function Process() {
  const { get } = useSiteContent()
  const dynSteps = steps.map((s, i) => ({
    ...s,
    title: get('process', `step_${i+1}_title`) || s.title,
    description: get('process', `step_${i+1}_desc`) || s.description,
  }))
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="process" className="py-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">{get('process','badge','Как мы работаем')}</p>
            <h2 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-6 lg:text-7xl">
              {get('process','title','7 шагов до готовой квартиры')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Прозрачный процесс, чёткие сроки и один ответственный за всё. Вы не теряете время — мы делаем работу.
            </p>
          </div>

          <div className="space-y-0">
            {dynSteps.map((step, index) => (
              <div
                key={step.number}
                ref={(el) => { itemRefs.current[index] = el }}
                data-index={index}
                className={`relative flex gap-8 pb-10 transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                } ${index < dynSteps.length - 1 ? "border-l border-border ml-5" : "ml-5"}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="absolute -left-5 top-0 w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-foreground/60">{step.number}</span>
                </div>

                <div className="pl-8">
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}