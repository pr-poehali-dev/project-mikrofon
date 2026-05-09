
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section, key)
);

CREATE TABLE site_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  area VARCHAR(50),
  style VARCHAR(255),
  price VARCHAR(100),
  duration VARCHAR(50),
  image TEXT,
  gallery TEXT[],
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE site_reviews (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  text TEXT,
  rating INT DEFAULT 5,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO admin_users (username, password_hash) VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGTbR1Rj3pGSUaXzC5.KMFmYqiS');

INSERT INTO site_content (section, key, value) VALUES
('hero', 'title', 'Меблировка квартир под ключ в Новосибирске'),
('hero', 'subtitle', 'Кухни, шкафы и мебель для всей квартиры — от замера до монтажа за 30 дней'),
('hero', 'cta_primary', 'Рассчитать стоимость'),
('hero', 'cta_secondary', 'Получить концепцию в MAX'),
('contacts', 'phone', '+7 (913) 431-05-55'),
('contacts', 'phone_href', 'tel:+79134310555'),
('contacts', 'whatsapp_href', 'https://max.ru/u/f9LHodD0cOL1PbwV-gcwhH0uDPPh7fYs6mEO6mT9skVfTgi3h9x92puP1aU'),
('contacts', 'telegram', '@forma_nsk'),
('contacts', 'vk_href', 'https://vk.com/mebel.kuhni.skaf.novokuzneck'),
('footer', 'company_name', 'FORMA'),
('footer', 'description', 'Меблировка квартир под ключ в Новосибирске. Кухни, гардеробные, мебель для всей квартиры — производство, доставка, монтаж.'),
('footer', 'copyright', '© 2025 FORMA. Меблировка квартир под ключ, Новосибирск.');

INSERT INTO site_projects (title, category, area, style, price, duration, image, gallery, sort_order) VALUES
('ЖК Flora & Fauna', 'Меблировка 2-комнатной', '68 м²', 'Современный минимализм', 'от 1 200 000 ₽', '45 дней', 'https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/d69e0f91-34a7-406a-9237-6fcd5f4eff14.jpg', '{}', 1),
('ЖК Richmond Residence', 'Кухня + гостиная', '94 м²', 'Премиальный лофт', 'от 2 400 000 ₽', '60 дней', 'https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/8426680a-307d-45da-8165-d3657d15b1d0.jpg', '{}', 2),
('ЖК Европейский берег', 'Полная комплектация', '112 м²', 'Скандинавский стиль', 'от 3 100 000 ₽', '75 дней', 'https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/0c99552f-be17-4b7a-955c-84ea311c3bad.jpg', '{}', 3),
('ЖК Оазис', 'Гардеробная + спальня', '55 м²', 'Теплый минимализм', 'от 890 000 ₽', '35 дней', 'https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/7f5e34e0-5f57-4573-8603-4e5608f65a42.jpg', '{}', 4);

INSERT INTO site_reviews (author, location, text, rating, sort_order) VALUES
('Анастасия Козлова', 'ЖК Flora & Fauna', 'Очень довольна результатом! Команда сделала всё точно по проекту, ни одного замечания. Квартира стала именно такой, о которой мечтала.', 5, 1),
('Дмитрий Воронов', 'ЖК Richmond Residence', 'Профессионально, быстро, без лишних вопросов. Кухня получилась шикарная — все соседи спрашивают, где делали. Однозначно рекомендую.', 5, 2),
('Марина Соколова', 'ЖК Европейский берег', 'Работали строго по договору, сдали в срок. Особенно понравилась 3D-визуализация — всё именно так и получилось в реальности.', 5, 3);
