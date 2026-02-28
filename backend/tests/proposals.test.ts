import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../src/app.js';

describe('Proposal API', () => {
  let clientToken: string;
  let freelancerToken: string;
  let jobId: string;

  beforeAll(async () => {
    // Register Client
    const clientRes = await request(app)
      .post('/api/users/register')
      .field('username', 'propclient')
      .field('fullname', 'Prop Client')
      .field('email', 'propclient@example.com')
      .field('password', 'password123')
      .field('role', 'client')
      .attach('profilePicture', Buffer.from('fake'), 'profile.jpg');
    clientToken = clientRes.body.data.accessToken;

    // Register Freelancer
    const freelancerRes = await request(app)
      .post('/api/users/register')
      .field('username', 'propfreelancer')
      .field('fullname', 'Prop Freelancer')
      .field('email', 'propfreelancer@example.com')
      .field('password', 'password123')
      .field('role', 'freelancer')
      .attach('profilePicture', Buffer.from('fake'), 'profile.jpg');
    freelancerToken = freelancerRes.body.data.accessToken;

    // Create Job
    const jobRes = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Proposal Job',
        description: 'Job for proposal testing',
        difficulty: 'entry',
        budget: 200,
        budgetType: 'fixed',
        skillsRequired: ['Writing'],
      });
    jobId = jobRes.body.data.job._id;
  });

  describe('POST /api/proposals', () => {
    it('should create a proposal', async () => {
      const res = await request(app)
        .post('/api/proposals')
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send({
          job: jobId,
          coverLetter: 'I am interested in this job and I have the skills.',
          bidAmount: 200,
          estimatedTime: '1 day',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should prevent double submission', async () => {
      // First submission done in previous test
      const res = await request(app)
        .post('/api/proposals')
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send({
          job: jobId,
          coverLetter: 'I am interested again and I really want this job.',
          bidAmount: 200,
          estimatedTime: '1 day',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/proposals/job/:jobid', () => {
    it('should list proposals for job owner', async () => {
      const res = await request(app)
        .get(`/api/proposals/job/${jobId}`)
        .set('Authorization', `Bearer ${clientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.proposals).toHaveLength(1);
    });
  });
});
