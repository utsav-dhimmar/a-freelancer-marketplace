import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app.js';
import { User } from '../src/model/user.model.js';

describe('User API', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user with profile picture', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .field('username', 'testuser')
        .field('fullname', 'Test User')
        .field('email', 'test@example.com')
        .field('password', 'password123')
        .field('role', 'client')
        .attach(
          'profilePicture',
          Buffer.from('fake image content'),
          'profile.jpg',
        );

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .field('username', 'testuser2')
        // Missing other fields
        .attach(
          'profilePicture',
          Buffer.from('fake image content'),
          'profile.jpg',
        );

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('should login an existing user', async () => {
      // First register
      await request(app)
        .post('/api/users/register')
        .field('username', 'loginuser')
        .field('fullname', 'Login User')
        .field('email', 'login@example.com')
        .field('password', 'password123')
        .attach(
          'profilePicture',
          Buffer.from('fake image content'),
          'profile.jpg',
        );

      // Then login
      const res = await request(app).post('/api/users/login').send({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      // First register
      await request(app)
        .post('/api/users/register')
        .field('username', 'wrongpass')
        .field('fullname', 'Wrong Pass')
        .field('email', 'wrong@example.com')
        .field('password', 'password123')
        .attach(
          'profilePicture',
          Buffer.from('fake image content'),
          'profile.jpg',
        );

      const res = await request(app).post('/api/users/login').send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });
});
