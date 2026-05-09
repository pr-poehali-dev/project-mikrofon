import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import { useSiteContent } from "@/hooks/useSiteContent"

const philosophyItems = [
  {
    title: "Новостройки",
    description:
      "Помогаем жильцам новых ЖК въехать в полностью готовую квартиру. Берём на себя всё — от обмеров до последнего светильника.",
  },
  {
    title: "Семейные квартиры",
    description:
      "Продумываем пространство с учетом реальной жизни семьи: удобные кухни, вместительные гардеробные, функциональные детские.",
  },
  {
    title: "Студии под аренду",
    description:
      "Создаем стильное и долговечное оснащение для арендных квартир. Быстро, с умом и в рамках бюджета.",
  },
  {
    title: "Премиальные интерьеры",
    description:
      "Индивидуальные дизайнерские решения для тех, кто ценит материалы, детали и авторский подход к пространству.",
  },
]

export function Philosophy() {
  const { get } = useSiteContent()
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const items = [1,2,3,4].map(i => ({
    title: get('philosophy', `item_${i}_title`) || philosophyItems[i-1].title,
    description: get('philosophy', `item_${i}_desc`) || philosophyItems[i-1].description,
  }))

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
      { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">{get('philosophy','badge','Для кого мы работаем')}</p>
            <h2 className="text-6xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
              {get('philosophy','title','Квартира')}
              <br />
              <HighlightedText>{get('philosophy','title_highlight','готова')}</HighlightedText>
            </h2>

            <div className="relative hidden lg:block">
              <img
                src="https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/b300f37b-885e-4dd7-a539-0e29716bc4dd.jpg"
                alt="Спальня с авторской мебелью"
                className="opacity-90 relative z-10 w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 lg:pt-48">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
              {get('philosophy','subtitle','Мы работаем с жителями Новосибирска, которые купили квартиру и хотят заехать в красивое, готовое пространство — без бесконечных поездок по магазинам и стресса с подрядчиками.')}
            </p>

            {items.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  <span className="text-muted-foreground/50 text-sm font-medium">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}