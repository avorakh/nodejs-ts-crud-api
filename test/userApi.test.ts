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

  const newUsername = 'John';
  const newAge = 69;
  const emptyHobbies: string[] = [];

  let server: http.Server;
  let createdUserId: string;

  beforeAll((done) => {
    server = createServer(requestListener);
    server.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('should return OK status code and an empty array on a GET api/users request', (done) => {
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

  test('should return CREATED and the created User object on a POST api/users request', (done) => {

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


  test('should return BAD REQUEST and the created User object on a POST api/users request', (done) => {

    const invalidUpdatedData = JSON.stringify({
      username: testUsername
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(invalidUpdatedData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(400);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });
    req.write(invalidUpdatedData);
    req.end();
  });


  test('should return OK and the found User object on a GET api/users request', (done) => {
    http.get(`http://localhost:${PORT}/api/users`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        const responseData = JSON.parse(data);
        console.error(responseData)
        expect(responseData.length).toBe(1);
        done();
      });
    });
  });

  test('should return OK and the found User object on a GET api/users/{userId} request', (done) => {
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


  test('should return BAD REQUEST a PUT api/users/{userId} request', (done) => {
    const invalidUpdatedData = JSON.stringify({
      username: newUsername,
      hobbies: emptyHobbies,
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api/users/${createdUserId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(invalidUpdatedData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(400);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });
    req.write(invalidUpdatedData);
    req.end();
  });

  test('should return OK and an updated user object on a PUT api/users/{userId} request', (done) => {
    const updatedData = JSON.stringify({
      username: newUsername,
      age: newAge,
      hobbies: emptyHobbies,
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api/users/${createdUserId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updatedData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        const response = JSON.parse(data);
        expect(response.id).toBe(createdUserId);
        expect(response.username).toBe(newUsername);
        expect(response.age).toBe(newAge);
        expect(response.hobbies).toEqual(emptyHobbies);
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });
    req.write(updatedData);
    req.end();
  });


  test('should return NO CONTENT on a DELETE api/users/{userId} request', (done) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api/users/${createdUserId}`,
      method: 'DELETE',
    };

    const req = http.request(options, (res) => {
      expect(res.statusCode).toBe(204);
      done();
    });

    req.on('error', (e) => {
      done(e);
    });

    req.end();
  });

  test('should return NOT FOUND on a GET api/users/{userId} request', (done) => {
    http.get(`http://localhost:${PORT}/api/users/${createdUserId}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(404);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });
  });

  test('should return NOT FOUND on a DELETE api/users/{userId} request', (done) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api/users/${createdUserId}`,
      method: 'DELETE',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(404);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });

    req.end();
  });


  test('should return BAD REQUEST on a GET api/users/invalid request', (done) => {
    http.get(`http://localhost:${PORT}/api/users/invalid`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(400);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });
  });

  test('should return BAD REQUEST on a DELETE api/users/invalid request', (done) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api/users/invalid`,
      method: 'DELETE',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(400);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });

    req.end();
  });

  test('should return NOT FOUND on a GET invalid/path request', (done) => {
    http.get(`http://localhost:${PORT}/invalid/path`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(404);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });
  });

  test('should return NOT FOUND a PUT api/users/{userId} request', (done) => {
    const updatedData = JSON.stringify({
      username: newUsername,
      age: newAge,
      hobbies: emptyHobbies,
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api/users/${createdUserId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updatedData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(404);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });
    req.write(updatedData);
    req.end();
  });



  test('should return BAD REQUEST a PUT api/users/invalid request', (done) => {
    const updatedData = JSON.stringify({
      username: newUsername,
      age: newAge,
      hobbies: emptyHobbies,
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: "/api/users/invalid",
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updatedData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(400);
        const response = JSON.parse(data);
        expect(response).toHaveProperty('error');
        done();
      });
    });

    req.on('error', (e) => {
      done(e);
    });
    req.write(updatedData);
    req.end();
  });
});