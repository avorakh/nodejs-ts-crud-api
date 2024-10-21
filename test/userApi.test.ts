import http from 'http';

import { createServer } from "http";
import dotenv from "dotenv";
import { requestListener } from "../src/configuration/app_config";

dotenv.config();

const PORT = process.env.PORT || 4000;

describe('User API', () => {
  const testUsername = 'John Doe';
  const testAge = 30;
  const testHobbies = ['reading', 'gaming'];

  let server: http.Server;
  let createdUserId : string;

  beforeAll((done) => {
    server = createServer(requestListener);
    server.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Get all records with a GET api/users request (an empty array is expected)', (done) => {
    http.get(`http://localhost:${PORT}/api/users`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(data)).toEqual([]);
        done();
      });
    });
  });

  test('A new object is created by a POST api/users request (a response containing newly created record is expected)', (done) => {
   
    const postData = JSON.stringify({
      username: testUsername,
      age: 30,
      hobbies: ['reading', 'gaming'],
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(201);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('id');
        expect(response.username).toBe(testUsername);
        expect(response.age).toBe(testAge);
        expect(response.hobbies).toEqual(['reading', 'gaming']);
        createdUserId = response.id; 
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });

    req.write(postData);
    req.end();
  });

  test('Get the created user by ID with a GET api/users/{userId} request', (done) => {
    http.get(`http://localhost:${PORT}/api/users/${createdUserId}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        const user = JSON.parse(data);
        expect(user.id).toBe(createdUserId);
        expect(user.username).toBe(testUsername);
        expect(user.age).toBe(testAge);
        expect(user.hobbies).toEqual(testHobbies);
        done();
      });
    });
  });
});