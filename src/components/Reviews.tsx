import { useEffect, useRef, useState } from "react"

const reviews = [
  {
    name: "Анастасия Козлова",
    location: "ЖК Flora & Fauna",
    text: "Заехали через 6 недель после подписания договора. Кухня, гардеробная, спальня — всё готово. Я не могу поверить, насколько это удобно. Рекомендую всем, кто покупает квартиру в новостройке.",
    rating: 5,
    avatar: "АК",
  },
  {
    name: "Дмитрий Воронов",
    location: "ЖК Richmond Residence",
    text: "Думал, что дизайнерская мебель — это дорого и долго. Ребята сделали визуализацию, и я сразу понял, что будет именно так, как я хочу. Всё в срок, цена не изменилась.",
    rating: 5,
    avatar: "ДВ",
  },
  {
    name: "Марина Соколова",
    location: "ЖК Европейский берег",
    text: "Наконец-то нашли компанию, которая берёт на себя всё целиком. Не нужно было ходить по магазинам и сравнивать. Просто сказала, что хочу, и получила готовый результат.",
    rating: 5,
    avatar: "МС",
  },
]

export function Reviews() {
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
    <section id="reviews" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Отзывы клиентов</p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Что говорят<br/>наши клиенты</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.name}
              ref={(el) => { itemRefs.current[index] = el }}
              data-index={index}
              className={`bg-background border border-border p-8 flex flex-col transition-all duration-700 ${
                visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-stone-400 text-sm">★</span>
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed text-sm flex-1 mb-8">
                «{review.text}»
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="w-10 h-10 bg-foreground text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-medium text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
