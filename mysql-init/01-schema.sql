CREATE DATABASE IF NOT EXISTS Agenda;
USE Agenda;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('dragona','medico','admin') NOT NULL DEFAULT 'dragona',
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de perfiles de dragonas
CREATE TABLE IF NOT EXISTS dragona_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  birth_date DATE,
  diagnosis_date DATE,
  cancer_type VARCHAR(100),
  treatment_center VARCHAR(100),
  oncologist_name VARCHAR(100),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  medical_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  appointment_date DATETIME NOT NULL,
  location VARCHAR(100),
  appointment_type ENUM('medica','personal','tratamiento','otro') NOT NULL,
  reminder BOOLEAN DEFAULT FALSE,
  reminder_time INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de síntomas
CREATE TABLE IF NOT EXISTS symptoms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symptom_date DATE NOT NULL,
  pain_level INT, fatigue_level INT, nausea_level INT,
  anxiety_level INT, sleep_quality INT, appetite_level INT,
  notes TEXT,
  shared_with_doctor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de contenido motivacional
CREATE TABLE IF NOT EXISTS motivational_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content_date DATE NOT NULL,
  gratitude_notes TEXT,
  achievements TEXT,
  mood ENUM('muy_mal','mal','neutral','bien','muy_bien') NOT NULL,
  quote TEXT,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de relación médico-dragona
CREATE TABLE IF NOT EXISTS doctor_dragona (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  dragona_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_doctor_dragona (doctor_id, dragona_id),
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (dragona_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de preguntas a médico
CREATE TABLE IF NOT EXISTS doctor_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  question TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT FALSE,
  answer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Datos de ejemplo
INSERT IGNORE INTO users (username,email,password,role,name,last_name)
VALUES 
('admin','admin@agendadragonas.com','$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//SRPZPEihiS3TUu','admin','Administrador','Sistema'),
('doctor','doctor@agendadragonas.com','$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//SRPZPEihiS3TUu','medico','Doctor','Ejemplo'),
('dragona','dragona@agendadragonas.com','$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//SRPZPEihiS3TUu','dragona','Dragona','Ejemplo');

INSERT IGNORE INTO dragona_profiles 
  (user_id,birth_date,diagnosis_date,cancer_type,treatment_center,oncologist_name)
VALUES (3,'1985-05-15','2023-01-10','Mama','Hospital Universitario','Dr. García');

INSERT IGNORE INTO doctor_dragona (doctor_id,dragona_id) VALUES (2,3);
