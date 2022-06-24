import request from 'supertest';

import app from '../app';

describe('Get Endpoint', () => {
  it('Endpoint fails without query parameters', async() => {
    const response = await request(app).get('/pr/');

    expect(response.statusCode).toEqual(404);

  }),

  it('Nominal response has expected characeristics', async () => {

    const response = await request(app).get('/pr/?owner=freeCodeCamp&repo=freeCodeCamp');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(5);

    for (let element of response.body) {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('number');
      expect(element).toHaveProperty('title');
      expect(element).toHaveProperty('author');
      expect(element).toHaveProperty('commitCount');
    }
  })
})
  