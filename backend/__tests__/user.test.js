const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server');
const { User } = require('../model');
const { bearer } = require('./helpers/auth');

const buildUser = (overrides = {}) => User.build({
  id: 1,
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '$2b$10$alreadyhashedvalue',
  ...overrides,
});

describe('User API', () => {
  afterEach(() => jest.restoreAllMocks());

  it('requires a token', async () => {
    const response = await request(app).get('/user');
    expect(response.statusCode).toBe(401);
  });

  it('lists users without their password hashes', async () => {
    jest.spyOn(User, 'findAll').mockResolvedValue([buildUser(), buildUser({ id: 2, email: 'jane@example.com' })]);
    const response = await request(app).get('/user').set('Authorization', bearer());
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toEqual({ id: 1, email: 'john@example.com', firstName: 'John', lastName: 'Doe' });
    expect(response.body[1]).not.toHaveProperty('password');
  });

  it('hands the plain password to the model exactly once for hashing', async () => {
    const create = jest.spyOn(User, 'create').mockImplementation(async (data) => buildUser(data));
    const response = await request(app)
      .post('/user')
      .set('Authorization', bearer())
      .send({ email: 'new@example.com', firstName: 'New', lastName: 'User', password: 'Secret123' });
    expect(response.statusCode).toBe(201);
    expect(create.mock.calls[0][0].password).toBe('Secret123');
    expect(response.body).not.toHaveProperty('password');
  });

  it('supports PATCH used by the frontend and keeps the password when left empty', async () => {
    const update = jest.spyOn(User, 'update').mockResolvedValue([1]);
    jest.spyOn(User, 'findByPk').mockResolvedValue(buildUser({ firstName: 'Johnny' }));
    const response = await request(app)
      .patch('/user/1')
      .set('Authorization', bearer())
      .send({ id: 1, firstName: 'Johnny', password: '' });
    expect(response.statusCode).toBe(200);
    expect(response.body.firstName).toBe('Johnny');
    const [changes, options] = update.mock.calls[0];
    expect(changes).toEqual({ firstName: 'Johnny' });
    expect(options).toMatchObject({ where: { id: '1' }, individualHooks: true });
  });

  it('answers 404 when updating a missing user', async () => {
    jest.spyOn(User, 'update').mockResolvedValue([0]);
    const response = await request(app).put('/user/99').set('Authorization', bearer()).send({ firstName: 'X' });
    expect(response.statusCode).toBe(404);
  });

  it('answers 404 when deleting a missing user', async () => {
    jest.spyOn(User, 'destroy').mockResolvedValue(0);
    const response = await request(app).delete('/user/99').set('Authorization', bearer());
    expect(response.statusCode).toBe(404);
  });
});

describe('User model', () => {
  it('hashes a new password exactly once', async () => {
    const user = buildUser({ password: 'Secret123' });
    await User.runHooks('beforeCreate', user);
    expect(user.password).not.toBe('Secret123');
    expect(await bcrypt.compare('Secret123', user.password)).toBe(true);
    expect(await user.validPassword('Secret123')).toBe(true);
    expect(await user.validPassword('wrong')).toBe(false);
  });

  it('never serialises the password', () => {
    expect(buildUser().toJSON()).not.toHaveProperty('password');
  });
});
