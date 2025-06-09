// tests/symptoms.test.js - Tests del sistema de síntomas
const request = require('supertest');
const app = require('../server');
const { User, Symptom } = require('../models');
const jwt = require('jsonwebtoken');

describe('Symptoms Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await Symptom.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test',
      last_name: 'User',
      role: 'dragona'
    });

    userId = user.id;
    token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );
  });

  describe('POST /api/symptoms', () => {
    it('should create a new symptom record', async () => {
      const symptomData = {
        date: '2025-06-09',
        pain_level: 5,
        fatigue_level: 7,
        nausea_level: 3,
        anxiety_level: 4,
        sleep_level: 6,
        appetite_level: 5,
        notes: 'Feeling better today'
      };

      const response = await request(app)
        .post('/api/symptoms')
        .set('Authorization', `Bearer ${token}`)
        .send(symptomData)
        .expect(201);

      expect(response.body.symptom.pain_level).toBe(5);
      expect(response.body.symptom.user_id).toBe(userId);
      expect(response.body.symptom.notes).toBe('Feeling better today');
    });

    it('should validate symptom levels are within range', async () => {
      const symptomData = {
        date: '2025-06-09',
        pain_level: 15, // Invalid: > 10
        fatigue_level: 7,
        nausea_level: 3,
        anxiety_level: 4,
        sleep_level: 6,
        appetite_level: 5
      };

      const response = await request(app)
        .post('/api/symptoms')
        .set('Authorization', `Bearer ${token}`)
        .send(symptomData)
        .expect(400);

      expect(response.body.message).toContain('válido');
    });

    it('should require authentication', async () => {
      const symptomData = {
        date: '2025-06-09',
        pain_level: 5,
        fatigue_level: 7
      };

      const response = await request(app)
        .post('/api/symptoms')
        .send(symptomData)
        .expect(401);

      expect(response.body.message).toContain('token');
    });
  });

  describe('GET /api/symptoms', () => {
    beforeEach(async () => {
      await Symptom.bulkCreate([
        {
          user_id: userId,
          date: '2025-06-09',
          pain_level: 5,
          fatigue_level: 7,
          nausea_level: 3,
          anxiety_level: 4,
          sleep_level: 6,
          appetite_level: 5,
          notes: 'Day 1'
        },
        {
          user_id: userId,
          date: '2025-06-08',
          pain_level: 6,
          fatigue_level: 8,
          nausea_level: 4,
          anxiety_level: 5,
          sleep_level: 5,
          appetite_level: 4,
          notes: 'Day 2'
        }
      ]);
    });

    it('should get user symptoms with pagination', async () => {
      const response = await request(app)
        .get('/api/symptoms?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.symptoms).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.pagination.page).toBe(1);
    });

    it('should filter symptoms by date range', async () => {
      const response = await request(app)
        .get('/api/symptoms?start_date=2025-06-09&end_date=2025-06-09')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.symptoms).toHaveLength(1);
      expect(response.body.symptoms[0].date).toBe('2025-06-09');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/symptoms')
        .expect(401);

      expect(response.body.message).toContain('token');
    });
  });

  describe('GET /api/symptoms/stats', () => {
    beforeEach(async () => {
      await Symptom.bulkCreate([
        {
          user_id: userId,
          date: '2025-06-09',
          pain_level: 5,
          fatigue_level: 7,
          nausea_level: 3,
          anxiety_level: 4,
          sleep_level: 6,
          appetite_level: 5
        },
        {
          user_id: userId,
          date: '2025-06-08',
          pain_level: 6,
          fatigue_level: 8,
          nausea_level: 4,
          anxiety_level: 5,
          sleep_level: 5,
          appetite_level: 4
        }
      ]);
    });

    it('should get symptom statistics', async () => {
      const response = await request(app)
        .get('/api/symptoms/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.stats).toHaveProperty('averages');
      expect(response.body.stats).toHaveProperty('trends');
      expect(response.body.stats.averages.pain_level).toBeCloseTo(5.5);
      expect(response.body.stats.averages.fatigue_level).toBeCloseTo(7.5);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/symptoms/stats')
        .expect(401);

      expect(response.body.message).toContain('token');
    });
  });

  describe('PUT /api/symptoms/:id', () => {
    let symptomId;

    beforeEach(async () => {
      const symptom = await Symptom.create({
        user_id: userId,
        date: '2025-06-09',
        pain_level: 5,
        fatigue_level: 7,
        nausea_level: 3,
        anxiety_level: 4,
        sleep_level: 6,
        appetite_level: 5,
        notes: 'Original note'
      });
      symptomId = symptom.id;
    });

    it('should update existing symptom', async () => {
      const updateData = {
        pain_level: 3,
        notes: 'Updated note'
      };

      const response = await request(app)
        .put(`/api/symptoms/${symptomId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.symptom.pain_level).toBe(3);
      expect(response.body.symptom.notes).toBe('Updated note');
    });

    it('should not update symptom of another user', async () => {
      // Create another user
      const anotherUser = await User.create({
        username: 'anotheruser',
        email: 'another@example.com',
        password: 'hashedpassword',
        name: 'Another',
        last_name: 'User',
        role: 'dragona'
      });

      const anotherToken = jwt.sign(
        { id: anotherUser.id, username: anotherUser.username, role: anotherUser.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .put(`/api/symptoms/${symptomId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ pain_level: 3 })
        .expect(404);

      expect(response.body.message).toContain('encontrado');
    });
  });

  describe('DELETE /api/symptoms/:id', () => {
    let symptomId;

    beforeEach(async () => {
      const symptom = await Symptom.create({
        user_id: userId,
        date: '2025-06-09',
        pain_level: 5,
        fatigue_level: 7,
        nausea_level: 3,
        anxiety_level: 4,
        sleep_level: 6,
        appetite_level: 5
      });
      symptomId = symptom.id;
    });

    it('should delete existing symptom', async () => {
      const response = await request(app)
        .delete(`/api/symptoms/${symptomId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toContain('eliminado');

      // Verify it's deleted
      const getResponse = await request(app)
        .get('/api/symptoms')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(getResponse.body.symptoms).toHaveLength(0);
    });

    it('should not delete symptom of another user', async () => {
      const anotherUser = await User.create({
        username: 'anotheruser',
        email: 'another@example.com',
        password: 'hashedpassword',
        name: 'Another',
        last_name: 'User',
        role: 'dragona'
      });

      const anotherToken = jwt.sign(
        { id: anotherUser.id, username: anotherUser.username, role: anotherUser.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .delete(`/api/symptoms/${symptomId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(404);

      expect(response.body.message).toContain('encontrado');
    });
  });
});

