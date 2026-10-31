const request = require('supertest');
const { Op } = require('sequelize');
const app = require('../server');
const { Question } = require('../model');
const { bearer } = require('./helpers/auth');

const sample = {
  id: 100,
  englishQuestion: 'What is the answer to life, the universe, and everything?',
  englishAnswer: '42',
};

describe('Question API', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('GET /question/rand', () => {
    it('is public and returns a random pack', async () => {
      const findAll = jest.spyOn(Question, 'findAll').mockResolvedValue([sample]);
      const response = await request(app).get('/question/rand');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([sample]);
      expect(findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 6 }));
    });

    it('answers 404 when the question bank is empty', async () => {
      jest.spyOn(Question, 'findAll').mockResolvedValue([]);
      const response = await request(app).get('/question/rand');
      expect(response.statusCode).toBe(404);
      expect(response.body.hasError).toBe(true);
    });
  });

  describe('protected endpoints', () => {
    it.each([
      ['get', '/question'],
      ['get', '/question/1'],
      ['post', '/question'],
      ['patch', '/question/1'],
      ['put', '/question/1'],
      ['delete', '/question/1'],
    ])('%s %s requires a token', async (method, url) => {
      const response = await request(app)[method](url);
      expect(response.statusCode).toBe(401);
    });
  });

  it('filters the list only by real columns', async () => {
    const findAll = jest.spyOn(Question, 'findAll').mockResolvedValue([sample]);
    const response = await request(app)
      .get('/question?englishAnswer=42&notAColumn=x')
      .set('Authorization', bearer());
    expect(response.statusCode).toBe(200);
    const { where } = findAll.mock.calls[0][0];
    expect(Object.keys(where)).toEqual(['englishAnswer']);
    expect(where.englishAnswer[Op.like]).toBe('%42%');
  });

  it('creates a question with a server generated id', async () => {
    const create = jest.spyOn(Question, 'create').mockImplementation(async (data) => ({ id: 5, ...data }));
    const response = await request(app)
      .post('/question')
      .set('Authorization', bearer())
      .send({ ...sample, id: 999 });
    expect(response.statusCode).toBe(201);
    expect(create.mock.calls[0][0]).not.toHaveProperty('id');
    expect(response.body.id).toBe(5);
  });

  it('answers 404 when updating a missing question', async () => {
    jest.spyOn(Question, 'findByPk').mockResolvedValue(null);
    const response = await request(app)
      .patch('/question/12345')
      .set('Authorization', bearer())
      .send({ englishAnswer: '1' });
    expect(response.statusCode).toBe(404);
  });

  it('answers 404 for a missing question', async () => {
    jest.spyOn(Question, 'findByPk').mockResolvedValue(null);
    const response = await request(app).get('/question/12345').set('Authorization', bearer());
    expect(response.statusCode).toBe(404);
  });

  it('deletes a question', async () => {
    jest.spyOn(Question, 'destroy').mockResolvedValue(1);
    const response = await request(app).delete('/question/1').set('Authorization', bearer());
    expect(response.statusCode).toBe(204);
  });
});
