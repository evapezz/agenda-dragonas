-- Actualizaciones del esquema para nuevas funcionalidades de Agenda de Dragonas

USE Agenda;

-- Tabla para pegatinas virtuales
CREATE TABLE IF NOT EXISTS stickers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  category ENUM('motivacional', 'emocional', 'medica', 'estacional', 'personalizada') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para ubicación de pegatinas en la agenda
CREATE TABLE IF NOT EXISTS sticker_placements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  sticker_id INT NOT NULL,
  page_type ENUM('dashboard', 'appointments', 'symptoms', 'motivational') NOT NULL,
  position_x INT NOT NULL,
  position_y INT NOT NULL,
  scale FLOAT DEFAULT 1.0,
  rotation INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sticker_id) REFERENCES stickers(id) ON DELETE CASCADE
);

-- Tabla para enlaces de redes sociales
CREATE TABLE IF NOT EXISTS social_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  platform ENUM('facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'pinterest', 'otro') NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_platform (user_id, platform)
);

-- Tabla para datos compartidos con médicos
CREATE TABLE IF NOT EXISTS shared_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dragona_id INT NOT NULL,
  doctor_id INT NOT NULL,
  data_type ENUM('symptoms', 'appointments', 'questions', 'notes') NOT NULL,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dragona_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_sharing_config (dragona_id, doctor_id, data_type)
);

-- Insertar pegatinas de ejemplo
INSERT INTO stickers (name, image_path, category) VALUES
('Dragón Sonriente', '/assets/stickers/dragon_smile.png', 'motivacional'),
('Dragón Luchador', '/assets/stickers/dragon_fighter.png', 'motivacional'),
('Corazón', '/assets/stickers/heart.png', 'emocional'),
('Estrella', '/assets/stickers/star.png', 'motivacional'),
('Flor', '/assets/stickers/flower.png', 'estacional'),
('Medicamento', '/assets/stickers/medicine.png', 'medica'),
('Sol', '/assets/stickers/sun.png', 'estacional'),
('Luna', '/assets/stickers/moon.png', 'estacional'),
('Arcoíris', '/assets/stickers/rainbow.png', 'motivacional'),
('Nube', '/assets/stickers/cloud.png', 'emocional');

-- Configuración de compartición de datos para el usuario de ejemplo
INSERT INTO shared_data (dragona_id, doctor_id, data_type, is_shared) VALUES
(3, 2, 'symptoms', TRUE),
(3, 2, 'appointments', TRUE),
(3, 2, 'questions', TRUE),
(3, 2, 'notes', FALSE);

-- Añadir redes sociales de ejemplo para la dragona
INSERT INTO social_links (user_id, platform, url, is_public) VALUES
(3, 'instagram', 'https://instagram.com/dragonaejemplo', TRUE),
(3, 'facebook', 'https://facebook.com/dragonaejemplo', FALSE);
