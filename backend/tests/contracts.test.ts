import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../src/app.js';

describe('Contracts API', () => {
  let clientToken: string;
  let freelancerToken: string;
  let jobId: string;
  let proposalId: string;
  let contractId: string;

  beforeAll(async () => {
    // Register Client
    const clientRes = await request(app)
      .post('/api/users/register')
      .field('username', 'contractclient')
      .field('fullname', 'Contract Client')
      .field('email', 'contractclient@example.com')
      .field('password', 'password123')
      .field('role', 'client')
      .attach('profilePicture', Buffer.from('fake'), 'profile.jpg');
    clientToken = clientRes.body.data.accessToken;

    // Register Freelancer
    const freelancerRes = await request(app)
      .post('/api/users/register')
      .field('username', 'contractfreelancer')
      .field('fullname', 'Contract Freelancer')
      .field('email', 'contractfreelancer@example.com')
      .field('password', 'password123')
      .field('role', 'freelancer')
      .attach('profilePicture', Buffer.from('fake'), 'profile.jpg');
    freelancerToken = freelancerRes.body.data.accessToken;

    // Create Job
    const jobRes = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Contract Job',
        description: 'Job for contract testing',
        difficulty: 'intermediate',
        budget: 500,
        budgetType: 'fixed',
        skillsRequired: ['Testing'],
      });
    jobId = jobRes.body.data.job._id;

    // Create Proposal
    const proposalRes = await request(app)
      .post('/api/proposals')
      .set('Authorization', `Bearer ${freelancerToken}`)
      .send({
        job: jobId,
        coverLetter:
          'I can do this job because I have the required skills and experience.',
        bidAmount: 500,
        estimatedTime: '2 days',
      });
    proposalId = proposalRes.body.data.proposal._id;

    // Accept Proposal
    await request(app)
      .patch(`/api/proposals/${proposalId}/status`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ status: 'accepted' });
  });

  describe('POST /api/contracts', () => {
    it('should create a contract from accepted proposal', async () => {
      const res = await request(app)
        .post('/api/contracts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          proposal: proposalId,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contract).toHaveProperty('status', 'active');
      contractId = res.body.data.contract._id;
    });
  });

  describe('PATCH /api/contracts/:id/submit', () => {
    it('should allow freelancer to submit work', async () => {
      const res = await request(app)
        .patch(`/api/contracts/${contractId}/submit`)
        .set('Authorization', `Bearer ${freelancerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.contract.status).toBe('submitted');
    });
  });

  describe('PATCH /api/contracts/:id/complete', () => {
    it('should allow client to complete contract', async () => {
      const res = await request(app)
        .patch(`/api/contracts/${contractId}/complete`)
        .set('Authorization', `Bearer ${clientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.contract.status).toBe('completed');
    });
  });
});
