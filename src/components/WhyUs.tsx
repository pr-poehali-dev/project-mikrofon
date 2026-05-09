import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"
import { useSiteContent } from "@/hooks/useSiteContent"

const advantages = [
  {
    icon: "Home",
    title: "Один подрядчик",
    description: "Вся квартира — одна компания. Не нужно координировать разных поставщиков.",
  },
  {
    icon: "Clock",
    title: "Точные сроки",
    description: "Прописываем сроки в договоре. Штрафы за просрочку на нашей стороне.",
  },
  {
    icon: "Ruler",
    title: "Производство под размеры",
    description: "Мебель делается под конкретную квартиру — идеальное попадание в каждый сантиметр.",
  },
  {
    icon: "Eye",
    title: "Визуализация до старта",
    description: "Реалистичные 3D-рендеры каждой комнаты. Видите результат до подписания договора.",
  },
  {
    icon: "Hammer",
    title: "Монтаж под ключ",
    description: "Привозим, собираем, устанавливаем технику. Убираем весь строительный мусор.",
  },
  {
    icon: "Shield",
    title: "Гарантия на всё",
    description: "Гарантийное обслуживание на всю мебель и технику. Один звонок — решаем.",
  },
]

export function WhyUs() {
  const { get } = useSiteContent()
  const items = advantages.map((a, i) => ({
    ...a,
    title: get('whyus', `item_${i+1}_title`) || a.title,
    description: get('whyus', `item_${i+1}_desc`) || a.description,
  }))
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
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
    <section id="why" ref={sectionRef} className="py-32 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-16">
          <p className="text-white/50 text-sm tracking-[0.3em] uppercase mb-6">{get('whyus','badge','Наши преимущества')}</p>
          <h2 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight lg:text-7xl">
            {get('whyus','title','Почему выбирают нас')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {items.map((item, index) => (
            <div
              key={item.title}
              ref={(el) => { itemRefs.current[index] = el }}
              data-index={index}
              className={`transition-all duration-700 ${
                visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">
                <Icon name={item.icon} size={32} className="text-stone-400" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-white">{item.title}</h3>
              <p className="text-white/60 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}