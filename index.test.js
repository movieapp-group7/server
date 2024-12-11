
import { insertTestUser, getToken } from './helpers/test.js';
import { pool } from '../server/helpers/db.js';


const baseUrl = 'http://localhost:3001';

import { expect } from 'chai';


describe('POST register', () => {
    const username = 'loging6';
    const randomNumber = Math.floor(Math.random() * 10);
    const email = 'loging'+randomNumber+'@foo.com';
    const password = 'loging5foo';

    it ('should register with valid email and password', async() => {
        const response = await fetch (baseUrl+ '/user/register' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': username, 'email': email, 'password': password})
        });

        const data = await response.json();
        
        expect(response.status).to.equal(201,data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email');
    })

});

  
  

describe('POST login', () => {
    const username = 'post';
    const email = 'post@foo.com'
    const password = 'post123'
    before(async () => {
        await pool.query('DELETE FROM account WHERE email = $1', [email]);
        await insertTestUser(username,email, password);
    });
    it ('should login with valid email and password', async() => {
        const response = await fetch (baseUrl+ '/user/login' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': username,'email': email, 'password': password})
        });

        const data = await response.json();
        
        expect(response.status).to.equal(200,data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    })
})




describe('POST logout', () => {
    const username = 'logoutUser';
    const email = 'logout@foo.com';
    const password = 'logout123';
    let token; 

    before(async () => {
        
        await pool.query('DELETE FROM account WHERE email = $1', [email]);
        await insertTestUser(username, email, password);

     
        const response = await fetch(baseUrl + '/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        token = data.token; 
    });

    it('should log out successfully', async () => {
        const response = await fetch(baseUrl + '/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data.message).to.equal('Successfully logged out');
    });
});

describe('DELETE /user/delete', () => {
    let userId;

    // Insert a test user before the tests
    before(async () => {
        const username = 'testUser';
        const email = 'testuser@foo.com';
        const password = 'testpassword123';

        // Insert the test user and capture the `id`
        const result = await insertTestUser(username, email, password);
        userId = result.rows[0].id; // Ensure this is correctly returned
    });

    it('should delete a user successfully with a valid ID', async () => {
        // Make the DELETE request with the user's ID
        const response = await fetch(baseUrl + '/user/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId }), // Include the `id` in the request body
        });

        const data = await response.json();

        // Assertions
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data.message).to.equal('User account successfully deleted');
    });
});
