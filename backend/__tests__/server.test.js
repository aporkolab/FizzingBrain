const request = require('supertest');
const app = require('../server');
const { Question } = require('../model');

describe('server', () => {
  afterEach(() => jest.restoreAllMocks());

  it('answers unknown routes with a JSON 404', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ hasError: true, message: 'Cannot GET /does-not-exist' });
  });

  it('hides the details of unexpected errors', async () => {
    jest.spyOn(Question, 'findAll').mockRejectedValue(new Error('ER_ACCESS_DENIED for user root@10.0.0.1'));
    const response = await request(app).get('/question/rand');
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('serves the welcome page', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('config', () => {
  const load = (env) => {
    jest.resetModules();
    const saved = { ...process.env };
    Object.assign(process.env, env);
    try {
      return require('../config');
    } finally {
      process.env = saved;
    }
  };

  it('allows every origin unless CORS_ORIGIN is set', () => {
    expect(load({ CORS_ORIGIN: '' }).corsOrigin).toBe('*');
    expect(load({ CORS_ORIGIN: 'https://a.hu, https://b.hu' }).corsOrigin).toEqual(['https://a.hu', 'https://b.hu']);
  });

  it('keeps the seeder off by default', () => {
    expect(load({ SEED_DATABASE: '' }).seedDatabase).toBe(false);
    expect(load({ SEED_DATABASE: 'true' }).seedDatabase).toBe(true);
  });

  it('refuses to start outside tests without a JWT secret', () => {
    const config = load({ NODE_ENV: 'production', JWT_SECRET: '' });
    expect(() => config.assertRuntimeConfig()).toThrow('JWT_SECRET');
  });
});
