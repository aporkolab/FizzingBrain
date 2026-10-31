const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../server');
const config = require('../config');
const { User } = require('../model');

describe('POST /login', () => {
  let storedUser;

  beforeAll(async () => {
    storedUser = User.build({
      id: 3,
      email: 'admin@example.com',
      firstName: 'Ada',
      lastName: 'Admin',
      password: await bcrypt.hash('correct-horse1', 4),
    });
  });

  beforeEach(() => {
    jest.spyOn(User, 'findOne').mockImplementation(async ({ where }) =>
      where.email === storedUser.email ? storedUser : null);
  });

  afterEach(() => jest.restoreAllMocks());

  it('requires e-mail and password', async () => {
    const response = await request(app).post('/login').send({ email: 'admin@example.com' });
    expect(response.statusCode).toBe(400);
  });

  it('answers an unknown e-mail and a wrong password the same way', async () => {
    const unknown = await request(app).post('/login').send({ email: 'nobody@example.com', password: 'x' });
    const wrong = await request(app).post('/login').send({ email: 'admin@example.com', password: 'wrong' });
    expect(unknown.statusCode).toBe(401);
    expect(wrong.statusCode).toBe(401);
    expect(unknown.body).toEqual(wrong.body);
  });

  it('issues a verifiable token without leaking the password hash', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'admin@example.com', password: 'correct-horse1' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toEqual({ id: 3, email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin' });
    const payload = jwt.verify(response.body.accessToken, config.jwt.secret);
    expect(payload).toMatchObject({ id: 3, email: 'admin@example.com' });
    expect(JSON.stringify(response.body)).not.toContain(storedUser.password);
  });

  it('rejects non string credentials instead of crashing', async () => {
    const response = await request(app).post('/login').send({ email: { $gt: '' }, password: ['x'] });
    expect(response.statusCode).toBe(400);
  });
});
