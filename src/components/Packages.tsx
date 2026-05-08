import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const packages = [
  {
    name: "START",
    tagline: "Для студий и аренды",
    description: "Быстрое и стильное оснащение студии или небольшой квартиры. Всё необходимое для комфортного проживания или сдачи в аренду.",
    price: "от 350 000 ₽",
    features: [
      "Кухонный гарнитур",
      "Шкаф-купе",
      "Мебель для спальни",
      "Базовая бытовая техника",
      "Монтаж и установка",
    ],
    accent: false,
  },
  {
    name: "COMFORT",
    tagline: "Для семейных квартир",
    description: "Полная меблировка квартиры с дизайн-проектом. Все помещения, единый стиль, продуманное хранение для всей семьи.",
    price: "от 900 000 ₽",
    features: [
      "Дизайн-проект + 3D-визуализации",
      "Кухня на заказ",
      "Гардеробная комната",
      "Мебель для всех комнат",
      "Полная комплектация техникой",
      "Авторский надзор",
    ],
    accent: true,
  },
  {
    name: "PREMIUM",
    tagline: "Индивидуальный дизайн",
    description: "Авторские дизайнерские решения для тех, кто ценит детали. Уникальная мебель, премиальные материалы, полное сопровождение.",
    price: "от 2 000 000 ₽",
    features: [
      "Полный дизайн-проект",
      "Авторская мебель на заказ",
      "Премиальные материалы и фасады",
      "Эксклюзивный декор",
      "Светодизайн",
      "Личный дизайнер на весь проект",
      "Гарантия 5 лет",
    ],
    accent: false,
  },
]

export function Packages() {
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
      { threshold: 0.15 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="packages" className="py-32 bg-secondary/40">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Форматы сотрудничества</p>
          <h2 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-6 lg:text-7xl">
            Три <HighlightedText>пакета</HighlightedText>
            <br />
            под любой бюджет
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, index) => (
            <div
              key={pkg.name}
              ref={(el) => { itemRefs.current[index] = el }}
              data-index={index}
              className={`relative flex flex-col transition-all duration-700 ${
                visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${pkg.accent
                ? "bg-foreground text-primary-foreground p-8 md:p-10"
                : "bg-background border border-border p-8 md:p-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {pkg.accent && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-stone-400" />
              )}

              <div className="mb-6">
                <p className={`text-xs tracking-[0.4em] uppercase mb-2 ${pkg.accent ? "text-stone-400" : "text-muted-foreground"}`}>
                  {pkg.tagline}
                </p>
                <h3 className={`text-4xl font-medium tracking-tight ${pkg.accent ? "text-white" : "text-foreground"}`}>
                  {pkg.name}
                </h3>
              </div>

              <p className={`text-sm leading-relaxed mb-8 ${pkg.accent ? "text-stone-300" : "text-muted-foreground"}`}>
                {pkg.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className={`flex items-center gap-3 text-sm ${pkg.accent ? "text-stone-200" : "text-foreground/80"}`}>
                    <Icon name="Check" size={16} className={pkg.accent ? "text-stone-400 flex-shrink-0" : "text-foreground/50 flex-shrink-0"} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-current/10">
                <p className={`text-xl font-medium mb-4 ${pkg.accent ? "text-white" : "text-foreground"}`}>
                  {pkg.price}
                </p>
                <a
                  href="#contact"
                  className={`inline-flex w-full items-center justify-center gap-2 text-sm px-6 py-3 transition-all duration-300 tracking-wide ${
                    pkg.accent
                      ? "bg-white text-foreground hover:bg-stone-100"
                      : "border border-foreground text-foreground hover:bg-foreground hover:text-white"
                  }`}
                >
                  Выбрать пакет
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
