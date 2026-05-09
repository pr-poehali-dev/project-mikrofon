export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 py-20 max-w-3xl">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 inline-block">← Назад</a>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-10">Политика конфиденциальности</h1>

        <div className="prose prose-neutral max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">1. Общие положения</h2>
            <p>Настоящая политика конфиденциальности регулирует порядок обработки персональных данных пользователей сайта, осуществляемой Индивидуальным предпринимателем с ИНН 421714233013 (далее — Оператор).</p>
            <p className="mt-3">Используя сайт, вы соглашаетесь с условиями настоящей политики.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">2. Какие данные мы собираем</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Имя и контактный телефон (при заполнении формы заявки)</li>
              <li>Адрес электронной почты (при наличии)</li>
              <li>Технические данные браузера и устройства (cookie, IP-адрес)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">3. Цели обработки данных</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Обработка и исполнение заявок на услуги</li>
              <li>Связь с клиентами по вопросам заказа</li>
              <li>Улучшение качества обслуживания</li>
              <li>Выполнение требований законодательства РФ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">4. Хранение и защита данных</h2>
            <p>Персональные данные хранятся на защищённых серверах и не передаются третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">5. Права пользователя</h2>
            <p>Вы вправе в любой момент запросить удаление, изменение или получение своих персональных данных, направив обращение по контактам, указанным ниже.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">6. Контакты Оператора</h2>
            <p>ИП, ИНН 421714233013</p>
            <p className="mt-1">По вопросам обработки персональных данных обращайтесь через форму обратной связи на сайте.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">7. Изменения политики</h2>
            <p>Оператор вправе вносить изменения в настоящую политику. Актуальная версия всегда размещена на данной странице.</p>
          </section>

        </div>

        <p className="text-xs text-muted-foreground/60 mt-12">Последнее обновление: май 2025</p>
      </div>
    </div>
  )
}
