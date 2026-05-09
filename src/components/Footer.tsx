export function Footer() {
  return (
    <footer className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <span className="text-foreground font-medium tracking-[0.2em] text-sm uppercase">Мастерская
Современной Мебели</span>
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-sm mb-4">
              Меблировка квартир под ключ в Новосибирске. Кухни, гардеробные, мебель для всей квартиры — производство, доставка, монтаж.
            </p>
            <p className="sr-only">
              меблировка квартир Новосибирск · кухни на заказ Новосибирск · мебель под ключ Новосибирск
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Навигация</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  Проекты
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-foreground transition-colors">
                  Услуги
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-foreground transition-colors">
                  Пакеты
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-foreground transition-colors">
                  Процесс
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="tel:+73831234567" className="hover:text-foreground transition-colors">+7 (913) 431-05-55</a>
              </li>
              <li>
                <a href="https://max.ru/u/f9LHodD0cOL1PbwV-gcwhH0uDPPh7fYs6mEO6mT9skVfTgi3h9x92puP1aU" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MAX</a>
              </li>
              <li>
                <a href="https://t.me/forma_nsk" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://vk.com/mebel.kuhni.skaf.novokuzneck" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  ВКонтакте
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>MSM - NSK: Меблировка квартир под ключ, Новосибирск.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}