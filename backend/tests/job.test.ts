import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../src/app.js';

describe('Job API', () => {
  let clientToken: string;
  let clientId: string;

  beforeAll(async () => {
    // Register a client
    const res = await request(app)
      .post('/api/users/register')
      .field('username', 'jobclient')
      .field('fullname', 'Job Client')
      .field('email', 'client@example.com')
      .field('password', 'password123')
      .field('role', 'client')
      .attach(
        'profilePicture',
        Buffer.from('fake image content'),
        'profile.jpg',
      );

    clientToken = res.body.data.accessToken;
    clientId = res.body.data.user.id;
  });

  describe('POST /api/jobs', () => {
    it('should create a new job', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          title: 'New React Project',
          description: 'Need a developer for a React project',
          difficulty: 'intermediate',
          budget: 500,
          budgetType: 'fixed',
          skillsRequired: ['React', 'TypeScript'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.job).toHaveProperty('title', 'New React Project');
    });

    it('should fail if user is not a client', async () => {
      // Register a freelancer
      const freelancerRes = await request(app)
        .post('/api/users/register')
        .field('username', 'freelancer')
        .field('fullname', 'Freelancer User')
        .field('email', 'freelancer@example.com')
        .field('password', 'password123')
        .field('role', 'freelancer')
        .attach(
          'profilePicture',
          Buffer.from('fake image content'),
          'profile.jpg',
        );

      const freelancerToken = freelancerRes.body.data.accessToken;

      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send({
          title: 'Should Fail',
          description: '...',
          difficulty: 'entry',
          budget: 100,
          budgetType: 'fixed',
          skillsRequired: ['None'],
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/jobs', () => {
    it('should return a list of jobs', async () => {
      // Create a job first
      const createRes = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          title: 'Another Job Title Long Enough',
          description: 'Description with sufficient length',
          difficulty: 'entry',
          budget: 100,
          budgetType: 'hourly',
          skillsRequired: ['Node.js'],
        });

      expect(createRes.status).toBe(201);

      const res = await request(app).get('/api/jobs');

      expect(res.status).toBe(200);
      expect(res.body.data.jobs.length).toBeGreaterThan(0);
    });
  });
});
