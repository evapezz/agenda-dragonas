// tests/auth.test.js - Tests de autenticación
const request = require('supertest');
const app = require('../server');
const { User } = require('../models');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        last_name: 'User',
        role: 'dragona'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        last_name: 'User'
      };

      await User.create({
        ...userData,
        password: 'hashedpassword'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('ya existe');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.message).toContain('requeridos');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test',
        last_name: 'User',
        role: 'dragona'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toContain('inválidas');
    });

    it('should not login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toContain('inválidas');
    });
  });

  describe('GET /api/auth/verify', () => {
    let token;
    let userId;

    beforeEach(async () => {
      const bcrypt = require('bcryptjs');
      const jwt = require('jsonwebtoken');
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

    it('should verify valid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.user.id).toBe(userId);
    });

    it('should not verify invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(response.body.message).toContain('inválido');
    });

    it('should not verify without token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .expect(401);

      expect(response.body.message).toContain('no proporcionado');
    });
  });
});

