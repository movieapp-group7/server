
import { insertTestUser, getToken } from './helpers/test.js';
import { pool } from '../server/helpers/db.js';


const baseUrl = 'http://localhost:3001';

import { expect } from 'chai';


describe('POST register', () => {
    const username = 'loging5';
    const email = 'loging5@foo.com';
    const password = 'loging5foo';
    //need to delete email if exist from database before testing
    before(async () => {
        await pool.query('DELETE FROM account WHERE email = $1', [email]);
    });
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