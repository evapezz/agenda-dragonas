const { sequelize } = require('../config/database');

// Importar todos los modelos
const User = require('./User');
const Symptom = require('./Symptom');
const MotivationalContent = require('./MotivationalContent');
const Appointment = require('./Appointment');
const DragonaProfile = require('./DragonaProfile');
const DoctorDragona = require('./DoctorDragona');
const DoctorQuestion = require('./DoctorQuestion');
const Sticker = require('./Sticker');
const PlacedSticker = require('./PlacedSticker');
const SharedData = require('./SharedData');
const SocialLink = require('./SocialLink');

// Definir asociaciones
User.hasMany(Symptom, { foreignKey: 'user_id', as: 'symptoms' });
Symptom.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(MotivationalContent, { foreignKey: 'user_id', as: 'motivationalContent' });
MotivationalContent.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Appointment, { foreignKey: 'user_id', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(DragonaProfile, { foreignKey: 'user_id', as: 'dragonaProfile' });
DragonaProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(DoctorQuestion, { foreignKey: 'user_id', as: 'questions' });
DoctorQuestion.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Relación médico-dragona (muchos a muchos)
User.belongsToMany(User, {
  through: DoctorDragona,
  as: 'patients',
  foreignKey: 'doctor_id',
  otherKey: 'dragona_id'
});

User.belongsToMany(User, {
  through: DoctorDragona,
  as: 'doctors',
  foreignKey: 'dragona_id',
  otherKey: 'doctor_id'
});

// Stickers
User.hasMany(PlacedSticker, { foreignKey: 'user_id', as: 'placedStickers' });
PlacedSticker.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

PlacedSticker.belongsTo(Sticker, { foreignKey: 'sticker_id', as: 'sticker' });
Sticker.hasMany(PlacedSticker, { foreignKey: 'sticker_id', as: 'placements' });

MotivationalContent.hasMany(PlacedSticker, { foreignKey: 'motivational_content_id', as: 'stickers' });
PlacedSticker.belongsTo(MotivationalContent, { foreignKey: 'motivational_content_id', as: 'motivationalContent' });

// Datos compartidos
User.hasMany(SharedData, { foreignKey: 'user_id', as: 'sharedData' });
SharedData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Enlaces sociales
User.hasMany(SocialLink, { foreignKey: 'user_id', as: 'socialLinks' });
SocialLink.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Symptom,
  MotivationalContent,
  Appointment,
  DragonaProfile,
  DoctorDragona,
  DoctorQuestion,
  Sticker,
  PlacedSticker,
  SharedData,
  SocialLink
};

