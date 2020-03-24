const request = require('supertest');
const app = require('../app.js');

describe('Test the directions path', () => {
  test('It should response with directions for the GET method', async () => {
    const response = await request(app)
      .get('/')
      .query({
        startingPoint: 'Disneyland',
        destination: 'Universal+Studios+Hollywood'
      });
    expect(response.statusCode).toBe(200);
  });
});
