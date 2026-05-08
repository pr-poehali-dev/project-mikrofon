export function Hero() {
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
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-stone-100 transition-colors duration-300"
          >
            Рассчитать проект
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-white/10 transition-colors duration-300"
          >
            Получить концепцию
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
    </section>
  )
}
