interface AdminContentTabProps {
  tab: 'content' | 'buttons' | 'blocks'
  content: Record<string, Record<string, string>>
  saving: boolean
  onSave: () => void
  onFieldChange: (section: string, key: string, value: string) => void
}

export default function AdminContentTab({ tab, content, saving, onSave, onFieldChange }: AdminContentTabProps) {
  const btnSave = (
    <button onClick={onSave} disabled={saving}
      className="bg-foreground text-background px-6 py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
      {saving ? 'Сохранение...' : 'Сохранить'}
    </button>
  )

  if (tab === 'content') return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Тексты сайта</h2>
        {btnSave}
      </div>
      {[
        { section: 'hero', label: 'Главный экран', fields: [
          { key: 'title', label: 'Заголовок', multiline: false },
          { key: 'subtitle', label: 'Подзаголовок', multiline: true },
          { key: 'cta_primary', label: 'Кнопка 1', multiline: false },
          { key: 'cta_secondary', label: 'Кнопка 2', multiline: false },
        ]},
        { section: 'contacts', label: 'Контакты', fields: [
          { key: 'phone', label: 'Телефон (отображение)', multiline: false },
          { key: 'phone_href', label: 'Телефон (ссылка tel:)', multiline: false },
          { key: 'whatsapp_href', label: 'Ссылка WhatsApp/MAX', multiline: false },
          { key: 'telegram', label: 'Telegram', multiline: false },
          { key: 'vk_href', label: 'Ссылка ВКонтакте', multiline: false },
        ]},
        { section: 'footer', label: 'Футер', fields: [
          { key: 'company_name', label: 'Название компании', multiline: false },
          { key: 'description', label: 'Описание', multiline: true },
          { key: 'copyright', label: 'Копирайт', multiline: false },
        ]},
      ].map(({ section, label, fields }) => (
        <div key={section} className="border border-border p-6">
          <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">{label}</h3>
          <div className="space-y-4">
            {fields.map(({ key, label: fl, multiline }) => (
              <div key={key}>
                <label className="block text-sm text-muted-foreground mb-1">{fl}</label>
                {multiline ? (
                  <textarea rows={3} className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background resize-none"
                    value={content[section]?.[key] || ''}
                    onChange={e => onFieldChange(section, key, e.target.value)} />
                ) : (
                  <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                    value={content[section]?.[key] || ''}
                    onChange={e => onFieldChange(section, key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  if (tab === 'buttons') return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Кнопки сайта</h2>
        {btnSave}
      </div>
      {[
        { label: 'Шапка сайта', fields: [
          { key: 'header_cta_text', label: 'Текст кнопки' },
          { key: 'header_cta_href', label: 'Ссылка (tel:, https://, #якорь)' },
        ]},
        { label: 'Главный экран (Hero)', fields: [
          { key: 'hero_primary_text', label: 'Кнопка 1 — текст' },
          { key: 'hero_primary_href', label: 'Кнопка 1 — ссылка' },
          { key: 'hero_secondary_text', label: 'Кнопка 2 — текст' },
          { key: 'hero_secondary_href', label: 'Кнопка 2 — ссылка' },
        ]},
        { label: 'Блок призыва (внизу страницы)', fields: [
          { key: 'cta_primary_text', label: 'Кнопка 1 — текст' },
          { key: 'cta_primary_href', label: 'Кнопка 1 — ссылка' },
          { key: 'cta_secondary_text', label: 'Кнопка 2 — текст' },
          { key: 'cta_secondary_href', label: 'Кнопка 2 — ссылка' },
        ]},
      ].map(({ label, fields }) => (
        <div key={label} className="border border-border p-6">
          <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">{label}</h3>
          <div className="space-y-4">
            {fields.map(({ key, label: fl }) => (
              <div key={key}>
                <label className="block text-sm text-muted-foreground mb-1">{fl}</label>
                <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                  value={content['buttons']?.[key] || ''}
                  onChange={e => onFieldChange('buttons', key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Блоки сайта</h2>
        {btnSave}
      </div>
      {[
        { section: 'philosophy', label: 'Блок "Для кого мы работаем"', fields: [
          { key: 'badge', label: 'Метка (маленький текст)' },
          { key: 'title', label: 'Заголовок' },
          { key: 'title_highlight', label: 'Выделенное слово' },
          { key: 'subtitle', label: 'Подзаголовок', multiline: true },
          { key: 'item_1_title', label: 'Пункт 1 — название' },
          { key: 'item_1_desc', label: 'Пункт 1 — описание', multiline: true },
          { key: 'item_2_title', label: 'Пункт 2 — название' },
          { key: 'item_2_desc', label: 'Пункт 2 — описание', multiline: true },
          { key: 'item_3_title', label: 'Пункт 3 — название' },
          { key: 'item_3_desc', label: 'Пункт 3 — описание', multiline: true },
          { key: 'item_4_title', label: 'Пункт 4 — название' },
          { key: 'item_4_desc', label: 'Пункт 4 — описание', multiline: true },
        ]},
        { section: 'expertise', label: 'Блок "Услуги"', fields: [
          { key: 'badge', label: 'Метка' },
          { key: 'title_highlight', label: 'Выделенное слово' },
          { key: 'title', label: 'Заголовок (продолжение)' },
          { key: 'subtitle', label: 'Подзаголовок', multiline: true },
          { key: 'item_1_title', label: 'Услуга 1 — название' },
          { key: 'item_1_desc', label: 'Услуга 1 — описание', multiline: true },
          { key: 'item_2_title', label: 'Услуга 2 — название' },
          { key: 'item_2_desc', label: 'Услуга 2 — описание', multiline: true },
          { key: 'item_3_title', label: 'Услуга 3 — название' },
          { key: 'item_3_desc', label: 'Услуга 3 — описание', multiline: true },
          { key: 'item_4_title', label: 'Услуга 4 — название' },
          { key: 'item_4_desc', label: 'Услуга 4 — описание', multiline: true },
          { key: 'item_5_title', label: 'Услуга 5 — название' },
          { key: 'item_5_desc', label: 'Услуга 5 — описание', multiline: true },
          { key: 'item_6_title', label: 'Услуга 6 — название' },
          { key: 'item_6_desc', label: 'Услуга 6 — описание', multiline: true },
        ]},
        { section: 'packages', label: 'Блок "Пакеты"', fields: [
          { key: 'title', label: 'Заголовок' },
          { key: 'pkg1_name', label: 'Пакет 1 — название' },
          { key: 'pkg1_tagline', label: 'Пакет 1 — подпись' },
          { key: 'pkg1_desc', label: 'Пакет 1 — описание', multiline: true },
          { key: 'pkg1_price', label: 'Пакет 1 — цена' },
          { key: 'pkg2_name', label: 'Пакет 2 — название' },
          { key: 'pkg2_tagline', label: 'Пакет 2 — подпись' },
          { key: 'pkg2_desc', label: 'Пакет 2 — описание', multiline: true },
          { key: 'pkg2_price', label: 'Пакет 2 — цена' },
          { key: 'pkg3_name', label: 'Пакет 3 — название' },
          { key: 'pkg3_tagline', label: 'Пакет 3 — подпись' },
          { key: 'pkg3_desc', label: 'Пакет 3 — описание', multiline: true },
          { key: 'pkg3_price', label: 'Пакет 3 — цена' },
        ]},
        { section: 'whyus', label: 'Блок "Почему выбирают нас"', fields: [
          { key: 'title', label: 'Заголовок' },
          { key: 'item_1_title', label: 'Пункт 1 — название' }, { key: 'item_1_desc', label: 'Пункт 1 — описание', multiline: true },
          { key: 'item_2_title', label: 'Пункт 2 — название' }, { key: 'item_2_desc', label: 'Пункт 2 — описание', multiline: true },
          { key: 'item_3_title', label: 'Пункт 3 — название' }, { key: 'item_3_desc', label: 'Пункт 3 — описание', multiline: true },
          { key: 'item_4_title', label: 'Пункт 4 — название' }, { key: 'item_4_desc', label: 'Пункт 4 — описание', multiline: true },
          { key: 'item_5_title', label: 'Пункт 5 — название' }, { key: 'item_5_desc', label: 'Пункт 5 — описание', multiline: true },
          { key: 'item_6_title', label: 'Пункт 6 — название' }, { key: 'item_6_desc', label: 'Пункт 6 — описание', multiline: true },
        ]},
        { section: 'process', label: 'Блок "Процесс работы"', fields: [
          { key: 'title', label: 'Заголовок' },
          { key: 'step_1_title', label: 'Шаг 1 — название' }, { key: 'step_1_desc', label: 'Шаг 1 — описание', multiline: true },
          { key: 'step_2_title', label: 'Шаг 2 — название' }, { key: 'step_2_desc', label: 'Шаг 2 — описание', multiline: true },
          { key: 'step_3_title', label: 'Шаг 3 — название' }, { key: 'step_3_desc', label: 'Шаг 3 — описание', multiline: true },
          { key: 'step_4_title', label: 'Шаг 4 — название' }, { key: 'step_4_desc', label: 'Шаг 4 — описание', multiline: true },
          { key: 'step_5_title', label: 'Шаг 5 — название' }, { key: 'step_5_desc', label: 'Шаг 5 — описание', multiline: true },
          { key: 'step_6_title', label: 'Шаг 6 — название' }, { key: 'step_6_desc', label: 'Шаг 6 — описание', multiline: true },
          { key: 'step_7_title', label: 'Шаг 7 — название' }, { key: 'step_7_desc', label: 'Шаг 7 — описание', multiline: true },
        ]},
        { section: 'cta', label: 'Блок призыва к действию (внизу)', fields: [
          { key: 'title', label: 'Заголовок', multiline: false },
          { key: 'subtitle', label: 'Подзаголовок', multiline: true },
        ]},
      ].map(({ section, label, fields }) => (
        <div key={section} className="border border-border p-6">
          <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">{label}</h3>
          <div className="space-y-3">
            {fields.map(({ key, label: fl, multiline }) => (
              <div key={key}>
                <label className="block text-sm text-muted-foreground mb-1">{fl}</label>
                {multiline ? (
                  <textarea rows={2} className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background resize-none"
                    value={content[section]?.[key] || ''}
                    onChange={e => onFieldChange(section, key, e.target.value)} />
                ) : (
                  <input className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                    value={content[section]?.[key] || ''}
                    onChange={e => onFieldChange(section, key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
