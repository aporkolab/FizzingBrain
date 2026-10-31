const authenticate = require('../model/auth/authenticate');
const { tokenFor } = require('./helpers/auth');

const run = (authorization) => {
  const req = { headers: authorization ? { authorization } : {} };
  const next = jest.fn();
  authenticate(req, {}, next);
  return { req, error: next.mock.calls[0][0] };
};

describe('authenticate middleware', () => {
  it('rejects a request without a token', () => {
    const { error } = run();
    expect(error.status).toBe(401);
  });

  it('rejects a non bearer authorization header', () => {
    const { error } = run('Basic YWRtaW46c2VjcmV0');
    expect(error.status).toBe(401);
  });

  it('rejects a token signed with another secret', () => {
    const jwt = require('jsonwebtoken');
    const { error } = run(`Bearer ${jwt.sign({ id: 1 }, 'someone-elses-secret')}`);
    expect(error.status).toBe(401);
  });

  it('rejects an expired token', () => {
    const { error } = run(`Bearer ${tokenFor({ id: 1 }, { expiresIn: -10 })}`);
    expect(error.status).toBe(401);
  });

  it('accepts a valid token and exposes its payload', () => {
    const { req, error } = run(`Bearer ${tokenFor({ id: 7, email: 'a@b.hu' })}`);
    expect(error).toBeUndefined();
    expect(req.user).toMatchObject({ id: 7, email: 'a@b.hu' });
  });
});
