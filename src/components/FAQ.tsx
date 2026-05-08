import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Сколько стоит меблировка квартиры под ключ в Новосибирске?",
    answer:
      "Стоимость зависит от площади, количества комнат и выбранного пакета. Базовая меблировка студии начинается от 350 000 ₽. Комплектация 2-комнатной квартиры в пакете COMFORT — от 900 000 ₽. Точную сумму рассчитываем после замера и обсуждения вашего проекта.",
  },
  {
    question: "Сколько времени занимает весь процесс?",
    answer:
      "От замера до въезда — в среднем 35–75 дней, в зависимости от сложности проекта. Студия под аренду — от 35 дней. Полная меблировка квартиры с дизайн-проектом — 60–75 дней. Сроки фиксируем в договоре.",
  },
  {
    question: "Вы работаете только в Новосибирске?",
    answer:
      "Да, мы специализируемся на Новосибирске и пригороде. Знаем все крупные ЖК города, их планировки и особенности. Это позволяет нам работать быстрее и точнее.",
  },
  {
    question: "Можно ли изменить дизайн после согласования?",
    answer:
      "Да, до начала производства мы вносим изменения. После запуска в работу возможны корректировки, которые не затрагивают уже изготовленные позиции. Именно поэтому мы так тщательно прорабатываем дизайн на этапе визуализации.",
  },
  {
    question: "Есть ли гарантия на мебель?",
    answer:
      "Гарантия на мебель собственного производства — 3 года. На технику — заводская гарантия производителя. Отдельные позиции в пакете PREMIUM — гарантия до 5 лет. Все условия прописываются в договоре.",
  },
  {
    question: "Как начать сотрудничество?",
    answer:
      "Оставьте заявку на сайте или позвоните нам. Мы свяжемся в течение 30 минут, обсудим проект и назначим бесплатный выезд на замер. После замера — получите готовую смету в течение 2 рабочих дней.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Вопросы и ответы</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
